import { createKinshipEngine } from './engine.mjs'
import { toEngineDataset } from './adapter.mjs'

export const SEX_OPTIONS = [
  { value: 'unknown', label: '未指定' },
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' }
]
export const MODEL_NOTICE = '按同父母的兄弟姊妹、两名父母计算；已知当前配偶视作子女共同父母。义亲、继亲、异父母同胞、婚姻变更等关系暂不支持。图中未收录的关系也可能存在，称谓用法仍待校订。'
export const CONTRIBUTION_NOTICE = '你还有更多说法，或想把纸面说法整理成正式词条？欢迎补充词条。投稿目前仅进入词库，审核后还需维护者手动关联亲戚计算器，不会自动更新计算结果。'

const SEX_LABEL = { male: '男性', female: '女性', unknown: '未指定' }
const DIAGNOSTICS = {
  'choose-current-candidate': '请先选择具体人物，再继续计算。',
  'max-depth': '关系层数已达到上限，请撤销或清空后继续。',
  'candidate-not-current': '这个候选已不属于当前步骤，请重新选择。',
  'non-person-relation': '该记录是合称或不支持的关系，不能作为具体人物继续计算。',
  'multiple-unknown-parents': '当前有多名身份未确定的父母，无法据此推导。',
  'dataset-version-mismatch': '关系数据版本已变化，请清空后重新计算。',
  'unknown-field': '暂不支持这种关系。',
  'unknown-action': '暂不支持这种操作。',
  'no-supported-consistent-relation': '当前关系图及已选条件无法继续这一步；保留上一步结果。'
}

export function createKinshipViewModel (data, options = {}) {
  const engine = createKinshipEngine(toEngineDataset(data), options)
  const nodes = new Map(data.nodes.map(node => [node.id, node]))
  const terms = new Map(data.terms.map(term => [term.id, term]))
  const bindings = new Map(data.bindings.map(binding => [binding.id, binding]))
  const fields = new Map(data.fields.map(field => [field.key, field]))

  function firstAppearance (session, candidate) {
    for (const snapshot of [...session.history, session]) {
      const person = engine.selected(snapshot)
      if (person && person.personToken === candidate.personToken && person.roleId === candidate.roleId) {
        return {
          step: snapshot.path.length,
          path: snapshot.path.map(item => fields.get(item.field)?.label || item.field).join(' → '),
          label: person.label
        }
      }
    }
    return null
  }

  function projectTerms (node) {
    return node.termIds.map(termId => {
      const term = terms.get(termId)
      const binding = term.bindingId === null ? null : bindings.get(term.bindingId)
      return {
        termId: term.id,
        status: term.status,
        usage: term.usage,
        roleLabel: node.label,
        word: term.status === 'rolePending' ? '方言称谓待核定' : term.text,
        id: binding ? binding.wordId : null,
        definition: term.displayDefinition || (term.status === 'rolePending'
          ? '此处只确认关系角色，尚未确认兴化语称谓。欢迎提供有来源的实际说法。'
          : term.status === 'missingWord' ? '已有方言词形，词库对应词条仍待确认。' : ''),
        rolePending: term.status === 'rolePending'
      }
    })
  }

  function project (session) {
    const current = engine.selected(session)
    const node = current ? nodes.get(current.roleId) : null
    const pendingChoice = current === null
    const candidates = session.candidates.map(candidate => {
      const appearance = firstAppearance(session, candidate)
      const sameRole = session.candidates.filter(item => item.roleId === candidate.roleId).length > 1
      const known = candidate.reason.startsWith('known-')
      const identityHint = appearance
        ? appearance.step === 0 ? '起点的己身'
          : '此前第' + appearance.step + '步（' + appearance.path + '）的' + appearance.label
        : known ? '此前关系已确定的这位人物'
          : sameRole ? '其他可能的同称人物' : '关系图中的可能人物'
      return {
        candidateId: candidate.candidateId,
        roleId: candidate.roleId,
        label: candidate.label,
        identityHint,
        firstSeenStep: appearance?.step ?? null,
        condition: session.context.sex === 'unknown' && candidate.egoSex !== 'unknown'
          ? '此分支要求己身为' + SEX_LABEL[candidate.egoSex] : '',
        reason: candidate.reason
      }
    })
    const buttons = data.fields.map(field => {
      const preview = pendingChoice ? null : engine.reduce(session, { type: 'advance', field: field.key })
      const enabled = Boolean(preview && preview.path.length > session.path.length)
      return {
        field: field.key,
        label: field.label,
        enabled,
        hint: enabled ? '' : pendingChoice ? '请先选择人物'
          : DIAGNOSTICS[preview?.diagnostic] || '当前条件暂不支持这条关系'
      }
    })
    return {
      current,
      selectedIdentityHint: current ? candidates.find(candidate => candidate.candidateId === current.candidateId)?.identityHint || '' : '',
      roleLabel: node?.label || '',
      roleNote: node?.note || '',
      terms: node ? projectTerms(node) : [],
      pendingChoice,
      candidates,
      buttons,
      path: session.path.map((step, index) => ({ index, field: step.field, label: fields.get(step.field)?.legacyName || step.field, partial: Boolean(step.hasUnlistedPossibilities) })),
      explicitSex: session.context.sex,
      inferredSex: current?.egoSex || 'unknown',
      inferenceNotice: session.context.sex === 'unknown' && current?.egoSex && current.egoSex !== 'unknown'
        ? '当前分支推断己身为' + SEX_LABEL[current.egoSex] + '；未指定的性别设置未被更改。' : '',
      diagnostic: session.diagnostic ? DIAGNOSTICS[session.diagnostic] || '当前条件暂不支持这一步。' : '',
      atLimit: session.path.length >= engine.maxDepth,
      maxDepth: engine.maxDepth,
      coverageNotice: session.hasUnlistedPossibilities
        ? '仅列出路径中已知人物，可能还有未收录关系。' + (pendingChoice ? '请选择后再继续。' : '') : ''
    }
  }
  return { engine, project }
}

export async function loadKinshipTerms (items, fetchWord) {
  return Promise.all(items.map(async item => {
    if (item.status !== 'bound') return { ...item }
    try {
      const word = await fetchWord(item.id)
      if (!word || typeof word.word !== 'string') throw new Error('Invalid word response')
      return { ...item, ...word, termId: item.termId, id: item.id, status: item.status, usage: item.usage, loadError: false }
    } catch (error) {
      return { ...item, loadError: true, definition: '词条暂时无法加载，请稍后重试。' }
    }
  }))
}
