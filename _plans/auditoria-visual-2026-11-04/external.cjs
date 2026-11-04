const fs=require('fs');
const {chromium}=require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const all=JSON.parse(fs.readFileSync(__dirname+'/externos.json','utf8'));
const urls=Object.keys(all).filter(u=>!['wa.me','maps.googleapis.com','fonts.googleapis.com','fonts.gstatic.com','www.googletagmanager.com','cdn.lordicon.com'].includes(new URL(u).hostname));
const results=[];
async function work(){while(urls.length){const url=urls.shift();try{const r=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'Mozilla/5.0'}});results.push({url,status:r.status,final:r.url,pages:all[url]});await r.body?.cancel();}catch(e){results.push({url,error:e.message,pages:all[url]});}}}
await Promise.all(Array.from({length:6},work));
// The current public home is sampled only to identify version drift, never as a substitute for local QA.
try{const r=await fetch('https://italgel.com.co/',{signal:AbortSignal.timeout(20000)});const t=await r.text();results.push({url:'https://italgel.com.co/',status:r.status,mercato:t.includes('/css/mercato.css'),title:t.match(/<title>(.*?)<\/title>/)?.[1]});}catch(e){results.push({url:'https://italgel.com.co/',error:e.message});}
fs.writeFileSync(__dirname+'/externos-estados.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(({url,status,error,final,mercato})=>({url,status,error,final,mercato})),null,2));
})();
