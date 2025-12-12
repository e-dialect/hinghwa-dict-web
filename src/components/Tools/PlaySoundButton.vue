<template>
  <span>
    <a-button
      :disabled="!source"
      icon="sound"
      size="small"
      type="link"
      @click="playSound(source, currentType)"
    />
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
  name: 'PlaySoundButton',
  data () {
    return {
      pinyin_url: '',
      ipa_url: '',
      fallback_url: '',
      fallback_ipa: '',
      fallbackPromise: null,
      pendingRequests: {
        ipa: false,
        pinyin: false
      }
    }
  },
  computed: {
    source () {
      if (this.url && this.url !== 'null') return this.url
      if (this.ipa_url) return this.ipa_url
      if (this.pinyin_url) return this.pinyin_url
      if (this.fallback_url) return this.fallback_url
      return ''
    },
    currentType () {
      if (this.url && this.url !== 'null') return 'url'
      if (this.ipa_url) return 'IPA'
      if (this.pinyin_url) return '拼音'
      if (this.fallback_url) return 'fallback'
      return 'none'
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
      // Only fetch fallback if no exact matches found, no requests pending, and no direct url provided
      if ((!this.url || this.url === 'null') &&
          !this.pendingRequests.ipa && !this.pendingRequests.pinyin &&
          !this.ipa_url && !this.pinyin_url && this.wordId) {
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
              this.fallback_ipa = firstPronunciation.pronunciation.ipa || ''
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
      if (type === 'fallback') {
        const ipaInfo = this.fallback_ipa ? `（IPA: ${this.fallback_ipa}）` : ''
        this.$message.warning(`该词条没有与标准IPA完全匹配的录音，当前播放的是其他已有录音${ipaInfo}`)
      } else if (type !== 'url' && type !== 'none') {
        this.$message.warning(`该语音由程序根据${type}生成，仅供参考！（可能存在错误）`)
      }
      new Audio(url).play()
    }
  }
}
</script>

<style scoped>

</style>
