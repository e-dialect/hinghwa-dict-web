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
    <div style="margin-bottom: 10px">
    <a-card v-for="(item1,index1)  in quiz.options"
        @click="addClass(index1,$event)"
        :key="index1"
            class="option"
            hoverable
    size="small">
    {{item1}}</a-card>
    </div>
    <!-- 查看答案按钮 -->
    <a-button
      type="dashed"
      @click="answershowToggle"
      v-text="answerbtnText"
      class="btn"
    >
    </a-button><br>
    <div v-show="isShow1">{{ quiz.answer}}</div>
    <!-- 查看解析按钮 -->
    <a-button
      type="dashed"
      @click="explanshowToggle"
      v-text="explanbtnText"
      class="btn"
    >
    </a-button><br>
    <div v-show="isShow2">{{ quiz.explanation }}</div>
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
      isShow1: false,
      isShow2: false,
      answerbtnText: '查看答案',
      explanbtnText: '查看解析',
      current: 0
    }
  },
  created () {
    axios.get('http://127.0.0.1:4523/mock/404238/quizzes/' + this.id).then(res => {
      this.quiz = res.data.quiz
    })
  },
  methods: {
    answershowToggle () {
      this.isShow1 = !this.isShow1
      console.log(this.quiz.id)
    },
    explanshowToggle () {
      this.isShow2 = !this.isShow2
    },
    nextquestion () {
      axios.get('http://127.0.0.1:4523/mock/404238/quizzes/' + this.id).then(res => {
        this.quiz = res.data.quiz
        this.$router.push('/PuxianExam/' + this.quiz.id)
      })
    },
    addClass: function (index, event) {
      this.current = index // 获取点击对象
      if (this.current !== this.quiz.answer) {
        this.$message.error('很抱歉，回答错误，再接再厉哦~')
      } else if (this.current === this.quiz.answer) {
        this.$message.success('恭喜你 回答正确！')
      }
    }
  }
}
</script>

<style scoped>
.btn{
  margin: 10px;
}
</style>
