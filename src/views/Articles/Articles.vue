<template>
  <a-spin :delay="500" :spinning="spinning" class="body">
    <ArticleList :list-data="listData" :page-size="8">
    </ArticleList>
  </a-spin>
</template>

<script>
import ArticleList from '@/components/Articles/ArticleList'
import axios from 'axios'

export default {
  name: 'Articles',
  components: {
    ArticleList
  },
  data () {
    return {
      listData: [],
      spinning: false
    }
  },
  created () {
    this.spinning = true
    axios.get('/articles').then(res => {
      this.listData = res.data.articles
    }).finally(() => {
      this.spinning = false
    })
  }
}
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  padding: 40px;
}
</style>
