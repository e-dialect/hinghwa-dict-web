<script>
import axios from 'axios'

export default {
  name: 'Detail',
  data: () => {
    return {
      orderInfo: {
        address: '',
        full_name: '',
        comment: '',
        telephone: ''
      },
      confirmLoading: false,
      diaVisible: false,
      goods: {}
    }
  },
  methods: {
    handleExchangeClick () {
      if (this.goods.quantity === 0) {
        this.$message.error('库存不足')
      } else if (this.goods.points > this.$store.state.points) {
        this.$message.error('积分不足')
      } else {
        this.diaVisible = true
      }
    },
    async sendExchangeInfo () {
      if (this.orderInfo.address === '' || this.orderInfo.fullName === '' || this.orderInfo.phone === '') {
        this.$message.error('请填写完整信息')
        return
      }
      this.confirmLoading = true
      axios.post('/orders' + '?products_id=' + this.$route.params.id, this.orderInfo).then(() => {
        this.confirmLoading = false
        this.$message.success('兑换成功')
        setTimeout(() => {
          this.$router.push({ name: 'Rewards' })
        }, 1000)
      }).catch(() => {
        this.confirmLoading = false
        this.$message.error('兑换失败')
      })
    }
  },
  created () {
    axios.get('/products/' + this.$route.params.id).then(res => {
      this.goods = res.data.products
    })
  }
}
</script>

<template>
  <div class="body">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="返回到“积分商城”" @back="()=>this.$router.push({path: '/rewards'})"/>
    <a-row style="margin-top: 50px;margin-left: 7%">
      <a-col :span="5" :offset="1">
        <img style="width: 100%" alt="商品图片" :src="goods.picture"/>
      </a-col>
      <a-col :span="17" :offset="1">
        <a-row style="font-size: x-large;font-weight: bold">{{goods.name}}</a-row>
        <a-row style="margin-top: 20px;color: #000">价格：<span style="color: #8b8b8b; font-weight: bold" >{{goods.points}}</span> 点积分</a-row>
        <a-row class="detail">{{goods.details}}</a-row>
        <a-row style="margin-top: 20px">剩余{{goods.quantity}}件</a-row>
        <a-button type="primary" style="margin-top: 10px" @click="handleExchangeClick">立即兑换</a-button>
      </a-col>
    </a-row>
    <a-modal title="确认兑换" v-model="diaVisible" :ok-text="'确认'" :cancel-text="'取消'" @ok="sendExchangeInfo" :confirm-loading="confirmLoading">
      <a-form>
        <a-form-item class="form-item" label="地址" name="address" required>
          <a-input placeholder="地址" v-model="orderInfo.address" />
        </a-form-item>
        <a-form-item class="form-item" label="姓名" name="fullName" required>
          <a-input placeholder="姓名" v-model="orderInfo.full_name" />
        </a-form-item>
        <a-form-item class="form-item" label="电话" name="phone" required>
          <a-input placeholder="电话" v-model="orderInfo.telephone" />
        </a-form-item>
        <a-form-item class="form-item" label="备注" name="notes">
          <a-textarea placeholder="备注" v-model="orderInfo.comment" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.body{
  width: 80%;
  background-color: white;
}
.detail{
  margin-top: 20px;
  width: 65%;
  height: 200px;
  overflow: auto;
  background-color: #f6f6f6;
  text-indent: 2em;
  padding: 10px;
  border-radius: 5px;
  font-size: 1.1em;
}
.detail::-webkit-scrollbar {
  display: none;
}
.form-item{
  margin-top: -20px;
}
</style>
