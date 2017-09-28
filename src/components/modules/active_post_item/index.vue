<style lang="less">
  @import "../../../styles/base/base-750";
  @import "../../../styles/base/border";
  @import "../../../styles/base/ellipsis";
  @import './index.less';
</style>

<template>
  <div class="active-post-item" v-link="{ path: '/forum_detail?postId=' + postInfo.postId }">
    <div class="cover">
      <img :src="postInfo.avatar || defaultAvatar | https" alt="" @load="ckeckImg($event)">
    </div>
    <div class="abstract">
      <h5 class="title">{{ postInfo.name }}</h5>
      <div class="detail-info">
        <p class="startOn">开始时间 {{ postInfo.activityBeginAt | timeFormat }}</p>
        <span>|</span>
        <p class="post-status" :class="{'active': postInfo.bbsStatus === 0}">{{ statusTxt }}</p>
      </div>
    </div>
    <div class="day-num">
      <img src="../../../assets/images/day.png" />
      <span>{{ durationTime }}天</span>
    </div>
  </div>
</template>

<script>
  import $ from 'npm-zepto'
  import defaultImg from '../../../configs/default_img'
  import moment from 'moment'

  export default {
    props: {
      postInfo: {
        type: Object,
        requried: true
      }
    },
    data () {
      return {
        defaultAvatar: defaultImg.bbsAvatar,
        statusTxt: '',
        durationTime: ''
      }
    },
    computed: {
      statusTxt: function () { // 当前活动状态 0: 审核拒绝, 1: 审核中, 2:审核同意, 3: 未到报名时间， 4：报名中， 5: 等待活动开始， 6: 活动中， 7: 活动结束
        let statusTxt = this.postInfo.activityAmount + '人参加'
        switch (this.postInfo.bbsStatus) {
          case 0:
            statusTxt = '审核未通过'
            break
          case 1:
            statusTxt = '正在审核'
            break
          case 6:
            statusTxt = '打卡进行中'
            break
          case 7:
            statusTxt = '已结束'
            break
        }
        return statusTxt
      },
      durationTime: function () {
        let startTime = this.postInfo.activityBeginAt
        let endTime = this.postInfo.activityEndAt
        let distance = Math.floor((moment(endTime).unix() - moment(startTime).unix()) / 60 / 60)
        return Math.ceil(distance / 24)
      }
    },
    methods: {
      ckeckImg (event) {
        let target = event.target
        let width = parseInt($(target).css('width'))
        let height = parseInt($(target).css('height'))
        if (width <= height) {
          $(target).css({'width': '100%', 'height': 'initial'})
        } else {
          $(target).css({'width': 'initial', 'height': '100%'})
        }
      }
    }
  }
</script>
