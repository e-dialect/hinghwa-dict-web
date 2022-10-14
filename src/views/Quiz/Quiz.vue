<template>
  <div class="body">
    <a-card title="聪明花开">
      <p>莆仙方言的学习不仅仅在语言与文字上，更在于方言背后所蕴含的文化</p>
      <p>让我们通过一些小测试，来看看你对莆仙文化的了解，并在测试中加深对莆仙文化的学习吧</p>
      <a-button type="dashed" style="margin: 5px">
        <router-link :to="{name:'QuizDetails',params: { id: this.quiz.id} }">开始答题</router-link>
      </a-button>
      <a-button type="dashed" style="margin: 5px">
        <router-link :to="{name:'QuizCreate'}">贡献新题库</router-link>
      </a-button>
      <a-button type="dashed" style="margin: 5px">
        <router-link :to="{name:'QuizResearch'}">搜索测试题</router-link>
      </a-button>
    </a-card>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Quiz',
  data () {
    return {
      quiz: {
        id: 21
      }
    }
  },
  created () {
    axios.put('http://127.0.0.1:4523/mock/404238/quizzes/').then(res => {
      this.quiz.id = res.data.quiz.id
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
