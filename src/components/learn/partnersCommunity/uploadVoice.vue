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
                  <span>{{toParseTime(curTime)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="close" @click="closeBox()"></div>
      </div>
    </div>
    <div class="success-audio" v-show="successVoice">
      <div class="succes-content">
        <textarea id="textarea"
              autocomplete="off"
              v-model="content"
              placeholder="说点什么吧~~">
        </textarea>
        <div class="audio-play-box" @click="playRecordVoice()">
          <!-- <audio id="record-sound" :src="qiniuUrl"></audio> -->
          <i class="note-line">
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
          </i>
          <span class="hour">{{toParseTime(curTime)}}</span></div>
      </div>
      <div class="publish" @click="publish()">
        <span>发布</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import bus from '../../../bus'
import Cookie from '../../../tool/cookie.js'
import Recorder from '../../../plugins/recorder'
import SoundCtrl from '../../../plugins/soundCtrl'

export default {
  props: ['type', 'uploadVoiceShow'],
  data () {
    return {
      loadding: false,
      successVoice: false,
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
      sndctr: SoundCtrl,
      isPlay: false,
      isEnd: false,
      content: '',
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
      FileQiniuToken: state => state.FileQiniuToken, // 七牛的token
      dynamicsLists: state => state.course.dynamicsLists // 动态首页列表和打赏列表数据
    })
  },
  methods: {
    ...mapActions({
      getDynamic: 'course/getDynamic', // 发布动态接口
      getUploadFileToken: 'getUploadFileToken' // 上传七牛
    }),
    ...mapMutations({
      updateFileQiniuToken: 'updateFileQiniuToken' // 更新上传七牛token
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
    // 播放录音
    startMySound () {
      this.active = !this.active
      if (this.active) {
        let audio = Recorder.audio
        console.log('audio', audio)
        Recorder.playRecording()
        audio.addEventListener('ended', () => {
          this.active = false
        })
      } else {
        Recorder.stopRecordSoud()
      }
    },
    playRecordVoice () {
      this.loadding = !this.loadding
      if (this.loadding) {
        let audio = Recorder.audio
        console.log('audio', audio)
        Recorder.playRecording()
        audio.addEventListener('ended', () => {
          this.loadding = false
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
      this.curTime = 0
      this.startRecording()
    },
    send () {
      let _this = this
      _this.uploadVoiceShow = false
      _this.successVoice = true
      let time = Math.round(_this.durationTime)
      console.log('time', time)
      // 上传七牛
      _this.getUploadFileToken().then((res) => {
        _this.updateFileQiniuToken(res)
        console.log('res', res)
        let date = new Date()
        let d = date.format('yyyy/MM/dd')
        let userId = Cookie.getCookie('user_id')
        let time = date.getTime()
        let fileImgKey = 'feed/sound/' + d + '/' + userId + '/' + time + '.wav'
        Recorder.uploadQiniuVoice(_this.FileQiniuToken, fileImgKey).then(data => {
          console.log('data', data)
          _this.qiniuUrl = data.key
        })
        console.log('qiniuUrl', _this.qiniuUrl)
      })
    },
    end () {
      this.isPlay = false
      this.isEnd = true
      clearInterval(this.intervalId_draw)
    },
    // 点击上传语音
    publish () {
      // 请求后端接口
      let params = {}
      if (this.content !== '') {
        params = {
          content: this.content,
          sound_url: this.qiniuUrl,
          sound_time: this.curTime
        }
      } else {
        params = {
          sound_url: this.qiniuUrl,
          sound_time: this.curTime
        }
      }
      this.getDynamic(params).then(res => {
        console.log('发布动态返回数据', res)
        this.dynamicsLists.unshift(res.feedInfo)
        this.successVoice = false
        // 4.jpg:1 GET https://uploadfile1.talkmate.com/feed/image/2019/01/12/1547272054727/5b74e4432152c797519a092a/1547272054776/4.jpg 404
      })
    },
    // 点击差号关闭弹框
    closeBox () {
      this.recordStop()
      clearInterval(this.intervalId_draw)
      this.defaultShow = true
      this.lastRecordShow = false
      this.startRecordShow = false
      this.animat = false
      this.curTime = 0
      this.$emit('uploadVoiceHidden', false)
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
    position:relative;
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
    .close {
      cursor: pointer;
      position: absolute;
      top: -40px;
      right: -26px;
      width: 30px;
      height: 30px;
      background: url('../../../../static/images/headline/close.png') no-repeat center;
      background-size: cover;
    }
  }
}
.success-audio {
  .publish{
    cursor: pointer;
    position: absolute;
    bottom: 6px;
    right: 0;
    margin-top: 7px;
    display: inline-block;
    span {
      font-size:14px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(255,255,255,1);
      padding: 6px 31px;
      background-color: #7ED321;
      border-radius: 18px;
    }
  }
  .succes-content {
    #textarea {
      padding: 0 3px;
      width: 100%;
      height: 64px;
      background:rgba(246,248,249,1);
      border-radius:3px;
      border:1px dashed rgba(216,227,233,1);
    }
    .audio-play-box {
      margin-top: 20px;
      cursor: pointer;
      width: 266px;
      height: 36px;
      background: #2A9FE4;
      border-radius: 5px;
      position: relative;
      left: 0;
      top: 0;
      i {
        display: flex;
        // width: 70px;
        height: 32px;
        padding: 0 6px;
        margin: 0 auto;
        align-items: center;
        font-style: normal;
        // margin-right: 200px;
      }
      i span {
        display: inline-block;
        width: 4px;
        height: 8px;
        border-radius: 127px;
        margin-right: 4px;
        background: #ffffff;
        // -webkit-animation: load 1s ease infinite;
        // animation-play-state: paused;
        &.loadding {
          -webkit-animation: loadding 1s ease infinite;
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
      .hour {
        font-size: 13px;
        color: #ffffff;
        position: absolute;
        right: 0;
        top: 6px;
        right: 6px;
      }
    }
    @keyframes loadding{
      0%,100%{
        height: 8px;
      }
      50%{
        height: 16px;
      }
    }
  }
}
</style>
