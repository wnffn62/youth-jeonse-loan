#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""청년 전세대출 제도 변경 감지·반영기.

설계 원칙
    감지는 전량 자동으로 수행하고, 반영은 계층별로 게이트를 다르게 둔다.
    금리·소득요건처럼 오판이 금전 피해로 이어지는 값은 사람 확정을 거친다.

계층
    A(auto)   공개 API 응답. 스키마가 고정돼 있어 자동 반영한다.
    B(review) 공식 HTML 고시. 변경을 감지해 보고서를 만들고, 반영은 확정 대기로 둔다.
    C(signal) 보도자료 목록. 키워드가 걸린 새 글만 알린다.

사용
    python tools/update_policies.py --init      최초 스냅샷 생성
    python tools/update_policies.py --check     변경 감지 후 보고서 생성
    python tools/update_policies.py --apply     A계층 자동 반영까지 수행
"""
from __future__ import annotations

import argparse
import datetime as dt
import difflib
import hashlib
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
WORK = ROOT / "_work"
SNAP = DATA / "snapshots"   # git 추적 대상
REPORTS = WORK / "reports"

SOURCES_FILE = DATA / "sources.json"
POLICIES_FILE = DATA / "policies.json"
POLICIES_JS = DATA / "policies.js"
STATE_FILE = WORK / "state.json"

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0 Safari/537.36")
TIMEOUT = 25


# ---------------------------------------------------------------- 공통

def today() -> str:
    return dt.date.today().isoformat()


def now() -> str:
    return dt.datetime.now().strftime("%Y-%m-%d %H:%M")


def load_json(path: Path, default):
    if not path.exists():
        return default
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def save_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
    tmp.replace(path)


def digest(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


def normalize(text: str) -> str:
    """비교용 정규화. 공백·전각문자·조회시각 같은 잡음을 제거한다."""
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"\d{4}[-./]\d{1,2}[-./]\d{1,2}[^\n]{0,12}(현재|기준|조회)", "<일자>", text)
    text = re.sub(r"[ \t ]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


# ---------------------------------------------------------------- 수집

def fetch(source: dict):
    """(본문, 오류) 를 돌려준다. 실패를 예외로 던지지 않는다."""
    url = source["url"]
    params = dict(source.get("params") or {})
    for key, env in (source.get("auth_params") or {}).items():
        token = os.environ.get(env)
        if not token:
            return None, "환경변수 %s 미설정" % env
        params[key] = token
    try:
        res = requests.get(url, params=params or None, timeout=TIMEOUT,
                           headers={"User-Agent": UA},
                           verify=source.get("verify_tls", True))
    except requests.RequestException as exc:
        return None, "요청 실패: %s" % type(exc).__name__
    if res.status_code != 200:
        return None, "HTTP %s" % res.status_code
    res.encoding = res.apparent_encoding or res.encoding
    return res.text, None


def extract(source: dict, raw: str) -> str:
    """감시 대상 영역만 잘라낸다. 페이지 전체를 비교하면 배너로 오탐이 난다."""
    kind = source.get("type", "html")
    if kind == "api":
        try:
            return json.dumps(json.loads(raw), ensure_ascii=False, indent=1, sort_keys=True)
        except json.JSONDecodeError:
            return raw
    soup = BeautifulSoup(raw, "html.parser")
    for tag in soup(["script", "style", "noscript", "iframe"]):
        tag.decompose()
    selector = source.get("selector")
    if selector:
        nodes = soup.select(selector)
        if nodes:
            return "\n".join(n.get_text("\n", strip=True) for n in nodes)
    keywords = source.get("keywords") or []
    if keywords:
        lines = [ln.strip() for ln in soup.get_text("\n").splitlines() if ln.strip()]
        hit = [ln for ln in lines if any(k in ln for k in keywords)]
        if hit:
            return "\n".join(hit)
    return soup.get_text("\n", strip=True)


# ---------------------------------------------------------------- 비교

def compare(source: dict) -> dict:
    sid = source["id"]
    result = {
        "id": sid,
        "name": source.get("name", sid),
        "tier": source.get("tier", "review"),
        "url": source["url"],
        "checked_at": now(),
    }
    raw, err = fetch(source)
    if err:
        result.update(status="FETCH_FAIL", detail=err)
        return result

    current = normalize(extract(source, raw))
    if not current:
        result.update(status="EMPTY",
                      detail="감시 영역에서 본문을 얻지 못했다. selector 점검 필요")
        return result

    snap_path = SNAP / ("%s.txt" % sid)
    result["hash"] = digest(current)

    if not snap_path.exists():
        snap_path.parent.mkdir(parents=True, exist_ok=True)
        snap_path.write_text(current, encoding="utf-8")
        result.update(status="NEW", detail="최초 스냅샷 생성")
        return result

    previous = snap_path.read_text(encoding="utf-8")
    if digest(previous) == result["hash"]:
        result.update(status="UNCHANGED")
        return result

    diff = list(difflib.unified_diff(
        previous.splitlines(), current.splitlines(),
        fromfile="이전", tofile="현재", lineterm="", n=1))
    added = [l[1:].strip() for l in diff if l.startswith("+") and not l.startswith("+++")]
    removed = [l[1:].strip() for l in diff if l.startswith("-") and not l.startswith("---")]

    result.update(
        status="CHANGED",
        added=added[:40],
        removed=removed[:40],
        diff_lines=len(added) + len(removed),
        rate_touched=bool(re.search(r"\d+\.\d+\s*%|연\s*\d", "\n".join(added + removed))),
    )
    snap_path.write_text(current, encoding="utf-8")
    return result


# ---------------------------------------------------------------- 반영

def apply_auto(findings, policies):
    """A계층만 반영한다. B·C계층은 확정 대기로 적재한다."""
    applied = []
    pending = policies.setdefault("pending_review", [])
    known = set(p.get("source_id") for p in pending if p.get("status") == "확정대기")
    for item in findings:
        if item["status"] != "CHANGED":
            continue
        if item["tier"] == "auto":
            policies.setdefault("auto_feed", {})[item["id"]] = {
                "hash": item["hash"],
                "synced_at": item["checked_at"],
                "url": item["url"],
            }
            applied.append(item["name"])
        elif item["id"] not in known:
            pending.append({
                "source_id": item["id"],
                "name": item["name"],
                "url": item["url"],
                "detected_at": item["checked_at"],
                "rate_touched": item.get("rate_touched", False),
                "added": item.get("added", [])[:12],
                "status": "확정대기",
            })
    return applied


def emit_js(policies) -> None:
    """index.html 이 file:// 에서도 읽도록 스크립트 형태로 함께 내보낸다."""
    body = json.dumps(policies, ensure_ascii=False, indent=2)
    POLICIES_JS.write_text(
        "/* 자동 생성 파일. data/policies.json 을 고치고 update_policies.py 를 실행한다. */\n"
        "window.POLICY_DATA = %s;\n" % body, encoding="utf-8")


