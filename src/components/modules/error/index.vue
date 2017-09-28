<style lang='less'>
  @import "../../../styles/base/base-750";
  @import './index.less';
</style>

<template>
  <div v-if="showerror" class="error-con">
    <div class="error-bg">
      <i class="error-icon"></i>
    </div>
    <div class="error-text">{{ errorTip }}</div>
  </div>
</template>

<script>
  import Title from '../../../utils/setTitle'

  export default {
    props: {
      showerror: {
        type: Boolean,
        default: false
      },
      error: {
        type: String
      }
    },
    data () {
      return {
        title: '',
        errorTip: ''
      }
    },
    watch: {
      showerror () {
        if (this.error === '请登录') {
          this.title = '请登录'
          this.errorTip = '请登录新生大学查看'
        } else if (this.error === '未认证') {
          this.title = '未认证'
          this.errorTip = '实名认证后才可以查看'
        } else if (this.error === '贴子不存在') {
          this.title = '出错啦！'
          this.errorTip = '贴子不存在'
        } else {
          this.title = '出错啦！'
          this.errorTip = '页面出错了'
        }
        Title.set(this.title)
      }
    },
    destroyed () {
      this.showerror = false
    }
  }
</script>
