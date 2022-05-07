<template>
  <a-select
    v-model="articles"
    :filter-option="false"
    :labelInValue="true"
    :maxTagTextLength="30"
    :not-found-content="fetching ? undefined : null"
    mode="multiple"
    option-label-prop="label"
    placeholder="键入关键字选择相关文章"
    show-search
    style="width: 100%"
    @search="handleArticleSearch"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
    <a-select-option
      v-for="(item,index) in options_article"
      :key="index"
      :label="`${item.article.title}(${item.author.nickname})`"
      :value="item.article.id"
    >
      {{ item.article.title }}-{{ item.author.nickname }}-{{ item.article.description }}
    </a-select-option>
  </a-select>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SelectArticle',
  props: ['value', 'defaultValue'],
  data () {
    return {
      options_article: [],
      fetching: false,
      articles_: []
    }
  },
  computed: {
    articles: {
      get () {
        return this.articles_
      },
      set (value) {
        this.articles_ = value
        this.$emit('input', value)
      }
    }
  },
  created () {
    if (this.defaultValue) {
      this.defaultValue.forEach(item => {
        this.articles_.push({
          key: item.id,
          label: item.title
        })
      })
    }
  },
  watch: {
    defaultValue () {
      this.articles_ = []
      this.defaultValue.forEach(item => {
        this.articles_.push({
          key: item.id,
          label: item.title
        })
      })
    }
  },
  methods: {
    /**
     * 相关词条 搜索文章
     * @param keyword 关键词
     */
    handleArticleSearch (keyword) {
      this.options_article = []
      if (keyword === '') return
      this.fetching = true
      axios.get('/articles', {
        params: { search: keyword },
        cache: true
      }).then(res => {
        axios.put('/articles', { articles: res.data.articles }, { cache: true }).then(res2 => {
          this.options_article = res2.data.articles
        })
      }).finally(() => {
        this.fetching = false
      })
    }
  }
}
</script>

<style scoped>

</style>