# ---------------------------------------------------------------- 보고

def write_report(findings, applied, policies) -> Path:
    REPORTS.mkdir(parents=True, exist_ok=True)
    path = REPORTS / ("변경감지_%s.html" % dt.datetime.now().strftime("%Y%m%d_%H%M"))
    bucket = dict((k, [f for f in findings if f["status"] == k])
                  for k in ("CHANGED", "FETCH_FAIL", "EMPTY", "NEW", "UNCHANGED"))

    def rows(items):
        out = []
        for f in items:
            extra = ""
            if f.get("added"):
                lines = "<br>".join(x[:120] for x in f["added"][:8])
                extra = "<div class='d'>%s</div>" % lines
            flag = " <span class=k>수치 변동</span>" if f.get("rate_touched") else ""
            out.append(
                "<tr><td>%s%s</td><td>%s</td><td>%s%s</td>"
                "<td><a href='%s'>원문</a></td></tr>"
                % (f["name"], flag, f["tier"], f.get("detail", ""), extra, f["url"]))
        return "\n".join(out) or "<tr><td colspan=4>해당 없음</td></tr>"

    pending_rows = "".join(
        "<tr><td>%s</td><td>%s</td><td>%s</td><td><a href='%s'>원문</a></td></tr>"
        % (p["name"], p["detected_at"], "예" if p.get("rate_touched") else "아니오", p["url"])
        for p in policies.get("pending_review", []) if p.get("status") == "확정대기"
    ) or "<tr><td colspan=4>없음</td></tr>"

    html = """<!doctype html><html lang=ko><meta charset=utf-8>
<title>청년 전세대출 제도 변경 감지</title>
<style>
body{font-family:'맑은 고딕',sans-serif;margin:32px;color:#111;line-height:1.6}
h1{font-size:20px} h2{font-size:15px;margin-top:28px;border-bottom:1px solid #999;padding-bottom:4px}
table{border-collapse:collapse;width:100%;font-size:13px}
td,th{border:1px solid #bbb;padding:6px 8px;vertical-align:top}
th{background:#d9d9d9;text-align:left}
.d{color:#444;font-size:12px;margin-top:6px;padding-left:8px;border-left:2px solid #bbb}
.k{color:#B03A2E;font-weight:bold}
</style>
<h1>청년 전세대출 제도 변경 감지</h1>
<p>점검 시각 __NOW__ · 감시 출처 __TOTAL__건 · 변경 <span class=k>__CHANGED__</span>건 ·
수집 실패 __FAILED__건</p>

<h2>변경 감지</h2>
<table><tr><th>출처</th><th>계층</th><th>변경 내용</th><th>확인</th></tr>__ROWS_CHANGED__</table>

<h2>자동 반영</h2>
<p>__APPLIED__</p>

<h2>확정 대기</h2>
<table><tr><th>출처</th><th>감지일</th><th>수치 변동</th><th>확인</th></tr>__PENDING__</table>

<h2>수집 실패</h2>
<table><tr><th>출처</th><th>계층</th><th>사유</th><th>확인</th></tr>__ROWS_FAIL__</table>

<h2>변동 없음</h2>
<p>__UNCHANGED__</p>
</html>"""

    html = (html
            .replace("__NOW__", now())
            .replace("__TOTAL__", str(len(findings)))
            .replace("__CHANGED__", str(len(bucket["CHANGED"])))
            .replace("__FAILED__", str(len(bucket["FETCH_FAIL"]) + len(bucket["EMPTY"])))
            .replace("__ROWS_CHANGED__", rows(bucket["CHANGED"]))
            .replace("__APPLIED__", " · ".join(applied) if applied else "자동 반영 대상 없음")
            .replace("__PENDING__", pending_rows)
            .replace("__ROWS_FAIL__", rows(bucket["FETCH_FAIL"] + bucket["EMPTY"]))
            .replace("__UNCHANGED__", "%d건" % len(bucket["UNCHANGED"])))
    path.write_text(html, encoding="utf-8")
    return path


