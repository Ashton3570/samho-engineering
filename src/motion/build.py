from pathlib import Path
import re,json,base64
ROOT=Path(__file__).resolve().parents[2]
SRC=ROOT/'src/motion'; OUT=ROOT/'dist/motion';OUT.mkdir(exist_ok=True)
logo=(ROOT/'dist/assets/samho-logo-indigo.svg').read_text()
paths=re.findall(r'<path d="([^"]+)"',logo)
engine=(SRC/'engine.js').read_text().replace('__LOGO_PATHS__',json.dumps(paths))
for name in ['index.html','style.css','app.js']:(OUT/name).write_text((SRC/name).read_text())
(OUT/'engine.js').write_text(engine)
# A portable file carries its own images, fonts, styling and animation engine.
page=(SRC/'index.html').read_text()
css=(SRC/'style.css').read_text()
for name in ['sans-kr','manrope','montserrat','serif-kr','cormorant','batang-kr']:
 data=base64.b64encode((ROOT/f'dist/fonts/{name}.woff').read_bytes()).decode()
 css=css.replace(f'../fonts/{name}.woff','data:font/woff;base64,'+data)
for name in ['samho-logo-indigo.svg','samho-wordmark.svg','hero/product-collection-blue-v3-1920.webp']:
 ext='svg+xml' if name.endswith('.svg') else 'webp'
 data=base64.b64encode((ROOT/'dist/assets'/name).read_bytes()).decode()
 engine=engine.replace('../assets/'+name,f'data:image/{ext};base64,'+data)
page=page.replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>')
page=page.replace('<script src="engine.js" defer></script>','').replace('<script src="app.js" defer></script>','')
page=page.replace('</body>','<script>'+engine+'</script><script>'+(SRC/'app.js').read_text()+'</script></body>')
page=page.replace('href="../"','href="https://samho-opening-type-study.goomi3570.chatgpt.site/"')
page=re.sub(r'<a class="download"[^>]*>.*?</a>','',page)
for name in ['sans-kr','manrope','montserrat','serif-kr','cormorant','batang-kr']:
 data=base64.b64encode((ROOT/f'dist/fonts/{name}-OFL.txt').read_bytes()).decode()
 page=page.replace(f'href="../fonts/{name}-OFL.txt"',f'download="{name}-OFL.txt" href="data:text/plain;base64,{data}"')
(OUT/'Samho_Opening_Motion_8_Options.html').write_text(page)
print('Built eight-motion review and offline HTML:',len(page.encode()),'bytes')
