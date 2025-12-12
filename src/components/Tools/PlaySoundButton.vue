<template>
  <span>
    <!-- Pinyin button: show if pinyin provided and (showBothButtons or no ipa) -->
    <a-button
      v-if="pinyin && (!ipa || showBothButtons)"
      :disabled="!pinyinSource"
      icon="sound"
      size="small"
      type="link"
      @click="playSound(pinyinSource,'拼音')"
    />
    <!-- IPA button: show if ipa provided -->
    <a-button
      v-if="ipa"
      :disabled="!ipaSource"
      icon="sound"
      size="small"
      type="link"
      @click="playSound(ipaSource,'IPA')"
    />
    <!-- Fallback button: show only when neither ipa nor pinyin provided, but url or fallback exists -->
    <a-button
      v-if="!ipa && !pinyin"
      :disabled="!source"
      icon="sound"
      size="small"
      type="link"
      @click="playSound(source,'url')"
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
    // Source for IPA button: exact IPA match or fallback
    ipaSource () {
      if (this.ipa_url) return this.ipa_url
      if (this.fallback_url) return this.fallback_url
      return ''
    },
    // Source for Pinyin button: exact pinyin match only
    pinyinSource () {
      return this.pinyin_url || ''
    },
    // Show only one button if both would play the same audio
    showBothButtons () {
      // If no pinyin provided, only show IPA button
      if (!this.pinyin) return false
      // If no ipa provided, only show Pinyin button  
      if (!this.ipa) return false
      // If both sources are the same, show only one
      if (this.pinyinSource && this.ipaSource && this.pinyinSource === this.ipaSource) return false
      return true
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
      // Fetch fallback if IPA was requested but no exact match found
      // This allows IPA button to fall back to first available pronunciation
      if ((!this.url || this.url === 'null') &&
          !this.pendingRequests.ipa && !this.pendingRequests.pinyin &&
          this.ipa && !this.ipa_url && this.wordId) {
        this.fetchFallback()
      }
      // Also fetch fallback if neither ipa nor pinyin provided
      else if ((!this.url || this.url === 'null') &&
          !this.pendingRequests.ipa && !this.pendingRequests.pinyin &&
          !this.ipa && !this.pinyin && this.wordId) {
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
      if (!url) return
      
      // Check if playing fallback audio
      if (url === this.fallback_url) {
        const ipaInfo = this.fallback_ipa ? `（IPA: ${this.fallback_ipa}）` : ''
        this.$message.warning(`该词条没有与标准IPA完全匹配的录音，当前播放的是其他已有录音${ipaInfo}`)
      }
      // Check if this is generated audio (not direct url)
      else if (url !== this.url && type !== 'url') {
        this.$message.warning(`该语音由程序根据${type}生成，仅供参考！（可能存在错误）`)
      }
      
      new Audio(url).play()
    }
  }
}
</script>

<style scoped>

</style>
