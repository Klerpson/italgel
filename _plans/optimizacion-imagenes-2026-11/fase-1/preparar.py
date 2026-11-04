"""Exportaciones técnicas del catálogo: píxeles de origen, sin generación ni escalado al alza."""
import hashlib,json,math
from pathlib import Path
from io import BytesIO
from PIL import Image,ImageOps,ImageDraw,ImageChops,ImageFilter
import numpy as np
from pypdf import PdfReader

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
SOURCES=HERE/'fuentes'
DEST=ROOT/'img/cafe/tarjetas'
SOURCES.mkdir(exist_ok=True);DEST.mkdir(exist_ok=True)
catalogs=[('Catalogo Hambach.pdf',['mini-neo','swan','falcon','tank-1','tank-2','cruiser'],0),('Catalogo Molinos.pdf',['cedar-63c','oak-60','ebony-64','sequoia-74wt'],1)]
metadata={};receipts=[];previews=[]
for name,slugs,image_index in catalogs:
    pdf=Path('C:/Users/Camilo/Downloads')/name
    reader=PdfReader(pdf);pdf_hash=hashlib.sha256(pdf.read_bytes()).hexdigest()
    for number,(slug,page) in enumerate(zip(slugs,reader.pages[1:]),2):
        # En molinos, la imagen más grande es la ilustración del árbol decorativo;
        # la segunda es la fotografía principal. No rasterizar la página con textos.
        objects=sorted([(key,obj.get_object()) for key,obj in page['/Resources']['/XObject'].items() if obj.get_object().get('/SMask')],key=lambda item:item[1]['/Width']*item[1]['/Height'],reverse=True)
        key,obj=objects[image_index]
        photo=Image.open(BytesIO(obj.get_data())).convert('RGBA')
        mask=obj['/SMask'];photo.putalpha(Image.frombytes('L',(mask['/Width'],mask['/Height']),mask.get_data()))
        photo.save(SOURCES/(slug+'.png'))
        # Algunos recortes PDF tienen pequeñas islas ajenas al equipo (puntos o
        # una línea del decorado). Retirar solo componentes de menos de 100 px.
        remaining=photo.getchannel('A').point(lambda a:255 if a>12 else 0)
        clean=Image.new('L',photo.size,0);removed=0
        while remaining.getbbox():
            arr=np.asarray(remaining);y,x=np.argwhere(arr>0)[0]
            flood=remaining.copy();ImageDraw.floodfill(flood,(int(x),int(y)),127)
            component=flood.point(lambda a:255 if a==127 else 0)
            area=component.histogram()[255]
            if area>=100:clean=ImageChops.lighter(clean,component)
            else:removed+=area
            remaining=ImageChops.subtract(remaining,component)
        photo.putalpha(ImageChops.multiply(photo.getchannel('A'),clean.filter(ImageFilter.MaxFilter(7))))
        # Ignore almost invisible mask noise; preserve a 3 px guard around the subject.
        bbox=photo.getchannel('A').point(lambda a:255 if a>12 else 0).getbbox()
        x0,y0,x1,y1=bbox;bbox=(max(0,x0-3),max(0,y0-3),min(photo.width,x1+3),min(photo.height,y1+3))
        crop=photo.crop(bbox)
        # 8:7 canvas, 9% margin per side, and never enlarge source pixels.
        units=min(100,math.floor(max(crop.width/8,crop.height/7)/.82))
        width,height=units*8,units*7
        subject=ImageOps.contain(crop,(int(width*.82),int(height*.82)),Image.Resampling.LANCZOS)
        assert subject.width<=crop.width and subject.height<=crop.height
        canvas=Image.new('RGBA',(width,height),'white')
        canvas.alpha_composite(subject,((width-subject.width)//2,(height-subject.height)//2))
        canvas=canvas.convert('RGB');canvas.save(HERE/(slug+'-normalizada.png'));previews.append((slug,canvas))
        widths=sorted(set([w for w in [160,320,480,640] if w<=width-48]+[width]))
        for previous in DEST.glob(f'{slug}-*.avif'):
            assert previous.resolve().parent==DEST.resolve()
            previous.unlink()
        variants=[]
        for w in widths:
            h=round(w*7/8);im=canvas.resize((w,h),Image.Resampling.LANCZOS)
            file=DEST/f'{slug}-{w}.avif';im.save(file,format='AVIF',quality=68,speed=6,subsampling='4:4:4')
            variants.append(dict(src='/'+file.relative_to(ROOT).as_posix(),width=w,height=h,bytes=file.stat().st_size,sha256=hashlib.sha256(file.read_bytes()).hexdigest()))
        fallback=min(variants,key=lambda v:abs(v['width']-480))
        metadata[slug]=dict(src=fallback['src'],width=width,height=height,variants=[dict(src=v['src'],width=v['width']) for v in variants])
        receipts.append(dict(slug=slug,pdf=str(pdf),pdf_sha256=pdf_hash,page=number,object=key,source_size=list(photo.size),source_sha256=hashlib.sha256((SOURCES/(slug+'.png')).read_bytes()).hexdigest(),removed_extraction_speckle_pixels=removed,crop=list(bbox),canvas=[width,height],subject=list(subject.size),old_bytes=(ROOT/'img/cafe'/f'{slug}.avif').stat().st_size,variants=variants))
(ROOT/'_data/imagenes_cafe.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(HERE/'procedencia.json').write_text(json.dumps(receipts,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
sheet=Image.new('RGB',(1500,700),'#efede7');draw=ImageDraw.Draw(sheet)
for i,(slug,canvas) in enumerate(previews):
    thumb=ImageOps.contain(canvas,(290,300));x=(i%5)*300;y=(i//5)*350
    sheet.paste(thumb,(x+(300-thumb.width)//2,y));draw.text((x+6,y+310),slug,fill='black');draw.text((x+6,y+327),f'{canvas.width} x {canvas.height}',fill='black')
sheet.save(HERE/'catalogo-normalizado.jpg',quality=92)
print(json.dumps([dict(slug=x['slug'],canvas=x['canvas'],old=x['old_bytes'],variants=[(v['width'],v['bytes']) for v in x['variants']]) for x in receipts],indent=2))
