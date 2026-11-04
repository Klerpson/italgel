from pathlib import Path
import subprocess,json,csv
from io import BytesIO
from PIL import Image
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
rows=[]
for r in csv.DictReader((ROOT/'_plans/auditoria-visual-2026-11-04/prioridades-imagenes.csv').open(encoding='utf-8-sig')):
    if float(r['max_scale_DPR1'])<=1.1 or r['path'].count('/')!=2:continue
    src=r['path'].lstrip('/');candidate=str(Path(src).with_suffix('.png')).replace('\\','/')
    commit=subprocess.check_output(['git','log','-1','--all','--diff-filter=D','--format=%H','--',candidate],cwd=ROOT).decode().strip()
    if not commit:continue
    try:
        data=subprocess.check_output(['git','show',commit+'^:'+candidate],cwd=ROOT,stderr=subprocess.DEVNULL)
        with Image.open(BytesIO(data)) as im:size=im.size
        with Image.open(ROOT/src) as im:old=im.size
        dest=HERE/'fuentes'/Path(candidate).name
        if size[0]>old[0] or size[1]>old[1]:dest.write_bytes(data)
        rows.append(dict(path=src,previous_path=candidate,commit=commit,old=list(old),recovered=list(size),saved=size[0]>old[0] or size[1]>old[1]))
    except Exception as e:rows.append(dict(path=src,error=str(e)))
(HERE/'historial.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(rows,ensure_ascii=False,indent=2))
