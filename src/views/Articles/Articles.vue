<template>
  <div class="body">
  <ArticleList :page-size="8" :list-data="listData">
  </ArticleList>
  </div>
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
    return { listData: [] }
  },
  created () {
    axios.get('/articles').then(res => {
      this.listData = res.data.articles
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
