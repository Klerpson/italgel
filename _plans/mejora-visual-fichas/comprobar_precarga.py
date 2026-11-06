import sys,json,hashlib,importlib.util
from pathlib import Path
from urllib.request import Request,urlopen
from lxml import html
root=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent
mode=sys.argv[1];sys.argv=[sys.argv[0]]
spec=importlib.util.spec_from_file_location('guard',out/'comprobar_medellin.py');g=importlib.util.module_from_spec(spec);spec.loader.exec_module(g)
ref=json.loads((out/'precarga-antes.json').read_text(encoding='utf8'));results=[]
for route,protected in ref['protected'].items():
    data=urlopen(Request('https://italgel.com.co/'+route.removesuffix('index.html'),headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read() if mode=='vivo' else (root/'_site'/route).read_bytes()
    actual=json.loads(json.dumps(g.fingerprint(data)));differences=[k for k in actual if actual[k]!=protected[k]]
    doc=html.fromstring(data);img=doc.xpath('//section[@data-hero]//img')[0];preloads=doc.xpath('//head/link[@rel="preload" and @as="image"]')
    match=len(preloads)==1 and preloads[0].get('href')==img.get('src') and preloads[0].get('imagesrcset')==img.get('srcset') and preloads[0].get('imagesizes')==img.get('sizes')
    results.append(dict(route=route,diferencias_protegidas=differences,precarga_coincide=match))
other=[r for r,sha in ref['html_sha256'].items() if r not in ref['protected'] and hashlib.sha256((root/'_site'/r).read_bytes()).hexdigest()!=sha] if mode=='local' else []
result=dict(mode=mode,results=results,otras_paginas_html_modificadas=other);(out/f'precarga-protegido-{mode}.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(result))
if other or any(r['diferencias_protegidas'] or not r['precarga_coincide'] for r in results):sys.exit(1)
