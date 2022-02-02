<template>
  <div class="body">
    <a-tabs>
      <a-tab-pane key="1" tab="个人信息">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="头像">
            <a-row align="middle" justify="space-around" type="flex">
              <a-col :span="4">
                <a-avatar :size="64" :src="user.avatar"/>
              </a-col>
              <a-col :span="4">
                <a-upload
                  v-show="editing"
                  :before-upload="beforeUpload"
                  :customRequest="imageUpload"
                  :show-upload-list="false">
                  <a-button>
                    <a-icon type="upload"/>
                    更换头像
                  </a-button>
                </a-upload>
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item label="昵称">
            <a-input v-model="user.nickname" :disabled="!editing" placeholder="真的要做空白昵称人嘛？"/>
          </a-form-item>

          <a-form-item label="生日">
            <a-date-picker
              v-model="birthday"
              :disabled="!editing"
            />
          </a-form-item>

          <a-form-item label="电话">
            <a-input v-model="user.telephone" :disabled="!editing" placeholder="输入你的电话号码">
              <a-icon slot="prefix" type="phone"/>
            </a-input>
          </a-form-item>
          <a-form-item label="乡镇">
            <a-cascader v-model="townOption" :options="townList" placeholder="默认发音乡镇" :disabled="!editing"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 24, offset: 5 }">
            <a-button v-if="!editing" type="primary" v-on:click="editing=true">
              编辑
            </a-button>
            <div v-else>
              <a-button
                type="primary"
                v-on:click="updateUser().finally(() => {editing = false})"
              >
                提交
              </a-button>
              <a-button @click="editing=false;user=Object.assign({}, $store.getters.user)">
                取消编辑
              </a-button>
            </div>
          </a-form-item>
          <a-form-item label="微信">
              <a-button
                icon="wechat"
                type="link"
                v-if="user.wechat"
                @click="deleteWechat()"
              >
                解除绑定
              </a-button>
            <h3 v-else> 请前往小程序端进行绑定</h3>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }" label="资料完善度">
            <a-progress :percent="percent" type="circle"/>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="2" tab="安全设置">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">

          <a-form-item label="用户名">
            <a-input v-model="user.username" placeholder="输入用户名"/>
            <a-popconfirm
              :title="'确认将用户名从'+currentUsername+'改为'+user.username+'？'"
              cancel-text="取消"
              ok-text="确认"
              @cancel="user.username=currentUsername"
              @confirm="updateUser()"
            >
              <a-button
                :disabled="user.username===currentUsername"
                type="danger"
              > 修改用户名
              </a-button>
            </a-popconfirm>
          </a-form-item>

          <a-form-item label="当前密码">
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" style="color:#ff0000" @click="e => e.preventDefault()">
                修改密码
                <a-icon type="down"/>
              </a>
              <a-menu slot="overlay">
                <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-item :wrapper-col="{ span: 12, offset: 1 }" label="旧密码">
                    <a-input-password v-model="oldPassword"/>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 12, offset: 1 }" label="新密码">
                    <a-input-password v-model="newPassword"/>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 12, offset: 1 }" label="重复新密码">
                    <a-input-password v-model="confirmPassword"/>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 12, offset: 7 }">
                    <a-button
                      :loading="btnPasswordLoading"
                      type="danger"
                      v-on:click="changePassword"
                    >
                      确认修改
                    </a-button>
                  </a-form-item>
                </a-form>
              </a-menu>
            </a-dropdown>
          </a-form-item>

          <a-form-item label="安全邮箱">
            <a-input v-model="user.email" disabled/>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" style="color:red" @click="e => e.preventDefault()">
                修改安全邮箱
                <a-icon type="down"/>
              </a>
              <a-menu slot="overlay">
                <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-item :wrapper-col="{ span: 12, offset: 3 }" label="新邮箱">
                    <a-input v-model="newEmail"/>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 12, offset: 3 }" label="验证码">
                    <a-row align="middle" justify="start" type="flex">
                      <a-col :span="16">
                        <a-input v-model="emailCode"/>
                      </a-col>
                      <a-col :span="2">
                        <a-button
                          :disabled="!RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(newEmail)"
                          :loading="btnCodeLoading"
                          type="primary"
                          v-on:click="sendCode(newEmail)"
                        >
                          发送验证码
                        </a-button>
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 12, offset: 7 }">
                    <a-button
                      :disabled="emailCode===''"
                      :loading="btnEmailLoading"
                      type="danger"
                      v-on:click="changeEmail"
                    >
                      确认修改
                    </a-button>
                  </a-form-item>
                </a-form>
              </a-menu>
            </a-dropdown>
          </a-form-item>

        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import axios from 'axios'

