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
      >
        {{ item.id }}.{{item.question}}
      </router-link>
    </a-card>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'QuizResearch',
  data () {
    return {
      searchContent: '',
      result: []
    }
  },
  methods: {
    search (content) {
      if (content) {
        axios.get('http://127.0.0.1:4523/mock/404238/quizzes').then(res => {
          this.result = res.data.result
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
