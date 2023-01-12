<template>
  <div>
  <a-card title="莆仙话辞典查询">
    <p>莆仙话辞典是一部电子辞典，点击下方拼音便能查看所有以该音序开头的单词，快来试试吧~</p>
  </a-card>
  </div>
</template>

<script>
import { getPhonetic } from '@/services/dictionary'

export default {
  name: 'Dictionary',
  data () {
    return {
      record: {
      }
    }
  },
  created () {
    this.getPhonetic()
  },
  methods: {
    /**
     *获取音序表
     **/
    async getPhonetic () {
      await getPhonetic().then(res => {
        this.record = res.record
      })
    }
  }
}
</script>

<style scoped>

</style>
