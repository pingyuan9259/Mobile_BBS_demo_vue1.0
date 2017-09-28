<style lang="less">
  @import "../../styles/base/reset";
  @import "./index";

  .hello {
    .mint-popup-right {
      width: 100%;
      height: 100%;
    }
    .name {
      color: blue;
    }

    .active {
      color: red;
    }
  }
</style>

<template>
  <div class="hello" style="position:relative;">
    <h1 @click="sheetVisible = true">{{ msg1 }}</h1>
    <h1 @click="popupVisible = true">{{ msg2 }}</h1>
    <mt-popup
      :visible.sync="popupVisible"
      position="right">
      <div style="position:absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff;">asdfasdf</div>
    </mt-popup>
    <mt-actionsheet
      :actions="actions"
      :visible.sync="sheetVisible">
    </mt-actionsheet>
    <div style="margin-top: 50px;" v-html="'你好大幅大沙发沙发我如何@王五 给世界发达发送到发@张三 @李四 送到发生大姑家饭店不分手大师加开发规范卡萨丁' | AtUser userInfo "></div>
    <div style="margin-top: 50px;">
        <span :class="{'active' : value === 'active' }" v-for="value in num" track-by="$index">1</span>
    </div>
    <audio-plug
      :src="src"></audio-plug>
    <active-post-item></active-post-item>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Actionsheet, Popup } from 'mint-ui'
  import store from '../../vuex/store'
  import { getList } from '../../vuex/test/actions'
  import $ from 'npm-zepto'
  import audioPlug from '../../components/modules/audio_plug/audio'
  import activePostItem from '../../components/modules/active_post_item/'

  Vue.component(Actionsheet.name, Actionsheet)
  Vue.component(Popup.name, Popup)

  export default {
    store,
    data () {
      return {
        actions: [{
          name: '收藏',
          method () {
            console.log('收藏')
          }
        }, {
          name: '举报',
          method () {
            console.log('举报')
          }
        }],
        sheetVisible: false,
        popupVisible: false,
        msg1: 'Hello',
        msg2: 'World!',
        userInfo: [{
          id: 1,
          fullname: '王五'
        }, {
          id: 2,
          fullname: '张三'
        }, {
          id: 3,
          fullname: '李四'
        }],
        num: {},
        src: '//o4a7cbihz.qnssl.com/unknown/11787766-18fc-4ddd-b28d-2d8636000d73'
      }
    },
    components: {
      audioPlug,
      activePostItem
    },
    vuex: {
      getters: {
        lists: ({ test }) => test.lists
      },
      actions: {
        getList
      }
    },
    created () {
      this.getList([1, 2, 3, 4])
      this.initNum()
    },
    ready () {
      console.log(this.lists)
      let self = this
      $('.name').bind('click', function () {
        let id = $(this).attr('data-user-id')
        self.getUserInfo(id)
      })
    },
    methods: {
      getUserInfo (userId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.getPostUserId) {
          bridge.getPostUserId(userId)
        }
      },
      initNum () {
        let arr = [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0]
        let json = {}
        let d = 0
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] === 0) {
            d = 0
          } else {
            arr[i] += d
            d++
          }
        }
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] >= 7) {
            let n = i - arr[i]
            for (let j = n + 1; j <= i; j++) {
              json[j] = 'active'
            }
          } else {
            json[i] = 'no'
          }
        }
        this.num = json
      }
    }
  }
</script>
