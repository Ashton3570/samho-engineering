"""Source-backed additions from the supplied brochure and image folders."""
from pathlib import Path
from html import escape
import json
ROOT=Path(__file__).resolve().parent
ASSETS=json.loads((ROOT/'src/materials.json').read_text())
PRODUCT_MEDIA={
 'trb-cage':['trb-main','trb-detail'], 'dgbb-cage':['dgbb-main','dgbb-detail'],
 'dgbb-shield':['shield-main','shield-detail'], 'pronged-cage':['pronged-main','pronged-detail'],
 'strut-raceway':['strut-main'], 'acbb-cage':['acbb-main'], 'wheel-cover':['wheel-main','wheel-detail'],
 'brass-cage':['brass-cage-main'], 'stamped-raceway':['stamped-raceway-main']}

def img(key, sizes='(max-width: 820px) calc(100vw - 40px), 600px', eager=False):
 a=ASSETS[key]; v=a['variants']
 srcset=', '.join(f'/assets/reference/{x["file"]} {x["width"]}w' for x in v)
 return f'<img src="/assets/reference/{v[1]["file"]}" srcset="{srcset}" sizes="{sizes}" width="{v[-1]["width"]}" height="{v[-1]["height"]}" alt="{escape(a["alt"])}" loading="{"eager" if eager else "lazy"}" decoding="async">'

def figure(key,caption,cls='',zoom=False,eager=False):
 content=img(key,eager=eager)
 if zoom: content=f'<a href="/assets/reference/{ASSETS[key]["variants"][-1]["file"]}" target="_blank" rel="noopener" aria-label="{escape(caption)} 크게 보기 (새 탭)">{content}</a>'
 caption_html = f'<figcaption>{caption}{" · 클릭하면 크게 볼 수 있습니다" if zoom else ""}</figcaption>' if caption else ''
 return f'<figure class="reference-figure {cls}">{content}{caption_html}</figure>'

def thumbnail(p):
 keys=PRODUCT_MEDIA.get(p['id'],[])
 return '<span class="catalog-thumb">'+img(keys[0],'(max-width: 520px) 72px, 112px')+'</span>' if keys else ''

def product_media(p):
 keys=PRODUCT_MEDIA.get(p['id'],[])
 if not keys: return '<div class="image-slot"><h2>제품 대표 이미지</h2></div><div class="detail-media-topics"><section class="empty-topic"><h3>제품 확대 이미지</h3></section><section class="empty-topic"><h3>제품 3D 보기</h3></section></div>'
 html=figure(keys[0],p['title']+' · 제품 이미지','product-photo',True,True)
 if len(keys)>1: html+='<div class="secondary-product-image">'+figure(keys[1],'제품 형상 상세','product-photo',True)+'</div>'
 html+='<p class="source-note">제품 이미지는 형상 이해를 위한 참고 자료입니다. 제작 사양은 도면을 기준으로 확인합니다.</p><section class="empty-topic compact"><h3>제품 3D 보기</h3></section>'
 return html

def company_visual():
 return '<section class="wrap section material-story">'+figure('cage-concept','')+'''<div><p class="eyebrow">베어링을 이루는 부품</p><h2>작은 부품에 쌓아온<br>제조의 경험.</h2><p>삼호엔지니어링은 케이지, 실드·커버·캡, 레이스웨이를 생산합니다. 1987년 베어링 부품 생산을 시작한 이후 제품군과 생산 기반을 넓혀왔습니다.</p><a class="text-link" href="/products/">생산 품목과 규격 보기 ↗</a></div></section>'''

