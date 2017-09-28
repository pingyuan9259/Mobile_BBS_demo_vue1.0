<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="clock_rank_page">
    <div class="my_clock">
      <div class="clock_con clearfix">
        <span class="ranking_index"></span>
        <img :src="myClockInfo.avatar || defaultAvatar | https" data-ignore="1" />
        <div v-if="myClockInfo.rank">
          <p>{{ myClockInfo.fullname }}</p>
          <span>第{{ myClockInfo.rank }}名</span>
        </div>
        <p v-else class="fullname">{{ myClockInfo.fullname }}</p>
        <span v-if="myClockInfo.clockNumber" class="clock">已打卡{{ myClockInfo.clockNumber }}天</span>
        <span v-else class="clock">还未打卡成功</span>
      </div>
    </div>
    <div>
      <ul class="ranking_con">
        <li class="ranking_list"v-for="item in lists">
          <span class="ranking_index">{{ $index+1 }}</span>
          <img :src="item.avatar || defaultAvatar | https" data-ignore="1" />
          <p @click="getUserInfo(item.userId)">{{ item.fullname }}</p>
          <span
          class="clock"
          :class="{'on' : $index === 0 || $index === 1 || $index === 2 }"
          v-link="{ path: 'clock_record?bbsId=' + bbsId + '&userId=' + item.userId + '&isMy=1&channelId=' + channelId + '&userName=' + item.fullname }">
            已成功打卡{{ item.clockNumber }}天</span>
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
  <no-more-news
    v-if="isNoNews"
    :nomoretip="noMoreTip"></no-more-news>
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator } from 'mint-ui'
  import { getClockList, destroyClockStore } from '../../vuex/clock/actions'
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
        defaultAvatar: defaultImg.avatar,
        noMoreTip: '暂无排行榜'
      }
    },
    components: {
      noMoreNews
    },
    vuex: {
      getters: {
        bbsId: state => state.route.query.bbsId,
        channelId: state => state.route.query.channelId,
        page: ({ clock }) => clock.page,
        lists: ({ clock }) => clock.clockLists,
        allLoaded: ({ clock }) => clock.allLoaded,
        myClockInfo: ({ clock }) => clock.myClockInfo,
        isNoNews: ({ clock }) => clock.isNoNews
      },
      actions: {
        getClockList,
        destroyClockStore
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
      this.destroyClockStore()
    },
    methods: {
      getUserInfo (userId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.getPostUserId) {
          bridge.getPostUserId(userId)
        }
      },
      loadMore () {
        let data = {
          bbs_id: this.bbsId,
          page: this.page,
          limit: this.limit
        }
        this.getClockList(data, this.success, this.fail)
      },
      success () {
        this.bOk = true
        this.loadSuccess = true
        Indicator.close()
      },
      fail (val) {
        Indicator.close()
        this.$dispatch('callError', val)
      }
    }
  }
</script>