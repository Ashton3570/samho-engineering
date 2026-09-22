"""Build an isolated opening preview over an unchanged copy of the homepage."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src/opening-v1'
OUT = ROOT / 'dist/previews/opening-v1'
OUT.mkdir(parents=True, exist_ok=True)
html = (ROOT / 'dist/index.html').read_text()
html = html.replace('<title>베어링 부품 전문 제조 | 삼호엔지니어링</title>', '<title>오프닝 시안 01 | 삼호엔지니어링</title>')
html = html.replace('<head>', '<head><meta name="robots" content="noindex,nofollow">', 1)
html = html.replace('href="https://samhoengineering.com/"', 'href="https://samhoengineering.com/previews/opening-v1/"', 1)
html = html.replace('</head>', '<link rel="stylesheet" href="/previews/opening-v1/opening.css"><script src="/previews/opening-v1/opening.js" defer></script></head>')
html = html.replace('<body>', '<body><div id="site-preview">', 1)
html = html.replace('</body>', '</div>'+(SOURCE/'overlay.html').read_text()+'</body>')
(OUT / 'index.html').write_text(html)
for name in ('opening.css', 'opening.js'):
    shutil.copyfile(SOURCE / name, OUT / name)
print(f'Built {OUT.relative_to(ROOT)}/index.html')
