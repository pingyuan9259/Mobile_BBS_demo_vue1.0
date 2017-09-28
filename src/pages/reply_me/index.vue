<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="reply_me_page">
    <ul>
      <li v-for="item in lists">
        <!-- 回复人头像姓名 -->
        <div class="header clearfix" @click="getUserInfo(item.replyUserId)">
          <img :src="item.replyAvatar || defaultAvatar | https" data-ignore="1" />
          <p class="name">{{ item.replyFullname }}</p>
        </div>
        <!-- 二级回复 -->
        <div v-if="item.oneLevelId" class="describe">
          <div class="reply-box" v-for="reply in item.replyMessageList">
            <p class="reply-content" v-if="reply.mediaType === 1">
              <span>回复</span>
              <span class="name" @click="getUserInfo(item.replyToUserId)">{{ item.replyToUserFullname }}</span>
              <span>：</span>
              <span v-html="(reply.mediaContent.length > 53 ? (reply.mediaContent.substring(0, 50) + '...') : reply.mediaContent) | enter 50"></span>
            </p>
            <p class="show-more" v-if="reply.mediaType === 1 && reply.mediaContent.length > 63" @click="showMoreCon($event, reply.mediaContent, true)">展开更多</p>
          </div>
          <!-- 以后加入语音功能 -->
          <div class="reply_img">
            <a v-for="reply in item.replyMessageList" v-if="reply.mediaType === 2" href="javascript:;" >
              <img :src="reply.mediaContent | https"
              v-touch:tap="onTap(reply.mediaContent)"
              v-touch:press="onTapHold(reply.mediaContent)"
              @load="ckeckImg($event)" />
            </a>
          </div>
        </div>
        <!-- 一级回复 -->
        <div v-else class="describe" v-for="reply in item.replyMessageList">
          <div class="reply-box" v-if="reply.mediaType === 1">
            <p class="reply-content" v-html="(reply.mediaContent.length > 63 ? (reply.mediaContent.substring(0, 60) + '...') : reply.mediaContent) | enter 60"></p>
            <span class="show-more" v-if="reply.mediaContent.length > 63" @click="showMoreCon($event, reply.mediaContent)">展开更多</span>
          </div>
          <!-- 以后加入语音功能 -->
          <div class="reply_img">
            <a v-if="reply.mediaType === 2" href="javascript:;" >
              <img :src="reply.mediaContent | https"
              v-touch:tap="onTap(reply.mediaContent)"
              v-touch:press="onTapHold(reply.mediaContent)"
              @load="ckeckImg($event)" />
            </a>
          </div>
        </div>
        <!-- @ -->
        <div class="at_me_con" :class="{'active' : item.oneLevelId}" v-if="item.atReply.length">
          <p class="tip">提到了：</p>
          <div class="at_me">
            <span v-for="user in item.atReply">
              <a href="javascript:;" @click="getUserInfo(user.userId)">
                {{ user.fullname }}
              </a>
              <span v-if="item.atReply.length !== ($index + 1)" class="comma">，</span>
            </span>
          </div>
        </div>
        <!-- 贴子信息和一级回复 -->
        <div :class="{'details_con' : item.oneLevelId }" >
          <div v-if="item.oneLevelId" class="reply">
            <span class="name" @click="getUserInfo(item.myUserId)">{{ item.myFullname }}</span>
            <span>：</span>
            <p v-for="myReply in item.myMessageList" v-if="myReply.mediaType === 1">{{ myReply.mediaContent.length > 63 ? (myReply.mediaContent.substring(0, 60) + '...') : myReply.mediaContent }}</p>
            <!-- 以后加入语音功能 -->
            <div class="reply_img">
              <a v-for="myReply in item.myMessageList" v-if="myReply.mediaType === 2" href="javascript:;" >
                <img :src="myReply.mediaContent | https"
                v-touch:tap="onTap(myReply.mediaContent)"
                v-touch:press="onTapHold(myReply.mediaContent)"
                @load="ckeckImg($event)" />
              </a>
            </div>
          </div>
          <!-- 二级@ -->
          <div v-if="item.oneLevelId && item.myAtReply.length" class="at_me_con">
            <p class="tip">提到了：</p>
            <div class="at_me">
              <span v-for="user in item.myAtReply">
                <a href="javascript:;" @click="getUserInfo(user.userId)">
                  {{ user.fullname }}
                </a>
                <span v-if="item.myAtReply.length !== ($index + 1)" class="comma">，</span>
              </span>
            </div>
          </div>
          <post
            :id="item.postId"
            :img="item.postImage || item.postCreaterAvatar || defaultAvatar"
            :name="item.postCreaterName || ''"
            :title="item.postTitle"
            :replyid="item.replyId"></post>
        </div>
        <div class="foot clearfix">
          <span class="time">{{ item.replyedAt | dateFormat }}</span>
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
  import { getReplyMeList, destroyReplyStore } from '../../vuex/reply/actions'
  import $ from 'npm-zepto'
  import noMoreNews from '../../components/modules/no_more_news/'
  import defaultImg from '../../configs/default_img'
  import Cookie from '../../utils/cookie'
  import { APP_ID } from '../../configs/app'

  Vue.component(Spinner.name, Spinner)

  export default {
    data () {
      return {
        loading: false,
        limit: 10,
        loadSuccess: false,
        bOk: false,
        defaultAvatar: defaultImg.avatar,
        showMore: false
      }
    },
    components: {
      post,
      noMoreNews
    },
    vuex: {
      getters: {
        page: ({ reply }) => reply.replyMePage,
        lists: ({ reply }) => reply.replyMeLists,
        allLoaded: ({ reply }) => reply.replyMeAllLoaded,
        isNoNews: ({ reply }) => reply.replyMeIsNoNews
      },
      actions: {
        getReplyMeList,
        destroyReplyStore
      }
    },
    watch: {
      lists (val) {
        if (!val.length) {
          this.noNews = true
        }
      },
      allLoaded () {
        this.loading = true
      }
    },
    created () {
      Indicator.open({ spinnerType: 'fading-circle' })
      this.loadMore()
    },
    ready () {
      window.localStorage.removeItem('replyNum')
      Cookie.delCookie('reply_num_' + APP_ID, 'xinshengdaxue.com')
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
      let bridge = window.tinfiniteBridge
      if (bridge && bridge.loadCompleted) {
        bridge.loadCompleted()
      }
    },
    beforeDestroy () {
      this.$dispatch('destoryError')
      this.destroyReplyStore()
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
        this.getReplyMeList(data, this.success, this.fail)
      },
      success () {
        this.bOk = true
        this.loadSuccess = true
        Indicator.close()
        window.localStorage.removeItem('replyNum')
      },
      fail (val) {
        Indicator.close()
        this.$dispatch('callError', val)
      },
      showMoreCon (event, con, exd) {
        if (exd) {
          let len = $(event.target).prev('.reply-content').children('span:last-child').html().length
          if (len > 53) {
            $(event.target).prev('.reply-content').children('span:last-child').html(con.replace(/\n/g, '<br>').substring(0, 50) + '...')
            $(event.target).text('展开更多')
          } else {
            $(event.target).prev('.reply-content').children('span:last-child').html(con.replace(/\n/g, '<br>'))
            $(event.target).text('收起更多')
          }
        } else {
          let len = $(event.target).prev('.reply-content').html().length
          if (len > 63) {
            $(event.target).prev('.reply-content').html(con.replace(/\n/g, '<br>').substring(0, 60) + '...')
            $(event.target).text('展开更多')
          } else {
            $(event.target).prev('.reply-content').html(con.replace(/\n/g, '<br>'))
            $(event.target).text('收起更多')
          }
        }
      }
    }
  }
</script>
