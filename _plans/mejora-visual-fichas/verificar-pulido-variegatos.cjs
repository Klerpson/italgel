const fs=require('fs'),os=require('os'),path=require('path');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const mode=process.argv.includes('vivo')?'vivo':'local',base=mode==='vivo'?'https://italgel.com.co':'http://127.0.0.1:4178';
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 const dir=path.join(os.tmpdir(),'italgel-pulido');fs.mkdirSync(dir,{recursive:true});
 for(const width of [320,390,768,1440]){
  const p=await b.newPage({viewport:{width,height:900},deviceScaleFactor:width===390?2:1});
  await p.goto(base+'/variegatos-helado/',{waitUntil:'load'});
  await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  const show=async(selector,name)=>{
   const e=p.locator(selector).first();await e.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-90,behavior:'instant'}));
   await p.waitForTimeout(180);
   for(const i of await e.locator('img').all())if(await i.isVisible())await i.evaluate(i=>i.decode());
   if([390,1440].includes(width))await p.screenshot({path:path.join(dir,mode+'-'+width+'-'+name+'.png')});
  };
  await show('[data-hero]','cabecera');
  const hero=await p.locator('[data-hero] img').evaluate(i=>({src:new URL(i.currentSrc).pathname,alt:i.alt,width:i.width,height:i.height,frameHeight:i.parentElement.getBoundingClientRect().height,fit:getComputedStyle(i).objectFit}));
  await show('.catalogo-familias','catalogo');
  await show('.familia-variegatos:nth-child(2)','chocolate');
  const catalog=await p.locator('.catalogo-familias').evaluate(e=>[...e.children].map(f=>({y:f.getBoundingClientRect().y,photoInCard:!!f.querySelector('.filas-locales img'),cards:[...f.querySelectorAll('.filas-locales > div')].map(c=>({y:c.getBoundingClientRect().y,width:c.getBoundingClientRect().width}))})));
  await show('section:has(> table)','tabla');
  const table=p.locator('table');await table.focus();
  for(let n=0;n<12;n++)await p.keyboard.press('ArrowRight');await p.waitForTimeout(250);
  const tableData=await table.evaluate(t=>({left:t.scrollLeft,scroll:t.scrollWidth,width:t.clientWidth,columns:t.querySelectorAll('th').length}));
  const hint=await p.locator('.tabla-ayuda').isVisible();
  await p.locator('.flotante').evaluate(e=>{e.removeAttribute('data-oculto');e.classList.add('es-invitando')});
  const bubble=await p.locator('.flotante__burbuja').evaluate(e=>({width:e.getBoundingClientRect().width,clip:getComputedStyle(e).clipPath,opacity:getComputedStyle(e).opacity}));
  if([390,1440].includes(width))await p.screenshot({path:path.join(dir,mode+'-'+width+'-tabla-final.png')});
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  const errors=[];
  if(!hero.src.includes('variegatos-vitrina-hero')||hero.fit!=='cover'||Math.abs(hero.height-hero.frameHeight)>2)errors.push('Cabecera incorrecta o sin llenar el panel');
  if(catalog.length!==3||catalog.some(f=>f.photoInCard||f.cards.length!==3)||(width>=768&&catalog.some(f=>f.cards.some(c=>Math.abs(c.y-f.cards[0].y)>1))))errors.push('Familias o productos desalineados');
  if(width<768&&!hint||tableData.scroll>tableData.width+1&&tableData.left<10||tableData.columns!==5)errors.push('Tabla móvil sin ayuda o sin desplazamiento con teclado');
  if(width<=640&&(bubble.width>2||bubble.clip==='none'))errors.push('Burbuja tapa el contenido móvil');
  if(width>=768&&hint)errors.push('Ayuda móvil visible en escritorio');
  if(overflow)errors.push('Desbordamiento de página');
  results.push({width,hero,catalog,tableData,hint,bubble,overflow,errors});await p.close();
 }
 const regressions=[];
 for(const route of ['/maquinas-helado-soft/','/insumos-heladeria-medellin/','/']){
  const p=await b.newPage({viewport:{width:390,height:844}});await p.goto(base+route,{waitUntil:'load'});
  await p.locator('.flotante').evaluate(e=>{e.removeAttribute('data-oculto');e.classList.add('es-invitando')});
  const data=await p.locator('.flotante').evaluate(e=>({href:e.href,bubbleWidth:e.querySelector('.flotante__burbuja').getBoundingClientRect().width,iconWidth:e.querySelector('.flotante__icono').getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth+2}));
  regressions.push({route,...data,pass:data.bubbleWidth<=2&&data.iconWidth>=44&&!data.overflow});await p.close();
 }
 await b.close();
 const failures=results.filter(r=>r.errors.length);fs.writeFileSync(path.join(__dirname,'variegatos-pulido-'+mode+'.json'),JSON.stringify({mode,results,regressions,failures},null,2));
 console.log(JSON.stringify({mode,checks:results.length,failures,regressions},null,2));if(failures.length||regressions.some(r=>!r.pass))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
