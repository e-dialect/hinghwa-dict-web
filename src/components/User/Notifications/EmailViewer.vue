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
  },
  computed: {
    // 标注对目标文本进行正则匹配并进行分段处理
    contentByType () {
      const regexes = [
        {
          regex: /语音\(id=[0-9]+\)/g,
          type: 'voice'
        },
        {
          regex: /词语\(id=[0-9]+\)/g,
          type: 'word'
        }
      ]
      const result = []
      regexes.forEach((item) => {
        // eslint-disable-next-line no-unused-expressions
        item.regex.exec(this.notification.content)?.forEach((pair) => {
          result.push({
            type: item.type,
            pair: pair
          })
        })
      })
      let tempContent = this.notification.content

      const newContent = []
      result.forEach((item) => {
        const head = tempContent.indexOf(item.pair)
        const tail = head + item.pair.length
        newContent.push({
          type: 'text',
          content: tempContent.substring(0, head)
        })
        newContent.push({
          type: item.type,
          content: tempContent.substring(head, tail),
          id: Number(item.pair.substring(7, item.pair.length - 1))
        })
        tempContent = tempContent.substring(tail)
      })
      newContent.push({
        type: 'text',
        content: tempContent
      })
      // console.log(newContent)
      return newContent
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
          <template v-for="(item, index) in contentByType">
            <template v-if="item.type === 'text'">{{ item.content }}</template>
            <template v-else-if="item.type === 'word'">
              <router-link :to="`/words/${item.id}`" :key="index">
                {{ item.content }}
              </router-link>
            </template>
            <template v-else-if="item.type === 'voice'">
              <router-link :to="`/voice/${item.id}`" :key="index">
                {{ item.content }}
              </router-link>
            </template>
          </template>
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
