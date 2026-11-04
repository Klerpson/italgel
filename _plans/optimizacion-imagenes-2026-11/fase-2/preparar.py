"""Variantes técnicas del blog desde los archivos maestros conservados en img/.
No altera composición, color ni tamaño al alza; nunca utiliza otro derivado como fuente.
"""
import hashlib,json,re,csv
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw

HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2];DEST=ROOT/'img/blog/optimizadas'
DEST.mkdir(exist_ok=True);(HERE/'comparaciones').mkdir(exist_ok=True)
sources=set();roles={}
for post in (ROOT/'_posts').glob('*.md'):
    text=post.read_text(encoding='utf-8')
    if re.search(r'^published:\s*false\s*$',text.split('---',2)[1],re.M):continue
    for source in re.findall(r'^hero:\s*(\S+)',text,re.M):sources.add(source);roles.setdefault(source,set()).add('cabecera/tarjeta')
    body_sources=re.findall(r"^!\[.*?\]\(\{\{'([^']+)'",text,re.M)+re.findall(r'origen="(/img/blog/[^\"]+\.avif)"',text.split('---',2)[2])
    for source in body_sources:sources.add(source);roles.setdefault(source,set()).add('contenido')
source=re.search(r'^hero:\s*(\S+)',(ROOT/'blog.html').read_text(encoding='utf-8'),re.M)[1];sources.add(source);roles[source]={'portada-blog'}
for old in DEST.glob('*.avif'):
    assert old.resolve().parent==DEST.resolve()
    old.unlink()
qualities={'tipos-toppings-para-helado-profesional':66,'control-porciones-toppings-heladeria':66,'medicion-peso-helado-overrun':64,'variegato-whisky-helado-premium':64,'como-abrir-heladeria-colombia':64,'rentabilidad-heladeria-colombia-margenes':64}
groups={};metadata={};receipts=[];comparisons=[]
for source in sorted(sources):
    master=ROOT/source.lstrip('/');sha=hashlib.sha256(master.read_bytes()).hexdigest()
    if sha in groups:
        metadata[source]=groups[sha]['metadata'];receipts.append(dict(source=source,sha256=sha,alias_of=groups[sha]['source'],original_bytes=master.stat().st_size,roles=sorted(roles[source])));continue
    with Image.open(master) as original:
        photo=original.convert('RGB');width,height=photo.size
        quality=qualities.get(master.stem,62)
        variants=[];largest=None
        for w in sorted(set([w for w in [400,600,800] if w<=width-48]+[width]),reverse=True):
            h=round(w*height/width);image=photo if w==width else photo.resize((w,h),Image.Resampling.LANCZOS)
            out=DEST/f'{master.stem}-{w}.avif';image.save(out,format='AVIF',quality=quality,speed=6,subsampling='4:4:4')
            size=out.stat().st_size
            if w==width and size>=master.stat().st_size*.9:
                out.unlink();variant=dict(src=source,width=width,height=height,bytes=master.stat().st_size,quality='source')
            elif largest and size>=largest['bytes']*.95:
                out.unlink();continue
            else:variant=dict(src='/'+out.relative_to(ROOT).as_posix(),width=w,height=h,bytes=size,quality=quality)
            largest=variant;variants.append(variant)
        variants.sort(key=lambda v:v['width']);fallback=min(variants,key=lambda v:abs(v['width']-800))
        item=dict(src=fallback['src'],width=width,height=height,variants=[dict(src=v['src'],width=v['width']) for v in variants])
        # object-fit:cover in 3:2 frames enlarges a panoramic source beyond the
        # visible box width. Request enough source pixels for that crop too.
        factor=max(1,(width/height)/(3/2))
        hero_factor=max(1,(width/height)/(1 if 'portada-blog' in roles[source] else 3/2))
        if factor>1.05 or hero_factor>1.05:
            item['sizes']={}
            if hero_factor>1.05:item['sizes']['hero']=f'(min-width: 88rem) {540*hero_factor:.3f}px, (min-width: 60rem) {40*hero_factor:.3f}vw, (min-width: 25rem) {92*hero_factor:.3f}vw, calc({100*hero_factor:.3f}vw - {32*hero_factor:.3f}px)'
            if factor>1.05:item['sizes']['card']=f'(min-width: 88rem) {432*factor:.3f}px, (min-width: 60rem) {30*factor:.3f}vw, (min-width: 44rem) {44*factor:.3f}vw, {92*factor:.3f}vw'
        metadata[source]=item;groups[sha]=dict(source=source,metadata=item)
        native=variants[-1]
        receipts.append(dict(source=source,sha256=sha,source_size=[width,height],roles=sorted(roles[source]),original_bytes=master.stat().st_size,quality=quality,full_bytes=native['bytes'],full_saving_percent=round((1-native['bytes']/master.stat().st_size)*100,1),variants=variants))
        if master.stat().st_size>150*1024:
            with Image.open(ROOT/native['src'].lstrip('/')) as candidate:
                # Same pixels at 100% in a central crop, plus whole-image comparisons.
                crop=(max(0,width//2-230),max(0,height//2-150),min(width,width//2+230),min(height,height//2+150))
                sheet=Image.new('RGB',(960,710),'white');draw=ImageDraw.Draw(sheet)
                for x,im in [(0,photo),(480,candidate.convert('RGB'))]:
                    thumb=ImageOps.contain(im,(470,350));sheet.paste(thumb,(x+(470-thumb.width)//2,25));sheet.paste(im.crop(crop),(x,400))
                draw.text((5,5),'Original '+str(master.stat().st_size)+' B',fill='black');draw.text((485,5),'Optimizada '+str(native['bytes'])+' B',fill='black');draw.text((5,380),master.name+' / recorte al 100%',fill='black')
                sheet.save(HERE/'comparaciones'/f'{master.stem}.jpg',quality=95);comparisons.append(source)
config=dict(sizes=dict(hero='(min-width: 88rem) 540px, (min-width: 60rem) 40vw, (min-width: 25rem) 92vw, calc(100vw - 32px)',card='auto, (min-width: 88rem) 432px, (min-width: 60rem) 30vw, (min-width: 44rem) 44vw, 92vw',body='auto, (min-width: 88rem) 810px, (min-width: 60rem) 65vw, 92vw'),imagenes=metadata)
(ROOT/'_data/imagenes_blog.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(HERE/'procedencia.json').write_text(json.dumps(receipts,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
with (HERE/'pesos.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=['source','original_bytes','full_bytes','quality','full_saving_percent','alias_of']);writer.writeheader();writer.writerows({k:r.get(k,'') for k in writer.fieldnames} for r in receipts)
print(json.dumps(dict(sources=len(sources),unique_masters=len(groups),variants=sum(len(v['metadata']['variants']) for v in groups.values()),new_files=len(list(DEST.glob('*.avif'))),new_bytes=sum(p.stat().st_size for p in DEST.glob('*.avif')),heavy_masters=len(comparisons),full_original=sum(r['original_bytes'] for r in receipts if 'full_bytes' in r),full_optimized=sum(r['full_bytes'] for r in receipts if 'full_bytes' in r)),indent=2))
