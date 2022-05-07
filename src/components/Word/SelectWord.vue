<template>
  <a-select
    v-model="words"
    :filter-option="false"
    :labelInValue="true"
    :maxTagTextLength="30"
    :not-found-content="fetching ? undefined : null"
    mode="multiple"
    option-label-prop="label"
    placeholder="键入关键字选择相关词条"
    show-search
    style="width: 100%"
    @search="handleWordSearch"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
    <a-select-option
      v-for="(item,index) in options_word"
      :key="index"
      :label="`${item.word}(${item.standard_pinyin})`"
      :value="item.id"
    >
      {{ item.word }}-{{ item.standard_pinyin }}-{{ item.definition }}
    </a-select-option>
  </a-select>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SelectWord',
  props: ['defaultValue', 'value'],
  data () {
    return {
      options_word: [],
      words_: [],
      model: [],
      fetching: false
    }
  },
  computed: {
    words: {
      get () {
        return this.words_
      },
      set (value) {
        this.words_ = value
        this.$emit('input', value)
      }
    }
  },
  created () {
    if (this.defaultValue) {
      this.defaultValue.forEach(item => {
        this.words_.push({
          key: item.id,
          label: item.word
        })
      })
    }
  },
  watch: {
    defaultValue () {
      this.words_ = []
      this.defaultValue.forEach(item => {
        this.words_.push({
          key: item.id,
          label: item.word
        })
      })
    }
  },
  methods: {
    /**
     * 相关词条 搜索词条
     * @param keyword 关键词
     */
    handleWordSearch (keyword) {
      this.options_word = []
      if (keyword === '') return
      this.fetching = true
      axios.get('/words', {
        params: { search: keyword },
        cache: true
      }).then(res => {
        this.options_word = res.data.result
      }).finally(() => {
        this.fetching = false
      })
    }
  }
}
</script>

<style scoped>

</style>
