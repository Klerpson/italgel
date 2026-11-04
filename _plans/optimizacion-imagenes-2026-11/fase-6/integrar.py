import json,re
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
keys=json.loads((HERE/'claves.json').read_text())
replacements={
 '/img/valmar-labotronic-he.avif':keys['stargel'],
 '/img/valmar.avif':keys['snowy'],
 '/img/valmar-pastomaster.avif':keys['sweety'],
 '/img/pasteurizadora-italgel.avif':keys['sweety'],
 '/img/mantecadora-artesanal-coldelite.avif':keys['compacta'],
 '/img/mantecadora-valmar-gelato.avif':keys['snowy'],
 '/img/maquina-soft-301.avif':keys['coldelite301'],
 '/img/maquina-soft-coldelite.avif':keys['coldelite301'],
 '/img/maquina-coldelite-soft-sabores.avif':keys['coldelite603'],
 '/img/maquina-coldelite-soft-3-sabores.avif':keys['coldelite603'],
 '/img/maquinas-soft-pasmo-S121.avif':keys['pasmo'],
 '/img/quella-dark-chocolate-oscuro.avif':keys['quellaDark'],
 '/img/quella-pistacchio-pistacho.avif':keys['quellaPistacho'],
}
files=['index.html','equipos.html','maquinas-helado-artesanal/index.html','maquinas-helado-soft/index.html','coberturas-salsas-helado/index.html','_data/inicio.yml','_data/blog.yml','_data/navegacion.yml']
for file in files:
 p=ROOT/file;s=p.read_text(encoding='utf8')
 for old,new in replacements.items():
  if file=='_data/navegacion.yml':new=re.sub(r'-\d+\.avif$','-160.avif',new)
  s=s.replace(old,new)
 s=s.replace('Mantecadora Labotronic HE para helado artesanal','Mantecadora de mesa Promag Stargel 4').replace('title="Labotronic HE"','title="Promag Stargel 4"')
 s=s.replace('Mantecadora Stargel para gelato artesanal','Mantecadora Valmar Snowy 7 M').replace('title="Stargel"','title="Valmar Snowy 7 M"')
 s=s.replace('Mantecadora Pastomaster 60 RTL para producciÃ³n semi-industrial','Pasteurizadora Valmar Sweety 60 Quick').replace('title="Pastomaster 60 RTL"','title="Valmar Sweety 60 Quick"')
 s=s.replace('Pasteurizadora Valmar Pastomaster para producciÃ³n industrial de helado','Pasteurizadora Valmar Sweety 60 Quick para mezcla de helado')
 s=s.replace('Mantecadora profesional instalada en obrador de heladerÃ­a','Mantecadora Valmar Snowy 7 M sobre fondo blanco')
 s=s.replace('MÃ¡quina Pasmo 3 para helado soft','MÃ¡quina de mesa Pasmo S121 Gravity para helado soft').replace('title="MÃ¡quina soft Pasmo"','title="Pasmo S121 Gravity"')
 s=s.replace('alt="LÃ­nea industrial para producciÃ³n de helado" title="LÃ­nea industrial para producciÃ³n de helado"','alt="Pasteurizadora Valmar Sweety 60 Quick" title="Pasteurizadora Valmar"')
 if file=='maquinas-helado-soft/index.html':
  s=s.replace('Pasmo S121 3 (2 sabores + twist)','Pasmo S121 (2 sabores + twist)')
  s=s.replace('mesa para 1 sabores + twist','mesa para un sabor').replace('<td>1 + twist</td>','<td>1</td>')
  s=re.sub(r'\s*<a\s+href="\{\{\x27/maquinas-helado-soft/coldelite-compacta-3/\x27\|relative_url\}\}"\s+class="boton boton_2" title="Coldelite Compacta 3: mÃ¡quina de helado soft">Ver ficha tÃ©cnica</a\s*>','',s)
 if file=='coberturas-salsas-helado/index.html':
  s=s.replace('alt="Quella Dark chocolate oscuro intenso"','alt="PresentaciÃ³n de crema Quella Dark publicada por MEC3"').replace('alt="Quella Pistacchio crema de pistacho"','alt="PresentaciÃ³n de crema Quella Pistacchio publicada por MEC3"')
 p.write_text(s,encoding='utf8')
print('Integradas nueve fotografÃ­as en ocho archivos; fuentes antiguas conservadas.')
