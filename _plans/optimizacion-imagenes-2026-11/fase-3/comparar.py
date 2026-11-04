import json,hashlib
from pathlib import Path
from PIL import Image
from lxml import html
from urllib.parse import urljoin,urlsplit,unquote
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2];SITE=ROOT/'_site'
def read(n):return json.loads((HERE/n).read_text(encoding='utf-8'))
before=read('antes/navegador.json');after=read('despues/navegador.json');lookup={(r['url'],r['width'],r['dpr']):r for r in before}
dimensions={};errors=[];rows=[];enlarged={};caps=[]
def size(src):
    if src not in dimensions:
        try:
            with Image.open(ROOT/src.lstrip('/')) as im:dimensions[src]=im.size
        except Exception:dimensions[src]=None
    return dimensions[src]
for stage,data in [('antes',before),('despues',after)]:
    enlarged[stage]=[]
    for r in data:
        if r.get('error'):errors.append([stage,r['url'],r['error']]);continue
        if stage=='despues':
            old=lookup[(r['url'],r['width'],r['dpr'])]
            if r['textHash']!=old['textHash']:errors.append(['visible_text_changed',r['url']])
            rows.append(dict(url=r['url'],width=r['width'],dpr=r['dpr'],before=old['imageBytes'],after=r['imageBytes'],saving=round((1-r['imageBytes']/old['imageBytes'])*100,1)))
        for im in r['images']:
            wh=size(im['src'])
            if not wh:continue
            w,h=wh;bw=im['box'][0]-2*im['padding'][0];bh=im['box'][1]-2*im['padding'][1]
            ratio=max(bw/w,bh/h) if im['fit']=='cover' else min(bw/w,bh/h) if im['fit']=='contain' else max(bw/w,bh/h)
            if r['dpr']==1 and ratio>1.1:enlarged[stage].append(dict(url=r['url'],width=r['width'],src=im['src'],scale=round(ratio,2)))
metadata=json.loads((ROOT/'_data/imagenes_catalogo.json').read_text(encoding='utf-8'))['imagenes']
for r in read('procedencia.json'):
    if hashlib.sha256((ROOT/r['master']).read_bytes()).hexdigest()!=r['sha256']:errors.append(['master_changed',r['source']])
for source,item in metadata.items():
    for v in item['variants']:
        s=size(v['src'])
        if not s or s[0]!=v['width']:errors.append(['variant',v['src']])
for p in SITE.rglob('*.html'):
    d=html.fromstring(p.read_bytes());url='https://italgel.com.co/'+p.relative_to(SITE).as_posix()
    for e in d.xpath('//*[@src or @href or @srcset or @imagesrcset]'):
        for attr in ['src','href','srcset','imagesrcset']:
            raw=e.get(attr,'')
            if not raw or raw.startswith(('data:','mailto:','tel:','javascript:')):continue
            refs=[x.strip().split()[0] for x in raw.split(',')] if attr.endswith('srcset') else [raw]
            for ref in refs:
                u=urlsplit(urljoin(url,ref))
                if u.hostname not in ['italgel.com.co','www.italgel.com.co']:continue
                f=SITE/unquote(u.path).lstrip('/')
                if f.is_dir():f=f/'index.html'
                if not f.is_file():errors.append(['missing',p.relative_to(SITE).as_posix(),ref])
result=dict(checks=len(after),errors=errors,enlarged_before=len(enlarged['antes']),enlarged_after=len(enlarged['despues']),enlarged=enlarged,rows=rows)
(HERE/'comparacion.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(dict(checks=len(after),errors=errors,enlarged_before=result['enlarged_before'],enlarged_after=result['enlarged_after'],remaining=enlarged['despues'][:15],samples=[r for r in rows if r['dpr']==1 and r['width']==390 and r['url'] in ['/','/bases-helado-colombia/bases-stevia/','/coberturas-salsas-helado/amarena-fabbri/','/maquinas-helado-soft/','/insumos-heladeria-medellin/']]),ensure_ascii=False,indent=2))
if errors:raise SystemExit(1)
