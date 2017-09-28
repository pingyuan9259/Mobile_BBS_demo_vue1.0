<style lang="less">
  @import "../../styles/base/base-750";
  @import "../../styles/base/border";

  .details_plug {
    .width(700);
    .height(150);
    .margin-top(20);
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    .border-1px-all(#EEE);

    > div {
      height: 100%;
      background: #F7F7F7;
      overflow: hidden;

      .img_con {
        position: relative;
        .top(2);
        float: left;
        .width(148);
        .height(148);
        overflow: hidden;

        > img {
          position: absolute;
          left: 50%;
          top: 50%;
          -webkit-transform:translate(-50%, -50%);
          transform:translate(-50%, -50%);
        }
      }

      .abstract {
        float: left;
        .width(500);
        .height(121);
        .margin(13, 20, 16, 27);

        > h6 {
          .font-size(30);
          font-weight: normal;
          -webkit-margin-before: 0;
          -webkit-margin-after: 0;
          color: #595959;
        }

        > p {
          .font-size(26);
          .margin-top(5);
          color: #A7A7A7;
          overflow: hidden;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          -ms-line-clamp: 2;
          -ms-box-orient: vertical;
        }
      }
    }

    .name {
      display: inline;
      color: #3D83D7;
    }
  }
</style>

<template>
  <div v-if="replyid" class="details_plug">
    <div>
      <a class="img_con" href="javascript:;">
        <img :src="img" @load="ckeckImg($event)" />
      </a>
      <div class="abstract clearfix" v-link="{path: '/forum_detail?postId=' + id + '&replyId=' + replyid}">
        <h6>{{ name }}</h6>
        <p>{{ title }}</p>
      </div>
    </div>
  </div>
  <div v-else class="details_plug">
    <div>
      <a class="img_con" href="javascript:;">
        <img :src="img"
        v-touch:tap="onTap(myReply.mediaContent)"
        v-touch:press="onTapHold(myReply.mediaContent)"
        @load="ckeckImg($event)" />
      </a>
      <div class="abstract clearfix" v-link="{path: '/forum_detail?postId=' + id}">
        <h6>{{ name }}</h6>
        <p>{{ title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'npm-zepto'

  export default {
    props: {
      id: {
        type: Number,
        required: true
      },
      img: {
        type: String
      },
      name: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      replyid: {
        type: Number,
        default: 0
      }
    },
    methods: {
      onTap (src) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.imgSingleTap) {
          bridge.imgSingleTap(src)
        }
      },
      onTapHold (src) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.imgLongTap) {
          bridge.imgLongTap(src)
        }
      },
      ckeckImg (event) {
        let target = event.target
        let width = parseInt($(target).css('width'))
        let height = parseInt($(target).css('height'))
        if (width <= height) {
          $(target).css('width', '100%')
        } else {
          $(target).css('height', '100%')
        }
      }
    }
  }
</script>
