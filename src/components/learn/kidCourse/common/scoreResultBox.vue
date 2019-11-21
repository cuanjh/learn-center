<template>
<transition name="fade" >
  <div class="score-result-box" v-show="isShowScoreResult">
    <div :class="['score-result-content', scoreClass]">
      <span class="score">{{score}}</span>
    </div>
  </div>
</transition>
</template>

<script>
// import Bus from '../../../../bus'

export default {
  data () {
    return {
      isShowScoreResult: false,
      score: '',
      scoreClass: '',
      isVip: false
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
      console.log(score)
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
      }
      setTimeout(() => {
        this.isShowScoreResult = false
      }, 3000)
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
      font-size: 60px;
      font-weight: bold;
      top: 68%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &.perfect {
      width: 262px;
      height: 278px;
      background-image: url('../../../../../static/images/kid/pic-perfect.png');
      .score {
        color: #20C03B;
      }
    }
    &.good {
      background-image: url('../../../../../static/images/kid/pic-good.png');
      .score {
        color: #515151;
      }
    }
    &.nice {
      background-image: url('../../../../../static/images/kid/pic-nice-try.png');
      .score {
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
