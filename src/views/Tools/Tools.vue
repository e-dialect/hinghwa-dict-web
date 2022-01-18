<template>
  <a-card>
    <div v-for="item in tools" :key="item.id">
      <a-card-grid hoverable style="width:50%;text-align:center">
        <a-card
          :bordered="false"
          @click="onCardClick(item)"
        >
          <template v-slot:cover>
            <img :src="item.cover" :alt="item.routerName"/>
          </template>
        </a-card>

      </a-card-grid>
    </div>
  </a-card>
</template>

<script>
const cdn = 'https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/website/'
export default {
  name: 'Tools',
  data () {
    return {

      tools: [
        {
          id: 0,
          cover: cdn + '条件查字.png',
          routerName: 'Conditions',
          disabled: false
        },
        {
          id: 1,
          cover: cdn + '拼音速查.png',
          routerName: 'Characters',
          disabled: false
        },
        {
          id: 2,
          cover: cdn + '日常用语.png',
          routerName: 'DailyExpressions',
          disabled: false
        },
        {
          id: 3,
          cover: cdn + '方言曲库.png',
          routerName: 'Music',
          disabled: false
        },
        {
          id: 4,
          cover: cdn + '录音审核.png',
          routerName: 'RecordConfirming',
          disabled: false
        },
        {
          id: 5,
          cover: cdn + '快速录制.png',
          routerName: 'QuickRecording',
          disabled: false
        }
      ]
    }
  },
  methods: {
    onCardClick (item) {
      if (!item.disabled) this.$router.push({ name: item.routerName })
      else this.$message.warning('功能正在开发中，请耐心等候')
    }
  },
  computed: {
    pagination: function () {
      return {
        pageSize: this.pageSize,
        total: this.tools.length
      }
    }
  }
}
</script>

<style scoped>

</style>
