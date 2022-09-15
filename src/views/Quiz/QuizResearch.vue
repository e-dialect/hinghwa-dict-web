<template>
  <div class="body">
  <a-input-search
    v-model="searchContent"
    placeholder="开始搜索测试题"
    @search="search(searchContent)"
  />
  </div>
</template>

<script>
export default {
  name: 'QuizResearch',
  data () {
    return {
      searchContent: ''
    }
  },
  methods: {
    search (content) {
      if (content) {
        if (!(this.$route.name === 'QuizSearch' && content === this.$route.query.key)) {
          this.$router.push({
            name: 'QuizSearch',
            query: { key: content }
          })
        }
      } else {
        this.$message.warning('请先输入搜索内容哦~')
      }
    }
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
