<template>
  <div class="login">
    <a-row justify="center" type="flex">
      <a-col>
        <img alt="兴化语记——莆仙方言在线工具" src="../../assets/blue.svg" width="300px"/>
      </a-col>
    </a-row>
    <a-row justify="center" style="padding-bottom:20px" type="flex">
      <a-col>
        <h2 style="color:rgb(23, 7, 66)"> 莆仙方言在线工具 </h2>
      </a-col>
    </a-row>
    <a-row :gutter="[0,20]" align="middle" justify="start" type="flex">
      <a-col span="8">
        <div style="text-align: right; padding-right: 10px"> 用户名</div>
      </a-col>
      <a-col span="8">
        <a-input v-model="username" placeholder="输入用户名"/>
      </a-col>
      <a-col span="8"/>

      <a-col span="8">
        <div style="text-align: right; padding-right: 10px;"> 密码</div>
      </a-col>
      <a-col span="8">
        <a-input-password v-model="password" placeholder="输入密码" size="default"/>
      </a-col>
      <a-col span="8"/>

      <a-col span="8"/>
      <a-col span="4">
        <a-button :disabled="username===''||password===''" shape="round" type="primary" @click="login" @keyup.enter="login"> 登录</a-button>
      </a-col>
      <a-col span="4">
        <router-link to="./forget"> 忘记密码</router-link>
      </a-col>
    </a-row>

    <a-divider/>
    <a-row justify="center" style="padding-bottom:20px" type="flex">
      <a-col span="4">
        <p> 没有账号？</p>
      </a-col>
      <a-col span="4">
        <router-link to="./register"> 注册</router-link>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      axios.post('/login', {
        username: this.username,
        password: this.password
      }).then(async (res) => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('login_time', Date.now().toString())
        await this.$store.dispatch('userLogin', res.data.id)
        this.$message.success('登录成功')
        if (!this.$store.getters.user.county) {
          this.$message.warning('为了便于后续使用，请设置自己的所在乡镇~')
        }
        this.$router.push({ name: 'Home' })
      }).catch(err => {
        if (err.response.status === 401) {
          this.$message.destroy()
          this.$message.error('用户名或密码错误')
        }
      })
    },
    keyDown (e) {
      if (e.keyCode === 13) {
        this.login()
      }
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyDown)
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyDown, false)
  }
}
</script>

<style scoped>
.login {
  background: white;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
}
</style>
