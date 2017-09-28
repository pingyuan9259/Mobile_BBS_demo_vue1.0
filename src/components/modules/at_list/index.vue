<style lang="less">
  @import "../../../styles/base/base-750";
  @import "./index.less";
</style>
<!-- option : {
  number: number,
  sign: string,
} -->
<template>
  <div class="like_members" v-if="list">
    <div v-if="option && option.number">
      <span v-for="n in option.number">
        <a @click="getUserInfo(list[n].userId)">
          <span>
            {{ list[n].userName }}
          </span>
        </a>
        <span v-if="n < number - 1" class="comma">，</span>
      </span>
    </div>
    <div v-else>
      <span v-for="n in list.length">
        <a @click="getUserInfo(list[n].userId)">
          {{ list[n].userName }}
        </a>
        <span v-if="n < list.length - 1" class="comma">，</span>
      </span>
    </div>
  </div>
</template>

<script>
  // import $ from 'npm-zepto'
  // import Vue from 'vue'

  export default {
    data () {
      return {

      }
    },
    props: ['list', 'option'],
    ready () {
    },
    created () {

    },
    vuex: {

    },
    watch: {

    },
    methods: {
      getUserInfo (userId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'user_detail',
            options: { userId: userId }
          }))
        }
      }
    }
  }
</script>
