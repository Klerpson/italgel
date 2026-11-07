const fs=require('fs'),os=require('os'),path=require('path');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const before=process.argv.includes('antes'),mode=before?'antes':process.argv.includes('vivo')?'vivo':'local',base=mode==='local'?'http://127.0.0.1:4178':'https://italgel.com.co';
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 const dir=path.join(os.tmpdir(),'italgel-vitrinas');fs.mkdirSync(dir,{recursive:true});
 const cases=before?[{width:390,dpr:2},{width:1440,dpr:1}]:[...[320,390,768,960,1440].map(width=>({width,dpr:1})),{width:390,dpr:2},{width:1440,dpr:2}];
 for(const test of cases){
  const ctx=await b.newContext({viewport:{width:test.width,height:900},deviceScaleFactor:test.dpr});
  await ctx.route('**/*',r=>['127.0.0.1','italgel.com.co','www.italgel.com.co'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
  const p=await ctx.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+':'+r.url())});
  const response=await p.goto(base+'/vitrinas-congeladores/',{waitUntil:'load'});
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
  const transfer=()=>p.evaluate(()=>{const own=u=>new URL(u).origin===location.origin;const list=performance.getEntriesByType('resource').filter(r=>own(r.name));const nav=performance.getEntriesByType('navigation')[0];return{sameOriginEncodedBytes:nav.encodedBodySize+list.reduce((s,r)=>s+r.encodedBodySize,0),requests:list.length+1,images:list.filter(r=>/\.(avif|webp|png|svg|gif|jpg)(\?|$)/.test(r.name)).map(r=>({url:new URL(r.name).pathname,bytes:r.encodedBodySize})),gifRequested:list.some(r=>r.name.endsWith('.gif'))}});
  const initial=await transfer();
  if(!before&&initial.gifRequested)errors.push('GIF solicitado al abrir');
  if(!before){const hints=await p.evaluate(()=>{const i=document.querySelector(".portada__foto img"),h=document.querySelector("link[rel=preload][as=image]");return {match:h?.getAttribute("href")===i.getAttribute("src")&&h?.getAttribute("imagesrcset")===i.getAttribute("srcset")&&h?.getAttribute("imagesizes")===i.getAttribute("sizes"),old:performance.getEntriesByType("resource").some(r=>r.name.includes("vitrinas-congeladores-"))}});if(!hints.match||hints.old)errors.push("Precarga incorrecta o collage solicitado")}
  for(const i of await p.locator('main img').all()){if(!await i.isVisible())continue;await i.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));await i.evaluate(e=>e.decode())}
  const full=await transfer();
  const layout=await p.evaluate(()=>{
   const images=[...document.querySelectorAll('main img')].filter(i=>i.getClientRects().length);
   const texts=[...document.querySelectorAll('main p,main h2,main h3,main h4,main li')].filter(e=>!e.closest('[data-visual-nuevo]'));
   return {overflow:document.documentElement.scrollWidth>innerWidth+2,broken:images.filter(i=>!i.naturalWidth).map(i=>i.src),images:images.map(i=>({src:new URL(i.currentSrc).pathname,width:i.width,height:i.height})),between:images.slice(1).map((i,n)=>({before:new URL(images[n].src).pathname,after:new URL(i.src).pathname,words:texts.filter(t=>(images[n].compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING)&&(t.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_FOLLOWING)).map(t=>t.textContent.trim()).join(' ').split(/\s+/).filter(Boolean).length})),groups:[...document.querySelectorAll('.catalogo-vitrinas .two_columns')].map(g=>[...g.children].map(c=>({x:c.getBoundingClientRect().x,y:c.getBoundingClientRect().y,width:c.getBoundingClientRect().width})))}});
  if(!before){
   if(layout.groups.length!==1||layout.groups.some(g=>g.length!==2||g.some(c=>c.width<=0)||(test.width>=960&&g.some(c=>Math.abs(c.y-g[0].y)>1))))errors.push('Componentes desalineados');
   const t=p.locator('table');await t.focus();for(let n=0;n<12;n++)await p.keyboard.press('ArrowRight');await p.waitForTimeout(200);
   const scroll=await t.evaluate(t=>({left:t.scrollLeft,width:t.clientWidth,scroll:t.scrollWidth}));if(scroll.scroll>scroll.width+1&&scroll.left<10)errors.push('Tabla no accesible con teclado');await t.evaluate(t=>{t.scrollLeft=0});
   if(test.width<768&&!await p.locator('.tabla-ayuda').isVisible())errors.push('Falta indicación móvil de tabla');
   if(!await p.locator('.demo-helado__animada').isVisible()||await p.locator('.demo-helado__estatica').isVisible())errors.push('GIF/fotograma visibles incorrectamente');
   await p.locator('.flotante').evaluate(e=>{e.removeAttribute('data-oculto');e.classList.add('es-invitando')});await p.waitForTimeout(300);
   const bubble=await p.locator('.flotante__burbuja').evaluate(e=>({opacity:Number(getComputedStyle(e).opacity),width:e.getBoundingClientRect().width,clip:getComputedStyle(e).clipPath}));
   if(bubble.opacity>0.01||test.width<=640&&bubble.width>2)errors.push('Invitación automática tapa contenido');
  }
  if(layout.between.some(x=>x.words<20))errors.push('Medios consecutivos sin explicación');
  if(test.dpr===(test.width===390?2:1)&&[390,1440].includes(test.width)){
   await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
   const height=await p.locator('body').evaluate(e=>e.scrollHeight);for(let y=0,n=0;y<height;y+=720,n++){await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await p.waitForTimeout(80);await p.screenshot({path:path.join(dir,`${mode}-${test.width}-recorrido-${n}.png`)})}
   const sections=await p.locator('main > section,main .contenido-legado > section').all();
   for(let n=0;n<sections.length;n++){
    const e=sections[n];await e.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-90,behavior:'instant'}));await p.waitForTimeout(120);
    await p.screenshot({path:path.join(dir,`${mode}-${test.width}-${n}.png`)});
   }
  }
  results.push({...test,status:response.status(),initial,full,...layout,errors});await ctx.close();
 }
 const accessible=[];
 if(!before)for(const reduced of [false,true]){
  const ctx=await b.newContext({javaScriptEnabled:false,reducedMotion:reduced?'reduce':'no-preference',viewport:{width:390,height:844}}),p=await ctx.newPage();let gifs=0;p.on('request',r=>{if(r.url().endsWith('.gif'))gifs++});
  await p.goto(base+'/vitrinas-congeladores/#animacion-vitrinas',{waitUntil:'load'});await p.locator('.demo-helado').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));await p.locator('.demo-helado picture img').evaluate(i=>i.decode());
  const initial=gifs;let pass=true;
  if(reduced){const c=p.locator('.demo-helado__activar input');const loaded=p.waitForResponse(r=>r.url().endsWith('.gif')&&r.status()===200);await c.focus();await p.keyboard.press('Space');await loaded;pass=await p.locator('.demo-helado__manual').isVisible()&&initial===0;await p.keyboard.press('Space');pass=pass&&!await p.locator('.demo-helado__manual').isVisible()}
  else{const c=p.locator('.demo-helado figcaption >label:first-child input');await c.focus();await p.keyboard.press('Space');pass=await p.locator('.demo-helado__estatica').isVisible();await p.keyboard.press('Space');pass=pass&&await p.locator('.demo-helado__animada').isVisible()}
  accessible.push({reduced,javaScript:false,initialGifRequests:initial,afterActivation:gifs,pass});await ctx.close();
 }
 const regressions=[];
 await b.close();const failures=results.filter(r=>r.status!==200||r.errors.length||r.overflow||r.broken.length);
 const result={mode,results,accessible,regressions,failures};fs.writeFileSync(path.join(__dirname,`vitrinas-navegador-${mode}.json`),JSON.stringify(result,null,2));console.log(JSON.stringify({mode,checks:results.length,failures,accessible,regressions,transfer:results.map(r=>({width:r.width,dpr:r.dpr,initial:r.initial.sameOriginEncodedBytes,full:r.full.sameOriginEncodedBytes,initialGif:r.initial.gifRequested}))},null,2));if(failures.length||accessible.some(a=>!a.pass)||regressions.some(a=>!a.pass))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
