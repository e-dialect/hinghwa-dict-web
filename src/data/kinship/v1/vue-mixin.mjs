import { createKinshipViewModel, loadKinshipTerms, SEX_OPTIONS, MODEL_NOTICE } from './view-model.mjs'

function selectionKey (session) {
  return session.revision + ':' + (session.selectedCandidateId || '')
}

export function createKinshipMixin (data, fetchWord, options = {}) {
  const model = createKinshipViewModel(data, options)
  return {
    data () {
      return {
        session: Object.freeze(model.engine.createSession()),
        words: [],
        wordLoading: false,
        wordRequest: 0,
        disposed: false
      }
    },
    computed: {
      calculatorView () { return model.project(this.session) },
      sexOptions () { return SEX_OPTIONS },
      modelNotice () { return MODEL_NOTICE }
    },
    created () { return this.refreshWords() },
    beforeDestroy () { this.cancelWords() },
    beforeUnmount () { this.cancelWords() },
    onUnload () { this.cancelWords() },
    methods: {
      cancelWords () {
        this.disposed = true
        this.wordRequest += 1
        this.wordLoading = false
      },
      async refreshWords () {
        const request = ++this.wordRequest
        this.words = []
        const items = this.calculatorView.terms
        this.wordLoading = items.length > 0
        const loaded = await loadKinshipTerms(items, fetchWord)
        if (!this.disposed && request === this.wordRequest) {
          this.words = loaded
          this.wordLoading = false
        }
        return loaded
      },
      dispatch (action) {
        if (this.disposed) return this.session
        const oldKey = selectionKey(this.session)
        const next = model.engine.reduce(this.session, action)
        this.session = Object.freeze(next)
        if (selectionKey(next) !== oldKey) {
          this.wordRequest += 1
          this.words = []
          this.wordLoading = false
          this.refreshWords()
        }
        return next
      },
      advance (field) { return this.dispatch({ type: 'advance', field }) },
      chooseCandidate (candidateId) { return this.dispatch({ type: 'choose', candidateId }) },
      goBack () { return this.dispatch({ type: 'back' }) },
      clearCalculator () { return this.dispatch({ type: 'clear' }) },
      setSex (sex) {
        if (sex === this.session.context.sex) return this.session
        return this.dispatch({ type: 'setContext', context: { sex } })
      },
      retryWords () { return this.refreshWords() }
    }
  }
}
