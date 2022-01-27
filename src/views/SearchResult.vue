<template>
  <a-spin
    :delay="500"
    :spinning="spinning"
    style="width: 90%"
  >
    <a-card>
      <template slot="title">
        <a-input-search
          v-model="searchContent"
          enter-button
          placeholder="请输入搜索内容"
          size="large"
          @search="$router.push({name:'Search',query:{key:searchContent}})"
        />
      </template>
      <h1>查单字</h1>
      <a-row justify="space-around" type="flex">
        <PinyinList
          v-if="keyWords.length"
          :key-words="keyWords"
          style="width: 80%"
        />
      </a-row>
      <a-divider></a-divider>
      <h1>查词语</h1>
      <a-row justify="space-around" type="flex">
        <WordList
          :list-data="words"
          :page-size="8"
          style="width: 80%"
        />
      </a-row>
      <a-divider></a-divider>
      <h1>查文章</h1>
      <a-row justify="space-around" type="flex">
        <ArticleList
          :list-data="articles"
          :page-size="8"
          style="width: 80%"/>
      </a-row>
    </a-card>
  </a-spin>
</template>

<script>
import PinyinList from '../components/Tools/PinyinList'
import WordList from '../components/Tools/WordList'
import ArticleList from '../components/Articles/ArticleList'
import axios from 'axios'

export default {
  name: 'SearchResult',
  components: {
    ArticleList,
    WordList,
    PinyinList
  },
  props: [
    'keyWords'
  ],
  computed: {
    spinning () {
      for (const key in this.loading) {
        if (this.loading[key] === true) return true
      }
      return false
    }
  },
  data () {
    return {
      loading: {
        articles: false,
        words: false
      },
      articles: [],
      words: [],
      searchContent: ''
    }
  },
  created () {
    this.loadingData()
  },

  watch: {
    keyWords () {
      this.loadingData()
    }
  },
  methods: {
    loadingData () {
      this.searchContent = this.keyWords
      for (const i in this.loading) {
        this.loading[i] = true
      }
      axios.get('/articles', { params: { search: this.keyWords } }).then(res => {
        this.articles = res.data.articles
      }).finally(() => {
        this.loading.articles = false
      })
      axios.get('/words', { params: { search: this.keyWords } }).then(res => {
        this.words = res.data.words
      }
      ).finally(() => {
        this.loading.words = false
      })
    }
  }

}
</script>

<style scoped>

</style>
