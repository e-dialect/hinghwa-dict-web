<template>
  <a-list
    :grid="{ gutter: 16, column: 3 }"
    :pagination="pagination"
    :data-source="listSource || []"
    :loading="{spinning: loading, delay: 500}"
  >
    <template v-slot:renderItem="item">
      <a-list-item>
        <a-card>
          <a-descriptions bordered size="small" :column="1">
            <template slot="title">
              {{ item.character }}
<!--              <a-button icon="play-circle" type='link' :disabled="item.wav===''"-->
<!--                        @click="playSound(item.wav)"></a-button>-->
            </template>
            <a-descriptions-item label="拼音">
              {{ item.pinyin }}
            </a-descriptions-item>
            <a-descriptions-item label="国际音标">
              {{ item.ipa }}
            </a-descriptions-item>
            <a-descriptions-item label="声母">
              {{ item.shengmu }}
            </a-descriptions-item>
            <a-descriptions-item label="韵母">
              {{ item.yunmu }}
            </a-descriptions-item>
            <a-descriptions-item label="声调">
              {{ item.shengdiao }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>
<script>
import axios from 'axios'

export default {
  name: 'CharacterList',
  data () {
    return {
      listSource: null,
      listDataLock: null,
      loading: false,
      currentPage: 1
    }
  },
  computed: {
    pagination () {
      return {
        onChange: page => {
          this.currentPage = page
          this.getCurrentPageData(page)
        },
        pageSize: this.pageSize,
        total: this.listDataLock ? this.listDataLock.length : 0,
        current: this.currentPage
      }
    }

  },
  props: {
    listData: Array,
    pageSize: Number
  },
  created () {
    this.listDataLock = Object.assign([], this.listData)
  },
  watch: {
    listData () {
      this.listDataLock = Object.assign([], this.listData)
      this.currentPage = 1
    },
    listDataLock () {
      if (!this.listDataLock) return
      if (this.listDataLock.length === 0) return
      this.getCurrentPageData(1)
    }
  },
  methods: {
    getCurrentPageData (page) {
      this.loading = true
      axios.put('/characters', {
        characters: this.listData.slice((page - 1) * this.pageSize, page * this.pageSize)
      }).then(res => {
        this.listSource = res.data.characters
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
