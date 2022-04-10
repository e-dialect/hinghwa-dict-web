<template>
  <a-card>
    <div v-for="(item,index) in tools" :key="index">
      <a-card-grid hoverable style="width:50%;text-align:center">
        <a-card
          :bordered="false"
          @click="onCardClick(item)"
        >
          <template v-slot:cover>
            <img :alt="item.routerName" :src="item.cover"/>
          </template>
        </a-card>

      </a-card-grid>
    </div>
  </a-card>
</template>

<script>
const cdn = 'https://cos.edialect.top/website/'
export default {
  name: 'Tools',
  data () {
    return {

      tools: [
        {
          cover: cdn + '条件查字.png',
          routerName: 'Conditions',
          disabled: false
        },
        {
          cover: cdn + '拼音速查.png',
          routerName: 'Characters',
          disabled: false
        },
        {
          cover: cdn + '快速录制.png',
          routerName: 'QuickRecording',
          disabled: false
        },
        {
          cover: cdn + '录音审核.png',
          routerName: 'RecordConfirming',
          disabled: false
        },
        {
          cover: cdn + '聪明花开.png',
          routerName: 'PuxianExam',
          disabled: true
        },
        {
          cover: cdn + '词条审核.png',
          routerName: 'WordConfirming',
          disabled: false
        },
        {
          cover: cdn + '日常用语.png',
          routerName: 'DailyExpressions',
          disabled: false
        },
        {
          cover: cdn + '方言曲库.png',
          routerName: 'Music',
          disabled: false
        }
      ]
    }
  },
  methods: {
    onCardClick (item) {
      if (!item.disabled) {
        this.$router.push({ name: item.routerName })
      } else {
        this.$message.warning('功能正在开发中，请耐心等候')
      }
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
