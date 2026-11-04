import json,hashlib
from pathlib import Path
from urllib.parse import urlsplit,unquote,urljoin
from PIL import Image
from lxml import html
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2];SITE=ROOT/'_site'
metadata=json.loads((ROOT/'_data/imagenes_blog.json').read_text(encoding='utf-8'))
receipts=json.loads((HERE/'procedencia.json').read_text(encoding='utf-8'))
errors=[];count=0;hero_count=0;variant_count=0
for r in receipts:
    source=ROOT/r['source'].lstrip('/')
    if hashlib.sha256(source.read_bytes()).hexdigest()!=r['sha256']:errors.append(['source_changed',r['source']])
for source,item in metadata['imagenes'].items():
    with Image.open(ROOT/source.lstrip('/')) as im:original=im.size
    for v in item['variants']:
        variant_count+=1;p=ROOT/v['src'].lstrip('/')
        with Image.open(p) as im:
            im.load()
            if im.width!=v['width'] or im.width>original[0] or im.height>original[1]:errors.append(['variant_dimensions',v['src']])
for p in SITE.rglob('*.html'):
    count+=1;rel='/'+p.relative_to(SITE).as_posix();d=html.fromstring(p.read_bytes())
    for e in d.xpath('//*[@src or @href or @srcset or @imagesrcset]'):
        for attr in ['src','href','srcset','imagesrcset']:
            raw=e.get(attr)
            if not raw or raw.startswith(('data:','mailto:','tel:','javascript:')):continue
            refs=[s.strip().split()[0] for s in raw.split(',')] if attr.endswith('srcset') else [raw]
            for ref in refs:
                u=urlsplit(urljoin('https://italgel.com.co'+rel,ref))
                if u.hostname not in ['italgel.com.co','www.italgel.com.co']:continue
                target=SITE/unquote(u.path).lstrip('/')
                if target.is_dir():target=target/'index.html'
                if not target.is_file():errors.append(['missing',rel,attr,ref])
    for img in d.xpath('//picture[@class="articulo-cabecera__foto"]/img|//picture[@class="portada__foto"]/img'):
        if not img.get('srcset'):continue
        hero_count+=1;preloads=d.xpath('//link[@as="image"]')
        if len(preloads)!=1 or preloads[0].get('imagesrcset')!=img.get('srcset') or preloads[0].get('imagesizes')!=img.get('sizes'):errors.append(['preload_mismatch',rel])
result=dict(pages=count,sources=len(receipts),variant_references=variant_count,responsive_heroes=hero_count,errors=errors)
(HERE/'estatico.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(result,ensure_ascii=False,indent=2))
if errors:raise SystemExit(1)
