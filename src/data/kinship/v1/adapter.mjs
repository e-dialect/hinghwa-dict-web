// One adapter shared byte-for-byte by the Vue 2 and uni-app consumers.
export function createLegacyApi (data) {
  const nodeById = new Map(data.nodes.map(node => [node.id, node]))
  const termById = new Map(data.terms.map(term => [term.id, term]))
  const bindingById = new Map(data.bindings.map(binding => [binding.id, binding]))
  const buttons = data.fields.map(field => ({ name: field.label, filed: field.key }))
  const fieldName = Object.fromEntries(data.fields.map(field => [field.key, field.legacyName]))
  const relative = data.nodes.map(node => {
    const result = {
      name: node.legacyName,
      words: node.termIds.map(termId => {
        const term = termById.get(termId)
        const binding = term.bindingId === null ? null : bindingById.get(term.bindingId)
        const word = { word: term.text, id: binding ? binding.wordId : null }
        if (term.displayDefinition !== undefined) word.definition = term.displayDefinition
        return word
      }),
      relations: Object.fromEntries(data.fields.map(field => {
        const target = node.relations[field.key]
        const label = id => nodeById.get(id).legacyName
        return [field.key, Array.isArray(target) ? target.map(label) : target === null ? null : label(target)]
      }))
    }
    if (node.note !== undefined) result.note = node.note
    return result
  })
  const byName = new Map(relative.map(node => [node.name, node]))
  const find = next => byName.get(next) || {
    name: next,
    words: [{ word: `${next}（兴化语称谓待核）`, id: null }],
    relations: Object.fromEntries(data.fields.map(field => [field.key, null]))
  }
  return { buttons, fieldName, relative, find }
}

// Engine input keeps roles and person relations independent from lexical bindings.
export function toEngineDataset (data) {
  return {
    schemaVersion: data.schemaVersion,
    datasetVersion: data.datasetVersion,
    selfId: data.selfId,
    nodes: data.nodes.map(node => ({
      id: node.id,
      label: node.label,
      sex: node.sex,
      kind: node.kind,
      relations: Object.fromEntries(Object.entries(node.relations).map(([field, target]) => [
        field, Array.isArray(target) ? [...target] : target
      ]))
    }))
  }
}
