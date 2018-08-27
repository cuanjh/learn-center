<template>
  <div id="coin-container">
    <div class="coin-bg" :class="{'coin-bg-move':coinMove}" >
      <img src="../../../../static/images/learnSystem/money.png"/>
      <span>{{total}}</span>
    </div>
    <div :class="['coin-ball',ballRunObject]"><span>{{changeCoin}}</span></div>
  </div>
</template>

<script>
export default {
  props: ['total'],
  name: 'coin-box',
  watch: {
    total: {
      handler (curVal, oldVal) {
        console.log('curVal:' + curVal)
        console.log('oldVal:' + oldVal)
        if (curVal > oldVal) {
          this.switchBallRunOjbect('coin-ball-correct')
        } else if (curVal < oldVal) {
          this.switchBallRunOjbect('coin-ball-wrong')
        }
        this.changeCoin = Math.abs(parseInt(curVal) - parseInt(oldVal))
        var _this = this
        this.coinMove = true
        setTimeout(() => {
          _this.coinMove = false
        }, 200)

        this.$data.timeoutId_shake = setTimeout(() => {
          _this.switchBallRunOjbect('')
          clearTimeout(_this.$data.timeoutId_shake)
        }, _this.ballPlayMsec)
      }
    }
  },
  data () {
    return {
      ballRunObject: '',
      ballPlayMsec: 1900,
      coinMove: false,
      changeCoin: 0
    }
  },
  methods: {
    switchBallRunOjbect (type) {
      this.ballRunObject = type
    }
  }
}
</script>

<style lang="less" scoped>
/* ==========================================================================
    金币图片
   ========================================================================== */
.coin-bg {
  position: fixed;
  height: 60px;
  width: 200px;
  margin-left: 150px;
  bottom: 2px;
  line-height: 60px;
  background: url(../../../../static/images/learnSystem/group.png) no-repeat;
  background-size: 150px 60px;
  transform: scale(1, 1);
  transition: transform 0.2s ease;
  span {
    color: #fff;
    font-size: 16px;
    margin-left: 10px;
    margin-right: 10px;
    display: inline-block;
  }
  em {
    color: #fff;
    font-size: 20px;
    display: inline-block;
  }
  img {
    width: 48px;
    height: 48px;
    vertical-align: middle;
    margin-left: 5px;
    margin-bottom: 4px;
  }
}
.coin-bg-move {
  transform: scale(1.1, 1.1);
  transition: transform 0.2s ease;
}

.coin-ball {
  //width:20px;
  //height:20px;
  //background:yellow;
  //-webkit-border-radius:50%;
  //-moz-border-radius:50%;
  //border-radius:50%;
  //cursor:pointer;
  background: url(../../../../static/images/learnSystem/ball_add.svg) no-repeat;
  background-size: 60px 60px;
  width: 60px;
  height: 60px;
  position: relative;
  margin-left: 152px;
  margin-top: 3px;
  padding-top: 6px;
  padding-left: 54px;
  color: #f4b401;
  font-size: 18px;
  display: none;
  span {
    position: absolute;
    left: 55px;
    top: 5px;
  }
}

