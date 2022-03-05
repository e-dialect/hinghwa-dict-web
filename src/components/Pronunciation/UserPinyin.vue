<template>
  <a-row justify="center" type="flex">
    <a-col :span="22">
      <a-table
        :columns="columns"
        :data-source="pronunciation"
        :pagination="pagination"
      >
         <span slot="status" slot-scope="text, record">
          <a-badge status="warning" color="red" title="暂未通过审核" v-if="!record.pronunciation.visibility"/>
          <a-badge status="success" title="已经通过审核" v-else/>
        </span>
        <span slot="word" slot-scope="text, record">
          <router-link :to="{name:'WordDetails',params:{id:record.pronunciation.word_id.toString()}}">
            {{ record.pronunciation.word_word }}
          </router-link>
        </span>
        <span slot="customTitle"> Name</span>
        <span slot="action" slot-scope="text, record">
          <audio
            :src="record.pronunciation.source"
            controls
            style="width: 128px"
          />
        </span>
      </a-table>
    </a-col>
  </a-row>

</template>

<script>
import axios from 'axios'

export default {
  name: 'UserPinyin',
  props: ['id'],
  data () {
    return {
      total: 0,
      pronunciation: [
        // {
        //   key: 1,
        //   pronunciation: {
        //     id: 19,
        //     word_id: 16,
        //     word_word: '阿尾哥',
        //     source: '',
        //     ipa: 'ap1 puai13 ko533',
        //     pinyin: 'a1 bue3 go1',
        //     contributor: 5,
        //     county: '涵江',
        //     town: '国欢',
        //     visibility: true
        //   },
        //   contributor: {
        //     id: 5,
        //     nickname: '这只是一个测试账号呢',
        //     avatar: ''
        //   }
        // }
      ],
      columns: [
        {
          title: '状态',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '词条',
          scopedSlots: { customRender: 'word' },
          key: 'item',
          align: 'center'
        },
        {
          title: '拼音',
          dataIndex: 'pronunciation.pinyin',
          key: 'pinyin',
          align: 'center'
        },
        {
          title: '国际音标',
          dataIndex: 'pronunciation.ipa',
          key: 'ipa',
          align: 'center'
        },
        {
          title: '县区',
          dataIndex: 'pronunciation.county',
          key: 'county',
          align: 'center'
        },
        {
          title: '乡镇',
          dataIndex: 'pronunciation.town',
          key: 'town',
          align: 'center'
        },
        {
          title: '录音',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
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
              page: page + 1,
              contributor: this.id
            },
            cache: true
          })
        },
        pageSize: 20,
        simple: true,
        total: this.total,
        defaultCurrent: this.defaultCurrent
      }
    }
  },
  async created () {
    await this.getCurrentPage(0)
    axios.get('/record', {
      params: {
        pageSize: this.pagination.pageSize,
        page: 1
      },
      cache: true
    })
  },
  methods: {
    getCurrentPage: function (page) {
      axios.get('/pronunciation', {
        params: {
          pageSize: this.pagination.pageSize,
          page: page + 1,
          contributor: this.id
        },
        cache: true
      }).then(res => {
        this.total = res.data.total
        this.pronunciation = res.data.pronunciation
      })
    }
  }
}
</script>

<style scoped>

</style>
