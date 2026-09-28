#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""추출된 제도 수치를 안전장치 4종을 통과시킨 뒤 자동 반영한다.

사람 확인을 대체하는 장치다. 사람이 통과 버튼만 누르는 게이트보다
아래 4종이 실제로 더 많은 오류를 잡는다.

  1 교차검증   같은 수치가 독립 출처 2곳 이상에서 일치해야 한다
  2 앵커검사   페이지가 불변 라벨을 그대로 포함해야 한다. 사라지면 추출기가 깨진 것으로 본다
  3 변동폭     금리가 이전 값 대비 한계치를 넘게 튀면 거부한다
  4 사후검증   반영 뒤 정합성 검사를 돌리고, 실패하면 즉시 되돌린다

입력 형식 (tools/_extracted.json)
    {
      "extracted_at": "2026-09-28",
      "products": [
        {
          "id": "beotimmok_youth",
          "sources_agreeing": ["https://...", "https://..."],
          "anchors_found": ["부부합산 연소득", "순자산", "전용면적"],
          "rate_table": [ {"income_max": 2000, "rate": 1.8, "label": "..."} ],
          "limit": {"max": 20000, "deposit_ratio": 0.8},
          "rules": [ ... ],
          "status": "운영중",
          "asof": "2026-09-28"
        }
      ]
    }

사용
    python tools/apply_extraction.py --input tools/_extracted.json
    python tools/apply_extraction.py --input tools/_extracted.json --dry-run
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
POLICIES = DATA / "policies.json"
POLICIES_JS = DATA / "policies.js"
BACKUP_DIR = DATA / "_backup"
LOG = ROOT / "_work" / "적용이력.jsonl"

# 안전장치 기본값. policies.json 의 guards 로 상품별 재정의가 가능하다.
DEFAULTS = {
    "min_sources": 2,        # 교차검증에 필요한 독립 출처 수
    "max_rate_delta": 1.0,   # 금리 최대 허용 변동폭 (%p)
    "max_limit_delta": 0.30, # 한도 최대 허용 변동률
    "max_rows_delta": 2,     # 금리표 행 수 최대 허용 증감
}


def now() -> str:
    return dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def load(path: Path, default=None):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def save(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)


def log_event(payload: dict) -> None:
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(dict(payload, at=now()), ensure_ascii=False) + "\n")


def guards_for(product: dict) -> dict:
    g = dict(DEFAULTS)
    g.update(product.get("guards") or {})
    return g


# ------------------------------------------------------------- 안전장치

def gate_sources(cand: dict, g: dict):
    """1 교차검증. 독립 출처 수가 모자라면 반영하지 않는다."""
    urls = [u for u in (cand.get("sources_agreeing") or []) if u]
    hosts = set()
    for u in urls:
        part = u.split("//")[-1].split("/")[0].lower()
        hosts.add(part)
    if len(hosts) < g["min_sources"]:
        return False, "독립 출처 %d곳으로 기준 %d곳에 못 미친다" % (len(hosts), g["min_sources"])
    return True, "독립 출처 %d곳 일치" % len(hosts)


def gate_anchors(cand: dict, current: dict):
    """2 앵커검사. 불변 라벨이 사라지면 추출기가 깨진 것으로 판정한다."""
    required = current.get("anchors") or []
    if not required:
        return True, "앵커 미지정"
    found = set(cand.get("anchors_found") or [])
    missing = [a for a in required if a not in found]
    if missing:
        return False, "앵커 누락 %s — 추출기 점검 필요" % ", ".join(missing[:4])
    return True, "앵커 %d개 확인" % len(required)


def gate_delta(cand: dict, current: dict, g: dict):
    """3 변동폭. 정상적인 제도 개정은 보통 0.1~0.5%p 안에서 움직인다."""
    old_rows = current.get("rate_table") or []
    new_rows = cand.get("rate_table") or []
    if not new_rows:
        return False, "금리표가 비어 있다"

    if old_rows and abs(len(new_rows) - len(old_rows)) > g["max_rows_delta"]:
        return False, "금리표 행 수가 %d→%d 로 바뀌었다. 표 구조 변경 의심" % (len(old_rows), len(new_rows))

    for r in new_rows:
        rate = r.get("rate")
        if not isinstance(rate, (int, float)) or not (0 < rate < 20):
            return False, "금리 %r 이 상식 범위를 벗어난다" % rate

    if old_rows:
        def key(row):
            return (row.get("income_max"), row.get("deposit_max"), row.get("region"))
        old_map = dict((key(r), r.get("rate")) for r in old_rows)
        for r in new_rows:
            prev = old_map.get(key(r))
            if prev is None:
                continue
            gap = abs(r["rate"] - prev)
            if gap > g["max_rate_delta"]:
                return False, ("금리가 %.2f%% → %.2f%% 로 %.2f%%p 움직였다. "
                               "허용치 %.2f%%p 초과" % (prev, r["rate"], gap, g["max_rate_delta"]))

    old_limit = (current.get("limit") or {}).get("max")
    new_limit = (cand.get("limit") or {}).get("max")
    if old_limit and new_limit:
        rel = abs(new_limit - old_limit) / float(old_limit)
        if rel > g["max_limit_delta"]:
            return False, "한도가 %s → %s 로 %.0f%% 변했다. 허용치 %.0f%% 초과" % (
                old_limit, new_limit, rel * 100, g["max_limit_delta"] * 100)

    return True, "변동폭 정상"