.coin-ball-wrong {
  display: block;
  background: url(../../../../static/images/learnSystem/ball_sub.svg) no-repeat;
  -moz-animation-name: coin-ball-wrong-keyframes;
  -moz-animation-duration: 2000ms;
  -moz-animation-delay: 0ms;
  -moz-animation-fill-mode: forwards;
  -moz-animation-timing-function: linear;
  -moz-animation-iteration-count: infinite;
  -ms-animation-name: coin-ball-wrong-keyframes;
  -ms-animation-duration: 2000ms;
  -ms-animation-delay: 0ms;
  -ms-animation-fill-mode: forwards;
  -ms-animation-timing-function: linear;
  -ms-animation-iteration-count: infinite;
  -o-animation-name: coin-ball-wrong-keyframes;
  -o-animation-duration: 2000ms;
  -o-animation-delay: 0ms;
  -o-animation-fill-mode: forwards;
  -o-animation-timing-function: linear;
  -o-animation-iteration-count: infinite;
  -webkit-animation-name: coin-ball-wrong-keyframes;
  -webkit-animation-duration: 2000ms;
  -webkit-animation-delay: 0ms;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-name: coin-ball-wrong-keyframes;
  animation-duration: 2000ms;
  animation-delay: 0ms;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@-moz-keyframes coin-ball-wrong-keyframes {
  0% {
    -moz-transform: translate(0px, 0px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  10% {
    -moz-transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  20% {
    -moz-transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  30% {
    -moz-transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    -moz-transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  50% {
    -moz-transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    -moz-transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  70% {
    -moz-transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    -moz-transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  90% {
    -moz-transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    -moz-transform: translate(0px, -70px) scale(1.4) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
}
@-ms-keyframes coin-ball-wrong-keyframes {
  0% {
    -ms-transform: translate(0px, 0px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  10% {
    -ms-transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  20% {
    -ms-transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  30% {
    -ms-transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    -ms-transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  50% {
    -ms-transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    -ms-transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  70% {
    -ms-transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    -ms-transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  90% {
    -ms-transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    -ms-transform: translate(0px, -70px) scale(1.4) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
}
@-o-keyframes coin-ball-wrong-keyframes {
  0% {
    -o-transform: translate(0px, 0px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  10% {
    -o-transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  20% {
    -o-transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  30% {
    -o-transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    -o-transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  50% {
    -o-transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    -o-transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  70% {
    -o-transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    -o-transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  90% {
    -o-transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    -o-transform: translate(0px, -70px) scale(1.4) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
}
@-webkit-keyframes coin-ball-wrong-keyframes {
  0% {
    -webkit-transform: translate(0px, 0px) scale(0.7) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  10% {
    -webkit-transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  20% {
    -webkit-transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  30% {
    -webkit-transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    -webkit-transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  50% {
    -webkit-transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    -webkit-transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  70% {
    -webkit-transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    -webkit-transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  90% {
    -webkit-transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    -webkit-transform: translate(0px, -70px) scale(1.4) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
}
@keyframes coin-ball-wrong-keyframes {
  0% {
    transform: translate(0px, 0px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  10% {
    transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  20% {
    transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  30% {
    transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  50% {
    transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  70% {
    transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  90% {
    transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    transform: translate(0px, -70px) scale(1.4) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
}

.coin-ball-correct {
  display: block;
  background: url(../../../../static/images/learnSystem/ball_add.svg) no-repeat;
  -moz-animation-name: coin-ball-correct-keyframes;
  -moz-animation-duration: 2000ms;
  -moz-animation-delay: 0ms;
  -moz-animation-fill-mode: forwards;
  -moz-animation-timing-function: linear;
  -moz-animation-iteration-count: infinite;
  -ms-animation-name: coin-ball-correct-keyframes;
  -ms-animation-duration: 2000ms;
  -ms-animation-delay: 0ms;
  -ms-animation-fill-mode: forwards;
  -ms-animation-timing-function: linear;
  -ms-animation-iteration-count: infinite;
  -o-animation-name: coin-ball-correct-keyframes;
  -o-animation-duration: 2000ms;
  -o-animation-delay: 0ms;
  -o-animation-fill-mode: forwards;
  -o-animation-timing-function: linear;
  -o-animation-iteration-count: infinite;
  -webkit-animation-name: coin-ball-correct-keyframes;
  -webkit-animation-duration: 2000ms;
  -webkit-animation-delay: 0ms;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-name: coin-ball-correct-keyframes;
  animation-duration: 2000ms;
  animation-delay: 0ms;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@-moz-keyframes coin-ball-correct-keyframes {
  0% {
    -moz-transform: translate(0px, 0px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  10% {
    -moz-transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  20% {
    -moz-transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  30% {
    -moz-transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    -moz-transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  50% {
    -moz-transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    -moz-transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  70% {
    -moz-transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    -moz-transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  90% {
    -moz-transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    -moz-transform: translate(0px, -70px) scale(1.4) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
}
@-ms-keyframes coin-ball-correct-keyframes {
  0% {
    -ms-transform: translate(0px, 0px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  10% {
    -ms-transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  20% {
    -ms-transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  30% {
    -ms-transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    -ms-transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  50% {
    -ms-transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    -ms-transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  70% {
    -ms-transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    -ms-transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  90% {
    -ms-transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    -ms-transform: translate(0px, -70px) scale(1.4) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
}
@-o-keyframes coin-ball-correct-keyframes {
  0% {
    -o-transform: translate(0px, 0px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  10% {
    -o-transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  20% {
    -o-transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  30% {
    -o-transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    -o-transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  50% {
    -o-transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    -o-transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  70% {
    -o-transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    -o-transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  90% {
    -o-transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    -o-transform: translate(0px, -70px) scale(1.4) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
}
@-webkit-keyframes coin-ball-correct-keyframes {
  0% {
    -webkit-transform: translate(0px, 0px) scale(0.7) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  10% {
    -webkit-transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  20% {
    -webkit-transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  30% {
    -webkit-transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    -webkit-transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  50% {
    -webkit-transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    -webkit-transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  70% {
    -webkit-transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    -webkit-transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  90% {
    -webkit-transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    -webkit-transform: translate(0px, -70px) scale(1.4) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
}
@keyframes coin-ball-correct-keyframes {
  0% {
    transform: translate(0px, 0px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  10% {
    transform: translate(0px, -5.2938px) scale(0.77) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  20% {
    transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  30% {
    transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  50% {
    transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  70% {
    transform: translate(0px, -65.1437px) scale(1.19) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    transform: translate(0px, -65.8px) scale(1.26) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  90% {
    transform: translate(0px, -69.1687px) scale(1.33) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    transform: translate(0px, -70px) scale(1.4) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
}
</style>
