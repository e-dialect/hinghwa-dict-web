<template>
  <div>
    <a-card>
      <template v-slot:title>
        <h2>邮箱（开发中）</h2>
        <a-descriptions :column="4">
          <a-descriptions-item label="消息数">
            {{ total }}
          </a-descriptions-item>
          <a-descriptions-item label="已发送">
            {{ sent }}
          </a-descriptions-item>
          <a-descriptions-item label="收件箱">
            {{ received }}
          </a-descriptions-item>
          <a-descriptions-item label="未读消息">
            {{ unread }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
      <a-tabs>
        <a-tab-pane tab="收件箱">
          <a-row justify="center" type="flex">
            <a-list
              :data-source="notifications"
              style="width: 80%"
            >
              <div slot="header">
                <a-row :gutter="[64]">
                  <a-col :span="4">
                    <a-button style="width: 96px" type="primary"
                              @click="selected=[...notifications.map((item)=>{return item.id})]">全选
                    </a-button>
                  </a-col>
                  <a-col :span="4">
                    <a-button style="width: 96px" type="primary" @click="selected=[]">全不选</a-button>
                  </a-col>
                  <a-col :span="4">
                    <a-button @click="read(selected)">已读</a-button>
                  </a-col>
                  <a-col :span="4">
                    <a-switch
                      v-model="onlyUnread"
                      checked-children="仅未读"
                      un-checked-children="全部"
                      @change="changePage(1,pageSize)"
                    />
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
                    :src="item.from.avatar"
                  />
                </a-list-item-meta>
              </a-list-item>
              <template slot="footer" v-if="dataLength">
                <a-pagination
                  v-model="page"
                  show-size-changer
                  :total="dataLength"
                  @showSizeChange="onShowSizeChange"
                  @change="changePage"
                />
              </template>
            </a-list>
          </a-row>
        </a-tab-pane>
      </a-tabs>
      <a-modal
        :title="current.title"
        :visible="currentId!==-1"
        cancelText="取消"
        okText="确认"
        @cancel="currentId=-1"
        @ok="currentId=-1"
      >
        <p>时间：{{ current.time }}</p>
        <p>内容：{{ current.content }}</p>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { readNotifications, receiveNotificatons, searchNotificatons } from '@/services/website'

export default {
  name: 'Notification',
  data () {
    return {
      unread: 0,
      sent: 0,
      received: 1,
      selected: [],
      currentId: -1,
      current: {},
      notifications: [],
      page: 1,
      pageSize: 10,
      dataLength: 0,
      onlyUnread: false
    }
  },
  async beforeMount () {
    await receiveNotificatons(this.id).then(res => {
      this.received = res.total
      this.notifications = res.notifications
    })
    this.sent = (await searchNotificatons({ from: this.id })).total
    this.unread = (await receiveNotificatons(this.id, true)).total
    this.dataLength = this.received
  },

  computed: {
    id () {
      return this.$store.getters.user.id
    },
    total () {
      return this.received + this.sent
    }
  },
  methods: {
    async changePage (page, pageSize) {
      await receiveNotificatons(this.id, this.onlyUnread, page, pageSize).then(res => {
        this.dataLength = res.total
        this.notifications = res.notifications
      })
    },
    async onShowSizeChange (current, size) {
      this.page = 1
      this.pageSize = size
      await receiveNotificatons(this.id, this.onlyUnread, 1, size).then(res => {
        this.dataLength = res.total
        this.notifications = res.notifications
      })
    },
    read (notifications) {
      readNotifications(notifications).then(async () => {
        await this.changePage(this.page, this.pageSize)
        this.$message.success('操作成功')
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
      this.currentId = id
      for (let i = 0; i < this.notifications.length; i++) {
        if (this.notifications[i].id === id) {
          this.current = this.notifications[i]
          if (!this.current.unread) return
          readNotifications([id])
          this.notifications[i].unread = false
          break
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
