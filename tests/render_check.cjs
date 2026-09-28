// 공개 URL 의 HTML·데이터를 받아 렌더 전제조건을 검사한다.
const https = require('https');
const vm = require('vm');
function get(u){return new Promise((res,rej)=>{https.get(u,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(d));}).on('error',rej);});}
(async()=>{
  const base='https://wnffn62.github.io/youth-jeonse-loan/';
  const html=await get(base), js=await get(base+'data/policies.js');
  const checks=[];
  checks.push(['HTML 수신', html.length>20000, html.length+' bytes']);
  checks.push(['policies.js 참조', html.includes('src="data/policies.js"'), '']);
  checks.push(['title 존재', /<title>[^<]+<\/title>/.test(html), (html.match(/<title>([^<]+)</)||[])[1]||'']);
  checks.push(['viewport 메타', html.includes('name="viewport"'), '']);
  checks.push(['다크모드 대응', html.includes('prefers-color-scheme'), '']);
  checks.push(['body 배경 지정', /body\{[^}]*background:var\(--bg\)/.test(html), '']);
  const ctx={window:{},console};vm.createContext(ctx);vm.runInContext(js,ctx);
  const D=ctx.window.POLICY_DATA;
  checks.push(['데이터 파싱', !!D, D?('상품 '+D.products.length+'건 · 안내 '+D.common_notes.length+'절'):'']);
  checks.push(['기준일', !!D.asof, D.asof]);
  // 엔진 구간이 HTML 에 온전히 있는지
  const s=html.indexOf('var OPS = {'), e=html.indexOf('/* ---------- 렌더 ---------- */');
  checks.push(['엔진 코드 포함', s>0&&e>s, (e-s)+' chars']);
  vm.runInContext(html.slice(s,e),ctx);
  checks.push(['엔진 함수 로드', typeof ctx.evalRules==='function'&&typeof ctx.pickRate==='function', '']);
  // 모든 상품이 금리표·한도·출처를 갖는지
  const bad=D.products.filter(p=>!(p.rate_table&&p.rate_table.length)||!p.limit||!p.source||!p.source.url);
  checks.push(['상품 필수필드', bad.length===0, bad.length?('누락: '+bad.map(x=>x.name).join(', ')):'전 상품 충족']);
  // regions 값 검증
  const okReg=new Set(['seoul','metro','metro_city','other']);
  const badReg=[];
  D.products.forEach(p=>(p.rate_table||[]).forEach(r=>(r.regions||[]).forEach(g=>{if(!okReg.has(g))badReg.push(p.name+':'+g);})));
  checks.push(['지역코드 유효', badReg.length===0, badReg.join(', ')||'전부 유효']);
  let fail=0;
  for(const [n,ok,d] of checks){console.log((ok?'  통과  ':'  실패  ')+n+(d?'  — '+d:''));if(!ok)fail++;}
  console.log('\n실패 '+fail);
  process.exit(fail?1:0);
})();
