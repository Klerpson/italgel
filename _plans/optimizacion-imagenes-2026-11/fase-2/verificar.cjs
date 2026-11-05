const fs=require('fs'),path=require('path'),http=require('http'),crypto=require('crypto');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const ROOT=path.resolve(__dirname,'../../..'),SITE=path.join(ROOT,'_site'),stage=process.argv[2]||'despues',OUT=path.join(__dirname,stage);fs.mkdirSync(OUT,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.avif':'image/avif','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer((req,res)=>{let p=path.join(SITE,decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==SITE&&!p.startsWith(SITE+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');if(!fs.existsSync(p)){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');fs.createReadStream(p).pipe(res);});
const urls=['/','/blog/',...fs.readdirSync(path.join(ROOT,'_posts')).filter(f=>f.endsWith('.md')&&!/^published:\s*false\s*$/m.test(fs.readFileSync(path.join(ROOT,'_posts',f),'utf8').split('---')[1])).map(f=>'/blog/'+f.replace(/^\d{4}-\d{2}-\d{2}-/,'').replace(/\.md$/,'')+'/')];
(async()=>{
 await new Promise(r=>server.listen(4176,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 for(const dpr of [1,2]){
  const context=await browser.newContext({deviceScaleFactor:dpr});await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  for(const url of urls){
   if(dpr===2&&!['/','/blog/','/blog/tipos-de-toppings-para-helado/','/blog/como-calcular-overrun-helado-artesanal/','/blog/que-es-gelato-vs-helado-diferencias/'].includes(url))continue;
   for(const width of [390,768,1440]){
    const page=await context.newPage();await page.setViewportSize({width,height:1000});const errors=[],responses=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{const u=new URL(r.url());if(u.hostname==='127.0.0.1'){const file=path.join(SITE,u.pathname);responses.push({path:u.pathname,status:r.status(),bytes:fs.existsSync(file)&&fs.statSync(file).isFile()?fs.statSync(file).size:0});}});
    const response=await page.goto('http://127.0.0.1:4176'+url,{waitUntil:'load'});
    const imgs=page.locator('main img');for(let i=0;i<await imgs.count();i++){await imgs.nth(i).scrollIntoViewIfNeeded();await imgs.nth(i).evaluate(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,5000))]));}
    await page.waitForTimeout(120);
    const m=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,scrollWidth:document.documentElement.scrollWidth,text:document.querySelector('main').textContent.replace(/\s+/g,' ').trim(),preloads:[...document.querySelectorAll('link[as="image"]')].map(e=>({href:new URL(e.href).pathname,srcset:e.imageSrcset,sizes:e.imageSizes,media:e.media})),images:[...document.querySelectorAll('main img')].map(i=>{const r=i.getBoundingClientRect();return {src:new URL(i.currentSrc||i.src).pathname,raw:new URL(i.src).pathname,alt:i.alt,title:i.title,width:i.getAttribute('width'),height:i.getAttribute('height'),srcset:i.srcset,sizes:i.sizes,box:[r.width,r.height],fit:getComputedStyle(i).objectFit,bad:!i.naturalWidth,hero:!!i.closest('.articulo-cabecera__foto,.portada__foto')};})}));
    m.textHash=crypto.createHash('sha256').update(m.text).digest('hex');delete m.text;
    const imageResponses=responses.filter(r=>r.path.startsWith('/img/'));
    results.push({url,width,dpr,status:response.status(),errors,badResponses:responses.filter(r=>r.status>=400),imageResponses,imageBytes:imageResponses.reduce((n,r)=>n+r.bytes,0),...m});
    if(dpr===1&&[390,1440].includes(width)&&['/blog/tipos-de-toppings-para-helado/','/blog/como-calcular-overrun-helado-artesanal/','/blog/que-es-gelato-vs-helado-diferencias/'].includes(url)){await Promise.resolve();}
    await page.close();
   }
  }await context.close();console.log(`${stage}: DPR ${dpr}, ${results.length} comprobaciones`);
 }
 fs.writeFileSync(path.join(OUT,'navegador.json'),JSON.stringify(results,null,2));
 const failures=results.filter(r=>r.status!==200||r.errors.length||r.badResponses.length||r.h1!==1||r.images.some(i=>i.bad||!i.alt||!i.width||!i.height)||r.scrollWidth>r.width+2);
 const summary={checks:results.length,failures:failures.map(r=>({url:r.url,width:r.width,dpr:r.dpr,errors:r.errors,bad:r.badResponses,scrollWidth:r.scrollWidth})),bytes:results.filter(r=>r.dpr===1&&r.width===390).map(r=>({url:r.url,bytes:r.imageBytes}))};
 fs.writeFileSync(path.join(OUT,'resumen.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
