<template>
    <!--    翻译区-->
  <a-card>
  <div>
    <p>点击按钮开始录制普通话</p>
<!--    <img src="@/assets/timg.gif" alt="" @click="translationStart" >-->
    <a-row>
      <a-col :span="14">
        <a-input :value="this.words"></a-input>
      </a-col>
      <a-col :span="10">
    <a-button icon="audio" @click="translationStart">开始</a-button>
    <a-button icon="pause" @click="translationEnd">停止</a-button>
    <a-button icon="sound" @click="playWords(words)">翻译</a-button>
    <a-button icon="search" @click="search(words)">搜索</a-button>
      </a-col>
    </a-row>
  </div>
  </a-card>
</template>

<script>
import IatRecorder from '@/assets/IatRecorder'
import axios from 'axios'
const iatRecorder = new IatRecorder('en_us', 'mandarin', '5f27b6a9')

export default {
  name: 'ptxTranslation',
  data () {
    return {
      words: '请录制普通话语音',
      pronunciation: {
        url: '',
        loading: false,
        disabled: false
      }
    }
  },
  methods: {
    translationStart () {
      iatRecorder.start()
    },
    translationEnd () {
      setTimeout(() => {
        this.words = iatRecorder.resultText
      }, 1000)
      iatRecorder.stop()
    },
    playWords (word) {
      axios.get('pronunciation/combine', { params: { words: word } }).then(res => {
        this.pronunciation.url = res.data.url
      }).catch(() => {
        this.pronunciation.disabled = true
        this.$message.destroy()
      }).finally(() => {
        this.pronunciation.loading = false
      })
      if (this.pronunciation.loading) {
        this.$message.warning('正在合成中，请稍后再试！')
        return
      }
      if (this.pronunciation.disabled) {
        this.$message.warning('很抱歉，这句话太难了，暂时合成不了！')
        return
      }
      this.$message.warning('该语音由机器生成仅供参考！（可能存在错误）')
      new Audio(this.pronunciation.url).play()
    },
    search (content) {
      if (content) {
        this.$router.push({
          name: 'Search',
          query: { key: content }
        })
      } else {
        this.$message.warning('请先输入搜索内容哦~')
      }
    }
  }
}
</script>
<style scoped>

</style>
