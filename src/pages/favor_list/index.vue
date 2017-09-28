<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="favor_list_page">
    <ul class="favor_con">
      <li class="favor_list" v-for="item in lists">
        <img :src="item.avatar || defaultAvatar | https" />
        <p>{{ item.userName }}</p>
        <span>{{ item.createdAt | dateFormat }}</span>
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
  import store from '../../vuex/store'
  import { getFavorList, destroyFavorStore } from '../../vuex/favor/actions'
  import $ from 'npm-zepto'
  import noMoreNews from '../../components/modules/no_more_news/'
  import defaultImg from '../../configs/default_img'

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
    vuex: {
      getters: {
        postId: state => state.route.query.postId,
        page: ({ favor }) => favor.favorPage,
        lists: ({ favor }) => favor.favorLists,
        allLoaded: ({ favor }) => favor.favorAllLoaded,
        isNoNews: ({ favor }) => favor.favorIsNoNews
      },
      actions: {
        getFavorList,
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
      loadMore () {
        let data = {
          post_id: this.postId,
          page: this.page,
          limit: this.limit
        }
        this.getFavorList(data, this.success, this.fail)
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
