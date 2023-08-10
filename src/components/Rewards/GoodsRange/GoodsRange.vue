<script>
import GoodsCard from '@/components/Rewards/GoodsRange/GoodsCard.vue'
import GoodsFilter from '@/components/Rewards/GoodsRange/GoodsFilter.vue'
import axios from 'axios'

export default {
  name: 'GoodsRange',
  components: { GoodsFilter, GoodsCard },
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
</template>

<style scoped>
.rewards-card {
  width: 95%;
  margin: 20px;
}
</style>
