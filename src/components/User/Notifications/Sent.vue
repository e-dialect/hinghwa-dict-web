<script>
import axios from 'axios'
import EmailViewer from '@/components/User/Notifications/EmailViewer.vue'
import { refreshToken } from '@/services/login'
import { debounce } from '@/services/functions'

export default {
  name: 'Sent',
  components: { EmailViewer },
  data () {
    return {
      notifications: [],
      filter: {
        to: '',
        toInfo: {
          nickname: '',
          avatar: ''
        },
        toErrorInfo: '输入接收者ID以筛选'
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
          from: this.$store.getters.user.id,
          to: this.filter.to === '' ? undefined : this.filter.to
        }
      }).then(res => {
        this.notifications = res.data.notifications
        this.pagination.total = res.data.total
      }).catch(() => {})
    },
    // 根据用户输入Id获取指定用户信息
    searchId () {
      if (this.filter.to === '') {
        this.filter.toErrorInfo = '输入接收者ID以筛选'
      } else if (Number(this.filter.to) <= 0) {
        this.filter.toErrorInfo = 'ID必须为正整数'
      } else if (String(this.filter.to).length >= 6) {
        this.filter.toErrorInfo = 'ID过长'
      } else {
        axios.get('/users/' + this.filter.to).then(res => {
          this.filter.toErrorInfo = ''
          this.filter.toInfo.nickname = res.data.user.nickname
          this.filter.toInfo.avatar = res.data.user.avatar
        }).catch((res) => {
          this.filter.toErrorInfo = '用户不存在'
        })
      }
    },
    // 处理用户点击查看
    async handleView (index) {
      this.modal.targetIndex = index
      this.modal.visible = true
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
      <a-tooltip :trigger="['focus']" placement="topLeft">
        <template #title>
          <div v-if="filter.toErrorInfo===''">
            <a-avatar :src="filter.toInfo.avatar" style="margin: 0 5px 0 0"/>
            {{ filter.toInfo.nickname }}
          </div>
          <div v-else>
            {{ filter.toErrorInfo }}
          </div>
        </template>
        <a-input v-model="filter.to" placeholder="请输入接收者ID" style="width: 200px;margin-right: 10px" type="number" :min="1" @change="debounce(searchId)"/>
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
              <a-avatar :src="item.to.avatar"/>
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
