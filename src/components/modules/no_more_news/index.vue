<style lang="less">
  @import "../../../styles/base/base-750";

  .no_more {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: #fff;

    .tip {
      position: absolute;
      width: 100%;
      .height(80);
      top: 50%;
      .margin-top(-60);
      text-align: center;
      .font-size(50);
      color: #ccc;
      font-weight: normal;
    }
  }
</style>

<template>
  <div class="no_more">
    <h3 class="tip">{{ nomoretip || '暂无消息' }}</h3>
  </div>
</template>

<script>
  export default {
    props: {
      nomoretip: {
        type: String
      }
    }
  }
</script>
