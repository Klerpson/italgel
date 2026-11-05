const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'../..'),site=path.join(root,'_site'),out=__dirname;
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.avif':'image/avif','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer((req,res)=>{let p=path.join(site,decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!p.startsWith(site+path.sep)&&p!==site){res.writeHead(403).end();return;}if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');if(!fs.existsSync(p)&&!path.extname(p))p+='.html';if(!fs.existsSync(p)){res.writeHead(404).end('404');return;}res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');fs.createReadStream(p).pipe(res);});
(async()=>{
 await new Promise(r=>server.listen(4176,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const context=await browser.newContext({deviceScaleFactor:1});
 // Do not send analytics from audit sessions; third-party errors are excluded.
 await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname==='127.0.0.1'?route.continue():route.abort();});
 const pages=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))pages.push('/'+path.relative(site,p).split(path.sep).join('/').replace(/index\.html$/,''));}}walk(site);
 const results=[];let n=0;
 for(const url of pages){
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const result={url,errors,viewports:[]};
  for(const width of [390,768,1440]){
   await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4176'+url,{waitUntil:'load'});await page.waitForTimeout(70);
   if(await page.locator('meta[http-equiv="refresh"]').count()){result.redirect=true;break;}
   await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(async i=>{i.loading='eager';try{await i.decode()}catch{}}))});
   const r=await page.evaluate(()=>{
    const images=[...document.images].map(i=>{let b=i.getBoundingClientRect(),s=getComputedStyle(i),p=i.parentElement.getBoundingClientRect();const pl=parseFloat(s.paddingLeft)||0,pr=parseFloat(s.paddingRight)||0,pt=parseFloat(s.paddingTop)||0,pb=parseFloat(s.paddingBottom)||0;const w=i.clientWidth-pl-pr,h=i.clientHeight-pt-pb;const scale=s.scale==='none'?1:parseFloat(s.scale);const factor=(s.objectFit==='contain'?Math.min(w/i.naturalWidth,h/i.naturalHeight):s.objectFit==='cover'?Math.max(w/i.naturalWidth,h/i.naturalHeight):w/i.naturalWidth)*scale;
     return {src:new URL(i.currentSrc||i.src).pathname,alt:i.alt,natural:[i.naturalWidth,i.naturalHeight],box:[Math.round(b.width),Math.round(b.height)],fit:s.objectFit,scale:s.scale,factor:+factor.toFixed(2),bad:!i.naturalWidth,widthAttr:i.getAttribute('width'),heightAttr:i.getAttribute('height'),parent:i.parentElement.className,top:Math.round(b.top),crop:s.objectFit==='cover'?+(1-Math.min((w/h)/(i.naturalWidth/i.naturalHeight),(i.naturalWidth/i.naturalHeight)/(w/h))).toFixed(2):0};});
    return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *')].filter(e=>{let b=e.getBoundingClientRect();return b.width>0&&(b.right>innerWidth+2||b.left<-2)&&getComputedStyle(e).position!=='fixed'}).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.trim().slice(0,60)})),images,h1:document.querySelectorAll('h1').length,css:[...document.styleSheets].filter(s=>s.href).map(s=>({href:s.href,rules:s.cssRules.length})),main:!!document.querySelector('main')};
   });result.viewports.push(r);
   const shotPages=['/','/equipos-cafe/','/vitrinas-congeladores/','/insumos/','/equipos/','/nosotros/','/contacto/','/blog/','/equipos-cafe/mini-neo/','/maquinas-helado-soft/','/blog/como-abrir-una-heladeria-en-colombia/'];
   if(shotPages.includes(url)&&width!==768){const name=url==='/'?'inicio':url.replace(/^\//,'').replace(/\/$/,'').replaceAll('/','--');await Promise.resolve();}
  }
  results.push(result);await page.close();n++;if(n%20===0)console.log(`${n}/${pages.length}`);
 }
 fs.writeFileSync(path.join(out,'navegador.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify({pages:results.length,overflows:results.filter(r=>r.viewports.some(v=>v.scrollWidth>v.width+2)).map(r=>r.url),broken:results.filter(r=>r.viewports.some(v=>v.images.some(i=>i.bad))).map(r=>r.url),errors:results.filter(r=>r.errors.length).map(r=>({url:r.url,errors:r.errors}))},null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
