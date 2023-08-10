<template>
  <div>
    <a-tag v-if="level === 1" color="grey">LV 1</a-tag>
    <a-tag v-else-if="level === 2" color="green">LV 2</a-tag>
    <a-tag v-else-if="level === 3" color="blue">LV 3</a-tag>
    <a-tag v-else-if="level === 4" color="purple">LV 4</a-tag>
    <a-tag v-else-if="level === 5" color="orange">LV 5</a-tag>
    <a-tag v-else-if="level === 6" color="red">LV 6</a-tag>
    <a-tag v-if="type" color="red">管理员</a-tag>
  </div>
</template>

<script>
export default {
  name: 'UserTag',
  props: {
    points_sum: {
      type: Number,
      default: 0
    },
    type: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    level () {
      if (this.points_sum < 100) {
        return 1
      } else if (this.points_sum < 500) {
        return 2
      } else if (this.points_sum < 1000) {
        return 3
      } else if (this.points_sum < 2000) {
        return 4
      } else if (this.points_sum < 5000) {
        return 5
      } else {
        return 6
      }
    }
  }
}
</script>

<style scoped>

</style>
