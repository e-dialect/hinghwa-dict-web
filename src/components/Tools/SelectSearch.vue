<template>
  <!--    划词功能-->
  <div v-show="selectWordVisible" class="select-word" :style="{top:selectY,left:selectX}">
    <slot><li><span @click="search(selectedWord)">{{selectedWord}}</span></li></slot>
  </div>
</template>

<script>
export default {
  name: 'SelectSearch',
  props: [],
  data () {
    return {
      selectWordVisible: false,
      selectedWord: '空',
      selectX: '',
      selectY: ''
    }
  },
  methods: {
    SelectText (e) {
      const word = window.getSelection().toString().trim().replace(/\n/g, '') // 选中的内容
      this.selectedWord = word
      if (word !== '') {
        setTimeout(() => {
          this.selectWordVisible = true
          console.log(this.selectedWord)
        }, 5000)
        this.selectX = e.x + 'px'
        this.selectY = e.y + 'px'
      } else {
        this.selectWordVisible = false
        console.log(this.selectedWord)
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
  margin-top: -60px;
  margin-left: -70px;
  line-height: 42px;
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
