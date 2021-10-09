<template>
  <div class="body">
    <a-row
      align="middle"
      justify="center"
      style="padding-top:10px;padding-bottom:10px;padding-right:0;padding-left:0;"
      type="flex"
    >
      <a-col span="23">
        <carousel/>
      </a-col>
    </a-row>

    <a-row
      align="middle"
      justify="center"
      style="padding-top:10px;padding-bottom:20px;padding-right:0;padding-left:0;"
      type="flex"
    >
      <a-col span="15">
        <a-card hoverable style="height:300px;text-align: center">
          <img src="../assets/blue.svg" width="40%" alt="兴化语记logo">
          <a-input-search
            placeholder="一键检索你想知道的"
            style="width:70%"
            v-model="searchContent"
            @search="$router.push({ name: 'Search', query: { key: searchContent } })"
          />
          <div style="text-align: left;font-size: 8px;margin:20px 20px;line-height: 8px">
            <p>目前支持搜拼音、搜单字、搜词语、搜文章功能。</p>
            <p>搜拼音：将输入视为拼音，搜索可能对应的汉字</p>
            <p>搜单字：获取输入中每一个汉字的读音</p>
            <p>搜词语：检索与输入相关的词语</p>
            <p>搜文章：检索与输入相关的文章</p>
          </div>
        </a-card>

      </a-col>
      <a-col span="8">
        <WordOfTheDay/>
      </a-col>
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

    <a-row
      align="top"
      justify="center"
      style="padding-top:10px;padding-bottom:20px;padding-right:0;padding-left:0;"
      type="flex"
    >
      <a-col span="24">
        <HotArticles/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Carousel from '@/components/HomeBody/Carousel'
import WordOfTheDay from '@/components/HomeBody/WordOfTheDay'
import HotArticles from '@/components/HomeBody/HotArticles'

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
          cover: cdn + '日常用语.png',
          routerName: 'DailyExpressions',
          disabled: false
        },
        {
          id: 3,
          cover: cdn + '方言曲库.png',
          routerName: 'Music',
          disabled: false
        }
      ]
    }
  },
  components: {
    Carousel,
    WordOfTheDay,
    HotArticles
  }
}
</script>
