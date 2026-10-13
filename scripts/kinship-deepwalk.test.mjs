// Usage: node deepwalk.test.mjs <repository-root> [engine-module-path]
// Independent deterministic invariant walk; not a linguistic correctness oracle.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repository = path.resolve(process.argv[2] || process.cwd());
const engineUrl = process.argv[3]
  ? pathToFileURL(path.resolve(process.argv[3])).href
  : pathToFileURL(path.join(repository, 'src/data/kinship/v1/engine.mjs')).href;
const { createKinshipEngine } = await import(engineUrl);
const directory = path.join(repository, 'src/data/kinship/v1');
const { toEngineDataset } = await import(pathToFileURL(path.join(directory, 'adapter.mjs')));
const data = JSON.parse(fs.readFileSync(path.join(directory, 'kinship.json'), 'utf8'));

test('seeded fifteen-step real-data walks preserve identity graph constraints', t => {
  const engine = createKinshipEngine(toEngineDataset(data));
  let seed = 1949;
  let checked = 0;
  const random = length => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed % length;
  };
  function acyclic(start, edges, ancestors = []) {
    assert.ok(!ancestors.includes(start), 'Cycle: ' + ancestors.concat(start).join('>'));
    for (const next of edges(start)) acyclic(next, edges, ancestors.concat(start));
  }
  function check(graph) {
    for (const person of Object.values(graph.people)) {
      if (person.parents.fa) assert.equal(graph.people[person.parents.fa].sex, 'male');
      if (person.parents.mu) assert.equal(graph.people[person.parents.mu].sex, 'female');
      for (const parent of Object.values(person.parents)) {
        assert.ok(graph.people[parent].children.includes(person.token));
      }
      if (person.spouse) {
        assert.equal(graph.people[person.spouse].spouse, person.token);
        assert.notEqual(person.spouse, person.token);
      }
      for (const sibling of person.siblings) {
        assert.notEqual(sibling, person.token);
        assert.ok(graph.people[sibling].siblings.includes(person.token));
        for (const field of ['fa', 'mu']) {
          if (person.parents[field] && graph.people[sibling].parents[field]) {
            assert.equal(person.parents[field], graph.people[sibling].parents[field]);
          }
        }
      }
      acyclic(person.token, token => {
        const item = graph.people[token];
        return Object.values(item.parents).concat(item.unknownParents);
      });
      acyclic(person.token, token => graph.olderThan.filter(pair => pair[0] === token).map(pair => pair[1]));
    }
    checked += 1;
  }
  for (let trial = 0; trial < 1000; trial += 1) {
    let state = engine.createSession({ sex: ['unknown', 'male', 'female'][trial % 3] });
    for (let depth = 0; depth < 15; depth += 1) {
      if (!engine.selected(state)) {
        const candidate = state.candidates[random(state.candidates.length)];
        state = engine.reduce(state, { type: 'choose', candidateId: candidate.candidateId });
      }
      const nextStates = data.fields.map(field => engine.reduce(state, { type: 'advance', field: field.key }))
        .filter(next => next.path.length > state.path.length);
      if (!nextStates.length) break;
      state = nextStates[random(nextStates.length)];
      assert.ok(state.path.length <= 15);
      for (const candidate of state.candidates) check(candidate.graph);
      if (state.hasUnlistedPossibilities) assert.equal(state.selectedCandidateId, null);
    }
  }
  assert.ok(checked > 10000, 'Invariant coverage unexpectedly collapsed');
  t.diagnostic(JSON.stringify({ seed: 1949, walks: 1000, maxDepth: 15, checkedCandidateGraphs: checked }));
});
