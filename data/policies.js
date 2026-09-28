/* 자동 생성 파일. data/policies.json 을 고치고 update_policies.py 를 실행한다. */
window.POLICY_DATA = {
  "schema_version": "1.0",
  "asof": "2026-09-28",
  "stale_days": 90,
  "unit": "금액 단위는 만원. 금리는 연 %.",
  "products": [
    {
      "id": "beotimmok_youth",
      "name": "청년전용 버팀목전세자금",
      "operator": "주택도시기금",
      "category": "정책자금",
      "status": "운영중",
      "priority": 100,
      "anchors": [
        "부부합산",
        "순자산",
        "전용면적",
        "임차보증금",
        "신용도"
      ],
      "rules": [
        {
          "field": "age",
          "op": "between",
          "value": [
            19,
            34
          ],
          "label": "만 19~34세 (접수일 기준)",
          "hard": true,
          "fail": "만 34세를 넘으면 일반 버팀목전세자금으로 검토"
        },
        {
          "field": "householdIncome",
          "op": "lte",
          "value": 5000,
          "label": "부부합산 연소득 5천만원 이하",
          "hard": true,
          "fail": "2자녀·다자녀·혁신도시 이전 공공기관 종사자는 6천만원, 신혼가구는 7,500만원까지"
        },
        {
          "field": "assets",
          "op": "lte",
          "value": 34500,
          "label": "부부합산 순자산 3억 4,500만원 이하 (2026년 기준)",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "세대주를 포함한 세대원 전원 무주택",
          "hard": true
        },
        {
          "field": "household",
          "op": "in",
          "value": [
            "head",
            "prep"
          ],
          "label": "세대주 또는 예비 세대주",
          "hard": true,
          "fail": "부모님 세대에 속한 세대원은 신청 불가"
        },
        {
          "field": "deposit",
          "op": "lte",
          "value": 30000,
          "label": "임차보증금 3억원 이하",
          "hard": true
        },
        {
          "field": "area",
          "op": "lte",
          "value": 85,
          "label": "전용면적 85㎡ 이하",
          "hard": true
        },
        {
          "field": "delinquent",
          "op": "falsy",
          "value": true,
          "label": "연체·대위변제·부도·금융질서문란·신용회복지원 등록정보 없음",
          "hard": true,
          "fail": "한국신용정보원에 해당 정보가 등록돼 있으면 대출 불가"
        },
        {
          "field": "ownFund",
          "op": "gte",
          "value": 1,
          "label": "임차보증금의 5% 이상을 계약금으로 먼저 지급",
          "hard": false
        },
        {
          "field": "tenure",
          "op": "gte",
          "value": 12,
          "label": "재직 1년 이상",
          "hard": false,
          "fail": "1년 미만 재직자는 한도가 2천만원 이하로 제한될 수 있다"
        }
      ],
      "rate_table": [
        {
          "income_max": 2000,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 2.2,
          "label": "연소득 2천만원 이하 · 수도권"
        },
        {
          "income_max": 4000,
          "income_min": 2001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 2.5,
          "label": "연소득 2천~4천만원 · 수도권"
        },
        {
          "income_max": 6000,
          "income_min": 4001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 2.9,
          "label": "연소득 4천~6천만원 · 수도권"
        },
        {
          "income_max": 7500,
          "income_min": 6001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 3.3,
          "label": "연소득 6천~7,500만원 · 수도권"
        },
        {
          "income_max": 2000,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.0,
          "label": "연소득 2천만원 이하 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 4000,
          "income_min": 2001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.3,
          "label": "연소득 2천~4천만원 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 6000,
          "income_min": 4001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.7,
          "label": "연소득 4천~6천만원 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 7500,
          "income_min": 6001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 3.1,
          "label": "연소득 6천~7,500만원 · 지방 (0.2%p 인하)"
        }
      ],
      "limit": {
        "max": 15000,
        "deposit_ratio": 0.8
      },
      "discounts": [
        {
          "label": "주택청약종합저축 관련 우대는 이 상품에 없음. 아래 항목만 해당",
          "amount": "참고",
          "when": {
            "field": "subscription",
            "op": "truthy",
            "value": true
          }
        },
        {
          "label": "만 25세 미만 단독세대주 (전용 60㎡ 이하 · 보증금 3억원 이하 · 대출금 1.2억원 이하)",
          "amount": "0.3%p, 대출실행일로부터 최대 4년",
          "when": {
            "field": "age",
            "op": "lt",
            "value": 25
          }
        },
        {
          "label": "중소·중견기업 재직 또는 청년창업 지원 대상",
          "amount": "0.3%p, 최대 4년",
          "when": {
            "field": "employment",
            "op": "eq",
            "value": "sme"
          }
        },
        {
          "label": "부동산 전자계약 체결",
          "amount": "0.1%p, 2026-12-31 신규 접수분까지 · 최초 대출기한 1회"
        },
        {
          "label": "주거안정 월세대출 성실납부자",
          "amount": "0.2%p"
        },
        {
          "label": "대출신청금액이 심사 산정금액의 30% 이하",
          "amount": "0.2%p, 최대 4년"
        }
      ],
      "term": "2년 이내(임차종료일 초과 불가), 최장 10년. HUG 전세금안심대출보증 담보는 최대 2년 1개월(최장 10년 5개월)",
      "guarantee": "HF 전세자금보증 · HUG 전세금안심대출보증 · 채권양도협약기관 반환채권양도 중 택1. 보증 종류에 따라 한도 산식과 신청기한이 달라진다",
      "channel": "기금e든든(enhuf.molit.go.kr) 또는 수탁은행 영업점. 잔금지급일과 전입일 중 빠른 날부터 3개월 이내 신청",
      "docs": [
        "주민등록등본 · 가족관계증명서",
        "임대차계약서 사본 및 계약금 5% 이상 납입 영수증",
        "근로소득자: 건강보험자격득실확인서, 원천징수영수증 또는 소득금액증명원",
        "사업소득자: 사업자등록증, 소득금액증명원",
        "무소득자: 신고사실없음 사실증명원",
        "자산심사용 자료 (금융자산·부동산·자동차 등)"
      ],
      "caveats": [
        "우대금리 적용 상한은 0.5%p다. 기초생활수급권자·차상위계층·한부모가구는 1.0%p, 다자녀가구는 0.7%p. 우대 항목을 단순 합산하면 실제보다 낮은 금리가 나온다",
        "우대금리를 적용한 최종금리가 연 1.0% 미만이면 연 1.0%를 적용한다",
        "재직 1년 미만이면 대출한도가 2천만원 이하로 제한될 수 있다",
        "2025-06-27 이전 계약 체결 건은 호당한도 2억원(만 25세 미만 단독세대주 1.5억원)이 적용된다",
        "만 25세 미만 단독세대주는 전용면적 60㎡ 이하 · 한도 1.2억원으로 제한된다",
        "대출접수일 현재 공공임대주택에 입주 중이면 신청할 수 없다",
        "기금대출·은행재원 전세자금대출·주택담보대출을 이용 중이면 신청할 수 없다",
        "변동금리다. 국토교통부 고시금리가 바뀌면 기존 이용자의 금리도 함께 변동된다",
        "사후 자산심사에서 순자산 기준을 초과하면 가산금리가 붙는다. 초과액 1천만원 이하 0.1%p, 5천만원 이하 2.0%p, 1억원 이하 4.0%p, 1억원 초과 4.0%p와 기한이익상실. HF 보증 거절 시 1.0%p 추가",
        "중도상환수수료는 없다"
      ],
      "source": {
        "name": "주택도시기금 「청년전용 버팀목전세자금」",
        "url": "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020301.jsp",
        "asof": "2026-09-28",
        "confidence": "primary_source_confirmed"
      }
    },
    {
      "id": "beotimmok_general",
      "name": "버팀목전세자금 (일반)",
      "operator": "주택도시기금",
      "category": "정책자금",
      "status": "운영중",
      "priority": 90,
      "anchors": [
        "부부합산",
        "순자산",
        "전용면적",
        "임차보증금"
      ],
      "rules": [
        {
          "field": "age",
          "op": "gte",
          "value": 19,
          "label": "민법상 성년 세대주 (연령 상한 없음)",
          "hard": true
        },
        {
          "field": "householdIncome",
          "op": "lte",
          "value": 5000,
          "label": "부부합산 연소득 5천만원 이하",
          "hard": true,
          "fail": "2자녀·다자녀는 6천만원, 신혼부부는 7,500만원까지"
        },
        {
          "field": "assets",
          "op": "lte",
          "value": 34500,
          "label": "부부합산 순자산 3억 4,500만원 이하 (2026년 기준)",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "세대원 전원 무주택",
          "hard": true
        },
        {
          "field": "household",
          "op": "in",
          "value": [
            "head",
            "prep"
          ],
          "label": "세대주 또는 세대주 예정자",
          "hard": true
        },
        {
          "field": "area",
          "op": "lte",
          "value": 85,
          "label": "전용면적 85㎡ 이하 (읍·면지역 100㎡)",
          "hard": true
        },
        {
          "field": "delinquent",
          "op": "falsy",
          "value": true,
          "label": "연체·대위변제·부도·금융질서문란·신용회복지원 등록정보 없음",
          "hard": true
        },
        {
          "field": "tenure",
          "op": "gte",
          "value": 12,
          "label": "재직 1년 이상",
          "hard": false,
          "fail": "1년 미만 재직자는 한도가 2천만원 이하로 제한될 수 있다"
        }
      ],
      "rate_table": [
        {
          "income_max": 2000,
          "deposit_max": 5000,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 2.5,
          "label": "연소득 2천만원 이하 · 보증금 5천만원 이하 · 수도권"
        },
        {
          "income_max": 2000,
          "deposit_max": 10000,
          "deposit_min": 5001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 2.6,
          "label": "연소득 2천만원 이하 · 보증금 5천만~1억원 · 수도권"
        },
        {
          "income_max": 2000,
          "deposit_min": 10001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 2.7,
          "label": "연소득 2천만원 이하 · 보증금 1억원 초과 · 수도권"
        },
        {
          "income_max": 4000,
          "income_min": 2001,
          "deposit_max": 5000,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 2.7,
          "label": "연소득 2천~4천만원 · 보증금 5천만원 이하 · 수도권"
        },
        {
          "income_max": 4000,
          "income_min": 2001,
          "deposit_max": 10000,
          "deposit_min": 5001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 2.8,
          "label": "연소득 2천~4천만원 · 보증금 5천만~1억원 · 수도권"
        },
        {
          "income_max": 4000,
          "income_min": 2001,
          "deposit_min": 10001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 2.9,
          "label": "연소득 2천~4천만원 · 보증금 1억원 초과 · 수도권"
        },
        {
          "income_max": 6000,
          "income_min": 4001,
          "deposit_max": 5000,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 3.0,
          "label": "연소득 4천~6천만원 · 보증금 5천만원 이하 · 수도권"
        },
        {
          "income_max": 6000,
          "income_min": 4001,
          "deposit_max": 10000,
          "deposit_min": 5001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 3.1,
          "label": "연소득 4천~6천만원 · 보증금 5천만~1억원 · 수도권"
        },
        {
          "income_max": 6000,
          "income_min": 4001,
          "deposit_min": 10001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 3.2,
          "label": "연소득 4천~6천만원 · 보증금 1억원 초과 · 수도권"
        },
        {
          "income_max": 7500,
          "income_min": 6001,
          "deposit_max": 5000,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 3.3,
          "label": "연소득 6천~7,500만원 · 보증금 5천만원 이하 · 수도권"
        },
        {
          "income_max": 7500,
          "income_min": 6001,
          "deposit_max": 10000,
          "deposit_min": 5001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 3.4,
          "label": "연소득 6천~7,500만원 · 보증금 5천만~1억원 · 수도권"
        },
        {
          "income_max": 7500,
          "income_min": 6001,
          "deposit_min": 10001,
          "regions": [
            "seoul",
            "metro"
          ],
          "rate": 3.5,
          "label": "연소득 6천~7,500만원 · 보증금 1억원 초과 · 수도권"
        },
        {
          "income_max": 2000,
          "deposit_max": 5000,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.3,
          "label": "연소득 2천만원 이하 · 보증금 5천만원 이하 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 2000,
          "deposit_max": 10000,
          "deposit_min": 5001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.4,
          "label": "연소득 2천만원 이하 · 보증금 5천만~1억원 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 2000,
          "deposit_min": 10001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.5,
          "label": "연소득 2천만원 이하 · 보증금 1억원 초과 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 4000,
          "income_min": 2001,
          "deposit_max": 5000,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.5,
          "label": "연소득 2천~4천만원 · 보증금 5천만원 이하 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 4000,
          "income_min": 2001,
          "deposit_max": 10000,
          "deposit_min": 5001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.6,
          "label": "연소득 2천~4천만원 · 보증금 5천만~1억원 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 4000,
          "income_min": 2001,
          "deposit_min": 10001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.7,
          "label": "연소득 2천~4천만원 · 보증금 1억원 초과 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 6000,
          "income_min": 4001,
          "deposit_max": 5000,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.8,
          "label": "연소득 4천~6천만원 · 보증금 5천만원 이하 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 6000,
          "income_min": 4001,
          "deposit_max": 10000,
          "deposit_min": 5001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 2.9,
          "label": "연소득 4천~6천만원 · 보증금 5천만~1억원 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 6000,
          "income_min": 4001,
          "deposit_min": 10001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 3.0,
          "label": "연소득 4천~6천만원 · 보증금 1억원 초과 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 7500,
          "income_min": 6001,
          "deposit_max": 5000,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 3.1,
          "label": "연소득 6천~7,500만원 · 보증금 5천만원 이하 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 7500,
          "income_min": 6001,
          "deposit_max": 10000,
          "deposit_min": 5001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 3.2,
          "label": "연소득 6천~7,500만원 · 보증금 5천만~1억원 · 지방 (0.2%p 인하)"
        },
        {
          "income_max": 7500,
          "income_min": 6001,
          "deposit_min": 10001,
          "regions": [
            "metro_city",
            "other"
          ],
          "rate": 3.3,
          "label": "연소득 6천~7,500만원 · 보증금 1억원 초과 · 지방 (0.2%p 인하)"
        }
      ],
      "limit": {
        "max_by_region": {
          "seoul": 12000,
          "metro": 12000,
          "metro_city": 8000,
          "other": 8000
        },
        "deposit_ratio": 0.7
      },
      "discounts": [
        {
          "label": "부동산 전자계약 체결",
          "amount": "0.1%p, 2026-12-31 신규 접수분까지"
        },
        {
          "label": "주거안정 월세대출 성실납부자",
          "amount": "0.2%p"
        },
        {
          "label": "대출신청금액이 심사 산정금액의 30% 이하",
          "amount": "0.2%p, 2024-07-31 신규접수분부터 최대 4년"
        }
      ],
      "term": "2년 이내(임차종료일 초과 불가), 최장 10년",
      "guarantee": "HF 전세자금보증 · HUG 전세금안심대출보증 · 채권양도협약기관 반환채권양도 중 택1",
      "channel": "기금e든든(enhuf.molit.go.kr) 또는 수탁은행 영업점",
      "docs": [
        "주민등록등본 · 가족관계증명서",
        "임대차계약서 사본 및 계약금 5% 이상 납입 영수증",
        "소득 증빙 (건강보험자격득실확인서, 소득금액증명원 등)",
        "자산심사용 자료"
      ],
      "caveats": [
        "구간별 세부금리는 기금 금리 조회 자료에서 확인한 값이다. 신청 전 취급은행 또는 기금 상품 페이지에서 최종 확인이 필요하다",
        "임차보증금 상한은 일반가구 수도권 3억원·수도권 외 2억원, 신혼 및 다자녀가구 수도권 4억원·수도권 외 3억원이다",
        "신혼가구 및 2자녀 이상 가구는 한도가 수도권 2.5억원·수도권 외 1.6억원이고 대출비율도 80%로 올라간다. 만 34세 이하라도 신혼이면 청년전용보다 이 상품이 유리할 수 있다",
        "일반가구 대출비율은 전세금액의 70%다. 청년전용(80%)보다 낮다",
        "우대금리 적용 상한 0.5%p, 최종금리 하한 연 1.0% 규정이 동일하게 적용된다",
        "변동금리다. 국토교통부 고시금리가 바뀌면 기존 이용자의 금리도 함께 변동된다"
      ],
      "source": {
        "name": "주택도시기금 「버팀목전세자금」",
        "url": "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020101.jsp",
        "asof": "2026-09-28",
        "confidence": "secondary"
      }
    },
    {
      "id": "youth_monthly_deposit",
      "name": "청년전용 보증부월세대출",
      "operator": "주택도시기금",
      "category": "정책자금",
      "status": "운영중",
      "priority": 80,
      "anchors": [
        "부부합산",
        "순자산",
        "전용면적",
        "월세"
      ],
      "rules": [
        {
          "field": "age",
          "op": "between",
          "value": [
            19,
            34
          ],
          "label": "만 19~34세",
          "hard": true
        },
        {
          "field": "householdIncome",
          "op": "lte",
          "value": 5000,
          "label": "부부합산 연소득 5천만원 이하",
          "hard": true
        },
        {
          "field": "assets",
          "op": "lte",
          "value": 34500,
          "label": "부부합산 순자산 3억 4,500만원 이하",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택",
          "hard": true
        },
        {
          "field": "household",
          "op": "in",
          "value": [
            "head",
            "prep"
          ],
          "label": "단독세대주 또는 예비 단독세대주",
          "hard": true
        },
        {
          "field": "deposit",
          "op": "lte",
          "value": 6500,
          "label": "임차보증금 6,500만원 이하",
          "hard": true
        },
        {
          "field": "monthly",
          "op": "lte",
          "value": 70,
          "label": "월세 70만원 이하",
          "hard": true
        },
        {
          "field": "monthly",
          "op": "gt",
          "value": 0,
          "label": "월세 계약이어야 한다",
          "hard": true,
          "fail": "순수 전세는 버팀목전세자금 대상"
        },
        {
          "field": "area",
          "op": "lte",
          "value": 60,
          "label": "전용면적 60㎡ 이하",
          "hard": true
        },
        {
          "field": "delinquent",
          "op": "falsy",
          "value": true,
          "label": "연체·대위변제·부도 등 결격 신용정보 없음",
          "hard": true
        }
      ],
      "rate_table": [
        {
          "rate": 1.3,
          "label": "보증금 대출 연 1.3% (소득구간 구분 없음). 월세금 대출은 월 20만원까지 연 0%, 초과분 연 1.0%",
          "fixed": true
        }
      ],
      "limit": {
        "max": 4500,
        "deposit_ratio": 0.7
      },
      "discounts": [],
      "term": "25개월 만기 일시상환 (최장 10년 5개월 이용 가능)",
      "guarantee": "HUG 전세금안심대출보증 단일",
      "channel": "취급은행 우리·KB국민·신한. 임대차계약 확정일자와 전입신고일 중 늦은 날부터 3개월 이내 신청",
      "docs": [
        "주민등록등본 · 가족관계증명서",
        "임대차계약서 사본 및 계약금 5% 이상 납입 영수증",
        "소득 증빙 자료",
        "확정일자부 임대차계약서"
      ],
      "caveats": [
        "보증금 대출 최대 4,500만원, 월세금 대출 최대 1,200만원(24개월 기준 월 최대 50만원)으로 나뉘어 있다",
        "신규계약은 보증금 대출금과 월세금 대출금(24개월 환산액) 합계가 전세금액의 80% 이내이고, 보증금 대출금만으로는 70% 이내다",
        "월세금 대출은 월 20만원까지 무이자다. 이 구간을 채우는 것이 가장 유리하다",
        "대출접수일 현재 공공임대주택에 입주 중이면 신청할 수 없다",
        "인지세를 고객과 은행이 각 50% 부담한다",
        "보증금 6,500만원·월세 70만원 이하라는 요건 때문에 대상 주택이 좁다"
      ],
      "source": {
        "name": "주택도시기금 「청년전용 보증부월세대출」",
        "url": "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020701.jsp",
        "asof": "2026-09-28",
        "confidence": "primary_source_confirmed"
      }
    },
    {
      "id": "housing_stability_monthly",
      "name": "주거안정월세대출",
      "operator": "주택도시기금",
      "category": "정책자금",
      "status": "운영중",
      "priority": 70,
      "anchors": [
        "취업준비생",
        "사회초년생",
        "월세"
      ],
      "rules": [
        {
          "field": "age",
          "op": "lte",
          "value": 35,
          "label": "만 35세 이하 (우대형 기준)",
          "hard": true
        },
        {
          "field": "monthly",
          "op": "gt",
          "value": 0,
          "label": "월세 계약이어야 한다",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택",
          "hard": true
        },
        {
          "field": "household",
          "op": "in",
          "value": [
            "head",
            "prep"
          ],
          "label": "세대주 또는 예비 세대주",
          "hard": true
        },
        {
          "field": "delinquent",
          "op": "falsy",
          "value": true,
          "label": "결격 신용정보 없음",
          "hard": true
        },
        {
          "field": "householdIncome",
          "op": "lte",
          "value": 4000,
          "label": "우대형 사회초년생은 부부합산 연소득 4천만원 이하",
          "hard": false,
          "fail": "소득이 넘으면 일반형 금리가 적용된다"
        }
      ],
      "rate_table": [
        {
          "income_max": 4000,
          "rate": 1.3,
          "label": "우대형 연 1.3% (취업준비생·사회초년생 등)",
          "fixed": true
        },
        {
          "income_min": 4001,
          "rate": 1.8,
          "label": "일반형 연 1.8%",
          "fixed": true
        }
      ],
      "limit": {
        "max": 1440
      },
      "discounts": [],
      "term": "2년 만기 일시상환",
      "guarantee": "HF 월세자금보증 단일",
      "channel": "기금e든든 또는 수탁은행 영업점",
      "docs": [
        "주민등록등본 · 가족관계증명서",
        "임대차계약서 사본",
        "취업준비생: 부모 소득 증빙 (6천만원 이하 확인)",
        "사회초년생: 재직·소득 증빙 (취업 후 5년 이내 확인)"
      ],
      "caveats": [
        "월 최대 60만원씩 24개월, 총 1,440만원까지 대출된다",
        "우대형 대상은 취업준비생(부모와 따로 거주하거나 독립하려는 만 35세 이하 무소득자로 부모 소득 6천만원 이하)과 사회초년생(취업 후 5년 이내, 만 35세 이하, 부부합산 연소득 4천만원 이하)이다",
        "주거급여 수급자는 대출한도에서 주거급여 수급액만큼을 차감한다",
        "인지세를 고객과 은행이 각 50% 부담한다",
        "이 대출을 성실 납부하면 이후 버팀목전세자금에서 0.2%p 우대를 받는다"
      ],
      "source": {
        "name": "주택도시기금 「주거안정월세대출」",
        "url": "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020201.jsp",
        "asof": "2026-09-28",
        "confidence": "primary_source_confirmed"
      }
    },
    {
      "id": "newlywed_jeonse",
      "name": "신혼부부전용 전세자금",
      "operator": "주택도시기금",
      "category": "정책자금",
      "status": "운영중",
      "priority": 85,
      "anchors": [
        "혼인기간",
        "부부합산",
        "순자산"
      ],
      "rules": [
        {
          "field": "marital",
          "op": "in",
          "value": [
            "married",
            "preparing"
          ],
          "label": "혼인기간 7년 이내 또는 3개월 이내 결혼예정",
          "hard": true
        },
        {
          "field": "householdIncome",
          "op": "lte",
          "value": 7500,
          "label": "부부합산 연소득 7,500만원 이하",
          "hard": true
        },
        {
          "field": "assets",
          "op": "lte",
          "value": 34500,
          "label": "부부합산 순자산 3억 4,500만원 이하",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택 세대주",
          "hard": true
        },
        {
          "field": "household",
          "op": "in",
          "value": [
            "head",
            "prep"
          ],
          "label": "세대주 또는 예비 세대주",
          "hard": true
        },
        {
          "field": "area",
          "op": "lte",
          "value": 85,
          "label": "전용면적 85㎡ 이하",
          "hard": true
        },
        {
          "field": "delinquent",
          "op": "falsy",
          "value": true,
          "label": "결격 신용정보 없음",
          "hard": true
        }
      ],
      "rate_table": [
        {
          "income_max": 2000,
          "rate": 1.9,
          "rate_max": 2.3,
          "label": "연소득 2천만원 이하 · 보증금 구간별 연 1.9~2.3%"
        },
        {
          "income_max": 4000,
          "income_min": 2001,
          "rate": 2.2,
          "rate_max": 2.6,
          "label": "연소득 2천~4천만원 · 보증금 구간별 연 2.2~2.6%"
        },
        {
          "income_max": 6000,
          "income_min": 4001,
          "rate": 2.5,
          "rate_max": 2.9,
          "label": "연소득 4천~6천만원 · 보증금 구간별 연 2.5~2.9%"
        },
        {
          "income_max": 7500,
          "income_min": 6001,
          "rate": 2.9,
          "rate_max": 3.3,
          "label": "연소득 6천~7,500만원 · 보증금 구간별 연 2.9~3.3%"
        }
      ],
      "limit": {
        "max_by_region": {
          "seoul": 25000,
          "metro": 25000,
          "metro_city": 16000,
          "other": 16000
        },
        "deposit_ratio": 0.8
      },
      "discounts": [
        {
          "label": "부동산 전자계약 체결",
          "amount": "0.1%p"
        }
      ],
      "term": "2년 이내, 최장 10년",
      "guarantee": "HF 전세자금보증 · HUG 전세금안심대출보증 · 채권양도협약기관 반환채권양도 중 택1",
      "channel": "기금e든든 또는 수탁은행 영업점",
      "docs": [
        "혼인관계증명서 또는 예식장 계약서 등 결혼예정 증빙",
        "주민등록등본 · 가족관계증명서",
        "임대차계약서 사본 및 계약금 납입 영수증",
        "부부 각각의 소득 증빙"
      ],
      "caveats": [
        "금리는 소득구간과 보증금구간 교차표로 결정된다. 표시된 값은 해당 소득구간의 보증금별 범위다",
        "한도가 청년전용 버팀목(1.5억원)보다 크다. 만 34세 이하 신혼이면 이 상품이 유리할 수 있다",
        "임차보증금 상한은 수도권 4억원·수도권 외 3억원이다",
        "구간별 세부금리는 신청 전 취급은행에서 확인이 필요하다"
      ],
      "source": {
        "name": "주택도시기금 「신혼부부전용 전세자금」",
        "url": "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020401.jsp",
        "asof": "2026-09-28",
        "confidence": "secondary"
      }
    },
    {
      "id": "sme_youth_discontinued",
      "name": "중소기업취업청년 전월세보증금대출",
      "operator": "주택도시기금",
      "category": "정책자금",
      "status": "신규 취급 중단",
      "priority": 10,
      "anchors": [],
      "rules": [
        {
          "field": "age",
          "op": "lt",
          "value": 0,
          "label": "신규 접수가 중단된 상품이다",
          "hard": true,
          "fail": "상품 페이지가 404를 반환하고 기금포털 전세자금대출 메뉴에서도 확인되지 않는다"
        }
      ],
      "rate_table": [
        {
          "rate": 1.5,
          "label": "과거 취급 당시 연 1.5% 고정. 현재는 신규 접수 불가",
          "fixed": true
        }
      ],
      "limit": {
        "max": 10000
      },
      "discounts": [],
      "term": "과거 취급 당시 2년, 최장 10년",
      "guarantee": "HF 또는 HUG 보증",
      "channel": "신규 접수 불가. 기존 이용자의 연장은 취급은행 문의",
      "docs": [],
      "caveats": [
        "연 1.5% 고정금리로 널리 알려진 상품이나, 2026-09-28 기준 주택도시기금 포털에서 신규 접수 경로가 확인되지 않는다",
        "상품 페이지(FP05020601)는 404를 반환하고, 전세자금대출 메뉴 목록에도 포함되지 않는다",
        "신규 취급 종료일을 명시한 공식 공고는 확인되지 않는다(미확인)",
        "기존 이용자의 연장 조건·금리 승계·중소기업 재직 유지 요건은 확인되지 않는다(미확인). 취급은행에 문의해야 한다",
        "중소·중견기업 재직자는 청년전용 버팀목전세자금의 0.3%p 우대를 대안으로 검토할 수 있다"
      ],
      "source": {
        "name": "주택도시기금 개인상품 전세자금대출 목록",
        "url": "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020101.jsp",
        "asof": "2026-09-28",
        "confidence": "primary_source_confirmed"
      }
    },
    {
      "id": "kakaobank_youth",
      "name": "카카오뱅크 전월세보증금 대출 (청년 전용)",
      "operator": "카카오뱅크",
      "category": "은행 대출",
      "status": "운영중",
      "priority": 60,
      "anchors": [
        "연소득",
        "무주택",
        "보증기관"
      ],
      "rules": [
        {
          "field": "age",
          "op": "between",
          "value": [
            19,
            34
          ],
          "label": "만 19~34세",
          "hard": true
        },
        {
          "field": "householdIncome",
          "op": "lte",
          "value": 7000,
          "label": "본인·배우자 합산 연소득 7천만원 이하",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "부부합산 무주택",
          "hard": true
        },
        {
          "field": "delinquent",
          "op": "falsy",
          "value": true,
          "label": "연체·신용회복 이력 없음",
          "hard": true
        },
        {
          "field": "hasIncomeProof",
          "op": "truthy",
          "value": true,
          "label": "소득·재직 증빙 가능",
          "hard": false,
          "fail": "무소득자 신청 가능 여부는 공식 자료로 확인되지 않는다"
        }
      ],
      "rate_table": [
        {
          "rate": 3.5,
          "rate_max": 5.5,
          "label": "신용점수·보증기관·시장금리에 따라 결정. 정확한 금리는 앱에서 조회 필요"
        }
      ],
      "limit": {
        "max": 20000,
        "deposit_ratio": 0.9
      },
      "discounts": [],
      "term": "최장 10년 (2년 단위 연장)",
      "guarantee": "HF 특례전세자금보증 (무주택 청년). 1억원 이하 이용 시 보증비율 100%, 상환능력별 보증한도 산정 생략",
      "channel": "카카오뱅크 앱에서 비대면 신청. 영업점 방문 없음",
      "docs": [
        "앱에서 공동인증서·간편인증으로 소득·재직 자동 조회",
        "임대차계약서 사본 (앱 업로드)",
        "계약금 5% 이상 납입 영수증"
      ],
      "caveats": [
        "정책자금(버팀목)보다 금리가 높다. 버팀목 요건을 충족하면 버팀목을 먼저 검토하는 것이 유리하다",
        "소득 요건이 7천만원이라 버팀목(5천만원)에서 탈락한 20대의 대안이 된다",
        "HF 특례전세자금보증의 무주택 청년 특례는 상환능력별 보증한도만 생략되고 CSS 신용평가는 유지된다. 신용거래 이력이 없는 20대는 이 단계에서 탈락할 수 있다",
        "표시 금리는 참고 구간이다. 신용점수별 적용금리는 공식 자료로 확인되지 않는다(미확인)",
        "비대면이라 절차가 빠르지만, 물건 심사에서 거절되면 대안 은행을 다시 찾아야 한다"
      ],
      "source": {
        "name": "카카오뱅크 전월세보증금 대출",
        "url": "https://www.kakaobank.com/products/jeonseLoan",
        "asof": "2026-09-28",
        "confidence": "secondary"
      }
    },
    {
      "id": "kbank_youth",
      "name": "케이뱅크 전월세보증금 대출 (청년 전용)",
      "operator": "케이뱅크",
      "category": "은행 대출",
      "status": "운영중",
      "priority": 58,
      "anchors": [
        "연소득",
        "무주택",
        "재직"
      ],
      "rules": [
        {
          "field": "age",
          "op": "between",
          "value": [
            19,
            34
          ],
          "label": "신청일 기준 만 19세 이상, 잔금일 기준 만 34세 이하",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택 (청년형은 무주택만 가능)",
          "hard": true
        },
        {
          "field": "tenure",
          "op": "gte",
          "value": 3,
          "label": "현 직장 3개월 이상 재직",
          "hard": true,
          "fail": "재직 3개월 미만이면 신청 불가"
        },
        {
          "field": "delinquent",
          "op": "falsy",
          "value": true,
          "label": "연체·신용회복 이력 없음",
          "hard": true
        }
      ],
      "rate_table": [
        {
          "rate": 3.5,
          "rate_max": 5.5,
          "label": "변동형은 신규취급액기준 COFIX(6개월) + 가산금리. 고정형은 기간별 기준금리 3.88~4.32% + 가산금리 0.97%"
        }
      ],
      "limit": {
        "max": 20000,
        "deposit_ratio": 0.9
      },
      "discounts": [],
      "term": "최장 10년",
      "guarantee": "HF 보증",
      "channel": "케이뱅크 앱에서 비대면 신청",
      "docs": [
        "앱에서 소득·재직 자동 조회",
        "임대차계약서 사본",
        "계약금 납입 영수증"
      ],
      "caveats": [
        "청년형과 고정금리형은 무주택 요건이고, 일반형만 1주택까지 허용된다",
        "고정금리형도 현 직장 3개월 이상 재직 요건이 있다",
        "일반형은 임차보증금의 88% 범위에서 최대 4.4억원까지 가능하다",
        "고정형 기준금리는 COFIX가 아니라 기간별 3.88~4.32%로 산정 구조가 다르다",
        "표시 금리는 참고 구간이다. 신용점수별 적용금리는 공식 자료로 확인되지 않는다(미확인)"
      ],
      "source": {
        "name": "케이뱅크 전월세보증금 대출",
        "url": "https://www.kbanknow.com/web/product/loan/jeonse-loan",
        "asof": "2026-09-28",
        "confidence": "secondary"
      }
    },
    {
      "id": "kb_jeonse",
      "name": "KB주택전세자금대출",
      "operator": "KB국민은행",
      "category": "은행 대출",
      "status": "운영중",
      "priority": 50,
      "anchors": [
        "기준금리",
        "가산금리",
        "보증"
      ],
      "rules": [
        {
          "field": "age",
          "op": "gte",
          "value": 19,
          "label": "만 19세 이상",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택 임차인",
          "hard": false
        },
        {
          "field": "tenure",
          "op": "gte",
          "value": 3,
          "label": "재직 3개월 이상 또는 사업소득 증빙",
          "hard": false
        },
        {
          "field": "delinquent",
          "op": "falsy",
          "value": true,
          "label": "연체·신용회복 이력 없음",
          "hard": true
        }
      ],
      "rate_table": [
        {
          "rate": 4.01,
          "rate_max": 5.77,
          "label": "공식 상품페이지 2026-09-28 조회 기준 최저~최고금리. 기준금리 COFIX + 가산금리 2.36~3.06%"
        }
      ],
      "limit": {
        "max": 22200,
        "deposit_ratio": 0.8
      },
      "discounts": [
        {
          "label": "급여(연금) 이체",
          "amount": "최고 0.3%p"
        },
        {
          "label": "신용카드 실적",
          "amount": "0.1~0.3%p"
        },
        {
          "label": "부동산 전자계약 체결",
          "amount": "0.2%p"
        },
        {
          "label": "취약차주 우대",
          "amount": "0.3%p"
        },
        {
          "label": "자동이체 · KB스타뱅킹 · 적립식예금",
          "amount": "각 0.1%p"
        }
      ],
      "term": "임대차계약 기간 이내 (연장 가능)",
      "guarantee": "HF 전세자금보증 또는 HUG · SGI서울보증",
      "channel": "영업점 또는 KB스타뱅킹",
      "docs": [
        "주민등록등본 · 가족관계증명서",
        "임대차계약서 사본 및 계약금 납입 영수증",
        "재직증명서 · 근로소득원천징수영수증 또는 소득금액증명원",
        "건강보험자격득실확인서"
      ],
      "caveats": [
        "우대금리 최고 연 1.4%p까지 받을 수 있다. 실적 조건을 채우면 금리 차가 크다",
        "정책자금 요건을 충족하면 버팀목이 금리에서 유리하다",
        "표시 금리는 공식 페이지 조회 기준값이며 신용점수별 세부 금리는 공개되지 않는다(미확인)"
      ],
      "source": {
        "name": "KB국민은행 KB주택전세자금대출",
        "url": "https://obank.kbstar.com/quics?page=C016613",
        "asof": "2026-09-28",
        "confidence": "primary_source_confirmed"
      }
    },
    {
      "id": "hana_fixed",
      "name": "하나은행 고정금리 전세자금대출",
      "operator": "하나은행",
      "category": "은행 대출",
      "status": "운영중",
      "priority": 48,
      "anchors": [
        "고정금리",
        "연간소득",
        "보증료"
      ],
      "rules": [
        {
          "field": "age",
          "op": "gte",
          "value": 19,
          "label": "만 19세 이상 세대주",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택 임차인",
          "hard": true
        },
        {
          "field": "ownFund",
          "op": "gte",
          "value": 1,
          "label": "임차보증금의 5% 이상 지급",
          "hard": true
        },
        {
          "field": "delinquent",
          "op": "falsy",
          "value": true,
          "label": "연체·신용회복 이력 없음",
          "hard": true
        }
      ],
      "rate_table": [
        {
          "rate": 3.9,
          "rate_max": 5.2,
          "label": "고정금리. 정확한 적용금리는 영업점 상담 필요",
          "fixed": true
        }
      ],
      "limit": {
        "max": 40000,
        "deposit_ratio": 0.9
      },
      "discounts": [],
      "term": "임대차계약 기간 이내",
      "guarantee": "HF 주택금융신용보증 (보증료 대출금액의 0.02~0.1%)",
      "channel": "하나은행 영업점",
      "docs": [
        "주민등록등본 · 가족관계증명서",
        "임대차계약서 사본 및 계약금 5% 이상 납입 영수증",
        "재직·소득 증빙"
      ],
      "caveats": [
        "한도는 최대 4억원 범위에서 임차보증금의 90% 이내, 연간소득의 5.0배 이내, HF 보증한도 중 가장 적은 금액이다",
        "20대 사회초년생은 연간소득 5.0배 제한이 실질 한도를 결정한다. 연소득 3천만원이면 1.5억원이 상한이다",
        "고정금리라 금리 상승기에 유리하다. 변동금리 상품과 비교해 선택하는 것이 좋다",
        "이 상품의 보증료(0.02~0.1%)는 HF 일반전세자금보증 요율(0.06~0.20%)과 체계가 다르다"
      ],
      "source": {
        "name": "하나은행 고정금리 전세자금대출",
        "url": "https://www.hanabank.com/cont/mall/mall08/mall0802/mall080201/index.jsp",
        "asof": "2026-09-28",
        "confidence": "primary_source_confirmed"
      }
    },
    {
      "id": "seoul_youth_interest",
      "name": "서울시 청년 임차보증금 이자지원",
      "operator": "서울특별시",
      "category": "지자체 이자지원",
      "status": "운영중",
      "priority": 75,
      "anchors": [
        "서울",
        "이자지원",
        "무주택"
      ],
      "rules": [
        {
          "field": "region",
          "op": "eq",
          "value": "seoul",
          "label": "서울시 내 임차 주택",
          "hard": true
        },
        {
          "field": "age",
          "op": "between",
          "value": [
            19,
            39
          ],
          "label": "만 19~39세",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택",
          "hard": true
        },
        {
          "field": "deposit",
          "op": "lte",
          "value": 30000,
          "label": "임차보증금 3억원 이하",
          "hard": true
        },
        {
          "field": "monthly",
          "op": "lte",
          "value": 90,
          "label": "월세 90만원 이하",
          "hard": true
        }
      ],
      "rate_table": [
        {
          "rate": 2.0,
          "label": "협약은행 대출금리에서 서울시가 이자 일부를 지원해 본인 부담이 낮아진다. 지원폭은 공고 기준 확인 필요"
        }
      ],
      "limit": {
        "max": 20000,
        "deposit_ratio": 0.9
      },
      "discounts": [],
      "term": "회당 6개월~2년, 최장 8년. 전세사기 피해 시 추가 최장 4년 연장",
      "guarantee": "HF 협약전세자금보증",
      "channel": "서울시 청년몽땅정보통에서 신청 후 협약은행 대출 진행",
      "docs": [
        "주민등록등본 (서울시 거주 확인)",
        "임대차계약서 사본",
        "소득 증빙",
        "무주택 확인 서류"
      ],
      "caveats": [
        "대출 자체가 아니라 협약은행 대출의 이자를 서울시가 지원하는 사업이다",
        "월세 상한이 2026년 중 70만원에서 90만원으로 완화됐다",
        "전세사기(깡통전세) 피해 시 기본 8년에 더해 최장 4년까지 연장된다",
        "자산(순자산) 요건은 공고에 없다. 무주택과 소득 요건만 적용된다",
        "주택도시기금 대출과 중복 가능 여부는 확인되지 않는다(미확인). 신청 전 확인이 필요하다",
        "이자지원 폭과 소득 상한은 연도별 공고에 따라 바뀐다"
      ],
      "source": {
        "name": "서울시 청년몽땅정보통 금융지원",
        "url": "https://soco.seoul.go.kr/youth/main/contents.do?menuNo=400024",
        "asof": "2026-09-28",
        "confidence": "secondary"
      }
    },
    {
      "id": "busan_youth_interest",
      "name": "부산시 청년 임차보증금 대출이자 지원 (머물자리론)",
      "operator": "부산광역시",
      "category": "지자체 이자지원",
      "status": "운영중",
      "priority": 72,
      "anchors": [
        "부산",
        "머물자리",
        "지원금리"
      ],
      "rules": [
        {
          "field": "region",
          "op": "eq",
          "value": "metro_city",
          "label": "부산시 내 임차 주택 (광역시 선택)",
          "hard": true
        },
        {
          "field": "age",
          "op": "between",
          "value": [
            19,
            39
          ],
          "label": "만 19~39세",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택",
          "hard": true
        },
        {
          "field": "householdIncome",
          "op": "lte",
          "value": 4500,
          "label": "미혼은 본인 연소득, 기혼은 부부합산 연소득 기준",
          "hard": false
        }
      ],
      "rate_table": [
        {
          "income_max": 2600,
          "rate": 0.5,
          "label": "연소득 2,600만원 이하 · 대출금리 3.5%에서 시 지원 3.0%p 차감 · 본인부담 0.5% (대출실행일 2026-11-01부터 적용)"
        },
        {
          "income_min": 2601,
          "rate": 1.5,
          "label": "연소득 2,600만원 초과 구간 · 시 지원금리 차감 후 본인부담"
        }
      ],
      "limit": {
        "max": 20000,
        "deposit_ratio": 0.8
      },
      "discounts": [],
      "term": "공고 기준 확인 필요",
      "guarantee": "HF 보증 (보증료는 본인 부담)",
      "channel": "부산청년플랫폼에서 신청 후 협약은행 대출 진행",
      "docs": [
        "주민등록등본 (부산시 거주 확인)",
        "임대차계약서 사본",
        "소득 증빙",
        "무주택 확인 서류"
      ],
      "caveats": [
        "연소득 2,600만원 이하 구간의 시 지원금리 3.0%p는 대출실행일 2026-11-01부터 적용된다. 그 전에 실행하면 이 우대를 받지 못한다",
        "소득구간 판정은 미혼이면 본인 연소득, 기혼이면 부부합산 연소득 기준이다",
        "연간 이자지원 상한액은 공식 안내에 금액이 없고 보도자료상 수치가 서로 다르다(미확인)",
        "재직·고용형태 요건은 공식 안내에 명시되지 않는다(미확인)",
        "이 프로그램은 지역을 「광역시」로 선택하면 부산으로 간주해 표시한다. 다른 광역시는 해당 시 공고를 확인해야 한다"
      ],
      "source": {
        "name": "부산청년플랫폼 머물자리론",
        "url": "https://young.busan.go.kr/",
        "asof": "2026-09-28",
        "confidence": "secondary"
      }
    },
    {
      "id": "gyeonggi_lowincome",
      "name": "경기도 저소득층 전세금 대출보증 및 이자지원",
      "operator": "경기도",
      "category": "지자체 이자지원",
      "status": "운영중",
      "priority": 71,
      "anchors": [
        "경기도",
        "전세금",
        "이자지원"
      ],
      "rules": [
        {
          "field": "region",
          "op": "eq",
          "value": "metro",
          "label": "경기도 내 임차 주택",
          "hard": true
        },
        {
          "field": "age",
          "op": "gte",
          "value": 19,
          "label": "만 19세 이상",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택",
          "hard": true
        },
        {
          "field": "householdIncome",
          "op": "lte",
          "value": 5000,
          "label": "저소득 기준 충족 (공고 기준 확인 필요)",
          "hard": false
        }
      ],
      "rate_table": [
        {
          "rate": 1.5,
          "label": "협약은행 대출금리에서 경기도가 이자를 지원한다. 지원폭은 공고 기준 확인 필요"
        }
      ],
      "limit": {
        "max": 15000,
        "deposit_ratio": 0.8
      },
      "discounts": [],
      "term": "공고 기준 확인 필요",
      "guarantee": "HF 보증. 대출보증료는 경기도가 전액 지원하되 최대 2회까지",
      "channel": "경기도 및 협약은행",
      "docs": [
        "주민등록등본 (경기도 거주 확인)",
        "임대차계약서 사본",
        "소득 증빙",
        "무주택 확인 서류"
      ],
      "caveats": [
        "2026년 접수기간은 2026-01-26부터 2026-12-31까지다. 다만 모집 예정물량이 소진되면 조기 종료된다",
        "보증료 지원은 전액이되 최대 2회까지다. 3회차 이후 보증료는 본인이 부담한다",
        "대상주택 임차보증금 상한과 면적 기준은 확인되지 않는다(미확인)",
        "2026년 신규 지원 호수는 공식 자료로 확인되지 않는다(미확인)"
      ],
      "source": {
        "name": "경기도 저소득층 전세금 대출보증 및 이자지원",
        "url": "https://www.gg.go.kr/",
        "asof": "2026-09-28",
        "confidence": "secondary"
      }
    },
    {
      "id": "daegu_youth_interest",
      "name": "대구시 청년 주택 임차보증금 대출이자 지원",
      "operator": "대구광역시",
      "category": "지자체 이자지원",
      "status": "운영중",
      "priority": 70,
      "anchors": [
        "대구",
        "이자지원",
        "청년"
      ],
      "rules": [
        {
          "field": "region",
          "op": "eq",
          "value": "metro_city",
          "label": "대구시 내 임차 주택 (광역시 선택)",
          "hard": true
        },
        {
          "field": "age",
          "op": "between",
          "value": [
            19,
            39
          ],
          "label": "만 19~39세",
          "hard": true
        },
        {
          "field": "noHome",
          "op": "truthy",
          "value": true,
          "label": "무주택",
          "hard": true
        }
      ],
      "rate_table": [
        {
          "rate": 1.5,
          "label": "협약은행 대출금리에서 대구시가 이자를 지원한다. 지원폭은 공고 기준 확인 필요"
        }
      ],
      "limit": {
        "max": 15000,
        "deposit_ratio": 0.8
      },
      "discounts": [],
      "term": "공고 기준 확인 필요",
      "guarantee": "HF 보증 (보증료는 본인 부담)",
      "channel": "대구시 청년 주거지원 창구 및 협약은행",
      "docs": [
        "주민등록등본 (대구시 거주 확인)",
        "임대차계약서 사본",
        "소득 증빙",
        "무주택 확인 서류"
      ],
      "caveats": [
        "주택도시기금 전세자금대출과 중복할 수 없다. 대구시 청년월세 지원, 신혼부부 전세자금 대출이자 지원과도 중복 불가다",
        "이 프로그램은 지역을 「광역시」로 선택하면 부산·대구 사업을 함께 표시한다. 실제 신청은 거주지 해당 시에만 가능하다",
        "보증료율은 공개되지 않는다(미확인)"
      ],
      "source": {
        "name": "대구광역시 청년 주택 임차보증금 대출이자 지원",
        "url": "https://anbang.daegu.go.kr/jeonseMonthly/businessOverView.do",
        "asof": "2026-09-28",
        "confidence": "secondary"
      }
    }
  ],
  "common_notes": [
    {
      "title": "신청 순서 — 계약 전에 먼저 확인할 것",
      "items": [
        "집을 계약하기 전에 은행에서 대출 가능 여부와 한도를 먼저 확인한다. 계약부터 하면 대출이 안 나와도 계약금을 돌려받기 어렵다",
        "등기부등본을 직접 떼어 선순위 근저당, 신탁등기, 압류를 확인한다. 신탁등기된 집은 전세대출이 거절되는 경우가 많다",
        "건축물대장에서 위반건축물 표기를 확인한다. 표기가 있으면 보증기관이 보증을 거절할 수 있다",
        "임대인이 전세대출에 동의하는지 계약 전에 확인한다. 동의를 거부하면 대출 진행이 막힐 수 있다",
        "계약 후에는 확정일자를 받고 전입신고를 한다. 대출 신청기한은 잔금지급일과 전입일 중 빠른 날부터 3개월 이내다"
      ],
      "source": {
        "name": "주택도시기금 · 한국주택금융공사 대출 이용절차 안내",
        "url": "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020301.jsp",
        "asof": "2026-09-28"
      }
    },
    {
      "title": "고용형태별로 가능한 선택지",
      "items": [
        "정규직 재직 1년 이상: 모든 상품 신청 가능. 버팀목 계열이 금리에서 가장 유리하다",
        "재직 3개월~1년: 신청은 가능하나 한도가 2천만원 이하로 제한될 수 있다. 재직 1년을 채운 뒤 신청하는 것도 방법이다",
        "재직 3개월 미만: 케이뱅크 등 재직 3개월 요건이 있는 은행 상품은 신청할 수 없다. 버팀목 계열은 재직 요건이 없어 신청 가능하다",
        "프리랜서·개인사업자: 사업자등록증과 소득금액증명원으로 소득을 증빙한다. 사업자등록이 없으면 은행별 인정 범위가 달라 개별 확인이 필요하다",
        "무직·무소득: 버팀목 계열은 「신고사실없음 사실증명원」을 제출해 신청할 수 있다. 채권양도 방식에서는 무소득자도 연간인정소득 4,500만원으로 산정된다",
        "대학생: 주거안정월세대출 우대형(취업준비생)이 해당될 수 있다. 부모 소득이 6천만원 이하여야 한다"
      ],
      "source": {
        "name": "주택도시기금 상품별 대출대상 및 제출서류",
        "url": "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020301.jsp",
        "asof": "2026-09-28"
      }
    },
    {
      "title": "신용점수는 실제로 어떻게 작용하는가",
      "items": [
        "주택도시기금 상품은 신용점수 하한을 제시하지 않는다. 대신 연체·대위변제·부도·금융질서문란·공공기록·특수기록·신용회복지원 등록정보가 있으면 대출이 불가하다",
        "은행 상품의 신용점수별 적용금리는 어느 은행도 공개하지 않는다(미확인). 이 프로그램의 은행 금리는 공시 구간이며 개인별 금리는 다르다",
        "보증기관 심사가 별도로 있다. 은행 심사를 통과해도 HF·HUG 보증 심사에서 거절되면 대출이 나오지 않는다",
        "HF 특례전세자금보증의 무주택 청년 특례는 상환능력별 보증한도만 생략되고 CSS 신용평가는 유지된다. 신용거래 이력이 아예 없는 20대는 이 단계에서 불리할 수 있다",
        "신용점수를 올리려면 통신비·공공요금 납부실적을 신용평가사에 등록하고, 소액이라도 카드 실적을 꾸준히 만드는 것이 도움이 된다"
      ],
      "source": {
        "name": "한국신용정보원 신용정보관리규약 · 한국주택금융공사 보증 안내",
        "url": "https://www.hf.go.kr/ko/sub02/sub02_01_01.do",
        "asof": "2026-09-28"
      }
    },
    {
      "title": "흔한 거절 사유",
      "items": [
        "임대인이 전세대출에 동의하지 않는 경우",
        "신탁등기된 주택인 경우. 신탁사 동의 없이는 진행되지 않는다",
        "건축물대장에 위반건축물로 기재된 경우",
        "선순위 근저당과 보증금 합계가 주택가격 대비 과다한 경우. HUG 전세보증금반환보증은 담보인정비율 90%를 적용한다",
        "보증기관 한도가 부족한 경우. 기금 대출한도와 별개로 HF·HUG 보증한도가 실제 승인액을 제약한다",
        "소득 대비 한도가 부족한 경우. 하나은행 고정금리 상품은 연간소득 5.0배 이내 제한이 있다",
        "기금대출·은행재원 전세자금대출·주택담보대출을 이미 이용 중인 경우",
        "대출접수일 현재 공공임대주택에 입주 중인 경우"
      ],
      "source": {
        "name": "주택도시기금 · 한국주택금융공사 · 주택도시보증공사 안내",
        "url": "https://nhuf.molit.go.kr/",
        "asof": "2026-09-28"
      }
    },
    {
      "title": "보증기관에 따라 조건이 달라진다",
      "items": [
        "같은 전세대출도 어느 기관 보증을 받느냐에 따라 한도와 신청기한이 달라진다",
        "HF 전세자금보증은 대출보증만 취급하고 반환보증은 별도 가입한다. 한도는 소득과 신용도에 따라 결정된다",
        "HUG 전세금안심대출보증은 전세보증금반환보증과 대출보증이 분리되지 않는다. 한도는 신청인 소득과 목적물에 따라 결정된다",
        "HF 일반전세자금보증의 기준보증료율은 임차보증금 1억원 이하 0.06%, 1~2억원 0.08%, 2~3억원 0.10%, 3~4억원 0.12%, 4억원 초과 구간은 0.20%까지 올라간다",
        "HF 보증비율은 대출금액의 90%이며 수도권·규제지역은 80%다. 보증한도는 과목별 4억원, 임차보증금의 80%, 상환능력별 한도 중 가장 작은 금액이다",
        "보증금이 HF·HUG 한도를 넘으면 SGI서울보증이 유일한 경로가 될 수 있다. SGI 요건·한도·보증료율은 이 자료에서 확인되지 않는다(미확인)"
      ],
      "source": {
        "name": "한국주택금융공사 전세자금보증 · 주택도시기금 보증 종류별 안내",
        "url": "https://www.hf.go.kr/ko/sub02/sub02_01_01.do",
        "asof": "2026-09-28"
      }
    },
    {
      "title": "2026년 제도 변경과 예고된 사항",
      "items": [
        "2025-06-27 가계부채 관리 강화 방안으로 청년전용 버팀목 호당한도가 2억원에서 1.5억원으로 축소됐다. 그 이전 계약 체결 건은 종전 한도가 적용된다",
        "2025-12-15 기금 순자산 기준이 3억 3,700만원에서 3억 4,500만원으로 변경됐다. 자산기준은 매년 통계청 가계금융복지조사 결과에 연동된다",
        "2027-01-01부터 전세자금보증 보증비율 축소와 보증 제한대상 확대가 시행 예정이다. 무주택자는 현행 유지로 발표됐다",
        "금융위원회가 청년미래보금자리론, 청년 전월세결합보증, 청년특례 만 39세 확대를 발표했다. 다만 원문에 「상품안(案)」과 「세부사항 추후 확정」으로 표기돼 있어 확정 상품이 아니다",
        "무주택자 전세대출과 정책대출에 대한 DSR 적용은 2026-09-28 기준 적용되지 않는다. 검토 대상으로 남아 있어 이 프로그램의 전제가 바뀔 수 있다",
        "부동산 전자계약 우대금리 0.1%p는 2026-12-31 신규 접수분까지다. 2027년 이후 연장 여부는 확인되지 않는다(미확인)"
      ],
      "source": {
        "name": "국토교통부 · 금융위원회 보도자료, 주택도시기금 공지사항",
        "url": "https://www.fsc.go.kr/no010101",
        "asof": "2026-09-28"
      }
    },
    {
      "title": "이 프로그램을 쓸 때 주의할 점",
      "items": [
        "여기 표시되는 금리·한도는 공개 자료를 근거로 한 추정치다. 실제 승인 여부와 조건은 은행 심사와 보증기관 심사에서 정해진다",
        "금융회사의 이자율과 거래조건은 수시로 바뀌고 공시가 지연될 수 있다. 신청 전에 해당 금융회사에 직접 확인해야 한다",
        "버팀목 계열은 변동금리다. 국토교통부 고시금리가 바뀌면 이미 대출받은 사람의 금리도 함께 변동된다",
        "우대금리는 상한(0.5%p, 일부 1.0%p)이 있어 항목을 단순히 더할 수 없다. 이 프로그램은 우대 항목을 목록으로만 보여 주고 금리에서 자동으로 빼지 않는다",
        "지자체 사업은 연도별 공고에 따라 접수기간과 요건이 바뀐다. 표시된 상태가 현재와 다를 수 있으므로 공고를 직접 확인해야 한다",
        "「미확인」으로 표시된 항목은 공개 자료에서 확인되지 않은 내용이다. 추정해서 채우지 않았다"
      ],
      "source": {
        "name": "금융감독원 금융상품통합비교공시 유의사항",
        "url": "https://finlife.fss.or.kr/",
        "asof": "2026-09-28"
      }
    }
  ],
  "pending_review": [],
  "last_checked": "2026-09-28 18:09"
};
