<style lang="less">
  @import './index.less';
</style>

<template>
  <div class="reply_page">
    <mt-cell
    title="回复我的"
    v-link="{ path: 'reply_me' }"
    is-link>
      <mt-badge v-if="replyNumber > 0" size="small" color="#F43530" type="primary">{{ replyNumber }}</mt-badge>
    </mt-cell>
    <mt-cell
    title="我回复的"
    v-link="{ path: '/replied' }"
    is-link>
    </mt-cell>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Cell, Badge } from 'mint-ui'
  import Cookie from '../../utils/cookie'
  import { APP_ID } from '../../configs/app'

  Vue.component(Cell.name, Cell)
  Vue.component(Badge.name, Badge)

  export default {
    data () {
      return {
        replyNumber: 0
      }
    },
    created () {
      let replyNum = JSON.parse(decodeURIComponent(Cookie.getCookie('reply_num_' + APP_ID)))
      this.replyNumber = replyNum || parseInt(window.localStorage.getItem('replyNum'))
    }
  }
</script>