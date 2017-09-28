<style lang="less">
  @import "../../styles/base/base-750";
  @import './index';
</style>

<template>
  <div class="post_deteil_page" v-if="loadSuccess">
    <!-- <no-more-news
      v-if="detail.type === CONFIG.postType.activity && !isMyPublish && isNoDeal"
      :nomoretip="noDealTip"></no-more-news> -->
    <div v-else class="forum_deteil_page">
      <div class="forum_deteil">
        <div class="forum_head">

          <div class="det">
            <div class="title">{{ detail.title }}</div>
            <div class="zp">
              <i class="icon-like">
                <span>{{ likeNum }}</span>
              </i>
              <i class="icon-reply">
                <span>{{ replyNum }}</span>
              </i>
            </div>
          </div>

        </div>
        <div class="forum_body">
          <div class="body_con">
            <div class="head">
              <div class="img" @click="getUserInfo(detail.userId)">
                <img :src="detail.userAvatar || defaultAvatar | https" data-ignore="1" >
              </div>
              <div class="name" @click="getUserInfo(detail.userId)">
                {{ detail.userName }}
              </div>
              <div class="author">
                <span class="tag tag-blue">楼主</span>
              </div>
              <div @click="domore(detail.canDelete)" class="moreaction">
                <i class="icon-down"></i>
              </div>
            </div>

            <div v-if="detail.type === CONFIG.postType.punch && detail.goal" class="clock_title">
              <p>{{ detail.goal }}</p>
            </div>

            <div class="con">
              <div class="media_wrap">
                <div v-if="detail.audioContents">
                  <div class="media_audio" v-for="audio in detail.audioContents">
                    <myaudio :src="audio.mediaContent | https"></myaudio>
                  </div>
                </div>
                <div class="media_text" v-if="detail.content">
                  <p v-html="detail.content | enter | linkReplace true"></p>
                </div>
                <div class="media_image" v-if="detail.imageContents">
                  <img v-for="item in detail.imageContents"
                    :src="item.mediaContent | https" alt="" :height="initImgHeight(item.mediaWidth, item.mediaHeight)"
                    v-touch:tap="onTap(item.mediaContent)"
                    v-touch:press="onTapHold(item.mediaContent)" />
                </div>
              </div>
            </div>

            <vote></vote>
            <apply></apply>

            <div class="mention" v-if="detail.atedMembers && detail.atedMembers.length">
              <div class="mention_text">
                <p>提到了:</p>
              </div>
              <div class="mention_list">
                <img
                  v-for="key in detail.atedMembers"
                  :src="key.avatar || defaultAvatar | https"
                  data-ignore="1"
                  @click="getUserInfo(key.userId)">
              </div>
            </div>

            <div class="like_member" v-if="likeNum">
              <div class="like_members_wrap">
                <atlist :list="likeMembers"></atlist>
              </div>
              <span class="like_total" v-link="{ path: 'favor_list?postId=' + postId }">
                <span v-if="likeNum >= 5">等{{ likeNum }}人</span>赞过
              </span>
            </div>

            <div class="post_details">
              <span class="floor_number">第1楼</span>
              <span class="time">{{ detail.createdAt | dateFormat }}</span>
            </div>
          </div>
        </div>

        <reply :postid='parseInt(postId)'></reply>
      </div>
      <div v-show="showReply" class="deteil_action">
        <div v-if="detail.type !== CONFIG.postType.homeWork" class="re" @click="ReplyPost">
          <span class="zp">
            <i class="icon-reply">
              <span>回复</span>
            </i>
          </span>
        </div>
        <div v-if="detail.type === CONFIG.postType.homeWork" class="re" @click="write">
          <span class="zp">
            <i class="icon-write">
              <span>{{ writeTxt }}</span>
            </i>
          </span>
        </div>
        <i class="center_border"></i>
        <div class="dz" @click="postLike">
          <span class="zp">
            <i :class="{ 'like_or_not icon-like-active': likeOrNot, 'icon-like' : !likeOrNot}">
              <span><i v-if="likeOrNot">已</i><i v-else>点</i>赞</span>
            </i>
          </span>
        </div>
      </div>
    </div>
  </div>
  <mt-actionsheet :actions="myactions" :visible.sync="sheetVisible"></mt-actionsheet>
</template>

