"""Build authored English pages from the approved Korean site.

Translations are checked in, with no third-party translation request at runtime.
Shared markup, specifications, photos and interactions stay in sync on each build.
"""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
import re

ROOT = Path(__file__).resolve().parent
COPY = json.loads((ROOT / 'src/english-copy.json').read_text())
HANGUL = re.compile('[가-힣]')


def translate(value):
    if not HANGUL.search(value) or value.strip() == '한글':
        return value
    stripped = value.strip()
    if stripped not in COPY:
        raise ValueError(f'Missing authored English translation: {stripped}')
    start = len(value) - len(value.lstrip())
    end = len(value) - len(value.rstrip())
    return value[:start] + COPY[stripped] + (value[len(value)-end:] if end else '')


def english_path(value):
    url = urlsplit(value)
    if url.scheme or url.netloc or not value.startswith('/'):
        return value
    if value.startswith(('/assets/', '/downloads/', '/en/')) or Path(url.path).suffix:
        return value
    return '/en' + value


def script_translation(source):
    """Translate only string literals; keep JavaScript behavior unchanged."""
    literal = re.compile(r'''(['"`])(?:\\.|(?!\1)[\s\S])*?\1''')
    def replace(match):
        raw = match.group()[1:-1]
        cooked = raw.replace('\\n', '\n').replace('\\r', '\r')
        if HANGUL.search(cooked):
            result = translate(cooked)
        elif raw == 'ko-KR':
            result = 'en-GB'
        elif raw == '삼호엔지니어링_제작상담요청서.txt':
            result = 'Samho_Manufacturing_Inquiry.txt'
        else:
            result = english_path(raw)
        if result == cooked:
            return match.group()
        if match.group()[0] == '`':
            return '`' + result.replace('\\', '\\\\').replace('`', '\\`') + '`'
        return json.dumps(result, ensure_ascii=False)
    return literal.sub(replace, source)


class EnglishPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.output = []
        self.raw_depth = 0
        self.in_opening_subtitle = False

    def handle_decl(self, decl):
        self.output.append('<!' + decl + '>')

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'):
            self.raw_depth += 1
        if tag == 'html':
            attrs['lang'] = 'en'
        is_language_link = 'data-language' in attrs
        if is_language_link:
            attrs.pop('aria-current', None)
            if attrs['data-language'] == 'en':
                attrs['aria-current'] = 'page'
        for key, value in list(attrs.items()):
            if value is None:
                continue
            if key == 'href' and not is_language_link:
                if attrs.get('rel') == 'canonical':
                    attrs[key] = value.replace('https://samhoengineering.com/', 'https://samhoengineering.com/en/', 1)
                elif attrs.get('hreflang'):
                    pass
                elif value == '/downloads/consultation-checklist.txt':
                    attrs[key] = '/downloads/consultation-checklist-en.txt'
                else:
                    attrs[key] = english_path(value)
            elif key == 'src' and tag == 'script':
                value = value.replace('/assets/products.js', '/assets/products-en.js')
                value = value.replace('/assets/site.js', '/assets/site-en.js')
                value = value.replace('/assets/company/history.js', '/assets/company/history-en.js')
                value = value.replace('/assets/company/customers.js', '/assets/company/customers-en.js')
                attrs[key] = value
            elif key == 'src' and tag == 'iframe' and 'google.com/maps/embed' in value:
                attrs[key] = value.replace('!1sko', '!1sen')
            elif key not in ('src', 'srcset', 'href', 'id', 'class', 'data-language-href'):
                attrs[key] = translate(value)
        values = ''.join(' ' + key + ('="' + escape(value, quote=True) + '"' if value is not None else '') for key, value in attrs.items())
        self.output.append('<' + tag + values + '>')

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.output[-1] = self.output[-1][:-1] + '/>'

    def handle_endtag(self, tag):
        if tag == 'head':
            self.output.append('<link rel="stylesheet" href="/assets/english.css?v=20261008-bilingual">')
        if tag in ('script', 'style'):
            self.raw_depth -= 1
        self.output.append('</' + tag + '>')

    def handle_data(self, value):
        self.output.append(value if self.raw_depth else escape(translate(value), quote=False))

    def handle_entityref(self, name):
        self.output.append('&' + name + ';')

    def handle_charref(self, name):
        self.output.append('&#' + name + ';')

    def handle_comment(self, value):
        self.output.append('<!--' + value + '-->')


def build_english(out, routes, products):
    for route in routes:
        document = EnglishPage()
        document.feed((out / route / 'index.html').read_text())
        html = ''.join(document.output)
        if not route:
            # Keep one brand name, followed by the founding year, in the opening.
            html = html.replace('<span>SAMHO ENGINEERING</span></div>', '<span>SINCE 1979</span></div>', 1)
        # English contact numbers use the international dialing format.
        for local, international in [('032-813-1285', '+82 32 813 1285'), ('054-708-8000', '+82 54 708 8000'), ('032-817-1286', '+82 32 817 1286')]:
            html = html.replace(local, international)
        html = html.replace('tel:0328131285', 'tel:+82328131285').replace('tel:0547088000', 'tel:+82547088000')
        dest = out / 'en' / route / 'index.html'
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html)
    localized_products = []
    for product in products:
        p = dict(product)
        for field in ('title', 'short', 'description', 'application'):
            p[field] = translate(p[field])
        p['keyword'] = HANGUL.sub('', p['keyword'])
        p['tags'] = [HANGUL.sub('', tag).strip() for tag in p['tags']]
        localized_products.append(p)
    (out/'assets/products-en.js').write_text('window.SamhoProducts=' + json.dumps(localized_products, ensure_ascii=False) + ';\n')
    for source, target in [('src/site.js', 'assets/site-en.js'), ('src/company-materials/history.js', 'assets/company/history-en.js'), ('src/company-materials/customers.js', 'assets/company/customers-en.js')]:
        (out/target).write_text(script_translation((ROOT/source).read_text()))
    (out/'assets/english.css').write_text((ROOT/'src/english.css').read_text())
    (out/'downloads/consultation-checklist-en.txt').write_text('Samho Engineering | Manufacturing Consultation Checklist\n\n□ Product family, name or existing part number\n□ Drawing number and revision\n□ Outside diameter, key dimensions, material, tolerances and surface treatment\n□ Required quantity and estimated annual quantity\n□ Preferred delivery date\n□ Company, contact person and reply contact details\n\nThis checklist helps you prepare a consultation. It does not confirm submission or an order.\n', encoding='utf-8-sig')
