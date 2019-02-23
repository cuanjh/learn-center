<template>
  <div>
    <div class="homework-box h-speak">
      <div class="head">{{ $t("homework.title") }}</div>
      <div class="content">
        <div class="question">
          <b></b>
          <span>{{ $t("homework.record") }}</span>
          <div class="tip" @click="showTips()" v-show="tips"><b></b>{{ $t("homework.tip") }}</div>
        </div>
        <div class="que-con f-wwb" :class="{rtl:dir}">
          <p>{{words}}</p>
        </div>
        <div class="que-record f-cb">
          <div class="m-b">
            <canvas width="112" height="112"></canvas>
            <div class="m-bg">
              <div class="m-track" :style="{height:track_height}"></div>
            </div>
            <div class="mac" @click="recordStart()"></div>
          </div>
          <div class="repeat" :class="{active:!gray}" @click="repeatMySound()">
            <b></b>
          </div>
        </div>
        <p class="info">{{ $t("homework.info") }}</p>
      </div>
      <div class="footer f-cb">
        <div class="btn submit" :class="{disable:gray}" @click="exit(0)">{{ $t("homework.submit") }}</div>
        <div class="btn cancel" @click="exit(1)">{{ $t("homework.cancel") }}</div>
      </div>
    </div>
    <tipbox :tip="micphoneTip" ref="tipbox"></tipbox>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'

import tipbox from '../tipbox.vue'
import bus from '../../../bus'
import Recorder from '../../../plugins/recorder'
import SoundCtrl from '../../../plugins/soundCtrl'

