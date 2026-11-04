const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..'),out=path.join(__dirname,'vivo');fs.mkdirSync(out,{recursive:true});
const paths=['img/blog/optimizadas','img/catalogo'].flatMap(dir=>fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.avif')).map(f=>dir+'/'+f));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{const results=[];let i=0;
 await Promise.all(Array.from({length:5},async()=>{while(i<paths.length){const file=paths[i++];try{const r=await fetch('https://italgel.com.co/'+file,{signal:AbortSignal.timeout(30000)}),b=Buffer.from(await r.arrayBuffer());results.push({file,status:r.status,bytes:b.length,match:r.ok&&sha(b)===sha(fs.readFileSync(path.join(root,file)))});}catch(e){results.push({file,error:e.message,match:false})}}}));
 const summary={checkedAt:new Date().toISOString(),files:results.length,bytes:results.reduce((n,r)=>n+(r.bytes||0),0),failures:results.filter(r=>!r.match)};
 fs.writeFileSync(path.join(out,'archivos.json'),JSON.stringify(results,null,2));fs.writeFileSync(path.join(out,'archivos-resumen.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));if(summary.failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
