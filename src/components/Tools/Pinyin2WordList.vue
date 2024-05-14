<script>
import PlaySoundButton from '@/components/Tools/PlaySoundButton.vue'

export default {
  name: 'Pinyin2WordList',
  components: { PlaySoundButton },
  props: [
    'characters'
  ],
  data () {
    return {
      activeKeys: []
    }
  }
}
</script>

<template>
  <a-collapse
    :activeKey="activeKeys"
    :bordered="false"
    style="font-size: 22px;padding: 10px;background-color: white"
  >
    <a-collapse-panel
      v-for="(pinyin,index) in characters"
      :key="index.toString()"
      :header="pinyin.pinyin"
    >
      <a-row type="flex">
        <a-col :span="2">
          <PlaySoundButton :url="pinyin.source" :pinyin="pinyin.pinyin"/>
        </a-col>
        <a-col v-for="(character,index2) in pinyin.characters" :key="index2" :span="2">
              <span v-if="!character.word">
                <span>{{ character.character }}</span>
                <span
                  v-if="character.character!==character.traditional"
                  style="color: #8b8b8b;font-size: small"
                >
                  {{ character.traditional }}
                </span>
              </span>
          <router-link
            v-else
            :to="{name:'WordDetails',params:{id:character.word}}"
          >
            <span>{{ character.character }}</span>
            <span
              v-if="character.character!==character.traditional"
              style="color: #8b8b8b;font-size: small"
            >
                  {{ character.traditional }}
                </span>
          </router-link>
        </a-col>
      </a-row>
    </a-collapse-panel>
  </a-collapse>
</template>

<style scoped>

</style>
