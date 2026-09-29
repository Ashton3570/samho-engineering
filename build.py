"""Build the public site from approved copy and brochure product data.

Run: python3 build.py. Preserved /designs/ snapshots are never rewritten.
"""
from pathlib import Path
from html import escape as e
import json
import re
from opening_component import with_home_opening
from reference_content import thumbnail, product_media, company_visual, production_content, resources_content, img

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'dist'
PRODUCTS = json.loads((ROOT / 'src/products.json').read_text())
GROUPS = {'cage': '케이지', 'shield': '실드·커버·캡', 'raceway': '레이스웨이'}
DATE = '회사 소개서 2025.10.01 기준'
NAV = [('overview', '회사소개'), ('products', '제품소개'), ('production', '생산·품질'), ('resources', '자료실')]
COMPANY = [('overview', '회사 개요·비전'), ('history', '연혁'), ('philosophy', '경영철학')]


def link(path, title, active=''):
    return f'<a href="/{path}/"'+(' aria-current="page"' if path == active else '')+f'>{title}</a>'


def heading(kicker, title, intro='', page=''):
    return f'<div class="page-head wrap"><nav class="crumb" aria-label="현재 위치"><a href="/">홈</a><span>/</span><span>{e(page or kicker)}</span></nav><p class="eyebrow">{kicker}</p><h1>{title}</h1>'+ (f'<p class="lead">{intro}</p>' if intro else '') + '</div>'


def blank(title, cls=''):
    return f'<section class="empty-topic {cls}"><h3>{title}</h3></section>'


def plant_photo(name, title, alt, height):
    base = f'/assets/plants/{name}'
    return f'''<figure class="plant-photo"><img src="{base}-1200.webp" srcset="{base}-640.webp 640w, {base}-1200.webp 1200w, {base}-1800.webp 1800w" sizes="(max-width: 520px) calc(100vw - 40px), (max-width: 820px) calc((100vw - 72px) / 2), (max-width: 1100px) calc((100vw - 116px) / 2), (max-width: 1376px) calc((100vw - 164px) / 2), 606px" width="1800" height="{height}" loading="lazy" decoding="async" alt="{alt}"><figcaption>{title}</figcaption></figure>'''


def cta():
    return '<section class="contact-band"><div class="wrap"><div><p class="eyebrow">제작 상담</p><h2>필요한 부품에서,<br>다음 이야기를 시작합니다.</h2></div><a class="button primary" href="/contact/">제작 문의 <span aria-hidden="true">↗</span></a></div></section>'


def page(path, title, body, active='', company=False, description=''):
    nav = ''.join(link(p, t, active) for p,t in NAV)
    subnav = '<nav class="subnav wrap" aria-label="회사소개 세부 메뉴">'+''.join(link(p,t,path) for p,t in COMPANY)+'</nav>' if company else ''
    # Insert company navigation directly after the page heading, before content.
    if company:
        marker = '</div><!--page-head-->'
        body = body.replace(marker, marker + subnav, 1)
    html = f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} | 삼호엔지니어링</title><meta name="description" content="{e(description or title)}">
