import json, csv, hashlib, re
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
from collections import Counter, defaultdict
from PIL import Image, ImageOps, ImageDraw
from lxml import html

ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).resolve().parent
SITE=ROOT/'_site'
BASE='https://italgel.com.co'
def write(name,data): (OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
def csvout(name,rows):
    if not rows:return
    with (OUT/name).open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)

images=[]
for folder in ['img','iconified']:
    for p in (ROOT/folder).rglob('*'):
        if not p.is_file() or p.suffix.lower() not in ['.avif','.jpg','.jpeg','.png','.webp','.gif','.svg','.ico']:continue
        row=dict(path='/'+p.relative_to(ROOT).as_posix(),bytes=p.stat().st_size,width=None,height=None,format='',error='',sha256=hashlib.sha256(p.read_bytes()).hexdigest())
        try:
            with Image.open(p) as im:
                row.update(width=im.width,height=im.height,format=im.format);im.load()
        except Exception as e:
            if p.suffix.lower()!='.svg':row['error']=str(e)
        images.append(row)
idx={r['path']:r for r in images}
pages={}
for p in SITE.rglob('*.html'):
    rel=p.relative_to(SITE).as_posix()
    url='/'+(rel[:-10] if rel.endswith('index.html') else rel)
    try: pages[url]=dict(file=p,doc=html.fromstring(p.read_bytes()))
    except Exception:pass
def resolve(url):
    path=unquote(urlsplit(url).path);p=SITE/path.lstrip('/')
    if p.is_dir():p=p/'index.html'
    if not p.exists() and not p.suffix:p=Path(str(p)+'.html')
    return p
broken=[];anchors=[];usages=[];external=defaultdict(set);meta=[];duplicates=[];cssrefs=[]
for url,page in pages.items():
    doc=page['doc'];ids=Counter(doc.xpath('//@id'))
    for id,n in ids.items():
        if n>1:duplicates.append(dict(page=url,id=id,count=n))
    for e in doc.xpath('//*[@href or @src or @srcset or @poster]'):
        for attr in ['href','src','poster','srcset']:
            raw=e.get(attr)
            if not raw:continue
            refs=[v.strip().split()[0] for v in raw.split(',')] if attr=='srcset' else [raw]
            for ref in refs:
                if ref.startswith(('data:','mailto:','tel:','javascript:')):continue
                full=urljoin(BASE+url,ref);u=urlsplit(full)
                if u.hostname not in ['italgel.com.co','www.italgel.com.co']:external[full].add(url);continue
                p=resolve(full)
                if not p.is_file():broken.append(dict(page=url,tag=e.tag,attribute=attr,target=ref,line=e.sourceline))
                elif u.fragment and e.tag=='a' and p.suffix=='.html':
                    target=pages.get('/'+p.relative_to(SITE).as_posix().replace('index.html',''))
                    d=target['doc'] if target else html.fromstring(p.read_bytes())
                    if not d.xpath('//*[@id=$id or @name=$id]',id=unquote(u.fragment)):anchors.append(dict(page=url,target=ref,line=e.sourceline))
    for e in doc.xpath('//img'):
        path=unquote(urlsplit(urljoin(BASE+url,e.get('src',''))).path)
        r=idx.get(path,{})
        usages.append(dict(page=url,src=path,alt=e.get('alt'),width=e.get('width'),height=e.get('height'),loading=e.get('loading'),srcset=e.get('srcset'),picture_sources=len(e.xpath('ancestor::picture//source')),bytes=r.get('bytes'),natural_width=r.get('width'),natural_height=r.get('height'),line=e.sourceline))
    for e in doc.xpath('//meta[@property="og:image"]'):
        path=urlsplit(e.get('content','')).path;r=idx.get(path,{})
        meta.append(dict(page=url,image=path,width=r.get('width'),height=r.get('height'),format=r.get('format')))
for p in list((SITE/'css').glob('*.css')):
    for ref in re.findall(r'url\([\s\'"]*([^\)\'"\s]+)',p.read_text(encoding='utf-8')):
        full=urljoin(BASE+'/css/'+p.name,ref)
        if not ref.startswith(('#','%23','data:')) and urlsplit(full).hostname=='italgel.com.co' and not resolve(full).is_file():cssrefs.append(dict(css=p.name,target=ref))
used=Counter(r['src'] for r in usages)
for r in images:r['html_uses']=used[r['path']]
csvout('imagenes.csv',images);csvout('usos-imagenes.csv',usages)
write('enlaces-rotos.json',broken);write('anclas-rotas.json',anchors);write('ids-duplicados.json',duplicates)
write('externos.json',{k:sorted(v) for k,v in external.items()});write('og-imagenes.json',meta);write('css-recursos-rotos.json',cssrefs)
summary=dict(pages=len(pages),images=len(images),image_bytes=sum(r['bytes'] for r in images),used_images=len(used),image_usages=len(usages),broken_references=len(broken),broken_targets=len(set(r['target'] for r in broken)),broken_anchors=len(anchors),duplicate_ids=len(duplicates),missing_dimensions=sum(not r['width'] or not r['height'] for r in usages),missing_alt=sum(r['alt'] is None for r in usages),empty_alt=sum(r['alt']=='' for r in usages),img_srcset=sum(bool(r['srcset']) for r in usages),picture_usages=sum(bool(r['picture_sources']) for r in usages),decode_errors=[r for r in images if r['error']],external_urls=len(external),css_broken=cssrefs,formats=dict(Counter(r['format'] for r in images)))
write('resumen.json',summary);print(json.dumps(summary,ensure_ascii=False,indent=2))

errors=[]
for url,page in pages.items():
    doc=page['doc']
    dims={k:doc.xpath('//meta[@property="og:image:'+k+'"]/@content') for k in ['width','height']}
    img=doc.xpath('//meta[@property="og:image"]/@content')
    if img:
        info=idx.get(urlsplit(img[0]).path,{})
        if dims['width']!=[str(info.get('width'))] or dims['height']!=[str(info.get('height'))]: errors.append({'page':url,'image':img[0],'dimensions':dims,'actual':[info.get('width'),info.get('height')]})
write('dimensiones-sociales-errores.json',errors)
print('Dimensiones sociales incorrectas:',len(errors))
