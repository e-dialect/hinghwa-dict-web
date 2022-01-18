<template>
  <a-card>
    <a-row justify="center" type="flex">
      <a-col :span="22">
        <a-table
          :columns="columns"
          :data-source="recordList"
          :loading="{spinning: tableLoading, delay: 500}"
          :pagination="pagination"
        >
          <span slot="customTitle"> Name</span>

          <div slot="word" slot-scope="text">

          <router-link   v-if="text"  :to="{name:'WordDetails',params:{id:text.pronunciation.word_id}}">
            {{text.pronunciation.word_word}}
          </router-link>
        </div>

          <div slot="contributor" slot-scope="text" >

 <router-link v-if="text" :to="{name:'UserDetails',params:{id:text.contributor.id}}">
          <a-avatar :src="text.contributor.avatar"></a-avatar>
          {{ text.contributor.nickname }}
 </router-link>
        </div>

          <div slot="source" slot-scope="record">
          <audio :src="record.source"  controls></audio>
        </div>

          <div slot="action" slot-scope="text,record,index">
         <a-switch :checked="record.visibility" @change="onChange(index)">
           <a-icon slot="checkedChildren" type="check" />
           <a-icon slot="unCheckedChildren" type="close" />
         </a-switch>
    </div>
        </a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Record',
  data () {
    return {
      total: 0,
      recordList: [],
      tableLoading: true,
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          width: 50
        },
        {
          title: '发音人',
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
          title: '拼音',
          dataIndex: 'pinyin',
          key: 'pinyin',
          align: 'center',
          width: 100
        },
        {
          title: '国际音标',
          dataIndex: 'ipa',
          key: 'ipa',
          align: 'center',
          width: 100
        },

        {
          title: '发音',
          key: 'source',
          scopedSlots: { customRender: 'source' },
          align: 'center',
          width: 50
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
  computed: {
    pagination () {
      return {
        onChange: async page => {
          await this.getCurrentPage(page)
          axios.get('/pronunciation', {
            params: {
              pageSize: this.pagination.pageSize,
              page: page + 1
            },
            cache: true
          })
        },
        pageSize: 20,
        simple: true,
        total: this.total
      }
    }
  },
  async created () {
    await this.getCurrentPage(1)
    axios.get('/pronunciation', {
      params: {
        pageSize: this.pagination.pageSize,
        page: 2
      },
      cache: true
    })
  },
  methods: {
    async getCurrentPage (page) {
      this.tableLoading = true
      await axios.get('/pronunciation', {
        params: {
          pageSize: this.pagination.pageSize,
          page: page
        },
        cache: true
      }).then(res => {
        this.recordList = res.data.pronunciation
        this.recordList.forEach((record, index) => {
          record.key = index
          for (const item in record.pronunciation) {
            if (item !== 'contributor') {
              record[item] = record.pronunciation[item]
            }
          }
        })
        this.total = res.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    onChange (index) {
      axios.put(`/pronunciation/${this.recordList[index].id}/visibility`).then(() => {
        const recordList = [...this.recordList]
        recordList[index].pronunciation.visibility = !recordList[index].pronunciation.visibility
        recordList[index].visibility = !recordList[index].visibility
        this.recordList = recordList
      })
    }
  }
}
</script>

<style scoped>

</style>
