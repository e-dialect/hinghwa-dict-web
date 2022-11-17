<template>
  <div>
    <a-card>
      <template v-slot:title>
        <h2>邮箱（开发中）</h2>
        <a-descriptions :column="4">
          <a-descriptions-item label="消息数">
            {{ notification.statistics.total }}
          </a-descriptions-item>
          <a-descriptions-item label="已发送">
            {{ notification.statistics.sent }}
          </a-descriptions-item>
          <a-descriptions-item label="收件箱">
            {{ notification.statistics.received }}
          </a-descriptions-item>
          <a-descriptions-item label="未读消息">
            {{ notification.statistics.unread }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
      <a-tabs>
        <a-tab-pane tab="收件箱">
          <a-row justify="center" type="flex">
            <a-list
              :data-source="notification.received"
              style="width: 80%"
            >
              <div slot="header">
                <a-row :gutter="[64]">
                  <a-col :span="4">
                    <a-button style="width: 96px" type="primary"
                              @click="selected=[...notification.received.map((item)=>{return item.id})]">全选
                    </a-button>
                  </a-col>
                  <a-col :span="4">
                    <a-button style="width: 96px" type="primary" @click="selected=[]">全不选</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button @click="read(selected)">已读</a-button>
                  </a-col>
                </a-row>
              </div>

              <a-list-item slot="renderItem" slot-scope="item" style="margin: 0 32px">
                <a-checkbox
                  slot="actions"
                  :checked="Boolean(selected.find((i) => { return item.id === i }, item.id))"
                  @click="change(item.id)"
                />
                <a-list-item-meta
                  :description="item.time"
                  @click="open(item.id)"
                >
                  <div slot="title">
                    <a v-if="item.unread">{{ item.title }}</a>
                    <a v-else style="color: #8b8b8b">{{ item.title }}</a>
                  </div>
                  <a-avatar
                    slot="avatar"
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  />
                </a-list-item-meta>
              </a-list-item>
              <a-divider slot="footer" style="padding-top: 16px">我也是有底线嗒~</a-divider>
            </a-list>
          </a-row>
        </a-tab-pane>
      </a-tabs>
      <a-modal
        :title="current.title"
        :visible="currentId!==-1"
        cancelText="取消"
        okText="确认"
        @cancel="onClose"
        @ok="onClose"
      >
        <p>时间：{{ current.time }}</p>
        <p>内容：{{ current.content }}</p>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Notification',
  data () {
    return {
      selected: [],
      currentId: -1,
      current: {}
    }
  },
  async beforeMount () {
    await this.$store.dispatch('userUpdate')
  },
  computed: {
    notification () {
      return this.$store.getters.notification
    }
  },
  methods: {
    read (notifications) {
      axios.put('/website/notifications/unread', { notifications }).then(() => {
        this.$store.dispatch('userUpdate').then(() => {
          this.selected = []
          this.$message.success('操作成功')
        }).catch(() => {
          this.$message.error('更新邮箱过程中遇到错误')
        })
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    change (id) {
      const a = [...this.selected]
      let flag = false
      this.selected = []
      a.forEach((i) => {
        if (i === id) {
          flag = true
        } else {
          this.selected = [i, ...this.selected]
        }
      })
      if (flag === false) {
        this.selected = [id, ...this.selected]
      }
    },
    open (id) {
      axios.get(`/website/notifications/${id}`).then(res => {
        this.current = res.data
        this.currentId = id
      })
    },
    onClose () {
      this.$store.dispatch('userUpdate').then(() => {
        this.currentId = -1
      })
    }
  }
}
</script>

<style scoped>

</style>
