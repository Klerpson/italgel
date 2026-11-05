const fs=require('fs'),os=require('os'),path=require('path');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const mode=process.argv.includes('vivo')?'vivo':'local',base=mode==='vivo'?'https://italgel.com.co':'http://127.0.0.1:4178';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 const temp=path.join(os.tmpdir(),'italgel-orden-movil');fs.mkdirSync(temp,{recursive:true});
 for(const width of [360,390,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto(base+'/variegatos-helado/',{waitUntil:'load'});
  for(const img of await page.locator('main img').all()){
   if(!await img.isVisible())continue;
   await img.evaluate(i=>i.scrollIntoView({behavior:'instant',block:'center'}));
   await img.evaluate(i=>i.decode());
  }
  const data=await page.evaluate(()=>{
   const images=[...document.querySelectorAll('main img')].filter(i=>i.getClientRects().length&&getComputedStyle(i).visibility!=='hidden');
   const text=[...document.querySelectorAll('main p,main h2,main h3,main h4,main li')].filter(e=>!e.closest('[data-visual-nuevo]'));
   const pairs=images.slice(1).map((image,n)=>{
    const before=images[n];
    const between=text.filter(t=>(before.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING)&&(t.compareDocumentPosition(image)&Node.DOCUMENT_POSITION_FOLLOWING));
    return {before:new URL(before.src).pathname,after:new URL(image.src).pathname,words:between.map(e=>e.textContent.trim()).join(' ').split(/\s+/).filter(Boolean).length,headings:between.filter(e=>/^H/.test(e.tagName)).map(e=>e.textContent.trim())};
   });
   return {pairs,overflow:document.documentElement.scrollWidth>innerWidth+2,gifSection:document.querySelector('#animacion-variegatos').closest('section').querySelector('h2').textContent.trim()};
  });
  results.push({width,...data});
  if(width===390){
   await page.addStyleTag({content:'.cabecera-sitio,.flotante{visibility:hidden!important}'});
   await page.locator('section:has(#animacion-variegatos)').screenshot({path:path.join(temp,mode+'-tecnica.png')});
   await page.locator('section:has(> .filas-locales)').screenshot({path:path.join(temp,mode+'-catalogo.png')});
  }
  await page.close();
 }
 await browser.close();
 const failures=results.filter(r=>r.overflow||r.pairs.some(p=>p.words<20));
 fs.writeFileSync(path.join(__dirname,'variegatos-orden-'+mode+'.json'),JSON.stringify({mode,results,failures},null,2));
 console.log(JSON.stringify({mode,results,failures},null,2));if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
