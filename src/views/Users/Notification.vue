<template>
  <div class="body">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="邮箱"/>
    <a-descriptions class="head-info">
      <a-descriptions-item label="未读消息">
        {{ unread }}
      </a-descriptions-item>
      <a-descriptions-item label="收件箱">
        {{ received }}
      </a-descriptions-item>
      <a-descriptions-item label="已发送">
        {{ sent }}
      </a-descriptions-item>
    </a-descriptions>
    <a-row style="display: flex;justify-content: center">
      <a-button type="primary" @click="writeNotification">写邮件</a-button>
    </a-row>
    <a-tabs style="padding: 0 5%">
      <a-tab-pane tab="收件箱" key="1">
        <InBox/>
      </a-tab-pane>
      <a-tab-pane tab="已发送" key="2">
        <Sent/>
      </a-tab-pane>
    </a-tabs>
    <SendNotification :visible="visible" @cancel="visible=false" @send="visible=false"/>
  </div>
</template>

<script>
import InBox from '@/components/User/Notifications/InBox.vue'
import SendNotification from '@/components/User/Notifications/SendNotification.vue'
import Sent from '@/components/User/Notifications/Sent.vue'

export default {
  name: 'Notification',
  components: { Sent, SendNotification, InBox },
  computed: {
    unread () { return this.$store.getters.notification.statistics.unread },
    sent () { return this.$store.getters.notification.statistics.sent },
    received () { return this.$store.getters.notification.statistics.received }
  },
  methods: {
    writeNotification () {
      this.visible = true
    }
  },
  data () {
    return {
      visible: false
    }
  }
}
</script>

<style scoped>
.body{
  width: 80%;
  background-color: white;
}
.head-info{
  margin: 20px 10% 10px;
}
</style>
