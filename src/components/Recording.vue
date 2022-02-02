<template>
  <a-modal
    :closable="false"
    :visible="visible"
    cancelText="取消"
    okText="提交"
    title="提交录音"
    @cancel="handleCancel()"
    @ok="handleOk()"
  >
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item label="词条" prop="item">
        <h3>{{ form.item }} </h3>
      </a-form-model-item>
      <a-form-model-item label="释义">
        {{ form.definition }}
      </a-form-model-item>
      <a-form-model-item label="拼音" prop="pinyin">
        <a-input v-model="form.pinyin"/>
      </a-form-model-item>
      <a-form-model-item label="国际音标" prop="ipa">
        <a-input v-model="form.ipa"/>
      </a-form-model-item>
      <a-form-model-item label="发音人乡镇" prop="town">
        <AreaCascader
          :county.sync="form.county"
          :town.sync="form.town"
        />
      </a-form-model-item>
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
      <a-form-model-item v-show="recordSourceURL" label="效果试听">
        <div
          style="text-align: center">
          <audio
            :src="recordSourceURL"
            controls
          />
        </div>
      </a-form-model-item>
    </a-form-model>

  </a-modal>
</template>

<script>
import axios from 'axios'
import AreaCascader from './AreaCascader'
export default {
  name: 'Recording',
  props: ['visible', 'form', 'onCancel'],
  components: { AreaCascader },
  data () {
    return {
      recorderReady: false,
      mediaRecorder: null,
      recordSourceURL: '',
      recordSource: null,
      recording: false,
      rules: {
        item: [{
          required: true,
          message: '词条走丢了，刷新再试试？'
        }],
        pinyin: [{
          required: true,
          message: '请输入你正在录音的拼音~'
        }],
        ipa: [{
          required: true,
          message: '请输入你正在录音的国际音标~'
        }],
        county: [{
          required: true,
          message: '请输入发音人所在的县区哦~'
        }],
        town: [{
          required: true,
          message: '请输入发音人所在的乡镇哦~'
        }]
      }
    }
  },
  methods: {

    handleOk () {
      this.$refs.ruleForm.validate(valid => {
        if (!this.form.town || this.form.town.length === 0) {
          this.$message.error('请先选择发音人的乡镇哦~')
          return
        }
        if (!valid) {
          this.$message.error('请先完善输入信息哦~')
          return false
        }
        if (!this.recordSourceURL) {
          this.$message.error('请先完成录音')
          return
        }
        // 上传音频文件
        const formdata = new FormData()
        formdata.append('file', this.recordSource, Date.now().toString() + '.mp3')
        axios({
          url: '/website/files',
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((ress) => {
          this.form.source = ress.data.url
          // 提交发音记录
          axios.post('/pronunciation', { pronunciation: this.form }).then(() => {
            this.$message.success('提交成功！请等待审核通过~')
            this.handleCancel()
          })
        })
      })
    },
    handleCancel () {
      if (this.recorderReady && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
      }
      this.recording = false
      this.recordSourceURL = ''
      this.onCancel()
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
                const blob = new Blob(chunks, { type: 'audio/mpeg; codecs=mp3' })
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
