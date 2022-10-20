<template v-if="quiz">
  <a-card :title="quiz.id +'-'+ quiz.question">
    <template v-slot:title>
      <h1 style="padding-left:32px; color: rgb(26,26,73); font-size:250%">
        <strong>
          {{ quiz.id }}
        </strong>
      </h1>
      <span style="font-size: 100%;padding-left: 50px">
          {{ quiz.question }}
        </span>
    </template>

    <template v-slot:extra>
      <a-row>
        <router-link :to="{name:'QuizCreate',params:{id:quiz.id}}">
          <a-button icon="edit" size="small"> 修改测试题</a-button>
        </router-link>
      </a-row>

    </template>
<!--    选项区域-->
    <div style="margin-bottom: 10px">
    <a-card v-for="(item1,index1)  in quiz.options"
        @click="addClass(index1,$event)"
        :key="index1"
            class="option"
            hoverable
            size="small"
            :class="{errorActive:errorIndex===index1,correctActive:correctIndex===index1}">
    {{item1}}</a-card>
    </div>
<!--    答案与解析区域-->
    <div v-show="isShow">你的答案：{{userAnswer}}<br>正确答案：{{ quiz.answer}}<br>答案解析：{{ quiz.explanation }}</div>
    <!-- 重置本题按钮 -->
    <a-button
      type="dashed"
      @click="answerAgain"
      v-text="answerbtnText"
      class="btn"
    >
    </a-button><br>
    <!-- 下一题按钮 -->
    <a-button
      type="dashed"
      class="btn"
      @click="nextquestion"
    >
      下一题
    </a-button>
  </a-card>
</template>

<script>

import axios from 'axios'

export default {
  name: 'QuizDetails',
  data () {
    return {
      quiz: {
        question: '这是个问题标题',
        options: [],
        answer: 0,
        explanation: '这个是个答案解析',
        id: 21
      },
      isShow: false,
      answerbtnText: '重置本题',
      current: 0,
      errorIndex: '',
      correctIndex: '',
      userAnswer: ''
    }
  },
  created () {
    axios.get('http://127.0.0.1:4523/mock/404238/quizzes/' + this.id).then(res => {
      this.quiz = res.data.quiz
    })
  },
  methods: {
    answerAgain () {
      this.errorIndex = ''
      this.correctIndex = ''
      this.isShow = false
    },
    nextquestion () {
      this.errorIndex = ''
      this.correctIndex = ''
      this.isShow = false
      axios.get('http://127.0.0.1:4523/mock/404238/quizzes/' + this.id).then(res => {
        this.quiz = res.data.quiz
        this.$router.push('/PuxianExam/' + this.quiz.id)
      })
    },
    addClass: function (index1, event) {
      this.errorIndex = ''
      this.correctIndex = ''
      this.current = index1
      this.userAnswer = index1
      this.isShow = true
      if (this.userAnswer !== this.quiz.answer) {
        this.errorIndex = index1
      } else if (this.current === this.quiz.answer) {
        this.correctIndex = index1
      }
    }
  }
}
</script>

<style scoped>
.btn{
  margin: 10px;
}
.correctActive{
  background-color: yellowgreen;
}
.errorActive{
  background-color: salmon;
}
</style>
