<template>
  <div class="swiper-slide">
    <div class="slide-content">
      <div class="draw-img">
        <img class="img-box" :src="item.image" alt="" @click="playMother('mother-sound'+index)">
        <audio preload="load" class="mother-sound" :id="'mother-sound'+index" :src="item.sound"></audio>
      </div>
      <div class="draw-desc">
        <div class="no-record">
          <p class="text">{{item.content || item.word}}</p>
          <div class="start-button">
            <i class="start-img" :class="{'showStart': showStart}" @click.stop.prevent="startRecord('mother-sound'+index)" v-if="!isRecord"></i>
          </div>
        </div>
        <div class="record-content" :class="{'heightHide': heightHide}" v-show="isRecord">
          <p class="text text-small">
            <span>{{item.content || item.word}}</span>
            <i class="close-record" @click="closeRecord()"></i>
          </p>
          <div class="recording-body-buttons">
            <div class="recording-body-button">
              <div class="tip" v-if="recording&&showTipsStop == 1"><i class="tip-img"></i></div>
              <div class="recording-button" @click.stop.prevent="recordStop()">
                <i class="recording-img" v-if="showRecordingImg"></i>
                <i class="circle circle1" v-if="recording"></i>
                <i class="circle circle2" v-if="recording"></i>
              </div>
            </div>
            <div class="record-end-button" v-if="playing">
              <div class="record-clear-button" @click.stop.prevent="againRecord('mother-sound'+index)">
                <i></i>
              </div>
              <div id="animatButton" class="record-playVoice-button" @click.stop.prevent="startMySound()">
                <i :class="{'loading': animat}" >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </i>
              </div>
              <div class="record-saveVoice-button" @click.stop.prevent="saveVoice(item)">
                <i ></i>
                <i class="icon-save" v-if="showTipSave == 1"></i>
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
import $ from 'jquery'
import bus from '../../../bus'
import Recorder from '../../../plugins/recorder'
import Cookie from '../../../tool/cookie.js'

