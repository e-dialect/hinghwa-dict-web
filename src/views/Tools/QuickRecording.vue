<template>
  <a-card
  >
    <template slot="title">
      <h2>快速录音</h2>
      <h5>
          为批量录音加速再加速（此功能需要先行登录）
          <br>
          已经从用户资料中获取默认的县区和乡镇信息，实际情况请修改在文本框中~
          <br>
        发音人县区
        <a-input v-model="form.county" style="width: 200px;margin:5px"/>
        <br>
        发音人乡镇
        <a-input v-model="form.town" style="width: 200px;margin:5px"/>
      </h5>
    </template>
    <recording
      :form="form"
      :onCancel="()=>{this.toRecord=-1}"
      :visible="toRecord!==-1">
    </recording>
    <a-row justify="center" type="flex">
      <a-col :span="22">
        <a-table
          :columns="columns"
          :data-source="recordList"
          :loading="{spinning: tableLoading, delay: 500}"
          :pagination="pagination"
        >
          <span slot="customTitle"> Name</span>
          <span slot="action" slot-scope="record">
         <a-button
           icon="audio"
           shape="circle"
           @click="toRecord=record.key"
         />
    </span>
        </a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>

import axios from 'axios'
import Recording from '../../components/Recording.vue'

export default {
  name: 'QuickRecording',
  components: { Recording },
  data () {
    return {
      recordList: [
        // {
        //   word: 0,
        //   item: 'item',
        //   pinyin: 'pinyin',
        //   ipa: 'ipa',
        //   definition: 'definition',
        //   count: 0,
        //   key: 0
        // }
      ],
      toRecord: -1,
      total: 6000,
      defaultCurrent: Math.ceil(Math.random() * 300),
      tableLoading: true,
      form: {
        word: 0,
        item: '',
        pinyin: '',
        ipa: '',
        county: '',
        town: '',
        source: ''
      },
      columns: [
        {
          title: '词条号',
          dataIndex: 'word',
          key: 'word',
          align: 'center'
        },
        {
          title: '词条',
          dataIndex: 'item',
          key: 'item',
          align: 'center'
        },
        {
          title: '拼音',
          dataIndex: 'pinyin',
          key: 'pinyin',
          align: 'center'
        },
        {
          title: '国际音标',
          dataIndex: 'ipa',
          key: 'ipa',
          align: 'center'
        },
        {
          title: '释义',
          dataIndex: 'definition',
          key: 'definition',
          align: 'center'
        },
        {
          title: '已有录音数',
          dataIndex: 'count',
          key: 'count',
          align: 'center'
        },

        {
          title: '快速录制',
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
          axios.get('/record', {
            params: {
              pageSize: this.pagination.pageSize,
              page: page + 1
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
    if (this.$store.getters.loginStatus) {
      await this.$store.dispatch('userUpdate')
      this.form.county = this.$store.getters.user.county
      this.form.town = this.$store.getters.user.town
    } else {
      this.$message.warning('没有登录将无法录音！')
    }
    await this.getCurrentPage(this.defaultCurrent)
    axios.get('/record', {
      params: {
        pageSize: this.pagination.pageSize,
        page: this.defaultCurrent + 1
      },
      cache: true
    })
  },
  methods: {
    async getCurrentPage (page) {
      this.tableLoading = true
      await axios.get('/record', {
        params: {
          pageSize: this.pagination.pageSize,
          page: page
          // TODO: keyword: this.searchText
        },
        cache: true
      }).then(res => {
        this.recordList = res.data.records
        this.recordList.forEach((record, index) => {
          record.key = index
        })
        this.total = res.data.total.item
      }).finally(() => {
        this.tableLoading = false
      })
    }
  },
  watch: {
    toRecord (newValue, oldValue) {
      if (newValue !== -1 && this.$store.getters.loginStatus === false) {
        this.toRecord = oldValue
        this.$message.error('请在登录后继续')
        return
      }
      if (newValue === -1) {
        if (this.recorderReady && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop()
        }
      } else {
        const record = this.recordList[newValue]
        this.form.word = record.word
        this.form.definition = record.definition
        this.form.item = record.item
        this.form.pinyin = record.pinyin
        this.form.ipa = record.ipa
      }
    }
  }
}
</script>

<style scoped>

</style>
