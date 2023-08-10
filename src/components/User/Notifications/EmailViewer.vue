<script>
import SendNotification from '@/components/User/Notifications/SendNotification.vue'

export default {
  name: 'EmailViewer',
  components: { SendNotification },
  props: {
    notification: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      replyModal: {
        visible: false
      }
    }
  }
}
</script>

<template>
  <div>
    <a-modal :visible="visible" title="邮件详情" width="55%"
             ok-text="回复" cancel-text="关闭"
             @cancel="()=>{$emit('cancel');}"
             @ok="()=>{$emit('reply');replyModal.visible=true;}"
    >
      <a-descriptions :title="notification.title" :column="1" style="margin: 0 30px 0">
        <a-descriptions-item label="发送者">
          <router-link :to="{name: 'UserDetails', params: {id: String(notification.from.id)}}">
            {{ notification.from.nickname }}
          </router-link>
        </a-descriptions-item>
        <a-descriptions-item label="发送时间">
          {{ notification.time }}
        </a-descriptions-item>
        <a-descriptions-item label="内容">
          {{ notification.content }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
    <SendNotification
      :visible="replyModal.visible"
      @cancel="()=>{replyModal.visible=false}"
      @send="()=>{replyModal.visible=false}"
      :notification="notification"/>
  </div>
</template>

<style scoped>

</style>
