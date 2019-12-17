<template>
  <div class="ise-area">
    <div class="play" :class="{'loading': isPlayAudio}" :style="{transform: 'translateX('+ translateX +'px)'}" @click="playRecord">
      <span v-for="n in 5" :key="n"></span>
    </div>
    <div class="record">
      <div class="micro-phone" @click="recordOpt"></div>
      <div class="circle circle1" v-show="isRecording"></div>
      <div class="circle circle2" v-show="isRecording"></div>
      <transition name="fade" mode="out-in">
        <div class="tip" v-show="isShowStopTip && isRecording"></div>
      </transition>
    </div>
    <div
      class="user"
      @mouseenter="isShowUserTip = true"
      @mouseleave="isShowUserTip = false"
      :style="{transform: 'translateX(-'+ translateX +'px)'}" >
      <img :src="photo" alt="" @click="goWordListBox()">
      <div class="user-img-circle circle1" v-if="!isVip && showCircle !== '1'"></div>
      <div class="user-img-circle circle2" v-if="!isVip && showCircle !== '1'"></div>
      <div :class="['mask', scoreClass]" v-show="score && isVip" @click="goWordListBox()">
        <span>{{ score }}</span>
      </div>
      <transition name="fade" mode="out-in">
        <a href="javascript:;" class="icon-vip-tip" v-if="!isVip && translateX === 0 && isShowUserTip">
          <span>VIP专属智能评分</span>
        </a>
      </transition>
      <!-- 评分中。。。。 -->
      <div class="reviewing-tip" v-show="isShowScoring && isVip && translateX === 0">
        <p>评</p>
        <p>分</p>
        <p>中</p>
        <p>.</p>
        <p>&nbsp;.&nbsp;</p>
        <p>.</p>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapState } from 'vuex'
import bus from '../../../../bus'

