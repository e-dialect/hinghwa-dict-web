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
      }
    },
  name: 'PlaySoundButton',
  data () {
    return {
      pinyin_url: '',
      ipa_url: ''
    }
  },
  computed: {
    source () {
      if (this.url && this.url !== 'null') return this.url
      if (this.ipa_url) return this.ipa_url
      if (this.pinyin_url) return this.pinyin_url
      return ''
    }
  },
  created () {
    this.pinyin_url = ''
    this.ipa_url = ''
    if (this.ipa) {
      axios.get('pronunciation/combine', { params: { ipas: this.ipa } }).then(res => {
        this.ipa_url = res.data.url
      }).catch(() => {
        this.$message.destroy()
      })
    }
    if (this.pinyin) {
      axios.get('pronunciation/combine', { params: { pinyins: this.pinyin } }).then(res => {
        this.pinyin_url = res.data.url
      }).catch(() => {
        this.$message.destroy()
      })
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
        })
      }
    }
  },
  methods: {
    playSound (url, word) {
      if (url !== this.url) this.$message.warning(`该语音由程序根据${word}生成，仅供参考！（可能存在错误）`)
      new Audio(url).play()
    }
  }
}
</script>

<style scoped>

</style>