def production_content():
 return '''<section class="section wrap topic-section" id="process"><div class="section-head"><div><p class="eyebrow">생산 현장</p><h2>소재와 금형에서<br>부품의 형상으로.</h2></div><p>소재 보관부터 케이지 성형까지.<br>삼호엔지니어링의 생산 현장을 소개합니다.</p></div><div class="field-grid">'''+figure('materials','코일 소재 보관')+figure('forming','금형을 이용한 케이지 성형')+'''</div><div class="field-notes"><article><h3>제조 공정</h3><p>TRB 케이지 생산에는 2011년 원펀치 금형을 도입했습니다. 프레스 부품 제조에서 출발한 경험을 베어링 부품 생산으로 이어갑니다.</p></article><article><h3>주요 설비</h3><p>케이지 성형을 위한 금형과 설비를 운영합니다. 제품군에 맞춘 생산 기반을 바탕으로 부품을 제조합니다.</p></article></div><p class="source-note">금형 도입 연혁: 회사 소개서 2025.10.01 및 제공 브로슈어 2쪽.</p></section>
<section class="section wrap topic-section" id="inspection"><div class="section-head"><div><p class="eyebrow">품질 검사</p><h2>제품을 살피고,<br>측정으로 확인합니다.</h2></div><p>검사 작업과 측정 장비,<br>품질을 확인하는 현장을 담았습니다.</p></div><div class="field-grid">'''+figure('visual-check','케이지 확인 작업')+figure('measurement','측정 장비 위의 케이지')+'''</div><div class="field-notes"><article><h3>검사 항목</h3><p>도면에 담긴 치수와 사양, 적용 조건을 품질의 출발점으로 삼습니다. 제품별 검사 항목과 판정 기준은 요구 사양을 확인하며 정리합니다.</p></article><article><h3>검사 장비</h3><p>검사실의 측정 장비를 활용해 제품의 치수와 형상을 확인합니다.</p></article><article><h3>품질 관리 절차</h3><p>요구 사양을 제조와 검사에 반영하고, 확인이 필요한 사항은 고객과 명확히 소통합니다.</p></article></div><details class="photo-disclosure"><summary>검사실 둘러보기 <span aria-hidden="true">+</span></summary>'''+figure('quality-room','검사실 전경')+'''</details></section>'''

def resources_content():
 return '''<section class="wrap section resource-downloads"><article><p class="eyebrow">상담 준비</p><h2>제작 상담 체크리스트</h2><p>제품명, 도면 정보, 사양, 필요 수량과 희망 납기를 정리해 상담을 준비하세요.</p><a class="button secondary" href="/downloads/consultation-checklist.txt" download>체크리스트 다운로드 ↓</a><a class="text-link" href="/contact/">제작 상담 요청서 작성 →</a></article></section>
<section class="wrap section english-profile" id="english"><p class="eyebrow">Company profile</p><h2>Samho Engineering</h2><div lang="en"><p>Founded as Samho Precision in 1979, Samho Engineering manufactures bearing components in Yeongju, South Korea. The company began producing TRB and DGBB cages and shields in 1987 and completed the relocation of all production lines to Yeongju in 2021.</p><p>Site-A produces TRB cages. Site-B produces DGBB cages and shields. The product portfolio also includes pronged type cages, strut bearing raceways, ACBB cages, wheel bearing covers and caps, brass cages for ACBB, and stamped raceways.</p></div><p class="source-note">회사 소개서 2025.10.01 및 회사 브로슈어의 회사·제품 정보 기준입니다.</p></section>
<section class="wrap section faq" id="faq"><p class="eyebrow">자주 묻는 질문</p><h2>제품 검토 전에 궁금한 점</h2>
<details><summary>어떤 부품을 생산하나요?<span aria-hidden="true">+</span></summary><p>케이지, 실드·커버·캡, 레이스웨이의 3개 제품군을 소개하고 있습니다. 제품소개에서 총 9종의 생산 품목과 확인된 외경 범위를 볼 수 있습니다.</p><a class="text-link" href="/products/">제품소개 보기 →</a></details>
<details><summary>도면 검토를 위해 무엇을 준비하면 되나요?<span aria-hidden="true">+</span></summary><p>제품명 또는 품번, 도면 번호와 개정 정보, 주요 치수·재질·공차·표면처리, 필요 수량과 희망 납기를 준비하면 됩니다. 확인되지 않은 항목은 문의 내용에 함께 적어주세요.</p></details>
<details><summary>사이트에서 작성한 요청서는 자동 접수되나요?<span aria-hidden="true">+</span></summary><p>현재는 요청서를 작성하고 복사하거나 TXT 파일로 저장할 수 있습니다. 회사로 자동 전송되거나 주문이 접수되는 기능은 아직 제공하지 않습니다.</p></details></section>
<section class="wrap section resource-list">'''+''.join(f'<section class="empty-topic"><h3>{title}</h3></section>' for title in ['회사 카탈로그','제품별 상세 규격서','공장 소개 영상','공지·뉴스'])+'</section>'

