<template>
    <!--    翻译区-->
    <a-card>
      <div>
        <p>点击按钮开始录制莆仙话</p>
        <a-row>
          <a-col :span="17">
            <a-input v-model="this.word"></a-input>
          </a-col>
          <a-col :span="7">
            <a-button v-if="!recording" icon="audio" @click="startRecording">开始录制</a-button>
            <a-button v-else icon="pause" @click="stopRecording">停止录制</a-button>
            <a-button icon="search" @click="search(word)">搜索更多</a-button>
          </a-col>
        </a-row>
        <div
          v-if="recordSourceURL"
          style="text-align: center;padding-top: 20px">
          <audio
            :src="recordSourceURL"
            controls
          />
        </div>
      </div>
      <a-divider v-if="word.length"></a-divider>
<!--      结果-->
      <PinyinList
        v-if="word.length"
        :key-words="word"
      />
    </a-card>
</template>

<script>
import axios from 'axios'
import PinyinList from '../../components/Tools/PinyinList'

export default {
  name: 'ptxTranslation',
  components: { PinyinList },
  data () {
    return {
      recorderReady: false,
      mediaRecorder: null,
      recordSourceURL: '',
      recordSource: null,
      recording: false,
      word: '请录制莆仙话语音',
      trans: false
    }
  },
  computed: {
    chinese () {
      return this.word.toString().replaceAll(/[^\u4e00-\u9fa5]/ig, '')
    }
  },
  methods: {
    startRecording () {
      // 如果还没有准备好录音器
      if (this.recorderReady === false) {
        if (navigator.mediaDevices.getUserMedia) {
          const constraints = { audio: true }
          navigator.mediaDevices.getUserMedia(constraints).then(
            stream => {
              this.mediaRecorder = new MediaRecorder(stream)
              let chunks = []

              // 录音开始
              this.mediaRecorder.onstart = () => {
                chunks = []
              }
              // 录音过程中
              this.mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data)
              }

              // 录音停止
              this.mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: this.mediaRecorder.mimeType })
                this.recordSourceURL = window.URL.createObjectURL(blob)
                this.recordSource = blob
              }

              // 录音器已经完全准备好
              this.recorderReady = true
              this.mediaRecorder.start()
              this.recording = true
            },
            () => {
              this.$message.error('授权失败！请允许网站使用麦克风！')
            }
          )
        } else {
          this.$message.error('暂不支持本浏览器')
        }
      } else {
        this.mediaRecorder.start()
        this.recording = true
      }
    },
    stopRecording () {
      this.mediaRecorder.stop()
      this.recording = false
      // 调用接口
      try {
        const formdata = new FormData()
        formdata.append('file', this.recordSource, Date.now().toString() + '.mp3')
        axios({
          url: '/pronunciation/translate',
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          console.log(res.data.word)
          this.word = res.data.word
        })
      } catch (e) {
        this.$message.warning('抱歉，该语音暂时无法识别出哦')
      }

      this.trans = true
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
