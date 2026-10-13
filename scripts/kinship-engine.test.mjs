import test from 'node:test';
import assert from 'node:assert/strict';
import { createKinshipEngine, normalizeLegacyDataset } from '../src/data/kinship/v1/engine.mjs';

const n = (id, relations = {}, sex = 'unknown', kind = 'person') => ({ id, label: id, relations, sex, kind });
// Explicit finite corpus, including deliberately broad cousin/child role nodes.
const dataset = {
  selfId: 'self',
  nodes: [
    n('self', { fa: 'father', mu: 'mother', xiong: 'brother', di: 'youngerBrother', jie: 'sister', mei: 'youngerSister', fu: 'husband', qi: 'wife', zi: 'son', nv: 'daughter' }),
    n('father', { fa: 'grandfather', mu: 'grandmother', xiong: 'uncle', di: 'youngerUncle', jie: 'aunt', qi: 'mother', zi: ['self', 'brother', 'youngerBrother'], nv: ['self', 'sister', 'youngerSister'] }, 'male'),
    n('mother', { xiong: 'maternalUncle', zi: ['self', 'brother', 'youngerBrother'], nv: ['self', 'sister', 'youngerSister'], fu: 'father' }, 'female'),
    n('grandfather', { zi: ['father', 'uncle', 'youngerUncle'], qi: 'grandmother' }, 'male'),
    n('grandmother', { zi: ['father', 'uncle', 'youngerUncle'], fu: 'grandfather' }, 'female'),
    n('brother', { fa: 'father', mu: 'mother', xiong: 'brother', di: ['self', 'brother', 'youngerBrother'], zi: 'nephew', qi: 'brotherWife' }, 'male'),
    n('youngerBrother', { fa: 'father', mu: 'mother', xiong: ['self', 'brother', 'youngerBrother'], zi: 'nephew' }, 'male'),
    n('sister', { fa: 'father', mu: 'mother', zi: 'sisterSon', fu: 'sisterHusband' }, 'female'),
    n('youngerSister', { zi: 'sisterSon', fu: 'sisterHusband' }, 'female'),
    n('brotherWife', { fu: 'brother', zi: 'nephew' }, 'female'),
    n('sisterHusband', { qi: 'sister', zi: 'sisterSon' }, 'male'),
    n('nephew', { fa: ['brother', 'youngerBrother'], mu: 'brotherWife', xiong: 'nephew', di: 'nephew' }, 'male'),
    n('sisterSon', { mu: ['sister', 'youngerSister'], fa: 'sisterHusband' }, 'male'),
    n('uncle', { fa: 'grandfather', mu: 'grandmother', zi: 'cousin' }, 'male'),
    n('youngerUncle', { fa: 'grandfather', mu: 'grandmother', zi: 'cousin' }, 'male'),
    n('maternalUncle', { zi: 'cousin' }, 'male'),
    n('aunt', { zi: 'cousin' }, 'female'),
    n('cousin', { fa: ['uncle', 'youngerUncle', 'maternalUncle'], mu: ['aunt', 'mother'] }, 'male'),
    n('son', { fa: ['self', 'husband'], mu: ['self', 'wife'], xiong: 'son', di: 'son', nv: 'granddaughter', zi: 'grandson' }, 'male'),
    n('daughter', { fa: ['self', 'husband'], mu: ['self', 'wife'], zi: 'externalGrandson' }, 'female'),
    n('grandson', { fa: 'son', mu: 'daughterInLaw' }, 'male'),
    n('granddaughter', { fa: 'son', zi: 'greatGrandchild' }, 'female'),
    n('greatGrandchild', { mu: 'granddaughter', fa: 'grandsonInLaw' }),
    n('grandsonInLaw', {}, 'male'),
    n('daughterInLaw', {}, 'female'),
    n('externalGrandson', { fa: 'sonInLaw', mu: 'daughter', xiong: 'grandson' }, 'male'),
    n('sonInLaw', {}, 'male'),
    n('husband', { qi: 'self', zi: 'son', nv: 'daughter' }, 'male'),
    n('wife', { fu: 'self', zi: 'son', nv: 'daughter', jie: 'wifeSister' }, 'female'),
    n('wifeSister', { fu: 'wifeSisterHusband' }, 'female'),
    n('wifeSisterHusband', { qi: 'wifeSister' }, 'male')
  ]
};
const engine = createKinshipEngine(dataset);
const step = (s, field) => engine.reduce(s, { type: 'advance', field });
const roles = s => s.candidates.map(c => c.roleId);
const current = s => engine.selected(s);
function walk(fields, context = {}) {
  let state = engine.createSession(context);
  for (const field of fields) {
    state = step(state, field);
    assert.notEqual(state.status, 'unsupported', fields.join(','));
  }
  return state;
}
function selectRole(state, roleId) {
  const candidate = state.candidates.find(c => c.roleId === roleId);
  assert.ok(candidate, roleId);
  return engine.reduce(state, { type: 'choose', candidateId: candidate.candidateId });
}

