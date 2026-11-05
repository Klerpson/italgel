const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const ROOT=path.resolve(__dirname,'../../..'),SITE=path.join(ROOT,'_site');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.avif':'image/avif','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer((req,res)=>{let p=path.join(SITE,decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==SITE&&!p.startsWith(SITE+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');if(!fs.existsSync(p)){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');fs.createReadStream(p).pipe(res);});
(async()=>{
 await new Promise(r=>server.listen(4176,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'msedge'});const data=JSON.parse(fs.readFileSync(path.join(ROOT,'_data/imagenes_cafe.json'),'utf8'));const results=[];
 const urls=['/','/equipos-cafe/',...Object.keys(data).map(slug=>`/equipos-cafe/${slug}/`)];
 for(const dpr of [1,2]){
  const context=await browser.newContext({deviceScaleFactor:dpr});await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  for(const url of urls){
   if(dpr===2&&!['/','/equipos-cafe/','/equipos-cafe/mini-neo/','/equipos-cafe/cedar-63c/'].includes(url))continue;
   for(const width of [390,768,1440]){
    const page=await context.newPage();await page.setViewportSize({width,height:1000});const errors=[],badResponses=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)badResponses.push(r.url())});
    await page.goto('http://127.0.0.1:4176'+url,{waitUntil:'load'});
    await page.locator('img:not([srcset])').evaluateAll(async a=>Promise.all(a.map(async i=>{i.loading='eager';try{await i.decode()}catch{}})));
    // Keep lazy loading and sizes=auto intact: visit each card as a reader would.
    const cards=page.locator('main img[srcset]');for(let i=0;i<await cards.count();i++){await cards.nth(i).scrollIntoViewIfNeeded();await cards.nth(i).evaluate(i=>i.decode());}
    await page.waitForTimeout(150);
    const metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),cards:[...document.querySelectorAll('main img[src*="/img/cafe/tarjetas/"]')].map(i=>{const r=i.getBoundingClientRect(),p=i.parentElement.getBoundingClientRect(),s=getComputedStyle(i);return {src:new URL(i.currentSrc).pathname,box:[r.width,r.height],parent:[p.width,p.height],scale:s.scale,fit:s.objectFit,padding:s.padding,alt:i.alt,sizes:i.sizes,srcset:i.srcset,natural:[i.naturalWidth,i.naturalHeight],clipped:r.width>p.width+1||r.height>p.height+1}})}));
    for(const card of metrics.cards){const file=path.join(ROOT,card.src);card.bytes=fs.statSync(file).size;const slug=path.basename(card.src).replace(/-\d+\.avif$/,'');card.oldBytes=fs.statSync(path.join(ROOT,'img/cafe',slug+'.avif')).size;}
    results.push({url,width,dpr,errors,badResponses,...metrics});
    if(dpr===1&&url==='/equipos-cafe/'&&[390,1440].includes(width)){
     for(const section of ['casa','molinos'])await Promise.resolve();
    }
    if(dpr===1&&width===1440&&url==='/')await Promise.resolve();
    if(dpr===1&&width===390&&url==='/equipos-cafe/mini-neo/')await Promise.resolve();
    await page.close();
   }
  }await context.close();
 }
 fs.writeFileSync(__dirname+'/validacion.json',JSON.stringify(results,null,2));
 const failures=results.filter(r=>r.errors.length||r.badResponses.length||r.broken.length||r.h1!==1||r.cards.some(i=>i.scale!=='none'||i.clipped||i.fit!=='contain'));
 const savings=results.filter(r=>['/','/equipos-cafe/'].includes(r.url)).map(r=>({url:r.url,width:r.width,dpr:r.dpr,cards:r.cards.length,before:r.cards.reduce((s,i)=>s+i.oldBytes,0),after:r.cards.reduce((s,i)=>s+i.bytes,0)}));
 fs.writeFileSync(__dirname+'/ahorro-pantallas.json',JSON.stringify(savings,null,2));console.log(JSON.stringify({checks:results.length,failures:failures.map(r=>({url:r.url,width:r.width,dpr:r.dpr,errors:r.errors,badResponses:r.badResponses,broken:r.broken,cards:r.cards.filter(i=>i.clipped||i.scale!=='none')})),savings},null,2));
 await browser.close();server.close();if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exit(1)});
