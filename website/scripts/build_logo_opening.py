"""Build the local-only white/blue logo opening; leave the existing site intact."""
from pathlib import Path
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src/opening-v2'
OUT = ROOT / 'dist/previews/opening-v2'
OUT.mkdir(parents=True, exist_ok=True)
contours = json.loads((SRC / 'logo-contours.json').read_text())
paths = '\n'.join(f'<path class="logo-contour" data-kind="{p["kind"]}" pathLength="1" d="{p["d"]}"/>' for p in contours)
clip = ''.join(f'<path d="{p["d"]}"/>' for p in contours)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="124 114 1024 1024" focusable="false">
<defs><clipPath id="logo-shape">{clip}</clipPath><clipPath id="logo-fill"><rect id="logo-fill-rect" x="120" y="1140" width="1030" height="0"/></clipPath></defs>
<g id="logo-outlines">{paths}</g><g clip-path="url(#logo-fill)"><g clip-path="url(#logo-shape)"><image id="logo-original" href="/previews/opening-v2/assets/samho-logo.webp" x="0" y="0" width="1254" height="1254"/></g></g></svg>'''
overlay = (SRC/'overlay.html').read_text().replace('{{LOGO_SVG}}',svg)
html = (ROOT/'dist/index.html').read_text()
html = html.replace('<title>베어링 부품 전문 제조 | 삼호엔지니어링</title>','<title>로고 오프닝 · 3초 시안 | 삼호엔지니어링</title>')
html = html.replace('<head>','<head><meta name="robots" content="noindex,nofollow">',1)
html = html.replace('href="https://samhoengineering.com/"','href="https://samhoengineering.com/previews/opening-v2/"',1)
html = html.replace('</head>','<link rel="stylesheet" href="/previews/opening-v2/opening.css"><script src="/previews/opening-v2/opening.js" defer></script></head>')
html = html.replace('<body>','<body><div id="site-preview">',1).replace('</body>','</div>'+overlay+'</body>')
(OUT/'index.html').write_text(html)
for file in ('opening.css','opening.js'):
    shutil.copyfile(SRC/file,OUT/file)
print('Built local-only /previews/opening-v2/')
