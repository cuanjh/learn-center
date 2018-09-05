<template>
  <div class="progress p-pk" style="height: 70px;">
    <b v-for="(val, index) in data" :key="'b1'+index" :class="{great:val==0,perfect:val==1,current:index==idx+1}" v-show="start && false"></b>
    <b v-for="(val, index) in level" :key="'b2'+index" class="progress-grade" :class="{current:index+1==currLevel}" v-show="start">{{level[index]}}<span class="num" v-show="index + 1 == currLevel">[{{currSlideNum}}/{{maxSlideNum}}]</span></b>
    <div class="timer grade-timer" :class="{warning:warning,error:error}" v-if="start">
      <span>{{parseInt(time/60) | pad}}</span>
      <span>:</span>
      <span>{{ time%60 | pad }}</span>
      <em></em>
    </div>
    <div class="btn back" @click="back()"><b></b>{{$t('pkProgress')}}</div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: ['data', 'path', 'idx', 'currLevel'],
  data () {
    return {
      start: false,
      time: 0,
      timeID: 0,
      warning: false,
      error: false,
      couple: false,
      coupleProgress: [],
      urlFix: '&imageView2/0/w/50',
      otherplayer: {},
      level: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      pkTime: 0
    }
  },
  filters: {
    pad: (value) => {
      return _.padStart(value, 2, '0')
    }
  },
  mounted () {
    console.log('gradeProgress')
    console.log(this.currLevel)
  },
  computed: {
    coupleLength () {
      return this.coupleProgress.length
    },
    currSlideNum () {
      // idx初始值是-1,为什么要这么传?
      return this.idx + 2 > this.data.length ? this.data.length : this.idx + 2
    },
    maxSlideNum () {
      return this.data.length
    }
  },
  created () {
    this.$on('init-timer', (questionNum, userData) => {
      var _this = this
      this.init(questionNum, userData)
      clearInterval(this.timeID)
      this.timeID = setInterval(() => {
        _this.time++
      }, 1000)
    })

    this.$on('reset-progress', () => {
      this.reset()
    })

    this.$on('pasue-progress', () => {
      clearInterval(this.timeID)
    })

    // 设置对方进度条的事件
    this.$on('addCouple', (idx, score) => {
      this.coupleProgress.$set(this.coupleLength - 1 - idx, score)
    })
  },
  methods: {
    init (questionNum, userData) {
      this.start = true
      this.warning = false
      this.error = false
      if (questionNum) {
        this.couple = true
        this.$set(this, 'coupleProgress', _.fill(Array(questionNum), -1))
        this.$set(this, 'otherplayer', userData)
      }
    },
    reset () {
      this.start = false
      this.warning = false
      this.error = false
      this.$set(this, 'coupleProgress', [])
      clearInterval(this.timeID)
      this.timeID = 0
      this.couple = false
      this.time = this.pkTime
    },
    back () {
      clearInterval(this.timeID)
      this.reset()
      this.$parent.$emit('back')
    },
    getTime () {
      return this.pkTime - this.time
    },
    getResult (otherTime) {
      /**
        The test ranking is based on the test score. Question number could be 6, 7, 8, 9, 10.
        Solo Test Score= [(k1/spending time)*0.6+ accuracy*0.4]*100
        When question is 6, k1=9
        When question is 7, k1=10.5
        When question is 8, k1=12
        When question is 9, k1=13.5
        When question is 10, k1=15

        For example:
        When there are 6 questions.
        User A’s accuracy is 84%, and finish the test in 10 seconds.
        His score is =((9/10)*0.6+0.84*0.4)*100=87.6
        User B’s accuracy is 100%, and finish the test in 21 seconds.
        His score is ((9/21)*0.6+1*0.4)*100=65.71

        User A ranks higher than User B.

      **/
      var kValue = [9, 10.5, 12, 13.5, 15]
      var result = {
        own: {},
        other: {}
      }
      if (this.couple) {
        var idx = this.coupleLength - 6
        var K1 = kValue[idx]
        var own = _.countBy(this.data, (n) => {
          return n
        })
        var other = _.countBy(this.coupleProgress, (n) => {
          return n
        })
        result.own.right = own['1'] || 0
        result.own.wrong = own['0'] || 0
        result.own.time = this.getTime()
        // result.own.user = Config.userData
        result.other.right = other['1'] || 0
        result.other.wrong = other['0'] || 0
        result.other.user = this.otherplayer
        result.other.time = otherTime

        var ownAccr = _.sum(this.data) / this.coupleLength
        var ownT = 0.8 * ownAccr
        var ownRank = K1 / this.getTime() * ownT + ownAccr * (1 - ownT)

        var otherAccr = _.sum(this.coupleProgress) / this.coupleLength
        var otherT = 0.8 * otherAccr
        var otherRank = K1 / otherTime * otherT + otherAccr * (1 - otherT)

        if (ownRank > otherRank) {
          result.winner = 1
        } else if (ownRank < otherRank) {
          result.winner = 0
        } else {
          result.winner = -1
        }
        return result
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../static/less/global_var.less';
.progress {
  height: 50px;
  position: fixed;
  bottom: 0;
  // line-height: 50px;
  text-align: center;
  width: 100%;
  left: 0;
  z-index: 1;
  //progress中每一个进度按钮
  .progress-bar-container {
    width: 312px;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    & > span {
      display: block;
      width: 20px;
      height: 30px;
      margin: 10px;
      position: absolute;
      top: 0;
      background: url("../../../../static/images/learnSystem/progress/left.png") no-repeat center;
      &:hover {
        cursor: pointer;
        background-image: url("../../../../static/images/learnSystem/progress/left-hover.png");
      }
      &.prev {
        left: -40px;
      }
      &.next {
        right: -40px;
        transform: rotateY(180deg);
      }
    }
  }
  .progress-num {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 300;
    color: #54a3fc;
  }
  .progress-bar {
    width: 312px;
    height: 500x;
    line-height: 45px;
    display: inline-block;
    transition-duration: 300ms;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    b {
      flex-shrink: 0;
      display: inline-block;
      border-radius: 50%;
      background-color: #c8cdde;
      color: #ffffff;
      width: 18px;
      height: 18px;
      margin: 0 4px;
      transition: all 0.3s ease;
      font-weight: bolder;
      // margin-top: 17px;
      line-height: 18px;
      font-family: "宋体";
      &.perfect {
        background-color: #1ec8ba;
        cursor: pointer;
      }
      &.great {
        background-color: #f4b401;
        // color: #f4b401;
        cursor: pointer;
      }
      &.current {
        position: relative;
        &:after {
          content: "";
          border: 4px solid #c8cdde;
          position: absolute;
          width: 26px;
          height: 26px;
          top: -4px;
          left: -4px;
          border-radius: 50%;
          // opacity: 0.5;
        }
      }
    }
  }
}
.p-pk {
  & > b {
    position: relative;
    top: -10px;
    cursor: default;
  }
  img {
    display: inline-block;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin: 0 10px;
  }
  .btn {
    top: 5px !important;
  }
  .timer {
    background-color: @main-color;
    padding: 0 10px;
    font-size: 20px;
    // color: @main-color;
    margin: 0 10px;
    border-radius: 20px;
    display: inline-block;
    position: relative;
    top: -10px;
    height: 35px;
    transition: all 0.3s ease;
    // width: 55px;
    line-height: 35px;
    span {
      color: #fff;
      position: relative;
      z-index: 111;
    }
  }
  .grade-timer {
    position: absolute;
    top: 0px;
    right: 50px;
    border-radius: 3px;
  }
  .warning {
    background-color: #f4b401;
  }
  .error {
    background-color: #e55a23;
  }
  .warning,
  .error {
    &:after {
      content: "";
      position: absolute;
      top: 0;
      padding: 0 10px;
      left: 0;
      height: 35px;
      width: 55px;
      border-radius: 20px;
      animation-name: diffuse;
      animation-duration: 1000ms;
      animation-delay: 0;
      animation-iteration-count: infinite;
    }
  }
  .warning {
    &:after {
      background: #f4b401;
    }
  }
  .error {
    &:after {
      background: #e55a23;
    }
  }
}

/* ==========================================================================
    setting
   ========================================================================== */

.progress {
  .btn {
    border-radius: 3px;
    background: #b7bed4;
    font-size: 1.3em;
    padding: 10px;
    color: #fff;
    position: absolute;
    cursor: pointer;
    line-height: 18px;
    top: 0;
    // height: 18px;
    b {
      border-radius: 0;
      display: inline-block;
      position: relative;
    }
  }
  .back {
    left: 50px;
    b {
      background: url(../../../../static/images/learnSystem/progress/back.png);
      width: 7px;
      height: 11px;
      margin-right: 5px;
      margin-top: 4px;
    }
  }
  .smenu {
    right: 40px;
    b {
      background: url(../../../../static/images/learnSystem/progress/hamburg.png);
      width: 18px;
      height: 13px;
    }
  }
  .switch {
    padding: 0;
    right: 165px;
    background: #e9ecf6;
    border: 1px solid #b7bed4;
    height: 36px;
    a {
      color: #b7bed4;
      display: inline-block;
      width: 38px;
      height: 37px;
      line-height: 37px;
      text-align: center;
      &.active {
        background: #b7bed4;
        color: #fff;
      }
    }
    &:hover {
      background: #e9ecf6;
      a {
        &.active {
          background: linear-gradient(0deg, #59b3ff 0%, #4e9ef6 100%);
        }
      }
    }
  }
  .pasue {
    right: 90px;
    b {
      background: url(../../../../static/images/learnSystem/progress/pause.png);
      width: 10px;
      height: 12px;
      margin-right: 5px;
    }
  }
}

@keyframes diffuse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.progress.p-pk {
  &>b {
    margin-top: 17px;
    line-height: 18px;
    font-family: "宋体";
    display: inline-block;
    border-radius: 50%;
    background-color: #c8cdde;
    color: #fff;
    width: 18px;
    height: 18px;
    margin: 0 4px;
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    font-weight: 400;
    &.current {
      position: relative;
    }
    &.progress-grade {
      -webkit-transition: none;
      transition: none;
      font-size: 14px;
      top: 0;
      font-weight: 200;
      line-height: 24px;
      width: 24px;
      height: 24px;
      background-color: #fff;
      color: #000;
      margin: 0 8px;
      &:after {
          content: "";
          border: 3px solid #c8cdde;
          position: absolute;
          width: 30px;
          height: 30px;
          top: -3px;
          left: -3px;
          border-radius: 50%;
          opacity: .5;
          filter: alpha(opacity=50);
      }
      &.current {
          font-weight: 200;
          line-height: 34px;
          width: 34px;
          height: 34px;
          background-color: #54a3fc;
          color: #FFF;
          margin: 0 8px;
          &:after {
              content: "";
              border: 6px solid #54a3fc;
              position: absolute;
              width: 46px;
              height: 46px;
              top: -6px;
              left: -6px;
              border-radius: 50%;
              opacity: .5;
              filter: alpha(opacity=50);
          }
      }
      .num {
          height: 16px;
          font-size: 14px;
          line-height: 16px;
          font-weight: 300;
          color: #54a3fc;
          position: absolute;
          top: 44px;
          left: 0;
      }
    }
  }
}

</style>
