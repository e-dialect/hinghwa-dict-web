<script>
import axios from 'axios'
export default {
  name: 'Transactions',
  data () {
    return {
      thisPage: 1,
      history: [],
      action: '',
      dataVolume: 0,
      onLoading: false,
      columns: [
        {
          title: '积分变动',
          dataIndex: 'points',
          key: 'points',
          width: '15%',
          filters: [
            { text: '增加', value: 'earn' },
            { text: '减少', value: 'redeem' },
            { text: '其他', value: 'other' }
          ],
          filterResetToDefaultFilteredValue: true,
          defaultFilteredValue: ['earn', 'redeem', 'other'],
          customRender: (text, record) => {
            if (record.action === 'earn') {
              return <span>+{text}</span>
            } else if (record.action === 'redeem') {
              return <span>-{text}</span>
            } else {
              return <span>+{text}</span>
            }
          }
        },
        {
          title: '变动时间',
          dataIndex: 'timestamp',
          key: 'timestamp',
          width: '20%',
          customRender: text => new Date(text).toLocaleString()
        },
        {
          title: '变动原因',
          dataIndex: 'reason',
          key: 'reason'
        }
      ]
    }
  },
  created () {
    this.updateTable()
  },
  methods: {
    updateTable () {
      this.onLoading = true
      return axios.get('/transactions', {
        params: {
          page: this.thisPage,
          action: this.action === '' ? undefined : this.action,
          pageSize: 10
        }
      }).then(res => {
        this.history = res.data.results
        this.dataVolume = Number(res.data.amount)
        this.onLoading = false
      })
    },
    handleChange (pagination, filters, sorter, { currentDataSource }) {
      this.action = filters.points.toString()
      this.$nextTick(() => {
        this.updateTable()
      })
    }
  }
}
</script>

<template>
  <div class="body">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="积分变动历史"></a-page-header>
    <div class="main">
      <a-table style="width: 90%;margin: auto"
               :columns="columns"
               :data-source="history"
               :pagination="false"
               :row-class-name="(record) => (record.action)"
               class="transaction-table"
               :loading="onLoading"
               :row-key="record => record.id"
               bordered
               @change="handleChange">
        <template #footer>
          <a-pagination :total="dataVolume" :defaultPageSize="10" v-model="thisPage" @change="updateTable"/>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
.body {
  width: 80%;
  background-color: white;
}
.main{
  text-align: center;
  margin-top: 30px;
}
.transaction-table >>> .earn :nth-child(1) {
  color: green;
  font-weight: bolder;
}
.transaction-table >>> .redeem :nth-child(1) {
  color: red;
  font-weight: bolder;
}
</style>
