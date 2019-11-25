<template>
<transition name="fade" >
  <div class="score-result-box" v-show="isShowScoreResult" v-if="!noResult">
    <div :class="['score-result-content', scoreClass]" >
      <span class="score" id="AnimatScore" >{{ score }}</span>
    </div>
    <audio id="myYeah" src="../../../../../static/sounds/yeah.mp3"></audio>
  </div>
</transition>
</template>

<script>
// import Bus from '../../../../bus'
import $ from 'jquery'
export default {
  data () {
    return {
      score: '',
      scoreClass: '',
      isShowScoreResult: false,
      isVip: false,
      noResult: ''
    }
  },
  created () {
  },
  mounted () {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.isVip = userInfo.member_info.member_type === 1
  },
  methods: {
    setScoreResult (score) {
      console.log('评分===》', score)
      this.score = Math.round(score)
      this.scoreClass = ''
      switch (true) {
        case score >= 80:
          this.scoreClass = 'perfect'
          break
        case score >= 60:
          this.scoreClass = 'good'
          break
        default:
          this.scoreClass = 'nice'
          break
      }
      if (this.isVip) {
        this.isShowScoreResult = true
        setTimeout(() => {
          if (score >= 80) {
            $('.perfect').css({
              'background-image': 'url(../../../../../static/images/kid/pic-perfect.gif)'
            })
          } else if (score >= 60 && score < 80) {
            $('.good').css({
              'background-image': 'url(../../../../../static/images/kid/pic-good.gif)'
            })
          } else {
            $('.nice').css({
              'background-image': 'url(../../../../../static/images/kid/pic-nice-try.png)'
            })
          }
          $('#myYeah')[0].play()
        }, 300)
        setTimeout(() => {
          $('#AnimatScore').fadeIn(500)
        }, 400)
      }
      setTimeout(() => {
        this.isShowScoreResult = false
        $('.perfect').css({'background-image': ''})
        $('.good').css({'background-image': ''})
        $('.nice').css({'background-image': ''})
        $('#AnimatScore').hide()
      }, 2000)
    },
    noSetScoreResult (str) {
      console.log(str)
      this.noResult = str
      alert(this.noResult)
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
      // background-image: url('../../../../../static/images/kid/pic-perfect.gif');
      .score {
        color: #20C03B;
      }
    }
    &.good {
      height: 384px;
      // background-image: url('../../../../../static/images/kid/pic-good.gif');
      .score {
        color: #515151;
      }
    }
    &.nice {
      // background-image: url('../../../../../static/images/kid/pic-nice-try.png');
      .score {
        top: 68%;
        color: #FF685F;
      }
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
