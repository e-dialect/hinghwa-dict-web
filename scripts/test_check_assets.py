from pathlib import Path
import tempfile
import unittest
from check_assets import check_tree, entry_assets, validate_javascript, validate_stylesheet


class ProductionAssetsTests(unittest.TestCase):
    def test_only_same_origin_js_and_css_entries_are_allowed(self):
        self.assertEqual(entry_assets(b'<script src="/app.js"></script><link rel="stylesheet" href="/app.css">'), ['/app.css', '/app.js'])
        for value in ['https://cdn.example/a.js', '//cdn.example/a.js', 'app.js', '/%2e%2e/app.js', '/app.js?cdn=1']:
            with self.subTest(value=value), self.assertRaises(AssertionError):
                entry_assets(('<script src="' + value + '"></script><link rel="stylesheet" href="/app.css">').encode())
        with self.assertRaises(AssertionError):
            entry_assets(b'<base href="https://cdn.example/"><script src="/app.js"></script>')

    def test_test_api_runtime_substitution_and_remote_executable_dependencies_fail(self):
        for value in [b'https://api.pxm.test.edialect.top', b'VITE_BACKEND_URL_RUNTIME_REPLACEMENT', b'import("https://cdn.example/app.js")', b'import x from "//cdn.example/app.js"', b'importScripts("https://cdn.example/app.js")']:
            with self.subTest(value=value), self.assertRaises(AssertionError):
                validate_javascript(value)
        for value in [b'@import "https://cdn.example/app.css";', b'@import url(//cdn.example/app.css);']:
            with self.subTest(value=value), self.assertRaises(AssertionError):
                validate_stylesheet(value)
        validate_javascript(b'const api="https://api.pxm.edialect.top";')
        validate_stylesheet(b'a { background: url(https://cdn.example/photo.png) }')

    def test_tree_requires_real_entry_files_production_api_and_no_secret_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'index.html').write_text('<script src="/app.js"></script><link rel="stylesheet" href="/app.css">')
            (root / 'app.js').write_text('const api="https://api.pxm.edialect.top";')
            (root / 'app.css').write_text('body {}')
            receipt = check_tree(root)
            self.assertEqual(receipt['result'], 'PASS')
            self.assertTrue(receipt['sameOriginEntryAssets'])
            self.assertNotIn('sameOriginAssets', receipt)
            for filename in ['.env.production', '.cos.conf', 'app.js.map', 'package.json']:
                (root / filename).write_text('synthetic-only')
                with self.subTest(filename=filename), self.assertRaises(AssertionError):
                    check_tree(root)
                (root / filename).unlink()
            (root / 'app.js').unlink()
            with self.assertRaises(AssertionError):
                check_tree(root)


if __name__ == '__main__':
    unittest.main()
