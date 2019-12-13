<template>
<transition name="fade">
  <div class="evaluating-modal-box" v-show="isShowEvaluatingModal">
    <div class="evaluating-content">
      <div class="close-img" @click="closeModal()"></div>
      <div class="evaluating">
        <div class="user-avatar">
          <img :src="userInfo ? userInfo.photo : ''" alt="">
          <div class="right">
            <div class="right-left">
              <p class="nikename" v-text="userInfo ? userInfo.nickname : ''"></p>
              <div class="star">
                <span
                  v-for="(itemClass,index) in starClasses"
                  :class="itemClass" class="star-item"
                  :key="index">
                </span>
              </div>
            </div>
            <a href="javascript:;" class="go-intensify" @click="continueStudy()">
              {{'继续学习'}}
            </a>
          </div>
        </div>
        <div class="content-box">
          <!-- 原句子 -->
          <div class="iat-result">
            <div class="iat-result-item" :id="item.form_code" v-for="item in iatResult" :key="item.form_code">
              <i class='icon-horn' @click="play(item, $event)"></i>
              <div class="grade-color">
                <p class="sentence" v-html="item.originSentence"></p>
                <span :class="['score', {'right': item.score >= 80, 'wrong': item.score < 60}]">{{item.score}}<em>分</em></span>
              </div>
            </div>
          </div>
        </div>
        <!-- 5颗星的显示 -->
        <div class="bottom-prompt" v-if="totalStart != 5">
          <p class="bottom-title blue">读得真棒!</p>
          <p>共有<em class="blue">{{coreWords.length}}</em>个</p>
          <p>核心单词需要强化，快去学习一下吧～</p>
        </div>
        <!-- 5颗星一下的显示 -->
        <div class="bottom-prompt" v-else>
          <p>小朋友，你已经完成绘本阅读啦，<br/>去核心单词继续强化一下吧～</p>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import bus from '../../../bus'
import { mapState, mapActions } from 'vuex'
import $ from 'jquery'

const lengths = 5
const starOn = 'on'
const starOff = 'off'

