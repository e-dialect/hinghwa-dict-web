<template>
    <!--    翻译区-->
  <a-card>
  <div>
    <p>点击按钮开始录制普通话</p>
    <a-row>
      <a-col :span="17">
        <a-input :value="this.words"></a-input>
      </a-col>
      <a-col :span="7">
    <a-button icon="audio" @click="translationStart">开始</a-button>
    <a-button icon="pause" @click="translationEnd">停止</a-button>
    <a-button icon="search" @click="search(words)">搜索</a-button>
      </a-col>
    </a-row>
  </div>
  </a-card>
</template>

<script>
import IatRecorder from '@/assets/IatRecorder'
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
    search (content) {
      if (content) {
        this.$router.push({
          name: 'Search',
          query: { key: content }
        })
      } else {
        this.$message.warning('请先录入搜索内容哦~')
      }
    }
  }
}
</script>
<style scoped>

</style>
