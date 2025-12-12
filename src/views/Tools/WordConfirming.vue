<template>
  <a-card title="审核列表">
    <a-table
      :columns="columns"
      :data-source="list"
      :loading="{spinning: spinning, delay: 500}"
      rowKey="application"
    >
      <span slot="customTitle"> Name</span>

      <div slot="word" slot-scope="text">
        <router-link v-if="text.word" :to="{name:'WordDetails',params:{id:text.word}}">
          {{ text.content.word }}
        </router-link>
        <a-tooltip v-else>
          <template slot="title">
            这是一个申请新创建的词条
          </template>
          {{ text.content.word }}
        </a-tooltip>
      </div>

      <div slot="contributor" slot-scope="text">
        <router-link v-if="text" :to="{name:'UserDetails',params:{id:text.contributor.id}}">
          <a-avatar :src="text.contributor.avatar"></a-avatar>
          {{ text.contributor.nickname }}
        </router-link>
      </div>

      <div slot="action" slot-scope="text">
        <router-link :to="{name:'Application',params:{id:text.application}}">
          <a-button>进入审核</a-button>
        </router-link>
      </div>
    </a-table>
  </a-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WordConfirming',
  data () {
    return {
      spinning: false,
      list: [],
      columns: [
        {
          title: '申请人',
          key: 'contributor',
          scopedSlots: { customRender: 'contributor' },
          align: 'center',
          width: 100
        },
        {
          title: '词条',
          key: 'word_word',
          scopedSlots: { customRender: 'word' },
          align: 'center',
          width: 100
        },
        {
          title: '更改理由',
          dataIndex: 'reason',
          key: 'reason',
          align: 'center',
          width: 100
        },

        {
          title: '审核情况',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 75
        }
      ]
    }
  },
  async created () {
    // 如果有token，等待App.vue中的refreshToken完成
    if (localStorage.getItem('token')) {
      // 等待用户ID被设置（表示refreshToken已完成）
      let retries = 0
      while (this.$store.getters.user.id === 0 && retries < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        retries++
      }
    }
    
    await this.$store.dispatch('userUpdate')
    if (this.$store.getters.user.is_admin === false) {
      this.$message.error('仅管理员有权访问该模块！或请重新登录！')
      this.$router.push({ name: 'Tools' })
    }
    axios.get('/words/applications').then(res => {
      this.list = res.data.applications
    })
  }
}
</script>

<style scoped>

</style>
