"""Derivados desde originales de fabricante: fondo blanco, sin aumentar el equipo."""
import json, hashlib
from pathlib import Path
from PIL import Image, ImageOps, ImageChops
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
DEST=ROOT/'img/catalogo/fabricantes'
DEST.mkdir(exist_ok=True)
names={'snowy':'valmar-snowy-7-m','sweety':'valmar-sweety-60-quick','stargel':'promag-stargel-4','pasmo':'pasmo-s121-gravity','coldelite301':'iceteam-301-bib-inox','coldelite603':'iceteam-603-bib','compacta':'coldelite-compacta-vario-12','quellaDark':'mec3-quella-dark','quellaPistacho':'mec3-quella-pistacchio'}
downloads=json.loads((HERE/'fuentes/descargas.json').read_text())
data={};rows=[];keys={}
for row in downloads:
    name=row['name']
    if name not in names: continue
    source=HERE/'fuentes'/row['file']
    assert hashlib.sha256(source.read_bytes()).hexdigest()==row['sha256']
    with Image.open(source) as im:
        rgba=ImageOps.exif_transpose(im).convert('RGBA')
        bg=Image.new('RGBA',rgba.size,'white');bg.alpha_composite(rgba)
        photo=bg.convert('RGB')
    source_size=photo.size
    if not name.startswith('quella'):
        # Retirar únicamente margen blanco; conservar toda la silueta y su sombra.
        mask=ImageChops.difference(photo,Image.new('RGB',photo.size,'white')).convert('L').point(lambda v:255 if v>15 else 0)
        bbox=mask.getbbox()
        if bbox:
            x0,y0,x1,y1=bbox
            photo=photo.crop((max(0,x0-8),max(0,y0-8),min(photo.width,x1+8),min(photo.height,y1+8)))
        canvas_size=min(1200,round(max(photo.size)/.88))
        photo.thumbnail((round(canvas_size*.88),round(canvas_size*.88)),Image.Resampling.LANCZOS)
        canvas=Image.new('RGB',(canvas_size,canvas_size),'white')
        canvas.paste(photo,((canvas_size-photo.width)//2,(canvas_size-photo.height)//2));photo=canvas
    else:
        photo.thumbnail((1080,1080),Image.Resampling.LANCZOS)
    w,h=photo.size
    widths=sorted(set([v for v in [160,280,400,600,800] if v<w-50]+[w]))
    variants=[]
    for width in widths:
        out=DEST/f'{names[name]}-{width}.avif'
        image=photo if width==w else photo.resize((width,round(h*width/w)),Image.Resampling.LANCZOS)
        image.save(out,format='AVIF',quality=68,speed=6,subsampling='4:4:4')
        variants.append({'src':'/'+out.relative_to(ROOT).as_posix(),'width':width,'bytes':out.stat().st_size})
    key=variants[-1]['src'];keys[name]=key
    fallback=min(variants,key=lambda v:abs(v['width']-600))
    data[key]={'src':fallback['src'],'width':w,'height':h,'variants':[{k:v[k] for k in ['src','width']} for v in variants]}
    rows.append({**row,'source_size':source_size,'canvas_size':[w,h],'key':key,'variants':variants})
(ROOT/'_data/imagenes_fabricantes.json').write_text(json.dumps({'imagenes':data},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(HERE/'procedencia.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(HERE/'claves.json').write_text(json.dumps(keys,indent=2)+'\n',encoding='utf8')
print(json.dumps({'photos':len(rows),'variants':sum(len(r['variants']) for r in rows),'bytes':sum(v['bytes'] for r in rows for v in r['variants']),'keys':keys},indent=2))
