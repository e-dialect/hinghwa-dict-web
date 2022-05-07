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
          @search="search(searchContent)"
        />
      </template>
      <div v-if="Chinese.length">
        <h1>听句子（约等于不能听版）</h1>
        <a-button icon="sound" @click="playWords()" style="margin-left:100px">
          我已保护好耳朵，坚持试听一下
        </a-button>
        <a-divider></a-divider>
      </div>
      <div v-if="Chinese.length">
        <h1>查单字</h1>
        <a-row justify="space-around" type="flex">
          <PinyinList
            :key-words="Chinese"
            style="width: 80%"
          />
        </a-row>
        <a-divider></a-divider>
      </div>
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
    },
    Chinese () {
      return this.keyWords.toString().replaceAll(/[^\u4e00-\u9fa5]/ig, '')
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
      searchContent: '',
      pronunciation: {
        url: '',
        loading: false,
        disabled: false
      }
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
      this.pronunciation.url = ''
      this.pronunciation.loading = true
      axios.get('pronunciation/combine', { params: { words: this.Chinese } }).then(res => {
        this.pronunciation.url = res.data.url
      }).catch(() => {
        this.pronunciation.disabled = true
        this.$message.destroy()
      }).finally(() => {
        this.pronunciation.loading = false
      })
    },
    search (content) {
      if (content) {
        if (content !== this.keyWords) {
          this.$router.push({
            name: 'Search',
            query: { key: content }
          })
        }
      } else {
        this.$message.warning('请先输入搜索内容哦~')
      }
    },
    playWords () {
      if (this.pronunciation.loading) {
        this.$message.warning('正在合成中，请稍后再试！')
        return
      }
      if (this.pronunciation.disabled) {
        this.$message.warning('很抱歉，这句话太难了，暂时合成不了！')
        return
      }
      this.$message.warning('该语音由机器生成仅供参考！（可能存在错误）')
      new Audio(this.pronunciation.url).play()
    }
  }
}
</script>

<style scoped>

</style>