test('known father restores the exact brother token, not brother-or-youngerBrother', () => {
  let state = walk(['xiong']); const token = current(state).personToken;
  state = step(step(state, 'zi'), 'fa');
  assert.deepEqual(roles(state), ['brother']);
  assert.equal(current(state).personToken, token);
});

test('paternal and maternal cousin provenance survives a merged cousin role', () => {
  assert.deepEqual(roles(walk(['fa', 'xiong', 'zi', 'fa'])), ['uncle']);
  assert.deepEqual(roles(walk(['mu', 'xiong', 'zi', 'fa'])), ['maternalUncle']);
  assert.deepEqual(roles(walk(['fa', 'jie', 'zi', 'mu'])), ['aunt']);
});

test('known sister and granddaughter remain the mother, not father', () => {
  assert.deepEqual(roles(walk(['jie', 'zi', 'mu'])), ['sister']);
  assert.deepEqual(roles(walk(['zi', 'nv', 'zi', 'mu'])), ['granddaughter']);
});

test('full-sibling parent binding survives a broad/wrong display role', () => {
  // The finite source role says grandson. The independently retained mother
  // remains the daughter; this does not repair the source role/word itself.
  assert.deepEqual(roles(walk(['nv', 'zi', 'xiong', 'mu'])), ['daughter']);
});

test('unknown ego sex branches conditionally instead of guessing a father', () => {
  const state = walk(['zi', 'fa']);
  assert.equal(state.status, 'needsChoice');
  assert.deepEqual(roles(state), ['self', 'husband']);
  assert.equal(state.candidates.find(c => c.roleId === 'self').egoSex, 'male');
  assert.equal(state.candidates.find(c => c.roleId === 'husband').egoSex, 'female');
  assert.equal(state.context.sex, 'unknown');
});

test('known ego sex limits father/mother without asking an unnecessary choice', () => {
  assert.deepEqual(roles(walk(['zi', 'fa'], { sex: 'male' })), ['self']);
  assert.deepEqual(roles(walk(['zi', 'mu'], { sex: 'female' })), ['self']);
  assert.deepEqual(roles(walk(['zi', 'fa'], { sex: 'female' })), ['husband']);
});

test('choosing a conditional candidate carries its sex constraint forward', () => {
  let state = selectRole(walk(['zi', 'fa']), 'self');
  state = step(state, 'nv');
  state = step(state, 'mu');
  assert.deepEqual(roles(state), ['wife']);
  assert.equal(current(state).egoSex, 'male');
});

test('parent-child is not blindly cancelled; unknown sibling age stays ambiguous', () => {
  const state = walk(['fa', 'zi']);
  assert.deepEqual(roles(state), ['self', 'brother', 'youngerBrother']);
  assert.equal(state.status, 'needsChoice');
});

test('multiple same-role brothers are distinct and ordered', () => {
  const first = walk(['xiong']); const a = current(first).personToken;
  const second = step(first, 'xiong'); const b = current(second).personToken;
  assert.equal(current(second).roleId, 'brother');
  assert.notEqual(a, b);
  assert.notEqual(b, 'p0');
  assert.ok(current(second).graph.olderThan.some(pair => pair[0] === b && pair[1] === a));
});

test('known child and another same-role child remain separate candidates', () => {
  const first = walk(['xiong']); const priorBrother = current(first).personToken;
  const result = step(step(first, 'fa'), 'zi');
  const brothers = result.candidates.filter(c => c.roleId === 'brother');
  assert.equal(brothers.length, 2);
  assert.ok(brothers.some(c => c.personToken === priorBrother));
  assert.ok(brothers.some(c => c.personToken !== priorBrother));
  assert.equal(new Set(brothers.map(c => c.candidateId)).size, 2);
});