export default {
  props: ['data', 'id'],
  // 初始数据/////////////////////////////
  data () {
    return {
      words: '',
      tips: false, // 暂时禁止提示窗
      gray: true, // 是否禁止 点击交作业按钮的控制
      sound: null,
      recording: false, // 是否正在录音
      timeoutId_record: null,
      delay_record: 10000,
      track_height: 0,
      sndctr: null,
      intervalId_draw: null,
      delay_draw: 40,
      recordActivity: false, // 录音是否激活
      // dir: this.direction < 0,
      micphoneTip: ''
    }
  },
  components: {
    tipbox
  },
  created () {
    this.$on('init', () => {
      this.init()
    })
  },
  computed: {
    ...mapState({
      direction: state => state.learn.direction,
      speakwork: state => state.learn.speakwork,
      canRecord: state => state.learn.canRecord,
      tipsMsg: state => state.learn.tips,
      userInfo: state => state.userInfo
    }),
    dir () {
      return this.direction < 0
    }
  },
  methods: {
    ...mapMutations({
      updateSpeakWork: 'learn/updateSpeakWork'
    }),
    init () {
      this.words = this.data.sentence // 找不到，暂时估计是tip相关

      // console.log('tips:', this.tips)
    },

    draw (progress) {
      var $progress = document.querySelector('canvas')
      if (!$progress) return
      var ctx = $progress.getContext('2d')
      ctx.clearRect(0, 0, 112, 112)
      ctx.beginPath()
      ctx.arc(56, 56, 51, 0, Math.PI * 2 * progress, false)
      ctx.lineWidth = 8.0
      ctx.strokeStyle = '#3cddc9'
      ctx.stroke()
    },

    showTips () {
      var _this = this
      // var url = Config.URL.base + this.data.form_sound
      var url = this.data.form_sound
      if (!this.sndctr) {
        this.sndctr = SoundCtrl
        var audio = new Audio()
        audio.src = url
        audio.oncanplay = () => {
          // console.log(audio, url)
          _this.sndctr.setSnd(audio)
          _this.sndctr.play()
        }
      } else {
        this.sndctr.play()
      }
    },

    checkMic () {
      // 弹出提示、/////////////////////////////////////////////
      var isPop
      if (
        Recorder.isActivity(this.speakwork, this.canRecord) !== true &&
        Recorder.refuseRecord !== true &&
        this.canRecord
      ) {
        this.micphoneTip = this.tipsMsg.micphone
        isPop = true
      } else if (Recorder.refuseRecord) {
        this.micphoneTip = this.tipsMsg.homework_micphoneFailed
        isPop = true
      }
      if (isPop) {
        this.$refs['tipbox'].$emit('tipbox-show')
      }

      return isPop
    },
    recordStart () {
      // 停止声音播放
      if (this.sndctr) this.sndctr.stop()
      if (this.checkMic()) {
        return
      }
      // 如果正在录音则停止录音
      if (this.recording) {
        this.recordStop()
        return
      }
      if (!this.checkRecording()) return
      // 录音状态下不可点
      this.gray = true
      this.recording = true
      this.tips = false
      // 开始检测录音音量
      bus.$on('record_setVolume', this.setVolume)
      Recorder.startRecording()
      var _this = this
      console.log('record start!!!!!')
      this.timeoutId_record = setTimeout(
        _this.recordStop,
        this.delay_record
      )

      // 显示录音进度
      var percent = 0
      var step = 1 / (this.delay_record / 40)

      this.intervalId_draw = setInterval(() => {
        // 如果已经暂停录音则停止绘制
        if (!_this.recording || percent > 1) {
          clearInterval(_this.intervalId_draw)
          _this.draw(0)
          return
        }
        percent += step
        // console.log('percent:', percent)
        _this.draw(percent)
      }, this.delay_draw)
    },

    recordStop () {
      Recorder.stopRecording()
      bus.$off('record_setVolume')
      console.log('record stop!!!!!')
      if (this.recording) this.gray = false
      this.track_height = 0
      // this.tips = true
      this.recording = false
      this.recordActivity = false

      clearInterval(this.timeoutId_record)
      /* clearInterval(this.intervalId_draw)
         this.draw(0)
      */
    },

    repeatMySound () {
      // console.log('repeat')
      if (!this.gray) Recorder.playRecording()
    },
    // 是否可以录音
    checkRecording () {
      // Config.canRecord = true
      this.updateSpeakWork(true)
      console.log('mic激活：', Recorder.isActivity(this.speakwork, this.canRecord))
      return Recorder.isActivity(this.speakwork, this.canRecord)
    },
    // 录音音量
    setVolume (soundInput) {
      var db = 0
      _.each(soundInput, (val) => {
        db += Math.abs(val)
      })
      db /= 45
      // 录音激活
      if (db > 0.1 && !this.recording) {
        this.recordActivity = true
      }
      // 更新mic动画
      this.track_height = db + 'px'
    },

    exit (value) {
      var _this = this
      if (this.gray && !value) return // 按钮不可选，并且是交作业按钮，return
      this.gray = true

      // value==1 忽略作业

      // statistics.finish_del_homework({
      //   user_id: this.userInfo.userID,
      //   homework_id: this.id,
      //   type: value ? 'del' : 'finish'
      // })

      Recorder.stopRecordSoud()

      // 发送数据
      Recorder.getTime((duration) => {
        // duration 获取音频的时长
        var fd = new FormData()
        fd.append('code', _this.id)
        fd.append('ignore', value)
        fd.append('type', _this.data.form_show_type)
        fd.append('record_sound', Recorder.getSndData())
        fd.append('sound_time', Math.ceil(duration))
        fd.append('word', _this.data.sentence)

        var xhr = new XMLHttpRequest()
        // 回调
        xhr.addEventListener(
          'load',
          (e) => {
            console.log('cb:', e)
            // if (!value) toaster.success(Config.tips.homework_sendSuccess)
            if (!value) _this.$dispatch('update-progress')
            _this.$dispatch('back-content')
          },
          false
        )

        // xhr.open('POST', Config.URL.homework)
        xhr.send(fd)
      })
      this.clear()

      this.updateSpeakWork(false) // 这个开关是控制谁的？（找不到相关代码）
    },

    clear () {
      this.words = ''
      // this.tips = true
      this.gray = true
      this.recording = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../../static/less/global_var";
.homework-box {
  width: 660px;
  background: #fff;
  height: 490px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -330px;
  margin-top: -245px;
  .head {
    height: 70px;
    background-color: #55a4fc;
    color: #fff;
    font-size: 27px;
    text-align: center;
    line-height: 70px;
  }
  .content {
    padding: 30px;
  }
  .question {
    position: relative;
    b {
      display: inline-block;
      position: relative;
      background: url(../../../../static/images/homework/pencil.png);
      width: image-width;
      height: image-height;
      margin-right: 7px;
      top: 3px;
    }
    span {
      color: #5a6caf;
      font-size: 1.4em;
    }
    .tip {
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 3px;
      cursor: pointer;
      background-color: #e9ecf6;
      color: #b7bed4;
      height: 20px;
      padding: 0 5px;
      b {
        background: url(../../../../static/images/homework/light.png);
        width: image-width;
        height: image-height;
      }
      &:hover {
        color: #fff;
        background: linear-gradient(0deg, #ffc33e 0%, #ebaa08 100%);
        b {
          background: url(../../../../static/images/homework/lightwhite.png);
        }
      }
    }
  }
  .que-con {
    overflow: hidden;
    line-height: 1.41;
    margin: 10px auto;
    font-size: 1.3em;
    color: @main-color;
    letter-spacing: 0.05em;
    min-height: 44px;
  }
  .que-input {
    margin-top: 20px;
  }
  textarea {
    border: 1px solid #b7bed4;
    height: 130px;
    padding: 10px;
    width: 570px;
    margin: 0 auto;
    display: block;
    font-size: 1.3em;
    color: #464646;
    border-radius: 3px;
  }
  .info {
    color: #b7bed4;
    margin-top: 20px;
    font-size: 1.25em;
  }
  .footer {
    border-top: 1px solid #e8e8e8;
    padding: 20px 0;
    padding-left: 20px;
  }
  .btn {
    cursor: pointer;
    float: left;
    line-height: 35px;
    text-align: center;
    color: #fff;
    font-size: 1.3em;
    margin-left: 20px;
    border-radius: 3px;
    background-color: #55a4fc;
    width: 123px;
    height: 35px;
    &:hover {
      background: linear-gradient(0deg, #59b3ff 0%, #4e9ff6 100%);
    }
  }
  .cancel {
    background-color: #e9ecf6;
    color: #b5bccf;
    &:hover {
      background: linear-gradient(0deg, #e9ecf6 0%, #dfe2ed 100%);
    }
  }
  .disable {
    background-color: #e9ecf6;
    color: #b5bccf;
    cursor: default;
    &:hover {
      background: #e9ecf6;
      color: #b5bccf;
    }
  }
}

.h-speak {
  .question {
    b {
      background: url(../../../../static/images/homework/speak.png);
      width: 24px;
      height: 17px;
    }
  }
  .que-record {
    border-top: 1px solid #e8e8e8;
    padding: 30px;
    canvas {
      position: absolute;
      z-index: 1;
      left: -6px;
      top: -6px;
      transform: rotate(-90deg);
    }
    .m-b {
      cursor: pointer;
      float: left;
      position: relative;
      width: 100px;
      z-index: 11;
      height: 100px;
      .m-bg {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -15px;
        margin-top: -25px;
        position: absolute;
        width: 30px;
        height: 50px;
        border-radius: 50%;
        background: #fff;
        z-index: 11;
      }
      .mac {
        left: 50%;
        top: 50%;
        margin-left: -50px;
        margin-top: -50px;
        position: absolute;
        background-image: url(../../../../static/images/learnSystem/microphone.png);
        border-radius: 50%;
        width: 100px;
        height: 100px;
        z-index: 111;
      }
    }
  }

  .rtl {
    direction: rtl;
    text-align: left;
  }

  .repeat {
    float: left;
    border-radius: 50%;
    background-color: #e9ecf6;
    width: 46px;
    height: 46px;
    margin-top: 27px;
    margin-left: 40px;
    b {
      background: url(../../../../static/images/homework/trumpet.png);
      width: 19px;
      height: 18px;
      display: block;
      position: relative;
      top: 14px;
      left: 14px;
    }
    &.active {
      background-color: @main-color;
      cursor: pointer;
    }
  }
}
</style>
