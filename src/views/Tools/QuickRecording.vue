<template>
  <a-card
  >
    <template slot="title">
      <h2>快速录音</h2>
      <h5>
        为批量录音加速再加速<br>
        发音人县区
        <a-input v-model="form.county" style="width: 200px"/>
        <br>
        发音人乡镇
        <a-input v-model="form.town" style="width: 200px"/>
      </h5>
    </template>
    <a-modal
      :closable="false"
      :visible="toRecord!==-1"
      cancelText="取消"
      okText="提交"
      title="快速录制"
      @cancel="handleCancel()"
      @ok="handleOk()"
    >
      <a-form-model :model="form">
        <a-form-model-item label="词条">
          <h3>{{ form.item }} </h3>
        </a-form-model-item>
        <a-form-model-item label="释义">
          {{ form.definition }}
        </a-form-model-item>
        <a-form-model-item label="拼音">
          <a-input v-model="form.pinyin"/>
        </a-form-model-item>
        <a-form-model-item label="国际音标">
          <a-input v-model="form.ipa"/>
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
              {{ recording ? '停止录音' : '开始录音' }}
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

    <a-row justify="center" type="flex">
      <a-col :span="22">
        <a-table
          :columns="columns"
          :data-source="recordList"
          :loading="tableLoading"
        >
          <span slot="customTitle"> Name</span>
          <span slot="action" slot-scope="record">
         <a-button
           icon="audio"
           shape="circle"
           @click="toRecord=record.key"
         />
    </span>
        </a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>

import axios from 'axios'

export default {
  name: 'QuickRecording',
  data () {
    return {
      recordList: [
        // {
        //   word: 0,
        //   item: 'item',
        //   pinyin: 'pinyin',
        //   ipa: 'ipa',
        //   definition: 'definition',
        //   count: 0,
        //   key: 0
        // }
      ],
      recorderReady: false,
      mediaRecorder: null,
      toRecord: -1,
      recording: false,
      tableLoading: true,
      recordSourceURL: '',
      recordSource: null,
      form: {
        word: 0,
        item: '',
        pinyin: '',
        ipa: '',
        county: '',
        town: '',
        source: ''
      },
      columns: [
        {
          title: '词条号',
          dataIndex: 'word',
          key: 'word',
          align: 'center'
        },
        {
          title: '词条',
          dataIndex: 'item',
          key: 'item',
          align: 'center'
        },
        {
          title: '拼音',
          dataIndex: 'pinyin',
          key: 'pinyin',
          align: 'center'
        },
        {
          title: '国际音标',
          dataIndex: 'ipa',
          key: 'ipa',
          align: 'center'
        },
        {
          title: '释义',
          dataIndex: 'definition',
          key: 'definition',
          align: 'center'
        },
        {
          title: '已有录音数',
          dataIndex: 'count',
          key: 'count',
          align: 'center'
        },

        {
          title: '快速录制',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ]
    }
  },
  created () {
    axios.get('/record').then(res => {
      this.recordList = res.data.records
      this.recordList.forEach((record, index) => {
        record.key = index
      })
      this.tableLoading = false
    })
    if (this.$store.getters.loginStatus) {
      this.form.county = this.$store.getters.user.county
      this.form.town = this.$store.getters.user.town
    }
  },
  methods: {

    handleOk () {
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
        axios.post('/pronunciation', { pronunciation: this.form }).then(res => {
          this.$message.success('提交成功！请等待审核通过~')
          this.handleCancel()
        })
      })
    },
    handleCancel () {
      if (this.recorderReady && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
      }
      this.recording = false
      this.toRecord = -1
      this.recordSourceURL = ''
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
              this.mediaRecorder.onstart = e => {
                chunks = []
              }
              // 录音过程中
              this.mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data)
              }

              // 录音停止
              this.mediaRecorder.onstop = e => {
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
  },
  watch: {
    toRecord (newValue, oldValue) {
      if (newValue !== -1 && this.$store.getters.loginStatus === false) {
        this.toRecord = oldValue
        this.$message.error('请在登录后继续')
        return
      }
      if (newValue === -1) {
        if (this.recorderReady && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop()
        }
      } else {
        const record = this.recordList[newValue]
        this.form.word = record.word
        this.form.definition = record.definition
        this.form.item = record.item
        this.form.pinyin = record.pinyin
        this.form.ipa = record.ipa
      }
    }
  }
}
</script>

<style scoped>

</style>
