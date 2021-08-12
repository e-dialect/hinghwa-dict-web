<template>
  <div>
    <a-list
      :data-source="listSource || []"
      :pagination="pagination"
      :loading="{spinning: loading, delay: 500}"
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

  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'ArticleList',
  data () {
    return {
      listSource: null,
      loading: false
    }
  },
  computed: {
    pagination: function () {
      return {
        onChange: page => {
          this.getCurrentPageData(page)
        },
        pageSize: this.pageSize,
        total: (this.listDataLock && this.listDataLock.length) || 0
      }
    },
    listDataLock () {
      return this.listData
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
    listDataLock () {
      if (!this.listDataLock || this.listDataLock.length === 0) return
      this.getCurrentPageData(1)
    }
  },
  methods: {
    getCurrentPageData (page) {
      this.loading = true
      axios.put('/articles', {
        articles: this.listDataLock.slice((page - 1) * this.pageSize, page * this.pageSize)
      }).then(res => {
        this.listSource = res.data.articles
      }).finally(
        () => {
          this.loading = false
        }
      )
    }

  }

}
</script>
<style></style>
