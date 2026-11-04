"""Sustituye solo img literales identificadas en el inventario, conservando el resto del archivo."""
import json,re
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
images=json.loads((ROOT/'_data/imagenes_catalogo.json').read_text(encoding='utf-8'))['imagenes']
alts={'bases-stevia-helado':'Helado presentado por MEC3 para Base G Crema con stevia','yogo-greco-stevia':'Helado suave presentado en la ficha Yogomec Greco G de MEC3','fiordiamarena-variegato-cerezas':'Helado con cerezas Amarena Fabbri y su almíbar','base-50-mec3-empaque':'Vitrina con distintos sabores de helado artesanal'}
files=list(ROOT.glob('*.html'))
for folder in ['bases-helado-colombia','pastas-sabores-helado','coberturas-salsas-helado','productos-quella','variegatos-helado','vitrinas-congeladores','maquinas-helado-soft','maquinas-helado-artesanal','maquinas-helado-industrial']:
    files.extend((ROOT/folder).glob('*.html'))
changed=[];skipped=[]
for file in files:
    original=file.read_bytes().decode('utf-8');text=original
    if re.search(r'^published:\s*false\s*$',text.split('---',2)[1] if text.startswith('---') else '',re.M):continue
    count=[0]
    def replace(match):
        tag=match.group();attrs=dict(re.findall(r'([\w-]+)="([^"]*)"',tag));src=attrs.get('src','')
        found=re.search(r"['\"](/?img/[^'\"]+)['\"]",src)
        if not found:return tag
        source='/'+found[1].lstrip('/')
        if source not in images:return tag
        if 'style' in attrs or '{{' in attrs.get('alt','') or '{{' in attrs.get('title',''):
            skipped.append(dict(file=file.relative_to(ROOT).as_posix(),source=source));return tag
        stem=Path(source).stem;alt=alts.get(stem,attrs.get('alt',''));title=attrs.get('title',alt)
        if stem in alts:title=alt
        args=f'origen="{source}" alt="{alt}" title="{title}" contexto="body"'
        if attrs.get('class'):args+=f' clase="{attrs["class"]}"'
        count[0]+=1;return '{% include mercato/imagen-catalogo.html '+args+' %}'
    text=re.sub(r'<img\b[^>]*>',replace,text,flags=re.S)
    text=re.sub(r'(origen="/img/pasta-fresa-helado-natural\.avif" alt=")[^"]*(" title=")[^"]*"',lambda m:m[1]+'Helado con fresa, imagen ilustrativa del sabor'+m[2]+'Imagen ilustrativa de helado con fresa"',text)
    # Update only image metadata in front matter, not the commercial copy.
    if text.startswith('---'):
        parts=text.split('---',2);front=parts[1];hero=re.search(r'^hero:\s*["\']?/?img/([^"\'\s]+)',front,re.M)
        if hero:
            stem=Path(hero[1]).stem
            if stem in alts:front=re.sub(r'^alt:.*$',f'alt: "{alts[stem]}"',front,flags=re.M);front=re.sub(r'^hero_title:.*$',f'hero_title: "{alts[stem]}"',front,flags=re.M)
            if stem.startswith('hero-insumos-heladeria-'):
                front=re.sub(r'^alt:.*$','alt: "Exhibición de productos para heladería en un stand de MEC3"',front,flags=re.M)
                front=re.sub(r'^hero_title:.*$','hero_title: "Productos para heladería de MEC3"',front,flags=re.M)
        text='---'.join([parts[0],front,parts[2]])
    if text!=original:file.write_bytes(text.encode('utf-8'));changed.append(dict(file=file.relative_to(ROOT).as_posix(),images=count[0]))
integrated=[dict(file=f.relative_to(ROOT).as_posix(),images=f.read_bytes().count(b'include mercato/imagen-catalogo.html')) for f in files if b'include mercato/imagen-catalogo.html' in f.read_bytes()]
(HERE/'integracion.json').write_text(json.dumps(dict(changed_this_run=changed,integrated=integrated,skipped=skipped),ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(dict(changed=len(changed),images=sum(x['images'] for x in changed),skipped=skipped),ensure_ascii=False,indent=2))
