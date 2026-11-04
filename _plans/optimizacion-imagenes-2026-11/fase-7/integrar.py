import json,re
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
alts={
 '/img/pasta-frutos-bosque-helado.avif':'Presentación de helado de frutos del bosque publicada por MEC3',
 '/img/fiordibosco-frutos-bosque.avif':'Helado de frutos del bosque; imagen ilustrativa del sabor',
 '/img/pasta-vainilla-bourbon-helado.avif':'Helado de vainilla de la ficha Vanilla Bourbon de MEC3',
 '/img/pasta-caramelo-helado-dulce-leche.avif':'Presentación de helado de la ficha Pasta Caramel de MEC3',
 '/img/pasta-coco-helado-tropical.avif':'Presentación de helado de coco publicada por MEC3',
 '/img/salted-caramel-variegato.avif':'Helado decorado con caramelo y palomitas; imagen ilustrativa',
 '/img/fiordilampone-frambuesa-variegato.avif':'Frambuesa fresca sobre fondo blanco; imagen ilustrativa del sabor'}
files=['pastas-sabores-helado/index.html','pastas-sabores-helado/pastas-fruta.html','pastas-sabores-helado/pastas-clasicas.html','coberturas-salsas-helado/index.html','coberturas-salsas-helado/salsas-especiales.html']
for file in files:
 p=ROOT/file;lines=p.read_text(encoding='utf8').splitlines(keepends=True)
 for i,line in enumerate(lines):
  for source,alt in alts.items():
   if f'origen="{source}"' in line:
    line=re.sub(r'alt="[^"]*"',f'alt="{alt}"',line)
    if 'fiordilampone' in source or 'fiordibosco' in source or 'salted-caramel' in source:line=re.sub(r'title="[^"]*"',f'title="{alt}"',line)
  lines[i]=line
 s=''.join(lines)
 for h in ['<h4>Fiordibosco</h4>','<h4>Salted Caramel</h4>','<h3>Salted Caramel</h3>']:
  note='\n        <p><small>Imagen ilustrativa del sabor.</small></p>'
  if h in s and h+note not in s:s=s.replace(h,h+note)
 h='<h4>Fiordilampone</h4>'
 note='\n        <p><small>Imagen ilustrativa del sabor. Foto de <a href="https://unsplash.com/photos/red-raspberry-on-white-background-jHcKq383ibg" target="_blank" rel="noopener noreferrer">Mockup Graphics / Unsplash</a>.</small></p>'
 if h in s and h+note not in s:s=s.replace(h,h+note)
 p.write_text(s,encoding='utf8')
for file in ['_data/inicio.yml','_data/blog.yml']:
 p=ROOT/file;s=p.read_text(encoding='utf8')
 s=s.replace('Variegato salted caramel en cubeta de helado',alts['/img/salted-caramel-variegato.avif'])
 s=s.replace('Variegato Fiordibosco de frutos del bosque en cubeta',alts['/img/fiordibosco-frutos-bosque.avif'])
 p.write_text(s,encoding='utf8')
print('Integradas seis fotos, siete referencias; leyendas ilustrativas y procedencia de stock visibles.')
