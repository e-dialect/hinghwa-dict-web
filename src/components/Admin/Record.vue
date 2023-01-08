<template>
  <div>
    <a-modal
      :confirm-loading="confirmLoading"
      :visible="toConfirm !== -1"
      cancelText="返回"
      okText="提交"
      title="审核意见"
      @cancel="toConfirm=-1"
    >
      <a-textarea v-model="reason" placeholder="审核结果说明"/>
      <div slot="footer">
        <a-button icon="check" type="primary" @click="handleSubmit(toConfirm,true)"> 审核通过</a-button>
        <a-button icon="close" type="danger" @click="handleSubmit(toConfirm,false)"> 拒绝通过</a-button>
      </div>
    </a-modal>
    <a-table
      :columns="columns"
      :data-source="recordList"
      :loading="{ spinning: tableLoading, delay: 500 }"
      :pagination="pagination"
    >

      <div slot="id" slot-scope="text">
        <a
          :href="`${BASE_URL}/admin/word/pronunciation/${text.id}/change/`"
        >
          <!--FIXME-->
          {{ text.id }}
        </a>
      </div>

      <div slot="word" slot-scope="text">
        <router-link
          v-if="text"
          :to="{ name: 'WordDetails', params: { id: text.pronunciation.word_id } }"
        >
          {{ text.pronunciation.word_word }}
        </router-link>
      </div>

      <div slot="contributor" slot-scope="text">
        <router-link
          v-if="text"
          :to="{ name: 'UserDetails', params: { id: text.contributor.id } }"
        >
          <a-avatar :src="text.contributor.avatar"></a-avatar>
          {{ text.contributor.nickname }}
        </router-link>
      </div>

      <div slot="pinyin" slot-scope="text,record,index">
        <span
          v-if="!record.editable"
        >
          {{ text }}
        </span>
        <a-textarea
          v-else
          v-model="recordList[index].pronunciation.pinyin"
          :autosize="true"
        />
      </div>

      <div slot="ipa" slot-scope="text,record,index">
        <div
          v-if="!record.editable"
        >
          {{ text }}
        </div>
        <a-textarea
          v-else
          v-model="recordList[index].pronunciation.ipa"
          :autosize="true"
        />
      </div>

      <div slot="source" slot-scope="record">
        <audio :src="record.source" controls preload="none" style="max-width: 128px"></audio>
      </div>

<!--      审核情况列-->
      <div slot="recordStatus" slot-scope="text"
           style="width: 70px"
           :class="{pass:text.recordStatus==='已通过',fail:text.recordStatus==='不通过',unreviewed:text.recordStatus==='未审核'}">
        <div>{{ text.recordStatus}}</div>
      </div>

<!--      操作列-->
      <div slot="action" slot-scope="text,record,index">
        <a-button v-if="!text.granted" @click="toConfirm=text.id;reason=''">
          审核
        </a-button>
        <a-popover v-else>
          <template slot="content">
            审核人
            <router-link
              v-if="text"
              :to="{ name: 'UserDetails', params: { id: text.verifier.id } }"
            >
              <a-avatar :src="text.verifier.avatar"></a-avatar>
              {{ text.verifier.nickname }}
            </router-link>
          </template>
          <a-popconfirm
            title="您做的修改将无法保留，且会再次向修改人发送邮件通知修改结果，您确定要重新审核吗？"
            @confirm="toConfirm=text.id;reason=''"
            okText="确定"
            cancelText="取消">
            <a-button v-if="record.editable">
              重新审核
            </a-button>
          </a-popconfirm>
        </a-popover>
        <a-button
          v-if="!record.editable"
          type="link"
          @click="edit(index,true)"
        >
          编辑
        </a-button>
        <div v-else>
          <a-popconfirm
            cancel-text="取消"
            ok-text="确定"
            title="此次修改将保存至数据库，是否继续保存？"
            @confirm="updatePronunciation(index)"
          >
            <a-button type="link"> 保存修改</a-button>
          </a-popconfirm>
          <a-button
            type="link"
            @click="edit(index,false)"
          >
            取消修改
          </a-button>
          <a-popconfirm
            cancel-text="取消"
            ok-text="确定"
            title="删除语音后不可恢复，你确定要删除？"
            @confirm="deletePronunciation(record.id)"
          >
            <a-button style="color: red" type="link"> 删除语音</a-button>
          </a-popconfirm>

        </div>
      </div>
    </a-table>
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '@/consts/urls'

