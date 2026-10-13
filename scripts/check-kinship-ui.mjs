// Real component exports and shared mixin event flows; no DOM or external packages.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const directory = path.join(root, 'src/data/kinship/v1');
const data = JSON.parse(fs.readFileSync(path.join(directory, 'kinship.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(directory, 'role-ids.json'), 'utf8')).idByLegacyName;
const { createKinshipMixin } = await import(pathToFileURL(path.join(directory, 'vue-mixin.mjs')));
const { createKinshipViewModel, loadKinshipTerms } = await import(pathToFileURL(path.join(directory, 'view-model.mjs')));
const web = fs.existsSync(path.join(root, 'src/components/Tools/RelativeSelect.vue'));
const componentFile = web ? 'src/components/Tools/RelativeSelect.vue' : 'src/pages/tools/relative.vue';
const source = fs.readFileSync(path.join(root, componentFile), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
  .replace('export default', 'return');
const role = name => registry[name];
const wordFor = id => ({ id, word: data.bindings.find(item => item.wordId === id)?.snapshotWord || 'word:' + id, definition: 'fixture', source: '', standard_pinyin: '', standard_ipa: '' });
const tick = () => new Promise(resolve => setImmediate(resolve));

function fixture(fetch = async id => wordFor(id), options = {}, start = true) {
  const component = new Function('dataset', 'createKinshipMixin', 'axios', 'PlaySoundButton', 'WordListShowing', 'defaultMessage', 'getWordDetails', script)(
    data, (dataset, loader) => createKinshipMixin(dataset, loader, options),
    { get: async url => ({ data: { word: await fetch(Number(url.split('/').pop())) } }) },
    {}, {}, () => ({}), fetch,
  );
  const mixin = component.mixins[0];
  const vm = { ...mixin.data(), ...(component.data ? component.data() : {}) };
  Object.entries({ ...mixin.methods, ...component.methods }).forEach(([name, method]) => { vm[name] = method.bind(vm); });
  Object.entries({ ...mixin.computed, ...component.computed }).forEach(([name, getter]) => Object.defineProperty(vm, name, { get: () => getter.call(vm) }));
  const initial = start ? mixin.created.call(vm) : Promise.resolve();
  return { vm, component, mixin, initial };
}
const chooseRole = (vm, name) => {
  const item = vm.calculatorView.candidates.find(candidate => candidate.roleId === role(name));
  assert.ok(item, 'Missing candidate ' + name);
  return vm.chooseCandidate(item.candidateId);
};
const walk = (vm, fields) => fields.forEach(field => {
  assert.ok(vm.calculatorView.current, 'Unexpected pending branch before ' + field);
  vm.advance(field);
  assert.notEqual(vm.session.status, 'unsupported', field + ': ' + vm.session.diagnostic);
});

test('long explanations are opt-in while the contribution entry remains visible', async () => {
  const { vm, initial } = fixture();
  await initial;
  assert.equal(vm.helpOpen, false);
  assert.ok(source.includes('v-if="helpOpen"'));
  assert.ok(source.includes('aria-label="计算说明"'));
  if (web) {
    assert.equal(vm.contributionHelpOpen, false);
    assert.ok(source.includes('v-if="contributionHelpOpen"'));
  } else {
    assert.ok(source.includes(':compact="true"'));
    const list = fs.readFileSync(path.join(root, 'src/components/WordListShowing.vue'), 'utf8');
    const script = list.match(/<script>([\s\S]*?)<\/script>/)[1]
      .replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
      .replace('export default', 'return');
    const component = new Function('toWordPage', 'toTuxiaochaoPage', script)(() => {}, () => {});
    assert.equal(component.props.compact.default, false, 'Unrelated word-list pages must retain their original layout');
    assert.equal(component.data().contributionHelpOpen, false);
    assert.ok(list.includes('showContributionInvitation && contributionHelpOpen'));
  }
});

test('compact identity hints remain specific and only repeat on revisiting a person', async () => {
  const { vm, initial } = fixture();
  await initial;
  assert.equal(vm.identityNote, '');
  vm.advance('xiong');
  assert.equal(vm.identityNote, '', 'Do not repeat an identity description for a newly visited person');
  walk(vm, ['zi', 'fa']);
  assert.ok(vm.identityNote.includes('1'));
  vm.clearCalculator();
  walk(vm, ['xiong', 'xiong', 'xiong', 'di']);
  const brothers = vm.calculatorView.candidates.filter(item => item.roleId === role('兄亲'));
  assert.equal(new Set(brothers.map(item => vm.candidateHint(item))).size, 3);
});

test('actual component initializes unknown sex and loads the flat dictionary word', async () => {
  const options = [];
  const f = fixture(async (id, config) => { options.push(config); return wordFor(id); });
  await f.initial;
  assert.equal(f.vm.session.context.sex, 'unknown');
  assert.equal(f.vm.calculatorView.path.length, 0);
  assert.equal(f.vm.words[0].id, 1966);
  assert.equal(f.vm.words[0].word, '家己');
  assert.equal(typeof f.vm.words[0].word, 'string', 'Nested API envelope escaped into the view');
  assert.equal(f.vm.words[0].status, 'bound');
  assert.ok(f.vm.modelNotice.includes('义亲、继亲'));
  if (!web) assert.deepEqual(options, [{ background: true }], 'Local word loading must not mask the calculator');
});

test('component methods preserve known parent identity along the actual corpus', async () => {
  const { vm, initial } = fixture();
  await initial;
  vm.advance('xiong');
  const brother = vm.calculatorView.current.personToken;
  walk(vm, ['zi', 'fa']);
  assert.equal(vm.calculatorView.current.personToken, brother);
  assert.equal(vm.calculatorView.current.roleId, role('兄亲'));
  assert.equal(vm.calculatorView.path.length, 3);
});

test('choice does not add a step; back restores the selected prior branch', async () => {
  const { vm, initial } = fixture();
  await initial;
  walk(vm, ['fa', 'zi']);
  assert.equal(vm.calculatorView.pendingChoice, true);
  assert.ok(vm.calculatorView.buttons.every(button => !button.enabled));
  const before = vm.session.path;
  vm.advance('fa');
  assert.equal(vm.session.diagnostic, 'choose-current-candidate');
  assert.deepEqual(vm.session.path, before);
  vm.chooseCandidate('兄亲');
  assert.equal(vm.session.status, 'invalidSelection');
  chooseRole(vm, '兄亲');
  const selected = vm.calculatorView.current;
  const graph = JSON.stringify(selected.graph);
  assert.equal(vm.calculatorView.path.length, 2);
  vm.advance('zi');
  assert.equal(vm.calculatorView.path.length, 3);
  vm.goBack();
  assert.equal(vm.calculatorView.path.length, 2);
  assert.equal(vm.calculatorView.current.personToken, selected.personToken);
  assert.equal(JSON.stringify(vm.calculatorView.current.graph), graph);
  vm.goBack();
  assert.equal(vm.calculatorView.path.length, 1);
  assert.equal(vm.calculatorView.current.roleId, role('父亲'));
});

test('equally named known people are distinguished by first appearance steps', async () => {
  const { vm, initial } = fixture();
  await initial;
  walk(vm, ['xiong', 'xiong', 'xiong', 'di']);
  const brothers = vm.calculatorView.candidates.filter(item => item.roleId === role('兄亲'));
  assert.equal(brothers.length, 3);
  assert.equal(new Set(brothers.map(item => item.candidateId)).size, 3);
  assert.equal(new Set(brothers.map(item => item.identityHint)).size, 3);
  assert.deepEqual(brothers.filter(item => item.firstSeenStep !== null).map(item => item.firstSeenStep).sort(), [1, 2]);
  assert.ok(brothers.some(item => item.identityHint.includes('其他可能')));
  const firstBrother = brothers.find(item => item.firstSeenStep === 1);
  vm.chooseCandidate(firstBrother.candidateId);
  assert.ok(vm.calculatorView.selectedIdentityHint.includes('第1步'));
  vm.advance('zi');
  vm.goBack();
  assert.ok(vm.calculatorView.selectedIdentityHint.includes('第1步'), 'Undo lost the selected identity explanation');
});

test('known mother binding enables a button even when the static edge is null', async () => {
  const { vm, initial } = fixture();
  await initial;
  walk(vm, ['fa', 'fa', 'jie', 'zi']);
  chooseRole(vm, '表叔父');
  const node = data.nodes.find(item => item.id === role('表叔父'));
  assert.equal(node.relations.mu, null);
  assert.equal(vm.calculatorView.buttons.find(button => button.field === 'mu').enabled, true);
  vm.advance('mu');
  assert.equal(vm.calculatorView.current.roleId, role('姑祖母'));
});

test('a single known candidate with incomplete coverage requires explicit choice', async () => {
  const { vm, initial } = fixture();
  await initial;
  walk(vm, ['mu', 'fa', 'xiong', 'di']);
  assert.equal(vm.calculatorView.candidates.length, 1);
  assert.equal(vm.calculatorView.pendingChoice, true);
  assert.equal(vm.calculatorView.current, null);
  assert.ok(vm.calculatorView.coverageNotice.includes('可能还有'));
  const candidate = vm.calculatorView.candidates[0];
  vm.chooseCandidate(candidate.candidateId);
  assert.equal(vm.calculatorView.current.roleId, role('外祖父'));
  assert.ok(vm.calculatorView.coverageNotice.includes('可能还有'));
  assert.equal(vm.calculatorView.path.at(-1).partial, true);
  vm.advance('zi');
  assert.equal(vm.calculatorView.path[3].partial, true, 'Coverage history vanished after moving on');
});

test('unknown explicit sex branches conditionally and does not silently save inferred sex', async () => {
  const { vm, initial } = fixture();
  await initial;
  walk(vm, ['zi', 'fa']);
  assert.equal(vm.calculatorView.pendingChoice, true);
  assert.ok(vm.calculatorView.candidates.every(item => item.condition.includes('己身')));
  chooseRole(vm, '己身');
  assert.equal(vm.calculatorView.explicitSex, 'unknown');
  assert.equal(vm.calculatorView.inferredSex, 'male');
  assert.ok(vm.calculatorView.inferenceNotice.includes('未被更改'));
  vm.clearCalculator();
  assert.equal(vm.calculatorView.inferredSex, 'unknown');
  assert.equal(vm.calculatorView.path.length, 0);
  vm.setSex('female');
  assert.equal(vm.calculatorView.path.length, 0);
  walk(vm, ['zi', 'mu']);
  assert.equal(vm.calculatorView.current.roleId, role('己身'));
  vm.setSex('male');
  assert.equal(vm.calculatorView.path.length, 0);
  assert.equal(vm.session.history.length, 0);
  assert.equal(vm.calculatorView.explicitSex, 'male');
});

test('root back, fifteen-step limit, and unsupported action keep usable state', async () => {
  const { vm, initial } = fixture();
  await initial;
  vm.goBack();
  assert.equal(vm.calculatorView.path.length, 0);
  for (let depth = 0; depth < 15; depth++) vm.advance('xiong');
  assert.equal(vm.calculatorView.path.length, 15);
  assert.equal(vm.calculatorView.atLimit, true);
  vm.advance('xiong');
  assert.equal(vm.session.status, 'limit');
  assert.equal(vm.calculatorView.path.length, 15);
  assert.ok(vm.calculatorView.diagnostic.includes('上限'));
  vm.goBack();
  assert.equal(vm.calculatorView.path.length, 14);
  const before = vm.calculatorView.current;
  vm.advance('adoptive-father');
  assert.equal(vm.session.status, 'unsupported');
  assert.equal(vm.calculatorView.current.personToken, before.personToken);
  assert.equal(vm.calculatorView.path.length, 14);
  vm.clearCalculator();
  assert.equal(vm.calculatorView.path.length, 0);
});

test('rolePending is a status, never a submitted dialect word or dictionary request', async () => {
  const calls = [];
  const { vm, initial } = fixture(async id => { calls.push(id); return wordFor(id); });
  await initial;
  walk(vm, ['zi', 'nv']);
  await tick();
  const previous = calls.length;
  vm.advance('zi');
  await tick();
  assert.equal(calls.length, previous);
  assert.equal(vm.calculatorView.roleLabel, '曾外孙');
  assert.equal(vm.words[0].status, 'rolePending');
  assert.equal(vm.words[0].id, null);
  assert.equal(vm.words[0].word, '方言称谓待核定');
  assert.equal(vm.words[0].rolePending, true);
});

test('missingWord retains the actual lexical form without making an API request', async () => {
  const calls = [];
  const { vm, initial } = fixture(async id => { calls.push(id); return wordFor(id); });
  await initial;
  vm.advance('fu');
  await tick();
  const previous = calls.length;
  vm.advance('xiong');
  await tick();
  assert.equal(calls.length, previous);
  assert.equal(vm.words[0].status, 'missingWord');
  assert.equal(vm.words[0].word, '大伯');
  assert.equal(vm.words[0].id, null);
});

test('component failed dictionary request retains its positive ID and retry recovers', async () => {
  let failing = true;
  const f = fixture(async id => {
    if (failing) throw new Error('API unavailable');
    return wordFor(id);
  });
  await f.initial;
  assert.equal(f.vm.words[0].id, 1966);
  assert.equal(f.vm.words[0].loadError, true);
  assert.equal(f.vm.words[0].status, 'bound');
  assert.equal(f.vm.words[0].word, '家己');
  failing = false;
  await f.vm.retryWords();
  assert.equal(f.vm.words[0].loadError, false);
  assert.equal(f.vm.words[0].word, '家己');
});

test('older requests cannot overwrite the newer selected relation', async () => {
  const pending = new Map();
  const f = fixture(id => new Promise(resolve => pending.set(id, resolve)));
  f.vm.advance('fa');
  pending.get(3494)(wordFor(3494));
  await tick();
  assert.equal(f.vm.words[0].word, '郎罢');
  pending.get(1966)(wordFor(1966));
  await f.initial;
  assert.equal(f.vm.words[0].word, '郎罢');
  assert.equal(f.vm.words[0].id, 3494);
});

test('destroy, unmount and page unload all cancel ownership of outstanding requests', async () => {
  for (const hook of ['beforeDestroy', 'beforeUnmount', 'onUnload']) {
    let resolve;
    const f = fixture(() => new Promise(done => { resolve = done; }));
    f.mixin[hook].call(f.vm);
    resolve(wordFor(1966));
    await f.initial;
    assert.deepEqual(f.vm.words, []);
    assert.equal(f.vm.disposed, true);
    const session = f.vm.session;
    f.vm.advance('fa');
    assert.equal(f.vm.session, session);
  }
});

test('term loader preserves order and state metadata under mixed success and failure', async () => {
  const rows = [
    { termId: 'one', word: '一', id: 1, status: 'bound', usage: 'unknown' },
    { termId: 'pending', word: '方言称谓待核定', id: null, status: 'rolePending', usage: 'unknown' },
    { termId: 'two', word: '二', id: 2, status: 'bound', usage: 'unknown' },
  ];
  const result = await loadKinshipTerms(rows, async id => {
    if (id === 2) throw new Error('unavailable');
    await tick();
    return { word: '加载一', id: 99, status: 'missingWord', usage: 'address' };
  });
  assert.deepEqual(result.map(item => item.termId), ['one', 'pending', 'two']);
  assert.equal(result[0].id, 1);
  assert.equal(result[0].usage, 'unknown');
  assert.equal(result[0].status, 'bound');
  assert.equal(result[2].id, 2);
  assert.equal(result[2].loadError, true);
});

test('button preview and projection do not mutate the engine session or canonical data', () => {
  const model = createKinshipViewModel(data);
  const session = model.engine.createSession();
  const state = JSON.stringify(session);
  const canonical = JSON.stringify(data);
  for (let index = 0; index < 3; index++) model.project(session);
  assert.equal(JSON.stringify(session), state);
  assert.equal(JSON.stringify(data), canonical);
});

test('template binds identity IDs, actual disabled controls and always-visible contribution invitation', () => {
  assert.ok(source.includes('item.candidateId'));
  assert.ok(source.includes('chooseCandidate(item.candidateId)'));
  assert.ok(!source.includes('top.relations'));
  assert.ok(source.includes(':disabled="!item.enabled"'));
  assert.ok(source.includes('step.partial'));
  assert.ok(source.includes('calculatorView.pendingChoice'));
  assert.ok(source.includes('identityNote'));
  if (web) {
    assert.ok(source.includes("name: 'WordCreate'"));
    assert.ok(source.includes('不会自动更新计算结果'));
    assert.ok(source.includes('item.loadError'));
  } else {
    assert.ok(source.includes(':show-contribution-invitation="true"'));
    assert.ok(source.includes(':show-empty-state="false"'));
    const list = fs.readFileSync(path.join(root, 'src/components/WordListShowing.vue'), 'utf8');
    assert.ok(list.includes('更多说法'));
    assert.ok(list.includes('不会自动更新计算结果'));
    assert.ok(list.includes('item.loadError'));
    assert.ok(list.includes('@tap="$emit(\'retry\')"'));
  }
});
