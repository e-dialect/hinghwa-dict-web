<template>
  <a-spin
    :spinning="spinning"
    :delay="500"
    style="width: 90%"
  >
    <a-card>
      <template slot="title">
        <a-input-search
          placeholder="请输入搜索内容"
          enter-button
          size="large"
          @search="$router.push({name:'Search',query:{key:searchContent}})"
          v-model="searchContent"
        />
      </template>

      <ArticleList :list-data="listData" :page-size="8"/>
    </a-card>
  </a-spin>
</template>

<script>
import ArticleList from '@/components/Articles/ArticleList'
import axios from 'axios'

export default {
  name: 'SearchResult',
  components: {
    ArticleList
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
        articles: true
      },
      listData: [],
      searchContent: ''
    }
  },
  created () {
    this.loadingData()
  },

  watch: {
    key () {
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
        this.listData = res.data.articles
      }).finally(() => {
        this.loading.articles = false
      })
    }
  }

}
</script>

<style scoped>

</style>
