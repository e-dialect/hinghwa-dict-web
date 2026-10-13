// Usage: node integration.test.mjs [repository-root] [engine-module-path]
// The optional engine path lets either frontend install the shared module at its
// own source location. No absolute repository path is embedded in this suite.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repository = path.resolve(process.argv[2] || process.cwd());
const directory = path.join(repository, 'src/data/kinship/v1');
const engineUrl = process.argv[3]
  ? pathToFileURL(path.resolve(process.argv[3])).href : pathToFileURL(path.join(directory, 'engine.mjs')).href;
const { createKinshipEngine } = await import(engineUrl);
const { toEngineDataset } = await import(pathToFileURL(path.join(directory, 'adapter.mjs')).href);
const { validateDataset } = await import(pathToFileURL(path.join(directory, 'validator.mjs')).href);
const data = JSON.parse(await fs.readFile(path.join(directory, 'kinship.json'), 'utf8'));
const registry = JSON.parse(await fs.readFile(path.join(directory, 'role-ids.json'), 'utf8'));
const engine = createKinshipEngine(toEngineDataset(data));
const fields = data.fields.map(field => field.key);
const role = legacyName => {
  const node = data.nodes.find(item => item.legacyName === legacyName || item.label === legacyName);
  assert.ok(node, 'Missing fixture role: ' + legacyName);
  return node.id;
};
const advance = (state, field) => engine.reduce(state, { type: 'advance', field });
const selected = state => engine.selected(state);
const roleIds = state => state.candidates.map(candidate => candidate.roleId);
function walk(steps, context = {}, localEngine = engine) {
  let state = localEngine.createSession(context);
  for (const field of steps) {
    assert.ok(localEngine.selected(state), 'Unexpected ambiguity before ' + field + ' in ' + steps.join('>'));
    state = localEngine.reduce(state, { type: 'advance', field });
    assert.notEqual(state.status, 'unsupported', steps.join('>') + ': ' + state.diagnostic);
  }
  return state;
}

test('the real phase-2 dataset validates and keeps its version through the adapter', () => {
  assert.deepEqual(validateDataset(data, registry), []);
  assert.equal(engine.createSession().datasetVersion, data.datasetVersion);
  assert.ok(data.nodes.length >= 110);
  const projected = toEngineDataset(data);
  assert.ok(projected.nodes.every(node => !('termIds' in node) && !('wordId' in node)));
  assert.ok(data.terms.some(term => term.status === 'rolePending'));
  assert.ok(data.terms.some(term => term.status === 'missingWord'));
});

test('real-data parent and lineage regressions use previously established identity', () => {
  for (const [steps, expected] of [
    [['xiong', 'zi', 'fa'], '兄亲'],
    [['fa', 'xiong', 'zi', 'fa'], '伯父'],
    [['mu', 'xiong', 'zi', 'fa'], '舅父'],
    [['jie', 'zi', 'mu'], '姊亲'],
    [['zi', 'nv', 'zi', 'mu'], '孙女'],
    [['nv', 'zi', 'xiong', 'mu'], '女亲'],
    [['qi', 'jie', 'fu'], '姨姊妹夫']
  ]) assert.deepEqual(roleIds(walk(steps)), [role(expected)], steps.join('>'));
});

test('real-data parent-child ambiguity and conditional ego sex are preserved', () => {
  const parentChild = walk(['fa', 'zi']);
  assert.deepEqual(new Set(roleIds(parentChild)), new Set(['己身', '兄亲', '弟亲'].map(role)));
  assert.equal(parentChild.status, 'needsChoice');
  const uncertain = walk(['zi', 'fa']);
  assert.deepEqual(new Set(roleIds(uncertain)), new Set(['己身', '夫亲'].map(role)));
  assert.equal(uncertain.candidates.find(candidate => candidate.roleId === role('己身')).egoSex, 'male');
  assert.equal(uncertain.candidates.find(candidate => candidate.roleId === role('夫亲')).egoSex, 'female');
  assert.deepEqual(roleIds(walk(['zi', 'fa'], { sex: 'male' })), [role('己身')]);
});