<script>
  import Vue from 'vue'
  import reply from '../../components/modules/post_reply/index'
  import atlist from '../../components/modules/at_list/index'
  import myaudio from '../../components/modules/audio_plug/audio'
  import vote from '../../components/modules/post_detail_vote/index'
  import apply from '../../components/modules/post_detail_apply/index'
  import { getForumDetail, likeOrCancel, replyPostAction, destroyForumsStore } from '../../vuex/forums/actions'
  import { deletePost } from '../../vuex/post/actions'
  import { collectionReply } from '../../vuex/reply/actions'
  import { Actionsheet, Indicator, Toast, MessageBox } from 'mint-ui'
  import Title from '../../utils/setTitle'
  import defaultImg from '../../configs/default_img'
  import Cookie from '../../utils/cookie'
  import largeVersion from '../../utils/checkVersion'
  import { APP_ID } from '../../configs/app'
  import postConfig from '../../constants/postType'
  import noMoreNews from '../../components/modules/no_more_news/'
  import moment from 'moment'

  Vue.component(Actionsheet.name, Actionsheet)

  export default {
    data () {
      return {
        sheetVisible: false,
        likeOrNot: false,
        myactions: [],
        likeNum: 0,
        replyNum: 0,
        loadSuccess: false,
        likeAction: true,
        likeMembers: [],
        userInfo: null,
        defaultAvatar: defaultImg.avatar,
        CONFIG: postConfig,
        isMyPublish: false,
        isNoDeal: false,
        noDealTip: '此活动贴暂未通过审核',
        writeTxt: '写作业',
        canDelete: 0,
        showReply: true
      }
    },
    components: {
      reply,
      atlist,
      myaudio,
      vote,
      apply,
      noMoreNews
    },
    vuex: {
      getters: {
        postId: state => state.route.query.postId,
        detail: state => state.forums.detail,
        isLike: state => state.forums.detail.likeOrNot,
        deleteStatus: ({ post }) => post.deleteStatus
      },
      actions: {
        getForumDetail,
        likeOrCancel,
        deletePost,
        replyPostAction,
        collectionReply,
        destroyForumsStore
      }
    },
    watch: {
      detail (val) {
        if (val.status === 0) {
          this.$dispatch('callError', '贴子不存在')
          return
        }
        document.title = val.title
        Title.set(val.title)
        if (val.type === 1 && val.isPass === 2) {
          this.showButton()
        }
        if (val.type === 1 && val.isPass !== 2) {
          this.showReply = false
        }
        this.likeOrNot = val.likeOrNot
        this.likeNum = val.likeNum
        this.replyNum = val.replyNum
        this.isNoDeal = (val.deal === 0)
        if (!this.userInfo) {
          this.userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
        }
        if (this.userInfo) {
          this.isMyPublish = (this.userInfo.id === val.userId)
        }
        window.localStorage.setItem('channelId', val.channelId)
        this.postInfo()
        if (this.detail && val.likeMembers) {
          this.likeMembers = val.likeMembers.slice(0, 4)
        }
        if (moment(moment()).isAfter(this.detail.homeworkEndAt)) {
          this.writeTxt = '作业已超期'
        }
        Title.set(val.title)
      },
      isLike (val) {
        this.likeOrNot = val === 1 ? 1 : 0
      }
    },
    events: {
      deleteReplySuccess () {
        this.replyNum -= 1
      },
      twoLevelReplySuccess () {
        this.replyNum += 1
      }
    },
    created () {
      this.userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
      if (!document.title) {
        document.title = '论坛'
      }
      Title.set('论坛')
      if (!this.userInfo && !window.localStorage.getItem('_user_info')) {
        this.$dispatch('callError', '请登录')
        return
      }
      if (this.userInfo) {
        this.userInfo.verify.status === 1 ? this.loadMore() : this.noVerify()
      } else {
        let timer = setInterval(() => {
          if (window.localStorage.getItem('_user_info')) {
            clearInterval(timer)
            let verify = JSON.parse(window.localStorage.getItem('_user_info')).verify.status
            verify === 1 ? this.loadMore() : this.noVerify()
          }
        }, 300)
      }
      Indicator.open({ spinnerType: 'fading-circle' })
    },
    ready () {
      // 回复楼主回调监听方法
      if (!window.tinfiniteListener) {
        window.tinfiniteListener = {}
      }
      window.tinfiniteListener.replyPostListener = this.replyPostSuccess
    },
    beforeDestroy () {
      this.$dispatch('destoryError')
      this.destroyForumsStore()
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
      loadMore () {
        let data = {
          post_id: this.postId,
          latest_like_num: 5,
          latest_vote_num: 8
        }
        this.getForumDetail(data, this.success, this.fail)
      },
      noVerify () {
        this.$dispatch('callError', '未认证')
        return
      },
      success () {
        Indicator.close()
        this.loadSuccess = true
      },
      fail (val) {
        Indicator.close()
        this.$dispatch('callError', val)
      },
      // 回复贴子
      ReplyPost () {
        let channelId = '0'
        if (this.detail.type !== this.CONFIG.postType.activity) {
          channelId = this.detail.channelId
        }
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'reply_post',
            options: {
              oneLevelId: 0,  // 回复贴子时为0，回复评论时为当前评论的1级回复ID
              channelId: channelId,
              postId: this.postId,
              toUserId: this.detail.userId,
              toUserName: '楼主',
              pid: 0 // 回复贴子时为0，回复评论时为评论id
            }
          }))
        }
      },
      // 回复贴子成功后回调
      replyPostSuccess (data) {
        let res = JSON.parse(data)
        if (res.code === 1) {
          this.replyNum += 1
          let data = res.result
          let arr = []
          let Json = {
            type: data.type || 1,
            replyId: data.replyId,
            postId: data.postId,
            userName: data.fromUserName,
            userId: data.fromUserId,
            userAvatar: data.fromAvatar,
            mediaList: data.mediaList,
            atedMembers: data.atedMembers.length ? data.atedMembers : null,
            createdAt: data.createdAt,
            surplusSecondReplyNum: 0,
            canDelete: data.canDelete,
            secondReplys: [],
            oneLevelReply: true // 表明这是一级回复
          }
          Json.mediaList[0].mediaContent = Json.mediaList[0].mediaContent.replace(/<n\/>/g, '\n')
          if (res.result.type === 2) {
            Json.articleId = res.result.articleId
          }
          arr.push(Json)
          this.replyPostAction(arr)
          setTimeout(() => {
            window.location.hash = '#' + data.replyId
          }, 300)
        }
      },
      // 显示分享按钮
      showButton () {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.showButton) {
          bridge.showButton(JSON.stringify([{ type: 1, value: '', callback: '' }]))
        }
      },
      // 写作业
      write () {
        if (!largeVersion('2.3.8')) {
          MessageBox({
            message: '当前版本过低，请升级到最新版本！',
            confirmButtonText: '确认',
            confirmButtonClass: 'confirm',
            showCancelButton: true,
            cancelButtonText: '取消',
            cancelButtonClass: 'cancel'
          }).then(action => {
            if (action === 'cancel') {
              return
            }
            window.location.href = '//xinshengdaxue.com'
          })
          return
        }
        if (moment(moment()).isAfter(this.detail.homeworkEndAt)) {
          this.writeTxt = '作业已超期'
          return
        }
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'reply_hw_post',
            options: {
              oneLevelId: 0,  // 回复贴子时为0，回复评论时为当前评论的1级回复ID
              channelId: this.detail.channelId,
              postId: this.postId,
              toUserId: this.detail.userId,
              toUserName: '楼主',
              pid: 0 // 回复贴子时为0，回复评论时为评论id
            }
          }))
        }
      },
      postLike () {
        if (this.likeAction) {
          this.likeAction = false
          let data = {
            post_id: parseInt(this.postId),
            like_type: this.likeOrNot === 1 ? 2 : 1  // 1点赞2取消
          }

          let userAvatar = this.userInfo ? this.userInfo.avatar : window.localStorage.getItem('userAvatar')
          let userId = this.userInfo ? this.userInfo.id : window.localStorage.getItem('userId')
          let userName = this.userInfo ? this.userInfo.fullname : window.localStorage.getItem('userName')
          let user = {
            avatar: userAvatar,
            createdAt: '',
            userId: userId,
            userName: userName
          }
          this.likeOrCancel(data, () => {
            if (this.likeOrNot) {
              this.likeMembers.forEach((value, index) => {
                if (value.userId === user.userId) {
                  this.likeMembers.splice(index, 1)
                  if (index < 4 && this.likeNum >= 4) { // 需要加一个
                    this.likeMembers.push(this.detail.likeMembers[3])
                  }
                }
              })
              this.likeNum -= 1
            } else {
              // 点赞
              this.likeNum += 1
              this.likeMembers = this.likeMembers.slice(0, 3) // 截取前三个显示
              this.likeMembers.unshift(user)  // 将点赞用户放到最前面显示
            }
            this.likeAction = true
          })
        }
      },
      domore (canDelete) {
        let userId = this.userInfo ? this.userInfo.id : window.localStorage.getItem('userId')
        this.canDelete = canDelete
        if (this.canDelete === 1) {
          this.myactions = [{
            name: '删除',
            method: this.delete
          }, {
            name: '收藏',
            method: this.Collection
          }]
          this.sheetVisible = !this.sheetVisible
        } else if (this.canDelete === 0 && this.detail.userId !== userId) {
          this.myactions = [{
            name: '举报',
            method: this._complaint
          }, {
            name: '收藏',
            method: this.Collection
          }]
          this.sheetVisible = !this.sheetVisible
        } else {
          this.myactions = [{
            name: '收藏',
            method: this.Collection
          }]
          this.sheetVisible = !this.sheetVisible
        }
      },
      switchCheck (num) {
        this.checkedNum = num
      },
      // 用户信息
      getUserInfo (userId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'user_detail',
            options: { userId: userId }
          }))
        }
      },
      // 向客户端传贴子信息(方便收藏/分享)
      postInfo () {
        let content = this.detail.content
        if (content) {
          content = content.substring(0, 54)
        }
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.updateWebInfo) {
          bridge.updateWebInfo(JSON.stringify({
            title: this.detail.title,
            description: content,
            publisherId: this.detail.userId,
            publisherFullname: this.detail.userName,
            publisherAvatar: this.detail.userAvatar
          }))
        }
      },
      // 删除
      delete () {
        let data = {
          post_id: this.postId
        }
        this.deletePost(data, this.deleteSuccess, this.deleteFail)
      },
      _complaint () {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'report_page',
            options: {
              type: 'bbs_detail',
              id: this.postId
            }
          }))
        }
      },
      deleteSuccess () {
        Toast({
          message: '删除成功',
          duration: 800,
          position: 'bottom'
        })
        let channelId = this.detail.channelId
        let bbsId = this.detail.bbsId
        window.history.replaceState({page: 'list'}, 'test', `/forum_list?=${bbsId}&channelId=${channelId}`)
        let timer = setTimeout(() => {
          window.history.go(-1)
          clearTimeout(timer)
        }, 0)
      },
      deleteFail () {
        Toast({
          message: '删除失败',
          duration: 800,
          position: 'bottom'
        })
      },
      // 计算初始化图片高
      initImgHeight (width, height) {
        if (width && height) {
          let clientW = document.documentElement.clientWidth || document.body.clientWidth // 屏幕宽度
          let marginW = 60 * (clientW / 750)    // 图片margin所占空间
          return (clientW - marginW) * (height / width)
        }
      },
      Collection () {
        let userId = this.userInfo ? this.userInfo.id : window.localStorage.getItem('userId')
        let userAvatar = this.userInfo ? this.userInfo.avatar : window.localStorage.getItem('userAvatar')
        let userName = this.userInfo ? this.userInfo.fullname : window.localStorage.getItem('userName')
        let data = {
          collection: JSON.stringify({
            collections: [{
              type: 4,                                  //  收藏类型
              user_id: userId                          //  当前用户Id
            }],
            preview: {
              content: JSON.stringify({
                avatar: userAvatar,
                list: [{
                  link: window.location.href + '&postId=' + this.detail.id,           //  网页链接
                  text: this.detail.content,            //  网页描述
                  title: this.detail.title,             //  网页标题
                  type: 4
                }],
                name: userName
              }),
              cover: this.detail.avatar                 //  网页图片链接
            }
          }),
          flag: 0
        }
        this.collectionReply(data, this.collectionSuccess, this.collectionFail)
      },
      collectionSuccess () {
        Toast({
          message: '已收藏',
          duration: 800
        })
      },
      collectionFail () {
        Toast({
          message: '收藏失败',
          duration: 800
        })
      }
    }
  }
</script>
