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
<!--    答案解析区域-->
    <div v-show="isShow">答案解析：{{ quiz.explanation }}</div>
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
      @click="nextQuestion"
    >
      下一题
    </a-button>
  </a-card>
</template>

<script>

import { getQuiz, getRandomQuiz } from '@/services/quiz'

export default {
  name: 'QuizDetails',
  props: ['id'],
  data () {
    return {
      quiz: {
        question: '这是个问题标题',
        options: [],
        answer: 0,
        explanation: '这个是个答案解析',
        id: 0
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
    this.getQuiz()
  },
  mounted: () => {
    this.id = this.$route.query.id
    this.nextQuestion()
  },
  methods: {
    /**
     *获取测试题
     **/
    async getQuiz () {
      await getQuiz(this.id).then(res => {
        this.quiz = res.quiz
      })
    },
    answerAgain () {
      this.errorIndex = ''
      this.correctIndex = ''
      this.isShow = false
    },
    addClass: function (index1, event) {
      this.errorIndex = ''
      this.correctIndex = ''
      this.current = index1
      this.userAnswer = index1
      this.isShow = true
      if (this.userAnswer !== this.quiz.answer) {
        this.errorIndex = index1
        this.correctIndex = index1
        this.$message.error('很抱歉，回答错误，再接再厉哦~')
      } else if (this.current === this.quiz.answer) {
        this.$message.success('恭喜你 回答正确！')
        this.correctIndex = index1
      }
    },
    async nextQuestion () {
      this.errorIndex = ''
      this.correctIndex = ''
      this.isShow = false
      await getRandomQuiz().then(res => {
        this.quiz = res.quiz
        this.$router.push('/PuxianExam/' + this.quiz.id)
      })
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
