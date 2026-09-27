"""Package the approved six-way review UI as a separate Site and offline HTML."""
from pathlib import Path
from html import escape
from urllib.parse import urlsplit
import base64, json, mimetypes, re, shutil

WEBSITE=Path(__file__).resolve().parents[1]
PROJECT=WEBSITE.parent/'output/opening-type-site'
DIST=PROJECT/'dist'
SOURCE=WEBSITE/'dist/previews/opening-type-v1'
DIST.mkdir(parents=True,exist_ok=True)
shutil.copytree(SOURCE,DIST,dirs_exist_ok=True)

for name in ['site.css','opening.css','hero-gallery.css','samho-logo-indigo.svg','samho-wordmark.svg']:
    dest=DIST/'assets'/name;dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(WEBSITE/'dist/assets'/name,dest)
for source in (WEBSITE/'dist/assets/hero').glob('product-collection-blue-v3-*.webp'):
    dest=DIST/'assets/hero'/source.name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,dest)
icon=DIST/'designs/v4/favicon.svg';icon.parent.mkdir(parents=True,exist_ok=True)
shutil.copyfile(WEBSITE/'dist/designs/v4/favicon.svg',icon)

# Keep only the actual hero needed at the end of the opening.
frame=(DIST/'frame.html').read_text()
start=frame.index('<section class="intro-strip wrap">')
end=frame.index('</div><section class="logo-opening"')
frame=frame[:start]+'</main>'+frame[end:]
frame=re.sub(r'<script src="/assets/(?:products|site)\.js[^\"]*" defer></script>','',frame)
frame=re.sub(r'<link rel="canonical"[^>]*>','',frame)
frame=re.sub(r'href="(/(?:overview|products|production|resources|contact|history|philosophy)/[^\"]*)"',r'href="https://samhoengineering.com\1"',frame)
frame=frame.replace('href="/"','href="https://samhoengineering.com/"')
(DIST/'frame.html').write_text(frame)
(DIST/'robots.txt').write_text('User-agent: *\nDisallow: /\n')

def data_url(file):
    mime={'.woff':'font/woff','.svg':'image/svg+xml','.webp':'image/webp','.txt':'text/plain'}.get(file.suffix) or mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
    return 'data:'+mime+';base64,'+base64.b64encode(file.read_bytes()).decode()

def inline_css(css,base):
    return re.sub(r'url\(([^)]+)\)',lambda m:'url('+data_url(base/m.group(1).strip('"\''))+')' if not m.group(1).startswith(('data:','https:')) else m.group(0),css)

def inline_document(html):
    def sheet(m):
        file=DIST/urlsplit(m.group(1)).path.lstrip('/')
        return '<style>'+inline_css(file.read_text(),file.parent)+'</style>'
    html=re.sub(r'<link rel="stylesheet" href="([^\"]+)"\s*>',sheet,html)
    def script(m):
        file=DIST/urlsplit(m.group(1)).path.lstrip('/')
        return '<script>'+file.read_text()+'</script>'
    # Inline scripts remain deferred until the entire HTML has been parsed.
    scripts=[]
    html=re.sub(r'<script src="([^\"]+)" defer></script>',lambda m:(scripts.append(script(m)) or ''),html)
    html=html.replace('</body>',''.join(scripts)+'</body>')
    html=re.sub(r'\s+srcset="[^\"]*"','',html)
    html=re.sub(r'\s+sizes="[^\"]*"','',html)
    html=re.sub(r'src="(/assets/[^\"]+)"',lambda m:'src="'+data_url(DIST/m.group(1).lstrip('/'))+'"',html)
    html=re.sub(r'(<link rel="icon" href=")([^\"]+)',lambda m:m.group(1)+data_url(DIST/m.group(2).lstrip('/')),html)
    html=re.sub(r'href="(fonts/[^\"]+\.txt)"',lambda m:'download="'+Path(m.group(1)).name+'" href="'+data_url(DIST/m.group(1))+'"',html)
    return html

offline_frame=inline_document(frame)
offline_frame=offline_frame.replace("event.origin!==location.origin || event.source!==parent", "event.source!==parent")
offline_frame=offline_frame.replace("},location.origin)","},'*')")
index=(DIST/'index.html').read_text()
offline=inline_document(index)
offline=offline.replace('src="frame.html"','srcdoc="'+escape(offline_frame,quote=True)+'"')
offline=offline.replace('event.origin!==location.origin||event.source!==frame.contentWindow','event.source!==frame.contentWindow')
offline=offline.replace('},location.origin)',"},'*')")
offline=offline.replace('href="/"','href="https://samhoengineering.com/"')
filename='Samho_Opening_Type_6_Options.html'
(DIST/filename).write_text(offline)
index=index.replace('</footer>\n</main>','<a href="'+filename+'" download>HTML 파일 내려받기 ↓</a></footer>\n</main>')
(DIST/'index.html').write_text(index)

config=PROJECT/'.openai/hosting.json';config.parent.mkdir(exist_ok=True)
settings=json.loads(config.read_text()) if config.exists() else {}
settings['static']={'directory':'dist'}
config.write_text(json.dumps(settings,indent=2)+'\n')
(PROJECT/'.gitignore').write_text('.DS_Store\n')
(PROJECT/'README.md').write_text('# Samho opening typography review\n\nSeparate selection-only Site. Six proposed typography treatments with the current design as a reference. Includes a self-contained offline HTML download. No changes to the company production website.\n')

assert 'src="frame.html"' not in offline
assert '/assets/' not in re.sub(r'srcdoc="[^"]*"','',offline)
assert '127.0.0.1' not in index+frame+offline
print(json.dumps({'project':str(PROJECT),'offline_html':str(DIST/filename),'offline_bytes':(DIST/filename).stat().st_size,'files':sum(p.is_file() for p in DIST.rglob('*')),'total_bytes':sum(p.stat().st_size for p in DIST.rglob('*') if p.is_file())},ensure_ascii=False))
