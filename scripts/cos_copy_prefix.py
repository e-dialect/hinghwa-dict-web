#!/usr/bin/env python3

"""
Simple COS prefix copy utility.

Behavior:
- Primary: perform server-side copy using SDK's `copy_object`.
- If `copy_object` fails (common in some CI/network setups), fallback to
    downloading the object and re-uploading it (`get` + `put`).

This file focuses on clarity and minimal dependencies.
"""

import argparse
import os
import sys
import time

try:
    from qcloud_cos import CosConfig, CosS3Client
except Exception:
    print('qcloud_cos SDK not installed. Install with: pip install cos-python-sdk-v5')
    raise


def normalize_prefix(p):
    if not p:
        return ''
    return p.lstrip('/')


def make_client(region, secret_id, secret_key, endpoint=None):
    # Provide an explicit endpoint if not given. This avoids some SDK errors
    # when region-to-endpoint resolution fails in restricted environments.
    if not endpoint and region:
        endpoint = f'cos.{region}.myqcloud.com'
    cfg = CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key, Endpoint=endpoint)
    return CosS3Client(cfg)


def list_objects(client, bucket, prefix):
    marker = ''
    keys = []
    while True:
        resp = client.list_objects(Bucket=bucket, Prefix=prefix, Marker=marker, MaxKeys=1000)
        for c in resp.get('Contents', []):
            keys.append(c['Key'])
        if resp.get('IsTruncated'):
            marker = resp.get('NextMarker', '')
            if not marker:
                break
        else:
            break
    return keys


def read_body_bytes(body):
    # Try common ways SDK exposes body as bytes
    try:
        return body.get_raw_stream().read()
    except Exception:
        try:
            return body.read()
        except Exception:
            chunks = []
            for chunk in body:
                chunks.append(chunk)
            return b''.join(chunks)


def download_object(client, bucket, key, output_path):
    resp = client.get_object(Bucket=bucket, Key=key)
    body = resp.get('Body')
    if body is None:
        raise RuntimeError('No Body in get_object response')
    data = read_body_bytes(body)
    with open(output_path, 'wb') as f:
        f.write(data if isinstance(data, (bytes, bytearray)) else data.encode())
    print(f'Downloaded {key} to {output_path}')


def copy_prefix(client, bucket, src_prefix, dst_prefix):
    print(f'Listing objects under source prefix: "{src_prefix}"')
    src_keys = list_objects(client, bucket, src_prefix)
    print(f'Found {len(src_keys)} objects to copy')
    if not src_keys:
        return

    for i, src_key in enumerate(src_keys, 1):
        if src_prefix in ('', '/'):
            rel = src_key
        else:
            rel = src_key[len(src_prefix):] if src_key.startswith(src_prefix) else src_key
        dst_key = dst_prefix + rel
        print(f'[{i}/{len(src_keys)}] copy {src_key} -> {dst_key}')
        try:
            client.copy_object(Bucket=bucket, CopySource={'Bucket': bucket, 'Key': src_key}, Key=dst_key)
        except Exception as e:
            print(f'server-side copy failed for {src_key} -> {dst_key}: {e}')
            print('Attempting fallback copy (download + upload). If this also fails, check region/endpoint configuration, bucket permissions, and object size limits.')
            # Fallback to get/put
            try:
                resp = client.get_object(Bucket=bucket, Key=src_key)
                body = resp.get('Body')
                if body is None:
                    raise RuntimeError('No Body in get_object response')
                data = read_body_bytes(body)
                client.put_object(Bucket=bucket, Key=dst_key, Body=data)
                print(f'[{i}/{len(src_keys)}] copied via get/put {src_key} -> {dst_key}')
            except Exception as e2:
                print(f'Fallback copy failed for {src_key} -> {dst_key}: {e2}')
                print('Fallback failure hints: check IAM permissions for get/put, verify the object is not larger than allowed upload size, and ensure network access from CI.')
                raise
        time.sleep(0.01)


def main():
    p = argparse.ArgumentParser(description='Copy objects under a prefix within a COS bucket')
    p.add_argument('--bucket', required=True)
    p.add_argument('--region', required=True)
    p.add_argument('--src-prefix', default='')
    p.add_argument('--dst-prefix', default='')
    p.add_argument('--secret-id', default=os.environ.get('TENCENT_CLOUD_SECRET_ID'))
    p.add_argument('--secret-key', default=os.environ.get('TENCENT_CLOUD_SECRET_KEY'))
    p.add_argument('--download-key', default='')
    p.add_argument('--output-file', default='')
    args = p.parse_args()

    if not args.secret_id or not args.secret_key:
        print('Missing credentials: provide --secret-id/--secret-key or set environment variables TENCENT_CLOUD_SECRET_ID and TENCENT_CLOUD_SECRET_KEY. In GitHub Actions set these as repository Secrets.')
        sys.exit(2)
    if not args.region:
        print('Region is required (e.g. ap-beijing). Provide with --region or set the corresponding secret.')
        sys.exit(2)
    if not args.bucket:
        print('Bucket is required: provide --bucket (your COS bucket name).')
        sys.exit(2)

    bucket = args.bucket
    region = args.region
    src = normalize_prefix(args.src_prefix)
    dst = normalize_prefix(args.dst_prefix)
    if src and not src.endswith('/'):
        src = src + '/'
    if dst and not dst.endswith('/'):
        dst = dst + '/'

    client = make_client(region, args.secret_id, args.secret_key)

    if args.download_key:
        try:
            download_object(client, bucket, args.download_key, args.output_file)
        except Exception as e:
            print(f'Download failed for key {args.download_key}: {e}')
            print('Hints: verify the key exists, the bucket and region are correct, and the credentials have GetObject permission.')
            sys.exit(1)
        return

    existing = list_objects(client, bucket, dst)
    if existing:
        print(f'destination prefix "{dst}" already has {len(existing)} objects, skipping copy')
        return

    copy_prefix(client, bucket, src, dst)


if __name__ == '__main__':
    main()