<template>
  <transition name="fade" mode="out-in">
    <div class="word-panel-container" v-show="isShow">
      <div class="word-panel" :style="{left: left + 'px', top: top + 'px'}">
        <div class="triangle_border_down">
          <span></span>
        </div>
        <div class="word">
          {{ word }}
          <i :class="{'playing': isPlaytts}" @click="read"></i>
        </div>
        <table class="syll-phone">
          <tr v-for="(phone, index) in phones" :key="index">
            <td>{{ '音节 [' + phone.content + ']' }}</td>
            <td>{{ phone.score >= 60 ? '读得真棒' : '继续加油' }}</td>
          </tr>
        </table>
        <div class="ise-area">
          <div class="play" :style="{transform: 'translateX('+ translateX +'px)'}" @click="playRecord">
            <span v-for="n in 5" :key="n" :style="{height: playLineHeight[n - 1] + 'px'}"></span>
          </div>
          <div class="record">
            <div class="micro-phone" @click="recordOpt"></div>
            <div class="circle circle1" v-show="isRecording"></div>
            <div class="circle circle2" v-show="isRecording"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import $ from 'jquery'
import IseArea from './iseArea.vue'
import Recorder from '../../../../plugins/recorder.js'
import TTS from '../../../../plugins/xf_tts'
import { PCM2WAV } from '../../../../plugins/pcm2wav'

export default {
  data () {
    return {
      isShow: false,
      left: 0,
      top: 0,
      word: '',
      syll: '',
      phones: [],
      isRecording: false,
      timerInterval: null,
      timerIntervalPlay: null,
      time: 0,
      playLineHeight: [8, 16, 24, 16, 8],
      isPlaying: false,
      isPlaytts: false,
      translateX: 116,
      ttsRecorder: null
    }
  },
  components: {
    IseArea
  },
  created () {
    this.$on('stopRecord', () => {
      this.$refs['ise'].stopRecord()
    })
  },
  mounted () {
    $('.word-panel-container').click((e) => {
      console.log($(e.target).offset())
      let clickLeft = $(e.target).offset().left
      let clickTop = $(e.target).offset().top
      let left = $('.word-panel').offset().left
      let top = $('.word-panel').offset().top
      let width = $('.word-panel').width()
      let height = $('.word-panel').height()
      if (clickLeft >= left - 5 && clickLeft <= left + width && clickTop > top - 5 && clickTop <= top + height) {
        this.isShow = true
      } else {
        this.hide()
      }
    })
    window.onresize = () => {
      this.isShow = false
    }
  },
  methods: {
    show (params) {
      console.log(params)
      this.left = params.offset.left - 70
      this.top = params.offset.top + 35
      this.word = params.word.word
      // this.phones = params.word.phonemes
      this.phones = params.word.syllInfos
      this.syll = params.word.phonetic_symbol
      this.isShow = true
    },
    hide () {
      this.isShow = false
      this.phones = []
      this.isRecording = false
      this.timerInterval = null
      this.timerIntervalPlay = null
      this.time = 0
      this.playLineHeight = [8, 16, 24, 16, 8]
      this.isPlaying = false
      this.translateX = 116
    },
    recordOpt () {
      this.isRecording = !this.isRecording
      if (this.isRecording) {
        this.startRecord()
      } else {
        this.stopRecord()
      }
    },
    startRecord () {
      this.timerInterval = setInterval(() => {
        this.time++
      }, 1000)
      Recorder.startRecording()
    },
    stopRecord () {
      clearInterval(this.timerInterval)
      this.time = 0
      Recorder.stopRecording()
      this.isRecording = false
      if (this.isRecording) {
        this.translateX = 116
      } else {
        this.translateX = 0
      }
    },
    playRecord (flag) {
      this.isPlaying = !this.isPlaying
      if (flag) {
        Recorder.playRecording((data) => {
          if (data) {
            this.resetPlay()
          } else {
            this.recordPlaying()
          }
        })
      } else {
        // 暂停播放
        Recorder.stopRecordSoud()
        this.resetPlay()
      }
    },
    resetPlay () {
      clearInterval(this.timerIntervalPlay)
      this.timerIntervalPlay = null
      this.playLineHeight = [8, 16, 24, 16, 8]
      this.isPlaying = false
    },
    recordPlaying () {
      if (this.timerIntervalPlay) return
      let n = 1
      this.timerIntervalPlay = setInterval(() => {
        if (n % 3 === 0) {
          this.playLineHeight = [6, 14, 22, 14, 6]
        } else if (n % 3 === 1) {
          this.playLineHeight = [8, 16, 24, 16, 8]
        } else if (n % 3 === 2) {
          this.playLineHeight = [10, 18, 26, 18, 10]
        }
        n++
      }, 300)
    },
    // 播放科大讯飞合成的语音
    read () {
      let word = this.word
      let ttsRecorder = new TTS.TtsRecorder({
        lang: 'en',
        text: word,
        onClose: (e) => {
          console.log('onClose')
        },
        onError: (data) => {
          alert('WebSocket连接失败')
        },
        onMessage: (e) => {
          let jsonData = JSON.parse(e.data)
          if (jsonData.data) {
            // atob ascii to binary
            let bstr = atob(jsonData.data.audio)
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
            }
            let pcm2wav = new PCM2WAV()
            pcm2wav.write(u8arr, (res) => {
              let data = pcm2wav.read()
              let blob = new Blob([data], {type: 'audio/wav'})
              let audio = new Audio()
              audio.src = URL.createObjectURL(blob)
              audio.oncanplay = () => {
                this.isPlaytts = true
                audio.play()
              }
              audio.onended = () => {
                this.isPlaytts = false
              }
            })
          }
        },
        onStart: () => {
          console.log('onStart')
        }
      })
      ttsRecorder.start()
    }
  }
}
</script>

