<template>
  <div>
    <!--划词功能-->
    <a-card
      v-if="selectWordVisible"
      class="select-word"
      :style="{top:selectY,left:selectX,'z-index':2400,'max-width':'400px'}"
    >
      <template slot="title">
        <span>划线取词</span>
        <span style="color: gray; font-size: smaller">（功能开发中）</span>
      </template>
      <li>
        前往搜索：
        <span @click="search(selectedWord)">{{ selectedWord }}</span>
      </li>
    </a-card>

    <!--正常显示的内容-->
    <div @click="SelectText">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectSearch',
  props: [],
  data () {
    return {
      selectWordVisible: false,
      selectedWord: '',
      selectX: '',
      selectY: '',
      currentTimeout: null
    }
  },
  methods: {
    SelectText (e) {
      let word = '' // 选中的内容
      if (window.getSelection) { // mozilla FF
        word = window.getSelection()
      } else if (document.getSelection) {
        word = document.getSelection()
      }
      word = word.toString().trim().replace(/\n/g, '')
      this.selectedWord = word

      if (word) {
        clearTimeout(this.currentTimeout)
        this.currentTimeout = setTimeout(() => {
          this.selectWordVisible = true
        }, 3500)
        // get mouse position
        this.selectX = e.clientX + 'px'
        this.selectY = e.clientY + 'px'
      } else {
        clearTimeout(this.currentTimeout)
        this.selectWordVisible = false
      }
    },
    search (content) {
      if (content) {
        this.$router.push({
          name: 'Search',
          query: { key: content }
        })
      } else {
        this.$message.warning('请先输入搜索内容哦~')
      }
    }
  }
}
</script>

<style scoped>
.select-word {
  background: #fff;
  position: fixed;
  /*margin-top: -60px;*/
  /*margin-left: -70px;*/
  /*line-height: 42px;*/
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
}

li {
  padding: 0 15px;
  color: #8c8c8c;
  list-style: none;
}

li:hover {
  color: #417be0;
  cursor: pointer;
  background: #e7edfb;
}
</style>
