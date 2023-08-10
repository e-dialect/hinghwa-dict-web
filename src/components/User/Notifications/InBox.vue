<script>
import axios from 'axios'
import EmailViewer from '@/components/User/Notifications/EmailViewer.vue'
import { refreshToken } from '@/services/login'
import { debounce } from '@/services/functions'

export default {
  name: 'InBox',
  components: { EmailViewer },
  data () {
    return {
      notifications: [],
      filter: {
        onlyUnread: false,
        from: '',
        fromInfo: {
          nickname: '',
          avatar: ''
        },
        fromErrorInfo: '输入发送者ID以筛选'
      },
      pagination: {
        pageSize: 10,
        thisPage: 1,
        total: 0,
        loading: false
      },
      modal: {
        targetIndex: -1,
        visible: false
      }
    }
  },
  methods: {
    debounce,
    async updatePage () {
      await axios.get('/website/notifications', {
        params: {
          unread: this.filter.onlyUnread ? 'True' : undefined,
          page: this.pagination.thisPage,
          pageSize: this.pagination.pageSize,
          from: this.filter.from === '' ? undefined : this.filter.from,
          to: this.$store.getters.user.id
        }
      }).then(res => {
        this.notifications = res.data.notifications
        this.pagination.total = res.data.total
      }).catch(() => {})
    },
    // 根据用户输入Id获取指定用户信息
    searchId () {
      if (this.filter.from === '') {
        this.filter.fromErrorInfo = '输入发送者ID以筛选'
      } else if (Number(this.filter.from) <= 0) {
        this.filter.fromErrorInfo = 'ID必须为正整数'
      } else if (String(this.filter.from).length >= 6) {
        this.filter.fromErrorInfo = 'ID过长'
      } else {
        axios.get('/users/' + this.filter.from).then(res => {
          this.filter.fromErrorInfo = ''
          this.filter.fromInfo.nickname = res.data.user.nickname
          this.filter.fromInfo.avatar = res.data.user.avatar
        }).catch((res) => {
          this.filter.fromErrorInfo = '用户不存在'
        })
      }
    },
    // 处理用户点击查看
    async handleView (index) {
      this.modal.targetIndex = index
      this.modal.visible = true
      await axios.put('/website/notifications/unread', {
        notifications: [this.notifications[index].id]
      }).then(() => {
        this.notifications[index].unread = false
        this.$store.commit('setUnread', this.$store.getters.notification.statistics.unread - 1)
      }).catch(() => {})
    }
  },
  async beforeMount () {
    await refreshToken()
    await this.updatePage()
  }
}
</script>

<template>
  <div>
    <div class="filter">
      <a-checkbox v-model="filter.onlyUnread" style="margin-right: 10px" @change="updatePage">只看未读</a-checkbox>
      <a-tooltip :trigger="['focus']" placement="topLeft">
        <template #title>
          <div v-if="filter.fromErrorInfo===''">
            <a-avatar :src="filter.fromInfo.avatar" style="margin: 0 5px 0 0"/>
            {{ filter.fromInfo.nickname }}
          </div>
          <div v-else>
            {{ filter.fromErrorInfo }}
          </div>
        </template>
        <a-input v-model="filter.from" placeholder="请输入发送者ID" style="width: 200px; margin-left: 30px;margin-right: 10px" type="number" :min="1" @change="debounce(searchId)"/>
      </a-tooltip>
      <a-button type="primary" @click="updatePage">确定</a-button>
    </div>
    <a-list item-layout="horizontal" :loading="pagination.loading">
      <template v-for="(item, index) in notifications">
        <a-list-item :key="index">
          <a-list-item-meta :description="item.time">
            <template #title>
              <span>{{ item.title }}</span>
              <span v-if="item.unread" style="margin-left: 7px;border-radius: 4px;background-color:#5e5e5e;color: white;padding: 1px 4px;font-size: 0.9em">未读</span>
            </template>
            <template #avatar>
              <a-avatar :src="item.from.avatar"/>
            </template>
          </a-list-item-meta>
          <span slot="actions">
            <a-button type="link" @click="handleView(index)">查看</a-button>
          </span>
        </a-list-item>
      </template>
    </a-list>
    <div style="display: flex;justify-content: center">
      <a-pagination :total="pagination.total" :defaultPageSize="pagination.pageSize" v-model="pagination.thisPage" @change="updatePage"
                    style="margin: 30px 0"/>
    </div>
    <EmailViewer :notification="notifications[modal.targetIndex]"
                 :visible="modal.visible"
                 v-if="modal.targetIndex!==-1"
                 @cancel="()=>{modal.targetIndex=-1;modal.visible=false}"
                 @reply="()=>{modal.visible=false;}"/>
  </div>
</template>

<style scoped>
.filter {
  margin-bottom: 10px;
}
</style>