<meta name="theme-color" content="#ffffff"><meta property="og:title" content="{e(title)} | 삼호엔지니어링"><meta property="og:description" content="{e(description or title)}">
<link rel="canonical" href="https://samhoengineering.com/{path + '/' if path else ''}">
<link rel="icon" href="/designs/v4/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css?v=20260929a">
<script src="/assets/products.js" defer></script><script src="/assets/site.js?v=20260922e" defer></script></head>
<body><a class="skip" href="#main">본문 바로가기</a>
<header class="header"><div class="header-inner wrap"><a class="brand header-brand" href="/" aria-label="삼호엔지니어링 홈"><img class="header-symbol" src="/assets/samho-logo-indigo.svg" width="48" height="48" alt=""><img class="header-wordmark" src="/assets/samho-wordmark.svg" width="486" height="100" alt="SAMHO"></a><nav class="desktop-nav" aria-label="주 메뉴">{nav}</nav><a class="header-contact" href="/contact/">제작 문의 <span aria-hidden="true">↗</span></a><button class="menu-toggle" aria-label="메뉴 열기" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button></div></header>
<dialog id="mobile-menu" aria-labelledby="menu-title"><div class="menu-top"><h2 id="menu-title">전체 메뉴</h2><button data-close aria-label="메뉴 닫기">닫기 ×</button></div><nav aria-label="모바일 메뉴">{nav}<a href="/contact/">제작 문의</a></nav><div class="menu-company">{''.join(link(p,t) for p,t in COMPANY)}</div><p>베어링 부품 전문 제조 · Since 1979</p></dialog>
<main id="main">{body}</main>
<footer class="footer wrap"><div class="footer-main"><a class="brand" href="/"><span>SAMHO</span><small>삼호엔지니어링</small></a><p>베어링 부품 전문 제조<br>경상북도 영주시 장수면 용주로 88-60 (갈산리)<br>영주공장 <a href="tel:0547088000">054-708-8000</a></p><nav aria-label="하단 메뉴">{''.join(link(p,t) for p,t in NAV)}<a href="/contact/">제작 문의</a></nav></div><div class="footer-bottom"><p>© 2026 SAMHO ENGINEERING</p><span>기본에 충실한 기술, 신뢰로 이어지는 품질.</span><a href="#main">맨 위로 ↑</a></div></footer>
<div id="status" class="toast" role="status" aria-live="polite"></div></body></html>'''
    if not path:
        html = with_home_opening(html)
        html = html.replace('<body>', '<body class="home-gallery">', 1)
        html = html.replace('</head>', '<link rel="stylesheet" href="/assets/hero-gallery.css?v=20260923a"></head>')
    dest = OUT / path / 'index.html'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html)


def company_heading(kicker, title, intro='', label='회사소개'):
    return heading(kicker, title, intro, label) + '<!--page-head-->'


def product_row(p):
    return f'''<article class="product-row" data-product="{p['id']}" data-group="{p['group']}">
<div class="product-name with-media">{thumbnail(p)}<div><span class="product-code">{p['english']}</span><h3><a href="/products/{p['id']}/">{p['title']}</a></h3><p>{p['short']}</p></div></div>
<dl class="product-range"><dt>생산 외경</dt><dd>{p['size']}</dd></dl>
<div class="row-actions"><a class="text-link" href="/products/{p['id']}/">상세 보기 <span aria-hidden="true">↗</span></a><label class="compare-option"><input type="checkbox" data-compare="{p['id']}" aria-label="{p['title']} 비교 선택"> 규격 비교</label></div></article>'''


def build():
    hero_image = '<img src="/assets/hero/product-collection-blue-v3-1920.webp" srcset="/assets/hero/product-collection-blue-v3-768.webp 768w, /assets/hero/product-collection-blue-v3-1152.webp 1152w, /assets/hero/product-collection-blue-v3-1536.webp 1536w, /assets/hero/product-collection-blue-v3-1920.webp 1920w, /assets/hero/product-collection-blue-v3-2560.webp 2560w, /assets/hero/product-collection-blue-v3-3840.webp 3840w" sizes="(max-width:560px) 1125px, (max-width:820px) 1100px, 100vw" alt="블루 배경 위에 다양한 크기의 삼호 베어링 케이지와 링 부품을 배치한 제품 사진 기반 AI 편집 이미지" width="6144" height="4096" fetchpriority="high">'
    body = (ROOT/'src/hero-gallery.html').read_text().replace('{{HERO_IMAGE}}', hero_image) + '''
