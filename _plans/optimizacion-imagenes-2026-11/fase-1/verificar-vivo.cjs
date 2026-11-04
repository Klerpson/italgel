const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const ROOT=path.resolve(__dirname,'../../..'),OUT=path.join(__dirname,'produccion-2026-11-04'),BASE='https://italgel.com.co';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const metadata=JSON.parse(fs.readFileSync(path.join(ROOT,'_data/imagenes_cafe.json'),'utf8'));const assets=[],queue=Object.values(metadata).flatMap(x=>x.variants);
 async function checkAssets(){while(queue.length){const v=queue.shift();try{const r=await fetch(BASE+v.src,{signal:AbortSignal.timeout(20000),headers:{'Cache-Control':'no-cache'}});const b=Buffer.from(await r.arrayBuffer());const local=fs.readFileSync(path.join(ROOT,v.src));assets.push({path:v.src,status:r.status,type:r.headers.get('content-type'),bytes:b.length,sha256:hash(b),matchesLocal:hash(b)===hash(local),cache:r.headers.get('cache-control')});}catch(e){assets.push({path:v.src,error:e.message});}}}
 await Promise.all(Array.from({length:5},checkAssets));fs.writeFileSync(path.join(OUT,'archivos.json'),JSON.stringify(assets,null,2));
 const browser=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 const urls=['/','/equipos-cafe/',...Object.keys(metadata).map(s=>`/equipos-cafe/${s}/`)];
 for(const dpr of [1,2]){
  const context=await browser.newContext({deviceScaleFactor:dpr});
  // Prevent analytics events during this verification; site resources are fetched normally.
  await context.route('**/*',r=>['italgel.com.co','www.italgel.com.co'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
  for(const url of urls){
   if(dpr===2&&!['/','/equipos-cafe/','/equipos-cafe/mini-neo/','/equipos-cafe/cedar-63c/'].includes(url))continue;
   for(const width of [390,768,1440]){
    const page=await context.newPage();await page.setViewportSize({width,height:1000});const errors=[],badResponses=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(['italgel.com.co','www.italgel.com.co'].includes(new URL(r.url()).hostname)&&r.status()>=400)badResponses.push({url:r.url(),status:r.status()});});
    try{
     const response=await page.goto(BASE+url,{waitUntil:'load',timeout:30000});
     await page.locator('main img').evaluateAll(async a=>{for(const i of a){i.scrollIntoView({behavior:'instant',block:'center'});await Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,5000))]);}});
     await page.waitForTimeout(120);
     const m=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,scrollWidth:document.documentElement.scrollWidth,broken:[...document.querySelectorAll('main img')].filter(i=>!i.naturalWidth).map(i=>i.src),css:[...document.styleSheets].filter(s=>s.href).map(s=>({href:s.href,rules:s.cssRules.length})),cards:[...document.querySelectorAll('main img[src*="/img/cafe/tarjetas/"]')].map(i=>{const r=i.getBoundingClientRect(),p=i.parentElement.getBoundingClientRect(),s=getComputedStyle(i);return {src:new URL(i.currentSrc).pathname,box:[r.width,r.height],parent:[p.width,p.height],scale:s.scale,fit:s.objectFit,padding:s.padding,alt:i.alt,sizes:i.sizes,srcset:i.srcset,clipped:r.width>p.width+1||r.height>p.height+1}})}));
     const expected=url==='/'?3:url==='/equipos-cafe/'?10:url.includes('cedar-63c')||url.includes('oak-60')||url.includes('ebony-64')||url.includes('sequoia-74wt')?3:5;
     results.push({url,width,dpr,status:response.status(),final:page.url(),expectedCards:expected,errors,badResponses,...m});
     if(dpr===1&&url==='/equipos-cafe/'&&[390,1440].includes(width))await page.locator('#molinos').screenshot({path:path.join(OUT,`molinos-${width}.jpg`),type:'jpeg',quality:88});
     if(dpr===1&&url==='/'&&width===1440)await page.locator('section[aria-labelledby="titulo-cafe"]').screenshot({path:path.join(OUT,'inicio-cafe-1440.jpg'),type:'jpeg',quality:88});
    }catch(e){results.push({url,width,dpr,error:e.message,errors,badResponses});}
    await page.close();
   }
  }await context.close();console.log(`DPR ${dpr}: ${results.length} comprobaciones`);
 }
 await browser.close();fs.writeFileSync(path.join(OUT,'navegador.json'),JSON.stringify(results,null,2));
 const failures=results.filter(r=>r.error||r.status!==200||r.errors.length||r.badResponses.length||r.broken?.length||r.h1!==1||r.cards.length!==r.expectedCards||r.cards.some(i=>i.scale!=='none'||i.clipped||i.fit!=='contain'||!i.srcset));
 const receipt={checkedAt:new Date().toISOString(),base:BASE,assetCount:assets.length,assetFailures:assets.filter(a=>a.status!==200||!a.matchesLocal||a.type!=='image/avif'),browserChecks:results.length,browserFailures:failures,overflow:results.filter(r=>r.scrollWidth>r.width+2).map(r=>({url:r.url,width:r.width,dpr:r.dpr,scrollWidth:r.scrollWidth}))};
 fs.writeFileSync(path.join(OUT,'resumen.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