export default {
  props: ['formCode'],
  data () {
    return {
      isShowScoring: false,
      repeatRecord: false,
      isRecording: false,
      isShowStopTip: false,
      isShowUserTip: false,
      isPlaying: false,
      isPlayAudio: false,
      translateX: 116,
      timerInterval: null,
      timeCount: 1,
      score: '',
      scoreClass: '',
      showCircle: ''
    }
  },
  created () {
    bus.$on('localShowCircle', (data) => {
      this.showCircle = data
    })
  },
  mounted () {
    this.showCircle = localStorage.getItem('showCircle')
  },
  computed: {
    ...mapState({
      kidRecordList: state => state.kidRecordList,
      isCanRecord: state => state.isCanRecord,
      xfSpeechType: state => state.xfSpeechType,
      userInfo: state => state.userInfo,
      isVip: state => state.isVip
    }),
    isHaveRecord () {
      let order = this.formCode.split('-').pop()
      let index = this.kidRecordList.findIndex(item => {
        return item.list_order + '' === order
      })
      if (index !== -1) {
        return true
      }
      return false
    },
    isEvaluated () {
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      if (!xfISEResult) {
        return false
      }
      let findIndex = xfISEResult.findIndex(item => {
        return item.form_code === this.formCode
      })
      if (findIndex === -1) {
        return false
      } else {
        return true
      }
    },
    photo () {
      let url = ''
      if (this.userInfo) {
        url = this.userInfo.photo
      }
      return url
    }
  },
  methods: {
    recordOpt () {
      console.log(this.repeatRecord)
      if (this.repeatRecord && !this.isRecording) return
      if (this.timeCount === 0) {
        let msg = '录音时间不能小于1秒哦！'
        bus.$emit('show-prompt', msg)
        this.reset()
        this.$parent.$emit('reset')
        return false
      }
      this.timeCount = 0
      setTimeout(() => {
        this.timeCount = 1
      }, 1000)
      this.repeatRecord = true
      if (!this.isCanRecord) {
        this.$parent.$emit('showTip')
        return false
      }
      this.isRecording = !this.isRecording
      let isShowStopTip = localStorage.getItem('isShowStopTip')
      if (isShowStopTip === '1') {
        this.isShowStopTip = false
      } else {
        this.isShowStopTip = true
        setTimeout(() => {
          this.isShowStopTip = false
          localStorage.setItem('isShowStopTip', 1)
        }, 2000)
      }

      if (this.isRecording) {
        this.translateX = 116
        this.$emit('startRecord')
      } else {
        this.$emit('stopRecord')
      }
    },
    stopRecord () {
      this.isRecording = false
      if (this.isRecording) {
        this.translateX = 116
      } else {
        this.translateX = 0
        this.isShowUserTip = true
        setTimeout(() => {
          this.isShowUserTip = false
        }, 3000)
      }
      // 判断是否需要语音测评
      this.$emit('startEvaluate')
      if (this.xfSpeechType === 'ise' && this.isVip) {
        this.isShowScoring = true
      }
    },
    evaluateFinished () {
      this.repeatRecord = false
    },
    playRecord () {
      this.isPlaying = !this.isPlaying
      this.$emit('playRecord', this.isPlaying)
    },
    recordPlaying () {
      this.isPlayAudio = true
    },
    reset () {
      this.timeCount = 1
      this.repeatRecord = false
      this.isRecording = false
      this.isPlaying = false
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
      }
    },
    resetPlay () {
      clearInterval(this.timerInterval)
      this.timerInterval = null
      this.isPlayAudio = false
      this.isPlaying = false
    },
    // 点击头像出现录音评测的弹框
    goWordListBox () {
      console.log('弹录录音的列表=>')
      this.showCircle = localStorage.getItem('showCircle')
      if (this.showCircle !== '1' && !this.isVip) {
        localStorage.setItem('showCircle', '1')
      }
      if (!this.isVip) {
        bus.$emit('showNoVipModal')
        return false
      }
      if (this.xfSpeechType === 'ise') {
        console.log(this.score)
        if (!this.score) {
          return false
        }
        this.$emit('goWordListBox')
      } else {
        let originSentence = $('.current-swiper .swiper-slide-active').find('.content p').html()
        let resultSentence = $('.current-swiper .swiper-slide-active').find('.result-out').text()
        bus.$emit('showIatSentenceBox', {originSentence, resultSentence})
      }
    },
    setScore (score) {
      console.log(score)
      this.score = Math.round(parseFloat(score))
      this.scoreClass = ''
      switch (true) {
        case score >= 80:
          this.scoreClass = 'perfect'
          break
        case score >= 60:
          this.scoreClass = 'good'
          break
        default:
          this.scoreClass = 'try'
          break
      }
      this.isShowScoring = false
    },
    noResultAlert () {
      this.isShowScoring = false
      this.repeatRecord = false
    }
  }
}
</script>

