<script>
import OrderCard from '@/components/Admin/Reward/OrderCard.vue'
export default {
  name: 'OrderManage',
  components: { OrderCard },
  data () {
    return {
      orders: [
        {
          id: '1',
          name: '马克杯',
          user: 'Shxuuer',
          fullName: '张三',
          phone: '123123123',
          address: '北京市朝阳区',
          notes: '无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注无备注',
          status: '未发货',
          orderId: ''
        },
        {
          id: '2',
          name: '马克杯',
          user: 'Shxuuer',
          fullName: '张三',
          phone: '123123123',
          address: '北京市朝阳区',
          notes: '无备注',
          status: '已发货',
          orderId: ''
        },
        {
          id: '2',
          name: '马克杯',
          user: 'Shxuuer',
          fullName: '张三',
          phone: '123123123',
          address: '北京市朝阳区',
          notes: '无备注',
          status: '已送达',
          orderId: ''
        },
        {
          id: '2',
          name: '马克杯',
          user: 'Shxuuer',
          fullName: '张三',
          phone: '123123123',
          address: '北京市朝阳区',
          notes: '无备注',
          status: '已送达',
          orderId: ''
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<template>
  <div>
      <template v-for="(item,index) in orders">
        <OrderCard v-if="item.status!=='已签收'&&item.status!=='已驳回'" :order="item" :key="index"/>
      </template>
  </div>
</template>

<style scoped>

</style>
