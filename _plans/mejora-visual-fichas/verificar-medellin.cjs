const fs=require('fs'),path=require('path'),os=require('os');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const live=process.argv.includes('vivo'),base=live?'https://italgel.com.co':'http://127.0.0.1:4178',mode=live?'vivo':'local';
const temp=path.join(os.tmpdir(),'italgel-piloto-medellin');fs.mkdirSync(temp,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 const cases=[...[320,390,768,960,1440].map(width=>({url:'/insumos-heladeria-medellin/',width,dpr:1})),...[390,1440].map(width=>({url:'/insumos-heladeria-medellin/',width,dpr:2})),...['/','/insumos-heladeria-cali/','/pastas-sabores-helado/pasta-vainilla/'].flatMap(url=>[390,1440].map(width=>({url,width,dpr:1})))];
 for(const test of cases){
  const ctx=await browser.newContext({viewport:{width:test.width,height:1000},deviceScaleFactor:test.dpr});
  await ctx.route('**/*',r=>['127.0.0.1','italgel.com.co','www.italgel.com.co'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
  const page=await ctx.newPage(),errors=[],bad=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)bad.push({url:r.url(),status:r.status()})});
  const response=await page.goto(base+test.url,{waitUntil:'load'});
  const initial=await page.evaluate(()=>performance.getEntriesByType('resource').filter(x=>x.initiatorType==='img').map(x=>({url:x.name,bytes:x.encodedBodySize})));
  for(const img of await page.locator('main img').all()){
   if(await img.evaluate(i=>getComputedStyle(i).display==='none'))continue;
   await img.scrollIntoViewIfNeeded();await img.evaluate(async i=>{for(let n=0;n<3;n++){try{await i.decode()}catch{}if(i.complete&&i.naturalWidth)return;await new Promise(r=>setTimeout(r,150))}});
  }
  const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+2,broken:[...document.querySelectorAll('main img')].filter(i=>getComputedStyle(i).display!=='none'&&!i.naturalWidth).map(i=>i.src),images:[...document.querySelectorAll('.muestras-visuales img,.cta--visual picture img')].map(i=>({src:i.currentSrc,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height,naturalWidth:i.naturalWidth})),imageResources:performance.getEntriesByType('resource').filter(x=>x.initiatorType==='img').map(x=>({url:x.name,bytes:x.encodedBodySize}))}));
  if(test.url==='/insumos-heladeria-medellin/'){
   await page.locator('.demo-helado input').uncheck();if(!await page.locator('.demo-helado__estatica').isVisible()||await page.locator('.demo-helado__animada').isVisible())errors.push('Pausa visual incorrecta');await page.locator('.demo-helado input').check();
   if([390,1440].includes(test.width)&&test.dpr===1){await page.addStyleTag({content:'.cabecera-sitio,.flotante{visibility:hidden!important}'});for(const [name,selector] of [['galeria','.muestras-visuales'],['cierre','.cta--visual']])await page.locator(selector).screenshot({path:path.join(temp,`${mode}-${name}-${test.width}.png`)});}
  }
  results.push({...test,status:response.status(),errors,bad,initialImages:initial,...data});await ctx.close();
 }
 const accessible=[];
 for(const reduced of [false,true]){
  const ctx=await browser.newContext({javaScriptEnabled:false,reducedMotion:reduced?'reduce':'no-preference',viewport:{width:390,height:1000}}),page=await ctx.newPage(),gifs=[];
  page.on('request',r=>{if(r.url().endsWith('.gif'))gifs.push(r.url())});await page.goto(base+'/insumos-heladeria-medellin/',{waitUntil:'load'});await page.locator('.cta--visual').scrollIntoViewIfNeeded();await page.locator('.demo-helado picture img').evaluate(i=>i.decode());const src=await page.locator('.demo-helado picture img').evaluate(i=>i.currentSrc);
  let pause=true,keyboard=true;if(!reduced){await page.locator('.demo-helado input').focus();await page.keyboard.press('Space');pause=await page.locator('.demo-helado__estatica').isVisible()&&!await page.locator('.demo-helado__animada').isVisible();await page.keyboard.press('Space');keyboard=await page.locator('.demo-helado input').isChecked();}
  accessible.push({javaScript:false,reduced,gifRequests:gifs.length,src,pause,keyboard});await ctx.close();
 }
 await browser.close();
 const failures=results.filter(r=>r.status!==200||r.errors.length||r.bad.length||r.broken.length||r.overflow||r.images.some(i=>Math.abs(i.width/i.height-(i.src.includes('.gif')?4/3:1))>.02));
 const summary={mode,checks:results.length,failures,accessible,results};fs.writeFileSync(path.join(__dirname,`medellin-navegador-${mode}.json`),JSON.stringify(summary,null,2));console.log(JSON.stringify({mode,checks:results.length,failures,accessible},null,2));if(failures.length||accessible.some(x=>!x.pause||!x.keyboard||(x.reduced&&x.gifRequests)))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
