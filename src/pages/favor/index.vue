<style lang="less">
  @import './index.less';
</style>

<template>
  <div class="favor_page">
    <mt-cell
    title="赞了我的"
    v-link="{ path: 'favor_me' }"
    is-link>
      <mt-badge v-if="favorNumber > 0" size="small" color="#F43530" type="primary">{{ favorNumber }}</mt-badge>
    </mt-cell>
    <mt-cell
    title="我赞过的"
    v-link="{ path: 'favored' }"
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
        favorNumber: 0
      }
    },
    created () {
      let favorNum = JSON.parse(decodeURIComponent(Cookie.getCookie('favor_num_' + APP_ID)))
      this.favorNumber = favorNum || parseInt(window.localStorage.getItem('likeNum'))
    }
  }
</script>