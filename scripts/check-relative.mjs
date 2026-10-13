import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = fs.existsSync(path.join(root, 'src/components/Tools/relative.js'));
const graphFile = web ? 'src/components/Tools/relative.js' : 'src/services/relative.js';
const helperFile = web ? 'src/components/Tools/relativeWords.js' : 'src/services/relativeWords.js';
const componentFile = web ? 'src/components/Tools/RelativeSelect.vue' : 'src/pages/tools/relative.vue';
const fields = ['fa', 'mu', 'xiong', 'di', 'jie', 'mei', 'fu', 'qi', 'zi', 'nv'];
async function readModule(file) {
  return import('data:text/javascript;base64,' + fs.readFileSync(file).toString('base64'));
}
const graph = await readModule(path.join(root, graphFile));
const names = new Set(graph.relative.map(node => node.name));
assert.equal(names.size, graph.relative.length, 'Duplicate relation node');
let edges = 0;
for (const node of graph.relative) {
  assert.deepEqual(Object.keys(node.relations).sort(), [...fields].sort(), node.name + ': ten relation fields required');
  assert.ok(node.words.length, node.name + ': a readable word or pending label is required');
  for (const word of node.words) {
    assert.ok(word.word.trim(), node.name + ': blank word');
    assert.ok(word.id === null || (Number.isInteger(word.id) && word.id > 0), node.name + ': invalid ID');
  }
  for (const value of Object.values(node.relations)) {
    if (value === null) continue;
    const targets = typeof value === 'string' ? [value] : value;
    assert.ok(Array.isArray(targets) && targets.length, node.name + ': invalid targets');
    assert.equal(new Set(targets).size, targets.length, node.name + ': duplicate target');
    for (const target of targets) {
      assert.ok(names.has(target), node.name + ': missing target ' + target);
      edges += 1;
    }
  }
}
const node = name => graph.find(name);
const walk = (...steps) => steps.reduce((name, field) => {
  const target = node(name).relations[field];
  assert.equal(typeof target, 'string', name + '.' + field + ': ambiguous route');
  return target;
}, '己身');
assert.equal(walk('nv', 'zi', 'xiong', 'fa'), '女婿');
assert.equal(walk('nv', 'nv', 'fu'), '外孙婿');
assert.equal(walk('zi', 'nv', 'fu'), '孙婿');
assert.equal(walk('zi', 'zi', 'qi'), '孙妇');
assert.equal(walk('zi', 'zi', 'nv'), '曾孙女');
assert.equal(walk('qi', 'mei', 'fu'), '姨姊妹夫');
for (const name of ['甥男', '甥女']) {
  assert.deepEqual(node(name).relations.fa, ['姊夫', '妹夫']);
  assert.deepEqual(node(name).relations.mu, ['姊亲', '妹亲']);
}
for (const name of ['表兄弟', '表姊妹']) {
  assert.deepEqual(node(name).relations.fa, ['姑父', '舅父', '姨父']);
  assert.deepEqual(node(name).relations.mu, ['姑母', '舅母', '姨母']);
}
assert.deepEqual(node('曾外孙').relations.fa, '孙婿');
assert.deepEqual(node('曾外孙').relations.mu, '孙女');
for (const [name, word, id] of [
  ['女亲', '婶娘囝', 4820], ['孙女', '孙', 4929], ['孙妇', '孙新妇', 4931],
  ['孙婿', '孙婿', 4930], ['外孙儿', '外头孙', 2440], ['姊夫', '阿丈', 6115],
  ['父亲', '郎罢', 3494], ['母亲', '娘妳', 3956], ['祖母', '阿嬷', 6100],
]) assert.ok(node(name).words.some(item => item.word === word && item.id === id), name + ': verified word missing');
assert.equal(node('舅弟妇').words[0].id, null);
assert.ok(node('曾孙女').words.every(item => item.id === null));
assert.ok(node('曾外孙').words.every(item => item.id === null));
assert.ok(node('伯兄妇').words.every(item => item.id !== 271));
assert.ok(node('叔弟妇').words.every(item => item.id !== 271));
assert.ok(node('男亲').note.includes('排行'));
assert.ok(graph.find('尚未登记关系').words[0].word.includes('待核'));

const { default: loadRelativeWords } = await readModule(path.join(root, helperFile));
const loaded = await loadRelativeWords([{ word: '慢', id: 1 }, { word: '待核', id: null }, { word: '失败', id: 2 }], async id => {
  if (id === 2) throw new Error('unavailable');
  await new Promise(resolve => setTimeout(resolve, 10));
  return { word: '成功', id };
});
assert.deepEqual(loaded.map(item => item.word), ['成功', '待核', '失败']);
assert.equal(loaded[1].id, null);
assert.equal(loaded[2].id, null);
assert.ok(loaded[2].definition.includes('稍后重试'));

let componentSource = fs.readFileSync(path.join(root, componentFile), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
componentSource = componentSource.replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '').replace('export default', 'return');
const pending = new Map();
const fetchWord = id => new Promise(resolve => pending.set(Number(String(id).split('/').pop()), resolve));
const component = new Function('buttons', 'fieldName', 'find', 'relative', 'axios', 'PlaySoundButton', 'WordListShowing', 'defaultMessage', 'getWordDetails', 'loadRelativeWords', componentSource)(
  graph.buttons, graph.fieldName, graph.find, graph.relative, { get: fetchWord }, {}, {}, () => ({}), fetchWord, loadRelativeWords,
);
const context = component.data();
const watcher = component.watch.top.handler;
const older = watcher.call(context, { words: [{ word: '旧', id: 101 }] });
const newer = watcher.call(context, { words: [{ word: '新', id: 102 }] });
const apiWord = id => web ? { data: { word: { id, word: '词' + id, source: '' } } } : { id, word: '词' + id, source: '' };
pending.get(102)(apiWord(102));
await newer;
pending.get(101)(apiWord(101));
await older;
assert.equal(context.words[0].id, 102, 'Older request replaced the current relation');
await watcher.call(context, { words: [{ word: '待核称谓', id: null }] });
assert.equal(context.words[0].word, '待核称谓');
assert.equal(context.words[0].id, null);
component.methods[web ? 'pop' : 'popRelative'].call(context);
assert.equal(context.stack.length, 1, 'Back at initial node underflowed stack');
const pushContext = { ...context, topLength: 2, top: node('己身') };
assert.equal(component.methods[web ? 'push' : 'pushRelative'].call(pushContext, 'fa'), false, 'Ambiguous branch accepted a transition');
if (!web) {
  const listSource = fs.readFileSync(path.join(root, 'src/components/WordListShowing.vue'), 'utf8');
  assert.ok(listSource.includes('v-for="(item,index) in wordList"'), 'Null-ID entries must still render');
  assert.ok(listSource.includes('item.id === null'), 'Pending entry must offer contribution feedback');
}
const peer = process.argv[2];
if (peer) {
  const peerRoot = path.resolve(peer);
  const peerFile = web ? 'src/services/relative.js' : 'src/components/Tools/relative.js';
  const other = await readModule(path.join(peerRoot, peerFile));
  assert.deepEqual(graph.relative, other.relative, 'Frontend graphs differ');
  assert.deepEqual(graph.buttons, other.buttons);
  assert.deepEqual(graph.fieldName, other.fieldName);
}
console.log(JSON.stringify({ nodes: graph.relative.length, edges, semanticChecks: 'passed', asyncAndPendingChecks: 'passed', peerConsistency: peer ? 'passed' : 'not requested' }));
