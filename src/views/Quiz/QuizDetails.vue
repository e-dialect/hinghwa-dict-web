<template>
  <div class="body">
    <!-- Challenge Mode -->
    <template v-if="challengeMode">
      <!-- 加载中 -->
      <a-card v-if="challengeLoading">
        <p>加载题目中...</p>
      </a-card>

      <!-- 加载失败 -->
      <a-card v-else-if="challengeError">
        <p>获取题目失败，请重试</p>
        <a-button type="primary" @click="initChallenge" style="margin-right: 10px">重试</a-button>
        <a-button @click="exitChallenge">返回</a-button>
      </a-card>

      <!-- 挑战结果 -->
      <a-card v-else-if="challengeFinished" style="text-align: center">
        <h3 :style="{ color: wrongCount >= this.maxWrong ? '#ff4d4f' : '#52c41a' }">
          {{ wrongCount >= this.maxWrong ? '挑战失败' : '挑战成功' }}
        </h3>
        <p>{{ wrongCount >= this.maxWrong ? '累计答错' + this.maxWrong + '题，挑战结束' : '恭喜你完成所有题目！' }}</p>
        <p style="font-size: 36px; font-weight: bold; margin: 16px 0">
          {{ score }}<span style="font-size: 18px; font-weight: normal"> 分</span>
        </p>
        <p>答对 {{ correctCount }}/{{ this.totalQuestions }} 题</p>
        <div style="margin-top: 20px">
          <a-button type="primary" @click="startNewChallenge" style="margin-right: 10px">再来一次</a-button>
          <a-button v-if="wrongQuizzes.length > 0" @click="showWrongReview = !showWrongReview" style="margin-right: 10px">
            {{ showWrongReview ? '收起错题' : '查看错题' }}
          </a-button>
          <a-button @click="exitChallenge">返回首页</a-button>
        </div>
        <div v-if="showWrongReview && wrongQuizzes.length > 0" style="margin-top: 20px; text-align: left; border-top: 1px solid #eee; padding-top: 16px">
          <h4>错题回顾</h4>
          <div v-for="(item, index) in wrongQuizzes" :key="index" style="margin-bottom: 12px; padding: 12px; background: #fafafa; border-radius: 4px;">
            <p><strong>题目：</strong>{{ item.question }}</p>
            <p><strong>你的答案：</strong><span style="color: #ff4d4f">{{ item.selectedText }}</span></p>
            <p><strong>正确答案：</strong><span style="color: #52c41a">{{ item.correctText }}</span></p>
            <p v-if="item.explanation"><strong>解析：</strong>{{ item.explanation }}</p>
          </div>
        </div>
      </a-card>

      <!-- 挑战进行中 -->
      <a-card v-else>
        <div slot="title" style="display: flex; justify-content: space-between;">
          <span>挑战 {{ currentIndex + 1 }}/{{ quizzes.length }}</span>
          <span>得分: {{ score }}</span>
        </div>

        <div style="margin-bottom: 12px">
          <a-tag
            v-for="i in this.maxWrong"
            :key="i"
            :color="i <= wrongCount ? 'red' : 'default'"
          >
            ● 错题 {{ i }}
          </a-tag>
        </div>

        <h3 style="margin-bottom: 16px">{{ currentQuiz.question }}</h3>

        <div style="margin-bottom: 10px">
          <a-card
            v-for="(option, index) in currentQuiz.options"
            :key="index"
            :class="getOptionClass(index)"
            class="option"
            hoverable
            size="small"
            @click="handleAnswer(index)"
          >
            {{ option }}
          </a-card>
        </div>

        <div v-if="answered">
          <p>答案解析：{{ currentQuiz.explanation }}</p>
          <p v-if="lastAnswerCorrect">
            <a-tag color="green">+{{ lastPoints }}分</a-tag>
            <span v-if="streak > 1" style="color: #999; font-size: 12px">（连续答对 {{ streak }} 题）</span>
          </p>
          <a-button
            v-if="wrongCount < this.maxWrong && currentIndex < quizzes.length"
            type="dashed"
            @click="nextChallengeQuestion"
          >
            {{ nextButtonText }}
          </a-button>
        </div>
      </a-card>
    </template>

    <!-- 单题模式（原有） -->
    <template v-else-if="quiz">
      <a-card :title="quiz.id +'-'+ quiz.question">
        <template v-slot:extra>
          <a-row>
            <a-col>
              <a-button v-if="quiz.voice_source" icon="sound" size="small" @click="playSound(quiz.voice_source)">播放关键词</a-button>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <router-link :to="{name:'QuizCreate',params:{id:quiz.id}}">
                <a-button icon="edit" size="small" style="margin-top: 10px">修改测试题</a-button>
              </router-link>
            </a-col>
          </a-row>
        </template>
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
        <div v-show="isShow">答案解析：{{ quiz.explanation }}</div>
        <a-button type="dashed" @click="answerAgain" class="btn">重置本题</a-button><br>
        <a-button type="dashed" class="btn" @click="nextQuestion">下一题</a-button>
      </a-card>
    </template>
  </div>
