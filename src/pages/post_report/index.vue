<style lang='less'>
  @import "./index.less";
</style>

<template>
  <div class="reply-con">
    <div class="reply-head">请选择投诉原因</div>
    <ul class="reply-list" @click='getContent($event)'>
      <li>色情低俗</li>
      <li>谣言</li>
      <li>诱导分享</li>
      <li>政治敏感</li>
      <li>其他（收藏隐私信息等）</li>
      <li>侵权举报（诽谤、抄袭、冒用...）</li>
    </ul>
    <a class="submit-btn" href="javascript:void(0)" @click='submit'>提交</a>
  </div>
</template>

<script>
  import { complainPost } from '../../vuex/post/actions'
  import { Toast } from 'mint-ui'

  export default {
    data () {
      return {
        content: ''
      }
    },
    vuex: {
      getters: {
        postId: state => state.route.query.postId,
        replyId: state => state.route.query.replyId
      },
      actions: {
        complainPost
      }
    },
    methods: {
      submit () {
        let data = {
          target_id: this.replyId.toString(),
          content: this.content
        }
        this.complainPost(data, this.success, this.fail)
      },
      getContent (event) {
        let target = event.target
        let brother = target.parentNode.children

        for (var i = 0; i < brother.length; i++) {
          brother[i].className = ''
        }

        this.content = target.innerHTML
        target.className = 'active'
      },
      success () {
        Toast('举报成功')
        this.$route.router.go({path: '/forum_detail?postId=' + this.postId})
      },
      fail () {
        Toast('举报失败')
      }
    }
  }
</script>

