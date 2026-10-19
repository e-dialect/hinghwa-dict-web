"""Validate production entry assets without making any external network request."""
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
import re
import urllib.parse

PRODUCTION_API = b'https://api.pxm.edialect.top'


def forbidden_file(filename):
    parts = PurePosixPath(filename).parts
    return (any(part.startswith('.env') or part in ('.git', '.cos.conf', 'node_modules') for part in parts)
            or PurePosixPath(filename).name in ('package.json', 'yarn.lock', 'Dockerfile.release')
            or filename.endswith('.map'))


def local_asset_path(value):
    parsed = urllib.parse.urlsplit(value)
    assert not parsed.scheme and not parsed.netloc and value.startswith('/') and not value.startswith('//'), 'JS/CSS must be served by this origin'
    path = urllib.parse.unquote(parsed.path)
    assert not parsed.query and not parsed.fragment and '\\' not in path
    assert all(part not in ('.', '..') for part in path.split('/'))
    assert path.endswith(('.js', '.css')), 'Unexpected executable/stylesheet entry'
    return path


class EntryParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'base':
            raise AssertionError('A document base can redirect local entry assets')
        if tag == 'script' and attrs.get('src'):
            self.paths.append(local_asset_path(attrs['src']))
        if tag == 'link':
            rel = attrs.get('rel', '').lower().split()
            if any(kind in rel for kind in ['stylesheet', 'modulepreload']) or ('preload' in rel and attrs.get('as') in ('script', 'style')):
                self.paths.append(local_asset_path(attrs.get('href', '')))


def entry_assets(body):
    parser = EntryParser()
    parser.feed(body.decode('utf-8'))
    assert any(path.endswith('.js') for path in parser.paths), 'No entry JavaScript'
    assert any(path.endswith('.css') for path in parser.paths), 'No entry stylesheet'
    return sorted(set(parser.paths))


def validate_javascript(body):
    assert b'https://api.pxm.test.edialect.top' not in body, 'Test API leaked into production JavaScript'
    assert b'VITE_BACKEND_URL_RUNTIME_REPLACEMENT' not in body, 'Runtime API rewrite still required'
    # Only imports/loaders are executable dependencies; ordinary external links and API URLs are permitted.
    text = body.decode('utf-8')
    assert not re.search(r'''(?:\bimport\s*(?:\(\s*|[^;\n]{0,200}?\bfrom\s*)|\bimportScripts\s*\(\s*)["'](?:https?:)?//''', text), 'External JavaScript dependency'


def validate_stylesheet(body):
    text = body.decode('utf-8')
    assert not re.search(r'''@import\s*(?:url\(\s*)?["']?(?:https?:)?//''', text, re.I), 'External CSS dependency'


def check_tree(root):
    root = root.resolve(strict=True)
    entries = entry_assets((root / 'index.html').read_bytes())
    for entry in entries:
        target = root / entry.lstrip('/')
        assert target.resolve().is_relative_to(root) and target.is_file(), 'Entry asset missing from package'
    counts = {'js': 0, 'css': 0}
    javascript = []
    for target in root.rglob('*'):
        assert not target.is_symlink(), 'Symlink in static output'
        if not target.is_file():
            continue
        relative = target.relative_to(root).as_posix()
        assert not forbidden_file(relative), 'Sensitive build input in static output'
        if target.suffix == '.js':
            body = target.read_bytes()
            validate_javascript(body)
            javascript.append(body)
            counts['js'] += 1
        elif target.suffix == '.css':
            validate_stylesheet(target.read_bytes())
            counts['css'] += 1
    assert counts['js'] and counts['css']
    assert PRODUCTION_API in b'\n'.join(javascript), 'Production API missing'
    return {'result': 'PASS', 'productionAPI': True, 'sameOriginAssets': True,
            'entryAssets': entries, 'javaScriptAssets': counts['js'], 'cssAssets': counts['css']}
