<script>
import SingleWordMode from '@/components/Word/WordList/SingleWordMode.vue'
import MultiWordsMode from '@/components/Word/WordList/MultiWordsMode.vue'
import axios from 'axios'
export default {
  name: 'WordListDetail',
  components: { SingleWordMode, MultiWordsMode },
  data () {
    return {
      singleWordMode: false,
      list: {
        name: '',
        author: {
          nickname: '',
          avatar: '',
          id: -1
        },
        createTime: '',
        updateTime: '',
        description: '',
        words: [{
          id: 0,
          word: '',
          definition: '',
          contributor: 0,
          annotation: '',
          mandarin: [''],
          views: 0,
          standard_ipa: '',
          standard_pinyin: ''
        }],
        length: 0,
        id: 0
      }
    }
  },
  computed: {
    isMine () {
      return this.list.author.id === this.$store.state.user.id
    }
  },
  async beforeMount () {
    await axios.get(`/lists/${this.$route.params.id}`).then(res => {
      this.list = res.data
    })
  },
  methods: {
    async delList () {
      await axios.delete(`/lists/${this.$route.params.id}`).then(() => {
        this.$message.success('删除成功')
        this.$router.push({ name: 'WordList' })
      })
    }
  }
}
</script>

<template>
  <div class="body">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="词单" @back="$router.push({name:'WordList'})"/>
    <a-row :gutter="24" style="margin-top: 30px">
      <a-col :span="8" :offset="2">
        <a-descriptions :column="1">
          <a-descriptions-item label="词单名称">{{list.name}}</a-descriptions-item>
          <a-descriptions-item label="作者">
            <router-link :to="{name:'UserDetails',params:{id:list.author.id}}">
              <a-avatar :src="list.author.avatar" :size="24" style="margin-right: 5px"/>
              {{list.author.nickname}}
            </router-link>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">{{new Date(list.createTime).toLocaleString()}}</a-descriptions-item>
          <a-descriptions-item label="更新时间">{{new Date(list.updateTime).toLocaleString()}}</a-descriptions-item>
        </a-descriptions>
      </a-col>
      <a-col :span="12">
        <a-descriptions :column="1">
          <a-descriptions-item label="描述">{{list.description}}</a-descriptions-item>
          <a-descriptions-item label="词语数量">{{list.length}}</a-descriptions-item>
          <a-descriptions-item v-if="isMine">
            <a-button type="primary" @click="$router.push(`/wordlist/editor?id=${list.id}`)">编辑</a-button>
            <a-button type="danger" @click="delList" style="margin-left: 16px">删除</a-button>
          </a-descriptions-item>
        </a-descriptions>
      </a-col>
    </a-row>
    <a-divider/>
    <div style="margin: 20px auto 20px 20px;position: relative">
      <span style="margin-right: 20px;font-size: 1.1em;top: 1px;position: relative">单个词语</span><a-switch v-model="singleWordMode" checked-children="开" un-checked-children="关"/>
    </div>
    <template v-if="singleWordMode">
      <SingleWordMode :list="list.words"/>
    </template>
    <template v-else>
      <MultiWordsMode :list="list.words"/>
    </template>
  </div>
</template>

<style scoped>
.body{
  width: 80%;
  background-color: white;
}
</style>
