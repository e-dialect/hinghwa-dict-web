import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function requiresKinshipPeer(paths) {
  return paths.some(file => file.startsWith('src/data/kinship/')
    || /^scripts\/(?:check-(?:relative|kinship[^/]*)|kinship-[^/]*)\.mjs$/.test(file)
    || file === '.github/workflows/kinship-data-check.yml');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const base = process.argv[2];
  if (!base || !/^[0-9a-f]{40}$/.test(base)) throw new Error('A PR base commit SHA is required');
  const files = execFileSync('git', ['diff', '--name-only', base, 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  const paired = requiresKinshipPeer(files);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, 'paired=' + paired + '\n');
  console.log(JSON.stringify({ paired, changedFiles: files.length }));
}