<style lang="less" scoped>
.ise-area {
  // position: absolute;
  // bottom: 30px;
  // left: 192px;
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
    height: 8px;
    border-radius: 2px;
    margin-left: 2px;
    margin-right: 2px;
  }
  span:nth-child(2){
    height: 14px;
  }
  span:nth-child(3){
    height: 20px;
  }
  span:nth-child(4){
    height: 14px;
  }
  &.loading {
    opacity: 1;
    span:nth-child(1), span:nth-child(5) {
      animation: load1 0.7s ease infinite;
      -webkit-animation: load1 0.7s ease infinite;
      -ms-animation: load1 0.7s ease infinite;
      -moz-animation: load1 0.7s ease infinite;
      -o-animation: load1 0.7s ease infinite;
    }
    span:nth-child(2), span:nth-child(4) {
      animation: load2 0.7s ease infinite;
      -webkit-animation: load2 0.7s ease infinite;
      -ms-animation: load2 0.7s ease infinite;
      -moz-animation: load2 0.7s ease infinite;
      -o-animation: load2 0.7s ease infinite;
    }
    span:nth-child(3) {
      animation: load3 0.7s ease infinite;
      -webkit-animation: load3 0.7s ease infinite;
      -ms-animation: load3 0.7s ease infinite;
      -moz-animation: load3 0.7s ease infinite;
      -o-animation: load3 0.7s ease infinite;
    }
  }
}
@keyframes load3 {
  0%, 100%{
    height: 26px;
  }
  50%{
    height: 20px;
  }
}
@keyframes load2 {
  0%, 100%{
    height: 20px;
  }
  50%{
    height: 14px;
  }
}
@keyframes load1 {
  0%, 100%{
    height: 8px;
  }
  50%{
    height: 14px;
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

.user {
  position: relative;
  cursor: pointer;
  z-index: 1;
  transition: transform .5s ease-in;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
  .user-img-circle {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 50px;
    height: 50px;
    z-index: -1;
    background:rgba(245,166,35,.09);
    border-radius: 50%;
    animation: aniUser 2s linear infinite;
    &.circle2 {
      animation-delay: 1s;
    }
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background:rgba(151,151,151, .5);
    border-radius: 50%;
    top: 0;
    text-align: center;
    span {
      line-height: 50px;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      font-family: 'DIN-BlackItalic,DIN';
      text-shadow:0px 1px 3px rgba(0,0,0,0.6);
    }
  }
  .perfect {
    // border: 2px solid #20C03B;
    background: rgba(74, 214, 96, .9);
  }
  .good {
    // border: 2px solid #515151;
    background: rgba(119, 119, 134,.9);
  }
  .try {
    // border: 2px solid #FF685F;
    background: rgba(255, 91, 91, .9);
  }
  .icon-vip-tip {
    position: absolute;
    top: -84px;
    left: -16px;
    display: inline-block;
    width: 82px;
    height: 76px;
    background: url('../../../../../static/images/kid/icon-vip-tip.png') no-repeat center;
    background-size: cover;
    text-align: center;
    span {
      display: inline-block;
      width: 100%;
      padding: 24px 14px;
      font-size:13px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(255,255,255,1);
      line-height:18px;
    }
  }
  .reviewing-tip {
    display: flex;
    position: absolute;
    top: -40px;
    left: -12px;
    p {
      font-size: 20px;
      font-family: DFWaWaSC-W5,DFWaWaSC;
      font-weight: normal;
      color: #78c624;
      line-height: 28px;
      text-transform: uppercase;
      transform: scale(.5);
      -webkit-text-stroke: 1px gray;
      animation: hover linear 1s infinite;
      &:nth-child(1) {
        animation-delay:0s;
      }
      &:nth-child(2) {
        animation-delay:0.25s;
      }
      &:nth-child(3) {
        animation-delay:0.375s;
      }
      &:nth-child(4) {
        animation-delay:0.5s;
      }
      &:nth-child(5) {
        animation-delay:0.675s;
      }
      &:nth-child(6) {
        animation-delay:0.75s;
      }
    }
  }
}

@keyframes hover {
  0% {
    transform: scale(.5);
    color: gray;
    -webkit-text-stroke: 1px #78c624;
  }
  20% {
    transform: scale(1);
    color: #78c624;
    // -webkit-text-stroke: 3px gray;
    // filter: drop-shadow(0 0 1px #78c624)drop-shadow(0 0 1px gray)drop-shadow(0 0 3px #78c624)drop-shadow(0 0 5px gray)hue-rotate(10turn);
  }
  50% {
    transform: scale(.5);
    color: gray;
    -webkit-text-stroke: 1px #78c624;
  }
}

@keyframes aniUser {
 0% {
  transform: scale(1);
  opacity: 1;
  background:rgba(245,166,35,.8);
 }
 25% {
  transform: scale(1.2);
  opacity: 0.75;
  background:rgba(245,166,35,.74);
 }
 50% {
  transform: scale(1.4);
  opacity: 0.45;
  background:rgba(245,166,35,.25);
 }
 75% {
  transform: scale(1.65);
  opacity: 0.45;
  background:rgba(245,166,35,.1);
 }
 100% {
  transform: scale(1.85);
  opacity: 0;
  background:rgba(245,166,35,.04);
 }
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
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
