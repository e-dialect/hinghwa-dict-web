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
          key: 'createTime',
          customRender: (text) => {
            return new Date(text).toLocaleDateString()
          }
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
          customRender: (text) => {
            return new Date(text).toLocaleDateString()
          }
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
      list: [],
      searchList: [],
      onSearch: false,
      searchValue: ''
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
    customRow (record) {
      return {
        on: {
          click: () => {
            this.$router.push(`/wordlist/${record.id}`)
          }
        }
      }
    },
    search () {
      if (this.searchValue === '') {
        this.onSearch = false
      } else {
        this.onSearch = true
        const tempList = []
        this.list.forEach(item => {
          if (item.name.includes(this.searchValue) ||
            item.description.includes(this.searchValue) ||
            item.author.nickname.includes(this.searchValue)) tempList.push(item)
        })
        this.searchList = tempList
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
    <a-row style="margin: 20px auto 10px auto">
      <a-input-search placeholder="搜索词单" style="width: 200px;margin-left: 25px" v-model="searchValue" @change="search"/>
      <a-button type="primary" style="margin-left: 15px" v-if="onSearch" @click="onSearch=false;searchValue=''">取消</a-button>
      <a-button type="primary" style="float:right;margin-right: 40px" @click="$router.push({name: 'WordListEditor'})">创建词单</a-button>
    </a-row>
    <a-row>
      <a-table
        :columns="columns"
        :dataSource="list"
        style="margin: 10px 20px"
        :pagination="false"
        :rowKey="res => res.name"
        :customRow="customRow"
        v-if="!onSearch"
      />
      <a-table
        :columns="columns"
        :dataSource="searchList"
        style="margin: 10px 20px"
        :pagination="false"
        :rowKey="res => res.name"
        :customRow="customRow"
        v-else
      />
    </a-row>
  </div>
</template>

<style scoped>
.body{
  width: 80%;
  background-color: white;
}
</style>
