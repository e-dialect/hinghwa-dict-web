<script>

import TitleCard from '@/components/Rewards/TitleRange/TitleCard.vue'
import axios from 'axios'
import TitleFilter from '@/components/Rewards/TitleRange/TitleFilter.vue'

export default {
  name: 'TitleRange',
  components: { TitleFilter, TitleCard },
  data () {
    return {
      titles: [],
      onLoading: false,
      filter: {
        // -1表示不做限制
        minPoints: -1,
        maxPoints: -1
      },
      clickedIndex: -1,
      modalVisible: false
    }
  },
  created () {
    this.updateTable()
  },
  methods: {
    updateTable () {
      this.onLoading = true
      return axios.get('/titles', {
        params: {
          min: this.filter.minPoints === -1 ? undefined : this.filter.minPoints,
          max: this.filter.maxPoints === -1 ? undefined : this.filter.maxPoints
        }
      }).then(res => {
        this.titles = res.data.result
        this.onLoading = false
      })
    },
    clickExchange (index) {
      this.clickedIndex = index
      this.modalVisible = true
    },
    exchange () {
      this.modalVisible = false
      this.$message.success('兑换成功！')
    }
  }
}
</script>

<template>
  <div style="display: flex;flex-direction: column;align-items: center;">
    <a-card title="兑换商品" class="rewards-card" :loading="onLoading">
      <template #extra>
        <TitleFilter @sendFilter="res => {filter=res;updateTable()}"/>
      </template>
      <TitleCard v-for="(item, index) in titles" :detail="item" :key="index" :index="index" @clickExchange="clickExchange"/>
    </a-card>
    <a-modal title="兑换称号" :visible="modalVisible" v-if="clickedIndex!==-1" @cancel="modalVisible=false" @ok="exchange">
      <p>确认兑换称号<span style="margin: 5px;color: #8c8c8c">{{titles[clickedIndex].name}}</span>吗？</p>
    </a-modal>
  </div>
</template>

<style scoped>
.rewards-card {
  width: 95%;
  margin: 20px;
}
</style>
