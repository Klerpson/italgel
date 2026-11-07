"""Referencia y comprobación de contenido protegido para la ficha bases."""
import hashlib
import importlib.util
import json
import sys
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
mode = sys.argv[1]
spec = importlib.util.spec_from_file_location('protected', OUT / 'comprobar_medellin.py')
guard = importlib.util.module_from_spec(spec)
sys.argv = [sys.argv[0]]
spec.loader.exec_module(guard)
route = 'bases-helado-colombia/index.html'
source = (ROOT / route).read_text(encoding='utf8')
local = (ROOT / '_site' / route).read_bytes()
def public():
    return urlopen(Request('https://italgel.com.co/bases-helado-colombia/', headers={'User-Agent':'Mozilla/5.0'}), timeout=40).read()
def normal(data):
    return json.loads(json.dumps(guard.fingerprint(data), ensure_ascii=False))
ref = OUT / 'bases-antes.json'
if mode == 'antes':
    assert not ref.exists(), 'No sobrescribir la referencia existente'
    actual = normal(public())
    assert normal(local) == actual, 'Divergencia entre local y vivo'
    ref.write_text(json.dumps(dict(protected=actual, front_matter=source.split('---',2)[1], html_sha256={p.relative_to(ROOT/'_site').as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'_site').rglob('*.html')}), ensure_ascii=False, indent=2), encoding='utf8')
    print('Referencia bases local/publicada coincidente guardada')
else:
    record = json.loads(ref.read_text(encoding='utf8'))
    actual = normal(public() if mode == 'vivo' else local)
    authorized = []
    for n,img in enumerate(actual['images']):
        if img.get('src') == '/img/catalogo/bases-tres-sabores-hero-1200.avif':
            old = record['protected']['images'][n]
            assert old['src'] == '/img/catalogo/bases-helado-italgel-colombia-584.avif'
            allowed = {'src','srcset','sizes','width','height','style'}
            assert {k:v for k,v in img.items() if k not in allowed} == {k:v for k,v in old.items() if k not in allowed}
            actual['images'][n] = old
            authorized.append('Solo recurso visible/dimensiones de cabecera; alt/title conservados')
    differences = [k for k in actual if actual[k] != record['protected'][k]]
    if source.split('---',2)[1].replace('hero_visual: /img/catalogo/bases-tres-sabores-hero-1200.avif\n','') != record['front_matter']: differences.append('front_matter')
    other = [rel for rel,sha in record['html_sha256'].items() if rel != route and (not (ROOT/'_site'/rel).exists() or hashlib.sha256((ROOT/'_site'/rel).read_bytes()).hexdigest()!=sha)] if mode=='local' else []
    concurrent = json.loads((OUT/'bases-cambio-ajeno.json').read_text(encoding='utf8'))
    assert hashlib.sha256((ROOT/concurrent['source']).read_bytes()).hexdigest() == concurrent['source_sha256'], 'Cambio concurrente difiere de referencia integrada'
    other = [rel for rel in other if rel != concurrent['html']]
    result = dict(cambio_ajeno_integrado=concurrent, mode=mode, cambios_visuales_autorizados=authorized, diferencias_protegidas=differences, otras_paginas_html_modificadas=other)
    (OUT/f'bases-protegido-{mode}.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps(result))
    if differences or other: sys.exit(1)
