<template>
  <div v-show="type === 'UploadType_voice'">
    <div class="upload-voice" v-show="uploadVoiceShow">
      <div class="voice-content">
        <div class="voice">
          <div class="title">
            <span>录制语言</span>
          </div>
          <div class="recording-content">
            <div class="recording-key">
              <div class="voice-record" v-show="defaultShow">
                <div class="content">
                  <div class="play-box-left">
                    <i class="line"></i>
                  </div>
                  <div class="audio-play">
                    <i class="line" @click="startRecording()"></i>
                  </div>
                  <div class="play-box-right">
                    <i class="line"></i>
                  </div>
                </div>
                <div class="time">
                  <span>00:</span>
                  <span>00</span>
                </div>
              </div>
              <div class="voice-record" v-show="startRecordShow">
                <div class="content">
                  <div class="audio-play-box">
                    <i class="note-line">
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                      <span :class="{'animat':animat}"></span>
                    </i>
                  </div>
                  <div class="success">
                    <div class="success-content" @click="successRecord()">
                      <p class="icon">
                        <i></i>
                        <span>完成</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="time">
                  <!-- <span>00:</span> -->
                  <span>{{toParseTime(this.curTime)}}</span>
                </div>
              </div>
              <div class="voice-record" v-show="lastRecordShow">
                <div class="content">
                  <div class="again-record" @click="againRecord()">
                    <i class="line"></i>
                    <span>重新录音</span>
                  </div>
                  <div class="record-play" @click="startMySound()">
                    <i class="line" :class="{'active': active}"></i>
                  </div>
                  <div class="send-record" @click="send()">
                    <i class="line"></i>
                    <span>上传</span>
                  </div>
                </div>
                <div class="time">
                  <!-- <span>00:</span> -->
                  <span>{{toParseTime(this.curTime)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import bus from '../../../bus'
import Recorder from '../../../plugins/recorder'

export default {
  props: ['type'],
  data () {
    return {
      uploadVoiceShow: true,
      animat: false,
      defaultShow: true, // 默认
      startRecordShow: false, // 开始录音
      lastRecordShow: false, // 录音结束
      active: false,
      timeoutId_record: null,
      recording: false, // 是否正在录音
      recordActivity: false, // 录音是否激活
      intervalId_draw: null,
      curTime: 0, // 开始时间
      durationTime: 0, // 持续的时间
      qiniuUrl: ''
    }
  },
  created () {
    this.$on('init', () => {
      this.init()
    })
  },
  mounted () {
    // 初始化
    Recorder.init()
  },
  computed: {
    ...mapState({
      canRecord: state => state.learn.canRecord,
      qiniuToken: state => state.learn.qiniuToken
    })
  },
  methods: {
    ...mapActions({
      getQiniuToken: 'learn/getQiniuToken',
      homeworkPub: 'course/homeworkPub'
    }),
    ...mapMutations({
      updateQiniuToken: 'learn/updateQiniuToken',
      updateSpeakWork: 'learn/updateSpeakWork'
    }),
    // 转时间的函数
    toParseTime (data) {
      let m = parseInt(data / 60)
      if (m < 10) {
        m = '0' + m
      }
      let s = Math.round(data % 60)
      if (s < 10) {
        s = '0' + s
      }
      return m + ':' + s
    },
    startRecording () {
      // 开始录音了
      // 判断是否在录音
      if (!this.checkRecording()) {
        alert('对不起：无法打开麦克风！')
        this.uploadVoiceShow = false // 弹框不显示
      }
      // 开始录音
      Recorder.startRecording()
      // 可以录音
      this.defaultShow = false // 默认隐藏
      this.startRecordShow = true // 录音的显示
      this.animat = true // 动画开始
      this.intervalId_draw = setInterval(() => {
        this.curTime++
        console.log('curTime', this.curTime)
      }, 1000)
    },
    // 是否可以录音
    checkRecording () {
      this.updateSpeakWork(true)
      console.log('mic激活：', Recorder.isActivity(this.speakwork, this.canRecord))
      return Recorder.isActivity(this.speakwork, this.canRecord)
    },
    // 停止录音
    recordStop () {
      Recorder.stopRecording()
      bus.$off('record_setVolume')
      console.log('record stop!!!!!')
      this.defaultShow = false // 默认隐藏
      this.startRecordShow = false // 录音的显示
      this.animat = false // 动画开始
      this.lastRecordShow = true
    },
    // 录完点击完成
    successRecord () {
      this.recordStop()
      clearInterval(this.intervalId_draw)
      console.log('curTime---', this.curTime)
      return false
    },
    // 播放录音 点击动画停止，播完停止动画
    startMySound () {
      this.active = !this.active
      if (this.active) {
        let audio = Recorder.audio
        Recorder.playRecording()
        audio.addEventListener('ended', () => {
          this.active = false
        })
      } else {
        Recorder.stopRecordSoud()
      }
    },
    againRecord () {
      this.defaultShow = false // 默认隐藏
      this.startRecordShow = true // 录音的显示
      this.animat = true // 动画开始
      this.lastRecordShow = false // 录完音
    },
    send () {
      this.uploadVoiceShow = false
      Recorder.getTime((duration) => {
        // 上传七牛
        this.getQiniuToken().then((res) => {
          this.updateQiniuToken(res)
          Recorder.uploadQiniu(Recorder.audiofile, 'UploadType_video', this.qiniuToken)
          this.qiniuUrl = Recorder.recorderUrl
          console.log('qiniuUrl', this.qiniuUrl)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.upload-voice {
  z-index: 10;
  width: 100%;
  height: 100%;
  position:fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.6);
  .voice-content {
    width: 500px;
    height: 300px;
    background: #ffffff;
    position:absolute;
    top: 50%;
    left: 50%;
    right: 0;
    bottom: 0;
    margin-left: -250px;
    margin-top: -150px;
    box-shadow:0px 5px 18px 0px rgba(0,0,0,0.2);
    border-radius:8px;
    .voice {
      width: 100%;
      .title {
        width: 100%;
        font-size:20px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(16,48,68,1);
        line-height:28px;
        text-align: center;
        padding-top: 48px;
      }
      .recording-content {
        width: 100%;
        .recording-key {
          width: 100%;
          .voice-record {
            width: 100%;
            margin-top: 60px;
            .content {
              position: relative;
              display: flex;
              width: 100%;
              height: 100%;
              padding: 0px 154px;
              justify-content: space-between;
              align-items: center;
              span {
                font-size:13px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(178,192,201,1);
              }
              .play-box-left {
                width: 38px;
                height: 52px;
                .line {
                  display: inline-block;
                  width: 38px;
                  height: 52px;
                  background: url('../../../../static/images/community/voice-left.svg') no-repeat center;
                  background-size: cover;
                }
              }
              .audio-play {
                cursor: pointer;
                width: 70px;
                height: 70px;
                .line {
                  display: inline-block;
                  width: 70px;
                  height: 70px;
                  background: url('../../../../static/images/community/voice.svg') no-repeat center;
                  background-size: cover;
                }
              }
              .play-box-right {
                width: 38px;
                height: 52px;
                .line {
                  display: inline-block;
                  width: 38px;
                  height: 52px;
                  background: url('../../../../static/images/community/voice-right.svg') no-repeat center;
                  background-size: cover;
                }
              }
              .audio-play-box {
                position: absolute;
                i {
                  display: flex;
                  width: 200px;
                  height: 74px;
                  padding: 0 16px;
                  margin: 0 auto;
                  justify-content: space-around;
                  align-items: center;
                  border-radius: 100%;
                  font-style: normal;
                }
                i span {
                  display: inline-block;
                  width: 3px;
                  height: 18px;
                  border-radius: 4px;
                  background: #2a9fe4;
                  // -webkit-animation: load 1s ease infinite;
                  // animation-play-state: paused;
                  &.animat {
                    -webkit-animation: load 1s ease infinite;
                  }
                  &:nth-child(1){
                    background: #B9FFF5FF;
                    animation-delay:0.2s;
                    -webkit-animation-delay:0.2s;
                    -ms-animation-delay:0.2s;
                    -o-animation-delay:0.2s;
                    -moz-animation-delay:0.2s;
                  }
                  &:nth-child(2){
                    background: rgb(136, 228, 235);
                    animation-delay:0.3s;
                    -webkit-animation-delay:0.3s;
                    -ms-animation-delay:0.3s;
                    -o-animation-delay:0.3s;
                    -moz-animation-delay:0.3s;
                  }
                  &:nth-child(3){
                    background: rgb(136, 227, 243);
                    height: 26px;
                  }
                  &:nth-child(4){
                    height: 26px;
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
                  &:nth-child(7){
                    animation-delay:0.2s;
                    -webkit-animation-delay:0.2s;
                    -ms-animation-delay:0.2s;
                    -o-animation-delay:0.2s;
                    -moz-animation-delay:0.2s;
                  }
                  &:nth-child(8){
                    animation-delay:0.3s;
                    -webkit-animation-delay:0.3s;
                    -ms-animation-delay:0.3s;
                    -o-animation-delay:0.3s;
                    -moz-animation-delay:0.3s;
                  }
                  &:nth-child(9){
                    height: 26px;
                  }
                  &:nth-child(10){
                    height: 26px;
                    animation-delay:0.1s;
                    -webkit-animation-delay:0.1s;
                    -ms-animation-delay:0.1s;
                    -o-animation-delay:0.1s;
                    -moz-animation-delay:0.1s;
                  }
                  &:nth-child(11){
                    animation-delay:0.4s;
                    -webkit-animation-delay:0.4s;
                    -ms-animation-delay:0.4s;
                    -o-animation-delay:0.4s;
                    -moz-animation-delay:0.4s;
                  }
                  &:nth-child(12){
                    animation-delay:0.5s;
                    -webkit-animation-delay:0.5s;
                    -ms-animation-delay:0.5s;
                    -o-animation-delay:0.5s;
                    -moz-animation-delay:0.5s;
                  }
                  &:nth-child(13){
                    animation-delay:0.2s;
                    -webkit-animation-delay:0.2s;
                    -ms-animation-delay:0.2s;
                    -o-animation-delay:0.2s;
                    -moz-animation-delay:0.2s;
                  }
                  &:nth-child(14){
                    animation-delay:0.3s;
                    -webkit-animation-delay:0.3s;
                    -ms-animation-delay:0.3s;
                    -o-animation-delay:0.3s;
                    -moz-animation-delay:0.3s;
                  }
                  &:nth-child(15){
                    height: 26px;
                  }
                  &:nth-child(16){
                    height: 26px;
                    animation-delay:0.1s;
                    -webkit-animation-delay:0.1s;
                    -ms-animation-delay:0.1s;
                    -o-animation-delay:0.1s;
                    -moz-animation-delay:0.1s;
                  }
                  &:nth-child(17){
                    animation-delay:0.4s;
                    -webkit-animation-delay:0.4s;
                    -ms-animation-delay:0.4s;
                    -o-animation-delay:0.4s;
                    -moz-animation-delay:0.4s;
                  }
                  &:nth-child(18){
                    animation-delay:0.5s;
                    -webkit-animation-delay:0.5s;
                    -ms-animation-delay:0.5s;
                    -o-animation-delay:0.5s;
                    -moz-animation-delay:0.5s;
                  }
                  &:nth-child(19){
                    animation-delay:0.2s;
                    -webkit-animation-delay:0.2s;
                    -ms-animation-delay:0.2s;
                    -o-animation-delay:0.2s;
                    -moz-animation-delay:0.2s;
                  }
                  &:nth-child(20){
                    animation-delay:0.3s;
                    -webkit-animation-delay:0.3s;
                    -ms-animation-delay:0.3s;
                    -o-animation-delay:0.3s;
                    -moz-animation-delay:0.3s;
                  }
                  &:nth-child(21){
                    height: 26px;
                  }
                  &:nth-child(22){
                    background: rgb(136, 227, 243);
                    height: 26px;
                    animation-delay:0.1s;
                    -webkit-animation-delay:0.1s;
                    -ms-animation-delay:0.1s;
                    -o-animation-delay:0.1s;
                    -moz-animation-delay:0.1s;
                  }
                  &:nth-child(23){
                    background: rgb(136, 228, 235);
                    animation-delay:0.4s;
                    -webkit-animation-delay:0.4s;
                    -ms-animation-delay:0.4s;
                    -o-animation-delay:0.4s;
                    -moz-animation-delay:0.4s;
                  }
                  &:nth-child(24){
                    background: #B9FFF5FF;
                    animation-delay:0.5s;
                    -webkit-animation-delay:0.5s;
                    -ms-animation-delay:0.5s;
                    -o-animation-delay:0.5s;
                    -moz-animation-delay:0.5s;
                  }
                }
              }
              @keyframes load{
                0%{height:10px;}
                30%{height:20px;}
                60%{height:30px;}
                80%{height:20px;}
                100%{height:10px;}
              }
              .success {
                cursor: pointer;
                position: absolute;
                right: 100px;
                top: -25px;
                .success-content {
                  .icon {
                    display: flex;
                    flex-direction: column;
                  }
                  i {
                    display: inline-block;
                    width: 34px;
                    height: 34px;
                    background: url('../../../../static/images/community/success.svg') no-repeat center;
                    background-size: 100%;
                  }
                  span {
                    font-size:13px;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(178,192,201,1);
                  }
                }
              }
              .again-record {
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                i {
                  display: inline-block;
                  width: 34px;
                  height: 34px;
                  background: url('../../../../static/images/community/again.svg') no-repeat center;
                  background-size: 100%;
                  margin-bottom: 10px;
                }
              }
              .record-play {
                cursor: pointer;
                margin-top: -24px;
                i {
                  display: inline-block;
                  width: 70px;
                  height: 70px;
                  background: url('../../../../static/images/community/playVoice.svg') no-repeat center;
                  background-size: 100%;
                  margin-bottom: 10px;
                  &.active {
                    background: url('../../../../static/images/community/play.svg') no-repeat center;
                    background-size: 100%;
                  }
                }
              }
              .send-record {
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                i {
                  display: inline-block;
                  width: 34px;
                  height: 34px;
                  background: url('../../../../static/images/community/send.svg') no-repeat center;
                  background-size: 100%;
                  margin-bottom: 10px;
                }
              }
            }
            .time {
              width: 100%;
              text-align: center;
              margin-top: 30px;
              span {
                font-size:18px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(178,192,201,1);
              }
            }
          }
        }
      }
    }
  }
}
</style>
