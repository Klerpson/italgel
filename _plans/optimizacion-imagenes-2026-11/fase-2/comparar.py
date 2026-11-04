import json,math
from pathlib import Path
from PIL import Image
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
before=json.loads((HERE/'antes/navegador.json').read_text(encoding='utf-8'))
after=json.loads((HERE/'despues/navegador.json').read_text(encoding='utf-8'))
metadata=json.loads((ROOT/'_data/imagenes_blog.json').read_text(encoding='utf-8'))
index={(r['url'],r['width'],r['dpr']):r for r in before};variants={v['src']:source for source,item in metadata['imagenes'].items() for v in item['variants']}
rows=[];errors=[];quality_caps=[]
for r in after:
    old=index[(r['url'],r['width'],r['dpr'])]
    if old['textHash']!=r['textHash']:errors.append(['text_changed',r['url'],r['width'],r['dpr']])
    if [(i['alt'],i['title']) for i in old['images']]!=[(i['alt'],i['title']) for i in r['images']]:errors.append(['alt_or_title_changed',r['url'],r['width'],r['dpr']])
    rows.append(dict(url=r['url'],width=r['width'],dpr=r['dpr'],before=old['imageBytes'],after=r['imageBytes'],saving=round((1-r['imageBytes']/old['imageBytes'])*100,1)))
    for im in r['images']:
        if im['src'] not in variants:continue
        source=variants[im['src']]
        with Image.open(ROOT/source.lstrip('/')) as original:sw,sh=original.size
        with Image.open(ROOT/im['src'].lstrip('/')) as selected:chosen=selected.width
        bw,bh=im['box'];required=(max(bw,bh*sw/sh) if im['fit']=='cover' else bw)*r['dpr']
        # A small browser selection tolerance is permitted; the source cap is documented.
        if chosen<min(required,sw)*.95:errors.append(['undersized_variant',r['url'],r['width'],r['dpr'],im['src'],chosen,round(required)])
        if required>sw*1.1:quality_caps.append(dict(url=r['url'],viewport=r['width'],dpr=r['dpr'],source=source,available=sw,required=round(required)))
    for im in (i for i in r['images'] if i['hero'] and i['src'] in variants):
        if not any(p['srcset']==im['srcset'] and p['sizes']==im['sizes'] for p in r['preloads']):errors.append(['preload_mismatch',r['url']])
        count=sum(x['path']==im['src'] for x in r['imageResponses'])
        if count!=1:errors.append(['hero_request_count',r['url'],r['width'],r['dpr'],im['src'],count])
result=dict(comparisons=len(rows),text_and_alt_checks=len(rows),errors=errors,source_resolution_limits=quality_caps,weight_regressions=[r for r in rows if r['after']>r['before']])
(HERE/'ahorro.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
(HERE/'comparacion.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(dict(comparisons=len(rows),errors=errors,source_resolution_limits=len(quality_caps),weight_regressions=result['weight_regressions'],samples=[r for r in rows if r['url'] in ['/','/blog/','/blog/tipos-de-toppings-para-helado/','/blog/pasteurizacion-mezcla-helado-correcta/'] and r['width'] in [390,1440]]),ensure_ascii=False,indent=2))
if errors or result['weight_regressions']:raise SystemExit(1)
