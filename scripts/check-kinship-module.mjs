import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { requiresKinshipPeer } from './kinship-ci-scope.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const peer = process.argv[2] ? path.resolve(process.argv[2]) : null;
const sharedFiles = [
  'src/data/kinship/v1/engine.mjs',
  'src/data/kinship/v1/view-model.mjs',
  'src/data/kinship/v1/vue-mixin.mjs',
  'scripts/kinship-engine.test.mjs',
  'scripts/check-kinship-engine.mjs',
  'scripts/kinship-deepwalk.test.mjs',
  'scripts/check-kinship-ui.mjs',
  'scripts/kinship-ci-scope.mjs',
  'scripts/check-kinship-module.mjs',
];
assert.equal(requiresKinshipPeer(['src/components/Tools/RelativeSelect.vue']), false, 'Web-only template edit must not require a peer branch');
assert.equal(requiresKinshipPeer(['src/views/Tools/Relative.vue']), false, 'Web-only page wrapper must not require a peer branch');
assert.equal(requiresKinshipPeer(['src/pages/tools/relative.vue']), false, 'Mobile-only template edit must not require a peer branch');
assert.equal(requiresKinshipPeer(['package.json', 'docs/example.md']), false);
sharedFiles.forEach(file => assert.equal(requiresKinshipPeer([file]), true, 'Shared module/test must trigger paired CI: ' + file));
if (peer) sharedFiles.forEach(file => {
  assert.deepEqual(fs.readFileSync(path.join(root, file)), fs.readFileSync(path.join(peer, file)), 'Shared module bytes differ: ' + file);
});
const engine = path.join(root, 'src/data/kinship/v1/engine.mjs');
const commands = [
  [path.join(root, 'scripts/check-kinship.mjs'), ...(peer ? [peer] : [])],
  ['--test', path.join(root, 'scripts/kinship-engine.test.mjs')],
  [path.join(root, 'scripts/check-kinship-engine.mjs'), root, engine],
  [path.join(root, 'scripts/kinship-deepwalk.test.mjs'), root, engine],
  [path.join(root, 'scripts/check-kinship-ui.mjs'), root],
];
const requestChecks = path.join(root, 'scripts/check-relative-request.mjs');
if (fs.existsSync(requestChecks)) commands.push(['--test', requestChecks]);
for (const command of commands) {
  const result = spawnSync(process.execPath, command, { cwd: root, stdio: 'inherit' });
  assert.equal(result.status, 0, 'Failed suite: ' + path.basename(command[0]));
}
console.log(JSON.stringify({ engineUnitTests: 35, realCorpusTests: 19, componentTests: 18, deepWalks: 1000, sharedModules: peer ? 'passed' : 'not requested', ciScopes: 'passed' }));
