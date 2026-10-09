"""Reuse the approved opening on the home page and its review route."""
from pathlib import Path
import shutil
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parent
SRC=ROOT/'src/opening-v3'

def opening_markup():
    source=ET.fromstring((SRC/'samho-logo.svg').read_text())
    paths=[p.attrib['d'] for p in source.iter('{http://www.w3.org/2000/svg}path')]
    assert len(paths)==5
    outlines=''.join(f'<path class="logo-contour" data-kind="{kind}" pathLength="1" d="{path}"/>' for kind,path in zip(['arc','arc','core','dot','dot'],paths))
    solid=''.join(f'<path d="{path}"/>' for path in paths)
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-54 -54 1260 1260" focusable="false">
<defs><clipPath id="logo-fill"><rect id="logo-fill-rect" x="-54" y="1206" width="1260" height="0"/></clipPath></defs>
<g id="logo-guide" fill="none" stroke="#1e2083" stroke-width="4">{solid}</g>
<g id="logo-outlines">{outlines}</g><g id="logo-solid" clip-path="url(#logo-fill)" fill="#1e2083">{solid}</g></svg>'''
    return (SRC/'overlay.html').read_text().split('<aside',1)[0].replace('{{LOGO_SVG}}',svg)

def with_home_opening(html):
    assets=ROOT/'dist/assets';assets.mkdir(parents=True,exist_ok=True)
    for name in ('opening.css','opening.js'): shutil.copyfile(SRC/name,assets/name)
    # White first paint; failure to load animation must never block the homepage.
    bootstrap='<style>html.opening-pending::after{content:"";position:fixed;inset:0;background:white;z-index:110;pointer-events:none}</style><script>'+(SRC/'session.js').read_text()+'</script>'
    html=html.replace('</head>',bootstrap+'<link rel="stylesheet" href="/assets/opening.css?v=20261006-size4"><script src="/assets/opening.js?v=20261008-performance" defer></script></head>')
    html=html.replace('<body>','<body><div id="site-preview">',1)
    return html.replace('</body>','</div>'+opening_markup()+'</body>',1)
