<template>
  <a-card title="审核列表">
    <a-table
      :columns="columns"
      :data-source="list"
      :loading="{spinning: spinning, delay: 500}"
      :pagination="pagination"
    >
      <span slot="customTitle"> Name</span>

      <div slot="word" slot-scope="text">
        <router-link v-if="text" :to="{name:'WordDetails',params:{id:text.word}}">
          {{ text.content.word }}
        </router-link>
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
  computed: {},
  async created () {
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
