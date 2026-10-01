"""Check navigation integrity, approved copy, and unknown product facts."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'


class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids, self.text = [], [], []
        self.h1_count = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'h1':
            self.h1_count += 1
        if tag in ('a', 'link', 'script', 'img'):
            self.links.extend(attrs[key] for key in ('href', 'src') if attrs.get(key))

    def handle_data(self, value):
        self.text.append(value)


def parse(text):
    result = Document()
    result.feed(text)
    return result


def main():
    paths = [p for p in DIST.rglob('index.html') if 'designs' not in p.relative_to(DIST).parts]
    errors = []
    for path in paths:
        doc = parse(path.read_text())
        if len(doc.ids) != len(set(doc.ids)):
            errors.append(f'Duplicate IDs: {path}')
        if doc.h1_count != 1:
            errors.append(f'Expected one h1: {path}')
        if '<br>' in ''.join(doc.text):
            errors.append(f'Escaped markup in visible content: {path}')
        for value in doc.links:
            url = urlsplit(value)
            if url.scheme or url.netloc:
                continue
            target = DIST / unquote(url.path).lstrip('/') if url.path.startswith('/') else path.parent / unquote(url.path)
            if not url.path:
                target = path
            if target.is_dir():
                target /= 'index.html'
            if not target.exists():
                errors.append(f'{path}: missing {value}')
                continue
            if url.fragment and target.suffix == '.html' and url.fragment not in parse(target.read_text()).ids:
                errors.append(f'{path}: missing anchor {value}')
    approved = ''.join(parse((ROOT/'src/philosophy.html').read_text()).text).strip()
    assert approved in ''.join(parse((DIST/'philosophy/index.html').read_text()).text), 'Approved philosophy changed'
    products = json.loads((ROOT/'src/products.json').read_text())
    assert len(products) == 9
    for item in products:
        page = DIST/'products'/item['id']/'index.html'
        assert page.exists(), item['id']
        if item['id'] in ('acbb-cage','wheel-cover','brass-cage','stamped-raceway'):
            assert item['size'] == '', 'Unknown specification filled'
    assert all('capacity' not in p for p in products), 'Sensitive production field reintroduced'
    assert not (DIST/'downloads/product-summary.csv').exists(), 'Removed CSV is still accessible'
    for asset in DIST.rglob('*'):
        if asset.suffix in ('.html','.js','.json','.csv','.txt'):
            value = asset.read_text()
            assert '생산능력' not in value and '33,600,000' not in value and '62,000,000' not in value, f'Sensitive production information: {asset}'
    public_pages = [p for p in paths if 'previews' not in p.relative_to(DIST).parts]
    for public_page in public_pages:
        html = public_page.read_text()
        assert html.count('class="page-progress"') == 1, f'Missing/duplicate progress bar: {public_page}'
        assert '/assets/scroll-progress.js?' in html and '/assets/scroll-progress.css?' in html, public_page
    assert len(public_pages) == 17, f'Unexpected public page count: {len(public_pages)}'
    assert not errors, '\n'.join(errors)
    print(f'{len(public_pages)} public pages + {len(paths)-len(public_pages)} previews: local links, anchors, headings, approved philosophy, and unknown specifications pass.')


if __name__ == '__main__':
    main()