<section class="intro-strip wrap"><p>1979년의 시작부터 오늘까지.<br>고객의 기준을 부품의 완성도로 이어갑니다.</p><a class="text-link" href="/overview/">삼호엔지니어링 소개 <span aria-hidden="true">↗</span></a></section>
<section class="section wrap" id="products"><div class="section-head"><div><p class="eyebrow">생산 제품</p><h2>베어링을 이루는,<br>각 부품의 전문성.</h2></div><p>케이지부터 실드, 레이스웨이까지.<br>제품군별 생산 범위와 적용 구분을 확인하세요.</p></div><div class="family-list">'''
    for i,(group,title) in enumerate(GROUPS.items(),1):
        names = {'cage':'TRB · DGBB · 프롱 타입 · ACBB', 'shield':'DGBB 실드 · 휠 베어링 커버·캡', 'raceway':'스트럿 베어링용 · 프레스 성형'}[group]
        family_image = {'cage':'trb-main','shield':'shield-main','raceway':'strut-main'}[group]
        body += f'<a class="family" href="/products/?group={group}"><span class="family-number">0{i}</span><span class="family-photo">{img(family_image, "(max-width: 520px) 80px, 130px")}</span><h3>{title}</h3><p>{names}</p><span class="family-arrow" aria-hidden="true">↗</span></a>'
    body += '''</div><div class="section-foot"><span>3개 제품군 · 9종의 생산 품목</span><a class="text-link" href="/products/">전체 제품 보기 →</a></div></section>
