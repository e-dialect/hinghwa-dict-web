<template>
  <span>
    <a-button
      v-if="source&&source!==url&&pinyin_url"
      icon="sound"
      size="small"
      type="link"
      @click="playSound(pinyin_url,'拼音')"
    />
    <a-button
      v-if="source&&source!==url&&ipa_url"
      icon="sound"
      size="small"
      type="link"
      @click="playSound(ipa_url,'IPA')"
    />
    <a-button
      v-if="source===url||!source"
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
      fallbackFetched: false
    }
  },
  computed: {
    source () {
      if (this.url && this.url !== 'null') return this.url
      if (this.ipa_url) return this.ipa_url
      if (this.pinyin_url) return this.pinyin_url
      if (this.fallback_url) return this.fallback_url
      return ''
    }
  },
  created () {
    this.pinyin_url = ''
    this.ipa_url = ''
    this.fallback_url = ''
    this.fallback_ipa = ''
    if (this.ipa) {
      axios.get('pronunciation/combine', { params: { ipas: this.ipa } }).then(res => {
        this.ipa_url = res.data.url
      }).catch(() => {
        this.$message.destroy()
        this.fetchFallback()
      })
    }
    if (this.pinyin) {
      axios.get('pronunciation/combine', { params: { pinyins: this.pinyin } }).then(res => {
        this.pinyin_url = res.data.url
      }).catch(() => {
        this.$message.destroy()
        if (!this.ipa) {
          this.fetchFallback()
        }
      })
    }
    // If neither ipa nor pinyin is provided but wordId exists, try fetching fallback
    if (!this.ipa && !this.pinyin && this.wordId) {
      this.fetchFallback()
    }
  },
  watch: {
    pinyin () {
      this.pinyin_url = ''
      if (this.pinyin) {
        axios.get('pronunciation/combine', { params: { pinyins: this.pinyin } }).then(res => {
          this.pinyin_url = res.data.url
        }).catch(() => {
          this.$message.destroy()
          if (!this.ipa) {
            this.fetchFallback()
          }
        })
      }
    },
    ipa () {
      this.ipa_url = ''
      if (this.ipa) {
        axios.get('pronunciation/combine', { params: { ipas: this.ipa } }).then(res => {
          this.ipa_url = res.data.url
        }).catch(() => {
          this.$message.destroy()
          this.fetchFallback()
        })
      }
    },
    wordId () {
      this.fallbackFetched = false
      if (this.wordId && !this.ipa_url && !this.pinyin_url) {
        this.fetchFallback()
      }
    }
  },
  methods: {
    fetchFallback () {
      if (!this.wordId || this.fallbackFetched) return
      
      this.fallbackFetched = true
      // Fetch all pronunciations for this word
      axios.get('/pronunciation', { params: { word: this.wordId } }).then(res => {
        const pronunciations = res.data.pronunciation
        if (pronunciations && pronunciations.length > 0) {
          // Get the first available pronunciation
          const firstPronunciation = pronunciations[0]
          this.fallback_url = firstPronunciation.pronunciation.source
          this.fallback_ipa = firstPronunciation.pronunciation.ipa
        }
      }).catch(() => {
        this.$message.destroy()
      })
    },
    playSound (url, word) {
      if (url === this.fallback_url) {
        this.$message.warning(`该词条没有与标准IPA完全匹配的录音，当前播放的是其他已有录音（IPA: ${this.fallback_ipa}）`)
      } else if (url !== this.url) {
        this.$message.warning(`该语音由程序根据${word}生成，仅供参考！（可能存在错误）`)
      }
      new Audio(url).play()
    }
  }
}
</script>

<style scoped>

</style>
