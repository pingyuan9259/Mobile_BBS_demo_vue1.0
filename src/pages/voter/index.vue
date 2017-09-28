<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="voter_page" >
    <div class="join_vote">
      已有<span>{{ total }}</span>人参与投票
    </div>
    <div>
      <ul class="favor_con">
        <li class="favor_list" v-for="item in lists">
          <img :src="item.avatar || defaultAvatar | https" @click="getUserInfo(item.userId)"/>
          <p @click="getUserInfo(item.userId)">{{ item.userName }}</p>
          <span>{{ item.createdAt | dateFormat }}</span>
        </li>
      </ul>
      <div v-if="loading || allLoaded" class="loading">
        <div v-if="loading">
          <mt-spinner type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <div v-if="allLoaded">暂无更多</div>
      </div>
  </div>
  <no-more-news v-if="isNoNews"></no-more-news>
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator } from 'mint-ui'
  import { getVoterList, destroyVoterStore } from '../../vuex/voter/actions'
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
        defaultAvatar: defaultImg.avatar
      }
    },
    components: {
      noMoreNews
    },
    vuex: {
      getters: {
        postId: state => state.route.query.postId,
        page: ({ voter }) => voter.page,
        lists: ({ voter }) => voter.voterLists,
        allLoaded: ({ voter }) => voter.allLoaded,
        isNoNews: ({ voter }) => voter.isNoNews,
        total: ({ voter }) => voter.total
      },
      actions: {
        getVoterList,
        destroyVoterStore
      }
    },
    watch: {
      lists (val) {
        if (!val.length) {
          this.noNews = true
        } else {
          this.noNews = false
        }
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
      this.destroyVoterStore()
    },
    methods: {
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
          post_id: this.postId,
          page: this.page,
          limit: this.limit
        }
        this.getVoterList(data, this.success, this.fail)
      },
      success () {
        this.loading = false
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
