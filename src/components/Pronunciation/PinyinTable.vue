<template>
  <a-row type="flex" justify="center">
    <a-col :span="18">
      <a-table :columns="columns" :data-source="pinyin">
        <span slot="customTitle"> Name</span>
        <span slot="action" slot-scope="text, record">
      <audio
        :src="'https://cos.edialect.top/pinyin/example/'+(record.pinyin || record.type)+'.mp3'"
        controls
      />
    </span>
      </a-table>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'PinyinTable',
  props: ['columns', 'pinyin']
}
</script>

<style scoped>

</style>