export default {
  props: ['item', 'index', 'type', 'courseCode', 'showTipsStop', 'showTipSave'],
  data () {
    return {
      // showTipsStop: true, // 显示停止路由提示
      showRecordingImg: false,
      showStart: false,
      heightHide: false,
      animat: false,
      recording: false,
      playing: false,
      isRecord: false,
      recordActivity: false, // 录音是否激活
      qiniuUrl: ''
    }
  },
  created () {
    this.$on('init', () => {
      this.init()
    })
    bus.$on('clearDate', (params) => {
      this.isRecord = params
      this.playing = params
      this.animat = params
      this.recording = params
      Recorder.stopRecording()
      bus.$off('record_setVolume')
    })
  },
  mounted () {
    // 初始化
    Recorder.init()
  },
  computed: {
    ...mapState({
      speakwork: state => state.learn.speakwork,
      canRecord: state => state.learn.canRecord,
      FileQiniuToken: state => state.FileQiniuToken // 七牛的token
    })
  },
  methods: {
    ...mapActions({
      getUploadFileToken: 'getUploadFileToken', // 上传七牛
      getKidRecordSave: 'getKidRecordSave'
    }),
    ...mapMutations({
      updateFileQiniuToken: 'updateFileQiniuToken', // 更新上传七牛token
      updateSpeakWork: 'learn/updateSpeakWork'
    }),
    // 点击开始录音
    startRecord (e) {
      // 如果正在录音则停止录音
      if (this.recording) {
        this.recordStop()
        return
      }
      // 判断是否在录音
      if (!this.checkRecording()) {
        alert('对不起：无法打开麦克风！')
        this.isRecord = false
        this.recording = false
        return false
      }
      this.isRecord = true
      setTimeout(() => {
        this.showRecordingImg = true
      }, 300)
      setTimeout(() => {
        this.recording = true
      }, 600)
      // 开始检测录音音量
      Recorder.startRecording()
      // let _this = this
      console.log('record start!!!!!')
      $('#' + e)[0].pause()
    },
    // 点击停止录音
    recordStop () {
      Recorder.stopRecording()
      bus.$off('record_setVolume')
      console.log('record stop!!!!!')
      this.recording = false
      this.playing = true
      this.recordActivity = false
      this.showRecordingImg = false
      this.$emit('updateTipStop')
      this.startMySound()
    },
    // 是否可以录音
    checkRecording () {
      this.updateSpeakWork(true)
      console.log('mic激活：', Recorder.isActivity(this.speakwork, this.canRecord))
      return Recorder.isActivity(this.speakwork, this.canRecord)
    },
    // 播放录音
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
    // 点击重新开始录音
    againRecord (e) {
      this.showRecordingImg = true
      this.playing = false
      this.startRecord(e)
    },
    // 点击保存录音上次七牛云
    async saveVoice (card) {
      console.log(card, this.courseCode)
      let code = card.code
      let content = card.content ? card.content : card.word
      console.log('code,content', code, content)
      let animatDiv = $('#animatButton')
      let offset = animatDiv.offset()
      let obj = {
        left: offset.left,
        top: offset.top
      }
      this.$emit('updateTipSave')
      let _this = this
      // 上传七牛
      await _this.getUploadFileToken().then(res => {
        _this.updateFileQiniuToken(res)
        console.log('Token', res)
        let date = new Date()
        let d = date.format('yyyy/MM/dd')
        let userId = Cookie.getCookie('user_id')
        let time = date.getTime()
        let fileAudioKey = 'feed/sound/' + d + '/' + userId + '/' + time + '.wav'
        Recorder.uploadQiniuVoice(_this.FileQiniuToken, fileAudioKey).then(data => {
          console.log('data', data)
          _this.qiniuUrl = data.key
          console.log('qiniuUrl', _this.qiniuUrl)
          if (_this.qiniuUrl) {
            // 请求后端接口
            let params = {
              sound_url: this.qiniuUrl,
              sound_time: time,
              course_code: this.courseCode,
              code: code,
              teacher_module: this.type
            }
            console.log(params)
            this.getKidRecordSave(params).then(res => {
              console.log('res', res)
              // 返回成功之后再处理 返回失败具体提示
              if (res.success) {
                console.log(obj)
                bus.$emit('animateRecord', obj)
                this.heightHide = true
                // this.isRecord = false
                this.playing = false
                this.animat = false
                Recorder.stopRecording()
                bus.$off('record_setVolume')
                this.$emit('initRecordState')
                setTimeout(() => {
                  this.isRecord = false
                  this.heightHide = false
                }, 500)
              }
            })
          }
        })
        console.log('qiniuUrl', this.qiniuUrl)
      })
    },
    closeRecord () {
      this.heightHide = true
      this.playing = false
      this.animat = false
      this.recording = false
      this.showRecordingImg = false
      Recorder.stopRecording()
      bus.$off('record_setVolume')
      setTimeout(() => {
        this.isRecord = false
        this.heightHide = false
        this.showStart = true
      }, 300)
      this.showStart = false
    },
    // 点击图片播放母语音频
    playMother (e) {
      console.log(e)
      $('#' + e)[0].play()
    }
  }
}
</script>
<style lang="less" scoped>
.slide-content {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  // width: 568px!important;
  width: 36%!important;
  height: 90%!important;
  border-radius:4px;
  background: #fff;
  padding-bottom: 20px;
  .draw-img {
    width: 100%!important;
    height: 70%!important;
    border-radius: 4px 4px 0 0;
    .img-box {
      width: 100%;
      height: 100%!important;
      border-radius: 4px 4px 0 0;
      object-fit: cover;
    }
  }
  .draw-desc {
    position: relative;
    .text {
      font-size:16px;
      font-weight:500;
      font-family:PingFangSC;
      color:rgba(60,91,111,1);
      line-height:22px;
      padding: 12px 50px 6px 18px;
    }
    .no-record {
      .start-button {
        height: 50px;
        text-align: right;
        padding: 0 30px;
        .start-img {
          cursor: pointer;
          display: inline-block;
          width: 50px;
          height: 50px;
          background: url('../../../../static/images/kidcontent/icon-record.png') no-repeat center;
          background-size: cover;
          &.showStart {
            animation:fadenum .3s;
          }
        }
      }
    }
    .record-content {
      position: absolute;
      bottom: 0;
      padding: 0 30px;
      background: #fff;
      width: 100%;
      height: 160%;
      border-radius: 4px 4px 0 0;
      display: flex;
      flex-direction: column;
      animation: heightShow .5s ease-in-out;
      .text-small {
        font-size: 14px;
        padding: 10px 0;
        line-height: 20px;
        position: relative;
        span {
          display: inline-block;
          max-width: 90%;
        }
      }
      .close-record {
        display: inline-block;
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('../../../../static/images/icon-cloce.png') no-repeat center;
        background-size: cover;
        position: absolute;
        right: -18px;
        top: 10px;
        z-index: 999;
      }
      .recording-body-buttons {
        position: relative;
        flex: 1;
        .recording-body-button {
          text-align: center;
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -16%);
          .tip {
            width: 118px;
            height: 70px;
            position: absolute;
            top: -124px;
            left: -28px;
            right: 0;
            bottom: 0;
            margin: auto;
            animation:  fadeUpDown 2s ease;
            .tip-img {
              display: inline-block;
              width: 118px;
              height: 70px;
              z-index: 2;
              background: url('../../../../static/images/kidcontent/pic-record-stop.png') no-repeat center;
              background-size: cover;
            }
          }
          .recording-button {
            display: inline-block;
            width: 62px;
            height: 62px;
            text-align: center;
            position: relative;
            cursor: pointer;
            .recording-img {
              display: inline-block;
              width: 62px;
              height: 62px;
              background: url('../../../../static/images/kidcontent/icon-record.png') no-repeat center;
              background-size: cover;
              cursor: pointer;
            }
            .circle {
              position: absolute;
              top: 0;
              left: -6px;
              right: 0;
              bottom: 0;
              margin: auto;
              width: 72px;
              height: 72px;
              &.circle1 {
                border: 1px solid #89DA31;
                border-radius: 50%;
                animation: circle-opacity 1s 0s ease-out infinite;
              }
              &.circle2 {
                border: 1px solid #89DA31;
                border-radius: 50%;
                animation: circle-opacity2 1s 1s ease-out infinite;
              }
            }
          }
        }
        .record-end-button {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 50%;
          transform: translate(0, -26%);
          position: relative;
          .record-clear-button {
            cursor: pointer;
            width: 50px;
            height: 50px;
            position: absolute;
            z-index: 1;
            animation: leftClearR .5s ease-in;
            animation-fill-mode: forwards;
            i {
              display: inline-block;
              width: 50px;
              height: 50px;
              background: url('../../../../static/images/kidcontent/icon-record.png') no-repeat center;
              background-size: cover;
            }
          }
          .record-playVoice-button {
            cursor: pointer;
            width: 70px;
            height: 70px;
            background: #FFCE00;
            border-radius: 50%;
            position: relative;
            z-index: 10;
            i {
              display: flex;
              justify-content: space-around;
              align-items: center;
              width: 70px;
              height: 70px;
              padding: 0 10px;
              margin: 0 auto;
              box-sizing: border-box;
              &.loading {
                opacity: 1;
              }
              span {
                display: inline-block;
                width: 4px;
                height: 20px;
                border-radius: 4px;
                background-color: #fff;
              }
              span:nth-child(2){
                height: 30px;
              }
              span:nth-child(3){
                height: 43px;
              }
              span:nth-child(4){
                height: 30px;
              }
            }
            i.loading span:nth-child(3) {
              animation: load3 0.7s ease infinite;
              -webkit-animation: load3 0.7s ease infinite;
              -ms-animation: load3 0.7s ease infinite;
              -moz-animation: load3 0.7s ease infinite;
              -o-animation: load3 0.7s ease infinite;
            }
            @keyframes load3 {
              0%, 100%{
                height: 43px;
              }
              50%{
                height: 37px;
              }
            }
            i.loading span:nth-child(2), i.loading span:nth-child(4) {
              animation: load2 0.7s ease infinite;
              -webkit-animation: load2 0.7s ease infinite;
              -ms-animation: load2 0.7s ease infinite;
              -moz-animation: load2 0.7s ease infinite;
              -o-animation: load2 0.7s ease infinite;
            }
            @keyframes load2 {
              0%, 100%{
                height: 30px;
              }
              50%{
                height: 24px;
              }
            }
            i.loading span:nth-child(1), i.loading span:nth-child(5) {
              animation: load1 0.7s ease infinite;
              -webkit-animation: load1 0.7s ease infinite;
              -ms-animation: load1 0.7s ease infinite;
              -moz-animation: load1 0.7s ease infinite;
              -o-animation: load1 0.7s ease infinite;
            }
            @keyframes load1 {
              0%, 100%{
                height: 20px;
              }
              50%{
                height: 14px;
              }
            }
          }
          .record-saveVoice-button {
            position: absolute;
            z-index: 1;
            cursor: pointer;
            width: 50px;
            height: 50px;
            animation: rightSaveR .5s ease-in;
            animation-fill-mode: forwards;
            i {
              display: inline-block;
              width: 50px;
              height: 50px;
              background: url('../../../../static/images/kidcontent/icon-record-send.png') no-repeat center;
              background-size: cover;
            }
            .icon-save {
              display: inline-block;
              width: 130px;
              height: 76px;
              background: url('../../../../static/images/kidcontent/pic-save-record.png') no-repeat center;
              background-size: cover;
              position: absolute;
              top: -66px;
              left: -40px;
              animation:  fadeUpDown 2s ease;
              animation-delay:.5s;
            }
          }
        }
      }
      &.heightHide {
        animation:  heightHide .5s ease;
      }
    }
  }
}
.draw {
  .swiper-slide {
    .draw-img {
      width: 100%!important;
      height: 64%!important;
    }
  }
}
@keyframes heightShow {
  0% {
    height: 100%;
  }
  100% {
    height: 160%;
  }
}
@keyframes heightHide {
  0% {
    opacity: 1;
    height: 160%;
  }
  100% {
    opacity: 1;
    height: 90%;
  }
}

