"""Referencia textual y comparación de elementos protegidos del piloto visual."""
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.request import Request, urlopen
from lxml import html

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
URL = 'https://italgel.com.co/insumos-heladeria-medellin/'

def fingerprint(data):
    doc = html.fromstring(data)
    for node in doc.xpath('//*[@data-visual-nuevo]'):
        node.drop_tree()
    norm = lambda value: ' '.join(value.split())
    main = doc.xpath('//main')[0]
    return dict(
        title=doc.xpath('string(//title)'),
        meta=[dict(x.attrib) for x in doc.xpath('//head/meta')],
        seo_links=[dict(x.attrib) for x in doc.xpath('//head/link[@rel="canonical" or @rel="alternate" or @rel="sitemap"]')],
        schema=[json.loads(x.text) for x in doc.xpath('//script[@type="application/ld+json"]')],
        headings=[(x.tag, dict(x.attrib), norm(x.text_content())) for x in doc.xpath('//h1|//h2|//h3|//h4|//h5|//h6')],
        links=[(dict(x.attrib), norm(x.text_content())) for x in doc.xpath('//a')],
        images=[dict(x.attrib) for x in doc.xpath('//img')],
        ids=doc.xpath('//@id'),
        main_text=norm(main.text_content()),
    )

def public():
    return urlopen(Request(URL, headers={'User-Agent': 'Mozilla/5.0 ItalgelVisualPilot'}), timeout=40).read()

def write(name, obj):
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding='utf8')

if sys.argv[1] == 'antes':
    local = (ROOT / '_site/insumos-heladeria-medellin/index.html').read_bytes()
    live = public()
    assert fingerprint(local) == fingerprint(live), 'Resolver divergencia local/vivo antes de editar'
    source = (ROOT / 'insumos-heladeria-medellin.html').read_text(encoding='utf8')
    write('medellin-antes.json', dict(protected=fingerprint(live), front_matter=source.split('---', 2)[1], html_sha256={p.relative_to(ROOT / '_site').as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT / '_site').rglob('*.html')}))
    print('Referencia local y publicada coinciden; referencia guardada.')
else:
    baseline = json.loads((OUT / 'medellin-antes.json').read_text(encoding='utf8'))
    mode = sys.argv[1]
    data = public() if mode == 'vivo' else (ROOT / '_site/insumos-heladeria-medellin/index.html').read_bytes()
    actual = json.loads(json.dumps(fingerprint(data), ensure_ascii=False))
    diffs = [key for key in actual if actual[key] != baseline['protected'][key]]
    source = (ROOT / 'insumos-heladeria-medellin.html').read_text(encoding='utf8')
    if source.split('---', 2)[1] != baseline['front_matter']:
        diffs.append('front_matter')
    other = []
    if mode != 'vivo':
        for rel, sha in baseline['html_sha256'].items():
            if rel == 'insumos-heladeria-medellin/index.html':
                continue
            p = ROOT / '_site' / rel
            if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest() != sha:
                other.append(rel)
    result = dict(modo=mode, diferencias_protegidas=diffs, otras_paginas_html_modificadas=other)
    write('medellin-protegido-' + mode + '.json', result)
    print(json.dumps(result, ensure_ascii=False))
    if diffs or other:
        sys.exit(1)
