<template>
  <div class="recommend-radio" v-show="isShow">
    <div class="recommend-content">
      <div class="recommend-content-left">
        <div class="round">
          <div class="bg-img">
            <img :src="randomRadio.cover" alt="">
          </div>
        </div>
        <div class="radio-text">
          <div class="radio-info">
            <p class="radio-name">{{randomRadio.title}}</p>
            <p class="author" v-if="randomRadio.user">
              <span>作者：{{randomRadio.user.nickname}}</span>
            </p>
          </div>
          <div class="radio-play" :id="randomRadio.code">
            <div class="gradient-layer-play"  @click="loadRadioList($event, randomRadio)">
              <i class="play"></i>
            </div>
            <div class="swiper-list" v-if="radioCardsLists">
              <vueSeamlessScroll :data="radioCardsLists" :class-option="defaultOption" class="seamless-warp">
                <ul class="box">
                  <li v-for="(radio, index) in radioCardsLists" :key="index">
                    <div class="lists">
                      <span>{{radio.title}}</span>
                      <span>{{radio.description}}</span>
                    </div>
                  </li>
                </ul>
              </vueSeamlessScroll>
            </div>
            <div class="no-cards" v-else>
              <span>暂时没有数据~~~</span>
            </div>
          </div>
        </div>
        <div class="subscribe">
          <span>订阅 {{randomRadio.buy_num}}万次</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from '../../bus.js'
import $ from 'jquery'
import vueSeamlessScroll from 'vue-seamless-scroll'
import { mapActions } from 'vuex'

export default {
  // props: ['randomRadio'],
  data () {
    return {
      animate: false,
      isShow: false,
      randomRadio: [],
      radioCardsLists: []
    }
  },
  components: {
    vueSeamlessScroll
  },
  mounted () {
    // 随机推荐单个电台
    this.getRandomRadio().then(res => {
      console.log('随机推荐单个电台', res)
      if (res.success) {
        this.isShow = true
        this.randomRadio = res.data
        this.radioCardsLists = this.randomRadio.cards
      } else {
        this.isShow = false
      }
    })
    console.log('randomRadioLists=====>', this.radioCardsLists)
  },
  updated () {
  },
  computed: {
    defaultOption () {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 2, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    }
  },
  methods: {
    ...mapActions([
      'getRandomRadio'
    ]),
    // 点击播放电台
    loadRadioList (e, radio) {
      if (this.isPlay && radio.code === this.lastCode) {
        $('.gradient-layer-play i').removeClass('pause')
        $(e.target, $('#' + radio.code)).addClass('play')
        Bus.$emit('radioPause')
      } else {
        $('.gradient-layer-play i').removeClass('pause')
        $('.gradient-layer-play i').addClass('play')
        $(e.target, $('#' + radio.code)).removeClass('play')
        $(e.target, $('#' + radio.code)).addClass('pause')
        if (radio.code !== this.lastCode) {
          Bus.$emit('getRadioCardList', radio)
          this.lastCode = radio.code
        } else {
          Bus.$emit('radioPlay')
        }
      }
      this.isPlay = !this.isPlay
    }
  }
}
</script>
<style lang="less" scoped>
.recommend-radio {
  width: 880px;
  margin-top: 8px;
  background-color: #eef2f3;
  .recommend-content {
    padding: 22px 0;
    width: 100%;
    height: 100%;
    background: url("../../../static/images/radiobg.png") no-repeat center;
    background-size: cover;
    .recommend-content-left {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 0 0 28px;
      .round {
        width: 140px;
        height: 140px;
        display: flex;
        justify-content: center;
        align-items: center;
        .bg-img {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 14px solid #0a2b40ff;
            border-color:linear-gradient(270deg,#3023AE14 0%,#51B3EC54 100%);
            object-fit: cover;
          }
        }
      }
      .radio-text {
        padding-left: 22px;
        padding-right: 70px;
        border-right: 1px solid #d5dee7ff;
        min-width: 66%;
        .radio-info {
          .radio-name {
            font-size: 22px;
            color: #0a2b40ff;
            width: 450px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            font-weight: bold;
            line-height: 30px;
            padding-bottom: 8px;
          }
          .author {
            font-size: 14px;
            color: #90a2aeff;
            line-height: 20px;
            font-weight: 400;
          }
        }
        .radio-play {
          padding-top: 26px;
          position: relative;
          display: flex;
          .gradient-layer-play {
            cursor: pointer;
            text-align: center;
            z-index: 2;
            padding-right: 14px;
            i {
              display: inline-block;
              width: 36px;
              height: 36px;
              background-repeat: no-repeat;
              background-size: cover;
            }
            .play {
              background-image: url("../../../static/images/tuijianradio.svg");
            }
            .pause {
              background-image: url("../../../static/images/tuijianradioplay.svg");
            }
          }
          .swiper-list {
            line-height: 36px;
            width: 372px;
            overflow: hidden;
            ul {
              display: flex;
              width: 372px;
              height: 36px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              li {
                padding-right: 20px;
                .lists {
                  span {
                    font-size: 14px;
                    color: #3c5b6fff;
                    padding-right: 10px;
                  }
                }
              }
            }
          }
          .no-cards {
            text-align: center;
            line-height: 36px;
          }
        }
      }
      .subscribe {
        position: relative;
        width: 160px;
        height: 140px;
        padding-left: 20px;
        span {
          position: absolute;
          bottom: 20px;
          font-size: 14px;
          color: #90a2aeff;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
