<style lang="less">
  @import "../../../styles/base/base-750";
  @import "./index.less";
</style>

<template>
  <ul class="forum_reply">
    <li v-for="key in replyLists" class="replsy" @click="index = $index" track-by="$index">
      <div class="head" id="{{ key.replyId }}">
        <div class="avatar" @click="getUserInfo(key.userId)">
          <img :src="key.userAvatar || defaultAvatar | https" data-ignore="1">
        </div>
        <div class="name" @click="getUserInfo(key.userId)">
          {{ key.userName }}
        </div>
        <div @click="domore(key.replyId, key.canDelete)" class="moreaction">
          <i class="icon-down"></i>
        </div>
      </div>
      <div class="first_level_reply">
        <div class="forum_reply_con" >
          <div v-for="message in key.mediaList">
            <p v-if="message.mediaType === replyConfig.TEXT_REPLY" v-html="message.mediaContent | enter"></p>
            <div class="img_con" v-if="message.mediaType === replyConfig.IMG_REPLY">
              <img :src="message.mediaContent | https"
              v-touch:tap="onTap(message.mediaContent)"
              v-touch:press="onTapHold(message.mediaContent)"
              @load="ckeckImg($event)" />
            </div>
            <div class="audio_con" v-if="message.mediaType === replyConfig.AUDIO_REPLY">
              <myaudio :src="message.mediaContent | https" :id="message.mediaId"></myaudio>
            </div>
          </div>
        </div>

        <div class="article-con" v-if="articleList[key.articleId]" @click="goArticle(key.articleId)">
          <div class="article-cover">
            <img :src="articleList[key.articleId].cover || defaultAvatar | https" @load="ckeckImg($event)">
          </div>
          <div class="article-title">
            <span>{{ articleList[key.articleId].title.length > 30 ? (articleList[key.articleId].title.substring(0, 30) + '...') : articleList[key.articleId].title }}</span>
          </div>
        </div>

        <div class="reply_at_list" v-if="key.atedMembers.length">
          <p>
            提到了：
          </p>
          <div class="at_member">
            <atlist :list="key.atedMembers"></atlist>
          </div>
        </div>

        <div class="post_details">
          <span>第{{ $index + 2 }}楼</span>
          <span>{{ key.createdAt | dateFormat }}</span>
          <div v-if="detail.type !== CONFIG.postType.homeWork" class="reply_button" @click="ReplyComment(key.replyId, key.userId, key.userName, key.surplusSecondReplyNum)">
            <i class="icon-reply"></i>
          </div>
          <div v-if="detail.type === CONFIG.postType.homeWork && (isChannelAdmin || userInfo.id === detail.userId)" class="reply_button" @click="ReplyComment(key.replyId, key.userId, key.userName, key.surplusSecondReplyNum)">
            <i class="icon-reply"></i>
          </div>
        </div>
      </div>

      <div v-if="key.secondReplys.length" class="second_reply_list">
        <div v-for="secondKey in key.secondReplys" class="list_wrap">
          <div class="list">
            <div class="list_main">
              <div class="right-section">
                <div class="say">
                  <p class="name">
                    <span @click="getUserInfo(secondKey.fromUserId)">{{ secondKey.fromUserName }}</span>
                    <span v-if="secondKey.toUserId">回复</span>
                    <span @click="getUserInfo(secondKey.toUserId)">{{ secondKey.toUserName }}</span>
                    :
                  </p>
                  <p v-for="message in secondKey.mediaList">
                    <span
                      v-if="message.mediaType === replyConfig.TEXT_REPLY"
                      id="{{ secondKey.replyId }}"
                      @click="ReplyTwoComment(key.replyId, secondKey.fromUserId, secondKey.fromUserName, secondKey.replyId, key.surplusSecondReplyNum)"
                      v-html="message.mediaContent | enter"></span>
                    <span class="img_con"
                      v-if="message.mediaType === replyConfig.IMG_REPLY"
                      @click="onTap(message.mediaContent)"> <i class="icon-picture"></i> 查看图片</span>
                  </p>
                  <i v-if="myUserId === secondKey.fromUserId" @click="deleteSecondReply(secondKey.replyId, $index, postid, key.replyId, key.surplusSecondReplyNum)" class="moreaction icon-trash"></i>
                </div>

                <div class="list_mention" v-if="secondKey.atedMembers && secondKey.atedMembers.length">
                  <p>提到了：</p>
                  <div class="at_member">
                    <atlist :list="secondKey.atedMembers"></atlist>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="more_list" v-if="key.surplusSecondReplyNum">
          <a href="javascript:;" @click="moreReplys(postid, key.replyId, $index)">
            更多 {{key.surplusSecondReplyNum}} 条回复…
          </a>
        </div>
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
  <mt-actionsheet :actions="myactions" :visible.sync="sheetVisible"></mt-actionsheet>
</template>