@keyframes leftClearR {
   from {
    -webkit-transform: translate(0px, 0);
    transform: stranslate(0px, 0);
  }
  to {
    -webkit-transform: translate(-90px, 0);
    transform: stranslate(-90px, 0);
  }
}
@keyframes rightSaveR {
  from {
    -webkit-transform: translate(0px, 0);
    transform: stranslate(0px, 0);
  }
  to {
    -webkit-transform: translate(90px, 0);
    transform: stranslate(90px, 0);
  }
}
@keyframes fadenum {
  from {opacity:0;}
  to {opacity:1;}
}

 @keyframes fadeUpDown {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(0px, -10px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  75% {
    transform: translate(0px, -10px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

// 录音动画
@keyframes circle-opacity {
  0% {
    border-color: #89DA31;
  }
  30% {
    transform:scale(1.1);
    border-color: rgba(156, 225, 82, .79);
  }
  60% {
    transform:scale(1.15);
    border-color: rgba(156, 225, 82, .48);
  }
  100% {
    transform:scale(1.2);
    border-color: rgba(156, 225, 82, .28);
  }
}
@keyframes circle-opacity2 {
  0% {
    transform:scale(1.2);
    border-color: #89DA31;
  }
  30% {
    transform:scale(1.25);
    border-color: rgba(156, 225, 82, .79);
  }
  60% {
    transform:scale(1.3);
    border-color: rgba(156, 225, 82, .48);
  }
  100% {
    transform:scale(1.35);
    border-color: rgba(156, 225, 82, .28);
  }
}
.swiper-slide {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  transition: 300ms;
  transform: scale(0.6);
}
.swiper-slide-active,.swiper-slide-duplicate-active {
  transform: scale(1);
  box-shadow:0px 48px 37px -30px rgba(0,0,0,0.11);
}
.swiper-slide-prev .slide-content::after {
  position:absolute;
  left: 0;
  top:0;
  display: block;
  width:100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  content: attr(data-text);
  transition:all 1s ease;
  z-index: 2;
}
.swiper-slide-next .slide-content::after {
  position:absolute;
  left: 0;
  top:0;
  display: block;
  width:100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  content: attr(data-text);
  transition:all 1s ease;
  z-index: 2;
}
</style>
