<script>
export default {
  name: 'TitleFilter',
  data () {
    return {
      filter: {
        minPoints: 0,
        maxPoints: 0
      },
      visible: false,
      minPoints: false,
      maxPoints: false
    }
  },
  watch: {
    visible: {
      handler () {
        if (this.visible) return
        if (this.minPoints && this.maxPoints) {
          if (this.filter.minPoints > this.filter.maxPoints) {
            this.$message.error('最低积分不能大于最高积分')
            this.visible = true
            return
          }
        }
        const filter = {
          minPoints: this.minPoints ? this.filter.minPoints : -1,
          maxPoints: this.maxPoints ? this.filter.maxPoints : -1
        }
        this.$emit('sendFilter', filter)
      }
    }
  }
}
</script>

<template>
  <a-popover title="筛选条件" trigger="click" v-model="visible">
    <template #content>
      <div style="display: flex;flex-direction: column">
        <div style="display: flex;flex-direction: row;align-items: center">
          <a-checkbox style="margin-right: 10px" v-model="minPoints"/>
          <span style="margin-right: 10px">最低积分</span>
          <a-input-number v-model="filter.minPoints" :min="0" style="width: 100px" :disabled="!minPoints"/>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;margin-top: 10px">
          <a-checkbox style="margin-right: 10px" v-model="maxPoints"/>
          <span style="margin-right: 10px">最高积分</span>
          <a-input-number v-model="filter.maxPoints" :min="0" style="width: 100px" :disabled="!maxPoints"/>
        </div>
        <a-button type="primary" style="margin-top: 10px" @click="visible=false">确定</a-button>
      </div>
    </template>
    <a-button type="primary">筛选</a-button>
  </a-popover>
</template>

<style scoped>

</style>