def run_validator():
    """4 사후검증."""
    proc = subprocess.run(
        [sys.executable, str(ROOT / "tools" / "validate_data.py")],
        capture_output=True, text=True, encoding="utf-8", errors="replace")
    return proc.returncode, (proc.stdout or "") + (proc.stderr or "")


# ------------------------------------------------------------- 반영

def merge(current: dict, cand: dict) -> dict:
    """확인된 필드만 덮어쓴다. 추출기가 못 읽은 필드는 기존 값을 유지한다."""
    out = dict(current)
    for field in ("rate_table", "limit", "rules", "discounts", "status",
                  "term", "guarantee", "channel", "docs", "caveats"):
        if cand.get(field):
            out[field] = cand[field]
    src = dict(out.get("source") or {})
    if cand.get("asof"):
        src["asof"] = cand["asof"]
    src["confidence"] = "auto_crosschecked"
    src["verified_sources"] = cand.get("sources_agreeing") or []
    out["source"] = src
    return out


def emit_js(policies: dict) -> None:
    POLICIES_JS.write_text(
        "/* 자동 생성 파일. policies.json 을 고치고 update_policies.py 를 실행한다. */\n"
        "window.POLICY_DATA = %s;\n" % json.dumps(policies, ensure_ascii=False, indent=2),
        encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description="추출 결과 자동 반영")
    ap.add_argument("--input", required=True, help="추출 결과 JSON 경로")
    ap.add_argument("--dry-run", action="store_true", help="검사만 하고 저장하지 않는다")
    args = ap.parse_args()

    extraction = load(Path(args.input))
    if not extraction:
        print("추출 파일을 읽지 못했다: %s" % args.input)
        return 2

    policies = load(POLICIES)
    if not policies:
        print("정본이 없다: %s" % POLICIES)
        return 2

    by_id = dict((p.get("id"), p) for p in policies.get("products") or [])
    applied, held = [], []

    for cand in extraction.get("products") or []:
        pid = cand.get("id")
        current = by_id.get(pid)
        if not current:
            held.append((pid, "정본에 없는 상품이다. 신규 상품은 사람이 등록한다"))
            continue

        g = guards_for(current)
        checks = [
            ("교차검증", gate_sources(cand, g)),
            ("앵커검사", gate_anchors(cand, current)),
            ("변동폭", gate_delta(cand, current, g)),
        ]
        failed = [(n, why) for n, (ok, why) in checks if not ok]
        if failed:
            reason = " / ".join("%s: %s" % (n, w) for n, w in failed)
            held.append((pid, reason))
            log_event({"product": pid, "result": "보류", "reason": reason})
            continue

        merged = merge(current, cand)
        changed = json.dumps(merged, sort_keys=True, ensure_ascii=False) != \
                  json.dumps(current, sort_keys=True, ensure_ascii=False)
        if not changed:
            continue
        idx = policies["products"].index(current)
        policies["products"][idx] = merged
        by_id[pid] = merged
        applied.append((pid, " / ".join("%s %s" % (n, w) for n, (ok, w) in checks)))

    if not applied and not held:
        print("반영할 변경이 없다.")
        return 0

    if args.dry_run:
        print("[모의 실행] 반영 예정 %d건 · 보류 %d건" % (len(applied), len(held)))
    else:
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        stamp = dt.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup = BACKUP_DIR / ("policies.%s.json" % stamp)
        shutil.copy2(POLICIES, backup)

        policies["asof"] = extraction.get("extracted_at") or policies.get("asof")
        policies["last_auto_applied"] = now()
        save(POLICIES, policies)
        emit_js(policies)

        code, out = run_validator()
        if code >= 2:
            shutil.copy2(backup, POLICIES)
            emit_js(load(POLICIES))
            print("사후검증 실패. 직전 버전으로 되돌렸다.\n%s" % out[-1500:])
            log_event({"result": "롤백", "detail": out[-800:], "backup": backup.name})
            return 2
        log_event({"result": "반영", "products": [p for p, _ in applied],
                   "held": [p for p, _ in held], "backup": backup.name})

    print("반영 %d건" % len(applied))
    for pid, why in applied:
        print("  [반영] %s — %s" % (pid, why))
    print("보류 %d건" % len(held))
    for pid, why in held:
        print("  [보류] %s — %s" % (pid, why))
    if held:
        print("\n보류 건은 원문 구조가 바뀌었을 가능성이 높다. 추출 규칙을 점검하라.")
    return 1 if held else 0


if __name__ == "__main__":
    sys.exit(main())