<style lang="less" scoped>
.word-panel-container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .24);
  z-index: 1;
}
.word-panel {
  position: absolute;
  padding: 24px;
  width: 400px;
  background: #fff;
  border-radius: 6px;
  box-shadow:0px 0px 17px 0px rgba(0,0,0,0.1);
  z-index: 99999;
  .word {
    font-size: 20px;
    font-weight: 500;
    color: #000000;
    line-height: 28px;
    i {
      width: 20px;
      height: 17px;
      background-image: url('../../../../../static/images/kid/icon-laba.png');
      background-repeat: no-repeat;
      background-size: cover;
      display: inline-block;
      margin-top: 6px;
      margin-left: 6px;
      cursor: pointer;
    }
    .playing {
      background-image: url('../../../../../static/images/kid/icon-laba.gif');
    }
  }
  .syll-phone {
    tr {
      td {
        padding: 6px 6px 0 0;
        font-size: 14px;
        color: #5D717F;
        line-height: 20px;
        font-weight: 400;
      }
    }
  }
}

.triangle_border_down span{
  display:block;
  width:0;
  height:0;
  border-width:0px 10px 10px;
  border-style:solid;
  border-color:transparent transparent #fff;/*黄 透明 透明 */
  position:absolute;
  left: 84px;
  top: -9px;
}

.ise-area {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.play {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #FFCE00;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1;
  transition: transform .5s ease-in;
  cursor: pointer;
  span {
    background: #fff;
    width: 3px;
    border-radius: 2px;
    margin-left: 2px;
    margin-right: 2px;
  }
}

.record {
  z-index: 2;
  position: relative;
  .tip {
    position: absolute;
    width: 153px;
    height: 77px;
    background: url('../../../../../static/images/kidcontent/pic-record-stop.png');
    background-repeat: no-repeat;
    background-size: cover;
    top: -64px;
    left: 14px;
  }
}

.micro-phone {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: url('../../../../../static/images/kidcontent/icon-record.png');
  background-repeat: no-repeat;
  background-size: cover;
  margin-left: 54px;
  margin-right: 54px;
  z-index: 1;
  cursor: pointer;
}

.circle {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 80px;
  height: 80px;
  z-index: -1;
  border: 1px solid #89DA31;
  border-radius: 50%;
  &.circle1 {
    animation: circle-opacity 1s 0s ease-out infinite;
  }
  &.circle2 {
    animation: circle-opacity2 1s .5s ease-out infinite;
  }
}

// 录音动画
@keyframes circle-opacity {
  0% {
    border-color: #89DA31;
  }
  25% {
    transform:scale(1.2);
    border-color: rgba(156, 225, 82, .75);
  }
  50% {
    transform:scale(1.3);
    border-color: rgba(156, 225, 82, .5);
  }
  75% {
    transform:scale(1.4);
    border-color: rgba(156, 225, 82, .25);
  }
  100% {
    transform:scale(1.5);
    border-color: rgba(156, 225, 82, .15);
  }
}
@keyframes circle-opacity2 {
  0% {
    transform:scale(1.01);
    border-color: #89DA31;
  }
  30% {
    transform:scale(1.15);
    border-color: rgba(156, 225, 82, .75);
  }
  60% {
    transform:scale(1.25);
    border-color: rgba(156, 225, 82, .50);
  }
  100% {
    transform:scale(1.45);
    border-color: rgba(156, 225, 82, .25);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@media (max-width: 1300px){
  .word-panel-container {
    height: 120%;
  }
}
</style>
