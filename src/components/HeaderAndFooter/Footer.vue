<template>
  <div class="footer">
    <a-row align="middle" justify="space-around" type="flex">
      <!--      <a-col span="3">-->
      <!--        <img src="@/assets/white.svg" alt="兴化语记" width="240">-->
      <!--      </a-col>-->
      <!--            <a-col span="3">-->
      <!--                <a-popover>-->
      <!--                <template v-slot:content>  <img width="400" src="@/assets/二维码2.jpg">  </template>-->
      <!--                <img width="60" src="@/assets/二维码1.jpg">-->
      <!--                </a-popover>-->
      <!--            </a-col>-->
      <a-col span="12">
        <h4 style="color: white"> 相关网站：
          <a href="https://www.ydict.net/" style="color: white" target="_blank">榕典</a> &#8194;|
          <a href="https://www.moedict.tw/" style="color: white" target="_blank">萌典</a>&#8194;|
          <a href="http://hinghwa.cn/" style="color: white" target="_blank">莆仙话词典</a>&#8194;|
          <a href="https://zhongguoyuyan.cn/" style="color: white" target="_blank">中国语言保护工程采录展示平台</a>
        </h4>
        <!--        <h4 style="color: white"> 关于我们：-->
        <!--          <router-link style="color: white" to="/about">团队介绍</router-link>&#8194;|-->
        <!--          <router-link style="color: white" to="/contact">联系我们</router-link>&#8194;|-->
        <!--          <a href="" style="color: white">Github</a>-->
        <!--        </h4>-->
        <h4>Copyrights © {{ new Date().getFullYear() }}
          <a href="https://edialect.top" target="_blank">Easy Dialect</a>
            . All Rights Reserved.
        </h4>
        <a href="http://beian.miit.gov.cn" style="color:#C7C7C7" target="_blank">
          闽ICP备2021006892号
        </a>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background: rgb(46, 46, 46);
  width: 100%;
  color: white;
}

h4 {
  color: rgb(199, 199, 199);
}

p {
  font-size: 0.1rem;
  margin: auto;
  color: #8b8b8b;
}
</style>
