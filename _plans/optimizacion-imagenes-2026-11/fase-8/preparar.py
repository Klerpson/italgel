import json,hashlib
from pathlib import Path
import tempfile,shutil
from PIL import Image,ImageOps,ImageChops
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
CACHE=Path(tempfile.gettempdir())/'italgel-imagenes'/HERE.name
CACHE.mkdir(parents=True,exist_ok=True)
DEST=ROOT/'img/catalogo/ingredientes-2';DEST.mkdir(exist_ok=True)
aliases={
 'arandano-stock':['/img/pasta-arandano-helado-sorbet.avif'],
 'limon-stock':['/img/pasta-limon-siciliano-sorbet.avif'],
 'mandarina-stock':['/img/pasta-mandarina-helado-citrico.avif'],
 'pitaya-stock':['/img/pasta-dragon-summer-helado-exotico.avif'],
 'chocolate':['/img/pasta-chocolate-helado-artesanal.avif'],
 'stracciatella':['/img/pasta-stracciatella-chips-chocolate.avif'],
 'blanco':['/img/pasta-chocolate-blanco-helado.avif']}
downloads=json.loads((HERE/'fuentes/descargas.json').read_text(encoding='utf8'))+json.loads((HERE/'fuentes/stock.json').read_text(encoding='utf8'))
metadata={};receipts=[]
for row in downloads:
 name=row['name']
 if name not in aliases:continue
 source=CACHE/row['file'];assert hashlib.sha256(source.read_bytes()).hexdigest()==row['sha256']
 with Image.open(source) as im:
  rgba=ImageOps.exif_transpose(im).convert('RGBA');bg=Image.new('RGBA',rgba.size,'white');bg.alpha_composite(rgba);photo=bg.convert('RGB');original=photo.size
 crop=None
 if name=='arandano-stock':
  edge=min(photo.size);left=(photo.width-edge)//2;top=(photo.height-edge)//2;crop=[left,top,left+edge,top+edge];photo=photo.crop(crop);photo.thumbnail((800,800),Image.Resampling.LANCZOS)
 elif name=='limon-stock':
  edge=min(900,min(photo.size));left=round(photo.width*.54-edge/2);top=(photo.height-edge)//2;crop=[left,top,left+edge,top+edge];photo=photo.crop(crop);photo.thumbnail((800,800),Image.Resampling.LANCZOS)
 elif name.endswith('-stock'):
  if name in ['mandarina-stock','pitaya-stock']:
   mask=ImageChops.difference(photo,Image.new('RGB',photo.size,'white')).convert('L').point(lambda v:255 if v>25 else 0)
   bbox=mask.getbbox()
   if bbox:
    x0,y0,x1,y1=bbox;crop=[max(0,x0-16),max(0,y0-16),min(photo.width,x1+16),min(photo.height,y1+16)];photo=photo.crop(crop)
  photo.thumbnail((720,720),Image.Resampling.LANCZOS);canvas=Image.new('RGB',(800,800),'white');canvas.paste(photo,((800-photo.width)//2,(800-photo.height)//2));photo=canvas
 w,h=photo.size;variants=[];quality=62 if name in ['chocolate','arandano-stock','mandarina-stock'] else 66
 for width in sorted(set([v for v in [160,280,400,600] if v<w-50]+[w])):
  image=photo if width==w else photo.resize((width,round(h*width/w)),Image.Resampling.LANCZOS)
  out=DEST/f'{name}-{width}.avif';image.save(out,format='AVIF',quality=quality,speed=6,subsampling='4:4:4')
  variants.append({'src':'/'+out.relative_to(ROOT).as_posix(),'width':width,'bytes':out.stat().st_size})
 fallback=min(variants,key=lambda v:abs(v['width']-600));item={'src':fallback['src'],'width':w,'height':h,'variants':[{k:v[k] for k in ['src','width']} for v in variants]}
 for alias in aliases[name]:metadata[alias]=item
 receipts.append({**row,'source_size':original,'quality':quality,'crop':crop,'output_size':[w,h],'aliases':aliases[name],'variants':variants})
(ROOT/'_data/imagenes_ingredientes_extra.json').write_text(json.dumps({'imagenes':metadata},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(HERE/'procedencia.json').write_text(json.dumps(receipts,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'photos':len(receipts),'variants':sum(len(r['variants']) for r in receipts),'bytes':sum(v['bytes'] for r in receipts for v in r['variants']),'max_bytes':{r['name']:r['variants'][-1]['bytes'] for r in receipts}},indent=2))

# Eliminar las fuentes de trabajo al terminar; nunca conservarlas en el proyecto.
assert CACHE.resolve().parent == (Path(tempfile.gettempdir())/'italgel-imagenes').resolve()
shutil.rmtree(CACHE)
