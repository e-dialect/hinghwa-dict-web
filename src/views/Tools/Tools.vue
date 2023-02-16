<template>
  <a-card>
    <div v-for="(item,index) in tools" :key="index">
      <a-card-grid hoverable style="width:33%;text-align:center">
        <a-card
          :bordered="false"
          @click="onCardClick(item)"
        >
          <template v-slot:cover>
            <img :alt="item.alt || item.routerName" :src="item.cover"/>
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
          alt: '拼音查字：根据声母、韵母、声调筛选符合条件的单字',
          disabled: false
        },
        {
          cover: cdn + '拼音速查.png',
          routerName: 'Characters',
          alt: '拼音速查：快速查询一串汉字对应的所有拼音',
          disabled: false
        },
        {
          cover: cdn + '聪明花开.png',
          routerName: 'PuxianExam',
          alt: '聪明花开：莆仙方言与地方文化小测试',
          disabled: false
        },
        {
          cover: cdn + '快速录制.png',
          routerName: 'QuickRecording',
          alt: '快速录制：大批量快速录制方言语音',
          disabled: false
        },
        {
          cover: cdn + '录音审核.png',
          routerName: 'RecordConfirming',
          alt: '录音审核：（管理员）界面友好地审查录音情况',
          disabled: false
        },
        {
          cover: cdn + '词条审核.png',
          alt: '词条审核：（管理员）界面友好地审查词条情况',
          routerName: 'WordConfirming',
          disabled: false
        },
        {
          cover: cdn + '方言曲库.png',
          routerName: 'Music',
          alt: '方言曲库：用莆仙一样能创作出好听的歌曲',
          disabled: false
        },
        {
          cover: cdn + '亲戚计算.png',
          routerName: 'Relative',
          alt: '亲戚计算：计算两个人的亲戚关系',
          disabled: false
        },
        {
          cover: cdn + '日常用语.png',
          alt: '日常用语：英语、普通话、莆仙方言正字与拼音共同对照',
          routerName: 'DailyExpressions',
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
  }
}
</script>

<style scoped>

</style>