test('revisiting father through a sibling uses one unique father identity', () => {
  let state = walk(['fa']); const father = current(state).personToken;
  state = selectRole(step(state, 'zi'), 'brother');
  state = step(state, 'fa');
  assert.equal(current(state).personToken, father);
});

test('unselected ambiguity blocks subsequent operations', () => {
  const before = walk(['fa', 'zi']);
  const after = step(before, 'fa');
  assert.equal(after.status, 'needsChoice');
  assert.equal(after.diagnostic, 'choose-current-candidate');
  assert.deepEqual(after.path, before.path);
  assert.deepEqual(after.candidates, before.candidates);
});

test('invalid or stale selection never selects by role or display label', () => {
  const state = walk(['fa', 'zi']);
  for (const candidateId of ['brother', 'self', 'v0:0:p0:self']) {
    const after = engine.reduce(state, { type: 'choose', candidateId });
    assert.equal(after.status, 'invalidSelection');
    assert.equal(after.selectedCandidateId, null);
  }
});

test('back restores exact prior graph, context, and selected branch', () => {
  const before = selectRole(walk(['fa', 'zi']), 'brother');
  const after = engine.reduce(step(before, 'zi'), { type: 'back' });
  assert.deepEqual(current(after).graph, current(before).graph);
  assert.equal(current(after).roleId, 'brother');
  assert.deepEqual(after.path, before.path);
  assert.notEqual(current(after).candidateId, current(before).candidateId);
});

test('back at root is safe; clear and setContext reset history and inferred sex', () => {
  const initial = engine.createSession();
  assert.deepEqual(engine.reduce(initial, { type: 'back' }), initial);
  const constrained = selectRole(walk(['zi', 'fa']), 'self');
  const cleared = engine.reduce(constrained, { type: 'clear' });
  assert.equal(current(cleared).egoSex, 'unknown');
  assert.equal(cleared.path.length, 0);
  assert.equal(cleared.history.length, 0);
  const female = engine.reduce(constrained, { type: 'setContext', context: { sex: 'female' } });
  assert.equal(current(female).egoSex, 'female');
  assert.equal(female.path.length, 0);
});

test('depth limit counts relationship steps, not choices; retains usable state', () => {
  const limited = createKinshipEngine(dataset, { maxDepth: 2 });
  let state = limited.createSession();
  state = limited.reduce(state, { type: 'advance', field: 'xiong' });
  state = limited.reduce(state, { type: 'advance', field: 'xiong' });
  const after = limited.reduce(state, { type: 'advance', field: 'xiong' });
  assert.equal(after.status, 'limit');
  assert.equal(after.path.length, 2);
  assert.deepEqual(after.candidates, state.candidates);
});

test('unsupported operations retain prior path and candidates', () => {
  const state = walk(['mu', 'xiong']);
  const after = step(state, 'fa');
  assert.equal(after.status, 'unsupported');
  assert.deepEqual(after.path, state.path);
  assert.deepEqual(after.candidates, state.candidates);
  assert.equal(step(state, 'adoptive-father').diagnostic, 'unknown-field');
});

test('collective or unsupported kinship records cannot be traversed as persons', () => {
  const source = structuredClone(dataset);
  source.nodes.find(node => node.id === 'son').kind = 'collective';
  const local = createKinshipEngine(source);
  let state = local.reduce(local.createSession(), { type: 'advance', field: 'zi' });
  state = local.reduce(state, { type: 'advance', field: 'fa' });
  assert.equal(state.status, 'unsupported');
  assert.equal(state.diagnostic, 'non-person-relation');
});

test('known spouse identity and co-parent bindings are reversible within model', () => {
  assert.deepEqual(roles(walk(['qi', 'fu'])), ['self']);
  assert.deepEqual(roles(walk(['qi', 'zi', 'fa'])), ['self']);
  assert.deepEqual(roles(walk(['qi', 'jie', 'fu'])), ['wifeSisterHusband']);
  const impossible = step(engine.createSession({ sex: 'female' }), 'qi');
  assert.equal(impossible.status, 'unsupported');
});

