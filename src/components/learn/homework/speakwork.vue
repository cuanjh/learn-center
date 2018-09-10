<template>
  <div>
    <div class="shadow"></div>
    <!-- 作业列表，分为语音和写作 -->
    <div class="speak" @click="showTips()">
      <div class="question">
        <i></i>
        <span>请根据文字内容录音。</span>
      </div>
      <div class="que-con">
        <p>{{homework.sentence}}</p>
      </div>
      <div class="footer">
        <p class="btn" :class="{'submint':homework.has_done}">{{homework.has_done?'完成':'未完成'}}</p>
      </div>
    </div>
    <div class="repeatSpeak-box" v-show="isShow" @click.stop="closeShadow()">
      <div class="repeatSpeak-container">
        <div class="repeatSpeak-content">
          <div class="repeatSpeak-header">
            <i></i>
            <span>请根据文字内容录音。</span>
          </div>
          <div class="speak-con">
            <p>{{homework.sentence}}</p>
          </div>
          <p class="line"></p>
          <div class="que-record">
            <!-- 点击开始录音 -->
            <div class="record" v-show="recordShow" >
              <div class="record-img" @click.stop="showRecord()"></div>
              <p class="text">点击录音</p>
            </div>
            <!-- 蓝色录音标志 -->
            <div class="m-b" v-show="mShow">
              <canvas width="112" height="112"></canvas>
              <div class="m-bg">
                  <div class="m-track" :style="{height:track_height}"></div>
              </div>
              <div class="mac" @click.stop="recordStart()"></div>
            </div>
            <!-- 录音完毕就显示三个图标，录音，语音，发送 -->
              <div class="recording" v-show="lastShow">
                <div class="again-recording" @click.stop="againRecord()">
                  <i></i>
                  <span>重新录音</span>
                </div>
                <div class="audio-play-box">
                  <i class="note-line" @click.stop="startMySound()">
                    <span :class="{'animat':animat}"></span>
                    <span :class="{'animat':animat}"></span>
                    <span :class="{'animat':animat}"></span>
                    <span :class="{'animat':animat}"></span>
                    <span :class="{'animat':animat}"></span>
                    <span :class="{'animat':animat}"></span>
                  </i>
                </div>
                <div class="send" @click.prevent="exit()">
                  <i></i>
                  <span>发送</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <tip-box ref="tipbox" :tip="micphoneTip" />
  </div>
</template>
<script>
import _ from 'lodash'
import { mapMutations, mapState, mapActions } from 'vuex'
import Recorder from '../../../plugins/recorder'
import TipBox from '../../learnSystem//tipbox'

