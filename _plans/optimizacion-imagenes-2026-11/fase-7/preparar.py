import json,hashlib
from pathlib import Path
from PIL import Image,ImageOps
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
DEST=ROOT/'img/catalogo/ingredientes';DEST.mkdir(exist_ok=True)
aliases={
 'bosque':['/img/pasta-frutos-bosque-helado.avif','/img/fiordibosco-frutos-bosque.avif'],
 'vainilla':['/img/pasta-vainilla-bourbon-helado.avif'],
 'caramelo':['/img/pasta-caramelo-helado-dulce-leche.avif'],
 'coco':['/img/pasta-coco-helado-tropical.avif'],
 'salted':['/img/salted-caramel-variegato.avif'],
 'frambuesas-stock':['/img/fiordilampone-frambuesa-variegato.avif']}
downloads=json.loads((HERE/'fuentes/descargas.json').read_text(encoding='utf8'))+[json.loads((HERE/'fuentes/stock.json').read_text(encoding='utf8'))]
metadata={};receipts=[]
for row in downloads:
 name=row['name']
 if name not in aliases:continue
 source=HERE/'fuentes'/row['file']
 assert hashlib.sha256(source.read_bytes()).hexdigest()==row['sha256']
 with Image.open(source) as im:
  rgba=ImageOps.exif_transpose(im).convert('RGBA');bg=Image.new('RGBA',rgba.size,'white');bg.alpha_composite(rgba);photo=bg.convert('RGB');original=photo.size
 if name=='frambuesas-stock':
  photo.thumbnail((920,920),Image.Resampling.LANCZOS)
  canvas=Image.new('RGB',(1000,1000),'white');canvas.paste(photo,((1000-photo.width)//2,(1000-photo.height)//2));photo=canvas
 w,h=photo.size;variants=[]
 for width in sorted(set([v for v in [160,280,400,600,800] if v<w-50]+[w])):
  image=photo if width==w else photo.resize((width,round(h*width/w)),Image.Resampling.LANCZOS)
  out=DEST/f'{name}-{width}.avif';image.save(out,format='AVIF',quality=68,speed=6,subsampling='4:4:4')
  variants.append({'src':'/'+out.relative_to(ROOT).as_posix(),'width':width,'bytes':out.stat().st_size})
 fallback=min(variants,key=lambda v:abs(v['width']-600))
 item={'src':fallback['src'],'width':w,'height':h,'variants':[{k:v[k] for k in ['src','width']} for v in variants]}
 for alias in aliases[name]:metadata[alias]=item
 receipts.append({**row,'source_size':original,'output_size':[w,h],'aliases':aliases[name],'variants':variants})
(ROOT/'_data/imagenes_ingredientes.json').write_text(json.dumps({'imagenes':metadata},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(HERE/'procedencia.json').write_text(json.dumps(receipts,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'photos':len(receipts),'aliases':len(metadata),'variants':sum(len(r['variants']) for r in receipts),'bytes':sum(v['bytes'] for r in receipts for v in r['variants'])},indent=2))
