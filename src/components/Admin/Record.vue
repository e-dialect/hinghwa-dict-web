<template>
  <a-card>
    <template slot="title">
      <h2>录音审核</h2>
      <div>
        使用帮助：<br>
        <ul>
          <li>点击编号进入后台管理页面修改对应编号的内容</li>
          <li>点击发音人查看发音人详细信息</li>
          <li>点击词条查看对应词条的具体内容</li>
          <li>点击发音可以播放对应的音频信息</li>
          <li>点击审核情况可以修改对应录音的审核情况</li>
          <li>如果只能查看到已审核的信息说明登录已经失效，请重新登录！</li>
        </ul>
      </div>
    </template>
    <a-row justify="center" type="flex">
      <a-col :span="22">
        <a-table
          :columns="columns"
          :data-source="recordList"
          :loading="{spinning: tableLoading, delay: 500}"
          :pagination="pagination"
        >
          <span slot="customTitle"> Name</span>

          <div slot="id" slot-scope="text">
            <a :href="`https://api.pxm.edialect.top/adminword/pronunciation/${text.id}/change/`">
              {{text.id}}
            </a>
          </div>

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
          scopedSlots: { customRender: 'id' },
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
