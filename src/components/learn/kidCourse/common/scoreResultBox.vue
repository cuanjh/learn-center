<template>
<transition name="fade" >
  <div class="score-result-box" v-show="isShowScoreResult">
    <div :class="['score-result-content', scoreClass]" >
      <span class="score" id="AnimatScore" >{{ score }}</span>
    </div>
    <audio id="myYeah" src="../../../../../static/sounds/yeah.mp3"></audio>
    <audio id="good" src="../../../../../static/sounds/good.mp3"></audio>
    <audio id="perfect" src="../../../../../static/sounds/perfect.mp3"></audio>
    <audio id="niceTry" src="../../../../../static/sounds/nice_try.mp3"></audio>
    <audio id="tryAgain" src="../../../../../static/sounds/try_again.mp3"></audio>
  </div>
</transition>
</template>

<script>
// import Bus from '../../../../bus'
import $ from 'jquery'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      score: '',
      scoreClass: '',
      isShowScoreResult: false
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      isVip: state => state.isVip
    })
  },
  methods: {
    setScoreResult (score) {
      console.log('评分===》', score)
      if (score) {
        this.score = Math.round(score)
      } else {
        this.score = ''
      }
      this.scoreClass = ''
      switch (true) {
        case score >= 80:
          this.scoreClass = 'perfect'
          break
        case score >= 60:
          this.scoreClass = 'good'
          break
        case score === '':
          this.scoreClass = 'tryAgain'
          break
        default:
          this.scoreClass = 'niceTry'
          break
      }
      if (this.isVip) {
        this.isShowScoreResult = true
        setTimeout(() => {
          $('#' + this.scoreClass)[0].play()
        }, 300)
        setTimeout(() => {
          $('#AnimatScore').fadeIn(500)
        }, 400)
      }
      setTimeout(() => {
        this.isShowScoreResult = false
        $('#AnimatScore').hide()
        this.scoreClass = ''
      }, 2000)
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
      top: 0;
      left: 0;
      font-size: 50px;
      font-weight: bold;
      top: 51%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &.perfect {
      width: 262px;
      height: 398px;
      background-image: url('../../../../../static/images/kid/pic-perfect.gif');
      .score {
        color: #20C03B;
      }
    }
    &.good {
      height: 384px;
      background-image: url('../../../../../static/images/kid/pic-good.gif');
      .score {
        color: #515151;
      }
    }
    &.niceTry {
      height: 384px;
      background-image: url('../../../../../static/images/kid/pic-nice-try.gif');
      .score {
        color: #FF685F;
      }
    }
    &.tryAgain {
      height: 384px;
      background-image: url('../../../../../static/images/kid/pic-try-again.gif');
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
