"""Create a resolution-independent SAMHO wordmark matching the supplied heavy italic lettering."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parents[1]
font = instantiateVariableFont(
    TTFont('/System/Library/Fonts/SFNSItalic.ttf'),
    {'wght': 800, 'opsz': 28, 'YAXS': 400},
    inplace=False,
)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
units = font['head'].unitsPerEm
bounds = BoundsPen(glyphs)
outlines = SVGPathPen(glyphs)
cursor = 0
for letter in 'SAMHO':
    name = cmap[ord(letter)]
    transform = (1, 0, 0, 1, cursor, 0)
    glyphs[name].draw(TransformPen(outlines, transform))
    glyphs[name].draw(TransformPen(bounds, transform))
    cursor += font['hmtx'][name][0] - units * .04
x0, y0, x1, y1 = bounds.bounds
width, height = x1 - x0, y1 - y0
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="486" height="100" '
    f'viewBox="0 0 {width:.4f} {height:.4f}" role="img" aria-labelledby="title">'
    f'<title id="title">SAMHO</title>'
    f'<path fill="#1e2083" transform="translate({-x0:.4f} {y1:.4f}) scale(1 -1)" '
    f'd="{outlines.getCommands()}"/></svg>\n'
)
(ROOT / 'src/samho-wordmark.svg').write_text(svg)
print('Created outlined SVG wordmark; no embedded raster or runtime font dependency.')
