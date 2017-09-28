<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="at_me_page">
    <ul>
      <li v-for="item in lists">
        <div class="header clearfix" @click="getUserInfo(item.fromUserId)">
          <img :src="item.fromUserAvatar || defaultAvatar | https" data-ignore="1" />
          <p class="name">{{ item.fromUserName }}</p>
        </div>
        <div class="reply-box">
          <p class="describe" v-html="(item.content.length > 63 ? (item.content.substring(0, 60) + '...') : item.content) | enter 60"></p>
          <span class="show-more" v-if="item.content.length > 63" @click="showMoreCon($event, item.content, true)">展开更多</span>
        </div>
        <div v-if="item.contentImage" class="at_me_img">
          <img :src="item.contentImage | https"
          v-touch:tap="onTap(item.contentImage)"
          v-touch:press="onTapHold(item.contentImage)"
          @load="ckeckImg($event)" />
        </div>
        <div class="at_me_con">
          <p class="tip">提到了：</p>
          <div class="at_me">
            <div v-for="user in item.atUser">
              <a href="javascript:;" @click="getUserInfo(user.atUserId)">{{ user.atFullname }}</a>
              <span v-if="item.atUser.length !== ($index + 1)">，</span>
            </div>
          </div>
        </div>
        <post
          :id="item.postId"
          :img="item.postImage || item.postCreaterAvatar || defaultAvatar | https"
          :name="item.postCreaterName"
          :title="item.postTitle"
          :replyid="item.replyId"></post>
        <div class="foot clearfix">
          <span class="time">{{ item.createdAt | dateFormat }}</span>
          <span class="title">{{ item.bbsName }}</span>
        </div>
      </li>
    </ul>
    <div class="loading" v-show="loading">
      <div v-if="!allLoaded">
        <mt-spinner type="fading-circle"></mt-spinner>
        加载中...
      </div>
      <div v-else>暂无更多</div>
    </div>
  </div>
  <no-more-news v-if="isNoNews"></no-more-news>
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator } from 'mint-ui'
  import post from '../../components/modules/post'
  import { getAtMeList, destroyAtMeStore } from '../../vuex/atMe/actions'
  import $ from 'npm-zepto'
  import noMoreNews from '../../components/modules/no_more_news/'
  import defaultImg from '../../configs/default_img'

  Vue.component(Spinner.name, Spinner)

  export default {
    data () {
      return {
        loading: false,
        limit: 10,
        loadSuccess: false,
        bOk: false,
        defaultAvatar: defaultImg.avatar
      }
    },
    components: {
      post,
      noMoreNews
    },
    vuex: {
      getters: {
        page: ({ atMe }) => atMe.page,
        lists: ({ atMe }) => atMe.lists,
        allLoaded: ({ atMe }) => atMe.allLoaded,
        isNoNews: ({ atMe }) => atMe.isNoNews
      },
      actions: {
        getAtMeList,
        destroyAtMeStore
      }
    },
    watch: {
      allLoaded () {
        this.loading = true
      }
    },
    created () {
      Indicator.open({ spinnerType: 'fading-circle' })
      this.loadMore()
    },
    ready () {
      $(window).scroll(() => {
        let sh = $(window).scrollTop()
        let wh = $(window).height()
        let dh = $(document).height()
        if (dh - sh - wh < 30 && this.bOk && !this.allLoaded) {
          this.bOk = false
          this.loading = true
          this.loadMore()
        }
      })
    },
    beforeDestroy () {
      this.$dispatch('destoryError')
      this.destroyAtMeStore()
    },
    methods: {
      onTap (src) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.imgSingleTap) {
          bridge.imgSingleTap(src)
        }
      },
      onTapHold (src) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.imgLongTap) {
          bridge.imgLongTap(src)
        }
      },
      ckeckImg (event) {
        let target = event.target
        let width = parseInt($(target).css('width'))
        let height = parseInt($(target).css('height'))
        if (width <= height) {
          $(target).css('width', '100%')
        } else {
          $(target).css('height', '100%')
        }
      },
      getUserInfo (userId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'user_detail',
            options: { userId: userId }
          }))
        }
      },
      loadMore () {
        let data = {
          page: this.page,
          limit: this.limit
        }
        this.getAtMeList(data, this.success, this.fail)
      },
      success () {
        this.bOk = true
        this.loadSuccess = true
        window.localStorage.removeItem('atNum')
        Indicator.close()
      },
      fail (val) {
        Indicator.close()
        this.$dispatch('callError', val)
      },
      showMoreCon (event, con) {
        let len = $(event.target).prev('.describe').html().length
        if (len > 63) {
          $(event.target).prev('.describe').html(con.replace(/\n/g, '<br>').substring(0, 60) + '...')
          $(event.target).text('展开更多')
        } else {
          $(event.target).prev('.describe').html(con.replace(/\n/g, '<br>'))
          $(event.target).text('收起更多')
        }
      }
    }
  }
</script>
