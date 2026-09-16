<script>
import Title from '@/components/User/Title.vue'

export default {
  name: 'TitleCard',
  components: { Title },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {
          name: '',
          points: 0,
          color: '',
          id: ''
        }
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    title () {
      return {
        title: this.detail.name,
        color: this.detail.color
      }
    }
  },
  methods: {
    handleClick () {
      this.$emit('clickExchange', this.index)
    }
  }
}
</script>

<template>
  <a-card-grid style="width: 25%;position: relative">
    <a-row style="position:relative;">
      <a-row style="margin: 18px auto 18px auto;font-size: 1.35em;width: fit-content;">
        <Title :title="title"/>
      </a-row>
      <a-row class="points">
        <img src="../../../assets/rewards.svg" alt=""/>
        <span>{{ detail.points }}</span>
      </a-row>
      <a-row style="text-align: center">
        <a-button type="primary" style="margin: 10px auto 10px auto;" @click="handleClick">兑换</a-button>
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
