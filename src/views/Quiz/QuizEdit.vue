<template>
  <a-spin :delay="500" :spinning="spinning">
    <a-card>
      <template v-slot:title>
        <h1 v-if="id">测试题编辑</h1>
        <h1 v-else>测试题创建</h1>
      </template>

      <a-form-model :labelCol="{span: 3}" :model="quiz" :wrapperCol="{span:16,offset:1}">
        <a-form-model-item label="题目">
          <a-input v-model="quiz.question" placeholder="输入题目"/>
        </a-form-model-item>
        <a-form-model-item label="选项">
          <a-input v-model="quiz.options" placeholder="输入选项"/>
        </a-form-model-item>
        <a-form-model-item label="正确答案">
          <a-input v-model="quiz.answer" placeholder="输入正确答案"/>
        </a-form-model-item>
        <a-form-model-item label="答案解析">
          <a-input v-model="quiz.explanation" placeholder="输入解析"/>
        </a-form-model-item>
      </a-form-model>
      <a-button
        :loading="btnQuizLoading"
        @click="id?updateQuiz():createQuiz()"
      >
        {{ id ? '修改测试题' : '创建测试题' }}
      </a-button>
    </a-card>
  </a-spin>
</template>

<script>
import axios from 'axios'

export default {
  name: 'QuizEdit',
  data () {
    return {
      spinning: false,
      quiz: {
        question: '',
        options: [],
        answer: '',
        explanation: '',
        id: 21
      },
      btnQuizLoading: false,
      submit: false
    }
  },
  computed: {
    id () {
      if (this.$route.name === 'QuizCreate') {
        return 0
      } else {
        return +this.$route.params.id
      }
    }
  },
  async created () {
    await this.$store.dispatch('userUpdate')
    if (!this.$store.getters.user.is_admin) {
      this.$message.error('仅管理员有权访问该模块！或请重新登录！')
      this.$router.push({ name: 'PuxianExam' })
    }
  },
  methods: {
    /**
     * 创建测试题的命令操作
     */
    createQuiz () {
      // TODO 重构至 services/quiz.js
      this.btnQuizLoading = true
      axios.post('/quizzes', Object.assign({}, this.quiz)).then(res => {
        this.submit = true
        this.$message.success('恭喜你，创建成功！')
        this.$router.push({
          name: 'QuizDetails',
          params: { id: res.data.id.toString() }
        })
      }).catch(err => {
        this.$message.destroy()
        switch (err.response.status) {
          case 401: {
            this.$message.error('登录状态无效！请重新登录！')
            break
          }
          case 400: {
            this.$message.error('请完成所有内容！')
            break
          }
          case 500: {
            this.$message.error('服务器错误！请联系管理员！')
            this.$message.error('错误内容:' + err.response.data.msg)
            break
          }
        }
      }).finally(() => {
        this.btnQuizLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
