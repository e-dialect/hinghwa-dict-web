<template>
  <div class="body">
    <a-alert type="info" style="margin-top: 10px" show-icon>
      <template #message>
        网站移动版
        <a href="http://m.hinghwa.cn" target="_blank">m.hinghwa.cn</a>
        现已开放测试，必要时可访问
        <a href="http://dict.hinghwa.cn" target="_blank">旧版网站</a>
        或微信小程序
        <i>兴化语记</i>
      </template>
    </a-alert>
    <a-alert type="info"  show-icon>
      <template #message>
        若您使用过程中有任何疑问或宝贵想法，欢迎您通过
        <a href="https://support.qq.com/product/420021" target="_blank">兔小巢社区</a>
        或
        <a href="https://github.com/e-dialect" target="_blank">GitHub&nbsp;社区</a>
        向我们反馈
      </template>
    </a-alert>
    <a-alert type="warning" show-icon>
      <template #message>
        由于微信小程序的限制，小程序中的录音功能可能会失效，若遇到该状况烦请通过网站贡献语音，谢谢您的支持。
      </template>
    </a-alert>
    <a-row
      justify="center"
      style="padding: 12px 0;"
      type="flex"
    >
      <a-card hoverable style="text-align: center;">
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
        <div style="padding-top: 24px;text-align: left;font-size: 90%;margin:24px 24px;line-height: 8px;color: #8b8b8b">
          <p style="color: #414141">目前支持搜单字、搜词语、搜文章功能。</p>
          <p><span class="show-span">搜单字</span>获取输入中每一个汉字的读音</p>
          <p><span class="show-span">搜词语</span>检索与输入相关的词语</p>
          <p><span class="show-span">搜文章</span>检索与输入相关的文章</p>
        </div>
      </a-card>
    </a-row>
    <a-row
      justify="space-around"
      style="padding: 10px 0 20px;"
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
          cover: cdn + '音序查词.png',
          routerName: 'Dictionary',
          disabled: false
        },
        {
          id: 2,
          cover: cdn + '快速录制.png',
          routerName: 'QuickRecording',
          disabled: false
        },
        {
          id: 3,
          cover: cdn + '条件查字.png',
          routerName: 'Conditions',
          disabled: false
        }
      ]
    }
  },
  methods: {
    search (content) {
      if (!content) {
        this.$message.warning('请先输入搜索内容哦~')
        return
      }
      if (content.substring(0, 4) === 'PLPT') {
        this.$router.push({
          path: `/users/certificate/${content}`
        })
        return
      }
      this.$router.push({
        name: 'Search',
        query: { key: content }
      })
    }
  }
}
</script>
<style>
.select-word {
  background: #fff;
  position: fixed;
  margin-top: -70px;
  margin-left: -50px;
  line-height: 42px;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
}
li {
  padding: 0 15px;
  color: #8c8c8c;
  list-style: none;
}
li:hover {
  color: #417be0;
  cursor: pointer;
  background: #e7edfb;
}
.show-span{
  color: #414141;
  font-weight: bold;
  margin-right: 10px;
}
</style>
