<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="favor_me_page">
    <ul class="favor_list">
      <li v-for="item in lists">
        <div class="header clearfix" @click="getUserInfo(item.userId)">
          <img :src="item.avatar || defaultAvatar | https" data-ignore="1" />
          <p class="name">{{ item.fullname }}</p>
        </div>
        <p class="describe">{{ item.fullname }}赞了你的贴子。</p>
        <post
          :id="item.postId"
          :img="item.postImage || item.postCreaterAvatar || defaultAvatar | https"
          :name="item.postCreaterName"
          :title="item.postTitle"></post>
        <div class="foot clearfix">
          <span class="time">{{ item.likeAt | dateFormat }}</span>
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
  import store from '../../vuex/store'
  import { getFavorMeList, destroyFavorStore } from '../../vuex/favor/actions'
  import $ from 'npm-zepto'
  import noMoreNews from '../../components/modules/no_more_news/'
  import defaultImg from '../../configs/default_img'
  import { APP_ID } from '../../configs/app'
  import Cookie from '../../utils/cookie'

  Vue.component(Spinner.name, Spinner)

  export default {
    store,
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
        page: ({ favor }) => favor.favorMePage,
        lists: ({ favor }) => favor.favorMeLists,
        allLoaded: ({ favor }) => favor.favorMeAllLoaded,
        isNoNews: ({ favor }) => favor.favorMeIsNoNews
      },
      actions: {
        getFavorMeList,
        destroyFavorStore
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
      window.localStorage.removeItem('likeNum')
      Cookie.delCookie('favor_num_' + APP_ID, 'xinshengdaxue.com')
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
      this.destroyFavorStore()
    },
    methods: {
      getUserInfo (userId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage({
            pname: 'user_detail',
            options: { userId: userId }
          })
        }
      },
      loadMore () {
        let data = {
          page: this.page,
          limit: this.limit
        }
        this.getFavorMeList(data, this.success, this.fail)
      },
      success () {
        this.bOk = true
        this.loadSuccess = true
        window.localStorage.removeItem('likeNum')
        Indicator.close()
      },
      fail (val) {
        Indicator.close()
        this.$dispatch('callError', val)
      }
    }
  }
</script>
