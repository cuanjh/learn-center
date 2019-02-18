<template>
  <div class="recommend-radio">
    <div class="recommend-content">
      <div class="recommend-content-left">
        <div class="round">
          <div class="bg-img">
            <img :src="randomRadioLists.cover" alt="">
          </div>
        </div>
        <div class="radio-text">
          <div class="radio-info">
            <p class="radio-name">{{randomRadioLists.title}}</p>
            <p class="author" v-if="randomRadioLists.user">
              <span>作者：{{randomRadioLists.user.nickname}}</span>
            </p>
          </div>
          <div class="radio-play">
            <div class="gradient-layer-play"  @click="loadRadioList($event, randomRadioLists)">
              <i class="play"></i>
            </div>
            <div class="swiper-list">
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
              <!-- <ul class="box">
                <li v-for="(radio, index) in randomRadioLists.cards" :key="index" :class="{'anim': animate}">
                  <div class="lists">
                    <span>{{radio.title}}</span>
                    <span>{{radio.description}}</span>
                  </div>
                </li>
              </ul> -->
            </div>
          </div>
        </div>
        <div class="subscribe">
          <span>订阅 {{randomRadioLists.buy_num}}万次</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from '../../bus.js'
import $ from 'jquery'
import vueSeamlessScroll from 'vue-seamless-scroll'

export default {
  props: ['randomRadio'],
  data () {
    return {
      animate: false,
      randomRadioLists: this.randomRadio,
      radioCardsLists: this.randomRadio.cards
    }
  },
  components: {
    vueSeamlessScroll
  },
  mounted () {
    console.log('randomRadioLists=====>', this.randomRadioLists)
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
    // 点击播放电台
    loadRadioList (e, radio) {
      console.log('e', e)
      console.log('radio', radio)
      if (this.isPlay && radio.code === this.lastCode) {
        $('.gradient-layer-play i').removeClass('pause')
        $(e.target).addClass('play')
        Bus.$emit('radioPause')
      } else {
        $('.gradient-layer-play i').removeClass('pause')
        $('.gradient-layer-play i').addClass('play')
        $(e.target).removeClass('play')
        $(e.target).addClass('pause')
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
          }
        }
      }
      .radio-text {
        padding-left: 22px;
        padding-right: 70px;
        border-right: 1px solid #d5dee7ff;
        .radio-info {
          .radio-name {
            font-size: 22px;
            color: #0a2b40ff;
            font-weight: bold;
            line-height: 30px;
            padding-bottom: 8px;
          }
          .author {
            font-size: 14px;
            color: #90a2aeff;
            line-height: 20px;
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
            .play {
              width: 36px;
              height: 36px;
              background-image: url("../../../static/images/tuijianradio.svg");
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
            }
            .pause {
              width: 36px;
              height: 36px;
              background-image: url("../../../static/images/tuijianradioplay.svg");
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
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
