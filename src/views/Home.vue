<template>
  <div class="body">

    <a-row
      align="middle"
      justify="center"
      style="padding-top:32px;padding-bottom:32px;padding-right:0;padding-left:0;"
      type="flex"
    >
      <a-card hoverable style="height:376px;text-align: center">
        <div style="text-align: right">
          <a-button
            type="dashed"
            icon="more"
            @click="$router.push({name:'WordDetails',params:{id:Math.ceil(Math.random()*3500)}})"
          >
            随机跳词
          </a-button>
        </div>

        <img src="../assets/blue.svg" width="40%" alt="兴化语记logo" style="padding-top: 32px">
        <a-input-search
          placeholder="一键检索你想知道的"
          style="width:70%;"
          v-model="searchContent"
          @search="$router.push({ name: 'Search', query: { key: searchContent } })"
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
      type="flex"
      style="padding-top:10px;padding-bottom:20px;padding-right:0;padding-left:0;"
    >
      <a-col :span="21/toolList.length" v-for="item in toolList" :key="item.id">
        <a-card hoverable>
          <template v-slot:cover>
            <img
              :src="item.cover"
              :alt="item.name"
              style="width: 100%"
              @click="$router.push({name:item.routerName})"/>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const cdn = 'https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/website/'
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
  }

}
</script>