<script>
  import $ from 'npm-zepto'
  import Vue from 'vue'
  import atlist from '../at_list/index'
  import myaudio from '../audio_plug/audio'
  import {
    getDetailReplys,
    getPostDetail,
    getMoreReplys,
    getChannelAdmin,
    deleteReply,
    replyLinkAction,
    replyCommentAction
  } from '../../../vuex/forums/actions'
  import { collectionReply } from '../../../vuex/reply/actions'
  import { Spinner, Actionsheet, Toast, MessageBox } from 'mint-ui'
  import replyConfig from '../../../constants/replyType'
  import defaultImg from '../../../configs/default_img'
  import Cookie from '../../../utils/cookie'
  import postConfig from '../../../constants/postType'
  import { APP_ID, APP_ENV } from '../../../configs/app'

  Vue.component(Spinner.name, Spinner)
  Vue.component(Actionsheet.name, Actionsheet)

  export default {
    props: {
      postid: {
        type: Number,
        require: true
      }
    },
    data () {
      return {
        myactions: [],
        sheetVisible: false,
        loading: false,
        userInfo: {},
        myUserId: '',
        replyConfig: replyConfig,
        limit: 10,
        replyId: 0,
        canDelete: 0,
        index: 0,
        pid: 0,
        json: {},
        replyMore: true,
        CONFIG: postConfig,
        surplusSecondReplyNum: 0,
        defaultAvatar: defaultImg.avatar,
        loadbOk: false,
        deletebOk: true,
        isChannelAdmin: false
      }
    },
    components: {
      atlist,
      myaudio
    },
    vuex: {
      getters: {
        post_id: state => state.route.query.postId,
        page: state => state.forums.replyPage,
        replyLists: state => state.forums.replys,
        articleList: state => state.forums.articleList,
        detail: state => state.forums.detail,
        secondReplyList: state => state.forums.secondReplyList,
        allLoaded: state => state.forums.allLoaded
      },
      actions: {
        getDetailReplys,
        getPostDetail,
        getChannelAdmin,
        getMoreReplys,
        deleteReply,
        collectionReply,
        replyLinkAction,
        replyCommentAction
      }
    },
    watch: {
      allLoaded () {
        this.loading = true
      },
      replyLists (val) {
        let arr = []
        for (let i of val) {
          if (i.articleId) {
            arr.push(i.articleId)
          }
        }
        this.getPostDetail(arr)
      }
    },
    created () {
      let channelId = window.localStorage.getItem('channelId')
      this.getChannelAdmin(channelId, this.adminSuccess)
      this.myUserId = window.localStorage.getItem('userId')
      this.userInfo = JSON.parse(window.localStorage.getItem('_user_info'))
      if (!this.myUserId) {
        let userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
        this.myUserId = userInfo.id
      }
      // 获取url上的replyId
      let str = window.location.search.substring(1)
      let arr = []
      arr = str.split('&')
      for (let i = 0, len = arr.length; i < len; i++) {
        let a = arr[i].split('=')
        this.json[a[0]] = a[1]
      }
      if (this.json.replyId) {
        this.loadMoreSelf()
      } else {
        this.loadMore()
      }
    },
    ready () {
      let ua = navigator.userAgent.toLowerCase()
      if (/iphone|ipad|ipod/.test(ua)) {
        $('.loading').addClass('ios-bottom')
      }
      // 回复评论回调监听方法
      if (!window.tinfiniteListener) {
        window.tinfiniteListener = {}
      }
      window.tinfiniteListener.replyCommentListener = this.replyCommentSuccess

      // 滚动事件
      if (!this.json.replyId) {
        $(window).scroll(() => {
          let sh = $(window).scrollTop()
          let wh = $(window).height()
          let dh = $(document).height()
          if (dh - sh - wh < 30 && this.loadbOk && !this.allLoaded) {
            this.loadbOk = false
            this.loading = true
            this.loadMore()
          }
        })
      }
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
      loadMore () {
        let data = {
          post_id: this.post_id,
          page: this.page,
          limit: this.limit
          // second_reply_num: 10
        }
        this.getDetailReplys(data, this.success)
      },
      success () {
        this.loadbOk = true
      },
      adminSuccess (res, channelId) {
        let result = res.result[channelId].permanent
        let userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID))) || JSON.parse(window.localStorage.getItem('_user_info'))
        let userId = userInfo.id
        for (let i of result) {
          if (i.role_code === 1001 && i.user_id === userId) {
            this.isChannelAdmin = true
          }
        }
      },
      loadMoreSelf () {
        let data = {
          post_id: this.post_id,
          reply_id: this.json.replyId
        }
        this.replyLinkAction(data, this.success)
      },
      moreReplys (postId, firstReplyId, index) {
        this.index = index
        if (this.replyMore) {
          this.replyMore = false
          let data = {
            postId: postId,
            firstReplyId: firstReplyId
          }
          this.getMoreReplys(data, () => {
            this.replyMore = true
          })
        }
      },
      domore (replyId, canDelete) {
        this.replyId = replyId
        this.canDelete = canDelete
        this.myactions = [{
          name: canDelete === 1 ? '删除' : '举报',
          method: this.actionMethod
        }]
        this.sheetVisible = !this.sheetVisible
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
      // 回复帖子
      ReplyComment (replyId, userId, userName, surplusSecondReplyNum) {
        this.surplusSecondReplyNum = surplusSecondReplyNum
        let channelId = window.localStorage.getItem('channelId')
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'reply_post',
            options: {
              oneLevelId: replyId,  // 回复贴子时为0，回复评论时为当前评论的1级回复ID
              channelId: channelId,
              postId: this.post_id,
              toUserId: userId,
              toUserName: userName,
              pid: replyId // 回复贴子时为0，回复评论时为评论id
            }
          }))
        }
      },
      ReplyTwoComment (replyId, userId, userName, pId, surplusSecondReplyNum) {
        this.surplusSecondReplyNum = surplusSecondReplyNum
        this.pid = pId
        let channelId = window.localStorage.getItem('channelId')
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'reply_post',
            options: {
              oneLevelId: replyId,  // 回复贴子时为0，回复评论时为当前评论的1级回复ID
              channelId: channelId,
              postId: this.post_id,
              toUserId: userId,
              toUserName: userName,
              pid: pId // 回复贴子时为0，回复评论时为评论id
            }
          }))
        }
      },
      replyCommentSuccess (data) {
        this.$dispatch('twoLevelReplySuccess')
        let res = JSON.parse(data)
        if (res.code === 1) {
          let data = res.result
          let arr = []
          let Json = {
            replyId: data.replyId,
            oneLevelId: data.oneLevelId,
            postId: data.postId,
            fromUserName: data.fromUserName,
            fromUserId: data.fromUserId,
            toUserName: data.toUserName,
            toUserId: data.toUserId,
            mediaList: data.mediaList,
            atedMembers: data.atedMembers.length ? data.atedMembers : null,
            createdAt: data.createdAt,
            canDelete: data.canDelete
          }
          Json.mediaList[0].mediaContent = Json.mediaList[0].mediaContent.replace(/<n\/>/g, '\n')

          // 判断是否为三级评论
          if (this.pid !== data.pid) {
            Json.toUserName = null
            Json.toUserId = null
          }
          arr.push(Json)
          this.replyCommentAction(arr)
          setTimeout(() => {
            window.location.hash = '#' + data.replyId
          }, 300)
        }
      },
      actionMethod () {
        return this.canDelete === 1 ? this._deleteReply() : this._complaint()
      },
      deleteSecondReply (replyId, index, postId, firstReplyId, surplusSecondReplyNum) {
        if (this.deletebOk) {
          this.deletebOk = false
          MessageBox.confirm('确定删除该条评论?', '', {
            confirmButtonClass: 'confirm',
            cancelButtonClass: 'cancel'
          }).then(() => {
            if (surplusSecondReplyNum && this.replyLists[this.index].secondReplys.length <= 2) {
              let data = {
                postId: postId,
                firstReplyId: firstReplyId,
                forDelete: true
              }
              this.getMoreReplys(data)
            }
            this.replyId = replyId
            this.index = index
            let data = {
              reply_id: replyId,
              second: true
            }
            this.deleteReply(data, this.deleteSuccess, this.deleteFail)
          }).catch(() => {
            this.deletebOk = true
            return
          })
        }
      },
      _deleteReply () {
        if (this.deletebOk) {
          this.deletebOk = false
          MessageBox.confirm('确定删除该楼层?', '', {
            confirmButtonClass: 'confirm',
            cancelButtonClass: 'cancel'
          }).then(() => {
            let data = {
              reply_id: this.replyId
            }
            this.deleteReply(data, this.deleteSuccess, this.deleteFail)
          }).catch(() => {
            this.deletebOk = true
            return
          })
        }
      },
      _complaint () {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'report_page',
            options: {
              type: 'bbs_reply',
              id: this.replyId
            }
          }))
        }
        // this.$route.router.go({path: '/post_report?postId=' + this.post_id + '&replyId=' + this.replyId})
      },
      deleteSuccess () {
        this.deletebOk = true
        Toast({
          message: '删除成功',
          duration: 800
        })
        this.$dispatch('deleteReplySuccess')
      },
      deleteFail () {
        this.deletebOk = true
        Toast({
          message: '删除失败',
          duration: 800
        })
      },
      goArticle (id) {
        if (id) {
          let env = APP_ENV === 'pro' ? '' : '-' + APP_ENV
          window.location.href = `//h5${env}.xinshengdaxue.com/post_detail.html?id=${id}`
        }
      }
    }
  }
</script>
