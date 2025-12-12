<script>
import OrderManage from '@/components/Admin/Reward/OrderManage.vue'
import GoodsManage from '@/components/Admin/Reward/GoodsManage.vue'
export default {
  name: 'Rewards',
  components: { OrderManage, GoodsManage },
  data () {
    return {
      cardList: [
        {
          key: 'GoodsManage',
          tab: '商品管理'
        },
        {
          key: 'OrderManage',
          tab: '订单处理'
        }
      ],
      cardKey: 'GoodsManage'
    }
  },
  async created () {
    // 管理员身份验证
    // 如果有token，等待App.vue中的refreshToken完成
    if (localStorage.getItem('token')) {
      // 等待用户ID被设置（表示refreshToken已完成）
      let retries = 0
      while (this.$store.getters.user.id === 0 && retries < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        retries++
      }
    }
    
    await this.$store.dispatch('userUpdate')
    if (!this.$store.getters.user.is_admin) {
      this.$message.error('仅管理员有权访问该模块！或请重新登录！')
      await this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<template>
  <div class="body">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="积分商城（管理员）"/>
    <a-card style="width: 100%;"
            :tab-list="cardList"
            :active-tab-key="cardKey"
            @tabChange="key => cardKey = key">
      <GoodsManage v-if="cardKey==='GoodsManage'"/>
      <OrderManage v-if="cardKey==='OrderManage'"/>
    </a-card>
  </div>
</template>

<style scoped>
.body{
  width: 80%;
  background-color: white;
}
</style>
