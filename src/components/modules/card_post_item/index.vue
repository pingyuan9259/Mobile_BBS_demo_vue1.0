<style lang="less">
  @import "../../../styles/base/base-750";
  @import "../../../styles/base/border";
  @import "../../../styles/base/ellipsis";
  @import './index.less';
</style>

<template>
  <div class="card-post-item">
    <div class="avatar_wrap" >
      <img :src="postInfo.createrAvatar || defaultAvatar | https" alt="avatar" @click="getUserInfo(postInfo.createrId)" data-ignore="1" />
    </div>

    <div class="content_section" v-link="{ path: '/forum_detail?postId=' + postInfo.postId }">
      <div class="content">
        <div class="text_content">
          <div class="name">{{ postInfo.postTitle }}</div>
          <div class="text_title">
            <p>{{ postInfo.goal }}</p>
          </div>
        </div>
      </div>
      <div class="details">
        <span class="time">{{ postInfo.createdAt | pointInTimeFormat }}</span>
        <div class="operate">
          <i class="operate_icon"><span>{{ (postInfo.authNum > 1000 ? postInfo.authNum / 1000 + 'k' : postInfo.authNum) || 0}}人</span></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import defaultImg from '../../../configs/default_img'

  export default {
    props: {
      postInfo: {
        type: Object,
        requried: true
      }
    },
    data () {
      return {
        defaultAvatar: defaultImg.avatar
      }
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
      }
    }
  }
</script>