test('reduce is pure and session survives JSON round trip', () => {
  const before = walk(['xiong', 'zi']);
  const frozen = JSON.stringify(before);
  const after = step(before, 'fa');
  assert.equal(JSON.stringify(before), frozen);
  assert.deepEqual(step(JSON.parse(frozen), 'fa'), after);
  assert.deepEqual(JSON.parse(JSON.stringify(after)), after);
});

test('bad datasets fail explicitly and legacy normalization requires stable IDs', () => {
  assert.throws(() => createKinshipEngine({ selfId: 'self', nodes: [n('self', { fa: 'missing' })] }), /Dangling/);
  assert.throws(() => createKinshipEngine({ selfId: 'self', nodes: [n('self'), n('self')] }), /duplicate/);
  assert.throws(() => normalizeLegacyDataset([{ name: '己身' }]), /stable/);
  const normalized = normalizeLegacyDataset([{ name: '己身', relations: { fa: '父亲' } }, { name: '父亲' }], { 己身: 'self', 父亲: 'father' });
  assert.equal(normalized.nodes[0].relations.fa[0], 'father');
});

test('age constraints exclude self as the elder brother of an elder brother', () => {
  const source = structuredClone(dataset);
  source.nodes.find(node => node.id === 'brother').relations.xiong = ['self', 'brother'];
  const local = createKinshipEngine(source);
  let state = local.reduce(local.createSession(), { type: 'advance', field: 'xiong' });
  state = local.reduce(state, { type: 'advance', field: 'xiong' });
  assert.deepEqual(roles(state), ['brother']);
  assert.notEqual(local.selected(state).personToken, 'p0');
});

test('parent bindings never form a cycle even if a fallback source edge is bad', () => {
  const source = structuredClone(dataset);
  source.nodes.find(node => node.id === 'father').relations.fa = 'self';
  const local = createKinshipEngine(source);
  let state = local.reduce(local.createSession(), { type: 'advance', field: 'fa' });
  const after = local.reduce(state, { type: 'advance', field: 'fa' });
  assert.equal(after.status, 'unsupported');
  assert.deepEqual(after.candidates, state.candidates);
});

test('serialized state cannot be evaluated against a different dataset version', () => {
  const first = createKinshipEngine({ ...dataset, datasetVersion: '1' });
  const second = createKinshipEngine({ ...dataset, datasetVersion: '2' });
  const state = first.createSession();
  const after = second.reduce(state, { type: 'advance', field: 'fa' });
  assert.equal(after.diagnostic, 'dataset-version-mismatch');
  assert.deepEqual(after.path, []);
});

test('the factory snapshots relation arrays instead of observing caller mutations', () => {
  const source = structuredClone(dataset);
  const local = createKinshipEngine(source);
  source.nodes.find(node => node.id === 'father').relations.zi.push('daughter');
  let state = local.reduce(local.createSession(), { type: 'advance', field: 'fa' });
  state = local.reduce(state, { type: 'advance', field: 'zi' });
  assert.deepEqual(roles(state), ['self', 'brother', 'youngerBrother']);
});

test('elder brother then elder brother then younger brother can return the visited brother', () => {
  const first = walk(['xiong']); const visited = current(first).personToken;
  const second = step(first, 'xiong'); const elder = current(second).personToken;
  const after = step(second, 'di');
  assert.ok(after.candidates.some(c => c.personToken === visited && c.reason === 'known-sibling'));
  assert.ok(after.candidates.some(c => c.roleId === 'brother' && c.personToken !== visited && c.personToken !== elder));
  assert.ok(after.candidates.every(c => c.personToken !== elder));
});

test('spouse binding after children fills the known co-parent identity retroactively', () => {
  let state = walk(['zi'], { sex: 'male' }); const child = current(state).personToken;
  state = step(state, 'fa'); // back to self using identity, not history
  state = step(state, 'qi'); const wife = current(state).personToken;
  assert.equal(current(state).graph.people[child].parents.mu, wife);
  state = step(state, 'zi');
  const knownChild = state.candidates.find(c => c.personToken === child);
  state = engine.reduce(state, { type: 'choose', candidateId: knownChild.candidateId });
  state = step(state, 'mu');
  assert.equal(current(state).personToken, wife);
});

