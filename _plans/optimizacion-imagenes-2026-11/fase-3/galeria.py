import json
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
data=json.loads((ROOT/'_data/imagenes_catalogo.json').read_text(encoding='utf-8'))['imagenes'];items=[];seen=set()
for key,v in data.items():
    src=v['variants'][-1]['src']
    if src in seen:continue
    seen.add(src);items.append((key,src))
for start in range(0,len(items),32):
    part=items[start:start+32];sheet=Image.new('RGB',(1440,((len(part)+5)//6)*200),'#efede7');draw=ImageDraw.Draw(sheet)
    for n,(key,src) in enumerate(part):
        with Image.open(ROOT/src.lstrip('/')) as im:
            rgba=im.convert('RGBA');bg=Image.new('RGBA',rgba.size,'white');bg.alpha_composite(rgba);thumb=ImageOps.contain(bg.convert('RGB'),(230,155))
            x=(n%6)*240;y=(n//6)*200;sheet.paste(thumb,(x+(240-thumb.width)//2,y))
            name=Path(key).name;draw.text((x+4,y+158),name[:32],fill='black');draw.text((x+4,y+171),name[32:64],fill='black');draw.text((x+4,y+185),str(im.width)+' x '+str(im.height),fill='black')
    sheet.save(HERE/f'catalogo-{start//32+1}.jpg',quality=88)
print('Fotografías distintas:',len(items))
