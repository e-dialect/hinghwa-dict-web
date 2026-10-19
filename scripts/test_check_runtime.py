import importlib.util
import pathlib
import unittest

SPEC = importlib.util.spec_from_file_location(
    'check_runtime', pathlib.Path(__file__).with_name('check-runtime.py'))
check_runtime = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(check_runtime)


class ExposedPortTests(unittest.TestCase):
    def test_cli_requires_arguments_instead_of_succeeding_without_smoke(self):
        import subprocess
        import sys
        result = subprocess.run([sys.executable, str(pathlib.Path(__file__).with_name('check-runtime.py'))], capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('--image', result.stderr)
        self.assertIn('--source-sha', result.stderr)

    def test_only_candidate_port_and_known_nginx_base_metadata_are_allowed(self):
        self.assertEqual(check_runtime.PORT, 8080)
        self.assertTrue(check_runtime.approved_exposed_ports({'8080/tcp': {}}))
        self.assertTrue(check_runtime.approved_exposed_ports({'80/tcp': {}, '8080/tcp': {}}))

    def test_only_8080_is_published_and_arbitrary_image_ports_are_rejected(self):
        for ports in (
            None,
            {},
            {'80/tcp': {}},
            {'443/tcp': {}, '8080/tcp': {}},
            {'80/tcp': {}, '8080/tcp': {}, '8443/tcp': {}},
            {'80/udp': {}, '8080/tcp': {}},
            {'80/tcp': {}, '8080/tcp': {'HostPort': '80'}},
        ):
            with self.subTest(ports=ports):
                self.assertFalse(check_runtime.approved_exposed_ports(ports))



class RuntimeContractTests(unittest.TestCase):
    """Exercise the runtime verifier against synthetic Docker/HTTP responses only."""
    def fixture(self):
        import copy
        sha = 'a' * 40
        image_id = 'sha256:' + 'b' * 64
        image = {'Id': image_id, 'Os': 'linux', 'Architecture': 'amd64', 'Config': {
            'User': '10001:10001', 'Labels': {'org.opencontainers.image.revision': sha},
            'Volumes': {}, 'ExposedPorts': {'8080/tcp': {}}}}
        limits = check_runtime.RUNTIME_LIMITS
        container = {'Config': {'User': '10001:10001'}, 'HostConfig': {
            'ReadonlyRootfs': True, 'CapDrop': copy.deepcopy(limits['capDrop']),
            'SecurityOpt': copy.deepcopy(limits['securityOpt']), 'Memory': limits['memoryBytes'],
            'MemorySwap': limits['memorySwapBytes'], 'NanoCpus': limits['nanoCpus'],
            'PidsLimit': limits['pidsLimit'], 'Tmpfs': copy.deepcopy(limits['tmpfs'])},
            'NetworkSettings': {'Ports': {'8080/tcp': [{'HostIp': '127.0.0.1', 'HostPort': '49152'}]}}}
        return sha, image, container

    def run_smoke(self, image, container, javascript=b'const api="https://api.pxm.edialect.top";', html=None):
        import email.message
        import json
        import urllib.error
        from unittest.mock import patch
        html = html or b'<div id="app"></div><script src="/app.js"></script><link rel="stylesheet" href="/app.css">'
        calls = []
        def fake_docker(*args):
            calls.append(args)
            if args[:2] == ('image', 'inspect'):
                return json.dumps([image])
            if args[0] == 'run':
                return 'synthetic-disposable-cid'
            if args[0] == 'inspect':
                return json.dumps([container])
            if args[0] == 'exec':
                return '/usr/share/nginx/html/index.html\n/usr/share/nginx/html/app.js\n/usr/share/nginx/html/app.css'
            if args[:2] == ('rm', '-f'):
                return 'synthetic-disposable-cid'
            raise AssertionError('Unexpected Docker operation')
        class Response:
            status = 200
            def __init__(self, url):
                self.url = url
                self.headers = email.message.Message()
                suffix = url.rsplit('.', 1)[-1]
                self.headers['Content-Type'] = {'js': 'application/javascript', 'css': 'text/css'}.get(suffix, 'text/html')
            def __enter__(self): return self
            def __exit__(self, *args): return False
            def read(self, limit):
                if self.url.endswith('/app.js'): return javascript
                if self.url.endswith('/app.css'): return b'body{}'
                return html
        class Opener:
            def open(self, url, timeout):
                if url.endswith(('/.env', '/.git/config', '/assets/missing-ci.js', '/missing-ci.css')):
                    raise urllib.error.HTTPError(url, 404, 'missing', {}, None)
                return Response(url)
        with patch.object(check_runtime, 'docker', side_effect=fake_docker), patch.object(check_runtime.urllib.request, 'build_opener', return_value=Opener()):
            try:
                return check_runtime.check('synthetic-image', 'a' * 40), calls
            finally:
                if any(args[0] == 'run' for args in calls):
                    self.assertEqual(calls[-1], ('rm', '-f', 'synthetic-disposable-cid'))

    def test_pass_is_bound_to_image_id_port_and_all_runtime_limits(self):
        _, image, container = self.fixture()
        receipt, calls = self.run_smoke(image, container)
        self.assertEqual(receipt['imageId'], image['Id'])
        self.assertEqual(receipt['result'], 'PASS')
        self.assertEqual(receipt['cleanup'], 'PASS')
        self.assertEqual(receipt['runtimeLimits'], check_runtime.RUNTIME_LIMITS)
        run = next(args for args in calls if args[0] == 'run')
        self.assertEqual(run[-1], image['Id'])
        self.assertIn('127.0.0.1::8080', run)
        self.assertNotIn('--privileged', run)

    def test_reject_bad_runtime_limits_and_still_remove_only_test_container(self):
        for field, value in [('ReadonlyRootfs', False), ('CapDrop', []), ('Memory', 0), ('PidsLimit', 0), ('Binds', ['/host:/data'])]:
            _, image, container = self.fixture()
            container['HostConfig'][field] = value
            with self.subTest(field=field), self.assertRaises(AssertionError):
                self.run_smoke(image, container)

    def test_reject_root_and_wrong_image_revision_before_starting(self):
        for field, value in [('User', '0:0'), ('Labels', {'org.opencontainers.image.revision': 'c' * 40})]:
            _, image, container = self.fixture()
            image['Config'][field] = value
            with self.subTest(field=field), self.assertRaises(AssertionError):
                self.run_smoke(image, container)

    def test_reject_test_api_and_external_entry_dependencies(self):
        _, image, container = self.fixture()
        for js in [b'https://api.pxm.test.edialect.top', b'const api="https://another-api.example";']:
            with self.subTest(js=js), self.assertRaises(AssertionError):
                self.run_smoke(image, container, javascript=js)
        with self.assertRaises(AssertionError):
            self.run_smoke(image, container, html=b'<div id="app"></div><script src="https://cdn.example/app.js"></script><link rel="stylesheet" href="/app.css">')


if __name__ == '__main__':
    unittest.main()
