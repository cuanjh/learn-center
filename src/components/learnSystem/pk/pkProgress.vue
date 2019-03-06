<template>
  <div class="progress p-pk"> <img :src="userphoto + urlFix" v-if="start">
    <b v-for="(value, index) in data" :key="index" :class="{great:value==0,perfect:value==1,current:index==idx+1}" v-show="start">{{index + 1}}</b>
    <div class="timer" :class="{warning:warning,error:error}" v-if="start">
      <span>00:</span>
      <span>{{ time | pad }}</span>
      <em></em>
    </div>
    <b v-for="(value, index) in coupleProgress" :key="index" :class="{great:value==0,perfect:value==1}" v-show="couple"></b>
    <img :src="otherplayer.photoURL + urlFix" v-if="couple">
    <div class="btn back" @click="back()">
      <b></b>{{$t("pkProgress")}}
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapState } from 'vuex'
import _ from 'lodash'

// Vue.filter('pad', function (value) {
//   return _.padLeft(value, 2, '0')
// })

export default {
  props: ['data', 'path', 'idx'],
  data () {
    return {
      start: false,
      time: 30,
      timeID: 0,
      warning: false,
      error: false,
      couple: false,
      coupleProgress: [],
      // userphoto: this.userInfo.photo,
      urlFix: '&imageView2/0/w/50',
      otherplayer: {}
    }
  },
  filters: {
    pad: (value) => {
      return _.padStart(value, 2, '0')
    }
  },
  mounted () {
    console.log(this.data)
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      pkTime: state => state.learn.pkTime
    }),
    coupleLength () {
      return this.coupleProgress.length
    },
    // time () {
    //   return this.pkTime
    // },
    userphoto () {
      return this.ui.photo
    },
    ui () {
      let ui = this.userInfo
      if (Object.keys(ui).length === 0) {
        ui = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      return ui
    }
  },
  created () {
    this.$on('init-timer', (questionNum, userData) => {
      var _this = this
      this.init(questionNum, userData)
      clearInterval(this.timeID)
      this.timeID = setInterval(() => {
        if (_this.time <= 16 && _this.time > 10) {
          _this.warning = true
        } else if (_this.time <= 10) {
          _this.warning = false
          _this.error = true
        }
        _this.time--
        if (_this.time < 0) {
          _this.time = 0
          _this.$parent.$emit('time-over')
          clearInterval(_this.timeID)
        }
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
        this.$set('coupleProgress', _.fill(Array(questionNum), -1))
        this.$set('otherplayer', userData)
      }
    },
    reset () {
      this.start = false
      this.warning = false
      this.error = false
      // this.$set(this, 'data', [])
      this.$emit('updateData', [])
      this.$set(this, 'coupleProgress', [])
      clearInterval(this.timeID)
      this.timeID = 0
      this.couple = false
      this.time = this.pkTime
    },
    back () {
      clearInterval(this.timeID)
      this.reset()
      this.$parent.$emit('clientBack') // 通知父组件，用户点击了返回退出，不直接用back的原因是其他地方也会调用这个函数，区分功能
      this.$parent.$emit('back', true)
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
        result.own.user = this.userInfo
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
  @import url('../../../../static/less/global_var.less');
  .progress {
    height: 50px;
    position: fixed;
    bottom: 0;
    text-align: center;
    width: 100%;
    left: 0;
    z-index: 1;
    & > b {
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
      -webkit-transition: all 0.3s ease;
      transition: all 0.3s ease;
      font-weight: 400;
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
        }
      }
    }
  }
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
  }
  .p-pk {
    &>b {
      position: relative;
      top: 5px;
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
      color: @main-color;
      margin: 0 10px;
      border-radius: 20px;
      display: inline-block;
      position: relative;
      top: -5px;
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
</style>
