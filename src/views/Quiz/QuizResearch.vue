<template>
  <div class="body">
  <a-input-search
    v-model="searchContent"
    placeholder="开始搜索测试题"
    @search="search(searchContent)"
  />
    <a-card v-for="(item,index) in result" :key="index">
      <router-link
        :to="{name:'QuizDetails',params:{id:item.id.toString()}}"
        style="color:black"
      replace>
        {{ item.id }}.{{item.question}}
      </router-link>
    </a-card>
  </div>
</template>

<script>

import { searchQuiz } from '@/services/quiz'

export default {
  name: 'QuizResearch',
  data () {
    return {
      searchContent: '',
      result: []
    }
  },
  methods: {
    async search (content) {
      if (content) {
        await searchQuiz(content).then(res => {
          this.result = res.result
        })
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
