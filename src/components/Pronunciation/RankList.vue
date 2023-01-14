<template>
  <a-card>
    <template slot="title">
      <h2>录音贡献排行榜</h2>
      <h5>
        兴化语记的发展离不开每一位用户的支持，
        <br>
        让我们一起来看看哪些用户为我们倾情贡献了语音吧~
        <br>
      </h5>
    </template>
<!--    榜单选择区-->
    <span>请选择榜单类型：</span>
    <a-radio-group button-style="solid">
      <a-radio-button value="1" @click="weekRank">周榜</a-radio-button>
      <a-radio-button value="2" @click="monthRank">月榜</a-radio-button>
      <a-radio-button value="3" @click="allRank">总榜</a-radio-button>
    </a-radio-group>
<!--    榜单展示区-->
    <a-row justify="center" type="flex">
      <a-col :span="22">
        <a-table
          :columns="columns"
          :data-source="rankList"
        >
<!--          排名-->
          <div slot="rank" slot-scope="record">
            {{ record.key }}
          </div>
<!--          用户名-->
          <div slot="contributor" slot-scope="record">
            <router-link
              v-if="record"
              :to="{ name: 'UserDetails', params: { id: record.contributor.id } }"
            >
              <a-avatar :src="record.contributor.avatar"></a-avatar>
              {{ record.contributor.nickname }}
            </router-link>
          </div>
<!--          贡献语音的数量-->
          <div slot="amount" slot-scope="record">
              {{ record.amount }}
          </div>
        </a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RankList',
  data () {
    return {
      days: '',
      rankList: [],
      columns: [
        {
          title: '排名',
          scopedSlots: { customRender: 'rank' },
          key: 'rank',
          align: 'center'
        },
        {
          title: '用户名',
          key: 'contributor',
          scopedSlots: { customRender: 'contributor' },
          align: 'center'
        },
        {
          title: '已贡献语音数',
          key: 'amount',
          scopedSlots: { customRender: 'amount' },
          align: 'center'
        }
      ]
    }
  },
  methods: {
    weekRank () {
      axios.get('/pronunciation/ranking', { params: { days: 7 } }).then(res => {
        this.rankList = res.data.ranking
        this.rankList.forEach((record, index) => {
          record.key = index + 1
        })
      })
    },
    monthRank () {
      axios.get('/pronunciation/ranking', { params: { days: 30 } }).then(res => {
        this.rankList = res.data.ranking
        this.rankList.forEach((record, index) => {
          record.key = index + 1
        })
      })
    },
    allRank () {
      axios.get('/pronunciation/ranking', { params: { days: 0 } }).then(res => {
        this.rankList = res.data.ranking
        this.rankList.forEach((record, index) => {
          record.key = index + 1
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
