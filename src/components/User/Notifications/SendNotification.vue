<script>
import axios from 'axios'
import { debounce } from '@/services/functions'

export default {
  name: 'SendNotification',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    notification: {
      type: Object
    }
  },
  data () {
    return {
      notificationInfo: {
        recipients: [],
        title: '',
        content: ''
      },
      recipientsInfo: []
    }
  },
  created () {
    if (this.notification) {
      this.notificationInfo.recipients[0] = this.notification.from.id
      this.notificationInfo.title = `【回复：“${this.notification.title}”】`
      this.searchId()
    }
  },
  computed: {
    recipientsShow: {
      get () {
        return String(this.notificationInfo.recipients)
      },
      set (value) {
        this.notificationInfo.recipients = value.split(',')
      }
    }
  },
  methods: {
    debounce,
    // 根据数组查找对象
    async searchId () {
      const tempRecipients = []
      await this.notificationInfo.recipients.forEach((item) => {
        if (isNaN(Number(item)) || item === '') return
        axios.get(`/users/${item}`).then(res => {
          tempRecipients.push({
            id: res.data.user.id,
            nickname: res.data.user.nickname,
            avatar: res.data.user.avatar
          })
        }).catch(() => {})
      })
      this.recipientsInfo = tempRecipients
    },
    // 发送通知
    async sendEmail () {
      await axios.post('/website/notifications', this.notificationInfo).then(() => {
        this.$message.success('发送成功')
        this.$emit('cancel')
      }).catch(() => {})
    }
  },
  emits: ['cancel', 'send']
}
</script>

<template>
  <div>
    <a-modal :visible="visible" title="发送信息" width="55%"
             ok-text="发送" cancel-text="关闭"
             @cancel="()=>{$emit('cancel');}"
             @ok="()=>{sendEmail();$emit('send');}"
    >
      <a-form :label-col="{span: 4}" :wrapper-col="{span: 20}">
        <a-form-item label="收件人ID">
          <a-tooltip :trigger="['focus']" placement="bottomLeft">
            <template #title>
              <div v-if="recipientsInfo.length!==0">
                <div v-for="(item, index) in recipientsInfo" :key="index" style="margin: 5px 0">
                  <a-avatar :src="item.avatar" style="margin: 0 5px 0 0"/>
                  {{ item.nickname }}
                </div>
              </div>
              <div v-else>
                用户ID，多个用户用英文逗号隔开
              </div>
            </template>
            <a-input v-model="recipientsShow" @change="debounce(searchId)"/>
          </a-tooltip>
        </a-form-item>
        <a-form-item label="主题">
          <a-input v-model="notificationInfo.title"/>
        </a-form-item>
        <a-form-item label="内容">
          <a-textarea :auto-size="{minRows: 5, maxRows: 10}" v-model="notificationInfo.content"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
