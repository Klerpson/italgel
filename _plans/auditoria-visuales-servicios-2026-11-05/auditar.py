"""Inventario textual de páginas comerciales. No descarga ni guarda imágenes."""
import csv
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from lxml import html

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
GROUPS = {
    'Categoría principal': ['equipos', 'maquinas-helado-artesanal', 'maquinas-helado-soft', 'maquinas-helado-industrial', 'vitrinas-congeladores', 'equipos-cafe', 'insumos', 'bases-helado-colombia', 'pastas-sabores-helado', 'variegatos-helado', 'coberturas-salsas-helado', 'productos-quella'],
    'Subcategoría': ['bases-helado-colombia/bases-stevia', 'pastas-sabores-helado/pastas-clasicas', 'pastas-sabores-helado/pastas-fruta', 'pastas-sabores-helado/pastas-premium', 'coberturas-salsas-helado/salsas-especiales'],
    'Cobertura local': ['insumos-heladeria-medellin', 'insumos-heladeria-cali', 'insumos-heladeria-barranquilla', 'insumos-heladeria-bucaramanga'],
    'Ficha de producto': ['bases-helado-colombia/base-50-mec3', 'bases-helado-colombia/neutralin-plus', 'bases-helado-colombia/supergelmix', 'pastas-sabores-helado/pasta-pistacho', 'pastas-sabores-helado/pasta-vainilla', 'coberturas-salsas-helado/amarena-fabbri', 'maquinas-helado-soft/coldelite-compacta-3'] + ['equipos-cafe/' + x for x in ['cedar-63c', 'cruiser', 'ebony-64', 'falcon', 'mini-neo', 'oak-60', 'sequoia-74wt', 'swan', 'tank-1', 'tank-2']],
}

def audit(item):
    group, slug = item
    route = '/' + slug + '/' if slug else '/'
    row = dict(grupo=group, url='https://italgel.com.co' + route)
    try:
        with urlopen(Request(row['url'], headers={'User-Agent': 'Mozilla/5.0 ItalgelVisualAudit'}), timeout=40) as response:
            data = response.read()
            row['http'] = response.status
        doc = html.fromstring(data)
        main = doc.xpath('//main')[0]
        imgs = main.xpath('.//img')
        hero = main.xpath('.//*[@data-hero]//img')
        paths = sorted(set(urlsplit(i.get('src', '')).path for i in imgs))
        gif = sorted(set(urlsplit(s).path for s in main.xpath('.//@src | .//@srcset') if '.gif' in s.lower()))
        body = [i for i in imgs if i not in hero]
        local = ROOT / '_site' / slug / 'index.html'
        local_doc = html.fromstring(local.read_bytes()) if local.exists() else None
        local_paths = sorted(set(urlsplit(i.get('src', '')).path for i in local_doc.xpath('//main//img'))) if local_doc is not None else []
        broken = [x for x in paths if x.startswith('/') and not (ROOT / x.lstrip('/')).is_file()]
        row.update(titulo=' '.join(main.xpath('.//h1//text()')).strip(), imagenes_main=len(imgs), imagenes_unicas=len(paths), imagenes_hero=len(hero), imagenes_cuerpo=len(body), gifs=len(gif), videos=len(main.xpath('.//video')), sin_alt=sum(not i.get('alt', '').strip() for i in imgs), sin_dimensiones=sum(not i.get('width') or not i.get('height') for i in imgs), coincidencia_rutas_local=paths == local_paths, recursos_locales_ausentes='; '.join(broken), imagenes='; '.join(paths), animaciones='; '.join(gif), h2=len(main.xpath('.//h2')), error='')
    except Exception as exc:
        row['error'] = str(exc)
    return row

items = [(group, slug) for group, slugs in GROUPS.items() for slug in slugs] + [('Portada (referencia)', '')]
with ThreadPoolExecutor(max_workers=5) as pool:
    rows = list(pool.map(audit, items))
(OUT / 'inventario.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
keys = list(dict.fromkeys(k for row in rows for k in row))
with (OUT / 'inventario.csv').open('w', newline='', encoding='utf-8-sig') as file:
    writer = csv.DictWriter(file, fieldnames=keys)
    writer.writeheader()
    writer.writerows(rows)
print(json.dumps([dict((k, r.get(k)) for k in ['grupo', 'url', 'http', 'imagenes_main', 'imagenes_cuerpo', 'gifs', 'coincidencia_rutas_local', 'error']) for r in rows], ensure_ascii=False, indent=2))
