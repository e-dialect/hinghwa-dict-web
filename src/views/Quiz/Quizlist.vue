<template>
<span style="font-size: 150%">
               <router-link
                 :to="{name:'QuizDetails',params:{id:quiz.id.toString()}}"
                 style="color:black"
               >
                 {{ quiz.id}}{{ quiz.question}}
               </router-link>
            </span>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Quizlist',
  data () {
    return {
      quiz: {
        question: '这是个问题标题',
        id: 21
      }
    }
  },
  created () {
    axios.get('/quizzes/' + this.id).then(res => {
      this.quiz = res.data.quiz
      this.id = res.data.id
    })
  }
}
</script>

<style scoped>

</style>
