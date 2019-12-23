<template>
<transition name="fade" >
  <div class="score-result-box" v-show="isShowScoreResult">
    <div :class="['score-result-content', scoreClass]" :style="{backgroundImage: 'url('+ gifUrl +')'}">
      <span class="score" id="AnimatScore" >{{ score }}</span>
    </div>
    <audio id="myYeah" src="../../../../../static/sounds/yeah.mp3"></audio>
    <audio id="good" src="../../../../../static/sounds/good.mp3"></audio>
    <audio id="perfect" src="../../../../../static/sounds/perfect.mp3"></audio>
    <audio id="niceTry" src="../../../../../static/sounds/nice_try.mp3"></audio>
    <audio id="tryAgain" src="../../../../../static/sounds/try_again.mp3"></audio>
    <audio id="noRecord" src="../../../../../static/sounds/no_record.mp3"></audio>
  </div>
</transition>
</template>

<script>
import bus from '../../../../bus'
import $ from 'jquery'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      score: '',
      scoreClass: '',
      gifUrl: '',
      isShowScoreResult: false
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      isVip: state => state.isVip,
      xfSpeechType: state => state.xfSpeechType
    })
  },
  methods: {
    setScoreResult (score) {
      console.log('评分===》', score)
      if (!isNaN(score)) {
        this.score = Math.round(score)
      }
      this.scoreClass = ''
      let audioId = ''
      switch (true) {
        case score >= 80:
          this.scoreClass = 'perfect'
          this.gifUrl = '../../../../../static/sounds/pic-perfect.gif'
          audioId = 'perfect'
          break
        case score >= 60:
          this.scoreClass = 'good'
          this.gifUrl = '../../../../../static/sounds/pic-good.gif'
          audioId = 'good'
          break
        case score < 60:
          this.scoreClass = 'tryAgain'
          this.gifUrl = '../../../../../static/sounds/pic-try-again.gif'
          audioId = 'tryAgain'
          break
        case score === 'noRecord':
          this.scoreClass = 'noRecord'
          this.gifUrl = '../../../../../static/sounds/pic-no-record.gif'
          audioId = 'noRecord'
          break
        // case score === 'iatPerfect':
        //   this.scoreClass = 'iatPerfect'
        //   audioId = 'perfect'
        //   break
        // case score === 'iatNice':
        //   this.scoreClass = 'iatNice'
        //   audioId = 'myYeah'
        //   break
        // case score === 'iatKeepTrying':
        //   this.scoreClass = 'iatKeepTrying'
        //   audioId = 'myYeah'
        //   break
        default:
          this.scoreClass = 'niceTry'
          this.gifUrl = '../../../../../static/sounds/pic-nice-try.gif'
          audioId = 'niceTry'
          break
      }
      let timestamp = new Date().getTime()
      this.gifUrl += this.gifUrl + '?timestamp=' + timestamp
      if (isNaN(score)) {
        this.score = ''
      }
      if (this.isVip) {
        this.isShowScoreResult = true
        setTimeout(() => {
          $('#' + audioId)[0].play()
        }, 300)
        setTimeout(() => {
          $('#AnimatScore').fadeIn(500)
        }, 400)
      }
      setTimeout(() => {
        this.isShowScoreResult = false
        this.scoreClass = ''
        this.gifUrl = ''
        $('#AnimatScore').hide()
        if (score !== 'noRecord') {
          this.$parent.$emit('recordAnimate')
        }
        let isShowKidGuide = localStorage.getItem('isShowKidGuide')
        let isShowKidGuide2 = localStorage.getItem('isShowKidGuide2')
        if (!isShowKidGuide2 && this.isVip && this.xfSpeechType === 'iat') {
          setTimeout(() => {
            bus.$emit('kidGuideShow2', {ele: $('.swiper-slide-active .ise-area .user'), content: '智能小e帮你识别句子跟读'})
            localStorage.setItem('isShowKidGuide2', '1')
          }, 100)
        }
        if (isShowKidGuide && this.isVip && this.xfSpeechType === 'ise') {
          bus.$emit('kidRecordingSwiperMouse', false)
        }
      }, 1800)
    }
  }
}
</script>

<style lang="less" scoped>
.score-result-box {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index:99999999;
  overflow: hidden;
  .score-result-content {
    position: relative;
    width: 246px;
    height: 302px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .score {
      position: absolute;
      font-size: 50px;
      font-weight: bold;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &.perfect {
      width: 250px;
      height: 336px;
      // background-image: url('../../../../../static/images/kid/pic-perfect.gif');
      .score {
        color: #20C03B;
      }
    }
    &.good {
      height: 364px;
      // background-image: url('../../../../../static/images/kid/pic-good.gif');
      .score {
        color: #515151;
      }
    }
    &.niceTry {
      height: 384px;
      // background-image: url('../../../../../static/images/kid/pic-nice-try.gif');
      .score {
        color: #FF685F;
      }
    }
    &.tryAgain {
      width: 250px;
      height: 340px;
      // background-image: url('../../../../../static/images/kid/pic-try-again.gif');
    }
    &.noRecord {
      width: 250px;
      height: 232px;
      // background-image: url('../../../../../static/images/kid/pic-no-record.gif');
    }
    &.iatPerfect {
      width: 424px;
      height: 424px;
      // background-image: url('../../../../../static/images/kid/pic-iat-perfect.png');
    }
    &.iatNice {
      width: 424px;
      height: 424px;
      // background-image: url('../../../../../static/images/kid/pic-iat-nice.png');
    }
    &.iatKeepTrying {
      width: 424px;
      height: 424px;
      // background-image: url('../../../../../static/images/kid/pic-iat-keep-trying.png');
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
