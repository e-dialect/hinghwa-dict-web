<script>
import { debounce } from '@/services/functions'
import axios from 'axios'

export default {
  name: 'WordListEditor',
  async beforeCreate () {
    if (this.$route.query.id) {
      await this.$axios.get('/lists/' + this.$route.query.id).then(res => {
        this.listInfo.name = res.data.name
        this.listInfo.description = res.data.description
        res.data.words.forEach(word => {
          this.existWords.push({
            id: word.id,
            word: word.word
          })
        })
      }).catch(() => {
        this.$message.error('拉取词单信息失败')
      })
    }
  },
  data () {
    return {
      listInfo: {
        name: '',
        description: '',
        words: []
      },
      existWords: [],
      searchId: '',
      searchedWord: {
        id: '',
        word: ''
      },
      popoverShow: false
    }
  },
  methods: {
    async getWords () {
      this.searchedWord = {
        id: '',
        word: ''
      }
      debounce(async () => {
        if (this.searchId === '') return
        await this.$axios.get(`/words/${this.searchId}`).then(res => {
          this.searchedWord = {
            id: res.data.word.id,
            word: res.data.word.word
          }
        }).catch(() => {
          this.$message.error('拉取词汇失败')
        })
      }, 100)
    },
    addWords () {
      // filter
      if (this.existWords.find(item => item.id === this.searchedWord.id)) {
        this.$message.error('词汇已存在')
        return
      }
      if (this.searchedWord.id === '') {
        this.$message.error('词汇不存在')
        return
      }
      this.existWords.push(this.searchedWord)
      this.searchId = ''
      this.searchedWord = {
        id: '',
        word: ''
      }
    },
    async submitList () {
      if (this.listInfo.name === '') {
        this.$message.error('词单名称不能为空')
        return
      }
      if (this.listInfo.description === '') {
        this.$message.error('词单描述不能为空')
        return
      }
      await this.existWords.forEach(item => {
        this.listInfo.words.push(item.id)
      })
      function afterSubmit (that, prom) {
        prom.then(() => {
          that.$message.success('提交成功')
          that.$router.push({ name: 'WordList' })
        }).catch(() => {
          that.$message.error('提交失败')
        })
      }
      if (this.$route.query.id) {
        afterSubmit(this, axios.put('/lists/' + this.$route.query.id, this.listInfo))
      } else {
        afterSubmit(this, axios.post('/lists', this.listInfo))
      }
    }
  }
}
</script>

<template>
  <div class="body">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="编辑词单"
                   @back="$router.push({name: 'WordList'})"/>
    <a-form :label-col="{span: 2}" :wrapper-col="{span: 22}" style="margin-top: 20px">
      <a-form-item label="词单名称">
        <a-input v-model="listInfo.name" style="width: 250px" placeholder="词单名称"/>
      </a-form-item>
      <a-form-item label="词单描述">
        <a-textarea v-model="listInfo.description" style="width: 600px" :auto-size="{ minRows: 9, maxRows: 9 }"
                    placeholder="词单描述"/>
      </a-form-item>
      <a-form-item label="词单词汇">
        <a-popover placement="topLeft" trigger="click">
          <template #content>
            <template v-if="searchId===''">
              输入id查询词语
            </template>
            <template v-else-if="searchedWord.word===''">
              查询中...
            </template>
            <template v-else>
              <span style="font-weight: bold">{{ searchedWord.word }}</span>
            </template>
          </template>
          <a-input-search placeholder="输入词汇id" style="width: 200px" enter-button="添加" v-model="searchId"
                          @change="getWords" @search="addWords"/>
        </a-popover>
        <div>
          <template v-for="(item, index) in existWords">
            <a-tag :key="index" :closable="true" @close="existWords.splice(index, 1);">
              {{ item.word }}
            </a-tag>
          </template>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" style="margin-left: 40px" @click="submitList">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.body {
  width: 80%;
  background-color: white;
}
</style>
