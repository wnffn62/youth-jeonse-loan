const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const src  = fs.readFileSync(require('path').join(__dirname,'..','data','policies.js'),'utf8');

// 엔진을 중복 구현하지 않고 index.html 원본에서 그대로 떼어내 실행한다.
const start = html.indexOf('var OPS = {');
const end   = html.indexOf('/* ---------- 렌더 ---------- */');
if(start<0||end<0) throw new Error('엔진 구간 추출 실패');

const ctx = { window:{}, console };
vm.createContext(ctx);
vm.runInContext(src, ctx);
vm.runInContext(html.slice(start,end), ctx);
const D = ctx.window.POLICY_DATA;
const { evalRules, pickRate, calcLimit } = ctx;

function mkInput(o){
  const i = Object.assign({
    age:27, marital:'single', income:3500, spouse:0, employment:'sme', tenure:24,
    credit:870, assets:5000, region:'seoul', area:85, deposit:12000, ownFund:2000,
    monthly:0, household:'head', noHome:true, firstTime:true, subscription:false, delinquent:false
  }, o);
  i.householdIncome = i.marital==='married' ? i.income+i.spouse : i.income;
  i.need = Math.max(0, i.deposit - i.ownFund);
  i.hasIncomeProof = ['sme','large','public','contract'].includes(i.employment) && i.tenure>=3;
  return i;
}
const P = id => D.products.find(p=>p.id===id);

const cases = [
  ['27세 중소기업 연3500 서울 보증금1.2억', {}, 'beotimmok_youth', 2.5, 9600],
  ['동일조건 지방 (0.2%p 인하 적용)',        {region:'other'}, 'beotimmok_youth', 2.3, 9600],
  ['연소득 1800만원 서울 (최저구간)',        {income:1800}, 'beotimmok_youth', 2.2, 9600],
  ['연소득 5500만원 (소득요건 초과)',        {income:5500}, 'beotimmok_youth', null, null],
  ['36세 (연령요건 초과)',                   {age:36}, 'beotimmok_youth', null, null],
  ['순자산 4억 (자산요건 초과)',             {assets:40000}, 'beotimmok_youth', null, null],
  ['세대원 (세대주 아님)',                   {household:'member'}, 'beotimmok_youth', null, null],
  ['연체이력 있음',                          {delinquent:true}, 'beotimmok_youth', null, null],
  ['보증금 2.5억 → 상품한도 1.5억 상한',     {deposit:25000, ownFund:3000}, 'beotimmok_youth', 2.5, 15000],
  ['24세 단독세대주 60㎡ 보증금9천',         {age:24, area:60, deposit:9000, ownFund:1000}, 'beotimmok_youth', 2.5, 7200],
  ['일반버팀목 서울 보증금1.2억 연3500',     {}, 'beotimmok_general', 2.9, 8400],
  ['일반버팀목 지방 보증금4천 연1800',       {region:'other', income:1800, deposit:4000, ownFund:500}, 'beotimmok_general', 2.3, 2800],
  ['일반버팀목 지방 보증금4천 연3500',       {region:'other', deposit:4000, ownFund:500}, 'beotimmok_general', 2.5, 2800],
  ['일반버팀목 지방 한도 8천만원 상한',      {region:'other', deposit:20000, ownFund:1000}, 'beotimmok_general', 2.7, 8000],
  ['월세계약 보증금5천 월50만원',            {deposit:5000, monthly:50, area:60, ownFund:500}, 'youth_monthly_deposit', 1.3, 3500],
  ['전세인데 월세상품 (월세 0)',             {}, 'youth_monthly_deposit', null, null],
  ['중기청대출 (신규중단)',                  {}, 'sme_youth_discontinued', null, null],
  ['케이뱅크 재직2개월 (3개월 미만)',        {tenure:1}, 'kbank_youth', null, null],
];

let pass=0, fail=0;
for(const [label, over, pid, wantRate, wantLimit] of cases){
  const inp = mkInput(over), p = P(pid);
  const ev = evalRules(p, inp), rate = pickRate(p, inp), lim = calcLimit(p, inp);
  const eligible = ev.verdict === 'eligible';
  let ok, detail;
  if(wantRate === null){
    ok = !eligible;
    detail = ok ? `탈락 확인 — ${(ev.failed[0]||ev.unknown[0]||'').slice(0,58)}` : '기대=탈락 실제=통과';
  } else {
    const r = rate ? rate.rate : null;
    ok = eligible && r === wantRate && lim.amount === wantLimit;
    detail = eligible
      ? `금리 ${r}% (기대 ${wantRate}) · 한도 ${lim.amount}만원 (기대 ${wantLimit}) · 제약=${lim.binding}`
      : `예상과 달리 탈락 — ${(ev.failed.concat(ev.unknown)).join(', ').slice(0,80)}`;
  }
  console.log(`${ok?'  통과':'  실패'}  ${label}`);
  console.log(`        ${detail}`);
  ok?pass++:fail++;
}
console.log(`\n통과 ${pass} · 실패 ${fail}`);
process.exit(fail?1:0);
