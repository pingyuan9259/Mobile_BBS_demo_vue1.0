 <style lang="less">
  @import "../../../styles/base/base-750";
  @import "../../../styles/base/border";
  @import "../../../styles/base/ellipsis";
  @import './index.less';
</style>

<template>
  <div class="common-post-item">
    <div class="clearfix">
      <div class="avatar_wrap" >
        <img :src="postInfo.createrAvatar || defaultAvatar | https" alt="avatar" @click="getUserInfo(postInfo.createrId)" data-ignore="1" />
      </div>
      <div class="content_section" v-link="{ path: '/forum_detail?postId=' + postInfo.postId }">
        <div class="content">
          <div class="text_content">
            <div class="name">{{ postInfo.createrName }}</div>
            <div class="text_title">
              <p>{{ postInfo.postTitle }}</p>
            </div>
          </div>
        </div>
        <div class="details">
          <span class="time">{{ postInfo.createdAt | dateFormat }}</span>
          <div class="operate">
            <i class="icon-like operate_icon"><span>{{ postInfo.likeNum }}</span></i>
            <i class="icon-reply operate_icon"><span>{{ postInfo.replyNum }}</span></i>
          </div>
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
