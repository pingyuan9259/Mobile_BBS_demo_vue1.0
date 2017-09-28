<style lang="less">
  @import "../../../styles/base/base-750";
  @import './index';
</style>

<template>
  <!--  打卡贴  -->
  <div v-if="detail.type === CONFIG.postType.punch && !detail.canVote" class="vote_wrap">
    <div class="vote_record_wrap">
      <div class="rate_wrap">
        <div class="vote_rate vote_like" :style="{ flex: agreeNum }"></div>
        <div class="vote_rate vote_dislike" :style="{ flex: disAgreeNum }"></div>
      </div>
      <div class="data_wrap">
        <span class="text">完成</span>
        <span>{{ agreeNum }}</span>
      </div>
    </div>
    <div class="vote_record_wrap">
      <div class="rate_wrap">
        <div class="vote_rate vote_like" :style="{ flex: disAgreeNum }"></div>
        <div class="vote_rate vote_dislike" :style="{ flex: agreeNum }"></div>
      </div>
      <div class="data_wrap">
        <span class="text">未完成</span>
        <span>{{ disAgreeNum }}</span>
      </div>
    </div>
    <div class="voted_member" v-if="voteMembers.length">
      <div class="avatar_wrap" v-if="voteMembers.length > 7">
        <ul>
          <li v-for="n in 7">
            <img :src="voteMembers[n].avatar || defaultAvatar | https" data-ignore="1" @click="getUserInfo(voteMembers[n].userId)" />
          </li>
        </ul>
        <span v-link="{ path: 'voter?postId=' + postId }">···</span>
      </div>
      <div class="avatar_wrap" v-else>
        <ul>
          <li v-for="item in voteMembers">
            <img :src="item.avatar || defaultAvatar | https" data-ignore="1" @click="getUserInfo(item.userId)"/>
          </li>
        </ul>
      </div>
      <span class="text_wrap" v-link="{path: 'voter?postId=' + postId }">
        已认证
      </span>
    </div>
    <div v-show="isMyPublish" class="share-con">
      <div class="share-btn" @click="shareToChannel">分享至打卡群</div>
      <p class="share-tip">请其他成员帮你认证吧</p>
    </div>
  </div>

  <div v-if="detail.type === CONFIG.postType.punch && detail.canVote === 1" class="check_wrap">
    <div
      class="check_list"
      :class="{ 'checked': checkedNum === 1 }"
      @click="switchCheck(1)">
      <span class="check_text">完成</span>
      <span class="check_icon">
        <i class="icon-ok"></i>
      </span>
    </div>
    <div
      class="check_list"
      :class="{ 'checked': checkedNum === 0 }"
      @click="switchCheck(0)">
      <span class="check_text">未完成</span>
      <span class="check_icon">
        <i class="icon-ok"></i>
      </span>
    </div>
    <div class="submit_btn" @click="voteSubmit">
      认证
    </div>
  </div>
</template>

<script>
import { vote } from '../../../vuex/forums/actions'
import postConfig from '../../../constants/postType'
import defaultImg from '../../../configs/default_img'
import Cookie from '../../../utils/cookie'
import { APP_ID } from '../../../configs/app'
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      checkedNum: 1,
      defaultAvatar: defaultImg.avatar,
      CONFIG: postConfig,
      userInfo: null,
      isMyPublish: false
    }
  },
  vuex: {
    getters: {
      postId: state => state.route.query.postId,
      detail: ({ forums }) => forums.detail,
      agreeNum: ({ forums }) => forums.agreeNum,
      disAgreeNum: ({ forums }) => forums.disAgreeNum,
      voteMembers: ({ forums }) => forums.voteMembers
    },
    actions: {
      vote
    }
  },
  created () {
    this.userId = window.localStorage.getItem('userId')
    if (!this.userId) {
      let userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
      this.userId = userInfo.id
    }
    this.isMyPublish = (this.userId === this.detail.userId)
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
    switchCheck (num) {
      this.checkedNum = num
    },
    voteSubmit () {
      let data = {
        is_agree: this.checkedNum,
        post_id: this.postId
      }
      this.vote(data, this.voteSuccess)
    },
    voteSuccess () {
      Toast({
        message: '认证成功',
        iconClass: 'icon-success icon-ok',
        duration: 800
      })
      this.isMyPublish = (this.userId === this.detail.userId)
    },
    // 分享到打卡群
    shareToChannel () {
      let bridge = window.tinfiniteBridge
      if (bridge && bridge.jumptoNativePage) {
        bridge.jumptoNativePage(JSON.stringify({
          pname: 'share_to_channel',
          options: {
            postId: this.detail.id,
            channelId: this.detail.channelId
          }
        }))
      }
    }
  }
}
</script>