test('an already known co-parent is a spouse candidate rather than a newly invented person', () => {
  let state = walk(['xiong', 'zi', 'mu']);
  const mother = current(state).personToken;
  state = step(state, 'fu');
  assert.deepEqual(roles(state), ['brother']);
  assert.equal(current(state).graph.people[current(state).personToken].spouse, mother);
  assert.equal(current(state).reason, 'known-coparent');
});

test('spouse choice conflicting with already known other parent is rejected', () => {
  const source = structuredClone(dataset);
  source.nodes.find(node => node.id === 'brother').relations.qi = 'wife';
  const local = createKinshipEngine(source);
  let state = local.createSession();
  for (const field of ['xiong', 'zi', 'mu']) state = local.reduce(state, { type: 'advance', field });
  // Existing parents: brother + brotherWife. The deliberately wrong table says
  // brother's wife is ego's wife; the model must not overwrite the known mother.
  state = local.reduce(state, { type: 'advance', field: 'zi' });
  const child = state.candidates.find(c => c.reason === 'known-child');
  state = local.reduce(state, { type: 'choose', candidateId: child.candidateId });
  state = local.reduce(state, { type: 'advance', field: 'fa' });
  const after = local.reduce(state, { type: 'advance', field: 'qi' });
  assert.equal(after.status, 'unsupported');
  assert.deepEqual(after.candidates, state.candidates);
});

test('a remembered sibling with no static coverage is possible, not automatically unique', () => {
  const source = structuredClone(dataset);
  source.nodes.find(node => node.id === 'brother').relations.di = null;
  const local = createKinshipEngine(source);
  let state = local.reduce(local.createSession({ sex: 'male' }), { type: 'advance', field: 'xiong' });
  state = local.reduce(state, { type: 'advance', field: 'di' });
  assert.deepEqual(roles(state), ['self']);
  assert.equal(state.hasUnlistedPossibilities, true);
  assert.equal(state.status, 'needsChoice');
  assert.equal(state.selectedCandidateId, null);
  assert.equal(local.selected(state), null);
  assert.equal(local.reduce(state, { type: 'advance', field: 'fa' }).diagnostic, 'choose-current-candidate');
  const choice = state.candidates[0].candidateId;
  state = local.reduce(state, { type: 'choose', candidateId: choice });
  assert.equal(state.status, 'ready');
  assert.equal(state.hasUnlistedPossibilities, true);
  assert.equal(state.path[1].hasUnlistedPossibilities, true);
  const after = local.reduce(state, { type: 'advance', field: 'fa' });
  const restored = local.reduce(after, { type: 'back' });
  assert.equal(restored.hasUnlistedPossibilities, true);
  assert.equal(local.selected(restored).roleId, 'self');
  assert.equal(local.reduce(restored, { type: 'clear' }).hasUnlistedPossibilities, false);
});

test('a remembered child with no static coverage also requires explicit identity selection', () => {
  const source = structuredClone(dataset);
  source.nodes.find(node => node.id === 'father').relations.zi = null;
  const local = createKinshipEngine(source);
  let state = local.reduce(local.createSession({ sex: 'male' }), { type: 'advance', field: 'fa' });
  state = local.reduce(state, { type: 'advance', field: 'zi' });
  assert.deepEqual(roles(state), ['self']);
  assert.equal(state.hasUnlistedPossibilities, true);
  assert.equal(local.selected(state), null);
});

test('unknown-sex parent without static alternatives is incomplete; exact parent binding is not', () => {
  const source = structuredClone(dataset);
  source.nodes.find(node => node.id === 'son').relations.fa = null;
  const local = createKinshipEngine(source);
  const parentOfSon = context => {
    let state = local.reduce(local.createSession(context), { type: 'advance', field: 'zi' });
    return local.reduce(state, { type: 'advance', field: 'fa' });
  };
  const unknown = parentOfSon({ sex: 'unknown' });
  assert.equal(unknown.hasUnlistedPossibilities, true);
  assert.equal(unknown.status, 'needsChoice');
  assert.equal(local.selected(unknown), null);
  const exact = parentOfSon({ sex: 'male' });
  assert.equal(exact.hasUnlistedPossibilities, false);
  assert.equal(local.selected(exact).roleId, 'self');
});
