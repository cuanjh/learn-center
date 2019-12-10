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
                  v-for="(itemClass,index) in itemClasslass"
                  :class="itemClass" class="star-item"
                  :key="index">
                </span>
              </div>
            </div>
            <a href="javascript:;" class="go-intensify" @click="studing()">
              {{'继续学习'}}
            </a>
          </div>
        </div>
        <div class="content-box">
          <div class="swiper-content">
            <div class="swiper-container " id="swiper-evaluating">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <!-- 原句子 -->
                  <div class="mother-sentence-box">
                    <div class="mother-grade">
                      <i class="icon-horn"></i>
                      <div class="grade-color">
                        <p class="sentence">
                          <span>Dónde vienes de mi amigo, </span>
                          <span>dónde vives en tu casa y a dónde</span>
                        </p>
                        <span class="score">{{'70'}}<em>分</em></span>
                      </div>
                    </div>
                  </div>
                  <div >
                    <ul>
                      <li >
                        <div class="li-item">
                          <div class="review-item">
                            <i class="icon-horn"></i>
                            <p class="core-word">
                              <span class="word">{{'w.word'}}</span>
                            </p>
                          </div>
                          <p class="grade-score-color">
                            <span class="score">{{'90'}}<em>分</em></span>
                          </p>
                        </div>
                      </li>
                      <li >
                        <div class="li-item">
                          <div class="review-item">
                            <i class="icon-horn"></i>
                            <p class="core-word">
                              <span class="word">{{'w.word'}}</span>
                            </p>
                          </div>
                          <p class="grade-score-color">
                            <span class="score">{{'20'}}<em>分</em></span>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="swiper-slide">
                  <!-- 原句子 -->
                  <div class="mother-sentence-box">
                    <div class="mother-grade">
                      <i class="icon-horn"></i>
                      <div class="grade-color">
                        <p class="sentence">
                          <span>Dónde vienes de mi amigo, </span>
                          <span>dónde vives en tu casa y a dónde</span>
                        </p>
                        <span class="score">{{'70'}}<em>分</em></span>
                      </div>
                    </div>
                  </div>
                  <div >
                    <ul>
                      <li >
                        <div class="li-item">
                          <div class="review-item">
                            <p class="core-word">
                              <i class="icon-horn"></i>
                              <span class="word">{{'w.word'}}</span>
                            </p>
                          </div>
                          <p class="grade-score-color">
                            <span class="score">{{'90'}}<em>分</em></span>
                          </p>
                        </div>
                      </li>
                      <li >
                        <div class="li-item">
                          <div class="review-item">
                            <p class="core-word">
                              <i class="icon-horn"></i>
                              <span class="word">{{'w.word'}}</span>
                            </p>
                          </div>
                          <p class="grade-score-color">
                            <span class="score">{{'20'}}<em>分</em></span>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import bus from '../../../bus'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import { mapState } from 'vuex'

const lengths = 5
const starOn = 'on'
const starOff = 'off'

export default {
  data () {
    return {
      isShowEvaluatingModal: false
    }
  },
  created () {
    bus.$on('showScoreDetail', (params) => {
      console.log('点击了评分详情', params)
      this.isShowEvaluatingModal = true
      this.initEvaluSwiper()
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo // 用户信息
    }),
    // 几颗星
    itemClasslass () { // 星星的数组
      let result = []
      let total = 80
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
      for (var i = 0; i < total; i++) { // 放全星
        result.push(starOn)
      }
      if (result.length < lengths) { // 如果没有满到五个星就用灰色的星星补齐9
        var offstar = lengths - result.length
        for (var j = 0; j < offstar; j++) {
          result.push(starOff)
        }
      }
      return result
    }
  },
  methods: {
    studing () {},
    // 初始化swiper
    initEvaluSwiper () {
      /* eslint-disable */
      this.$nextTick(() => {
        var swiperScore = new Swiper('#swiper-evaluating', {
          loop: false,
          autoplay: false,
          initialSlide: 0,
          centeredSlides:true,
          slidesPerView: 'auto',
          observer: true,
          observeParents: true,
          observeSlideChildren: true,
          slideToClickedSlide: true,
          spaceBetween: 20,
          mousewheel: false,
          on: {
            init: () => {
            },
            slideNextTransitionStart: () => {
              console.log(swiperScore.activeIndex)
            },
            slideChange: () => {
            }
          }
        })
      })
      /* eslint-enable */
    },
    closeModal () {
      this.isShowEvaluatingModal = false
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
      min-height: 262px;
      // 显示句子的颜色
      .swiper-content {
        #swiper-evaluating {
          width: 100%;
          height: 100%;
          padding-top: 28px;
          padding-bottom: 16px;
        }
        #swiper-evaluating .swiper-slide {
          display: block;
          left: 0;
          max-height: 360px;
          overflow-y: auto;
          width: 83%!important;
          padding: 24px 26px;
          background: #fff;
          box-shadow:0px 0px 16px 0px rgba(0,0,0,0.14);
          border-radius:8px;
        }
        #swiper-evaluating.swiper-slide-active {
          width: 83%!important;
        }
        .swiper-slide::-webkit-scrollbar { /*滚动条整体样式*/
          width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
          height: 1px;
          scrollbar-arrow-color:#fff;
        }
        .swiper-slide::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
          background: rgba(0,0,0,0);
          scrollbar-arrow-color:#fff;
        }
        .swiper-slide::-webkit-scrollbar-track {/*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
          border-radius: 0;
          background: rgba(0,0,0,0);
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
    .mother-sentence-box {
      .mother-grade {
        .grade-color {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .sentence {
            font-size:18px;
            font-weight:500;
            color:#3c5b6f;
            span {
              font-size:18px;
              font-weight:500;
              color:#3c5b6f;
            }
          }
        }
      }
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
    ul {
      li {
        .li-item {
          padding: 16px 0 14px;
          border-top: 1px solid rgba(151, 151, 151, .13);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .review-item {
          .core-word {
            display: flex;
            align-items: center;
            .word {
              font-size: 18px;
              font-weight: 500;
              line-height: 28px;
              color: #3C5B6F;
              margin-right: 10px;
            }
          }
        }
      }
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
