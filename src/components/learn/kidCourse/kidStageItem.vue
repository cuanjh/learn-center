<template>
  <div class="swiper-slide" :id="item.code">
    <div class="slide-content">
      <div class="draw-img">
        <img class="img-box" v-if="type == 'draw'" :src="item.image | urlFix('imageView2/0/w/2000/h/900/format/jpg')" alt="" @click="playMother('mother-sound'+index, $event)">
        <img class="img-box" v-else :src="item.image | urlFix('imageView2/0/w/858/h/618/format/jpg')" alt="" @click="playMother('mother-sound'+index, $event)">
        <audio preload="load" class="mother-sound" :id="'mother-sound'+index" :src="item.sound"></audio>
      </div>
      <div class="draw-desc">
        <div class="no-record">
          <div class="text"><i :class="'trumpet trumpet' + index" @click="playMother('mother-sound'+index)"></i><p :data-content="item.content || item.word" v-html="formatContent"></p></div>
          <div class="start-button" @click.stop.prevent="startRecord('mother-sound'+index)">
            <i class="start-img" :class="{'showStart': showStart}" v-if="!isRecord"></i>
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
              <div class="record-saveVoice-button" @click.stop.prevent="saveVoice(item)" :disabled="isDisable">
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
import _ from 'lodash'
import bus from '../../../bus'
import Recorder from '../../../plugins/recorder'
import Cookie from '../../../tool/cookie.js'
export default {
  props: ['item', 'index', 'type', 'chapterCode'],
  data () {
    return {
      showTipsStop: 1,
      showTipSave: 1,
      isDisable: false,
      // showTipsStop: true, // 显示停止路由提示
      showRecordingImg: false,
      showStart: false,
      heightHide: false,
      animat: false,
      recording: false,
      playing: false,
      isRecord: false,
      recordActivity: false, // 录音是否激活
      qiniuUrl: '',
      contentArr: []
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
    })
    bus.$on('yuyinSet', (text) => {
      $('.swiper-slide-active').find('.text p span').removeClass('right')
      $('.swiper-slide-active').find('.text p span').removeClass('wrong')
      let content = $('.swiper-slide-active').find('.text p').data('content')
      let arr1 = content.toLowerCase()
        .replace(new RegExp(/\?/, 'g'), ' ')
        .replace(new RegExp(',', 'g'), ' ')
        .replace(new RegExp(/\./, 'g'), ' ')
        .replace(new RegExp('-', 'g'), ' ')
        .replace(new RegExp('!', 'g'), ' ')
        .replace(new RegExp('“', 'g'), ' ')
        .replace(new RegExp('”', 'g'), ' ')
        .replace(new RegExp('"', 'g'), ' ')
        .replace(new RegExp(':', 'g'), ' ')
        .trim(' ').split(' ')
      let contentArr = []
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].trim().length > 0) {
          contentArr.push(arr1[i].replace(new RegExp('—', 'g'), '').trim())
        }
      }
      console.log('content', contentArr)
      let arr = text.toLowerCase().replace(new RegExp(/\?/, 'g'), ' ').replace(new RegExp(',', 'g'), ' ').replace(new RegExp(/\./, 'g'), ' ').replace(new RegExp('\'', 'g'), '’').split(' ')
      let result = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].trim().length > 0) {
          result.push(arr[i].trim())
        }
      }
      for (let j = 0; j < result.length; j++) {
        if (result[j] === contentArr[j]) {
          $('.swiper-slide-active').find('.text p span:nth-child(' + (j + 1) + ')').addClass('right')
        } else {
          $('.swiper-slide-active').find('.text p span:nth-child(' + (j + 1) + ')').addClass('wrong')
        }
      }
      console.log(result)
    })
  },
  mounted () {
    // 初始化
    Recorder.init({inputSampleRate: 50400, sampleRate: 16000})
  },
  computed: {
    ...mapState({
      speakwork: state => state.learn.speakwork,
      canRecord: state => state.learn.canRecord,
      FileQiniuToken: state => state.FileQiniuToken, // 七牛的token
      xfLang: state => state.xfLang
    }),
    formatContent () {
      let content = this.item.content || this.item.word
      if (!content) {
        return ''
      }
      let result = ''
      let arr = content.replace(new RegExp('\\n', 'g'), '<br/>').split(' ')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].trim().length > 0) {
          if (arr[i].indexOf('<br/>') > -1) {
            let r = arr[i].split('<br/>')
            for (let l = 0; l < r.length; l++) {
              if (r[l].trim().length > 0) {
                let tag = ''
                if (l === 0) {
                  tag = '<br/>'
                }
                result += '<span> ' + r[l].trim() + ' </span>' + tag
              }
            }
          } else if (arr[i].indexOf('?') > -1) {
            let r = arr[i].split('?')
            for (let j = 0; j < r.length; j++) {
              if (r[j].trim().length > 0) {
                let tag = ''
                if (j === 0) {
                  tag = '?'
                }
                result += '<span> ' + r[j].trim() + tag + ' </span>'
              }
            }
          } else if (arr[i].indexOf('”') > -1) {
            let r = arr[i].split('”')
            for (let k = 0; k < r.length; k++) {
              if (r[k].trim().length > 0) {
                let tag = ''
                if (k === 0) {
                  tag = '”'
                }
                result += '<span> ' + r[k].trim() + tag + ' </span>'
              }
            }
          } else {
            if (arr[i].trim() === '—') {
              result += arr[i].trim()
            } else {
              result += '<span> ' + arr[i].trim() + ' </span>'
            }
          }
        }
      }
      return result
    }
  },
  methods: {
    ...mapActions([
      'getUploadFileToken', // 上传七牛
      'getKidRecordSave',
      'xfISE' // 讯飞语音评测
    ]),
    ...mapMutations({
      updateFileQiniuToken: 'updateFileQiniuToken', // 更新上传七牛token
      updateSpeakWork: 'learn/updateSpeakWork'
    }),
    // 点击开始录音
    startRecord (e) {
      $('.trumpet').removeClass('trumpetPlaying')
      let stop = JSON.parse(localStorage.getItem('recordTipStop'))
      if (stop) {
        this.showTipsStop = stop
      } else {
        this.showTipsStop = 1
      }
      // 如果正在录音则停止录音
      if (this.recording) {
        this.recordStop()
        return
      }
      // 判断是否在录音
      // if (!this.checkRecording()) {
      //   alert('对不起：无法打开麦克风！')
      //   this.isRecord = false
      //   this.recording = false
      //   return false
      // }
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
      $('.img-box').css('pointer-events', 'none')
    },
    // 点击停止录音
    recordStop () {
      let save = JSON.parse(localStorage.getItem('recordTipSave'))
      if (save) {
        this.showTipSave = save
      } else {
        this.showTipSave = 1
      }
      Recorder.stopRecording()
      this.recording = false
      this.playing = true
      this.recordActivity = false
      this.showRecordingImg = false
      JSON.stringify(localStorage.setItem('recordTipStop', 2))
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
        Recorder.playRecording()
        this.animat = false
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
    // 点击保存录音上传七牛云
    saveVoice (card) {
      $('.img-box').removeAttr('style', 'pointer-events')
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      let code = card.code
      let content = card.content ? card.content : card.word
      console.log('code,content', code, content)
      let animatDiv = $('#animatButton')
      let offset = animatDiv.offset()
      let obj = {
        left: offset.left,
        top: offset.top
      }
      // this.$emit('updateTipSave')
      JSON.stringify(localStorage.setItem('recordTipSave', 2))
      let _this = this
      // 上传七牛
      _this.getUploadFileToken().then(res => {
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
          let url = process.env.QINIU_DOMAIN + _this.qiniuUrl
          // 讯飞语音测评服务
          _this.xfISE({language: _this.xfLang[_this.chapterCode.split('-')[0]], text: content, url: url}).then(res => {
            console.log(res)
            if (res.code === '0' && res.data.read_sentence.rec_paper.read_chapter.except_info === '0') {
              let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
              if (!xfISEResult) {
                xfISEResult = {}
              }
              let id = this.chapterCode + '-' + this.item.code
              _.set(xfISEResult, id, res.data.read_sentence.rec_paper.read_chapter.sentence)
              localStorage.setItem('xfISEResult', JSON.stringify(xfISEResult))
            }
          })
          console.log('qiniuUrl', _this.qiniuUrl)
          let courseCode = this.chapterCode.split('-').slice(0, 2).join('-')
          if (_this.qiniuUrl) {
            // 请求后端接口
            let params = {
              sound_url: this.qiniuUrl,
              sound_time: time,
              course_code: courseCode,
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
      $('.img-box').removeAttr('style', 'pointer-events')
      this.heightHide = true
      this.playing = false
      this.animat = false
      this.recording = false
      this.showRecordingImg = false
      Recorder.stopRecording()
      setTimeout(() => {
        this.isRecord = false
        this.heightHide = false
        this.showStart = true
      }, 500)
      this.showStart = false
    },
    // 点击图片播放母语音频
    playMother (id, ev) {
      console.log(id, ev)
      let audio = $('#' + id)[0]
      // audio.play()
      // $('.trumpet' + this.index).addClass('trumpetPlaying')
      // audio.addEventListener('ended', () => {
      //   $('.trumpet' + this.index).removeClass('trumpetPlaying')
      // })
      if (ev) {
        $(ev.target).addClass('scale')
        setTimeout(() => {
          $(ev.target).removeClass('scale')
        }, 100)
      }
      audio.currentTime = 0
      audio.play()
      $('.trumpet' + this.index).addClass('trumpetPlaying')
      // 点击先暂停再播放
      // if (audio.paused) {
      //   audio.play()
      //   $('.trumpet' + this.index).addClass('trumpetPlaying')
      // } else {
      //   audio.pause()
      //   audio.currentTime = 0
      //   $('.trumpet' + this.index).removeClass('trumpetPlaying')
      // }
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
  // padding-bottom: 20px;
  overflow: hidden;
  .draw-img {
    width: 100%!important;
    height: 70%!important;
    border-radius: 4px 4px 0 0;
    .img-box {
      width: 100%;
      height: 100%!important;
      border-radius: 4px 4px 0 0;
      transition: all 0.1s;
      -ms-transition: all 0.1s;
      &.scale {
        transform: scale(1.03);
        -ms-transform: scale(1.03);
      }
      object-fit: cover;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .draw-desc {
    position: relative;
    height: 30%;
    background: #fff;
    .text {
      position: relative;
      font-size:16px;
      font-weight:500;
      font-family:PingFangSC;
      color:rgba(60,91,111,1);
      line-height:20px;
      padding: 12px 50px 0px 38px;
    }
    .no-record {
      position: relative;
      height: 100%;
      .trumpet {
        background: url('../../../../static/images/learnSystem/trumpet_grey.png') no-repeat center;
        background-size: cover;
        width: 18px;
        height: 16px;
        cursor: pointer;
        &.trumpetPlaying {
          background: url('../../../../static/images/learnSystem/trumpet_grey.gif') no-repeat center;
          background-size: cover;
        }
      }
      .start-button {
        position: absolute;
        right: 16px;
        bottom: 15%;
        height: 50px;
        text-align: right;
        // padding: 0 30px;
        cursor: pointer;
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
      height: 180%;
      border-radius: 4px 4px 0 0;
      display: flex;
      flex-direction: column;
      animation: heightShow .5s ease-in-out;
      .text-small {
        font-size: 14px;
        padding: 10px 0;
        line-height: 18px;
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
          transform: translate(-50%, -10%);
          .tip {
            width: 118px;
            height: 70px;
            position: absolute;
            top: -112px;
            left: -33px;
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
            width: 52px;
            height: 52px;
            text-align: center;
            position: relative;
            cursor: pointer;
            .recording-img {
              display: inline-block;
              width: 52px;
              height: 52px;
              background: url('../../../../static/images/kidcontent/icon-record.png') no-repeat center;
              background-size: cover;
              cursor: pointer;
            }
            .circle {
              position: absolute;
              top: 0px;
              left: -4px;
              right: 0;
              bottom: 0;
              margin: auto;
              width: 60px;
              height: 60px;
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
            width: 60px;
            height: 60px;
            background: #FFCE00;
            border-radius: 50%;
            position: relative;
            z-index: 10;
            i {
              display: flex;
              justify-content: space-around;
              align-items: center;
              width: 60px;
              height: 60px;
              padding: 0 10px;
              margin: 0 auto;
              box-sizing: border-box;
              &.loading {
                opacity: 1;
              }
              span {
                display: inline-block;
                width: 3px;
                height: 18px;
                border-radius: 4px;
                background-color: #fff;
              }
              span:nth-child(2){
                height: 26px;
              }
              span:nth-child(3){
                height: 36px;
              }
              span:nth-child(4){
                height: 26px;
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
                height: 36px;
              }
              50%{
                height: 30px;
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
                height: 26px;
              }
              50%{
                height: 20px;
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
                height: 18px;
              }
              50%{
                height: 12px;
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
        animation:  heightHide 1s ease-in-out;
      }
    }
  }
}
.draw {
  .swiper-slide {
    .draw-img {
      width: 100%!important;
      height: 60%!important;
    }
  }
  .swiper-slide .draw-desc .no-record .start-button {
    bottom: -5%!important;
  }
}
@keyframes heightShow {
  0% {
    height: 100%;
  }
  100% {
    height: 180%;
  }
}
@keyframes heightHide {
  0% {
    opacity: 1;
    height: 180%;
  }
  50% {
    opacity: 1;
    height: 100%;
  }
  100% {
    opacity: 1;
    height: 90%;
  }
}

@keyframes leftClearR {
   from {
    -webkit-transform: translate(0px, 0);
    transform: translate(0px, 0);
  }
  to {
    -webkit-transform: translate(-90px, 0);
    transform: translate(-90px, 0);
  }
}
@keyframes rightSaveR {
  from {
    -webkit-transform: translate(0px, 0);
    transform: translate(0px, 0);
  }
  to {
    -webkit-transform: translate(90px, 0);
    transform: translate(90px, 0);
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
    transform:scale(1.2);
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
