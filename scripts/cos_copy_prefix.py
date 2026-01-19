#!/usr/bin/env python3
import argparse
import os
import sys
import time

try:
    from qcloud_cos import CosConfig, CosS3Client
except Exception:
    print('qcloud_cos SDK not installed. Please pip install cos-python-sdk-v5 or qcloud_cos')
    raise


def normalize_prefix(p):
    if not p:
        return ''
    return p.lstrip('/')


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


def copy_prefix(client, bucket, src_prefix, dst_prefix):
    print(f'Listing objects under source prefix: "{src_prefix}"')
    src_keys = list_objects(client, bucket, src_prefix)
    print(f'Found {len(src_keys)} objects to copy')
    if not src_keys:
        return
    for i, src_key in enumerate(src_keys, 1):
        # compute destination key
        if src_prefix == '' or src_prefix == '/':
            rel = src_key
        else:
            rel = src_key[len(src_prefix):] if src_key.startswith(src_prefix) else src_key
        dst_key = dst_prefix + rel
        print(f'[{i}/{len(src_keys)}] copy {src_key} -> {dst_key}')
        try:
            client.copy_object(Bucket=bucket, CopySource={'Bucket': bucket, 'Key': src_key}, Key=dst_key)
        except Exception as e:
            print('copy error:', e)
            raise
        time.sleep(0.01)


def download_object(client, bucket, key, output_path):
    try:
        resp = client.get_object(Bucket=bucket, Key=key)
    except Exception as e:
        print(f'get_object error for key {key}:', e)
        raise
    body = resp.get('Body')
    if body is None:
        raise RuntimeError('No Body in get_object response')
    data = None
    # try common methods
    try:
        data = body.get_raw_stream().read()
    except Exception:
        try:
            data = body.read()
        except Exception:
            try:
                # some SDK versions provide iter
                chunks = []
                for chunk in body:
                    chunks.append(chunk)
                data = b''.join(chunks)
            except Exception as e:
                print('Failed to read object body:', e)
                raise
    with open(output_path, 'wb') as f:
        if isinstance(data, str):
            f.write(data.encode())
        else:
            f.write(data)
    print(f'Downloaded {key} to {output_path}')


def main():
    p = argparse.ArgumentParser()
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
        print('Missing credentials: provide --secret-id/--secret-key or set env TENCENT_CLOUD_SECRET_ID/TENCENT_CLOUD_SECRET_KEY')
        sys.exit(2)

    if not args.region:
        print('Region is required: provide --region')
        sys.exit(2)

    if not args.bucket:
        print('Bucket is required: provide --bucket')
        sys.exit(2)

    bucket = args.bucket
    region = args.region
    src = normalize_prefix(args.src_prefix)
    dst = normalize_prefix(args.dst_prefix)
    if src and not src.endswith('/'):
        src = src + '/'
    if dst and not dst.endswith('/'):
        dst = dst + '/'

    # Ensure SDK has an explicit endpoint derived from region to avoid
    # "Region or Endpoint is required not empty" errors during copy_object.
    # Endpoint format expected by qcloud_cos SDK: cos.<region>.myqcloud.com
    endpoint = f'cos.{region}.myqcloud.com' if region else None
    config = CosConfig(Region=region, SecretId=args.secret_id, SecretKey=args.secret_key, Endpoint=endpoint)
    client = CosS3Client(config)

    # If download-key provided, download and exit
    if args.download_key:
        try:
            download_object(client, bucket, args.download_key, args.output_file)
        except Exception as e:
            print('download failed', e)
            sys.exit(1)
        return

    # if dst already has objects, skip copying
    existing = list_objects(client, bucket, dst)
    if existing:
        print(f'destination prefix "{dst}" already has {len(existing)} objects, skipping copy')
        return

    # copy
    copy_prefix(client, bucket, src, dst)


if __name__ == '__main__':
    main()
