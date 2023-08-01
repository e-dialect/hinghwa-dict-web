<script>
import GoodsCard from '@/components/Rewards/GoodsCard.vue'
import GoodsFilter from '@/components/Rewards/GoodsFilter.vue'
import axios from 'axios'
import { mapGetters } from 'vuex'
// import store from '@/store'
export default {
  name: 'Rewards',
  components: { GoodsCard, GoodsFilter },
  data () {
    return {
      goods: [],
      thisPage: 1,
      dataVolume: 0,
      onLoading: false,
      filter: {
        // -1表示不做限制
        minPoints: -1,
        maxPoints: -1,
        // 0表示筛选有货，1表示筛选无货，-1表示不做限制
        stock: -1
      }
    }
  },
  computed: {
    ...mapGetters({
      pointsNow: 'pointsNow'
    })
  },
  created () {
    this.updateTable()
  },
  methods: {
    updateTable () {
      this.onLoading = true
      return axios.get('/products', {
        params: {
          page: this.thisPage,
          pageSize: 8,
          min: this.filter.minPoints === -1 ? undefined : this.filter.minPoints,
          max: this.filter.maxPoints === -1 ? undefined : this.filter.maxPoints,
          stock: this.filter.stock === -1 ? undefined : this.filter.stock
        }
      }).then(res => {
        this.goods = res.data.result
        this.dataVolume = Number(res.data.amount)
        this.onLoading = false
      })
    }
  }
}
</script>

<template>
  <div class="body">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="积分商城"/>
    <span style="margin: 30px 0 0 30px;width: fit-content;display: flex;font-size: larger;line-height: 15px">
      剩余积分：<span style="font-weight: bold;margin-left: 2px;color: #a89154">{{ pointsNow }}</span>
      <a-popover title="如何获得积分？" placement="bottom">
        <template #content>
          <p>1.提供语料可获得大量积分</p>
          <p>2.发表高质量文章可获得积分</p>
          <p>3.文章被点赞可获得积分</p>
        </template>
        <div class="que-mark">?</div>
      </a-popover>
    </span>
    <div style="display: flex;flex-direction: column;align-items: center;">
      <a-card title="兑换商品" class="rewards-card" :loading="onLoading">
        <template #extra>
          <GoodsFilter @sendFilter="res => {filter = res;updateTable()}"/>
        </template>
        <GoodsCard v-for="(item, index) in goods" :detail="item" :key="index"/>
      </a-card>
      <a-pagination :total="dataVolume" :defaultPageSize="8"
                    v-model="thisPage" @change="updateTable"
                    style="margin: auto auto 20px auto"/>
    </div>
  </div>
</template>

<style scoped>
.body {
  width: 80%;
  background-color: white;
}
.rewards-card {
  width: 95%;
  margin: 20px;
}
.que-mark {
  border: black 1px solid;
  margin-left: 6px;
  border-radius: 50%;
  height: 15px;
  width: 15px;
  line-height: 15px;
  font-size: 11px;
  text-align: center;
}
</style>
