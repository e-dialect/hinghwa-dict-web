<template>
  <!--没有登录时显示的内容-->
  <div v-if="!hasLogin">
    <a-space align="baseline" direction="horizontal" size="middle">
      <a-button class="link" size=small type="link">
        <router-link to="/login">登录</router-link>
      </a-button>
      <a-popover placement="bottom" trigger="hover">
        <template v-slot:content>
          <div>请登录您的账户</div>
        </template>
        <a-icon type="user"/>
      </a-popover>
    </a-space>
  </div>

  <!--登录后显示的内容-->
  <div v-else class="user">

    <a-popover placement="bottom" trigger="hover">
      <template v-slot:content>
        <p>你好，{{ username }}！</p>
      </template>
      <a-badge
        :count="unread"
        :title="`当前有${unread}条未读消息`"
      >
        <a-avatar
          :src="avatar"
          @click="$store.commit('drawerVisibility',true)"
        />
      </a-badge>
    </a-popover>

    <a-drawer
      :visible="drawerVisibility"
      :z-index="1500"
      placement="right"
      style="text-align:center"
      width="700"
      @close="$store.commit('drawerVisibility',false)"
    >

      <template v-slot:title>
        <a-row algin="middle" type="flex">
          <a-col :span="10"></a-col>
          <a-col :span="1">
            <a-avatar :src="avatar" alt="个人中心" width="40"/>
          </a-col>
          <a-col :span="3">个人中心</a-col>
          <a-col :span="4"></a-col>
          <a-col :span="3">
            <router-link :to="{name:'Notification'}">
              <a-badge :count="unread">
                <a-button icon="mail" type="dashed">
                  邮箱
                </a-button>
              </a-badge>
            </router-link>
          </a-col>
        </a-row>
      </template>

      <UserPage/>
    </a-drawer>

  </div>
</template>

<script>
import UserPage from '../../components/HeaderAndFooter/UserPage'
import store from '../../store'

export default {
  name: 'HeaderUser',
  components: {
    UserPage
  },
  computed: {
    hasLogin () {
      return store.getters.loginStatus
    },
    username () {
      return store.getters.user.username
    },
    avatar () {
      return store.getters.user.avatar
    },
    unread () {
      return store.getters.notification.statistics.unread
    },
    drawerVisibility: {
      get () {
        return store.getters.drawerVisibility
      },
      set (value) {
        store.commit('drawerVisibility', value)
      }
    }
  }
}
</script>

<style scoped>
.link {
  color: black
}
</style>
