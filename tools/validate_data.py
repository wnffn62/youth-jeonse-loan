#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""policies.json 정합성 검사.

화면에 잘못된 금리·한도가 나가는 것을 배포 전에 막는다.
update_policies.py 가 데이터를 건드린 뒤, 그리고 외부 배포 직전에 실행한다.

사용
    python tools/validate_data.py
    종료코드 0 통과 · 1 경고 · 2 오류
"""
from __future__ import annotations

import datetime as dt
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POLICIES = ROOT / "data" / "policies.json"

# index.html 의 규칙 엔진이 지원하는 연산자
OPS = {"gte", "lte", "lt", "gt", "eq", "between", "in", "notIn", "truthy", "falsy"}
# 규칙이 참조할 수 있는 입력 필드
FIELDS = {
    "age", "marital", "income", "spouse", "householdIncome", "employment", "tenure",
    "credit", "assets", "region", "area", "deposit", "ownFund", "monthly", "need",
    "household", "noHome", "firstTime", "subscription", "delinquent", "hasIncomeProof",
}
REGIONS = {"seoul", "metro", "metro_city", "other"}

errors: list[str] = []
warns: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warns.append(msg)


def check_rule(where: str, rule: dict) -> None:
    field, op = rule.get("field"), rule.get("op")
    if field not in FIELDS:
        err("%s 규칙의 field '%s' 는 엔진이 모르는 항목이다" % (where, field))
    if op not in OPS:
        err("%s 규칙의 op '%s' 는 엔진이 모르는 연산자다" % (where, op))
    if not rule.get("label"):
        err("%s 규칙에 label 이 없다. 화면에 탈락 사유를 표시할 수 없다" % where)
    val = rule.get("value")
    if op == "between":
        if not (isinstance(val, list) and len(val) == 2 and val[0] <= val[1]):
            err("%s between 규칙의 value 가 [하한, 상한] 형태가 아니다: %r" % (where, val))
    elif op in ("in", "notIn"):
        if not isinstance(val, list) or not val:
            err("%s %s 규칙의 value 가 비어 있지 않은 배열이어야 한다" % (where, op))
    elif op in ("truthy", "falsy"):
        pass
    elif val is None:
        err("%s %s 규칙에 value 가 없다" % (where, op))


def check_product(p: dict, idx: int) -> None:
    name = p.get("name") or "이름없음#%d" % idx
    for key in ("id", "name", "operator"):
        if not p.get(key):
            err("[%s] 필수 항목 %s 가 비어 있다" % (name, key))

    src = p.get("source") or {}
    if not src.get("url"):
        err("[%s] source.url 이 없다. 출처 없는 수치는 화면에 낼 수 없다" % name)
    if not src.get("asof"):
        err("[%s] source.asof 기준일이 없다" % name)
    if src.get("confidence") == "unverified":
        warn("[%s] 미확인 출처다. 화면에 「미확인」으로 표시된다" % name)

    for i, r in enumerate(p.get("rules") or []):
        check_rule("[%s] 규칙#%d" % (name, i), r)

    rows = p.get("rate_table") or []
    if not rows:
        err("[%s] rate_table 이 비어 있다. 금리를 계산할 수 없다" % name)
    for i, r in enumerate(rows):
        rate = r.get("rate")
        if not isinstance(rate, (int, float)):
            err("[%s] 금리행#%d 의 rate 가 숫자가 아니다: %r" % (name, i, rate))
            continue
        if not (0 < rate < 20):
            err("[%s] 금리행#%d 의 rate %.2f%% 가 상식 범위를 벗어난다" % (name, i, rate))
        hi = r.get("rate_max")
        if hi is not None and hi < rate:
            err("[%s] 금리행#%d 의 rate_max(%.2f) 가 rate(%.2f) 보다 작다" % (name, i, hi, rate))
        if r.get("region") is not None and r["region"] not in REGIONS:
            err("[%s] 금리행#%d 의 region '%s' 이 정의되지 않았다" % (name, i, r["region"]))
        for reg in (r.get("regions") or []):
            if reg not in REGIONS:
                err("[%s] 금리행#%d 의 regions 에 정의되지 않은 '%s' 가 있다" % (name, i, reg))
        if r.get("income_max") is not None and r.get("income_min") is not None:
            if r["income_max"] < r["income_min"]:
                err("[%s] 금리행#%d 의 소득 구간이 뒤집혔다" % (name, i))

    lim = p.get("limit") or {}
    if not lim:
        err("[%s] limit 이 없다. 한도를 계산할 수 없다" % name)
    ratio = lim.get("deposit_ratio")
    if ratio is not None and not (0 < ratio <= 1):
        err("[%s] limit.deposit_ratio %r 이 0~1 범위를 벗어난다" % (name, ratio))
    for key in ("max",):
        if lim.get(key) is not None and lim[key] <= 0:
            err("[%s] limit.%s 가 0 이하다" % (name, key))
    by_region = lim.get("max_by_region") or {}
    for reg in by_region:
        if reg not in REGIONS:
            err("[%s] limit.max_by_region 의 '%s' 이 정의되지 않은 지역이다" % (name, reg))

    for i, d in enumerate(p.get("discounts") or []):
        if not d.get("label") or not d.get("amount"):
            err("[%s] 우대금리#%d 에 label 또는 amount 가 없다" % (name, i))
        if d.get("when"):
            check_rule("[%s] 우대금리#%d 조건" % (name, i), dict(d["when"], label=d.get("label")))

    status = p.get("status")
    known = ("운영중", "미확인", "신규 취급 중단", "당해연도 접수 종료")
    if status and status not in known and "일몰" not in status and "종료" not in status:
        warn("[%s] status '%s' 가 표준 표기가 아니다" % (name, status))
    if status and ("종료" in status):
        warn("[%s] 데이터가 종료된 상품을 포함한다. 화면 노출 여부를 확인하라" % name)


def main() -> int:
    if not POLICIES.exists():
        print("데이터 파일이 없다: %s" % POLICIES)
        return 2
    try:
        data = json.loads(POLICIES.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print("JSON 파싱 실패: %s" % exc)
        return 2

    if not data.get("asof"):
        err("최상위 asof 기준일이 없다")
    else:
        try:
            gap = (dt.date.today() - dt.date.fromisoformat(data["asof"])).days
            if gap > data.get("stale_days", 90):
                warn("기준일이 %d일 지났다. 원문 재확인이 필요하다" % gap)
        except ValueError:
            err("asof '%s' 가 YYYY-MM-DD 형식이 아니다" % data["asof"])

    products = data.get("products") or []
    if not products:
        err("products 가 비어 있다")

    seen = set()
    for i, p in enumerate(products):
        pid = p.get("id")
        if pid in seen:
            err("id '%s' 가 중복됐다" % pid)
        seen.add(pid)
        check_product(p, i)

    print("상품 %d건 검사" % len(products))
    for w in warns:
        print("  [경고] %s" % w)
    for e in errors:
        print("  [오류] %s" % e)

    if errors:
        print("\n오류 %d건. 배포하지 말 것." % len(errors))
        return 2
    if warns:
        print("\n경고 %d건. 내용 확인 후 배포 가능." % len(warns))
        return 1
    print("\n정합성 검사 통과.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
