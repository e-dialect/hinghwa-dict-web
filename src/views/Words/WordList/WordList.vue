<script>
export default {
  name: 'WordList',
  data () {
    return {
      columns: [
        {
          title: '词单名称',
          dataIndex: 'name',
          key: 'name',
          width: '15%'
        },
        {
          title: '创建者',
          dataIndex: 'author',
          key: 'author',
          width: '10%',
          customRender: (text) => {
            return text.nickname
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          key: 'updateTime'
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '词单长度',
          dataIndex: 'length',
          key: 'length',
          width: '10%'
        }
      ],
      list: []
    }
  },
  methods: {
    async getList () {
      await this.$axios.get('/lists').then(res => {
        this.list = res.data.lists
      }).catch(() => {
        this.$message.error('拉取词单列表失败')
      })
    },
    customRow (record, index) {
      return {
        on: {
          click: () => {
            this.$router.push(`/wordlist/${record.id}`)
          }
        }
      }
    }
  },
  async beforeMount () {
    await this.getList()
  }
}
</script>

<template>
  <div class="body">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="词单"/>
    <a-table
      :columns="columns"
      :dataSource="list"
      style="margin: 10px 20px"
      :pagination="false"
      :rowKey="res => res.name"
      :customRow="customRow"
    >
    </a-table>
  </div>
</template>

<style scoped>
.body{
  width: 80%;
  background-color: white;
}
</style>