export default {
  data () {
    return {
      isShowEvaluatingModal: false,
      starClasses: [],
      iatResult: [],
      playAudio: new Audio(),
      coreWords: [],
      totalStart: 0
    }
  },
  created () {
    bus.$on('showIATScoreDetail', (score) => {
      this.getStarClass(score)
      this.iatResult = []
      this.isShowEvaluatingModal = true
      setTimeout(() => {
        this.iatResult = JSON.parse(localStorage.getItem('xfIATResult'))
      }, 10)
    })
  },
  mounted () {
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo // 用户信息
    }),
    chapterCode () {
      return this.$route.query.id
    }
  },
  methods: {
    ...mapActions([
      'getKidCourseContent'
    ]),
    continueStudy () {
      this.closeModal()
      bus.$emit('proContinueLearn')
    },
    // 初始化swiper
    closeModal () {
      this.playAudio.pause()
      this.isShowEvaluatingModal = false
    },
    getStarClass (total) {
      this.starClasses = []
      // // 几颗全星
      if (total > 90) {
        total = 5
      } else if (total >= 80 && total <= 90) {
        total = 4
      } else if (total >= 60 && total < 80) {
        total = 3
      } else if (total > 30 && total < 60) {
        total = 2
      } else {
        total = 1
      }
      console.log(total)
      this.totalStart = total
      for (var i = 0; i < total; i++) { // 放全星
        this.starClasses.push(starOn)
      }
      if (this.starClasses.length < lengths) { // 如果没有满到五个星就用灰色的星星补齐9
        var offstar = lengths - this.starClasses.length
        for (var j = 0; j < offstar; j++) {
          this.starClasses.push(starOff)
        }
      }
    },
    play (item, event) {
      $('.iat-result-item').find('i').removeClass('playing')
      if (this.playAudio) {
        this.playAudio.pause()
      }
      let audio = new Audio()
      audio.src = item.recordUrl
      this.playAudio = audio
      audio.addEventListener('canplay', () => {
        $('#' + item.form_code).find('i').addClass('playing')
        audio.play()
      })
      audio.addEventListener('ended', () => {
        $('#' + item.form_code).find('i').removeClass('playing')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.evaluating-modal-box {
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
  .evaluating-content {
    width: 669px;
    min-height: 200px;
    position: absolute;
    top: 52%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius:8px;
    background: #fff;
    .close-img {
      position: absolute;
      top: -44px;
      right: 0px;
      width: 30px;
      height: 30px;
      background: url('../../../../static/images/kid/icon-close.png') no-repeat center;
      background-size: cover;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
    }
    .evaluating {
      padding-bottom: 20px;
    }
    .user-avatar {
      display: flex;
      width: 100%;
      padding: 20px 32px;
      background: #2CA0E5;
      border-radius: 8px 8px 0 0;
      img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 20px;
      }
      .right {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
        .right-left {
          .nikename {
            font-size:20px;
            font-weight:500;
            color:rgba(255,255,255,1);
            line-height:42px;
          }
          .star {
            .star-item {
              display: inline-block;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: 20px 20px;
              margin-right: 6px;
              // box-shadow:0px 0px 4px 0px #FFC81F;
              &:last-child {
                margin-right: 0;
              }
              &.on {
                background-image: url('../../../../static/images/kid/star-on.png');
                animation: scaleDraw .5s ease-in-out;
              }
              &.on:nth-child(1) {
                animation-delay: .5s;
              }
              &.on:nth-child(2) {
                animation-delay: 1s;
              }
              &.on:nth-child(3) {
                animation-delay: 1.5s;
              }
              &.on:nth-child(4) {
                animation-delay: 2s;
              }
              &.on:nth-child(5) {
                animation-delay: 2.5s;
              }
              &.half {
                background-image: url('../../../../static/images/kid/star-half.png');
              }
              &.off {
                background-image: url('../../../../static/images/kid/star-off.png');
              }
            }
          }
        }
        .go-intensify {
          font-size:18px;
          font-weight:500;
          color:rgba(111,89,8,1);
          padding: 4px 24px;
          background: #FECB08;
          border-radius: 22px;
          &:hover {
            opacity: .9;
          }
        }
      }
    }
    .content-box {
      .iat-result {
        min-height: 262px;
        max-height: 430px;
        margin: 28px 48px 14px;
        box-shadow:0px 0px 16px 0px rgba(0,0,0,0.14);
        border-radius: 8px;
        // white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
        overflow: -moz-scrollbars-none;
        overflow: -moz-scrollbars-none;
        &::-webkit-scrollbar {
          display: none;
        }
      }

      .iat-result-item {
        padding: 20px 24px 20px;
        border-bottom: 1px solid rgba(151, 151, 151, .13);
        &:last-child {
          border-bottom: 0px;
        }
        .icon-horn {
          cursor: pointer;
          display: inline-block;
          width:20px;
          height:16px;
          background-image: url('../../../../static/images/kid/icon-laba.png');
          background-repeat: no-repeat;
          background-size: cover;
          margin-top: 5px;
        }
        .playing {
          background-image: url('../../../../static/images/kid/icon-laba.gif');
        }
        .grade-color {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .sentence {
            font-size:18px;
            font-weight:500;
            color:#3c5b6f;
            max-width: 430px;
          }
          .score {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 91px;
            height: 65px;
            font-size:26px;
            font-weight:bold;
            line-height:65px;
            color: #3C5B6F;
            border-radius: 4px;
            background:rgba(0,0,0,.01);
            em {
              font-size:16px;
              padding-top: 8px;
            }
          }
        }
      }
    }
    .icon-horn {
      cursor: pointer;
      display: inline-block;
      width:20px;
      height:16px;
      background-image: url('../../../../static/images/kid/icon-laba.png');
      background-repeat: no-repeat;
      background-size: cover;
      margin-top: 5px;
    }
    .playing {
      background-image: url('../../../../static/images/kid/icon-laba.gif');
    }
    .score {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 91px;
      height: 65px;
      font-size:26px;
      font-weight:bold;
      line-height:65px;
      color: #3C5B6F;
      border-radius: 4px;
      background:rgba(0,0,0,.01);
      em {
        font-size:16px;
        padding-top: 8px;
      }
    }
  }
  // 下面的展示
  .bottom-prompt {
    p {
      font-size:14px;
      font-weight:500;
      color:rgba(145,145,145,1);
      text-align: center;
    }
    .bottom-title {
      font-size:20px;
      font-weight:500;
      line-height:40px;
      color:#2ca0e5;
    }
    em {
      font-size:18px;
      font-weight:600;
      line-height:24px;
      padding: 0 4px;
    }
  }
}
@keyframes scaleDraw { /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
  0% {
    transform: scale(1); /*开始为原始大小*/
  }
  50% {
    transform: scale(2);
  }
}
.blue {
  color:#2ca0e5 !important;
}
.wrong {
  color: #FF3B30 !important;
  background:rgba(253,58,47,.01)!important;
}
.right {
  color: #1FBD3A !important;
  background:rgba(31,189,58,.01)!important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@media (max-height: 610px){
  .evaluating-modal-box .evaluating-content {
    width: 600px;
  }
  .evaluating-modal-box .evaluating-content .evaluating .content-box .swiper-content .swiper-slide {
    max-height: 260px
  }
}
</style>
