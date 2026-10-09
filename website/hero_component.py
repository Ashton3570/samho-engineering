"""Four approved source photographs, selected 1 -> 4 -> 5 -> 6."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parent

def hero_markup():
    photos=json.loads((ROOT/'src/hero-live/manifest.json').read_text())
    frames=[]
    for i,p in enumerate(photos):
        v=p['variants'];base='/assets/hero-live/'
        srcset=', '.join(f'{base}{x["file"]} {x["width"]}w' for x in v)
        avif=', '.join(f'{base}{x["file"]} {x["width"]}w' for x in p['avif_variants'])
        picture=f'<picture><source type="image/avif" srcset="{avif}" sizes="(max-width:600px) 1100px, 100vw">'
        picture+=f'<img src="{base}{v[2]["file"]}" srcset="{srcset}" sizes="(max-width:600px) 1100px, 100vw" width="{v[-1]["width"]}" height="{v[-1]["height"]}" alt="{p["alt"]}" fetchpriority="{"high" if i==0 else "low"}" decoding="async"></picture>'
        media=picture if i==0 else '<template data-slide-media>'+picture+'</template>'
        frames.append(f'''<div class="cinema-slide{' is-active' if i==0 else ''}" data-slide="{i}" data-name="{p['name']}" data-zoom="{p['zoom']}" aria-hidden="{str(i!=0).lower()}">{media}</div>''')
    return '''<section class="hero-cinema" aria-labelledby="hero-title" aria-roledescription="캐러셀" data-cinema>
<div class="cinema-stage">'''+''.join(frames)+'''</div><div class="cinema-shade" aria-hidden="true"></div>
<div class="cinema-copy"><p class="cinema-kicker">SAMHO ENGINEERING <span>—</span> SINCE 1979</p>
<h1 id="hero-title">반세기의 기술로,<br>세계 베어링 산업과 함께.</h1>
<p class="cinema-description">세계 11개국의 베어링 생산 거점에.<br>삼호엔지니어링은 베어링의 핵심 부품인<br>케이지, 실드, 레이스웨이를 공급합니다.</p>
<div class="cinema-links"><a class="cinema-link" href="/overview/">회사소개 <span aria-hidden="true">↗</span></a><a class="cinema-link secondary" href="/products/">생산 제품 보기 <span aria-hidden="true">→</span></a></div></div>
<div class="cinema-bottom">
<a class="cinema-scroll" href="#products" aria-label="생산 제품 섹션으로 이동"><span aria-hidden="true">↓</span></a>
<div class="cinema-controls"><button type="button" data-prev aria-label="이전 사진">←</button><button type="button" data-next aria-label="다음 사진">→</button></div></div></section>'''
