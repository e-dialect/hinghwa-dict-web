<template>
  <a-select
    show-search
    mode="multiple"
    v-model="words"
    :not-found-content="fetching ? undefined : null"
    style="width: 100%"
    :maxTagTextLength="30"
    :filter-option="false"
    @search="handleWordSearch"
    placeholder="键入关键字选择相关词条"
    option-label-prop="label"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
    <a-select-option
      v-for="(item,index) in options_word"
      :key="index"
      :value="item.id"
      :label="`${item.word}(${item.standard_pinyin})`"
    >
      {{ item.word }}-{{ item.standard_pinyin }}-{{ item.definition }}
    </a-select-option>
  </a-select>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SelectWord',
  props: ['value'],
  data () {
    return {
      options_word: [],
      fetching: false
    }
  },
  computed: {
    words: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
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
