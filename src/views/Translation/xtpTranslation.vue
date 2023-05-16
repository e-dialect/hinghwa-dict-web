<template>
  <a-card>
    <!--    翻译区-->
    <div>
<!--      <h1>录制莆仙话</h1>-->
      <a-form-model>
      <a-form-model-item label="录音">
        <a-row align="middle" justify="center" type="flex">
          <a-col :span="4">
            <a-button
              v-if="!recording"
              icon="audio"
              shape="circle"
              size="large"
              style="width: 50px;height: 50px "
              @click="startRecording"
            />
            <a-button
              v-else
              icon="pause"
              shape="circle"
              style="width: 50px;height: 50px "
              @click="stopRecording"
            />
          </a-col>
          <a-col :span="4">
            {{
              recording ? '停止录音' :
                (recordSourceURL ? '重新录音' : '开始录音')
            }}
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item v-show="recordSourceURL">
        <div
          style="text-align: center">
          <audio
            :src="recordSourceURL"
            controls
          />
        </div>
      </a-form-model-item>
      </a-form-model>
<!--      翻译结果-->
      <a-button @click="translation(recordSourceURL)">翻译</a-button>
      <span v-if="trans">{{this.word}}</span>
    </div>
  </a-card>
</template>

<script>

import { xtpTranslation } from '@/services/translation'

export default {
  name: 'ptxTranslation',
  data () {
    return {
      recorderReady: false,
      mediaRecorder: null,
      recordSourceURL: '',
      recordSource: null,
      recording: false,
      word: '',
      trans: false
    }
  },
  methods: {
    async translation (url) {
      await xtpTranslation(url).then(res => {
        this.word = res.word
      })
      this.trans = true
    },
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
    }
  }
}
</script>

<style scoped>

</style>
