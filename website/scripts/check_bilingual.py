"""Verify complete localization, paired routes, and preserved product facts."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
HANGUL = re.compile('[가-힣]')


class Page(HTMLParser):
    def __init__(self, value):
        super().__init__()
        self.nodes, self.text, self.raw = [], [], 0
        self.feed(value)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.nodes.append((tag, attrs))
        if tag in ('script', 'style'):
            self.raw += 1
        for key in ('alt', 'title', 'aria-label', 'placeholder', 'content'):
            if attrs.get(key):
                self.text.append(attrs[key])

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.raw -= 1

    def handle_data(self, value):
        if not self.raw:
            self.text.append(value)


def main():
    english_pages = sorted((DIST/'en').rglob('index.html'))
    assert len(english_pages) == 17, 'Missing English page'
    for path in english_pages:
        route = path.parent.relative_to(DIST/'en').as_posix()
        route = '' if route == '.' else route + '/'
        ko, en = '/' + route, '/en/' + route
        assert (DIST/route/'index.html').exists(), f'Missing Korean counterpart: {path}'
        page = Page(path.read_text())
        assert ('html', {'lang': 'en'}) in page.nodes, f'Wrong document language: {path}'
        assert any(a.get('rel') == 'canonical' and a.get('href') == 'https://samhoengineering.com'+en for _, a in page.nodes), f'Wrong canonical URL: {path}'
        alternate = {(a.get('hreflang'), a.get('href')) for tag, a in page.nodes if tag == 'link' and a.get('rel') == 'alternate'}
        assert {('ko','https://samhoengineering.com'+ko), ('en','https://samhoengineering.com'+en)} <= alternate, f'Missing language metadata: {path}'
        language_links = [a for tag, a in page.nodes if tag == 'a' and a.get('data-language')]
        assert len(language_links) == 4, f'Missing desktop/mobile language links: {path}'
        for a in language_links:
            expected = ko if a['data-language'] == 'ko' else en
            assert a['href'] == expected and a['data-language-href'] == expected, f'Unpaired language switch: {path}'
            assert (a.get('aria-current') == 'page') == (a['data-language'] == 'en')
        untranslated = [s.strip() for s in page.text if HANGUL.search(s) and s.strip() != '한글']
        assert not untranslated, f'Untranslated UI in {path}: {untranslated}'
        for tag, a in page.nodes:
            if tag != 'a' or a.get('data-language'):
                continue
            href = a.get('href', '')
            assert not (href.startswith('/') and not href.startswith(('/en/', '/assets/', '/downloads/'))), f'English navigation exits English site: {path}: {href}'
        for marker in ('박준호', '010-2665-6054', '내선', 'Extension 400'):
            assert marker not in path.read_text(), f'Removed personal contact reintroduced: {path}'
    original = json.loads((ROOT/'src/products.json').read_text())
    product_js = (DIST/'assets/products-en.js').read_text()
    localized = json.loads(product_js.removeprefix('window.SamhoProducts=').strip().removesuffix(';'))
    assert len(localized) == len(original) == 9
    for ko, en in zip(original, localized):
        for key in ('id', 'group', 'size', 'image', 'material', 'tolerance', 'finish'):
            if key in ko:
                assert ko[key] == en[key], f'Product fact changed: {ko["id"]}, {key}'
        assert not HANGUL.search(en['title'] + en['description'] + en['application'])
    sitemap = ET.parse(DIST/'sitemap.xml')
    urls = [node.text for node in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    assert len(urls) == len(set(urls)) == 34, 'Duplicate/missing public sitemap routes'
    assert 'https://samhoengineering.com/en/' in urls, 'English homepage missing from sitemap'
    assert all('//' not in urlsplit(url).path for url in urls), 'Malformed sitemap route'
    for url in urls:
        assert (DIST/urlsplit(url).path.lstrip('/')/'index.html').exists(), f'Missing sitemap page: {url}'
    print('17 paired English pages: translation coverage, language navigation, metadata, 9 unchanged product specifications and 34 sitemap routes pass.')


if __name__ == '__main__':
    main()
