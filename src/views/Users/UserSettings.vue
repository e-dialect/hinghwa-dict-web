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
                  :before-upload="checkImageBeforeUpload"
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
            <AreaCascader :county.sync="user.county" :disabled="!editing" :town.sync="user.town"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 24, offset: 5 }">
            <a-button v-if="!editing" type="primary" v-on:click="editing=true">
              编辑
            </a-button>
            <div v-else>
              <a-button
                type="primary"
                v-on:click="updateUser().finally(() => {editing = false})"
                :loading="btnUserLoading"
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
              v-if="user.wechat"
              icon="wechat"
              type="link"
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
                <a-form>
                  <a-form-item :wrapper-col="{ span: 12, offset: 3 }" label="新邮箱">
                    <a-input v-model="newEmail"/>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 16, offset: 3 }" label="验证码">
                    <a-row align="middle" justify="start" type="flex">
                      <a-col :span="16">
                        <a-input v-model="emailCode"/>
                      </a-col>
                      <a-col :span="2">
                        <a-button
                          :disabled="!EmailReg.test(newEmail)"
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
import AreaCascader from '../../components/User/AreaCascader'
import { EmailReg } from '@/consts/reg-exp'
import { changeEmailRequest, changePasswordRequest, deleteWechatRequest, updateUserRequest } from '@/services/users'
import { sendCodeRequest, uploadFile, checkImageBeforeUpload } from '@/services/website'

export default {
  name: 'userSettings',
  components: { AreaCascader },
  data () {
    return {
      moment, // 字符串转时间object时需要用到的变量
      EmailReg: EmailReg, // 邮箱正则表达式
      checkImageBeforeUpload: checkImageBeforeUpload, // 上传图片前的校验函数

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
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },

      btnCodeLoading: false,
      btnEmailLoading: false,
      btnPasswordLoading: false,
      btnUserLoading: false

    }
  },
  methods: {
    /**
     * 修改密码
     */
    changePassword () {
      if (this.newPassword !== this.confirmPassword) {
        this.$message.error('两次输入的密码不一致')
        return
      }
      this.btnPasswordLoading = true
      changePasswordRequest(this.id, this.oldPassword, this.newPassword).finally(() => {
        this.btnPasswordLoading = false
      })
    },

    /**
     * 发送邮箱验证码
     */
    sendCode (email) {
      this.btnCodeLoading = true
      sendCodeRequest(email).finally(() => {
        this.btnCodeLoading = false
      })
    },

    /**
     * 修改邮箱按钮
     */
    changeEmail () {
      this.btnEmailLoading = true
      changeEmailRequest(this.id, this.newEmail, this.emailCode).then(() => {
        this.$store.commit('userUpdate')
      }).finally(() => {
        this.btnEmailLoading = false
      })
    },

    /**
     * 更新用户信息
     * @return {Promise<void>}
     */
    async updateUser () {
      this.btnUserLoading = true
      updateUserRequest(this.id, this.user).then(async () => {
        await this.$store.commit('userUpdate')
      }).finally(() => {
        this.btnUserLoading = false
      })
    },
    /**
     * 上传图片
     * @param image 即将上传的文件信息
     */
    async imageUpload (image) {
      const url = await uploadFile(image.file)
      if (url) {
        this.user.avatar = url
      }
    },

    /**
     * 取消绑定微信
     */
    deleteWechat () {
      deleteWechatRequest(this.id).then(() => {
        this.$store.commit('userUpdate')
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
    id () {
      return this.$store.getters.user.id
    },

    birthday: {
      get () {
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
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