export default {
  name: 'userSettings',
  data () {
    return {
      moment, // 字符串转时间object时需要用到的变量

      // 用户的信息
      user: {
        id: 0,
        username: 'username',
        nickname: 'nickname',
        email: 'pxm@edialect.top',
        telephone: '',
        registration_time: '2001-01-01 00:00:00',
        login_time: '2001-01-01 00:00:00',
        birthday: '2001-01-01',
        avatar: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
        county: '',
        town: '',
        is_admin: false
      },
      oldPassword: '', // 用户输入的旧密码
      newPassword: '', // 用户输入的新密码
      confirmPassword: '', // 用户确认的新密码
      newEmail: '', // 用户输入的新邮箱
      emailCode: '', // 用户输入的邮箱验证码
      editing: false, // 是否在编辑状态

      // ui需要用到的变量
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },

      btnCodeLoading: false,
      btnEmailLoading: false,
      btnPasswordLoading: false,
      townList: [{
        value: '城厢区',
        label: '城厢区',
        children: [{
          value: '龙桥街道',
          label: '龙桥街道'
        }, {
          value: '凤凰山街道',
          label: '凤凰山街道'
        }, {
          value: '霞林街道',
          label: '霞林街道'
        }, {
          value: '常太镇',
          label: '常太镇'
        }, {
          value: '华亭镇',
          label: '华亭镇'
        }, {
          value: '灵川镇',
          label: '灵川镇'
        }, {
          value: '东海镇',
          label: '东海镇'
        }]
      }, {
        value: '涵江区',
        label: '涵江区',
        children: [{
          value: '涵东街道',
          label: '涵东街道'
        }, {
          value: '涵西街道',
          label: '涵西街道'
        }, {
          value: '三江口镇',
          label: '三江口镇'
        }, {
          value: '白塘镇',
          label: '白塘镇'
        }, {
          value: '国欢镇',
          label: '国欢镇'
        }, {
          value: '梧塘镇',
          label: '梧塘镇'
        }, {
          value: '江口镇',
          label: '江口镇'
        }, {
          value: '萩芦镇',
          label: '萩芦镇'
        }, {
          value: '白沙镇',
          label: '白沙镇'
        }, {
          value: '庄边镇',
          label: '庄边镇'
        }, {
          value: '新县镇',
          label: '新县镇'
        }, {
          value: '大洋乡',
          label: '大洋乡'
        }]
      }, {
        value: '荔城区',
        label: '荔城区',
        children: [{
          value: '镇海街道',
          label: '镇海街道'
        }, {
          value: '拱辰街道',
          label: '拱辰街道'
        }, {
          value: '西天尾镇',
          label: '西天尾镇'
        }, {
          value: '黄石镇',
          label: '黄石镇'
        }, {
          value: '新度镇',
          label: '新度镇'
        }, {
          value: '北高镇',
          label: '北高镇'
        }]
      }, {
        value: '秀屿区',
        label: '秀屿区',
        children: [{
          value: '笏石镇',
          label: '笏石镇'
        }, {
          value: '东庄镇',
          label: '东庄镇'
        }, {
          value: '忠门镇',
          label: '忠门镇'
        }, {
          value: '东埔镇',
          label: '东埔镇'
        }, {
          value: '东峤镇',
          label: '东峤镇'
        }, {
          value: '埭头镇',
          label: '埭头镇'
        }, {
          value: '平海镇',
          label: '平海镇'
        }, {
          value: '南日镇',
          label: '南日镇'
        }, {
          value: '湄洲镇',
          label: '湄洲镇'
        }, {
          value: '山亭镇',
          label: '山亭镇'
        }, {
          value: '月塘乡',
          label: '月塘乡'
        }]
      }, {
        value: '仙游县',
        label: '仙游县',
        children: [{
          value: '鲤城街道',
          label: '鲤城街道'
        }, {
          value: '枫亭镇',
          label: '枫亭镇'
        }, {
          value: '榜头镇',
          label: '榜头镇'
        }, {
          value: '郊尾镇',
          label: '郊尾镇'
        }, {
          value: '度尾镇',
          label: '度尾镇'
        }, {
          value: '鲤南镇',
          label: '鲤南镇'
        }, {
          value: '赖店镇',
          label: '赖店镇'
        }, {
          value: '盖尾镇',
          label: '盖尾镇'
        }, {
          value: '园庄镇',
          label: '园庄镇'
        }, {
          value: '大济镇',
          label: '大济镇'
        }, {
          value: '龙华镇',
          label: '龙华镇'
        }, {
          value: '钟山镇',
          label: '钟山镇'
        }, {
          value: '游洋镇',
          label: '游洋镇'
        }, {
          value: '西苑乡',
          label: '西苑乡'
        }, {
          value: '石苍乡',
          label: '石苍乡'
        }, {
          value: '社硎乡',
          label: '社硎乡'
        }, {
          value: '书峰乡',
          label: '书峰乡'
        }, {
          value: '菜溪乡',
          label: '菜溪乡'
        }]
      }]
    }
  },
  methods: {
    /**
     * 修改密码
     */
    changePassword () {
      if (this.newPassword === this.confirmPassword) {
        this.btnPasswordLoading = true
        axios.put('/users' / +this.user.id + '/password', {
          oldpassword: this.oldpassword,
          newpassword: this.newPassword
        }).then(res => {
          this.$message.success('更改密码成功')
        }).catch(err => {
          switch (err.response.status) {
            case 401: {
              this.$message.error('原密码错误！')
              break
            }
          }
        }).finally(() => {
          this.btnPasswordLoading = false
        })
      } else {
        this.$message.error('两次输入的密码不一致')
      }
    },
    /**
     * 发送邮箱验证码
     */
    sendCode (email) {
      this.btnCodeLoading = true
      axios.post('/website/email', { email: email }).then(
        () => {
          this.$message.success('验证码已成功发送至' + email)
        }).catch(() => {
        this.$message.error('发送失败！')
      }).finally(() => {
        this.btnCodeLoading = false
      })
    },
    /**
     * 修改邮箱按钮
     */
    changeEmail () {
      this.btnEmailLoading = true
      axios.put('/users' / +this.user.id + '/email', {
        email: this.newEmail,
        code: this.emailCode
      }).then(res => {
        this.$store.commit('userUpdate')
        this.$message.success('修改成功！')
      }).finally(() => {
        this.btnEmailLoading = false
      })
    },
    /**
     * 更新用户信息
     * @return {Promise<void>}
     */
    async updateUser () {
      return axios.put('/users/' + this.user.id, { user: this.user }).then(async (res) => {
        localStorage.setItem('token', res.data.token)
        await this.$store.dispatch('userUpdate')
        this.$message.success('修改成功！')
      }).catch(err => {
        this.$message.destroy()
        switch (err.response.status) {
          case 401: {
            this.$message.error('请检查登录状态！')
            break
          }
          case 409: {
            this.$message.error('该用户名存在冲突！')
            break
          }
          case 400: {
            this.$message.error('400:格式错误！')
            break
          }
          default: {
            console.log(err.response)
            this.$message.error('未知错误！请联系管理员！')
            this.$message.error('错误内容:' + err.response.data.msg)
            break
          }
        }
      })
    },
    /**
     * 上传图片
     * @param image 即将上传的文件信息
     */
    imageUpload (image) {
      var data = new FormData()
      data.append('file', image.file)
      axios({
        url: '/website/files',
        method: 'post',
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        this.user.avatar = res.data.url
        this.$message.success('成功上传啦~')
      }).catch(err => {
        this.$message.destroy()
        switch (err.response.status) {
          default: {
            this.$message.error(err.toString())
          }
        }
      })
    },
    /**
     * 在上传之前检查即将上传的文件
     * @param file 即将上传的文件
     */
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('仅支持上传jpg或png文件!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传的图片大小不超过2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    deleteWechat () {
      axios.delete(`/users/${this.user.id}/wechat`, { data: {} }).then(() => {
        this.$message.success('取消绑定成功！')
        this.user.wechat = false
      })
    }
  },
  computed: {
    /**
     * 资料完成度百分比
     * @returns {number} 资料完成度百分比
     */
    percent () {
      let now = 3.0
      if (this.user.nickname !== '') now += 1
      if (this.user.birthday !== '') now += 1
      if (this.user.telephone !== '') now += 1
      if (this.user.county !== '') now += 1
      if (this.user.town !== '') now += 1
      return parseInt(now * 100 / 8)
    },
    currentUsername () {
      return this.$store.getters.user.username
    },
    townOption: {
      get () {
        return [this.user.county, this.user.town]
      },
      set (value) {
        this.user.county = value[0]
        this.user.town = value[1]
      }
    },
    birthday: {
      get () {
        console.log(this.user.birthday, moment(this.user.birthday, 'YYYY-MM-DD'))
        return moment(this.user.birthday, 'YYYY-MM-DD')
      },
      set (value) {
        this.user.birthday = value.format('YYYY-MM-DD')
      }
    }
  },
  created () {
    this.user = { ...this.$store.getters.user }
  },
  watch: {
    '$store.getters.user' () {
      this.user = { ...this.$store.getters.user }
    }
  }
}
</script>

<style scoped>
.body {
  background: white;
  padding: 30px;
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
