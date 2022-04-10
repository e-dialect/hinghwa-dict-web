<template>
  <div style="z-index: 1000;padding-left:30px">
    <a-affix :offset-bottom="offset">

      <a-popover
        v-model="visible"
        placement="right"
        style="z-index: 1100"
        trigger="click"
      >
        <template v-slot:content>
          <a-card
            :bordered="false"
            style="width:400px;"
          >
            <template v-slot:title>
              <h2>莆仙曲目</h2>
            </template>
            <a-button
              slot="extra"
              :disabled="$route.name==='Music'"
              type="link"
              @click="$router.push({name:'Music'})"
            >
              进入方言曲库
            </a-button>

            <img :src="music.cover" alt="音乐封面" style="width: 95%;"/>

            <div style="text-align: center"> {{ musicTitle }}</div>

            <audio
              ref="myAudio"
              :src="music.source"
              autoplay
              controls loop style="width: 100%;"
            />

          </a-card>
        </template>

        <a-button shape="circle" size="large">
          <a-icon type="customer-service"/>
        </a-button>
      </a-popover>

    </a-affix>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MusicAffix',
  data () {
    return {
      music: {
        id: 0,
        source: '',
        title: '',
        artist: '',
        cover: '',
        likes: 0
      },
      visible: true
    }
  },

  created () {
    this.visible = true
    setTimeout(() => {
      this.visible = false
    })
  },

  computed: {
    musicID () {
      return this.$store.getters.music
    },
    musicTitle () {
      return this.music.artist + ' - ' + this.music.title
    },
    offset () {
      return 400 * document.documentElement.clientHeight / document.documentElement.clientWidth
    }
  },

  watch: {
    musicID () {
      axios.get('/music/' + this.musicID.toString()).then(res => {
        this.music = res.data.music
      })
    },
    visible () {
      if (this.visible === true) {
        if (this.music.id !== this.musicID) {
          axios.get('/music/' + this.musicID.toString()).then(res => {
            this.music = res.data.music
          })
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
