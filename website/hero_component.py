"""Four approved source photographs, selected 1 -> 4 -> 5 -> 6."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parent

def hero_markup():
    photos=json.loads((ROOT/'src/hero-live/manifest.json').read_text())
    frames=[];buttons=[]
    for i,p in enumerate(photos):
        v=p['variants'];base='/assets/hero-live/'
        srcset=', '.join(f'{base}{x["file"]} {x["width"]}w' for x in v)
        frames.append(f'''<div class="cinema-slide{' is-active' if i==0 else ''}" data-slide="{i}" data-name="{p['name']}" data-zoom="{p['zoom']}" aria-hidden="{str(i!=0).lower()}"><img src="{base}{v[2]['file']}" srcset="{srcset}" sizes="(max-width:600px) 1100px, 100vw" width="{v[-1]['width']}" height="{v[-1]['height']}" alt="{p['alt']}" fetchpriority="{'high' if i==0 else 'low'}" decoding="async"></div>''')
        buttons.append(f'''<button class="cinema-dot" type="button" aria-label="{i+1}번 사진: {p['name']}" aria-pressed="{str(i==0).lower()}"><span class="dot-number">{i+1:02}</span><span class="dot-track"><span></span></span></button>''')
    return '''<section class="hero-cinema" aria-labelledby="hero-title" aria-roledescription="캐러셀" data-cinema>
<div class="cinema-stage">'''+''.join(frames)+'''</div><div class="cinema-shade" aria-hidden="true"></div>
<div class="cinema-copy"><p class="cinema-kicker">SAMHO ENGINEERING <span>—</span> SINCE 1979</p>
<h1 id="hero-title">작은 부품 하나에,<br>오랜 기술을 담습니다.</h1>
<p class="cinema-description">베어링 부품 전문 제조.<br>TRB·DGBB 케이지, 실드, 레이스웨이를<br>영주의 생산거점에서 만듭니다.</p>
<div class="cinema-links"><a class="cinema-link" href="/products/">생산 제품 보기 <span aria-hidden="true">↗</span></a><a class="cinema-link secondary" href="/contact/">제작 문의 <span aria-hidden="true">→</span></a></div></div>
<div class="cinema-bottom"><div class="cinema-pagination" role="group" aria-label="히어로 사진 선택">'''+''.join(buttons)+'''</div>
<a class="cinema-scroll" href="#products">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
<div class="cinema-controls"><p class="cinema-caption" aria-live="off">제품 컬렉션</p><button type="button" data-prev aria-label="이전 사진">←</button><button type="button" data-next aria-label="다음 사진">→</button><button type="button" data-pause aria-label="사진 자동 전환 일시정지" aria-pressed="false"><span aria-hidden="true">Ⅱ</span></button></div></div></section>'''
