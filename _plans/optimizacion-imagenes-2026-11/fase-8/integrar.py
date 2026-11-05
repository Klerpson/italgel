import re,json
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
alts={
 '/img/pasta-arandano-helado-sorbet.avif':'Arándanos frescos sobre fondo blanco; imagen ilustrativa del sabor',
 '/img/pasta-limon-siciliano-sorbet.avif':'Limón cortado sobre superficie clara; imagen ilustrativa del sabor',
 '/img/pasta-mandarina-helado-citrico.avif':'Mandarina sobre fondo blanco; imagen ilustrativa del sabor',
 '/img/pasta-dragon-summer-helado-exotico.avif':'Fruta del dragón entera y cortada; imagen ilustrativa del sabor pitaya',
 '/img/pasta-chocolate-helado-artesanal.avif':'Textura de helado de chocolate publicada por MEC3',
 '/img/pasta-stracciatella-chips-chocolate.avif':'Helado con cobertura de stracciatella publicado por MEC3',
 '/img/pasta-chocolate-blanco-helado.avif':'Presentación de helado sabor chocolate blanco publicada por MEC3'}
stocks=json.loads((HERE/'fuentes/stock.json').read_text(encoding='utf8'))
labels={'arandano-stock':'Arándano Azul','limon-stock':'Limón Siciliano','mandarina-stock':'Mandarina','pitaya-stock':'Dragon Summer (Pitaya)'}
for file in ['pastas-sabores-helado/index.html','pastas-sabores-helado/pastas-fruta.html','pastas-sabores-helado/pastas-clasicas.html']:
 p=ROOT/file;s=p.read_text(encoding='utf8');lines=s.splitlines(keepends=True)
 for i,line in enumerate(lines):
  for source,alt in alts.items():
   if f'origen="{source}"' in line:
    line=re.sub(r'alt="[^"]*"',f'alt="{alt}"',line);line=re.sub(r'title="[^"]*"',f'title="{alt}"',line)
  lines[i]=line
 s=''.join(lines)
 for r in stocks:
  for level in ['h3','h4']:
   h=f'<{level}>{labels[r["name"]]}</{level}>'
   note=f'\n        <p><small>Imagen ilustrativa del sabor. Foto: <a href="{r["page"]}" target="_blank" rel="noopener noreferrer">{r["author"]}</a>.</small></p>'
   if h in s and h+note not in s:s=s.replace(h,h+note)
 p.write_text(s,encoding='utf8')
print('Integradas siete fotos en tres páginas con textos alternativos y créditos de stock.')
