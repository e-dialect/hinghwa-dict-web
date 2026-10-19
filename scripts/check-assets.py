#!/usr/bin/env python3
import argparse
import json
from pathlib import Path
from check_assets import check_tree

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(check_tree(args.root), indent=2))