test('real-data equally named people retain separate identities and choice IDs', () => {
  const first = walk(['xiong']);
  const token = selected(first).personToken;
  const second = advance(first, 'xiong');
  assert.notEqual(selected(second).personToken, token);
  assert.equal(selected(second).roleId, selected(first).roleId);
  const backwardsSibling = advance(second, 'di');
  const brotherChoices = backwardsSibling.candidates.filter(candidate => candidate.roleId === role('兄亲'));
  assert.ok(brotherChoices.some(candidate => candidate.personToken === token));
  assert.ok(brotherChoices.some(candidate => candidate.personToken !== token));
  assert.equal(new Set(brotherChoices.map(candidate => candidate.candidateId)).size, brotherChoices.length);
  assert.equal(advance(backwardsSibling, 'fa').diagnostic, 'choose-current-candidate');
});

test('a real known sibling is not a unique complete answer when the source has no edge coverage', () => {
  let state = walk(['mu', 'fa', 'xiong', 'di']);
  assert.deepEqual(roleIds(state), [role('外祖父')]);
  assert.equal(state.hasUnlistedPossibilities, true);
  assert.equal(state.status, 'needsChoice');
  assert.equal(selected(state), null);
  assert.equal(advance(state, 'fa').diagnostic, 'choose-current-candidate');
  state = engine.reduce(state, { type: 'choose', candidateId: state.candidates[0].candidateId });
  assert.equal(selected(state).roleId, role('外祖父'));
  assert.equal(state.hasUnlistedPossibilities, true);
  assert.equal(state.path[state.path.length - 1].hasUnlistedPossibilities, true);
  const restored = engine.reduce(advance(state, 'fa'), { type: 'back' });
  assert.equal(restored.hasUnlistedPossibilities, true);
  assert.equal(selected(restored).roleId, role('外祖父'));
});

test('real-data sibling ages constrain identity without inventing cousin ages', () => {
  const first = walk(['xiong']); const firstBrother = selected(first).personToken;
  const second = advance(first, 'xiong'); const secondBrother = selected(second).personToken;
  assert.ok(selected(second).graph.olderThan.some(pair => pair[0] === secondBrother && pair[1] === firstBrother));
  const olderAgain = advance(second, 'xiong');
  assert.ok(olderAgain.candidates.every(candidate => !['p0', firstBrother, secondBrother].includes(candidate.personToken)));
  const cousin = walk(['fa', 'xiong', 'zi']);
  const cousinToken = selected(cousin).personToken;
  // A parent's older brother can have a son younger OR older than ego.
  assert.ok(selected(cousin).graph.olderThan.every(pair =>
    !((pair[0] === cousinToken && pair[1] === 'p0') || (pair[0] === 'p0' && pair[1] === cousinToken))));
});

test('real-data spouses and known children retain the same co-parent identities', () => {
  assert.deepEqual(roleIds(walk(['qi', 'zi', 'fa'])), [role('己身')]);
  let state = walk(['zi'], { sex: 'male' }); const child = selected(state).personToken;
  state = advance(state, 'fa');
  state = advance(state, 'qi'); const mother = selected(state).personToken;
  assert.equal(selected(state).graph.people[child].parents.mu, mother);
  state = advance(state, 'zi');
  const previouslyVisitedChild = state.candidates.find(candidate => candidate.personToken === child);
  assert.ok(previouslyVisitedChild);
  state = engine.reduce(state, { type: 'choose', candidateId: previouslyVisitedChild.candidateId });
  state = advance(state, 'mu');
  assert.equal(selected(state).personToken, mother);
  assert.equal(selected(state).graph.people[child].parents.fa, 'p0');
});

test('real-data candidate selection carries inferred sex but clearing does not save it as explicit preference', () => {
  let state = walk(['zi', 'fa']);
  const self = state.candidates.find(candidate => candidate.roleId === role('己身'));
  state = engine.reduce(state, { type: 'choose', candidateId: self.candidateId });
  assert.equal(selected(state).egoSex, 'male');
  assert.equal(state.context.sex, 'unknown');
  state = advance(state, 'nv');
  assert.deepEqual(roleIds(advance(state, 'mu')), [role('妻亲')]);
  const cleared = engine.reduce(state, { type: 'clear' });
  assert.equal(selected(cleared).egoSex, 'unknown');
  assert.equal(cleared.path.length, 0);
  const changed = engine.reduce(state, { type: 'setContext', context: { sex: 'female' } });
  assert.equal(selected(changed).egoSex, 'female');
  assert.equal(changed.path.length, 0);
  assert.deepEqual(roleIds(walk(['zi', 'mu'], { sex: 'female' })), [role('己身')]);
});

