<template>
  <div class="body">
    <a-alert type="warning" show-icon>
      <template slot="message">
        网站适配方案正在开发中，移动端用户必要时可访问旧版网站
        <a href="http://dict.hinghwa.cn" target="_blank">dict.hinghwa.cn</a>
        或微信小程序<strong>兴化语记</strong>，敬请谅解。
      </template>
    </a-alert>
    <a-alert type="warning" show-icon>
      <template slot="message">
        由于微信小程序的限制，小程序中的录音功能可能会失效，若遇到该状况烦请通过网站贡献语音，谢谢您的支持。
      </template>
    </a-alert>
    <a-row
      align="middle"
      justify="center"
      style="padding-top:32px;padding-bottom:32px;padding-right:0;padding-left:0;"
      type="flex"
    >
      <a-card hoverable style="height:376px;text-align: center">
        <div style="text-align: right">
          <a-button
            icon="more"
            type="dashed"
            @click="$router.push({name:'WordDetails',params:{id:Math.ceil(Math.random()*3500)}})"
          >
            随机跳词
          </a-button>
        </div>

        <img alt="兴化语记logo" src="../assets/blue.svg" style="padding-top: 32px" width="40%">
        <a-input-search
          v-model="searchContent"
          placeholder="一键检索你想知道的"
          style="width:70%;"
          @search="search(searchContent)"
        />
        <div style="padding-top: 24px;text-align: left;font-size: 8px;margin:24px 24px;line-height: 8px">
          <p>目前支持搜单字、搜词语、搜文章功能。</p>
          <p>搜单字：获取输入中每一个汉字的读音</p>
          <p>搜词语：检索与输入相关的词语</p>
          <p>搜文章：检索与输入相关的文章</p>
        </div>
      </a-card>
    </a-row>

    <a-row
      justify="space-around"
      style="padding-top:10px;padding-bottom:20px;padding-right:0;padding-left:0;"
      type="flex"
    >
      <a-col v-for="item in toolList" :key="item.id" :span="21/toolList.length">
        <a-card hoverable>
          <template v-slot:cover>
            <img
              :alt="item.name"
              :src="item.cover"
              style="width: 100%"
              @click="$router.push({name:item.routerName})"/>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const cdn = 'https://cos.edialect.top/website/'
export default {
  name: 'Home',
  data () {
    return {
      searchContent: '',
      toolList: [
        {
          id: 1,
          cover: cdn + '拼音速查.png',
          routerName: 'Characters',
          disabled: false
        },
        {
          id: 2,
          cover: cdn + '条件查字.png',
          routerName: 'Conditions',
          disabled: false
        },
        {
          id: 3,
          cover: cdn + '快速录制.png',
          routerName: 'QuickRecording',
          disabled: false
        }
      ]
    }
  },
  methods: {
    search (content) {
      if (content) {
        this.$router.push({
          name: 'Search',
          query: { key: content }
        })
      } else {
        this.$message.warning('请先输入搜索内容哦~')
      }
    }
  }

}
</script>
