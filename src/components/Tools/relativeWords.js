// Keep declared order and preserve readable entries when the API is unavailable.
export default async function loadRelativeWords (words, fetchWord) {
  return Promise.all(words.map(async item => {
    if (!item.id) return { ...item, id: null, rolePending: item.status === 'rolePending' || item.word.includes('兴化语称谓待核') }
    try {
      return await fetchWord(item.id)
    } catch (error) {
      return { ...item, loadError: true, definition: '词条暂时无法加载，请稍后重试。' }
    }
  }))
}
