<template>
  <a-select
    show-search
    mode="multiple"
    v-model="articles"
    :not-found-content="fetching ? undefined : null"
    style="width: 100%"
    :maxTagTextLength="30"
    :filter-option="false"
    @search="handleArticleSearch"
    placeholder="键入关键字选择相关文章"
    option-label-prop="label"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
    <a-select-option
      v-for="(item,index) in options_article"
      :key="index"
      :value="item.article.id"
      :label="`${item.article.title}(${item.author.nickname})`"
    >
      {{ item.article.title }}-{{ item.author.nickname }}-{{ item.article.description }}
    </a-select-option>
  </a-select>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SelectArticle',
  props: ['value'],
  data () {
    return {
      options_article: [],
      fetching: false
    }
  },
  computed: {
    articles: {
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
