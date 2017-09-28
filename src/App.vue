<style lang="less">
  @import "./styles/base/reset";
  @import "./assets/font/fontello";
</style>

<template>
  <div id="app">
    <router-view></router-view>
    <error
    :showerror.sync="isError"
    :error.sync="errorTip"></error>
  </div>
</template>

<script>
  import store from './vuex/store'
  import error from './components/modules/error/'
  import Request from './utils/request'

  export default {
    store,
    data () {
      return {
        isError: false,
        errorTip: ''
      }
    },
    components: {
      error
    },
    events: {
      callError (val) {
        if (val) {
          this.isError = true
          this.errorTip = val
        }
      },
      destoryError () {
        this.isError = false
      }
    },
    created () {
      Request.get({
        url: '/v3/user/detail'
      }).then((res) => {
        if (res.code !== 1) {
          return
        }
        let data = res.result
        window.localStorage.setItem('_user_info', JSON.stringify(data))
        const USER_ID = 'userId'
        const USER_NAME = 'userName'
        const USER_AVATAR = 'userAvatar'
        window.localStorage.removeItem(USER_ID)
        window.localStorage.removeItem(USER_NAME)
        window.localStorage.removeItem(USER_AVATAR)
        window.localStorage.setItem(USER_ID, data.id)
        window.localStorage.setItem(USER_NAME, data.fullname)
        window.localStorage.setItem(USER_AVATAR, data.avatar)
      }).catch((err) => {
        console.log(err)
        this.$dispatch('callError', '请登录')
      })
    }
  }
</script>
