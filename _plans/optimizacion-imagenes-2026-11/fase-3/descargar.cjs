const fs=require('fs'),path=require('path'),crypto=require('crypto');
const CACHE=path.join(require('os').tmpdir(),'italgel-imagenes',path.basename(__dirname));fs.mkdirSync(CACHE,{recursive:true});
const OUT=path.join(__dirname,'fuentes');
const assets={stevia:'https://www.mec3.com/Media/prodottigelato-basi/base%20G/base-g-creme-stevia.jpg',fruta:'https://www.mec3.com/Media/prodottigelato-basi/base%20G/base-g-frutte-stevia.jpg',naranja:'https://www.mec3.com/Media/prodottigelato-basi/variegati/fiordiarancio.jpg'};
assets.amarena='https://en.fabbri1905.com/imgpub/2043979/0/0/fabbri-amarena-fabbri22-1104-1920x800px.jpg';
assets.yogurt='https://www.mec3.com/Media/mec3-soft-serve-cream.jpg';
if(fs.existsSync(path.join(OUT,'quella.html'))){const html=fs.readFileSync(path.join(OUT,'quella.html'),'utf8');const src=html.match(/<img[^>]*class="product-details__image"[^>]*src="([^"]+)"/);if(src)assets.quella=new URL(src[1],'https://www.mec3.com').href;}
(async()=>{const rows=[];for(const [name,url] of Object.entries(assets)){const r=await fetch(url,{signal:AbortSignal.timeout(20000)});const bytes=Buffer.from(await r.arrayBuffer());if(r.ok)fs.writeFileSync(path.join(CACHE,name+'.jpg'),bytes);rows.push({name,url,status:r.status,type:r.headers.get('content-type'),bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}fs.writeFileSync(path.join(OUT,'descargas.json'),JSON.stringify(rows,null,2));console.log(rows)})().catch(e=>{console.error(e);process.exit(1)});
