import json,hashlib,re
from pathlib import Path
import tempfile,shutil
from PIL import Image,ImageOps
from lxml import html
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2];SITE=ROOT/'_site';CACHE=Path(tempfile.gettempdir())/'italgel-imagenes'/HERE.name
CACHE.mkdir(parents=True,exist_ok=True)
DEST=ROOT/'img/catalogo'
DEST.mkdir(exist_ok=True)
for old_variant in DEST.glob('*.avif'):
    assert old_variant.resolve().parent==DEST.resolve()
    old_variant.unlink()
scope_file=HERE/'alcance.json'
if scope_file.exists():scope=json.loads(scope_file.read_text(encoding='utf-8'))
else:
    pages=[];sources=set()
    for p in SITE.rglob('*.html'):
        d=html.fromstring(p.read_bytes())
        if not d.xpath('//div[@class="contenido-legado"]'):continue
        pages.append('/'+p.relative_to(SITE).as_posix().replace('index.html',''))
        sources.update(e.get('src') for e in d.xpath('//main//img') if e.get('src','').startswith('/img/') and e.get('src').count('/')==2)
    sources.update(['/img/mantecadora-valmar-gelato.avif','/img/vitrina-helado.avif'])
    scope=dict(pages=['/']+pages+['/blog/como-calcular-overrun-helado-artesanal/','/blog/tipos-de-toppings-para-helado/'],sources=sorted(sources))
    scope_file.write_text(json.dumps(scope,ensure_ascii=False,indent=2),encoding='utf-8')
replacements={'bases-stevia-helado':'stevia','stevia-base-g-crema':'stevia','stevia-base-g-fruta':'fruta','yogo-greco-stevia':'yogurt','fiordiarancio-naranja-variegato':'naranja','fiordiamarena-variegato-cerezas':'amarena'}
replacements['quella-white-chocolate-blanco']='quella'
receipts=[];images={};groups={}
for source in scope['sources']:
    old=ROOT/source.lstrip('/');stem=old.stem
    if stem.startswith('logo') or not old.is_file():continue
    master=CACHE/(replacements[stem]+'.jpg') if stem in replacements else old
    if stem.startswith('hero-insumos-heladeria-'):master=ROOT/'img/contacto-italgel-colombia.avif'
    if stem=='pasta-fresa-helado-natural':master=ROOT/'img/fiordifragola-variegato-fresa.avif'
    # The recovered Base 50 image shows the same ice-cream display at a larger size.
    if stem=='base-50-mec3-empaque':master=CACHE/'base-50-mec3-empaque.png'
    sha=hashlib.sha256(master.read_bytes()).hexdigest()
    with Image.open(master) as im:
        rgba=ImageOps.exif_transpose(im).convert('RGBA')
        background=Image.new('RGBA',rgba.size,'white');background.alpha_composite(rgba)
        photo=background.convert('RGB')
    w,h=photo.size
    if w/h>3 or w/h<.3:continue
    if sha in groups:item=groups[sha]
    else:
        variants=[]
        for width in sorted(set([x for x in [280,400,600,800] if x<=min(w,1080)-48]+[min(w,1080)]),reverse=True):
            height=round(width*h/w);out=DEST/f'{stem}-{width}.avif'
            image=photo if width==w else photo.resize((width,height),Image.Resampling.LANCZOS)
            image.save(out,format='AVIF',quality=66,speed=6,subsampling='4:4:4')
            if width==w and master==old and out.stat().st_size>=old.stat().st_size*.9:
                out.unlink();v=dict(src=source,width=w,height=h,bytes=old.stat().st_size)
            elif variants and out.stat().st_size>=variants[-1]['bytes']*.95:
                out.unlink();continue
            else:v=dict(src='/'+out.relative_to(ROOT).as_posix(),width=width,height=height,bytes=out.stat().st_size)
            variants.append(v)
        variants.sort(key=lambda v:v['width']);full=variants[-1];fallback=min(variants,key=lambda v:abs(v['width']-600))
        item=dict(src=fallback['src'],width=full['width'],height=full['height'],variants=[dict(src=v['src'],width=v['width']) for v in variants]);groups[sha]=item
    images[source]=item
    receipts.append(dict(source=source,master=str(master),sha256=sha,master_size=[w,h],old_bytes=old.stat().st_size,replacement=master!=old,variants=item['variants']))
config=dict(sizes=dict(hero='(min-width: 88rem) 550px, (min-width: 60rem) 40vw, 92vw',card='auto, (min-width: 88rem) 350px, (min-width: 60rem) 30vw, 84vw',body='auto, (min-width: 88rem) 600px, (min-width: 60rem) 44vw, 92vw'),imagenes=images)
(ROOT/'_data/imagenes_catalogo.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(HERE/'procedencia.json').write_text(json.dumps(receipts,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(pages=len(scope['pages']),sources=len(images),unique=len(groups),files=len(list(DEST.glob('*.avif'))),bytes=sum(x.stat().st_size for x in DEST.glob('*.avif'))),indent=2))

# Eliminar las fuentes de trabajo al terminar; nunca conservarlas en el proyecto.
assert CACHE.resolve().parent == (Path(tempfile.gettempdir())/'italgel-imagenes').resolve()
shutil.rmtree(CACHE)
