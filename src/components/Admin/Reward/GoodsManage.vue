<script>
import GoodsCard from '@/components/Admin/Reward/GoodsCard.vue'
import axios from 'axios'
export default {
  name: 'GoodsManage',
  components: { GoodsCard },
  data () {
    return {
      thisPage: 1,
      dataVolume: 0,
      clickedIndex: -1,
      modalShow: false,
      tempGoods: {},
      goods: []
    }
  },
  methods: {
    // 将临时商品重置
    tempGoodsRefresh () {
      this.tempGoods = { id: '', name: '', points: '', quantity: '', picture: '', details: '' }
    },
    // 点击编辑按钮
    handleEditBut (index) {
      this.clickedIndex = index
      if (index !== -1) {
        this.tempGoods = { ...this.goods[index] }
      } else {
        this.tempGoodsRefresh()
      }
      this.modalShow = true
    },
    // 点击删除按钮
    handleDelBut (index) {
      axios.delete('/products/' + this.goods[index].id).then(res => {
        this.goods.splice(index, 1)
        this.clickedIndex = -1
        this.$message.success('删除商品成功')
        this.updateTable()
      }).catch(() => {
        this.$message.error('删除商品失败')
      })
    },
    // 点击模态框确定按钮
    async handleEditOk () {
      if (this.clickedIndex === -1) {
        // 添加
        await axios.post('/products', this.tempGoods).then(async (res) => {
          this.tempGoods.id = res.data.id
          this.goods.push(this.tempGoods)
          this.$message.success('添加商品成功')
          this.updateTable()
        }).catch(() => {
          this.$message.error('添加商品失败')
        })
      } else {
        // 编辑
        await axios.put('/products/' + this.tempGoods.id, this.tempGoods).then(res => {
          this.$message.success('编辑商品成功')
          this.$set(this.goods, this.clickedIndex, this.tempGoods)
        }).catch(() => {
          this.$message.error('编辑商品失败')
        })
      }
      this.modalShow = false
    },
    // 获取商品列表
    updateTable () {
      axios.get('/products', {
        params: {
          page: this.thisPage,
          pageSize: 6
        }
      }).then(res => {
        this.goods = res.data.result
        this.dataVolume = Number(res.data.amount)
      })
    }
  },
  async created () {
    await this.updateTable()
  }
}
</script>

<template>
  <div>
    <a-button type="primary" style="margin-bottom: 20px" @click="handleEditBut(-1)">添加商品</a-button>

    <a-card>
      <GoodsCard v-for="(item,index) in goods" :key="index" :index="index" :goods="item"
               v-on:handleEditBut="handleEditBut(index)"
               v-on:handleDelBut="handleDelBut(index)"/>
      <a-pagination :total="dataVolume" :defaultPageSize="8"
                    v-model="thisPage" @change="updateTable"
                    style="margin: 20px auto;text-align: center"/>
    </a-card>
    <a-modal title="编辑商品" v-model="modalShow" @ok="handleEditOk" ok-text="确定" cancel-text="取消">
      <a-form>
        <a-form-item label="商品名称" style="margin-top: -20px">
          <a-input v-model="tempGoods.name"/>
        </a-form-item>
        <a-form-item label="商品价格" style="margin-top: -20px">
          <a-input v-model="tempGoods.points"/>
        </a-form-item>
        <a-form-item label="剩余个数" style="margin-top: -20px">
          <a-input v-model="tempGoods.quantity"/>
        </a-form-item>
        <a-form-item label="图片链接" style="margin-top: -20px">
          <a-input v-model="tempGoods.picture"/>
        </a-form-item>
        <a-form-item label="备注" style="margin-top: -20px">
          <a-textarea v-model="tempGoods.details"/>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>

<style scoped>

</style>