export default {
  name: 'Record',
  data () {
    return {
      BASE_URL: BASE_URL,
      total: 300,
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
          scopedSlots: { customRender: 'pinyin' },
          align: 'center',
          width: 100
        },
        {
          title: '国际音标',
          dataIndex: 'ipa',
          key: 'ipa',
          scopedSlots: { customRender: 'ipa' },
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
          key: 'recordStatus',
          scopedSlots: { customRender: 'recordStatus' },
          align: 'center',
          width: 50,
          filters: [
            {
              text: '未审核',
              value: '未审核'
            },
            {
              text: '已通过',
              value: '已通过'
            },
            {
              text: '不通过',
              value: '不通过'
            }
          ],
          onFilter: (value, record) => record.recordStatus.indexOf(value) === 0
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 50
        }
      ],

      toConfirm: -1,
      confirmLoading: false,
      result: false,
      reason: '',
      current: 1
    }
  },
  computed: {
    pagination () {
      return {
        onChange: async (page) => {
          this.current = page
          await this.getCurrentPage(page)
          return axios.get('/pronunciation', {
            params: {
              pageSize: this.pagination.pageSize,
              page: page + 1,
              order: 1
            }
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
  },
  methods: {
    async getCurrentPage (page) {
      this.tableLoading = true
      await axios
        .get('/pronunciation', {
          params: {
            pageSize: this.pagination.pageSize,
            page: page,
            order: 1
          }
        })
        .then((res) => {
          this.recordList = res.data.pronunciation
          this.recordList.forEach(item => {
            this.$set(item, 'recordStatus', '未审核')
            if (item.pronunciation.visibility === false && item.pronunciation.granted === true) {
              item.recordStatus = '不通过'
            } else if (item.pronunciation.visibility === true && item.pronunciation.granted === true) {
              item.recordStatus = '已通过'
            } else if (item.pronunciation.granted === false) {
              item.recordStatus = '未审核'
            }
          })
          this.recordList.forEach((record, index) => {
            record.key = index
            record.editable = false
            for (const item in record.pronunciation) {
              if (item !== 'contributor') {
                record[item] = record.pronunciation[item]
              }
            }
          })
          this.total = res.data.total
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    handleSubmit (id, result) {
      const obj = { result: result }
      if (!result && !this.reason) {
        this.$message.warning('审核不通过必须填写情况说明')
        return
      }
      if (this.reason) obj.reason = this.reason
      this.confirmLoading = true
      axios.put(`/pronunciation/${id}/examine`, obj)
        .then(async () => {
          await this.getCurrentPage(this.current)
          this.$message.success('已审核')
          this.toConfirm = -1
        }).finally(() => {
          this.confirmLoading = false
        })
    },
    edit (index, result) {
      this.recordList[index].editable = result
      this.recordList = [...this.recordList]
    },
    updatePronunciation (index) {
      const old = this.recordList[index]
      const pronunciation = {
        word: old.word_id,
        source: old.source,
        ipa: old.pronunciation.ipa,
        pinyin: old.pronunciation.pinyin,
        county: old.county,
        town: old.town
      }
      axios.put(`/pronunciation/${old.id}`, { pronunciation }).then(async () => {
        await this.getCurrentPage(this.current)
        this.$message.success('保存成功')
      })
    },
    deletePronunciation (id) {
      axios.delete(`/pronunciation/${id}`, { data: {} }).then(async () => {
        await this.getCurrentPage(this.current)
        this.$message.success('删除成功！')
      })
    }
  }
}
</script>

<style scoped>
.pass{
  color: #89e85c;
}
.unreviewed{
  color: #8b8b8b;
}
.fail{
  color: #ff3e31;
}
</style>