test('real-data back restores the selected graph and rejects a candidate ID from the abandoned step', () => {
  const choices = walk(['fa', 'zi']);
  const brother = choices.candidates.find(candidate => candidate.roleId === role('兄亲'));
  const before = engine.reduce(choices, { type: 'choose', candidateId: brother.candidateId });
  const after = advance(before, 'zi'); const staleId = selected(after).candidateId;
  const restored = engine.reduce(after, { type: 'back' });
  assert.deepEqual(selected(restored).graph, selected(before).graph);
  assert.equal(selected(restored).personToken, brother.personToken);
  assert.equal(engine.reduce(restored, { type: 'choose', candidateId: staleId }).status, 'invalidSelection');
  assert.deepEqual(JSON.parse(JSON.stringify(restored)), restored);
});

test('display labels and lexical forms are not relation or person IDs', () => {
  const altered = structuredClone(data);
  for (const node of altered.nodes) node.label = 'display:' + node.id;
  for (const term of altered.terms) term.text = 'lexical-display-only:' + term.id;
  const other = createKinshipEngine(toEngineDataset(altered));
  const steps = ['mu', 'xiong', 'zi', 'fa'];
  const original = walk(steps);
  const changed = walk(steps, {}, other);
  assert.deepEqual(roleIds(changed), roleIds(original));
  assert.equal(other.selected(changed).personToken, selected(original).personToken);
  assert.notEqual(other.selected(changed).label, selected(original).label);
  // Lexical edits above are deliberately not a valid dictionary rebind. They
  // prove only that the engine consumes the semantic projection independently.
});

test('one shared dictionary binding does not collapse different ancestor roles', () => {
  const paternal = walk(['fa', 'fa', 'fa']);
  const maternal = walk(['mu', 'fa', 'fa']);
  assert.notEqual(selected(paternal).roleId, selected(maternal).roleId);
  const terms = new Map(data.terms.map(term => [term.id, term]));
  const bindingsFor = state => data.nodes.find(node => node.id === selected(state).roleId)
    .termIds.map(id => terms.get(id).bindingId).filter(Boolean);
  assert.ok(bindingsFor(paternal).some(id => bindingsFor(maternal).includes(id)),
    'The corpus should retain the shared 大公 lexical binding without merging roles');
  // Keep both ancestral branches in one graph as well as checking their role
  // projections separately: sharing a binding must not reuse a person token.
  let state = paternal;
  for (const roleId of ['paternal-grandfather', 'father']) {
    state = advance(state, 'zi');
    const candidate = state.candidates.find(item => item.roleId === roleId);
    assert.ok(candidate);
    state = engine.reduce(state, { type: 'choose', candidateId: candidate.candidateId });
  }
  for (const field of ['qi', 'fa', 'fa']) state = advance(state, field);
  assert.equal(selected(state).roleId, selected(maternal).roleId);
  assert.notEqual(selected(state).personToken, selected(paternal).personToken);
  assert.equal(selected(state).graph.people[selected(paternal).personToken].roleId, selected(paternal).roleId);
});

test('returning through either grandfather parent retains one ancestor and the prior child lineage', () => {
  for (const parent of ['fa', 'mu']) {
    const before = walk([parent, 'fa']);
    const ancestor = selected(before).personToken;
    const priorParent = selected(before).graph.people[ancestor].children[0];
    const returned = advance(advance(before, 'fa'), 'zi');
    const choices = returned.candidates.filter(candidate => candidate.roleId === selected(before).roleId);
    assert.equal(choices.length, 1);
    assert.equal(choices[0].personToken, ancestor);
    const restored = engine.reduce(returned, { type: 'choose', candidateId: choices[0].candidateId });
    const children = advance(restored, parent === 'fa' ? 'zi' : 'nv');
    assert.ok(children.candidates.some(candidate => candidate.personToken === priorParent));
  }
});

test('grandparents retain their unique identity through sibling and co-parent detours', () => {
  for (const [prefix, route] of [
    [['fa', 'fa'], ['xiong', 'fa', 'zi']],
    [['fa', 'mu'], ['xiong', 'mu', 'nv']],
    [['mu', 'fa'], ['xiong', 'fa', 'zi']]
  ]) {
    const before = walk(prefix); let state = before;
    for (const field of route) state = advance(state, field);
    const choices = state.candidates.filter(candidate => candidate.roleId === selected(before).roleId);
    assert.equal(choices.length, 1, prefix.concat(route).join('>'));
    assert.equal(choices[0].personToken, selected(before).personToken);
  }
});

