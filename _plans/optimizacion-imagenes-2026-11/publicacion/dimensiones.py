"""Registrar dimensiones físicas de las imágenes sociales de la compilación actual."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
from lxml import html
from PIL import Image
import json
ROOT=Path(__file__).resolve().parents[3]
data={}
for p in (ROOT/'_site').rglob('*.html'):
    for url in html.fromstring(p.read_bytes()).xpath('//meta[@property="og:image"]/@content'):
        if urlsplit(url).hostname not in ['italgel.com.co','www.italgel.com.co']: continue
        key=unquote(urlsplit(url).path)
        source=ROOT/key.lstrip('/')
        if source.is_file():
            with Image.open(source) as im: data[key]={'width':im.width,'height':im.height}
(ROOT/'_data/dimensiones_sociales.json').write_text(json.dumps(dict(sorted(data.items())),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'{len(data)} imágenes sociales con dimensiones verificadas')
