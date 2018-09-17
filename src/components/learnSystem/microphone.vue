<template>
  <div>
    <div class="mic-play" :class="{'mic-play-move':micMove}" @click="play"></div>
    <canvas width="100" height="100" class="arch mic-play-canvas" @click="play"></canvas>
    <div class="microphone-container" :class="{'mic-container-move':micMove}" @click="recordOperate">
      <div class="microphone">
        <transition name="mic-hide">
          <b class="mic-pic" :class="{'mic-pic-move':micMove, 'mic-delay':delay}" v-show="!micHide"></b>
        </transition>
        <transition name="mic-wave">
          <div class="bar-container" v-show="waveShow" :class="{'mic-delay':!delay}">
            <div class="bar" v-for="(bar, index) in thumbHeight" :key="index" :style="'height:'+bar+'px'" ></div>
          </div>
        </transition>
      </div>
      <div class="arch-track" :class="{'arch-track-move':micMove}"></div>
      <canvas width="112" height="112" class="arch"></canvas>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'
import bus from '../../bus'
import Recorder from '../../plugins/recorder'
import SoundManager from '../../plugins/soundManager'

export default {
  props: ['time', 'code', 'sentence'],
  name: 'microphone',
  data () {
    return {
      value: 0, // 当前的时间
      value4Play: 0, // 播放用的时间
      currentRecord: 0, // 当前录音的时长
      now: 0,
      delta: 0,
      then: Date.now(), // 纠错时间
      fps: 300,
      interval: 0,
      thumbHeight: _.fill(Array(23), 0),
      stopDraw: false, // 停止draw
      micHide: false, // 是否隐藏mic
      waveShow: false, // 是否展示wave
      delay: false, // 是否延迟
      micMove: false, // 麦克风是否移动
      isRecord: false // 是否录音
    }
  },
  created () {
    this.$on('microphone-stop', () => {
      Recorder.stopRecording()
      // 停止检测录音音量
      bus.$off('record_setVolume')
    })
    this.$on('microphone-reset', () => {
      this.stopDraw = true
      this.micHide = false
      this.waveShow = false
      this.delay = false
      this.value = 0
      this.micMove = false
      this.clear()

      this.$emit('microphone-stop')
      Recorder.stopRecordSoud()
    })

    this.$on('microphone-stop-playing', () => {
      Recorder.stopRecordSoud()
    })

    this.$on('microphone-start', () => {
      this.stopDraw = false
      this.value = 0
      this.delay = false
      this.micHide = true
      this.waveShow = true
      this.micMove = false
      this.clear()

      Recorder.stopRecordSoud()
      Recorder.stopRecording()

      _.delay(() => {
        SoundManager.playSnd('recordPro')
      }, 500)
      _.delay(() => {
        Recorder.startRecording()
        this.updateLocked(true)
        window.requestAnimationFrame(this.step)
      }, 1000)

      bus.$on('record_setVolume', data => {
        var res = []
        for (var i = 0; i < data.length; i = i + 186) {
          var value = Math.abs(data[i]) * 6
          value = value * value * 16
          value = value >= 50 ? 50 - _.random(3, 10) : value
          res.push(value)
        }
        // 修正边缘数据
        _.each(res, (val, idx) => {
          if ((idx >= 0 && idx <= 3) || (idx < 23 && idx >= 20)) {
            res[idx] = val + _.random(-20, 5)
          }
        })
        this.$set(this, 'thumbHeight', res)
      })
    })

    this.$on('upload-qiniu', () => {
      if (this.isRecord) {
        if (!this.qiniuToken) {
          this.getQiniuToken().then((res) => {
            this.updateQiniuToken(res)
            Recorder.uploadQiniu(this.qiniuToken, this.code, this.sentence)
            console.log(Recorder.recorderUrl)
            this.isRecord = false
          })
        } else {
          Recorder.uploadQiniu(this.qiniuToken, this.code, this.sentence)
          this.isRecord = false
        }
      }
    })
  },
  mounted () {
    this.$on('microphone-stop-playing', () => {
      Recorder.stopRecordSoud()
    })

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
    this.fps = this.fps || 300
    this.interval = 1000 / this.fps
  },
  computed: {
    ...mapState({
      qiniuToken: state => state.learn.qiniuToken
    }),
    ctx () {
      return this.$el.parentElement
        .querySelectorAll('canvas')[1]
        .getContext('2d')
    },
    ctx4Play () {
      return this.$el.parentElement
        .querySelectorAll('canvas')[0]
        .getContext('2d')
    }
  },
  watch: {
    time () {
      this.$emit('microphone-reset')
      if (this.time < 2) {
        // this.time = 2
        this.$emit('updateTime', 2)
      }
    }
  },
  methods: {
    ...mapActions({
      getQiniuToken: 'learn/getQiniuToken'
    }),
    ...mapMutations({
      updateQiniuToken: 'learn/updateQiniuToken',
      'updateLocked': 'learn/updateLocked'
    }),
    draw () {
      this.$parent.$parent.$emit('setTimer') // 重置guide-box定时器的时间（录音，播放开始时，以及过程中）
      var ctx = this.ctx
      this.value += 1 / this.fps / this.time
      ctx.clearRect(0, 0, 112, 112)
      ctx.beginPath()
      ctx.arc(56, 56, 53, 0, Math.PI * 2 * this.value, false)
      ctx.lineWidth = 6.7
      ctx.strokeStyle = '#6ade80'
      ctx.stroke()
    },
    step () {
      if (this.stopDraw) {
        return
      }
      if (this.value <= 1) {
        window.requestAnimationFrame(this.step)
      } else {
        this.stopRecrod()
      }
      this.now = Date.now()
      this.delta = this.now - this.then

      // 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。
      // 例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。
      // 16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
      // 详情请见 > http://www.ssy.me/前端技术/2015/11/10/requestAnimationFrame/

      if (this.delta > this.interval) {
        this.then = this.now - this.delta % this.interval
        this.draw()
      }
    },
    draw4Play () {
      this.$parent.$parent.$emit('setTimer')
      var ctx = this.ctx4Play
      this.value4Play += 1 / (this.fps * this.currentRecord) / this.time
      ctx.clearRect(0, 0, 100, 100)
      ctx.beginPath()
      ctx.arc(50, 50, 46, 0, Math.PI * 2 * this.value4Play, false)
      ctx.lineWidth = 6.0
      ctx.strokeStyle = '#6ade80'
      ctx.stroke()
    },
    step4Play () {
      if (this.value4Play <= 1) {
        window.requestAnimationFrame(this.step4Play)
      } else {
        this.clear4Play()
        return
      }
      this.now = Date.now()
      this.delta = this.now - this.then

      // 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。
      // 例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。
      // 16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
      // 详情请见 > http://www.ssy.me/前端技术/2015/11/10/requestAnimationFrame/

      if (this.delta > this.interval) {
        this.then = this.now - this.delta % this.interval
        this.draw4Play()
      }
    },
    clear () {
      this.ctx.clearRect(0, 0, 112, 112)
    },
    clear4Play () {
      this.ctx4Play.clearRect(0, 0, 112, 112)
    },
    move () {
      this.micMove = true
    },
    play () {
      this.$parent.$parent.$emit('setTimer')
      this.value4Play = 0
      window.requestAnimationFrame(this.step4Play)
      Recorder.playRecording()
      this.$parent.$emit('stop-sound')
    },
    end () {
      console.log('end')
      // 重置wave
      this.$set(this, 'thumbHeight', _.fill(Array(23), 0))
      this.delay = true
      this.micHide = false
      this.waveShow = false
      this.updateLocked(false)
      this.move()

      this.$parent.$emit('setScore')
      this.$parent.$emit('repeat-canuse')
    },
    startRecord () {
      this.$parent.$parent.$emit('setTimer')
      if (this.value && this.value < 1) return
      this.$emit('microphone-start')
      this.$parent.$emit('repeat-disable')
    },
    stopRecrod () {
      this.currentRecord = this.value
      this.$emit('microphone-stop')
      this.$emit('microphone-reset')
      this.end()
    },
    recordOperate () {
      console.log('recordOperate')
      this.isRecord = true
      if (!(this.value && this.value < 1)) {
        // 正在播放,则继续
        this.startRecord()
      } else {
        this.stopRecrod()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.microphone-container {
  transition: transform 1s ease;
  z-index: 2;
  left: 50%;
  top: 50%;
  margin-left: -50px;
  margin-top: -50px;
  width: 100px;
  height: 100px;
  position: absolute;
  cursor: pointer;
  z-index: 22;
  canvas {
    transform: rotateZ(-90deg);
  }
}

.mic-container-move {
  transform: translateX(-50px);
  width: 50px;
  height: 50px;
  margin-top: -25px;
}

.arch-track-move {
  width: 60px !important;
  height: 60px !important;
  margin-left: -30px !important;
  margin-top: -30px !important;
}

.microphone {
  cursor: pointer;
  background-color: #55a4fc;
  border-radius: 50%;
  perspective: 1000px;
  width: 100%;
  height: 100%;
  .bar {
    height: 2px;
    width: 2px;
    max-height: 50px;
    min-height: 2px;
    background: #fff;
    margin: 0 1px;
    transition: height 0.3s ease;
  }
  .bar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
    transition: all 0.5s ease;
  }
  .mic-pic {
    height: 100%;
    display: block;
    transform-style: preserve-3d;
    transition: all 0.5s ease;
    transform: rotate3d(1, 0, 0, 0);
    background: url(../../../static/images/learnSystem/white_microphone2.png) center center
      no-repeat;
  }
  .mic-hide-leave,
  .mic-hide-enter {
    transform: rotate3d(1, 0, 0, 90deg);
  }
  .mic-delay {
    transition-delay: 0.4s;
  }
  .mic-wave-leave,
  .mic-wave-enter {
    opacity: 0;
    transition-delay: 0;
  }
}

.arch {
  left: 50%;
  top: 50%;
  margin-left: -56px;
  margin-top: -56px;
  position: absolute;
  z-index: 21;
  //background:#fff;
  //opacity: 0.4;
}

.arch-track {
  width: 112px;
  height: 112px;
  margin-left: -56px;
  margin-top: -56px;
  border: 6px solid #fff;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  position: absolute;
  opacity: 0.4;
  z-index: 21;
}

.mic-play {
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -19px;
  margin-top: -19px;
  width: 38px;
  height: 38px;
  z-index: 2;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  background: url(../../../static/images/learnSystem/play.png?) center center no-repeat;
  transition: transform 1s ease;
  &:hover {
    background: url(../../../static/images/learnSystem/play_hover.png?) center center
      no-repeat;
  }
}
.mic-play-canvas {
  margin-left: 3px;
  margin-top: -48px;
  transform: rotateZ(-90deg);
  z-index: 3;
}

.mic-play-move {
  transform: translate3d(55px, 0, 0) scale(2.9);
  width: 30px;
  height: 30px;
  //margin-left: -49px;
  margin-top: -15px;
  background: url(../../../static/images/learnSystem/play1.png?) center center no-repeat;
  transition: transform 1s ease;
  &:hover {
    background: url(../../../static/images/learnSystem/play1_hover.png?) center center
      no-repeat;
  }
  background-size: 100% auto;
  background-repeat: no-repeat;
  &:hover {
    background-size: 100% auto;
    background-repeat: no-repeat;
  }
}

.mic-pic-move {
  background-size: 40% auto !important;
}

// 删除小图片下的特殊样式
//.guide-container,
//.layout-3,
//.layout-4 {
//    .microphone-container {
//        margin-left: -40px;
//        margin-top: -40px;
//        width: 80px;
//        height: 80px;
//    }
//    .mic-pic {
//        background: url(../../../../static/images/learnSystem/white_microphone.png) center center no-repeat;
//    }
//    .bar {
//        width: 1px;
//    }
//    .arch-track {
//        transform: scale(.78);
//    }
//    canvas {
//        transform: rotateZ(-90deg) scale(.78);
//    }
//}
</style>
