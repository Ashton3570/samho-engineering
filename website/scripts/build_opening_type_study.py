"""Build six local-only typography proposals without changing the live opening."""
from pathlib import Path
from html import escape
import json, shutil

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'src/opening-type-study'
OUT=ROOT/'dist/previews/opening-type-v1'
OUT.mkdir(parents=True,exist_ok=True)
variants=json.loads((SRC/'variants.json').read_text())
cards=[]
for v in variants:
    badge='<span class="tag">추천</span>' if v['recommended'] else '<span class="tag">'+v['english']+'</span>'
    cards.append(f'''<article class="option-card" data-type="{v['id']}"><div class="card-top"><span class="card-id">{v['id']}</span>{badge}</div><button class="specimen" data-open="{v['id']}" aria-label="{v['id']}번 {v['name']} 크게 보기"><img src="/assets/samho-logo-indigo.svg" alt="삼호 로고" width="118" height="118"><div class="type-lockup"><p class="kr">삼호엔지니어링</p><span class="en">SAMHO ENGINEERING</span></div></button><div class="card-body"><h2>{v['name']}</h2><p class="card-description">{v['description']}</p><p class="font-note">{v['fonts']}</p><div class="card-actions"><button data-open="{v['id']}">크게 보기 ↗</button><button data-open="{v['id']}" data-play="true">4.5초 재생 <span aria-hidden="true">↻</span></button></div></div></article>''')
font_sources=json.loads((SRC/'fonts/sources.json').read_text())
credits=''.join(f'<a href="https://github.com/google/fonts/tree/main/ofl/{f["family"]}" target="_blank" rel="noreferrer">{f["family"]}</a><a href="fonts/{f["license"]}">SIL Open Font License</a>' for f in font_sources)
index=(SRC/'index.html').read_text().replace('{{CARDS}}',''.join(cards)).replace('{{FONT_CREDITS}}',credits).replace('{{TABS}}',''.join(f'<button data-switch="{v["id"]}">{v["id"]}</button>' for v in variants))
(OUT/'index.html').write_text(index)
(OUT/'study.js').write_text((SRC/'study.js').read_text().replace('{{VARIANTS}}',json.dumps(variants,ensure_ascii=False)))
for name in ['type.css','study.css']:shutil.copyfile(SRC/name,OUT/name)
shutil.copytree(SRC/'fonts',OUT/'fonts',dirs_exist_ok=True)

home=(ROOT/'dist/index.html').read_text()
home=home.replace('<title>베어링 부품 전문 제조 | 삼호엔지니어링</title>','<title>삼호 오프닝 서체 미리보기</title>')
home=home.replace('<head>','<head><meta name="robots" content="noindex,nofollow">',1)
home=home.replace('<body class="home-gallery">','<body class="home-gallery" data-type="01">')
assert 'data-type="01"' in home
home=home.replace('src="/assets/opening.js?v=20260923b"','src="preview.js"')
home=home.replace('</head>','<link rel="stylesheet" href="type.css"><style>html,body{overflow:hidden!important}</style></head>',1)
home=home.replace('</body>','<aside class="logo-review" hidden aria-hidden="true"></aside></body>')
(OUT/'frame.html').write_text(home)

animation=(ROOT/'src/opening-v3/opening.js').read_text()
tail="  requestAnimationFrame(()=>{if(!interacted&&!reduced.matches&&(review||session?.shouldPlay))play();else finish();});"
assert animation.count(tail)==1
controller='''  function holdType() { seek(3500); opening.style.opacity='1'; document.documentElement.classList.remove('opening-pending'); }
  addEventListener('message', event => {
    if(event.origin!==location.origin || event.source!==parent || event.data?.type!=='samho-type-command')return;
    if(!/^(00|01|02|03|04|05|06)$/.test(event.data.variant))return;
    if(event.data.variant==='00')delete document.body.dataset.type;else document.body.dataset.type=event.data.variant;
    if(event.data.action==='play')play();else holdType();
  });
  Promise.all([...document.fonts].map(font=>font.load())).then(()=>{
    holdType();parent.postMessage({type:'samho-type-ready'},location.origin);
  }).catch(()=>{holdType();parent.postMessage({type:'samho-type-ready'},location.origin);});'''
animation=animation.replace(tail,controller)
animation=animation.replace('    site.inert = false;','    site.inert = true;')
animation=animation.replace("    opening.dataset.state = 'complete';","    opening.dataset.state = 'complete';\n    parent.postMessage({type:'samho-type-complete'},location.origin);")
(OUT/'preview.js').write_text(animation)
print('Built local-only /previews/opening-type-v1/: six styles, current reference, desktop/mobile, actual 4.5s transition.')
