<template>
  <div class="swiper-slide">
    <div class="slide-content">
      <div class="draw-img">
        <img class="img-box" :src="item.image" alt="" @click="playMother('mother-sound'+index)">
        <audio preload="load" class="mother-sound" :id="'mother-sound'+index" :src="item.sound"></audio>
      </div>
      <div class="draw-desc">
        <p class="text">{{item.content || item.word}}</p>
        <div class="record-content">
          <div class="start-button">
            <i class="start-img" @click.stop.prevent="startRecord('mother-sound'+index)" v-if="!isRecord"></i>
          </div>
          <div class="recording-body-buttons" v-show="isRecord">
            <div class="recording-body-button" v-if="recording">
              <div class="tip"><i class="tip-img"></i></div>
              <div class="recording-button" @click.stop.prevent="recordStop()">
                <i class="recording-img"></i>
                <i class="circle circle1" ></i>
                <i class="circle circle2" ></i>
              </div>
            </div>
            <div class="record-end-button" v-if="playing">
              <div class="record-clear-button" @click.stop.prevent="againRecord('mother-sound'+index)">
                <i></i>
              </div>
              <div class="record-playVoice-button" @click.stop.prevent="startMySound()">
                <i :class="{'loading': animat}">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </i>
              </div>
              <div class="record-saveVoice-button" @click.stop.prevent="saveVoice(item)">
                <i></i>
                <i class="icon-save"></i>
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

export default {
  props: ['item', 'index', 'type', 'courseCode'],
  data () {
    return {
      animat: false,
      recording: false,
      playing: false,
      isRecord: false,
      recordActivity: false // 录音是否激活
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
      qiniuToken: state => state.learn.qiniuToken
    })
  },
  methods: {
    ...mapActions({
      getQiniuToken: 'learn/getQiniuToken',
      getKidRecordSave: 'getKidRecordSave'
    }),
    ...mapMutations({
      updateQiniuToken: 'learn/updateQiniuToken',
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
      this.recording = true
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
      this.playing = false
      this.startRecord(e)
    },
    // 点击保存录音上次七牛云
    saveVoice (card) {
      console.log(card, this.courseCode)
      let code = card.code
      let content = card.content
      Recorder.getTime((duration) => {
        let time = Math.round(duration)
        // 上传七牛云
        this.getQiniuToken().then((res) => {
          this.updateQiniuToken(res)
          console.log('res======>', res)
          Recorder.uploadQiniu(this.qiniuToken, code, content)
          let recorderUrl = Recorder.recorderUrl
          // 请求后端接口
          let params = {
            sound_url: recorderUrl,
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
              this.isRecord = false
              this.playing = false
              this.animat = false
              Recorder.stopRecording()
              bus.$off('record_setVolume')
              this.$emit('initRecordState')
            }
          })
        })
      })
      this.recording = false
      this.updateSpeakWork(false)
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
.swiper-slide .slide-content {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  // width: 568px!important;
  width: 36%!important;
  // min-height: 358px!important;
  height: 21%!important;
  border-radius:4px;
  padding-bottom: 20px;
  background: #fff;
  .draw-img {
    // width: 568px;
    // width: 40%;
    // height: 217px;
    width: 100%;
    height: 13% !important;
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
      font-size:20px;
      font-weight:600;
      color:rgba(60,91,111,1);
      line-height:28px;
      padding: 22px 50px 0px 28px;
    }
    .record-content {
      padding: 0 30px;
      .start-button {
        height: 50px;
        text-align: right;
        right: 0;
        i {
          cursor: pointer;
          display: inline-block;
          width: 50px;
          height: 50px;
          background: url('../../../../static/images/kidcontent/icon-record.png') no-repeat center;
          background-size: cover;
        }
      }
      .recording-body-buttons {
        padding-bottom: 30px;
        .recording-body-button {
          text-align: center;
          position: relative;
          .tip {
            width: 118px;
            height: 70px;
            position: absolute;
            top: -116px;
            left: 0px;
            right: 0;
            bottom: 0;
            margin: auto;
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
          .record-clear-button {
            cursor: pointer;
            width: 50px;
            height: 50px;
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
            width: 76px;
            height: 76px;
            margin: 0 40px;
            background: #FFCE00;
            border-radius: 50%;
            i {
              display: flex;
              justify-content: space-around;
              align-items: center;
              width: 70px;
              height: 76px;
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
                height: 34px;
              }
              span:nth-child(3){
                height: 48px;
              }
              span:nth-child(4){
                height: 34px;
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
                height: 48px;
              }
              50%{
                height: 38px;
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
                height: 34px;
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
            position: relative;
            cursor: pointer;
            width: 50px;
            height: 50px;
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
            }
          }
        }
      }
    }
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

.swiper-slide-prev {
  transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -webkit-transition: all 0.5s;
  -webkit-transform: scale(0.7,0.7);
  -moz-transform: scale(0.7,0.7);
  transform: scale(0.7,0.7);
  -webkit-overflow-scrolling:touch;
  position: relative;
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
.swiper-slide-next {
  transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -webkit-transition: all 0.5s;
  -webkit-transform: scale(0.7,0.7);
  -moz-transform: scale(0.7,0.7);
  transform: scale(0.7,0.7);
  -webkit-overflow-scrolling:touch;
  position: relative;
  z-index: 1;
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
.swiper-slide-active {
  transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -webkit-transition: all 0.5s ease;
  -webkit-transform: scale(1,1);
  -moz-transform: scale(1,1);
  transform: scale(1,1);
  -webkit-overflow-scrolling:touch;
  box-shadow:0px 28px 20px -16px rgba(0,0,0,0.11);
}
</style>
