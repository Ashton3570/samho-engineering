"""Build the review page from the integrated home opening without duplicating it."""
from pathlib import Path
import shutil
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'src/opening-v3'
OUT=ROOT/'dist/previews/opening-v3'
(OUT/'assets').mkdir(parents=True,exist_ok=True)
html=(ROOT/'dist/index.html').read_text()
assert html.count('id="logo-opening"')==1, 'Build the integrated homepage first'
html=html.replace('<title>베어링 부품 전문 제조 | 삼호엔지니어링</title>','<title>원본 로고 오프닝 · 4.5초 시안 | 삼호엔지니어링</title>')
html=html.replace('<head>','<head><meta name="robots" content="noindex,nofollow">',1)
html=html.replace('href="https://samhoengineering.com/"','href="https://samhoengineering.com/previews/opening-v3/"',1)
html=html.replace('/assets/opening.css?v=20260923b','/previews/opening-v3/opening.css?v=20260923b').replace('/assets/opening.js?v=20260923b','/previews/opening-v3/opening.js?v=20260923b')
review='<aside'+(SRC/'overlay.html').read_text().split('<aside',1)[1]
html=html.replace('</body>',review+'</body>',1)
(OUT/'index.html').write_text(html)
for name in ('opening.css','opening.js'): shutil.copyfile(SRC/name,OUT/name)
shutil.copyfile(SRC/'samho-logo.svg',OUT/'assets/samho-logo.svg')
print('Built local-only /previews/opening-v3/')
