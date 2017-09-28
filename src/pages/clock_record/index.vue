<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="clock_record_page">
    <div class="header">
      <div class="sign_info clearfix">
        <p v-if="clockDetail.activityStatus === 1" class="clock">今日<span v-if="clockDetail.todayStatus">已</span><span v-if="!clockDetail.todayStatus">未</span>打卡</p>
        <p v-if="clockDetail.activityStatus === -1" class="clock">活动已结束</p>
        <p v-if="clockDetail.activityStatus === 0" class="clock">活动未开始</p>
        <!-- <p class="ranking">第{{ rank }}名</p> -->
        <p class="ranking" v-link="{path: 'clock_rank?bbsId=' + bbsId + '&channelId=' + channelId }">排行榜</p>
      </div>
      <div class="clock_page">
        <div class="circle" id="circles">
          <div class="stars"></div>
          <svg viewBox="0 0 100 100">
            <path
              d="M 50,50 m 0,-49 a 49,49 0 1 1 0,98 a 49,49 0 1 1 0,-98"
              stroke="#fff"
              stroke-opacity="0.6"
              stroke-width="1.5"
              fill-opacity="0">
            </path>
            <path
              d="M 50,50 m 0,-49 a 49,49 0 1 1 0,98 a 49,49 0 1 1 0,-98"
              stroke="#fff"
              stroke-width="1.5"
              fill-opacity="0"
              style="stroke-dasharray: 307.919, 307.919; stroke-dashoffset: 307.919px;">
            </path>
          </svg>
        </div>
        <div class="con">
          <p>已打卡<span>{{ clockDetail.finishDays }}</span>天</p>
        </div>
        <p class="target">目标{{ clockDetail.goalDays }}天</p>
      </div>
      <p>已连续打卡{{ clockDetail.serialTimes }}天</p>
    </div>
    <ul v-if="lists" class="clock_list clearfix">
      <li
        :class="{
          }"
        v-for="item of clockDetail.clockRecordList">
        <a
          v-if="item.isSuccess === -1"
          href="javascript:;"
          class="no_clcok"></a>
        <a
          v-if="item.isSuccess === 2"
          class="icon-fail"
          @click="toCardDetail(item.postId)"></a>
        <a
          v-if="item.isSuccess === 0"
          class="icon-not"
          @click="toCardDetail(item.postId)"></a>
        <a
          v-if="item.isSuccess === 1"
          class="icon-ok"
          @click="toCardDetail(item.postId)"
          :class="{'active': !item.isContinuity, 'on': item.isContinuity }"></a>
        <p v-if="item.isSuccess === -1" class="data_no_clcok">{{ item.clockedAt | Format }}</p>
        <p v-if="item.isSuccess === 2" class="date-fail">{{ item.clockedAt | Format }}</p>
        <p v-if="item.isSuccess === 0" class="date-not">{{ item.clockedAt | Format }}</p>
        <p v-if="item.isSuccess === 1" class="date-ok">{{ item.clockedAt | Format }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import store from '../../vuex/store'
  import { getClockRecord, cardSuccessListener, destroyClockStore } from '../../vuex/clock/actions'
  import { Indicator } from 'mint-ui'
  import $ from 'npm-zepto'
  import moment from 'moment'
  import Title from '../../utils/setTitle'
  import Cookie from '../../utils/cookie'
  import { APP_ID } from '../../configs/app'

  export default {
    store,
    data () {
      return {
        title: '打卡',
        chockNumber: 0,            // 当前打卡贴在活动的第几天
        lists: [],
        loadSuccess: false,
        isError: false,
        errorTip: '',
        userInfo: null
      }
    },
    vuex: {
      getters: {
        bbsId: state => state.route.query.bbsId,
        userId: state => state.route.query.userId,
        channelId: state => state.route.query.channelId,
        userName: state => state.route.query.userName,
        clockDetail: ({ clock }) => clock.clockDetail,
        scale: ({ clock }) => clock.scale
      },
      actions: {
        getClockRecord,
        cardSuccessListener,
        destroyClockStore
      }
    },
    created () {
      this.userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
      let Id = ''
      if (this.userInfo) {
        Id = this.userInfo.id
      }
      if (Id && this.userId !== Id) {
        this.title = this.userName + '的打卡'
      }
      Title.set(this.title)

      if (this.userInfo && this.userInfo.verify.status !== 1) {
        this.$dispatch('callError', '未认证')
        return
      }
      Indicator.open({ spinnerType: 'fading-circle' })
      // this.showButton()
      let data = {
        channel_id: this.channelId,
        bbs_id: this.bbsId,
        user_id: this.userId,
        is_my: 0
      }
      this.getClockRecord(data, this.success, this.fail)
      if (!document.title) {
        document.title = '打卡详情'
      }
    },
    watch: {
      scale () {
        this.rotateFn(this.scale)
      }
    },
    ready () {
      // this.rotateFn(this.scale)

      // 打卡状态监听方法
      if (!window.tinfiniteListener) {
        window.tinfiniteListener = {}
      }
      window.tinfiniteListener.sendMsgListener = this.publishCardSuccess
    },
    beforeDestroy () {
      this.$dispatch('destoryError')
      this.destroyClockStore()
    },
    methods: {
      rotateFn (scale) {
        let path = document.querySelector('#circles path')
        let length = document.querySelector('#circles path').getTotalLength()
        $('#circles svg path').eq(1).css({
          'transition': 'none',
          'WebkitTransition': 'none',
          'strokeDasharray': length + ' ' + length,
          'strokeDashoffset': length
        })
        path.getBoundingClientRect()
        $('#circles svg path').eq(1).css({
          'transition': 'stroke-dashoffset 2s ease-in-out',
          'WebkitTransition': 'stroke-dashoffset 2s ease-in-out',
          'strokeDashoffset': (1 - scale) * 307.919
        })
        $('.stars').css({
          'transform': 'rotate(' + scale + 'turn)',
          'WebkitTransform': 'rotate(' + scale + 'turn)',
          'transition': 'transform 2s ease-in-out',
          'WebkitTransition': 'stroke-dashoffset 2s ease-in-out'
        })
      },
      // 打卡成功监听
      publishCardSuccess (data) {
        let res = JSON.parse(data)
        if (res.code === 1) {
          this.cardSuccessListener()
        }
      },
      // 隐藏分享按钮
      // showButton () {
      //   let bridge = window.tinfiniteBridge
      //   if (bridge && bridge.showButton) {
      //     bridge.showButton(JSON.stringify([]))
      //   }
      // },
      success () {
        this.loadSuccess = true
        Indicator.close()
      },
      fail (val) {
        Indicator.close()
        this.$dispatch('callError', val)
      },
      timeInit () {
        moment.locale('zh-cn')
        let start = moment(this.startTime)
        let end = moment(this.endTime)
        let dur = end.diff(start, 'days')
        this.dates.push(start.format('M.DD'))
        for (let i = 1; i < dur; i++) {
          this.dates.push(start.add(1, 'day').format('M.DD'))
        }
      },
      toCardDetail (postId) {
        this.$route.router.go({path: '/forum_detail?postId=' + postId})
      }
    }
  }
</script>