export default {
  props: ['homework'],
  data () {
    return {
      micphoneTip: '', // 提示框文字
      animat: false,
      isShow: false, // 禁止弹框显示
      recordShow: false, // 开始录音
      mShow: false, // 录音图标
      lastShow: false, // 三个图标
      sound: null,
      recording: false, // 是否正在录音
      timeoutId_record: null,
      delay_record: 10000,
      track_height: 0,
      intervalId_draw: null,
      delay_draw: 40,
      recordActivity: false // 录音是否激活
    }
  },
  components: {
    TipBox
  },
  created () {
    this.$on('init', () => {
      this.init()
    })
  },
  mounted () {
    // 初始化
    console.log('===>', this.homework)
    Recorder.init()
    // this.$nextTick(() => {
    //   var isPop
    //   if (
    //     Recorder.isActivity() !== true &&
    //     this.refuseRecord !== true &&
    //     this.canRecord
    //   ) {
    //     this.micphoneTip = this.tips.micphone
    //     isPop = true
    //   } else if (this.refuseRecord) {
    //     this.micphoneTip = this.tips.micphone_failed
    //     isPop = true
    //   }
    //   if (isPop) {
    //     this.$refs.tipbox.$emit('tipbox-show')
    //     this.updatePause(true)
    //   }
    // })
  },
  computed: {
    ...mapState({
      direction: state => state.learn.direction,
      refuseRecord: state => state.learn.refuseRecord,
      speakwork: state => state.learn.speakwork,
      canRecord: state => state.learn.canRecord,
      userInfo: state => state.user.userInfo,
      qiniuToken: state => state.learn.qiniuToken
    }),
    dir () {
      return this.direction < 0
    },
    ctx () {
      return this.$el.parentElement
        .querySelectorAll('canvas')[1]
        .getContext('2d')
    }
  },
  methods: {
    ...mapActions({
      getQiniuToken: 'learn/getQiniuToken',
      homeworkPub: 'course/homeworkPub'
    }),
    ...mapMutations({
      updateQiniuToken: 'learn/updateQiniuToken',
      updateSpeakWork: 'learn/updateSpeakWork',
      updatePause: 'learn/updatePause'
    }),
    showRecord () {
      this.recordShow = false
      this.mShow = true
    },
    draw (progress) { // canvas画图
      if (!this.ctx) return
      this.ctx.clearRect(0, 0, 112, 112)
      this.ctx.beginPath()
      this.ctx.arc(56, 56, 51, 0, Math.PI * 2 * progress, false)
      this.ctx.lineWidth = 8.0
      this.ctx.strokeStyle = '#6ade80'
      this.ctx.stroke()
    },
    showTips () {
      this.isShow = !this.isShow
      this.recordShow = true
    },
    recordStart () {
      // 如果正在录音则停止录音
      if (this.recording) {
        this.recordStop()
        return
      }
      // 判断是否在录音
      if (!this.checkRecording()) {
        return
      }
      // 录音状态下不可点
      this.recording = true
      // 开始检测录音音量
      this.$on('record_setVolume', this.setVolume)
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
        console.log('percent:', percent)
        _this.draw(percent)
      }, this.delay_draw)
    },
    recordStop () {
      Recorder.stopRecording()
      this.$off('record_setVolume')
      console.log('record stop!!!!!')
      // if (this.recording) this.gray = false // 绿色的喇叭
      // this.track_height = 0
      this.recording = false // 不在录音
      this.recordActivity = false // 录音没有激活
      this.mShow = false // 蓝色录音图标
      this.lastShow = true // 三个录音图标
      clearInterval(this.timeoutId_record)
    },
    // 是否可以录音
    checkRecording () {
      this.updateSpeakWork(true)
      console.log('mic激活：', Recorder.isActivity(this.speakwork, this.canRecord))
      return Recorder.isActivity(this.speakwork, this.canRecord)
    },
    // 录音音量mac动画
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
    // 重新开始录音
    againRecord () {
      this.lastShow = false
      this.mShow = true
    },
    // 播放录音 点击动画停止，播完停止动画
    startMySound () {
      this.animat = !this.animat
      if (this.animat) {
        let audio = Recorder.audio
        Recorder.playRecording()
        audio.addEventListener('ended', () => {
          this.animat = false
        })
      } else {
        Recorder.stopRecordSoud()
      }
    },
    // 发送作业 先调七牛云上传音频，调后台写作业接口
    exit () {
      let code = this.homework.form_id
      let sentence = this.homework.sentence
      Recorder.getTime((duration) => {
        let time = Math.round(duration)
        console.log('time', time)
        // 上传七牛云
        this.getQiniuToken().then((res) => {
          this.updateQiniuToken(res)
          Recorder.uploadQiniu(this.qiniuToken, code, sentence)
          let recorderUrl = Recorder.recorderUrl
          console.log('recorderUrl', Recorder.recorderUrl)
          // 请求后端接口
          this.homeworkPub({ code, sound_url: recorderUrl, sound_time: time }).then(res => {
            console.log('res', res)
            // 返回成功之后再处理 返回失败具体提示
            this.homework.has_done = true
            this.isShow = false
            this.recordShow = false
            this.mShow = false
            this.lastShow = false
            this.animat = false
          })
        })
      })
      this.clear()
      this.updateSpeakWork(false)
    },
    closeShadow () { // 遮罩层的显示和隐藏
      this.isShow = !this.isShow
      this.mShow = false
      this.lastShow = false
    },
    clear () {
      this.recording = false
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/less/global_var";
.speak {
  display: inline-block;
  vertical-align: top;
  width: 280px;
  background: #ffffff;
  margin: 20px 0;
  border-radius: 6px;
  .rtl {
    direction: rtl;
    text-align: left;
  }
  .question {
    width: 100%;
    margin: 20px 0;
    i {
      display: inline-block;
      background: url('../../../../static/images/homework/yuyingsmall.png')
        no-repeat;
      background-size: 100% 100%;
      width: 12px;
      height: 18px;
      margin: 0 4px 0 16px;
      outline: 0;
      vertical-align: middle;
    }
    span {
      color: #999999;
      font-size: 16px;
    }
    .sentence {
      color: #999999;
      font-size: 16px;
    }
  }
  .que-con {
    overflow: hidden;
    margin: 10px auto;
    font-size: 16px;
    color: #4a4a4a;
    margin-left: 16px;
    p {
      font-size: 16px;
      font-weight: Semlbold;
      color: #4a4a4a;
    }
  }
  .footer {
    width: 66px;
    height: 36px;
    margin-top: 20px;
    margin-left: 16px;
    .btn {
      width: 66px;
      height: 30px;
      border-radius: 6px;
      text-align: center;
      background-color: #2a9fe4;
      line-height: 30px;
      background-color: #e9ecf6;
      color: #b5bccf;
      cursor: default;
      &.submint {
        background: #2a9fe4;
        color: #ffffff;
      }
    }
  }
}
.repeatSpeak-box {
  display: block;
  width: 100%;
  height: 979px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(20, 18, 18, 0.5);
  z-index: 99;
}
.repeatSpeak-container {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -15%;
  margin-left: -10%;
  width: 286px;
  background: #ffffff;
  border-radius: 5px;
  .repeatSpeak-content {
    width: 100%;
    height: 100%;
  }
  .repeatSpeak-content {
    width: 100%;
    height: 100%;
    padding: 20px;
    .repeatSpeak-header {
      width: 100%;
      i {
        display: inline-block;
        background: url('../../../../static/images/homework/yuyingsmall.png');
        background-size: 100% 100%;
        width: 12px;
        height: 18px;
        margin-right: 4px;
        outline: 0;
        vertical-align: middle;
      }
      span {
        color: #999999;
        font-size: 16px;
      }
    }
    .speak-con {
      overflow: hidden;
      margin: 10px auto;
      font-size: 16px;
      color: #4a4a4a;
      p {
        font-size: 16px;
        font-weight: Semlbold;
        color: #4a4a4a;
      }
    }
    .line {
      margin-top: 30px;
      border: 1px solid #eaeaea;
    }
    .que-record {
      // transition: all 1s ease;
      position: relative;
      width: 100%;
      height: 200px;
      canvas {
        position: absolute;
        z-index: 1;
        left: -6px;
        top: -6px;
        transform: rotate(-90deg);
      }
      .record {
        width: 100%;
        height: 200px;
        .record-img {
          position: absolute;
          left: 50%;
          top: 50%;
          margin-top: -23%;
          margin-left: -19%;
          background-image: url('../../../../static/images/homework/yuying.png');
          background-size: 100% 100%;
          border-radius: 50%;
          width: 100px;
          height: 100px;
          z-index: 111;
        }
        .text {
          position: absolute;
          bottom: 20px;
          margin-left: -8%;
          font-size: 14px;
          color: #d8d8d8;
          left: 50%;
        }
      }
      .m-b {
        cursor: pointer;
        float: left;
        position: relative;
        top: 25%;
        left: 25%;
        width: 100px;
        z-index: 11;
        height: 100px;
        canvas {
          position: absolute;
          z-index: 1;
          left: 3px;
          top: -6px;
          transform: rotate(-90deg);
        }
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
          .m-track {
            -webkit-transition: all .3s ease;
            transition: all .3s ease;
            position: absolute;
            background: #35f875;
            max-height: 32px;
            width: 30px;
            bottom: 16px;
            top: auto;
          }
        }
        .mac {
          position: absolute;
          background-image: url('../../../../static/images/learnSystem/microphone.png');
          border-radius: 50%;
          width: 100px;
          height: 100px;
          z-index: 111;
          left: 50%;
          top: 50%;
          margin-left: -40px;
          margin-top: -50px;
        }
      }
      .recording {
        position: absolute;
        display: flex;
        justify-content: space-between;
        top: 25%;
        width: 100%;
        height: 88px;
        .again-recording {
          width: 58px;
          height: 78px;
          position: absolute;
          top: 25%;
          left: 0;
          i {
            display: inline-flex;
            width: 58px;
            height: 58px;
            background: url('../../../../static/images/homework/yuyinsmall.png') no-repeat;
            background-size: 58px 58px;
            border-radius: 50%;
          }
          span {
            font-size: 12px;
            color: #C3D0D8;
          }
        }
        .audio-play-box {
          width: 74px;
          height: 74px;
          position: absolute;
          top: 10%;
          left: 35%;
          i {
            display: flex;
            width: 74px;
            height: 74px;
            padding: 0 16px;
            box-shadow: 0 8px 25px rgba(172,191,203,.6);
            background: rgba(255,255,255,.8);
            margin: 0 auto;
            justify-content: space-around;
            align-items: center;
            border-radius: 100%;
            font-style: normal;
          }
          i span {
            display: inline-block;
            width: 3px;
            height: 8px;
            border-radius: 4px;
            background: #2a9fe4;
            // -webkit-animation: load 1s ease infinite;
            // animation-play-state: paused;
            &.animat {
              -webkit-animation: load 1s ease infinite;
            }
            &:nth-child(1){
              animation-delay:0.2s;
              -webkit-animation-delay:0.2s;
              -ms-animation-delay:0.2s;
              -o-animation-delay:0.2s;
              -moz-animation-delay:0.2s;
            }
            &:nth-child(2){
              animation-delay:0.3s;
              -webkit-animation-delay:0.3s;
              -ms-animation-delay:0.3s;
              -o-animation-delay:0.3s;
              -moz-animation-delay:0.3s;
            }
            &:nth-child(3){
              height: 16px;
            }
            &:nth-child(4){
              height: 16px;
              animation-delay:0.1s;
              -webkit-animation-delay:0.1s;
              -ms-animation-delay:0.1s;
              -o-animation-delay:0.1s;
              -moz-animation-delay:0.1s;
            }
            &:nth-child(5){
              animation-delay:0.4s;
              -webkit-animation-delay:0.4s;
              -ms-animation-delay:0.4s;
              -o-animation-delay:0.4s;
              -moz-animation-delay:0.4s;
            }
            &:nth-child(6){
              animation-delay:0.5s;
              -webkit-animation-delay:0.5s;
              -ms-animation-delay:0.5s;
              -o-animation-delay:0.5s;
              -moz-animation-delay:0.5s;
            }
          }
        }
        @keyframes load{
          0%,100%{
            height: 8px;
          }
          50%{
            height: 16px;
          }
        }
        .send {
          width: 58px;
          height: 78px;
          position: absolute;
          top: 25%;
          right: 0;
          text-align: center;
          i {
            display: inline-block;
            background: url('../../../../static/images/homework/send.png');
            background-size: 58px 58px;
            width: 58px;
            height: 58px;
            border-radius: 50%;
          }
          span {
            font-size: 12px;
            color: #C3D0D8;
          }
        }
      }
    }
  }
}
</style>
