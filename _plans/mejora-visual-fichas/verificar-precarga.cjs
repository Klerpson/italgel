const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const mode=process.argv.includes('vivo')?'vivo':'local',base=mode==='vivo'?'https://italgel.com.co':'http://127.0.0.1:4178';
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'}),results=[];
for(const [route,old] of [['maquinas-helado-industrial','maquina-industrial-helado.avif'],['maquinas-helado-soft','maquina-industrial-soft.avif'],['variegatos-helado','variegatos-helado.avif']])for(const width of [390,1440]){
 const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:2});await ctx.route('**/*',r=>['127.0.0.1','italgel.com.co','www.italgel.com.co'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
 const p=await ctx.newPage();const requests=[];p.on('request',r=>requests.push(new URL(r.url()).pathname));await p.goto(base+'/'+route+'/',{waitUntil:'load'});await p.locator('[data-hero] img').evaluate(i=>i.decode());await p.waitForTimeout(350);
 const data=await p.evaluate(()=>{const img=document.querySelector('[data-hero] img');const resources=performance.getEntriesByType('resource');return{src:new URL(img.currentSrc).pathname,bytes:performance.getEntriesByType('navigation')[0].encodedBodySize+resources.filter(r=>new URL(r.name).origin===location.origin).reduce((a,r)=>a+r.encodedBodySize,0)}});
 const oldRequested=requests.includes('/img/'+old),selectedRequests=requests.filter(r=>r===data.src).length;results.push({route,width,...data,oldRequested,selectedRequests,pass:!oldRequested&&selectedRequests===1});await ctx.close();
}await b.close();fs.writeFileSync(path.join(__dirname,'precarga-red-'+mode+'.json'),JSON.stringify({mode,results},null,2));console.log(JSON.stringify({mode,results},null,2));if(results.some(r=>!r.pass))process.exitCode=1;})().catch(e=>{console.error(e);process.exit(1)});