</template>

<script>
import { getQuiz, getRandomQuiz } from '@/services/quiz'

const BASE_SCORE = 5
const MAX_SCORE_PER_Q = 20

export default {
  name: 'QuizDetails',
  props: ['id'],
  data () {
    return {
      // 挑战模式状态
      challengeMode: false,
      challengeLoading: false,
      challengeError: false,
      quizzes: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      wrongCount: 0,
      correctCount: 0,
      answered: false,
      selectedOption: null,
      lastAnswerCorrect: false,
      lastPoints: 0,
      challengeFinished: false,
      wrongQuizzes: [],
      showWrongReview: false,

      // 单题模式状态（原有）
      quiz: {
        question: '这是个问题标题',
        options: [],
        answer: 0,
        explanation: '这个是个答案解析',
        id: 0,
        voice_source: ''
      },
      isShow: false,
      current: 0,
      errorIndex: '',
      correctIndex: '',
      userAnswer: ''
    }
  },
  computed: {
    totalQuestions () {
      return 10
    },
    maxWrong () {
      return 3
    },
    currentQuiz () {
      return this.quizzes[this.currentIndex] || null
    },
    nextButtonText () {
      return this.currentIndex < this.quizzes.length - 1 ? '下一题' : '查看结果'
    }
  },
  created () {
    this.challengeMode = this.$route.query.challenge === 'true'
    if (this.challengeMode) {
      this.initChallenge()
    } else if (this.id) {
      this.getQuiz()
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    if (!this.challengeMode && !this.quiz.id) {
      this.nextQuestion()
    }
  },
  methods: {
    // ===== 挑战模式方法 =====
    async initChallenge () {
      this.challengeLoading = true
      this.challengeError = false
      this.score = 0
      this.streak = 0
      this.wrongCount = 0
      this.correctCount = 0
      this.currentIndex = 0
      this.answered = false
      this.selectedOption = null
      this.lastAnswerCorrect = false
      this.lastPoints = 0
      this.challengeFinished = false
      this.wrongQuizzes = []
      this.showWrongReview = false
      this.quizzes = []

      try {
        const requests = Array(this.totalQuestions).fill(null).map(() => getRandomQuiz())
        const results = await Promise.all(requests)
        const seenIds = new Set()
        for (const res of results) {
          if (!seenIds.has(res.quiz.id)) {
            seenIds.add(res.quiz.id)
            this.quizzes.push(res.quiz)
          }
        }
        while (this.quizzes.length < this.totalQuestions) {
          const res = await getRandomQuiz()
          if (!seenIds.has(res.quiz.id)) {
            seenIds.add(res.quiz.id)
            this.quizzes.push(res.quiz)
          }
        }
      } catch (e) {
        this.challengeError = true
        this.$message.error('获取题目失败，请重试')
      }
      this.challengeLoading = false
    },

    handleAnswer (index) {
      if (this.answered || this.challengeFinished) return
      this.answered = true
      this.selectedOption = index

      if (index === this.currentQuiz.answer) {
        this.streak++
        this.correctCount++
        this.lastPoints = Math.min(BASE_SCORE * this.streak, MAX_SCORE_PER_Q)
        this.score += this.lastPoints
        this.lastAnswerCorrect = true
        this.$message.success(`回答正确！+${this.lastPoints}分`)
      } else {
        this.streak = 0
        this.wrongCount++
        this.lastAnswerCorrect = false
        this.lastPoints = 0
        this.wrongQuizzes.push({
          question: this.currentQuiz.question,
          selectedText: this.currentQuiz.options[index],
          correctText: this.currentQuiz.options[this.currentQuiz.answer],
          explanation: this.currentQuiz.explanation
        })
        this.$message.error('很抱歉，回答错误')

        if (this.wrongCount >= this.maxWrong) {
          this.challengeFinished = true
        }
      }
    },

    nextChallengeQuestion () {
      if (this.challengeFinished) return
      this.currentIndex++
      this.answered = false
      this.selectedOption = null
      this.lastAnswerCorrect = false
      this.lastPoints = 0

      if (this.currentIndex >= this.quizzes.length) {
        this.challengeFinished = true
      }
    },

    startNewChallenge () {
      this.initChallenge()
    },

    exitChallenge () {
      this.$router.push({ name: 'PuxianExam' })
    },

    getOptionClass (index) {
      if (!this.answered) return {}
      return {
        correctActive: index === this.currentQuiz.answer,
        errorActive: this.selectedOption === index && index !== this.currentQuiz.answer
      }
    },

    // ===== 单题模式方法（原有） =====
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
        this.$router.replace({
          path: '/PuxianExam/' + this.quiz.id
        })
      })
    },
    playSound (url) {
      new Audio(url).play()
    }
  }
}
</script>

<style scoped>
.btn {
  margin: 10px;
}
.correctActive {
  background-color: yellowgreen;
}
.errorActive {
  background-color: salmon;
}
.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  padding: 40px;
}
.option {
  margin-bottom: 8px;
}
</style>