# ---------------------------------------------------------------- 진입점

def main() -> int:
    ap = argparse.ArgumentParser(description="청년 전세대출 제도 변경 감지·반영")
    ap.add_argument("--init", action="store_true", help="최초 스냅샷만 생성")
    ap.add_argument("--check", action="store_true", help="변경 감지 후 보고서 생성")
    ap.add_argument("--apply", action="store_true", help="감지 후 A계층 자동 반영")
    ap.add_argument("--open", action="store_true", help="보고서를 바로 연다")
    args = ap.parse_args()
    if not (args.init or args.check or args.apply):
        args.check = True

    sources = load_json(SOURCES_FILE, {}).get("sources", [])
    if not sources:
        sys.stderr.write("감시 출처가 없다: %s\n" % SOURCES_FILE)
        return 2

    label = {"CHANGED": "변경", "UNCHANGED": "동일", "NEW": "신규",
             "FETCH_FAIL": "실패", "EMPTY": "빈본문"}
    findings = []
    for src in sources:
        if not src.get("enabled", True):
            continue
        item = compare(src)
        findings.append(item)
        print("[%s] %s  %s" % (label[item["status"]], item["name"], item.get("detail", "")))

    policies = load_json(POLICIES_FILE, {})
    applied = []
    if args.apply:
        applied = apply_auto(findings, policies)
    if policies:
        policies["last_checked"] = now()
        save_json(POLICIES_FILE, policies)
        emit_js(policies)

    save_json(STATE_FILE, {"checked_at": now(), "findings": findings})
    report = write_report(findings, applied, policies)
    print("\n보고서 %s" % report)
    if args.open:
        os.startfile(report)  # noqa: S606

    changed = sum(1 for f in findings if f["status"] == "CHANGED")
    failed = sum(1 for f in findings if f["status"] in ("FETCH_FAIL", "EMPTY"))
    print("변경 %d건 · 실패 %d건" % (changed, failed))
    return 1 if changed else 0


if __name__ == "__main__":
    sys.exit(main())
