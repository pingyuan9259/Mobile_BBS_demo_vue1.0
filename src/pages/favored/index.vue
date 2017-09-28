<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="favored_page">
    <ul class="post_list">
      <li v-for="item in lists">
        <div class="clearfix">
          <div class="portrait" @click="getUserInfo(item.postCreaterId)">
            <img :src="item.postCreaterAvatar || defaultAvatar | https" data-ignore="1" />
          </div>
          <div class="con">
            <div class="clearfix" v-link="{path: '/forum_detail?postId=' + item.postId}">
              <span v-show="item.postImage" class="cover">
                <img :src="item.postImage | https" @load="ckeckImg($event)" data-ignore="1" />
              </span>
              <div class="post_info">
                <h6>{{ item.postCreaterName }}</h6>
                <p v-if="item.postType === config.postType.punch"><i class="lable">打卡</i>&nbsp;{{ item.postTitle }}</p>
                <p v-else>{{ item.postTitle }}</p>
              </div>
            </div>
            <div class="post_foot clearfix">
              <span class="time">{{ item.likeAt | dateFormat }}</span>
              <span class="title">{{ item.bbsName }}</span>
            </div>
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
  </div>
  <no-more-news v-if="isNoNew"></no-more-news>
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator } from 'mint-ui'
  import { getFavoredList, destroyFavorStore } from '../../vuex/favor/actions'
  import $ from 'npm-zepto'
  import noMoreNews from '../../components/modules/no_more_news/'
  import defaultImg from '../../configs/default_img'
  import postConfig from '../../constants/postType'

  Vue.component(Spinner.name, Spinner)

  export default {
    data () {
      return {
        config: postConfig,
        loading: false,
        limit: 10,
        loadSuccess: false,
        bOk: false,
        defaultAvatar: defaultImg.avatar
      }
    },
    vuex: {
      getters: {
        page: ({ favor }) => favor.favoredPage,
        lists: ({ favor }) => favor.favoredLists,
        allLoaded: ({ favor }) => favor.favoredAllLoaded,
        isNoNew: ({ favor }) => favor.favoredIsNoNews
      },
      actions: {
        getFavoredList,
        destroyFavorStore
      }
    },
    components: {
      noMoreNews
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
        this.getFavoredList(data, this.success, this.fail)
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
