<template>
  <div class="login">
    <a-row align="middle" justify="center" type="flex">
      <a-col>
        <img :width="300" alt="logo" src="../../assets/blue.svg"/>
      </a-col>
    </a-row>
    <a-row align="middle" justify="center" style="padding-bottom:20px" type="flex">
      <a-col>
        <h2 style="color:rgb(23, 7, 66)"> 莆仙方言在线工具 </h2>
      </a-col>
    </a-row>
    <a-row justify="center" style="padding-top:10px" type="flex">
      <a-col span="4" style="text-align: center">
        <h3> 用户名 </h3>
      </a-col>
    </a-row>
    <a-row justify="center" style="padding-bottom:10px" type="flex">
      <a-col span="6">
        <a-input v-model="username" :maxLength="50" placeholder="输入用户名"/>
      </a-col>
    </a-row>
    <a-row justify="center" style="padding-top:10px" type="flex">
      <a-col span="4" style="text-align: center">
        <h3> 密码 </h3>
      </a-col>
    </a-row>
    <a-row justify="center" style="padding-bottom:10px" type="flex">
      <a-col span="6">
        <a-input-password v-model="password" placeholder="输入密码" size="default"/>
      </a-col>
    </a-row>
    <a-row justify="center" style="padding-bottom:10px" type="flex">
      <a-col span="6">
        <a-input-password v-model="repeatedPassword" placeholder="请再次输入" size="default"/>
      </a-col>
    </a-row>
    <a-row justify="center" style="padding-top:10px" type="flex">
      <a-col span="4" style="text-align: center">
        <h3> 邮箱验证 </h3>
      </a-col>
    </a-row>
    <a-row justify="center" style="padding-bottom:10px" type="flex">
      <a-col span="6">
        <a-input v-model="email" placeholder="输入邮箱"/>
      </a-col>
    </a-row>
    <a-row justify="center" style="padding-bottom:10px" type="flex">
      <a-col span="4">
        <a-input v-model="code" placeholder="输入验证码"/>
      </a-col>
      <a-col span="2">
        <a-button
          :disabled="!email"
          :loading="btnCodeLoading"
          shape="round"
          type="primary"
          @click="sendCode(email)"
        >
          发送验证码
        </a-button>
      </a-col>
    </a-row>
    <a-row align="middle" justify="center" type="flex">
      <a-col span="2">
        <a-button
          :disabled="!(username&&password&&email&&code)"
          :loading="btnRegisterLoading"
          shape="round"
          type="primary"
          @click="finishRegister"
        >
          注册
        </a-button>
      </a-col>
    </a-row>
    <a-divider/>
    <a-row justify="center" style="padding-bottom:20px" type="flex">
      <a-col span="4">
        <p> 已有账号？</p>
      </a-col>
      <a-col span="2">
        <router-link :to="{name:'Login'}"> 登录</router-link>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Register',
  data () {
    return {
      username: '',
      email: '',
      password: '',
      repeatedPassword: '',
      code: '',
      btnCodeLoading: false,
      btnRegisterLoading: false
    }
  },
  methods: {
    /**
     * 获取邮箱验证码
     * @param email 要发送的邮箱地址
     */
    sendCode (email) {
      this.btnCodeLoading = true
      axios.post('/website/email', { email: email }).then(
        () => {
          this.$message.success('验证码已成功发送至' + email)
        }).finally(() => {
        this.btnCodeLoading = false
      })
    },
    /**
     * 完成注册任务
     */
    finishRegister () {
      this.btnRegisterLoading = true
      if (this.password !== this.repeatedPassword) {
        this.$message.error('两次输入的密码不一致')
      } else {
        axios.post('/users', {
          username: this.username,
          password: this.password,
          email: this.email,
          code: this.code
        }).then(async () => {
          this.$message.success('注册成功！')
          await axios.post('/login', {
            username: this.username,
            password: this.password
          }).then(async (res) => {
            await this.$store.dispatch('userLogin', res.data.id)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('login_time', Date.now().toString())
            this.$router.push({ name: 'UserSettings' })
            this.$message.info('请尽快完善个人信息哦~')
          })
        }).catch(err => {
          switch (err.response.status) {
            case 401: {
              this.$message.destroy()
              this.$message.error('验证码错误！')
              break
            }
            case 409: {
              this.$message.destroy()
              this.$message.error('该用户名已经被注册！')
              break
            }
            case 500: {
              this.$message.destroy()
              this.$message.error(err.response.data.msg)
              break
            }
          }
        })
      }
      this.btnRegisterLoading = false
    }
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
