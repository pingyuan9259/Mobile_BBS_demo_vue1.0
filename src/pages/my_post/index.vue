<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="my_post_page">
    <ul class="post_list clearfix">
      <li v-for="item in lists">
        <div v-if="item.postType === postConfig.postType.activity">
          <p v-if="item.isPass === 0" class="examine_label color_F659">审核未通过</p>
          <p v-if="item.isPass === 1" class="examine_label color_52">正在审核...</p>
          <p v-if="item.isPass === 2" class="examine_label"></p>
        </div>
        <p v-else class="examine_label"></p>
        <div class="clearfix">
          <div class="portrait" @click="getUserInfo(item.userId)">
            <img :src="item.avatar || defaultAvatar" data-ignore="1" />
          </div>
          <div class="con">
            <div class="clearfix" v-link="{path: '/forum_detail?postId=' + item.postId}">
              <span v-show="item.postImage" class="cover">
                <img :src="item.postImage" @load="ckeckImg($event)" data-ignore="1" />
              </span>
              <div class="post_info">
                <h6>{{ item.fullname }}</h6>
                <p v-if="item.postType === postConfig.postType.punch">
                  <i class="lable">打卡</i>
                  &nbsp;{{ item.postTitle }}
                <p v-else>{{ item.postTitle }}</p>
              </div>
            </div>
            <div class="post_foot clearfix">
              <span class="time">{{ item.createdAt | dateFormat }}</span>
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
  <no-more-news
    v-if="isNoNews"
    :nomoretip="noMoreTip"></no-more-news>
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator } from 'mint-ui'
  import { getMyPostList, destroyPostStore } from '../../vuex/post/actions'
  import $ from 'npm-zepto'
  import postConfig from '../../constants/postType'
  import noMoreNews from '../../components/modules/no_more_news/'
  import defaultImg from '../../configs/default_img'

  Vue.component(Spinner.name, Spinner)

  export default {
    data () {
      return {
        loading: false,
        limit: 10,
        loadSuccess: false,
        postConfig: postConfig,
        bOk: false,
        defaultAvatar: defaultImg.avatar,
        noMoreTip: '还未发贴'
      }
    },
    components: {
      noMoreNews
    },
    vuex: {
      getters: {
        page: ({ post }) => post.page,
        lists: ({ post }) => post.myPostLists,
        allLoaded: ({ post }) => post.allLoaded,
        isNoNews: ({ post }) => post.myPostIsNoNews
      },
      actions: {
        getMyPostList,
        destroyPostStore
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
      this.destroyPostStore()
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
        this.getMyPostList(data, this.success, this.fail)
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
      }
    }
  }
</script>
