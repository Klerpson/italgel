const fs=require('fs'),path=require('path');
const OUT=path.join(__dirname,'fuentes');
const pages={stevia:'https://www.mec3.com/en/products/gelato/bases/cream-bases/base-g-cream',fruta:'https://www.mec3.com/it/prodotti/gelato/basi/basi-frutta/base-g-frutte',naranja:'https://www.mec3.com/en/products/gelato/ripple-sauces/fruit-ripples/fiordiarancio',amarena:'https://en.fabbri1905.com/professionals/gelato/products/amarena-fabbri.kl'};
pages.yogurt='https://www.mec3.com/it/prodotti/gelato/gelato-soft/soft-ice-international/yogomec-greco-g';
pages.quella='https://www.mec3.com/it/prodotti/gelato/variegati/quella-white';
(async()=>{for(const [name,url] of Object.entries(pages)){if(process.argv[2]&&process.argv[2]!==name)continue;const r=await fetch(url,{signal:AbortSignal.timeout(20000)});const text=await r.text();fs.writeFileSync(path.join(OUT,name+'.html'),text);console.log(JSON.stringify({name,url,status:r.status,images:[...text.matchAll(/<img\b[^>]*>/gi)].map(x=>x[0]).filter(x=>!x.includes('logo')).slice(-20)}));}})().catch(e=>{console.error(e);process.exit(1)});