test('indirect elder and younger uncles obey father, grandfather and spouse age anchors', () => {
  for (const [prefix, elderRole, youngerRole, anchorRole] of [
    [['fa', 'fa', 'zi'], 'father-older-brother', 'father-younger-brother', 'father'],
    [['fa', 'fa', 'fa', 'zi'], 'paternal-grandfather-older-brother', 'paternal-grandfather-younger-brother', 'paternal-grandfather'],
    [['mu', 'fa', 'fa', 'zi'], 'maternal-grandfather-older-brother', 'maternal-grandfather-younger-brother', 'maternal-grandfather'],
    [['fu', 'fa', 'zi'], 'husband-older-brother', 'husband-younger-brother', 'husband']
  ]) {
    for (const [uncleRole, forbidden, allowed] of [[elderRole, 'xiong', 'di'], [youngerRole, 'di', 'xiong']]) {
      const choices = walk(prefix);
      const uncle = choices.candidates.find(candidate => candidate.roleId === uncleRole);
      assert.ok(uncle, uncleRole);
      const state = engine.reduce(choices, { type: 'choose', candidateId: uncle.candidateId });
      const after = advance(state, forbidden);
      if (after.path.length === state.path.length) {
        assert.equal(after.status, 'unsupported');
        assert.deepEqual(after.candidates, state.candidates);
      } else {
        assert.ok(!after.candidates.some(candidate => candidate.roleId === anchorRole), uncleRole + '>' + forbidden);
      }
      assert.ok(advance(state, allowed).candidates.some(candidate => candidate.roleId === anchorRole));
    }
  }
});

test('another elder uncle can be younger than the visited elder uncle while remaining older than father', () => {
  const choices = walk(['fa', 'fa', 'zi']);
  const uncle = choices.candidates.find(candidate => candidate.roleId === 'father-older-brother');
  const state = engine.reduce(choices, { type: 'choose', candidateId: uncle.candidateId });
  const after = advance(state, 'di');
  const other = after.candidates.find(candidate => candidate.roleId === uncle.roleId && candidate.personToken !== uncle.personToken);
  assert.ok(other);
  const father = Object.values(other.graph.people).find(person => person.roleId === 'father').token;
  assert.ok(other.graph.olderThan.some(([older, younger]) => older === uncle.personToken && younger === other.personToken));
  assert.ok(other.graph.olderThan.some(([older, younger]) => older === other.personToken && younger === father));
  const younger = choices.candidates.find(candidate => candidate.roleId === 'father-younger-brother');
  const youngState = engine.reduce(choices, { type: 'choose', candidateId: younger.candidateId });
  assert.ok(advance(youngState, 'xiong').candidates.some(candidate =>
    candidate.roleId === younger.roleId && candidate.personToken !== younger.personToken));
});

test('a merged maternal uncle role does not acquire a global age relative to mother', () => {
  const choices = walk(['mu', 'fa', 'zi']);
  const uncle = choices.candidates.find(candidate => candidate.roleId === 'mother-brother');
  const state = engine.reduce(choices, { type: 'choose', candidateId: uncle.candidateId });
  const mother = Object.values(selected(state).graph.people).find(person => person.roleId === 'mother').token;
  assert.ok(!selected(state).graph.olderThan.some(pair => pair.includes(mother) && pair.includes(uncle.personToken)));
  for (const field of ['jie', 'mei']) {
    assert.ok(advance(state, field).candidates.some(candidate => candidate.personToken === mother));
  }
  assert.ok(advance(state, 'xiong').candidates.some(candidate => candidate.roleId === uncle.roleId && candidate.personToken !== uncle.personToken));
});

test('aggregate cousin roles still produce different people instead of ancestor-like singletons', () => {
  const first = walk(['fa', 'xiong', 'zi']);
  const other = advance(first, 'xiong');
  assert.equal(selected(other).roleId, selected(first).roleId);
  assert.notEqual(selected(other).personToken, selected(first).personToken);
});

