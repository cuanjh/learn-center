<template>
  <div class="ise-area">
    <div class="play" :style="{transform: 'translateX('+ (isHaveRecord ? '0' : translateX) +'px)'}" @click="playRecord">
      <span v-for="n in 5" :key="n" :style="{height: playLineHeight[n - 1] + 'px'}"></span>
    </div>
    <div class="record" @mouseenter="isShowStopTip = true" @mouseleave="isShowStopTip = false">
      <div class="micro-phone" @click="recordOpt"></div>
      <div class="circle circle1" v-show="isRecording"></div>
      <div class="circle circle2" v-show="isRecording"></div>
      <transition name="fade" mode="out-in">
        <div class="tip" v-show="isShowStopTip && isRecording"></div>
      </transition>
    </div>
    <div class="user" :style="{transform: 'translateX(-'+ (isHaveRecord ? '0' : translateX) +'px)'}" @click="goWordListBox()">
      <img :src="photo" alt="">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['index'],
  data () {
    return {
      photo: '',
      playLineHeight: [8, 16, 24, 16, 8],
      isRecording: false,
      isShowStopTip: false,
      isEvaluated: false,
      isPlaying: false,
      translateX: 116,
      timerInterval: null
    }
  },
  mounted () {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.photo = userInfo.photo
  },
  computed: {
    ...mapState({
      kidRecordList: state => state.kidRecordList
    }),
    isHaveRecord () {
      if (this.kidRecordList[this.index]) {
        return true
      }
      return false
    }
  },
  methods: {
    recordOpt () {
      this.isRecording = !this.isRecording
      this.isShowStopTip = true
      if (this.isRecording) {
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
      }
      // 判断是否需要语音测评
      this.$emit('startEvaluate')
    },
    playRecord () {
      this.isPlaying = !this.isPlaying
      this.$emit('playRecord', this.isPlaying)
    },
    recordPlaying () {
      if (this.timerInterval) return
      let n = 1
      this.timerInterval = setInterval(() => {
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
    resetPlay () {
      clearInterval(this.timerInterval)
      this.timerInterval = null
      this.playLineHeight = [8, 16, 24, 16, 8]
      this.isPlaying = false
    },
    // 点击头像出现录音评测的弹框
    goWordListBox () {
      console.log('弹录录音的列表=>')
      // this.$emit('goGradeBox')
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

.user {
  cursor: pointer;
  z-index: 1;
  transition: transform .5s ease-in;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
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
