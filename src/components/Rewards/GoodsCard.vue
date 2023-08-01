<script>
export default {
  name: 'GoodsCard',
  props: {
    detail: {
      type: Object,
      default: () => {
        return {
          name: '',
          points: 0,
          quantity: 0,
          picture: ''
        }
      }
    }
  },
  data: () => {
    return {}
  },
  methods: {
    handleClick () {
      this.$router.push({
        path: '/rewards/detail/' + this.detail.id
      })
    }
  }
}
</script>

<template>
  <a-card-grid style="width: 25%;height: 370px;position: relative" @click="handleClick">
    <img :src="detail.picture" style="width: 100%;" alt="商品图片"/>
    <a-row style="position:relative;">
      <a-row style="margin-top: 8px;font-size: 1.35em;color: #414141">
        {{ detail.name }}
        <span style="color: #8c8c8c;position: relative;left: 8px;font-size: xx-small">剩余{{ detail.quantity }}件</span>
      </a-row>
      <a-row class="points">
        <img src="@/assets/rewards.svg" alt=""/>
        <span>{{ detail.points }}</span>
      </a-row>
    </a-row>
  </a-card-grid>
</template>

<style scoped>
.points {
  margin-top: 10px;
}

.points img {
  width: 22px;
  height: 22px;
  line-height: 22px;
}

.points span {
  position: relative;
  top: 2px;
  left: 4px;
  margin-left: 5px;
  line-height: 22px;
  font-size: 1.2em;
  color: #a89154;
}
</style>