test('ancestor identity and indirect age constraints survive undo and JSON without contaminating reset', () => {
  const choices = walk(['fa', 'fa', 'zi']);
  const uncle = choices.candidates.find(candidate => candidate.roleId === 'father-older-brother');
  const before = engine.reduce(choices, { type: 'choose', candidateId: uncle.candidateId });
  const frozen = JSON.stringify(before);
  const after = advance(JSON.parse(frozen), 'di');
  const restored = engine.reduce(after, { type: 'back' });
  assert.equal(JSON.stringify(before), frozen);
  assert.deepEqual(selected(restored).graph, selected(before).graph);
  assert.equal(selected(restored).personToken, uncle.personToken);
  assert.ok(!advance(restored, 'xiong').candidates.some(candidate => candidate.roleId === 'father'));
  for (const action of [{ type: 'clear' }, { type: 'setContext', context: { sex: 'female' } }]) {
    const reset = engine.reduce(restored, action);
    assert.deepEqual(selected(reset).graph.olderThan, []);
    assert.deepEqual(Object.keys(selected(reset).graph.people), ['p0']);
    assert.deepEqual(reset.history, []);
  }
});

function assertGraph(graph) {
  for (const person of Object.values(graph.people)) {
    assert.notEqual(person.parents.fa, person.token);
    assert.notEqual(person.parents.mu, person.token);
    assert.notEqual(person.spouse, person.token);
    assert.ok(!person.siblings.includes(person.token));
    for (const ref of Object.values(person.parents).concat(person.children, person.siblings, person.unknownParents)) {
      assert.ok(graph.people[ref], 'Dangling symbolic person');
    }
    if (person.parents.fa) assert.equal(graph.people[person.parents.fa].sex, 'male');
    if (person.parents.mu) assert.equal(graph.people[person.parents.mu].sex, 'female');
    if (person.spouse) assert.equal(graph.people[person.spouse].spouse, person.token);
    if (person.parents.fa && person.parents.mu) {
      const father = graph.people[person.parents.fa]; const mother = graph.people[person.parents.mu];
      if (father.spouse) assert.equal(father.spouse, mother.token);
      if (mother.spouse) assert.equal(mother.spouse, father.token);
    }
    for (const sibling of person.siblings) {
      assert.ok(graph.people[sibling].siblings.includes(person.token));
      for (const field of ['fa', 'mu']) assert.equal(graph.people[sibling].parents[field], person.parents[field]);
    }
    const ancestors = Object.values(person.parents).concat(person.unknownParents); const visited = new Set();
    while (ancestors.length) {
      const next = ancestors.pop();
      assert.notEqual(next, person.token, 'Parent cycle');
      if (visited.has(next)) continue;
      visited.add(next);
      ancestors.push(...Object.values(graph.people[next].parents), ...graph.people[next].unknownParents);
    }
  }
  for (const [older, younger] of graph.olderThan) {
    const queue = [younger]; const visited = new Set();
    while (queue.length) {
      const next = queue.pop();
      assert.notEqual(next, older, 'Age constraint cycle');
      if (visited.has(next)) continue;
      visited.add(next);
      for (const pair of graph.olderThan) if (pair[0] === next) queue.push(pair[1]);
    }
  }
}

test('four-step finite expansion of the real corpus preserves symbolic graph invariants', t => {
  let frontier = [engine.createSession()]; let transitions = 0; let candidateGraphs = 0;
  for (let depth = 0; depth < 4; depth++) {
    const next = [];
    for (const state of frontier) for (const candidate of state.candidates) {
      const branch = engine.reduce(state, { type: 'choose', candidateId: candidate.candidateId });
      for (const field of fields) {
        const result = advance(branch, field); transitions++;
        if (result.path.length === state.path.length) {
          assert.deepEqual(result.candidates, branch.candidates);
          continue;
        }
        for (const item of result.candidates) {
          assert.equal(item.sex, item.graph.people[item.personToken].sex);
          assert.equal(item.egoSex, item.graph.people.p0.sex);
          assertGraph(item.graph); candidateGraphs++;
        }
        next.push(result);
      }
    }
    frontier = next;
  }
  assert.ok(transitions > 1000 && candidateGraphs > 1000);
  t.diagnostic(JSON.stringify({ datasetVersion: data.datasetVersion, nodes: data.nodes.length, transitions, candidateGraphs }));
});
