#!/usr/bin/env python3
"""Bounded HTTP smoke of the exact static image; only its disposable container is removed."""
import argparse
import json
import re
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from check_assets import entry_assets, validate_javascript, validate_stylesheet, forbidden_file

PORT = 8080
RUNTIME_LIMITS = {
    'capDrop': ['ALL'],
    'securityOpt': ['no-new-privileges:true'],
    'memoryBytes': 128 * 1024 * 1024,
    'memorySwapBytes': 128 * 1024 * 1024,
    'nanoCpus': 500_000_000,
    'pidsLimit': 64,
    'tmpfs': {'/tmp': 'rw,noexec,nosuid,size=32m'},
}


def docker(*args):
    return subprocess.check_output(['docker', *args], stderr=subprocess.PIPE, timeout=60).decode().strip()


def numeric_nonroot_user(value):
    parts = value.split(':') if isinstance(value, str) else []
    return len(parts) == 2 and all(part.isdecimal() and int(part) > 0 for part in parts)


def approved_exposed_ports(value):
    allowed = (
        {f'{PORT}/tcp': {}},
        {'80/tcp': {}, f'{PORT}/tcp': {}},
    )
    return value in allowed


def check(image, source_sha):
    info = json.loads(docker('image', 'inspect', image))[0]
    assert info['Os'] == 'linux' and info['Architecture'] == 'amd64'
    assert info['Config']['Labels']['org.opencontainers.image.revision'] == source_sha
    assert numeric_nonroot_user(info['Config'].get('User'))
    assert info['Config'].get('Volumes') in (None, {})
    assert approved_exposed_ports(info['Config'].get('ExposedPorts'))
    name = 'hinghwa-dict-web-smoke-' + uuid.uuid4().hex
    cid = name  # Also clean up if docker run times out after creating the container.
    result = {'result': 'FAIL', 'cleanup': 'PENDING', 'sourceSHA': source_sha, 'imageId': info['Id']}
    try:
        cid = docker('run', '-d', '--pull=never', '--name', name, '--label', 'edialect.hinghwa-dict-web-smoke=' + name,
                     '--read-only', '--cap-drop=ALL', '--security-opt=no-new-privileges:true',
                     '--memory=128m', '--memory-swap=128m', '--cpus=0.5', '--pids-limit=64',
                     '--tmpfs=/tmp:rw,noexec,nosuid,size=32m',
                     '-p', f'127.0.0.1::{PORT}', info['Id'])
        container = json.loads(docker('inspect', cid))[0]
        host = container['HostConfig']
        assert container['Config'].get('User') == info['Config']['User']
        assert host['ReadonlyRootfs'] is True
        assert host['CapDrop'] == RUNTIME_LIMITS['capDrop']
        assert host['SecurityOpt'] == RUNTIME_LIMITS['securityOpt']
        assert host['Memory'] == RUNTIME_LIMITS['memoryBytes']
        assert host['MemorySwap'] == RUNTIME_LIMITS['memorySwapBytes']
        assert host['NanoCpus'] == RUNTIME_LIMITS['nanoCpus']
        assert host['PidsLimit'] == RUNTIME_LIMITS['pidsLimit']
        assert host['Tmpfs'] == RUNTIME_LIMITS['tmpfs']
        assert not host.get('CapAdd') and not host.get('Binds') and not host.get('Devices')
        bound = container['NetworkSettings']['Ports'][f'{PORT}/tcp']
        assert len(bound) == 1 and bound[0]['HostIp'] == '127.0.0.1'
        origin = 'http://127.0.0.1:' + bound[0]['HostPort']
        opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

        def get(path):
            with opener.open(origin + path, timeout=5) as response:
                assert response.status == 200 and response.url == origin + path
                body = response.read(8 * 1024 * 1024 + 1)
                assert 0 < len(body) <= 8 * 1024 * 1024
                return body, response.headers.get_content_type()

        for attempt in range(30):
            try:
                get('/')
                break
            except Exception:
                if attempt == 29:
                    raise
                time.sleep(1)
        routes = ['/', '/Home', '/About', '/login']
        for route in routes:
            body, mime = get(route)
            assert mime == 'text/html' and b'id="app"' in body
        entries = entry_assets(get('/')[0])
        for path in entries:
            get(path)
        for path in ['/.env', '/.git/config', '/assets/missing-ci.js', '/missing-ci.css']:
            try:
                get(path)
            except urllib.error.HTTPError as error:
                assert error.code == 404
            else:
                raise AssertionError('Sensitive or absent asset was served')
        # Fetch every emitted JS/CSS asset, including lazy route chunks.
        assets = docker('exec', cid, 'find', '/usr/share/nginx/html', '-type', 'f').splitlines()
        assert 0 < len(assets) <= 4000
        counts = {'js': 0, 'css': 0}
        js_content = []
        for filename in assets:
            assert filename.startswith('/usr/share/nginx/html/')
            assert not forbidden_file(filename.removeprefix('/usr/share/nginx/html/')), 'Sensitive build input leaked'
            if not filename.endswith(('.js', '.css')):
                continue
            suffix = filename.rsplit('.', 1)[1]
            path = '/' + urllib.parse.quote(filename.removeprefix('/usr/share/nginx/html/'), safe='/')
            body, mime = get(path)
            assert mime in ({'application/javascript', 'text/javascript'} if suffix == 'js' else {'text/css'})
            assert not body.lstrip().lower().startswith((b'<!doctype html', b'<html'))
            if suffix == 'js':
                validate_javascript(body)
                js_content.append(body)
            else:
                validate_stylesheet(body)
            counts[suffix] += 1
        assert counts['js'] and counts['css']
        assert b'https://api.pxm.edialect.top' in b'\n'.join(js_content), 'Production API missing'
        result.update(result='PASS', routes=routes, javaScriptAssets=counts['js'], cssAssets=counts['css'],
                      containerPort=PORT, nonRoot=True, readOnlyRootFilesystem=True, productionAPI=True, sameOriginAssets=True,
                      runtimeLimits=RUNTIME_LIMITS)
    finally:
        if cid:
            docker('rm', '-f', cid)
        result['cleanup'] = 'PASS'
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--image', required=True)
    parser.add_argument('--source-sha', required=True)
    args = parser.parse_args()
    assert re.fullmatch('[a-f0-9]{40}', args.source_sha)
    print(json.dumps(check(args.image, args.source_sha), indent=2))
