<script>
import { mapGetters } from 'vuex'
import GoodsRange from '@/components/Rewards/GoodsRange/GoodsRange.vue'
import TitleRange from '@/components/Rewards/TitleRange/TitleRange.vue'
export default {
  name: 'Rewards',
  components: { TitleRange, GoodsRange },
  computed: {
    ...mapGetters({
      pointsNow: 'pointsNow'
    })
  }
}
</script>

<template>
  <div class="body">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="积分商城"/>
    <span style="margin: 30px 0 0 30px;width: fit-content;display: flex;font-size: larger;line-height: 15px">
      剩余积分：<span style="font-weight: bold;margin-left: 2px;color: #a89154">{{ pointsNow }}</span>
      <a-popover title="如何获得积分？" placement="bottom">
        <template #content>
          <p>1.提供语料可获得大量积分</p>
          <p>2.发表高质量文章可获得积分</p>
          <p>3.文章被点赞可获得积分</p>
        </template>
        <div class="que-mark">?</div>
      </a-popover>
    </span>
    <GoodsRange/>
    <TitleRange/>
  </div>
</template>

<style scoped>
.body {
  width: 80%;
  background-color: white;
}
.que-mark {
  border: black 1px solid;
  margin-left: 6px;
  border-radius: 50%;
  height: 15px;
  width: 15px;
  line-height: 15px;
  font-size: 11px;
  text-align: center;
}
</style>
