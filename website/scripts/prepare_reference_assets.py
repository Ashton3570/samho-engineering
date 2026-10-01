"""Create small web derivatives of supplied materials; never overwrite originals."""
from pathlib import Path
import json, unicodedata
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parents[1]
PROJECT=ROOT.parent
folder=lambda name: next(p for p in PROJECT.iterdir() if unicodedata.normalize('NFC',p.name)==name)
studio=folder('유스튜디오')
ai=folder('베어링 AI 이미지')
items={
 'trb-main':('20-02.jpg','TRB 케이지 제품군'), 'trb-detail':('09-01.jpg','TRB 케이지 정면'),
 'dgbb-main':('21-01.jpg','DGBB 케이지 제품군'), 'dgbb-detail':('08-01.jpg','DGBB 케이지 정면'),
 'shield-main':('23-02.jpg','DGBB 실드 제품군'), 'shield-detail':('10-02.jpg','DGBB 실드 정면'),
 'pronged-main':('24-01.jpg','프롱 타입 케이지 제품군'), 'pronged-detail':('12-02.jpg','프롱 타입 케이지 정면'),
 'strut-main':('13-02.jpg','스트럿 베어링 레이스웨이'),
 'acbb-main':('09-03.jpg','중장비 베어링용 ACBB 케이지'),
 'wheel-main':('13-03.jpg','휠 베어링 커버·캡'), 'wheel-detail':('13-06.jpg','휠 베어링 커버·캡 형상'),
 'materials':('07-2.jpg','코일 소재 보관 공간'), 'forming':('07-9.jpg','금형과 케이지 성형 현장'),
 'visual-check':('07-14.jpg','케이지를 확인하는 작업자의 손'),
 'measurement':('07-29.jpg','측정 장비 위의 케이지'), 'quality-room':('07-33.jpg','검사실과 측정 장비'),
 'product-collection':('25-04.jpg','케이지·실드 등 제공 제품 이미지')}
manifest={}
for key,(file,alt) in items.items(): manifest[key]={'source':str((studio/file).relative_to(PROJECT)),'alt':alt,'kind':'supplied'}
files=json.loads((ROOT/'tmp/material-review/ai-files.json').read_text())
manifest['cage-concept']={'source':files[0],'alt':'다양한 크기의 베어링 케이지','kind':'ai'}
# These supplied photos replace the former ACBB image and fill two empty products.
imports=ROOT/'src/reference-imports'
for key,alt in {'acbb-main':'중장비 베어링용 ACBB 케이지','brass-cage-main':'ACBB 황동 케이지','stamped-raceway-main':'프레스 성형 레이스웨이'}.items():
 manifest[key]={'source':str((imports/f'{key}-1440.webp').relative_to(PROJECT)),'alt':alt,'kind':'supplied'}
out=ROOT/'dist/assets/reference';out.mkdir(parents=True,exist_ok=True)
for key,item in manifest.items():
 if (PROJECT/item['source']).parent == imports:
  item['variants']=[]
  for w in (480,960,1440):
   photo=imports/f'{key}-{w}.webp'
   (out/photo.name).write_bytes(photo.read_bytes())
   with Image.open(photo) as im: item['variants'].append({'width':im.width,'height':im.height,'file':photo.name})
  continue
 with Image.open(PROJECT/item['source']) as source:
  source.draft('RGB',(1800,1800))
  im=ImageOps.exif_transpose(source).convert('RGB')
  sizes=[]
  for w in (480,960,1440):
   copy=im.copy();copy.thumbnail((w,round(w*im.height/im.width)),Image.Resampling.LANCZOS)
   copy.save(out/f'{key}-{w}.webp','WEBP',quality=84,method=6)
   sizes.append({'width':copy.width,'height':copy.height,'file':f'{key}-{w}.webp'})
  item['variants']=sizes
# Preserve approved white-background variants when rebuilding reference media.
white=ROOT/'src/product-white'
if (white/'manifest.json').exists():
 manifest.update(json.loads((white/'manifest.json').read_text()))
 for photo in white.glob('*.webp'): (out/photo.name).write_bytes(photo.read_bytes())
(ROOT/'src/materials.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(f'{len(manifest)} sources, {len(manifest)*3} optimized WebP derivatives')
