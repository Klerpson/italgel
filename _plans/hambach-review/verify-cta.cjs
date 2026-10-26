const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const base=process.env.CTA_BASE||'http://127.0.0.1:4174';
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage();
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  await page.goto(base+'/equipos-cafe/?revision=cta-italgel',{waitUntil:'networkidle'});
  const result=await page.locator('.cafe-copy').evaluate(el=>{
   const links=[...el.querySelectorAll('a')]; const a=links[0]; const r=a.getBoundingClientRect();
   return {texto:a.textContent,principal:a.classList.contains('boton_1'),destino:a.href,orden:links.map(a=>a.textContent),visible:r.top>=0&&r.bottom<=innerHeight,desbordamiento:document.documentElement.scrollWidth>innerWidth};
  });
  console.log(JSON.stringify({width,...result}));
  if(result.texto!=='Cotizar con Italgel'||!result.principal||!result.destino.startsWith('https://wa.me/573192346788')||!result.visible||result.desbordamiento)throw Error('CTA incorrecto');
  await page.screenshot({path:'C:/Users/Camilo/.codex/visualizations/2026/10/26/01a17952-c6f3-7341-9635-824b4183d88a/cta-italgel-'+width+(process.env.CTA_BASE?'-produccion':'-local')+'.png'});
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
