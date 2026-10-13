const FIELDS = ['fa', 'mu', 'xiong', 'di', 'jie', 'mei', 'fu', 'qi', 'zi', 'nv']
const ID = /^[a-z][a-z0-9-]*$/
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)

export function validateDataset (data, roleIds) {
  const errors = []
  const check = (condition, message) => { if (!condition) errors.push(message) }
  const text = value => typeof value === 'string' && value.trim().length > 0
  const keys = (value, required, optional, where) => {
    if (!object(value)) { errors.push(where + ': expected object'); return false }
    required.forEach(key => check(Object.hasOwn(value, key), where + ': missing ' + key))
    Object.keys(value).forEach(key => check([...required, ...optional].includes(key), where + ': unknown field ' + key))
    return true
  }
  if (!keys(data, ['schemaVersion', 'datasetVersion', 'selfId', 'fields', 'sources', 'nodes', 'terms', 'bindings'], [], 'dataset')) return errors
  check(data.schemaVersion === '1.0.0', 'Unsupported schemaVersion')
  check(text(data.datasetVersion), 'datasetVersion required')
  for (const key of ['fields', 'sources', 'nodes', 'terms', 'bindings']) check(Array.isArray(data[key]) && data[key].length > 0, key + ': nonempty array required')
  if (errors.length) return errors
  const index = (items, name) => {
    const result = new Map()
    items.forEach((item, i) => {
      check(object(item) && text(item.id) && ID.test(item.id), name + '[' + i + ']: invalid ID')
      if (!object(item)) return
      check(!result.has(item.id), name + ': duplicate ID ' + item.id)
      result.set(item.id, item)
    })
    return result
  }
  const sources = index(data.sources, 'source')
  const nodes = index(data.nodes, 'node')
  const terms = index(data.terms, 'term')
  const bindings = index(data.bindings, 'binding')
  const provenance = (value, where) => {
    check(Array.isArray(value) && value.length > 0, where + ': provenance required')
    if (Array.isArray(value)) {
      check(new Set(value).size === value.length, where + ': duplicate provenance')
      value.forEach(id => check(sources.has(id), where + ': missing provenance source ' + id))
    }
  }
  check(nodes.has(data.selfId), 'Missing selfId role')
  check(data.fields.length === FIELDS.length, 'Exactly ten relation fields required')
  check(new Set(data.fields.map(field => field?.key)).size === FIELDS.length, 'Duplicate relation fields')
  data.fields.forEach((field, i) => {
    if (!keys(field, ['key', 'label', 'legacyName'], [], 'field')) return
    check(field.key === FIELDS[i], 'Relation field order/key changed')
    check(text(field.label) && text(field.legacyName), 'Field labels required')
  })
  data.sources.forEach(source => {
    if (!keys(source, ['id', 'kind', 'title', 'scope'], ['uri'], 'source')) return
    check(['legacy', 'chart', 'databaseSnapshot', 'inference'].includes(source.kind), 'Invalid source kind')
    check(text(source.title) && text(source.scope), 'Source title/scope required')
    if (source.uri !== undefined) check(typeof source.uri === 'string' && /^https:\/\//.test(source.uri), 'Source URI must be HTTPS')
  })
  const labels = new Set()
  data.nodes.forEach(node => {
    if (!keys(node, ['id', 'label', 'legacyName', 'sex', 'kind', 'relations', 'termIds', 'provenance'], ['note'], 'node')) return
    check(text(node.label), 'Blank role display label ' + node.id)
    check(text(node.legacyName) && !labels.has(node.legacyName), 'Duplicate/blank legacy role alias ' + node.legacyName)
    labels.add(node.legacyName)
    check(['male', 'female', 'unknown'].includes(node.sex), 'Invalid role sex ' + node.id)
    check(['person', 'collective', 'unsupported'].includes(node.kind), 'Invalid role kind ' + node.id)
    if (node.note !== undefined) check(text(node.note), 'Empty role note ' + node.id)
    provenance(node.provenance, node.id)
    check(Array.isArray(node.termIds) && node.termIds.length > 0, node.id + ': termIds required')
    if (Array.isArray(node.termIds)) {
      check(new Set(node.termIds).size === node.termIds.length, node.id + ': duplicate term reference')
      node.termIds.forEach(id => check(terms.has(id), node.id + ': missing term ' + id))
    }
    if (!keys(node.relations, FIELDS, [], node.id + '.relations')) return
    FIELDS.forEach(field => {
      const value = node.relations[field]
      if (value === null) return
      const targets = typeof value === 'string' ? [value] : value
      check(Array.isArray(targets) && targets.length > 0, node.id + '.' + field + ': invalid target shape')
      if (!Array.isArray(targets)) return
      check(new Set(targets).size === targets.length, node.id + '.' + field + ': duplicate target')
      targets.forEach(id => check(typeof id === 'string' && nodes.has(id), node.id + '.' + field + ': missing target ' + id))
    })
  })
  data.terms.forEach(term => {
    if (!keys(term, ['id', 'text', 'status', 'usage', 'bindingId', 'provenance'], ['displayDefinition'], 'term')) return
    check(text(term.text), term.id + ': blank term')
    check(['bound', 'missingWord', 'rolePending'].includes(term.status), term.id + ': invalid term status')
    check(term.usage === 'unknown', term.id + ': usage must remain unknown until reviewed')
    provenance(term.provenance, term.id)
    if (term.displayDefinition !== undefined) check(text(term.displayDefinition), term.id + ': blank displayDefinition')
    if (term.status === 'bound') {
      const binding = bindings.get(term.bindingId)
      check(Boolean(binding), term.id + ': missing binding')
      if (binding) check(binding.snapshotWord === term.text, term.id + ': binding word mismatch')
    } else {
      check(term.bindingId === null, term.id + ': pending term cannot bind a database word')
    }
    if (term.status === 'rolePending') check(term.text.includes('（兴化语称谓待核）'), term.id + ': role placeholder must be explicit')
    if (term.status === 'missingWord') check(!term.text.includes('（兴化语称谓待核）'), term.id + ': role placeholder cannot count as a missing dialect word')
  })
  data.bindings.forEach(binding => {
    if (!keys(binding, ['id', 'namespace', 'wordId', 'snapshotWord', 'status', 'provenance'], [], 'binding')) return
    check(binding.namespace === 'hinghwa-word', 'Invalid binding namespace')
    check(Number.isInteger(binding.wordId) && binding.wordId > 0, 'Invalid database word ID')
    check(binding.id === 'hinghwa-word-' + binding.wordId, 'Binding ID does not match namespace/wordId')
    check(text(binding.snapshotWord), 'Binding snapshotWord required')
    check(binding.status === 'snapshotExactMatch', 'Binding must state its snapshot verification scope')
    provenance(binding.provenance, binding.id)
  })
  const referencedTerms = new Set(data.nodes.flatMap(node => Array.isArray(node?.termIds) ? node.termIds : []))
  terms.forEach((term, id) => check(referencedTerms.has(id), 'Unreferenced term ' + id))
  const referencedBindings = new Set(data.terms.map(term => term?.bindingId).filter(Boolean))
  bindings.forEach((binding, id) => check(referencedBindings.has(id), 'Unreferenced binding ' + id))
  if (!keys(roleIds, ['schemaVersion', 'description', 'idByLegacyName'], [], 'roleIds')) return errors
  check(roleIds.schemaVersion === data.schemaVersion, 'ID registry schemaVersion mismatch')
  check(text(roleIds.description) && object(roleIds.idByLegacyName), 'Invalid ID registry')
  if (object(roleIds.idByLegacyName)) {
    check(Object.keys(roleIds.idByLegacyName).length === data.nodes.length, 'Frozen ID registry role count mismatch')
    check(new Set(Object.values(roleIds.idByLegacyName)).size === data.nodes.length, 'Frozen ID registry contains duplicate IDs')
    data.nodes.forEach(node => {
      if (object(node)) check(roleIds.idByLegacyName[node.legacyName] === node.id, 'Frozen ID changed for ' + node.legacyName)
    })
  }
  return errors
}
