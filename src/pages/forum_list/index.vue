<style lang="less">
  @import "../../styles/base/base-750";
  @import './index';
</style>

<template>
  <div v-if="loadSuccess" class="forum_list_page">
    <div v-if="summary.bbsType === bbsType.ACT_BBS || summary.bbsType === bbsType.CARD_BBS" class="tabBar-con">
      <template v-for="item in navBar">
        <div class="tab-item"
          :class="{'active': index === $index, 'card-tab': summary.bbsType === bbsType.CARD_BBS}"
          @click="tabPostType($index)">
          <span>{{ item }}</span>
        </div>
      </template>
    </div>

    <div v-if="summary.bbsType === bbsType.PRODUCT_BBS" class="tabBar-con">
      <template v-for="item in hWnavBar">
        <div class="tab-item"
          :class="{'active': index === $index, 'card-tab': summary.bbsType === bbsType.PRODUCT_BBS}"
          @click="tabPostType($index)">
          <span>{{ item }}</span>
        </div>
      </template>
    </div>

    <div class="operation-con" :class="{'active': !navBar.length, 'top': summary.bbsType === bbsType.PRODUCT_BBS}">
      <div v-if="summary.bbsType === bbsType.ACT_BBS" class="active-num">活动 {{ applyCount[index] }}</div>
      <a v-if="summary.bbsType === bbsType.ACT_BBS" href="javascript:;" v-link="{ path: 'activity_rule'}">活动规则</a>
      <template v-else>
        <div v-if="summary.bbsType === bbsType.CARD_BBS" class="active-num">参与{{ summary.bbsMemberNum }}人</div>
        <a v-show="showTask && summary.bbsType === bbsType.CARD_BBS" href="javascript:;" v-link="{ path: 'clock_record?bbsId=' + bbsId + '&channelId=' + channelId + '&userId=' + userId + '&userName=' + userName}">我的打卡</a>
        <div v-else class="sort-btn">
          <a class="icon-down" :class="{'active': showSortStatus}" href="javascript:;" @click="showSortStatus = !showSortStatus">{{ sortTxt }}</a>
          <div v-show="showSortStatus" class="sort-plug">
            <div class="sort-item"
              v-for="item in sortConfig"
              :class="{'active': sortStatus === $index}"
              @click="sortAction($index)">
              <span>{{ item }}</span>
              <i class="icon-ok"></i>
            </div>
          </div>
        </div>
        <template v-if="summary.bbsType === bbsType.COMMON_PUBLIC_BBS || summary.bbsType === bbsType.COMMON_PRIVATE_BBS">
          <div class="active-num">看贴{{ bbsPostNum }}</div>
        </template>
        <template v-if="summary.bbsType === bbsType.PRODUCT_BBS">
          <div class="active-num" v-if="index === 0">看帖 （{{ commonPost.list.length || 0 }}次）</div>
          <div class="active-num" v-if="index === 1">作业 （{{ homeWorkList.list.length || 0 }}次）</div>
        </template>
      </template>
    </div>

    <template v-if="summary.bbsType === bbsType.ACT_BBS">
      <div v-show="index === 0" class="active-con">
        <template v-for="item in enrollApplyList.list">
          <active-post-item :post-info="item"></active-post-item>
        </template>
      </div>
      <div v-show="index === 1" class="active-con">
        <template v-for="item in joinApplyList.list">
          <active-post-item :post-info="item"></active-post-item>
        </template>
      </div>
      <div v-show="index === 2" class="active-con">
        <template v-for="item in myApplyList.list">
          <active-post-item :post-info="item"></active-post-item>
        </template>
      </div>
    </template>

    <template v-if="summary.bbsType === bbsType.CARD_BBS">
      <div v-show="index === 0" class="active-con">
        <template v-for="(key, val) in activityList">
          <div class="card-column">
            <div class="date-title" @click="showContent($index)">
              {{ key }}
              <span class="drop-down"></span>
            </div>
            <template v-for="item in val" track-by="$index">
              <card-post-item :post-info="item"></card-post-item>
            </template>
          </div>
        </template>
      </div>
      <div v-show="index === 1" class="active-con">
        <template v-for="item in sharePost.list">
          <common-post-item :post-info="item"></common-post-item>
        </template>
      </div>
    </template>

    <template v-if="summary.bbsType === bbsType.COMMON_PUBLIC_BBS || summary.bbsType === bbsType.COMMON_PRIVATE_BBS || summary.bbsType === bbsType.STUDY_BBS">
      <div class="active-con">
        <template v-for="item in commonPost.list">
          <common-post-item :post-info="item"></common-post-item>
        </template>
      </div>
    </template>

    <template v-if="summary.bbsType === bbsType.PRODUCT_BBS">
      <div v-show="index === 0" class="active-con">
        <template v-for="item in commonPost.list">
          <common-post-item :post-info="item"></common-post-item>
        </template>
      </div>
      <div v-show="index === 1" class="active-con">
        <template v-for="item in homeWorkList.list">
          <common-post-item :post-info="item"></common-post-item>
        </template>
      </div>
    </template>

    <div v-if="loadStatus === 1" class="more-live">上滑加载更多</div>
    <div v-if="loadStatus === 2" class="load-more">
      <mt-spinner type="fading-circle"></mt-spinner>
      加载中...
    </div>
    <div v-if="loadStatus === 3" class="more-live">没有更多了</div>

    <div v-if="summary.bbsType === bbsType.ACT_BBS" class="forum_action">
      <div class="posting" @click="activePost">申请活动</div>
    </div>
    <div class="place" v-show="showPlace"></div>
    <div v-if="showBottomBar" class="forum_action">
      <!-- <span class="to-channel"></span> -->
      <div class="js-button">
        <span v-if="summary.bbsType === 4" class="task" @click="toTaskPost">我要打卡</span>
        <span class="came" @click="toCamePost">我要发贴</span>
      </div>
    </div>
    <div class="sort-con" v-show="showSortStatus" @click="showSortStatus = false"></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    getCardDetail,
    getForumSummary,
    getCommonForumPostList,
    getActForumPostList,
    getEnrollApplyList,
    getHomeWorkPost,
    getJoinApplyList,
    getMyApplyList,
    getApplyCount,
    postSuccess,
    destroyForumsStore
  } from '../../vuex/forums/actions'
  import {
    Spinner,
    Indicator,
    MessageBox
  } from 'mint-ui'
  import bbsConfig from '../../constants/bbsType'
  import $ from 'npm-zepto'
  import Title from '../../utils/setTitle'
  import Cookie from '../../utils/cookie'
  import { APP_ID } from '../../configs/app'
  import activePostItem from '../../components/modules/active_post_item/'
  import cardPostItem from '../../components/modules/card_post_item/'
  import commonPostItem from '../../components/modules/common_post_item/'

  Vue.component(Spinner.name, Spinner)

  export default {
    data () {
      return {
        bbsType: bbsConfig,
        cardNavBar: ['打卡贴', '分享贴'],
        hWnavBar: ['讨论贴', '作业贴'],
        actNavBar: ['报名中', '已参加', '我的活动'],
        navBar: [],
        showBottomBar: true,
        sortConfig: ['最新排序', '最热排序'],
        sortTxt: '最新排序',
        showSortStatus: false,
        sortStatus: 0,
        loadStatus: 1,
        index: 0,
        userInfo: null,
        userId: '',
        userName: '',
        showTask: true, // 是否显示我的打卡
        bbsPostNum: 0,
        loadSuccess: false,
        limit: 15,
        showPlace: false
      }
    },
    components: {
      activePostItem,
      cardPostItem,
      commonPostItem
    },
    vuex: {
      getters: {
        bbsId: ({ forums }) => forums.summary.bbsId,
        channelId: state => state.route.query.channelId,
        summary: ({ forums }) => forums.summary,
        cardDetail: ({ forums }) => forums.cardDetail,
        commonPost: ({ forums }) => forums.commonPost,
        activityPost: ({ forums }) => forums.activityPost,
        activityList: ({ forums }) => forums.activityList,
        homeWorkList: ({ forums }) => forums.homeWorkList,
        sharePost: ({ forums }) => forums.sharePost,
        enrollApplyList: ({ forums }) => forums.enrollApplyList,
        joinApplyList: ({ forums }) => forums.joinApplyList,
        myApplyList: ({ forums }) => forums.myApplyList,
        applyCount: ({ forums }) => forums.applyCount
      },
      actions: {
        getCardDetail,
        getForumSummary,
        getCommonForumPostList,
        getActForumPostList,
        getEnrollApplyList,
        getJoinApplyList,
        getHomeWorkPost,
        getMyApplyList,
        getApplyCount,
        postSuccess,
        destroyForumsStore
      }
    },
    created () {
      this.userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
      if (!document.title) {
        document.title = '活动'
      }
      Title.set('活动')
      let hash = window.location.hash
      if (hash && hash === '#channel') {
        this.showBottomBar = false
      } else {
        this.showPlace = true
      }
      Indicator.open({ spinnerType: 'fading-circle' })
      this.userId = this.userInfo ? this.userInfo.id : window.localStorage.getItem('userId')
      this.userName = this.userInfo ? this.userInfo.fullname : window.localStorage.getItem('userName')
      this.getForumSummary(this.bbsId, this.channelId, this.success, this.fail)
      if (this.channelId.length > 1) {
        let data = {
          channel_id: this.channelId,
          type: 1
        }
        this.getCardDetail(data)
      }
    },
    watch: {
      sortStatus (val) {
        this.loadStatus = 2
        if (this.commonPost.list.length > 0) {
          this.getCommonForumPost(true)
        }
        if (this.sharePost.list.length > 0) {
          this.getActForumPost(null, true)
        }
        if (this.homeWorkList.list.length > 0) {
          this.getHomeWorkList(true)
        }
        if (this.sharePost.list.length === 0) {
          this.loadStatus = 3
        }
      },
      summary (val) {
        if (!val) return
        this.canCard = val.canCard
        this.bbsPostNum = val.bbsPostNum
        if (val.bbsName) {
          Title.set(val.bbsName)
        }

        if (val.bbsType === this.bbsType.ACT_BBS) {
          this.getApplyCount()
          this.showBottomBar = false
        }
        this.switchTab()
      }
    },
    ready () {
      $(window).scroll(() => {
        let sh = $(window).scrollTop()
        let wh = $(window).height()
        let dh = $(document).height()
        if (dh - sh - wh < 30 && this.loadStatus === 1 && this.loadSuccess) {
          this.switchTab(this.index, true)
        }
      })
      // 发贴(打卡)状态监听方法
      if (!window.tinfiniteListener) {
        window.tinfiniteListener = {}
      }
      window.tinfiniteListener.sendMsgListener = this.publishPostSuccess
    },
    beforeDestroy () {
      this.$dispatch('destoryError')
      this.destroyForumsStore()
    },
    methods: {
      showContent (num) {
        if ($('.card-column').eq(num).hasClass('active')) {
          $('.card-column').eq(num).removeClass('active')
        } else {
          $('.card-column').eq(num).addClass('active')
        }
      },
      tabPostType (index) {
        if (index === 0) {
          this.showTask = true
        } else if (index === 1) {
          this.showTask = false
        }
        this.index = index
        this.switchTab(index)
      },
      sortAction (index) {
        this.sortStatus = index
        this.sortTxt = this.sortConfig[index]
        this.showSortStatus = false
      },
      switchTab (num = 0, scroll) {
        this.loadStatus = 2
        if (this.summary.bbsType === this.bbsType.ACT_BBS) {
          this.navBar = this.actNavBar
          if ((num === 0 && this.enrollApplyList.allLoaded) || (num === 1 && this.joinApplyList.allLoaded) || (num === 2 && this.myApplyList.allLoaded)) {
            this.loadStatus = 3
            return
          }
          switch (num) {
            case 0:
              this.getEnrollApplyPost()
              break
            case 1:
              this.getJoinApplyPost()
              break
            case 2:
              this.getMyApplyPost()
              break
          }
        } else if (this.summary.bbsType === this.bbsType.CARD_BBS) {
          this.navBar = this.cardNavBar
          let type = num === 0 ? 3 : 2 // 2:分享贴 3:打卡贴
          if (type === 2) {
            this.getCommonForumPost(true)
          } else if (type === 3) {
            this.getActForumPost(type, true, scroll)
          }
        } else if (this.summary.bbsType === this.bbsType.PRODUCT_BBS) {
          let type = num === 0 ? 4 : 5 // 4:讨论贴 5:作业贴
          if (type === 4) {
            this.getCommonForumPost(true)
          } else {
            this.getHomeWorkList(true, scroll)
          }
        } else {
          this.getCommonForumPost()
        }
      },
      getCommonForumPost (bool) {
        let sort = this.sortStatus === 0 ? '' : 'hot'
        let data = {
          bbs_id: this.bbsId,
          channel_id: this.channelId,
          page: bool ? 1 : this.commonPost.page,
          limit: this.commonPost.limit,
          sort: sort
        }
        this.getCommonForumPostList(data, this.success, this.fail, bool)
      },
      getHomeWorkList (bool, scroll) {
        if (scroll) {
          bool = false
        }
        let sort = this.sortStatus === 0 ? '' : 'hot'
        let data = {
          bbs_id: this.bbsId,
          channel_id: this.channelId,
          page: bool ? 1 : this.homeWorkList.page,
          limit: this.homeWorkList.limit,
          sort: sort
        }
        this.getHomeWorkPost(data, this.success, this.fail, bool)
      },
      getActForumPost (type, bool, scroll) {
        if (scroll) {
          bool = false
        }
        let sort = this.sortStatus === 0 ? '' : 'hot'
        let data = {
          bbs_id: this.bbsId,
          channel_id: this.channelId,
          type: type,
          page: bool ? 1 : this.activityPost.page,
          limit: this.limit,
          sort: sort
        }
        this.getActForumPostList(data, this.success, this.fail, bool)
      },
      getEnrollApplyPost () {
        let data = {
          page: this.enrollApplyList.page,
          limit: this.enrollApplyList.limit
        }
        this.getEnrollApplyList(data, this.success, this.fail)
      },
      getJoinApplyPost () {
        let data = {
          page: this.joinApplyList.page,
          limit: this.joinApplyList.limit
        }
        this.getJoinApplyList(data, this.success, this.fail)
      },
      getMyApplyPost () {
        let data = {
          page: this.myApplyList.page,
          limit: this.myApplyList.limit
        }
        this.getMyApplyList(data, this.success, this.fail)
      },
      success (res = []) {
        this.loadStatus = res.length < 15 ? 3 : 1
        this.loadSuccess = true
        Indicator.close()
      },
      fail (val) {
        Indicator.close()
        this.$dispatch('callError', val)
      },
      // 申请活动
      activePost () {
        // MessageBox.alert('此功能暂不对外开放', '', {
        //   confirmButtonText: '确定',
        //   confirmButtonClass: 'confirm'
        // }).then(action => {
        //   return
        // })
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          if (this.userInfo.verify.status !== 1) {
            MessageBox({
              message: '实名认证后才能申请活动',
              confirmButtonText: '知道了',
              confirmButtonClass: 'confirm'
            })
            return
          }
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'activity_post',
            options: {
              bbsId: this.bbsId,
              channelId: this.channelId
            }
          }))
        }
      },
      // 发贴或打卡成功回调
      publishPostSuccess (data) {
        let res = JSON.parse(data)
        if (this.publishType === 2) {
          this.canCard = 0
        }
        if (res.code === 1) {
          this.bbsPostNum += 1
          this.postSuccess(res.result)
          if (res.result.postType === 1) {
            this.$route.router.go({path: '/forum_detail?postId=' + res.result.postId})
          }
          if (res.result.postType === 3) {
            let data = {
              channel_id: this.channelId,
              type: 1
            }
            this.getCardDetail(data)
          }
        }
      },
      // 我要打卡
      toTaskPost () {
        let status = this.cardDetail.activityStatus
        if (status === 0) {
          MessageBox({
            message: '活动未开始',
            confirmButtonText: '知道了',
            confirmButtonClass: 'confirm'
          })
          return
        }
        if (status === -1) {
          MessageBox({
            message: '活动已结束',
            confirmButtonText: '知道了',
            confirmButtonClass: 'confirm'
          })
          return
        }
        if (this.cardDetail.todayStatus === 1) {
          MessageBox({
            message: '今日已打卡',
            confirmButtonText: '知道了',
            confirmButtonClass: 'confirm'
          })
          return
        }
        let bridge = window.tinfiniteBridge
        let title = this.userName + '打卡(' + (this.summary.finishDays + 1) + '/' + this.summary.totalDays + ')'
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'task_post',
            options: {
              channelId: this.channelId,
              bbsId: this.bbsId,
              title: title,
              chockNumber: this.summary.finishDays + 1
            }
          }))
        }
      },
      // 我要发贴
      toCamePost () {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'normal_post',
            options: {
              channelId: this.channelId,
              bbsId: this.bbsId
            }
          }))
        }
      }
    }
  }
</script>
