<script>
import axios from 'axios'
import PlaySoundButton from '@/components/Tools/PlaySoundButton.vue'

export default {
  name: 'SingleWordMode',
  components: { PlaySoundButton },
  props: {
    list: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      index: 0,
      thisPage: {
        id: 0,
        word: '',
        definition: '',
        contributor: 0,
        contributorNickname: '',
        annotation: '',
        mandarin: [''],
        views: 0,
        standard_ipa: '',
        standard_pinyin: ''
      }
    }
  },
  async beforeMount () {
    await this.updatePageInfo()
  },
  methods: {
    updatePageInfo () {
      this.thisPage = this.list[this.index]
      axios.get(`/users/${this.thisPage.contributor}`).then(res => {
        this.$set(this.thisPage, 'contributorNickname', res.data.user.nickname)
      })
    }
  }
}
</script>

<template>
  <div>
    <a-card :title="thisPage.word" style="margin: auto 20px" :hoverable="true">
      <template #extra>
        第{{index + 1}}/{{list.length}}个
      </template>
      <a-row style="margin-top: 20px;margin-bottom: 40px">
        <a-row style="font-size: 1.3em;color: #000;margin-bottom: 5px">发音<PlaySoundButton/></a-row>
        <a-row style="color: #222;font-size: 1.3em">{{thisPage.standard_pinyin}}</a-row>
        <a-row style="color: rgb(155,155,155)">/{{thisPage.standard_ipa}}/</a-row>
      </a-row>
      <a-row style="margin-top: 20px">
        <a-col :span="2" class="card-tip">释义:</a-col>
        <a-col :span="22" style="color: #000">{{thisPage.definition}}</a-col>
      </a-row>
      <a-row style="margin-top: 20px">
        <a-col :span="2" class="card-tip">附注:</a-col>
        <a-col :span="22" style="color: #000">{{thisPage.annotation}}</a-col>
      </a-row>
      <a-row style="margin-top: 20px">
        <a-col :span="2" class="card-tip">普通话:</a-col>
        <a-col :span="22" style="color: #000">
          <a-tag v-for="(item, index) in thisPage.mandarin" :key="index">
            {{item}}
          </a-tag>
        </a-col>
      </a-row>
      <a-row style="text-align: right;margin-top: 15px">
        <span style="margin-right: 10px">贡献者:
          <router-link :to="{name: 'UserDetails', params: {id: thisPage.contributor}}">
            {{thisPage.contributorNickname}}
          </router-link>
        </span>
        <span>view:{{thisPage.views}}</span>
      </a-row>
      <a-row style="text-align: right;margin: 20px 0 0 auto">
        <router-link :to="{name: 'WordDetails', params: {id: thisPage.id}}">
          详细信息 >
        </router-link>
      </a-row>
    </a-card>
    <a-row style="text-align: center">
      <a-button type="primary" style="margin: 20px auto 20px 20px" @click="index = (index - 1 + list.length) % list.length;updatePageInfo()">上一个</a-button>
      <a-button type="primary" style="margin: 20px auto 20px 20px" @click="index = (index + 1) % list.length;updatePageInfo()">下一个</a-button>
    </a-row>
    </div>
</template>

<style scoped>
.card-tip {
  font-weight: bolder;
  font-size: 1.1em;
}
</style>
