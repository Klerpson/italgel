"""Listado de fotografías para inspección; no exportar galerías."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
data=json.loads((ROOT/'_data/imagenes_catalogo.json').read_text(encoding='utf8'))['imagenes']
print(json.dumps(sorted({v['variants'][-1]['src'] for v in data.values()}),indent=2))
