import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'src/data/kinship/v1');
const json = filename => JSON.parse(fs.readFileSync(path.join(directory, filename), 'utf8'));
const data = json('kinship.json');
const roleIds = json('role-ids.json');
const contract = json('legacy-contract.json');
const schema = json('schema.json');
const { validateDataset } = await import(pathToFileURL(path.join(directory, 'validator.mjs')));
const { createLegacyApi, toEngineDataset } = await import(pathToFileURL(path.join(directory, 'adapter.mjs')));
assert.deepEqual(validateDataset(data, roleIds), [], 'Dataset does not satisfy schema and semantic invariants');
assert.equal(schema.properties.schemaVersion.const, data.schemaVersion);
assert.equal(schema.$defs.term.properties.usage.const, 'unknown');
assert.deepEqual(schema.$defs.node.properties.relations.required, data.fields.map(field => field.key));
assert.equal(Object.keys(roleIds.idByLegacyName).length, 110, 'ID registry count changed');
const idDigest = crypto.createHash('sha256').update(JSON.stringify(roleIds.idByLegacyName)).digest('hex');
assert.equal(idDigest, contract.roleIdsSha256, 'Frozen semantic IDs changed');
const api = createLegacyApi(data);
assert.equal(api.relative.length, contract.nodeCount);
const digest = crypto.createHash('sha256').update(JSON.stringify({
  buttons: api.buttons, fieldName: api.fieldName, relative: api.relative,
})).digest('hex');
assert.equal(digest, contract.sha256, 'Phase 1 API behavior changed during schema migration');
const engineData = toEngineDataset(data);
assert.equal(engineData.datasetVersion, data.datasetVersion);
assert.equal(engineData.schemaVersion, data.schemaVersion);
assert.equal(engineData.selfId, roleIds.idByLegacyName['己身']);
assert.equal(engineData.nodes.length, 110);
assert.ok(engineData.nodes.every(node => !('termIds' in node)), 'Engine must not infer lexical availability from role state');
const cloned = JSON.parse(JSON.stringify(data));
const originalRelation = data.nodes.find(node => Array.isArray(node.relations.zi));
const projectedRelation = engineData.nodes.find(node => node.id === originalRelation.id);
projectedRelation.relations.zi.push('mutation');
assert.deepEqual(data, cloned, 'Engine projection mutated canonical data');
const renamed = JSON.parse(JSON.stringify(data));
renamed.nodes[0].label = '自己';
const renamedApi = createLegacyApi(renamed);
assert.equal(renamedApi.relative[0].name, '己身', 'Display label rename changed legacy API alias');
assert.equal(renamedApi.relative[1].name, data.nodes[1].label);
assert.equal(toEngineDataset(renamed).selfId, 'self', 'Renaming a display label changed semantic ID');
assert.equal(toEngineDataset(renamed).nodes[0].label, '自己');
assert.deepEqual(validateDataset(renamed, roleIds), [], 'Display label rename must preserve stable ID registry');

const reject = (description, mutate) => {
  const candidate = JSON.parse(JSON.stringify(data));
  mutate(candidate);
  assert.ok(validateDataset(candidate, roleIds).length > 0, 'Validator accepted ' + description);
};
reject('unsupported schema version', candidate => { candidate.schemaVersion = '2.0.0'; });
reject('duplicate role ID', candidate => { candidate.nodes[1].id = candidate.nodes[0].id; });
reject('changed frozen ID', candidate => { candidate.nodes[1].id = 'invented-role'; });
reject('missing target', candidate => { candidate.nodes[0].relations.fa = 'absent'; });
reject('wrong relation field', candidate => { candidate.nodes[0].relations.fake = null; });
reject('duplicate target', candidate => { candidate.nodes[0].relations.fa = ['father', 'father']; });
reject('blank term', candidate => { candidate.terms[0].text = ''; });
reject('missing binding', candidate => { candidate.terms[0].bindingId = 'absent'; });
reject('wrong binding word', candidate => { candidate.bindings[0].snapshotWord = 'different'; });
reject('nonpositive database ID', candidate => { candidate.bindings[0].wordId = 0; });
reject('claimed usage without review', candidate => { candidate.terms[0].usage = 'address'; });
reject('unknown provenance', candidate => { candidate.nodes[0].provenance = ['absent']; });
reject('bound role placeholder', candidate => {
  const term = candidate.terms.find(item => item.status === 'rolePending');
  term.bindingId = candidate.bindings[0].id;
});
reject('role placeholder counted as missing word', candidate => {
  const term = candidate.terms.find(item => item.status === 'rolePending');
  term.status = 'missingWord';
});
reject('missing dialect word counted as role placeholder', candidate => {
  const term = candidate.terms.find(item => item.status === 'missingWord');
  term.status = 'rolePending';
});
reject('unreferenced term', candidate => {
  candidate.terms.push({ ...candidate.terms[0], id: 'term-unused' });
});
reject('malformed node', candidate => { candidate.nodes[0] = null; });
reject('malformed field', candidate => { candidate.fields[0] = null; });
reject('unexpected metadata', candidate => { candidate.fake = true; });
assert.deepEqual(data.terms.filter(term => term.status === 'missingWord').length, 20);
assert.equal(data.terms.filter(term => term.status === 'rolePending').length, 28);
assert.equal(data.terms.filter(term => term.status === 'bound').length, 75);
for (const filename of ['adapter.mjs', 'validator.mjs']) {
  const result = spawnSync(process.execPath, ['--check', path.join(directory, filename)], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}

const peer = process.argv[2];
if (peer) {
  const peerRoot = path.resolve(peer);
  const peerDirectory = path.join(peerRoot, 'src/data/kinship/v1');
  for (const filename of ['kinship.json', 'role-ids.json', 'schema.json', 'legacy-contract.json', 'adapter.mjs', 'validator.mjs']) {
    assert.deepEqual(fs.readFileSync(path.join(directory, filename)), fs.readFileSync(path.join(peerDirectory, filename)), 'Shared file bytes differ: ' + filename);
  }
  for (const filename of ['scripts/check-relative.mjs', 'scripts/check-kinship.mjs']) {
    assert.deepEqual(fs.readFileSync(path.join(root, filename)), fs.readFileSync(path.join(peerRoot, filename)), 'Check scripts differ: ' + filename);
  }
}
const regression = spawnSync(process.execPath, [path.join(root, 'scripts/check-relative.mjs'), ...(peer ? [peer] : [])], { encoding: 'utf8' });
assert.equal(regression.status, 0, regression.stderr);
process.stdout.write(regression.stdout);
console.log(JSON.stringify({
  schemaVersion: data.schemaVersion, datasetVersion: data.datasetVersion,
  roles: data.nodes.length, terms: data.terms.length, databaseBindings: data.bindings.length,
  frozenIds: 'passed', legacyContract: 'passed', negativeChecks: 19,
  sharedBytes: peer ? 'passed' : 'not requested',
}));
