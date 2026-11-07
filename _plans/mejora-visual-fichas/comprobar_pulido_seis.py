"""Referencia protegida para el pulido de las seis fichas, sin cambiar contenido/SEO."""
import sys,json,hashlib,importlib.util
from pathlib import Path
from urllib.request import urlopen,Request
ROOT=Path(__file__).resolve().parents[2];OUT=Path(__file__).resolve().parent
mode=sys.argv[1];sys.argv=[sys.argv[0]]
spec=importlib.util.spec_from_file_location('guard',OUT/'comprobar_medellin.py');guard=importlib.util.module_from_spec(spec);spec.loader.exec_module(guard)
routes={'insumos-heladeria-medellin/':'insumos-heladeria-medellin.html','maquinas-helado-soft/':'maquinas-helado-soft/index.html','variegatos-helado/':'variegatos-helado/index.html','maquinas-helado-industrial/':'maquinas-helado-industrial/index.html','vitrinas-congeladores/':'vitrinas-congeladores/index.html','productos-quella/':'productos-quella/index.html'}
def normal(data,route):
 d=json.loads(json.dumps(guard.fingerprint(data),ensure_ascii=False))
 if route=='productos-quella/':
  # Solo se autoriza mover la foto existente del kit al catálogo; sus atributos deben ser idénticos.
  moved=[i for i in d['images'] if i.get('src')=='/img/variegatos-quella-textura.avif' and i.get('title')=='Variegatos Quella Family'];assert len(moved)==1
  d['images']=[i for i in d['images'] if i not in moved]+moved
 return d
def live(route):return urlopen(Request('https://italgel.com.co/'+route,headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read()
ref=OUT/'pulido-seis-antes.json'
if mode=='antes':
 assert not ref.exists()
 baseline={}
 for route,source in routes.items():
  actual=normal(live(route),route);assert normal((ROOT/'_site'/route/'index.html').read_bytes(),route)==actual,route+' difiere de producción'
  baseline[route]={'protected':actual,'front_matter':(ROOT/source).read_text(encoding='utf8').split('---',2)[1]}
 ref.write_text(json.dumps({'pages':baseline,'html_sha256':{p.relative_to(ROOT/'_site').as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'_site').rglob('*.html')}},ensure_ascii=False,indent=2),encoding='utf8');print('Referencia local/publicada coincidente de seis fichas guardada')
else:
 baseline=json.loads(ref.read_text(encoding='utf8'));results=[]
 for route,source in routes.items():
  actual=normal(live(route) if mode=='vivo' else (ROOT/'_site'/route/'index.html').read_bytes(),route);old=baseline['pages'][route]
  diffs=[k for k in actual if actual[k]!=old['protected'][k]]
  if (ROOT/source).read_text(encoding='utf8').split('---',2)[1]!=old['front_matter']:diffs.append('front_matter')
  results.append({'url':route,'differences':diffs})
 other=[rel for rel,sha in baseline['html_sha256'].items() if rel not in [r+'index.html' for r in routes] and hashlib.sha256((ROOT/'_site'/rel).read_bytes()).hexdigest()!=sha] if mode=='local' else []
 result={'mode':mode,'pages':results,'other_html_changed':other};(OUT/('pulido-seis-protegido-'+mode+'.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(result));assert not other and not any(r['differences'] for r in results)
