<script>
export default {
  name: 'GoodsCard',
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    async handleEditBut () {
      this.$emit('handleEditBut', this.index)
    },
    async handleDelBut () {
      this.$emit('handleDelBut', this.index)
    }
  }
}
</script>

<template>
  <div>
    <a-card :title="goods.name" hoverable>
      <template #extra>
        <a-button type="danger" @click="handleDelBut" style="margin-right: 15px">删除</a-button>
        <a-button type="primary" @click="handleEditBut">编辑</a-button>
      </template>
      <a-descriptions bordered size="small">
        <a-descriptions-item label="商品ID">{{ goods.id }}</a-descriptions-item>
        <a-descriptions-item label="商品价格">{{ goods.points }} 积分</a-descriptions-item>
        <a-descriptions-item label="剩余个数">{{ goods.quantity }}</a-descriptions-item>
        <a-descriptions-item label="图片链接" :span="3"><a :href="goods.picture">{{ goods.picture }}</a> </a-descriptions-item>
        <a-descriptions-item label="备注" :span="3">{{ goods.details }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<style scoped>
</style>
