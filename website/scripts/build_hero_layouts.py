"""Build four local-only hero layout proposals using the approved blue image."""
from pathlib import Path
from html import escape
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist/previews/hero-layouts-v1'
OUT.mkdir(parents=True, exist_ok=True)
SRC = ROOT / 'src/hero-layouts'
shutil.copyfile(SRC/'layouts.css', OUT/'layouts.css')
ASSET = '/assets/hero/product-collection-blue-v3-1920.webp'
image = f'<img class="photo" src="{ASSET}" width="6144" height="4096" srcset="/assets/hero/product-collection-blue-v3-768.webp 768w, /assets/hero/product-collection-blue-v3-1152.webp 1152w, /assets/hero/product-collection-blue-v3-1536.webp 1536w, /assets/hero/product-collection-blue-v3-1920.webp 1920w, /assets/hero/product-collection-blue-v3-2560.webp 2560w, /assets/hero/product-collection-blue-v3-3840.webp 3840w" sizes="(max-width:560px) 1125px, (max-width:820px) 1100px, 100vw" fetchpriority="high" alt="블루 배경 위 삼호 베어링 부품 제품 구성, 제공 사진 기반 AI 편집 이미지">'
caption = '<span class="caption">삼호 제품 사진을 바탕으로 제작한 AI 편집 이미지</span>'
links = '<a href="/overview/">회사소개</a><a href="/products/">제품소개</a><a href="/production/">생산·품질</a>'
header = f'<header class="site-header"><a class="brand" href="/" aria-label="삼호엔지니어링 홈"><img class="symbol" src="/assets/samho-logo-indigo.svg" alt="" width="44" height="44"><img class="wordmark" src="/assets/samho-wordmark.svg" alt="SAMHO" width="124" height="28"></a><nav class="nav" aria-label="주 메뉴">{links}</nav><a class="header-cta" href="/contact/">제작 문의 ↗</a><details class="mobile-nav"><summary>메뉴</summary><nav aria-label="모바일 메뉴">{links}</nav></details></header>'
eyebrow = '<p class="eyebrow">SAMHO ENGINEERING · SINCE 1979</p>'
heading = '<h1 class="headline">작은 부품 하나에,<br>오랜 기술을 담습니다.</h1>'
three_lines = '<h1 class="headline">작은 부품 하나에,<br>오랜 기술을 <br>담습니다.</h1>'
description = '<p class="description">베어링 부품 전문 제조. <br>TRB·DGBB 케이지, 실드, 레이스웨이를 <br>영주의 생산거점에서 만듭니다.</p>'
actions = '<div class="actions"><a class="button" href="/products/">생산 제품 보기 <span aria-hidden="true">↗</span></a><a class="text-link" href="/contact/">제작 문의 →</a></div>'
after = '<section class="after"><p>1979년의 시작부터 오늘까지.<br>고객의 기준을 부품의 완성도로 이어갑니다.</p><a href="/overview/">삼호엔지니어링 소개 ↗</a></section><a class="review-return" href="./">← 히어로 시안 비교로 돌아가기</a>'
variants = [
    dict(id='01',slug='immersive',title='풀스크린 몰입형',tag='사진을 배경으로, 문구는 크게',description='이전 SKF 참고 시안에 가장 가까운 방향입니다. 화면 전체의 사진과 흰 문구로 첫인상을 강하게 만듭니다.',tradeoff='사진 위에 어두운 그라데이션을 얹어 문구를 읽기 쉽게 했습니다. 왼쪽 제품은 어둡게 보입니다.',
         body=f'<section class="hero">{image}<div class="copy">{eyebrow}{heading}{description}{actions}</div><a class="scroll" href="#next"><span></span>SCROLL TO EXPLORE ↓</a>{caption}</section>'),
    dict(id='02',slug='gallery',title='제품 갤러리형',tag='사진은 밝게, 설명은 한곳에',description='제품 사진이 화면을 채우고, 작은 흰색 카드가 문구를 받칩니다. 블루 색상과 금속의 밝기를 가장 적극적으로 보여줍니다.',tradeoff='흰색 카드가 왼쪽 아래 사진 일부를 가립니다. 모바일에서는 문구 카드의 비중이 커집니다.',
         body=f'<section class="hero">{image}<div class="copy">{eyebrow}{three_lines}{description}{actions}</div>{caption}</section>'),
    dict(id='03',slug='editorial',title='와이드 에디토리얼형',tag='문구와 사진을 각각 또렷하게',description='상단에는 넓은 흰 여백과 문구, 그 아래에는 가로 전체를 채운 사진을 배치했습니다. 흰색 오프닝에서 자연스럽게 이어집니다.',tradeoff='사진이 첫 화면 전부를 차지하지는 않지만, 제품 위에 큰 문구가 겹치지 않아 사진을 읽기 편합니다.',
         body=f'<section class="hero"><div class="title-area"><div>{eyebrow}{heading}</div><div>{description}{actions}</div></div><div class="image-area">{image}{caption}</div></section>'),
    dict(id='04',slug='architectural',title='확장 분할형',tag='사진에 더 큰 비중을',description='문구 영역을 좁히고 사진을 화면 끝까지 넓고 높게 펼쳤습니다. 현재 구성의 익숙함을 유지하면서 제품의 존재감을 키웁니다.',tradeoff='데스크톱에서는 사진이 화면 너비의 64%를 차지합니다. 모바일에서는 문구 아래 세로로 긴 사진이 이어집니다.',
         body=f'<section class="hero"><div class="copy">{eyebrow}{three_lines}{description}{actions}<p class="component-label">CAGES · SHIELDS · RACEWAYS</p></div><div class="image-area">{image}{caption}</div></section>')
]
for item in variants:
    item['file'] = item['id']+'-'+item['slug']+'.html'
    body = item['body']+'<div id="next">'+after+'</div>'
    html=f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{item["id"]} · {item["title"]} | 삼호 히어로 시안</title><link rel="stylesheet" href="layouts.css"></head><body class="{item["slug"]}">{header}<main>{body}</main></body></html>'
    (OUT/item['file']).write_text(html)
data = [{k:v for k,v in item.items() if k!='body'} for item in variants]
(OUT/'variants.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
template = (SRC/'index.html').read_text()
template = template.replace('__VARIANTS__',json.dumps(data,ensure_ascii=False))
(OUT/'index.html').write_text(template)
print('Built four local hero proposals: /previews/hero-layouts-v1/')
