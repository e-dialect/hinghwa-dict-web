<script>
export default {
  name: 'OrderCard',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  methods: {
  }
}
</script>

<template>
  <div>
    <a-card style="width: 100%">
      <a-descriptions bordered size="small">
        <a-descriptions-item label="用户">{{ order.user }}</a-descriptions-item>
        <a-descriptions-item label="商品名称">{{ order.name }}</a-descriptions-item>
        <a-descriptions-item label="收货人">{{ order.full_name }}</a-descriptions-item>
        <a-descriptions-item label="联系电话">{{ order.telephone }}</a-descriptions-item>
        <a-descriptions-item label="收货地址">{{ order.address }}</a-descriptions-item>
        <a-descriptions-item label="备注" span="3">{{ order.comment }}<br/></a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<style scoped>
.buttons{
  margin-right: 10px;
}
</style>
