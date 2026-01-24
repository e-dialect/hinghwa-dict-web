<template>
  <span>
    <span>
      <span>【单】</span>
      <a-button
        :disabled="!pinyinSource"
        icon="sound"
        size="small"
        type="link"
        :loading="pendingRequests.pinyin"
        @click="playSound(pinyinSource,'拼音')"
      />
    </span>
    <span>
      <span>【连】</span>
      <a-button
        :disabled="!ipaSource"
        icon="sound"
        size="small"
        type="link"
        :loading="pendingRequests.ipa"
        @click="playSound(ipaSource,'IPA')"
      />
    </span>

  </span>
</template>

<script>
import axios from 'axios'
export default {
  props:
    {
      url: {
        type: String,
        default: ''
      },
      pinyin: {
        type: String,
        default: ''
      },
      ipa: {
        type: String,
        default: ''
      },
      wordId: {
        type: [String, Number],
        default: null
      }
    },
  name: 'PlayWordSoundButton',
  data () {
    return {
      pinyin_url: '',
      ipa_url: '',
      fallback_url: '',
      fallback_position: '',
      fallbackPromise: null,
      pendingRequests: {
        ipa: false,
        pinyin: false
      }
    }
  },
  computed: {
    // Source for IPA button: exact IPA match or fallback (only if IPA was requested)
    ipaSource () {
      if (this.url && this.url !== 'null') return this.url
      if (this.ipa_url) return this.ipa_url
      if (this.fallback_url && this.fallback_url !== 'null') { return this.fallback_url }
      return ''
    },
    // Source for Pinyin button: exact pinyin match only
    pinyinSource () {
      return this.pinyin_url || ''
    }
  },
  created () {
    this.loadPronunciations()
  },
  watch: {
    pinyin () {
      this.pinyin_url = ''
      this.loadPronunciations()
    },
    ipa () {
      this.ipa_url = ''
      this.loadPronunciations()
    },
    wordId () {
      this.resetFallback()
      this.loadPronunciations()
    }
  },
  methods: {
    loadPronunciations () {
      // Load IPA pronunciation
      if (this.ipa) {
        this.pendingRequests.ipa = true
        axios.get('pronunciation/combine', { params: { ipas: this.ipa } })
          .then(res => {
            this.ipa_url = res.data.url
          })
          .catch(() => {
            this.$message.destroy()
          })
          .finally(() => {
            this.pendingRequests.ipa = false
            this.checkFallback()
          })
      } else {
        this.pendingRequests.ipa = false
      }

      // Load Pinyin pronunciation
      if (this.pinyin) {
        this.pendingRequests.pinyin = true
        axios.get('pronunciation/combine', { params: { pinyins: this.pinyin } })
          .then(res => {
            this.pinyin_url = res.data.url
          })
          .catch(() => {
            this.$message.destroy()
          })
          .finally(() => {
            this.pendingRequests.pinyin = false
            this.checkFallback()
          })
      } else {
        this.pendingRequests.pinyin = false
      }

      // If neither ipa nor pinyin provided, check fallback immediately
      if (!this.ipa && !this.pinyin) {
        this.checkFallback()
      }
    },
    checkFallback () {
      // Common conditions for fetching fallback
      const shouldFetchFallback = (!this.url || this.url === 'null') &&
          !this.pendingRequests.ipa && !this.pendingRequests.pinyin &&
          this.wordId

      if (!shouldFetchFallback) return

      // Fetch fallback if IPA was requested but no exact match found
      // This allows IPA button to fall back to first available pronunciation
      if (this.ipa && !this.ipa_url) {
        this.fetchFallback()
      } else if (!this.ipa && !this.pinyin) {
        // Also fetch fallback if neither ipa nor pinyin provided
        this.fetchFallback()
      }
    },
    fetchFallback () {
      // Return existing promise if fetch already in progress
      if (this.fallbackPromise) return this.fallbackPromise

      if (!this.wordId) return Promise.resolve()

      // Create new promise and store it to prevent duplicate calls
      this.fallbackPromise = axios.get('/pronunciation', { params: { word: this.wordId } })
        .then(res => {
          const pronunciations = res.data.pronunciation
          if (pronunciations && pronunciations.length > 0) {
            const firstPronunciation = pronunciations[0]
            // Add null checks for nested properties
            if (firstPronunciation && firstPronunciation.pronunciation) {
              this.fallback_url = firstPronunciation.pronunciation.source || ''
              this.fallback_position = firstPronunciation.pronunciation.county + firstPronunciation.pronunciation.town || ''
            }
          }
        })
        .catch(() => {
          this.$message.destroy()
        })
        .finally(() => {
          this.fallbackPromise = null
        })

      return this.fallbackPromise
    },
    resetFallback () {
      this.fallback_url = ''
      this.fallback_ipa = ''
      this.fallbackPromise = null
    },
    playSound (url, type) {
      if (!url) return
      if (type === 'IPA' && url === this.fallback_url) {
        this.$message.warning(`当前播放口音来自：${this.fallback_position}`)
      }
      new Audio(url).play()
    }
  }
}
</script>

<style scoped>

</style>
