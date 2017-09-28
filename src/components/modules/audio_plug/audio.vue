<style lang="less">
  @import "../../../styles/base/base-750";
  @import "../../../styles/base/border";

  .audio_plug {
    display: inline-block;
    .width(234);
    .height(70);
    .border-1px-all(#3483E1);
    .border-1px-radius(12);

    > audio {
      display: none;
    }

    .play_animation {
      float: left;
      display: inline-block;
      .margin(13, 0, 0, 28);
      .width(30);
      .height(40);
      content: '';
      background: url('../../../assets/images/audio.png') no-repeat;
      .background-size(26, 150);
    }

    .active_1 {
      .background-position(0, 0);
    }

    .active_2 {
      .background-position(0, -50);
    }

    .active_3 {
      .background-position(0, -100);
    }

    .time {
      float: right;
      .margin(16, 18, 0, 0);
      .font-size(30);
      color: #3483E1;
    }
  }

  .no_support {
    .width(254);
    .height(78);
    .font-size(32);
    .padding-left(30);
    color: #999;
  }
</style>

<template>
  <a v-if="support" class="audio_plug" href="javascript:;" @click="playVoice">
    <audio :id="id" :src="src" type="audio/mpeg"></audio>
    <span :id="idAnimation" class="play_animation active_3"></span>
    <span class="time">{{ long }}"</span>
  </a>
  <a v-else class="no_support" href="javascript:;">不支持此格式语音播放</a>
</template>

<script>
  import $ from 'npm-zepto'

  export default {
    props: {
      src: {
        type: String,
        required: true
      },
      id: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        oPlayAnimation: null,
        oAudio: null,
        bOk: false,
        timer: null,
        long: 0,
        support: true,
        duration: 0,
        idAnimation: null
      }
    },
    created () {
      this.idAnimation = this.id + '_play_animation'
    },
    ready () {
      let timer = setInterval(() => {
        if (this.src) {
          this.getMediaLong(this.src)
          clearInterval(timer)
        }
      }, 30)
      this.oPlayAnimation = document.getElementById(this.idAnimation)
      this.oAudio = document.getElementById(this.id)
      if (this.oAudio) {
        this.oAudio.addEventListener('durationchange', () => {
          this.long = this.duration
          if (isNaN(this.long)) {
            this.support = false
          } else {
            this.support = true
          }
        })
        this.oAudio.addEventListener('ended', () => {
          this.bOk = false
          clearInterval(this.timer)
          this.long = this.duration
          this.oPlayAnimation.className = 'play_animation active_3'
        })
      }
    },
    beforeDestroy () {
      this._pause()
    },
    methods: {
      getMediaLong (src) {
        let self = this
        $.get(src + '?avinfo', (data) => {
          if (data.streams[0]) {
            self.duration = Math.round(data.streams[0].duration)
            this.long = self.duration
          }
        })
      },
      playVoice () {
        if (this.long) {
          this.bOk = !this.bOk
          let i = 1
          if (this.bOk) {
            this._play()
            this.timer = setInterval(() => {
              let duration = this.duration
              let currentTime = Math.round(this.oAudio.currentTime)
              this.long = Math.abs(duration - currentTime)
              this.oPlayAnimation.className = 'play_animation active_' + i
              i++
              if (i === 4) {
                i = 1
              }
            }, 400)
          } else {
            this.bOk = false
            this._pause()
            clearInterval(this.timer)
            this.oPlayAnimation.className = 'play_animation active_3'
          }
        }
      },
      _play () {
        this.oAudio.play()
      },
      _pause () {
        this.oAudio.pause()
        this.oAudio.currentTime = 0
        this.long = this.duration
      }
    }
  }
</script>