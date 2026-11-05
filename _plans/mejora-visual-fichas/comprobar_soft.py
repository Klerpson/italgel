"""Compara la ficha soft con su referencia, sin modificar páginas."""
import hashlib
import importlib.util
import json
import sys
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('protected', OUT / 'comprobar_medellin.py')
guard = importlib.util.module_from_spec(spec)
mode = sys.argv[1]
saved = sys.argv
sys.argv = [sys.argv[0]]
spec.loader.exec_module(guard)
sys.argv = saved
route = 'maquinas-helado-soft/index.html'
source = (ROOT / route).read_text(encoding='utf8')
local = (ROOT / '_site' / route).read_bytes()
reference = OUT / 'soft-antes.json'

def public():
    return urlopen(Request('https://italgel.com.co/maquinas-helado-soft/', headers={'User-Agent': 'Mozilla/5.0'}), timeout=40).read()

def normal(data):
    return json.loads(json.dumps(guard.fingerprint(data), ensure_ascii=False))

if mode == 'antes':
    actual = normal(public())
    assert normal(local) == actual, 'La base local difiere del sitio publicado'
    record = dict(protected=actual, front_matter=source.split('---', 2)[1], html_sha256={p.relative_to(ROOT / '_site').as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT / '_site').rglob('*.html')})
    reference.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding='utf8')
    print('Referencia soft local/publicada coincidente guardada')
else:
    record = json.loads(reference.read_text(encoding='utf8'))
    actual = normal(public() if mode == 'vivo' else local)
    differences = [k for k in actual if actual[k] != record['protected'][k]]
    if source.split('---', 2)[1] != record['front_matter']:
        differences.append('front_matter')
    other = [rel for rel, sha in record['html_sha256'].items() if rel != route and (not (ROOT / '_site' / rel).exists() or hashlib.sha256((ROOT / '_site' / rel).read_bytes()).hexdigest() != sha)] if mode == 'local' else []
    result = dict(mode=mode, diferencias_protegidas=differences, otras_paginas_html_modificadas=other)
    (OUT / ('soft-protegido-' + mode + '.json')).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
    print(json.dumps(result))
    if differences or other:
        sys.exit(1)
