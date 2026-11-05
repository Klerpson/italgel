import json,csv,re,math
from pathlib import Path
from collections import defaultdict,Counter
from PIL import Image
P=Path(__file__).resolve().parent;R=P.parents[1]
def read(n):return json.loads((P/n).read_text(encoding='utf-8'))
def write(n,d):(P/n).write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
def csvout(n,rows):
    with (P/n).open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
browser=read('navegador.json');images=list(csv.DictReader((P/'imagenes.csv').open(encoding='utf-8-sig')))
redirects=[];real=[]
for page in browser:
    f=R/'_site'/page['url'].lstrip('/')
    if f.is_dir():f=f/'index.html'
    if 'http-equiv="refresh"' in f.read_text(encoding='utf-8')[:3000]:redirects.append(page['url'])
    else:real.append(page)
metrics=defaultdict(list)
for page in real:
    for v in page['viewports']:
        for i in v['images']:metrics[i['src']].append(dict(page=page['url'],viewport=v['width'],**i))
actions=[]
for im in images:
    uses=metrics.get(im['path'],[]);factor=max((x['factor'] for x in uses),default=0)
    main=[x for x in uses if x['alt']]
    notes=[];priority='P3'
    if factor>1.1:notes.append('Resolución insuficiente a DPR 1: '+str(factor)+'x');priority='P1'
    elif factor>.55:notes.append('Revisar nitidez a DPR 2')
    if int(im['bytes'])>150*1024 and uses:notes.append('Reducir bytes; generar variantes por tamaño');priority='P2' if priority=='P3' else priority
    if any(x['scale']!='none' and float(x['scale'])>1 for x in uses):notes.append('Normalizar margen en archivo; retirar ampliación CSS')
    if not uses:notes.append('Sin uso img observado; comprobar metadatos, preloads, JSON y enlaces antes de limpiar')
    if not notes:notes.append('Mantener; sin incidencia automática')
    most=max(uses,key=lambda x:x['factor']) if uses else {}
    actions.append(dict(path=im['path'],bytes=int(im['bytes']),width=im['width'],height=im['height'],priority=priority,max_scale_DPR1=factor,page=most.get('page',''),viewport=most.get('viewport',''),action='; '.join(notes)))
csvout('prioridades-imagenes.csv',sorted(actions,key=lambda x:(x['priority'],-x['max_scale_DPR1'],-x['bytes'])))
groups=defaultdict(list)
for x in images:groups[x['sha256']].append(x['path'])
dups=[x for x in groups.values() if len(x)>1];write('duplicados-archivos.json',dups)
ext=read('externos-estados.json')
result=dict(content_pages=len(real),redirect_pages=len(redirects),redirects=redirects,viewports=sum(len(x['viewports']) for x in real),broken_browser_images=sum(i['bad'] for x in real for v in x['viewports'] for i in v['images']),page_js_errors=[x['url'] for x in real if x['errors']],overflow=[dict(page=x['url'],width=v['width'],scrollWidth=v['scrollWidth']) for x in real for v in x['viewports'] if v['scrollWidth']>v['width']+2],upscaled_images=len([x for x in actions if x['max_scale_DPR1']>1.1]),retina_review=len([x for x in actions if x['max_scale_DPR1']>.55]),active_over150KB=len([x for x in actions if x['max_scale_DPR1'] and x['bytes']>150*1024]),active_src=len(metrics),external_statuses=dict(Counter(str(x.get('status','error')) for x in ext)),external_not200=[dict(url=x['url'],status=x.get('status'),error=x.get('error'),pages=x.get('pages')) for x in ext if x.get('status')!=200],exact_duplicate_groups=len(dups))
write('resultados.json',result);print(json.dumps(result,ensure_ascii=False,indent=2))
# Compression trials are review-only; production files remain untouched.
from io import BytesIO
trials=[]
for name in ['tipos-toppings-para-helado-profesional.avif','rentabilidad-heladeria-colombia-margenes.avif','como-abrir-heladeria-colombia.avif','variegato-para-helado-profesional.avif','diferencia-gelato-helado-artesanal.avif']:
    src=R/'img/blog'/name;dst=BytesIO()
    with Image.open(src) as im:im.save(dst,format='AVIF',quality=60,speed=6)
    trials.append(dict(source='/img/blog/'+name,original_bytes=src.stat().st_size,trial_bytes=len(dst.getvalue()),saving_percent=round((1-len(dst.getvalue())/src.stat().st_size)*100,1)))
write('muestras-compresion.json',trials);print('Compression',trials)