<section class="production-preview"><div class="wrap production-layout"><div><p class="eyebrow">생산·품질</p><h2>영주에 자리한<br>두 개의 생산거점.</h2><p>제품군에 맞춘 생산 기반과<br>꾸준한 공정 개선을 이어갑니다.</p><a class="text-link" href="/production/">생산 기반 살펴보기 ↗</a></div><div class="plant-summary"><article><p class="plant-label">Site-A</p><h3>TRB 케이지</h3><p>2018년 신축 · TRB 케이지 생산라인</p></article><article><p class="plant-label">Site-B</p><h3>DGBB 케이지·실드</h3><p>2021년 신축 · 영주 생산라인 이전 완료</p></article></div></div></section>
<section class="section wrap philosophy-preview"><p class="eyebrow">우리가 지키는 원칙</p><h2>기본에 충실한 기술,<br>신뢰로 이어지는 품질.</h2><p>합리적인 경영, 지속적인 기술 개선, 책임 있는 품질.<br>삼호엔지니어링이 제조를 대하는 세 가지 기준입니다.</p><a class="text-link" href="/philosophy/">경영철학 읽기 ↗</a></section>'''+cta()
    page('', '베어링 부품 전문 제조', body, description='1979년부터 이어온 제조 경험. 영주에서 TRB·DGBB 케이지, 실드, 레이스웨이를 만드는 삼호엔지니어링.')

    body = heading('생산 제품', '필요한 부품을,<br>명확한 규격으로.', '제품군별 외경 범위와 적용 구분을 살펴보세요.', '제품소개')
    body += '''<section class="wrap catalog"><div class="catalog-tools"><div class="filters" role="group" aria-label="제품군 필터"><button data-filter="all" aria-pressed="true">전체 <span>9</span></button>'''
    body += ''.join(f'<button data-filter="{g}" aria-pressed="false">{t} <span>{sum(p["group"]==g for p in PRODUCTS)}</span></button>' for g,t in GROUPS.items())
    body += '''</div><label class="search"><span class="sr-only">제품 검색</span><input id="product-search" type="search" placeholder="제품명 · 적용 베어링 검색" autocomplete="off"><span aria-hidden="true">⌕</span></label></div><div class="catalog-meta"><p id="result-count" role="status">9개 제품</p><span>생산 외경 O.D. · mm</span></div><div id="catalog-list">'''
    body += ''.join(product_row(p) for p in PRODUCTS)
    body += f'''</div><div class="empty-results" id="empty-results" hidden><p>검색 조건에 맞는 제품이 없습니다.</p><button class="text-link" id="reset-search">전체 제품 보기</button></div><p class="source-note">{DATE}.</p><div class="comparison-bar"><span id="compare-count">규격 비교 0 / 3</span><div><button id="compare-reset" class="text-link" type="button">선택 해제</button><button id="compare-open" class="button primary" disabled>선택 제품 비교</button></div></div></section>'''
    body += '''<section class="wrap section glossary"><h2>제품 표기 안내</h2><dl><div><dt>TRB</dt><dd>테이퍼 롤러 베어링</dd></div><div><dt>DGBB</dt><dd>깊은 홈 볼 베어링</dd></div><div><dt>ACBB</dt><dd>앵귤러 콘택트 볼 베어링</dd></div><div><dt>O.D.</dt><dd>외경 · Outer Diameter</dd></div></dl></section><section class="wrap finder" id="finder"><details><summary>어떤 제품을 찾아야 할지 고민되시나요?<span aria-hidden="true">+</span></summary><div><p>부품군을 선택하면 해당 생산 품목으로 안내합니다.</p><div class="finder-options">'''
    body += ''.join(f'<a href="/products/?group={g}">{t} →</a>' for g,t in GROUPS.items())
    body += '''</div><a class="text-link" href="/contact/?type=new">도면·품번으로 제작 상담 준비하기 ↗</a></div></details></section><dialog id="compare-dialog" class="compare-dialog" aria-labelledby="compare-title"><div class="dialog-top"><h2 id="compare-title">제품 규격 비교</h2><button data-close aria-label="비교 닫기">닫기 ×</button></div><div id="compare-content"></div><p class="source-note">회사 소개서 2025.10.01 기준. 제품 간 대체 가능성을 의미하지 않습니다.</p></dialog>'''+cta()
    page('products', '제품소개', body, 'products', description='케이지, 실드·커버·캡, 레이스웨이 9종의 생산 외경과 규격을 확인하세요.')
    for p in PRODUCTS:
        body = heading(p['english'], p['title'], p['short'], p['title'])
        body += f'''<section class="wrap detail-layout"><div class="product-media">{product_media(p)}</div><div class="detail-info"><p>{p['description']}</p><dl class="specifications"><div><dt>제품 구분</dt><dd>{GROUPS[p['group']]}</dd></div><div><dt>생산 외경 (O.D.)</dt><dd class="spec-large">{p['size']}</dd></div><div><dt>적용 구분</dt><dd>{p['application']}</dd></div><div><dt>재질</dt><dd>{'황동' if p['id']=='brass-cage' else ''}</dd></div><div><dt>공차</dt><dd></dd></div><div><dt>표면처리</dt><dd></dd></div></dl><p class="source-note">회사 소개서 2025.10.01 · {p['page']}쪽 기준.</p><a class="button primary" href="/contact/?product={p['id']}">이 제품 문의 <span aria-hidden="true">↗</span></a><section class="empty-topic compact"><h3>제품 규격서</h3></section></div></section><section class="wrap section related"><div class="section-head"><h2>같은 제품군 살펴보기</h2><a class="text-link" href="/products/">전체 제품 →</a></div>'''
        body += ''.join(product_row(other) for other in PRODUCTS if other['group']==p['group'] and other['id']!=p['id'])
        body += '</section>'
        page('products/'+p['id'],p['title'],body,'products',description=p['short'])

    body = company_heading('회사소개', '제조의 기본을,<br>오래 지켜온 기업.', '베어링 부품 제조 기업, 삼호엔지니어링입니다.', '회사 개요·비전')
    body += '''<section class="wrap section company-story"><p class="eyebrow">삼호엔지니어링</p><div><h2>1979년의 시작.<br>영주에서 이어가는 제조.</h2><p>삼호엔지니어링은 1979년 삼호정밀로 출발했습니다. 케이지, 실드, 레이스웨이 등 베어링 부품을 생산하며, 2021년 전체 생산라인의 영주 이전을 완료했습니다.</p><a class="text-link" href="/history/">회사의 발자취 →</a></div></section><section class="wrap fact-section"><dl class="facts"><div><dt>설립</dt><dd>1979<span>년</span></dd></div><div><dt>대지면적</dt><dd>10,180<span>m²</span></dd></div><div><dt>건축면적</dt><dd>5,864<span>m²</span></dd></div><div><dt>인원</dt><dd>53<span>명</span></dd></div></dl>'''+f'<p class="source-note">시설·인원 정보: {DATE}</p></section>'
    body += '''<section class="wrap section company-story"><p class="eyebrow">비전</p><div><h2>지속적인 개선.<br>고객을 향한 품질.</h2><p>합리적인 경영과 지속적인 기술 개선을 바탕으로, 고객의 요구를 품질의 기준으로 삼습니다.</p><a class="text-link" href="/philosophy/">경영철학 자세히 보기 →</a></div></section><section class="customer-section"><div class="wrap"><p class="eyebrow">함께해 온 고객사</p><div class="customer-names"><span>Schaeffler</span><span>ILJIN / Bearing Art</span><span>SKF</span><span>NACHI FUJIKOSHI</span><span>ORS</span></div><p class="source-note">회사 소개서 2025.10.01 수록 고객사 기준</p></div></section>'''+cta()
    body = body.replace('<section class="customer-section">', company_visual()+'<section class="customer-section">')
    page('overview','회사 개요·비전',body,'overview',True)
    history=(ROOT/'src/history.html').read_text()
    body=company_heading('회사소개','오래 쌓아온 경험,<br>이어지는 발자취.','삼호정밀의 시작부터 영주 생산거점의 완성까지.', '연혁')+f'<section class="wrap section history-section">{history}<p class="source-note">{DATE}</p></section>'+cta()
    page('history','연혁',body,'overview',True)
    philosophy=(ROOT/'src/philosophy.html').read_text()
    body=company_heading('회사소개','경영철학','경영과 기술, 품질을 대하는 삼호엔지니어링의 기준.', '경영철학')+'<section class="wrap section philosophy-content">'+philosophy+'</section>'+cta()
    page('philosophy','경영철학',body,'overview',True)

    body = heading('생산·품질','공정의 기본부터,<br>품질의 기준까지.','영주의 두 생산동을 중심으로 제조의 기반을 이어갑니다.')
    body += '''<nav class="subnav wrap" aria-label="생산·품질 세부 메뉴"><a href="#bases">생산거점</a><a href="#process">생산 공정</a><a href="#inspection">품질 검사</a><a href="#certificates">품질·환경 인증</a></nav><section class="section wrap" id="bases"><div class="section-head"><h2>영주 생산거점</h2><p>제품군에 맞춰 운영하는 Site-A와 Site-B.</p></div><div class="plants"><article>'''+plant_photo('site-a-exterior', 'Site-A · 외관', '삼호엔지니어링 Site-A 생산동 외관', 1350)+'''<div class="plant-heading"><h3>Site-A</h3><span>2018</span></div><h4>TRB 케이지 생산</h4><p>2018년 신축한 생산동입니다. 인천의 TRB 케이지 생산라인 일부를 이전하며 영주 생산 기반을 마련했습니다.</p></article><article>'''+plant_photo('site-b-interior', 'Site-B · 내부', '삼호엔지니어링 Site-B 내부 보관 공간', 1323)+'''<div class="plant-heading"><h3>Site-B</h3><span>2021</span></div><h4>DGBB 케이지·실드 생산</h4><p>2021년 신축한 생산동입니다. DGBB 케이지와 실드를 생산하며, 같은 해 전체 생산라인의 영주 이전을 완료했습니다.</p></article></div><p class="source-note">회사 소개서 2025.10.01 기준</p></section>'''
    body += production_content()
    body += '''<section class="section wrap" id="certificates"><div class="section-head"><h2>품질·환경 인증</h2><p>회사 소개서에 수록된 경영 시스템 인증입니다.</p></div><div class="certificates"><article><p class="eyebrow">품질 경영 시스템</p><h3>IATF 16949:2016</h3><dl class="specifications"><div><dt>인증 범위</dt><dd>베어링 부품 제조</dd></div><div><dt>유효기간</dt><dd></dd></div></dl></article><article><p class="eyebrow">환경 경영 시스템</p><h3>ISO 14001:2015</h3><dl class="specifications"><div><dt>인증 범위</dt><dd>케이지·실드 등 베어링 부품 생산</dd></div><div><dt>유효기간</dt><dd></dd></div></dl></article></div><p class="source-note">회사 소개서 2025.10.01 수록 인증서 기준</p></section><section class="wrap section"><h2>생산 조직</h2><dl class="organization"><div><dt>연구개발</dt><dd>4명</dd></div><div><dt>품질</dt><dd>4명</dd></div><div><dt>생산관리·구매·일반관리</dt><dd>10명</dd></div><div><dt>생산·검사</dt><dd>35명</dd></div></dl><p class="source-note">회사 소개서 2025.10.01 기준</p></section>'''+cta()
    page('production','생산·품질',body,'production')

    body=heading('제작 문의','필요한 부품을<br>함께 검토하기 위한 첫걸음.','제품과 요구 사양을 정리해 문의를 준비하세요.')
    body+='''<section class="wrap contact-layout"><aside class="contact-info"><h2>연락처·위치</h2><dl class="contact-topics"><div><dt>회사 전화</dt><dd><a href="tel:0328131285">032-813-1285</a> <span class="contact-note">내선 400</span></dd></div><div><dt>영주공장</dt><dd><a href="tel:0547088000">054-708-8000</a></dd></div><div><dt>문의 담당자</dt><dd>박준호 <span class="contact-note">상무이사</span></dd></div><div><dt>담당자 연락처</dt><dd><a href="tel:01026656054">010-2665-6054</a></dd></div><div><dt>문의 이메일</dt><dd><a href="mailto:jhsh@samhoeng.kr">jhsh@samhoeng.kr</a></dd></div><div><dt>팩스</dt><dd>032-817-1286</dd></div><div><dt>사업장 주소</dt><dd>경상북도 영주시 장수면 용주로<br>88-60 (갈산리)</dd></div></dl><section class="contact-map" id="directions" aria-labelledby="directions-title"><h3 id="directions-title">오시는 길</h3><iframe src="https://www.google.com/maps/embed?pb=!1m5!3m3!1m2!1s0x35640152e0cb96fb%3A0xeee41932666cb597!2z6rK97IOB67aB64-EIOyYgeyjvOyLnCDsnqXsiJjrqbQg7Jqp7KO866GcIDg4LTYw!5e0!3m2!1sko!2skr!4v1790680086268!5m2!1sko!2skr" title="삼호엔지니어링 위치 · 경상북도 영주시 장수면 용주로 88-60" width="600" height="450" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><p>경상북도 영주시 장수면 용주로 88-60 (갈산리)</p><a class="text-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=%EA%B2%BD%EC%83%81%EB%B6%81%EB%8F%84%20%EC%98%81%EC%A3%BC%EC%8B%9C%20%EC%9E%A5%EC%88%98%EB%A9%B4%20%EC%9A%A9%EC%A3%BC%EB%A1%9C%2088-60" target="_blank" rel="noopener noreferrer">구글 지도에서 길찾기 <span aria-hidden="true">↗</span><span class="sr-only"> (새 창)</span></a></section><details class="consultation-help" id="support"><summary>상담 전 준비할 정보</summary><ul><li>부품군·제품명 또는 기존 품번</li><li>도면 번호와 개정 정보</li><li>외경과 주요 치수, 재질·공차</li><li>필요 수량과 희망 납기</li></ul><a class="text-link" href="/downloads/consultation-checklist.txt" download>상담 체크리스트 저장 ↓</a></details></aside><div class="contact-form-area"><h2>제작 상담 요청서</h2><p class="form-notice">현재는 요청서 작성·복사·저장이 가능합니다. 회사로 자동 전송되지는 않습니다.</p><form id="inquiry-form"><div class="field"><label for="product">문의 제품</label><select id="product" name="product"><option value="">직접 입력 / 제품 미정</option>'''
    body+=''.join(f'<option value="{p["id"]}">{p["title"]}</option>' for p in PRODUCTS)
    body+='''</select></div><div class="field"><label for="custom-product">품번 또는 추가 제품명 <span>선택</span></label><input id="custom-product" name="customProduct" maxlength="150" autocomplete="off"></div><div class="form-grid"><div class="field"><label for="company">회사·담당자 <span>필수</span></label><input id="company" name="company" autocomplete="organization" maxlength="120" required></div><div class="field"><label for="reply">회신 연락처 <span>필수</span></label><input id="reply" name="reply" autocomplete="email" placeholder="이메일 또는 전화번호" maxlength="150" required></div></div><div class="field"><label for="inquiry-type">문의 유형</label><select id="inquiry-type" name="type"><option value="product">제품·규격 문의</option><option value="new">신규 제작 검토</option><option value="production">양산·공급 상담</option></select></div><div class="field"><label for="message">문의 내용 <span>필수</span></label><textarea id="message" name="message" rows="5" maxlength="4000" required></textarea></div><details class="additional"><summary>규격·수량·납기 추가 <span aria-hidden="true">+</span></summary><div class="form-grid"><div class="field"><label for="spec">외경·요구 사양</label><input id="spec" name="spec" maxlength="300"></div><div class="field"><label for="drawing">도면 번호·개정 정보</label><input id="drawing" name="drawing" maxlength="150"></div><div class="field"><label for="quantity">필요 수량 (개)</label><input id="quantity" name="quantity" type="number" min="1" max="1000000000" step="1" inputmode="numeric"></div><div class="field"><label for="annual">연간 예상 물량 (개)</label><input id="annual" name="annual" type="number" min="1" max="1000000000" step="1" inputmode="numeric"></div><div class="field"><label for="due">희망 납기</label><input id="due" name="due" type="date"></div></div></details><section class="empty-topic compact"><h3>도면 첨부</h3></section><p id="form-error" role="alert"></p><button class="button primary" id="generate-inquiry" type="submit" disabled>요청서 만들기 <span aria-hidden="true">→</span></button></form><section id="inquiry-output" hidden><h3 tabindex="-1" id="output-heading">요청서가 준비되었습니다.</h3><p>아직 전송되지 않았습니다.</p><label class="sr-only" for="inquiry-text">작성된 요청서</label><textarea id="inquiry-text" readonly rows="12"></textarea><div class="output-actions"><button class="button primary" id="copy-inquiry">내용 복사</button><button class="button secondary" id="save-inquiry">TXT 파일 저장 ↓</button></div><p id="output-status" role="status"></p></section></div></section>'''
    page('contact','제작 문의',body,'contact')

    body=heading('자료실','검토에 필요한 자료를,<br>한곳에서.', '생산 품목과 회사소개, 제작 상담을 위한 안내입니다.', '자료실')+resources_content()
    page('resources','자료실',body,'resources')
    assets=OUT/'assets'
    assets.mkdir(exist_ok=True)
    (assets/'samho-logo-indigo.svg').write_text((ROOT/'src/opening-v3/samho-logo.svg').read_text())
    (assets/'samho-wordmark.svg').write_text((ROOT/'src/samho-wordmark.svg').read_text())
    (assets/'hero').mkdir(exist_ok=True)
    for image in (ROOT/'src/hero').glob('*.webp'):
        (assets/'hero'/image.name).write_bytes(image.read_bytes())
    (assets/'products.js').write_text('window.SamhoProducts='+json.dumps(PRODUCTS,ensure_ascii=False)+';\n')
    for name in ['site.css','site.js','hero-gallery.css']:
        (assets/name).write_text((ROOT/'src'/name).read_text())
    downloads=OUT/'downloads'
    downloads.mkdir(exist_ok=True)
    (downloads/'consultation-checklist.txt').write_text('삼호엔지니어링 | 제작 상담 체크리스트\n\n□ 부품군·제품명 또는 기존 품번\n□ 도면 번호·개정 정보\n□ 외경·주요 치수·재질·공차·표면처리\n□ 필요 수량·연간 예상 물량\n□ 희망 납기\n□ 회사·담당자·회신 연락처\n\n이 문서는 상담 준비를 위한 체크리스트이며, 접수 또는 주문 완료를 의미하지 않습니다.\n',encoding='utf-8-sig')
    # Removed at the user's request; never leave the obsolete download accessible.
    (downloads/'product-summary.csv').unlink(missing_ok=True)
    routes=['','overview','history','philosophy','products','production','contact','resources']+['products/'+p['id'] for p in PRODUCTS]
    (OUT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>https://samhoengineering.com/{p+"/" if p else ""}</loc></url>' for p in routes)+'</urlset>')
    (OUT/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://samhoengineering.com/sitemap.xml\n')
    print(f'Built {len(routes)} pages. Archived designs preserved.')


if __name__ == '__main__':
    build()
