"""Hero delivery reflects object-fit: cover, viewport height, and screen density."""
from html import escape

# The photograph can be wider than the element when cover crops a tall viewport.
# Match the 3:2 image's uncropped width to the height/min-height in hero-gallery.css.
HERO_SIZES=(
    '(max-width:560px) max(100vw, 1065px, calc(150svh - 109.5px)), '
    '(max-width:820px) max(100vw, 1005px, calc(150svh - 109.5px)), '
    '(min-height:900px) max(100vw, calc(150svh - 127.5px)), '
    'max(100vw, 1035px, calc(150svh - 127.5px))'
)

def markup(manifest):
    entries=manifest['assets']
    fallback=min(entries,key=lambda entry:abs(entry['width']-1920))
    srcset=', '.join(f"/assets/hero/{entry['file']} {entry['width']}w" for entry in entries)
    return (f'<img src="/assets/hero/{fallback["file"]}" srcset="{srcset}" '
            f'sizes="{HERO_SIZES}" width="{manifest["width"]}" height="{manifest["height"]}" '
            'alt="블루 배경 위에 다양한 크기의 삼호 베어링 케이지와 링 부품을 배치한 제품 사진 기반 AI 편집 이미지" '
            'fetchpriority="high" decoding="async">')
