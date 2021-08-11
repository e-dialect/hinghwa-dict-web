<template>
  <div>
    <a-spin
      :spinning="listSource===null"
      tip="Loading……"
      size="large"
      :delay="1000"
      style="text-align: center;"
    >
      <a-list
        :data-source="listSource"
        :pagination="pagination"
        item-layout="vertical"
      >
        <template v-slot:renderItem="item">
          <a-list-item>
            <template v-slot:extra>
              <img
                :src="item.article.cover"
                alt="文章封面"
                width="300"
              />
            </template>
            <a-list-item-meta :description="item.article.title">
              <template v-slot:title>
                <router-link :to="{name:'ArticleDetails',params:{id:item.article.id}}">
                  <h2>{{ item.article.title }}</h2>
                </router-link>
              </template>
            </a-list-item-meta>
            {{ item.article.content.slice(0, 100) }}
          </a-list-item>
        </template>
      </a-list>
    </a-spin>

  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'ArticleList',
  data () {
    return {
      pagination: {
        onChange: page => {
          console.log(page)
        },
        pageSize: this.pageSize
      },
      listSource: null,
      listDataLock: null
    }
  },
  props: {
    listData: Array,
    pageSize: Number
  },
  mounted () {
    if (this.listData !== this.listDataLock) {
      this.listDataLock = Object(this.listData)
    }
  },
  watch: {
    listData () {
      this.listDataLock = Object(this.listData)
    },
    listDataLock () {
      axios.put('/articles', { articles: this.listData }).then(res => {
        this.listSource = res.data.articles
      })
    }
  }
}
</script>
<style></style>
