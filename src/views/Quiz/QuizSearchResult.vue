<template>
  <div class="body">
    <a-input-search
      placeholder="请输入搜索内容"
      size="large"
    />
  </div>
</template>

<script>
export default {
  name: 'QuizSearchResult'
}
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  padding: 40px;
}
</style>
