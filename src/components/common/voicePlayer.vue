<template>
  <div class="voice-player-container">
    <svg width="311px" height="56px" viewBox="0 0 311 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <symbol id="icon-pre">
        <path d="M6.33319667,3.41145465 L14.3801704,2.10706879 C14.8680347,2.02798773 15.3276347,2.35937199 15.4067158,2.84723626 C15.4226261,2.94538963 15.4220666,3.04550838 15.4050603,3.14347781 L14.01417,11.1560769 C13.9296413,11.6430269 13.4663664,11.9692538 12.9794164,11.8847252 C12.7965004,11.8529732 12.6279877,11.7651179 12.4972254,11.6333314 L5.84114196,4.92511821 C5.49303293,4.57428282 5.49524308,4.00767643 5.84607846,3.6595674 C5.97859699,3.52807868 6.1489192,3.44132538 6.33319667,3.41145465 Z" id="Rectangle-2-Copy-2" transform="translate(10.499793, 6.996471) scale(-1, 1) rotate(-315.000000) translate(-10.499793, -6.996471) " fill="#ffffff"></path>
        <rect id="Rectangle-Copy-2" x="2" y="2.22727273" width="1.59163987" height="9.54545455" rx="0.795819936" fill="#ffffff"></rect>
      </symbol>
      <!-- <g id="pause" transform="translate(79.000000, 13.000000)">
          <circle id="Oval-18" stroke="#FFFFFF" stroke-width="1.36363636" cx="15" cy="15" r="15.6818182"></circle>
          <g id="Group-14" transform="translate(11.000000, 10.000000)" fill="#FFFFFF">
              <rect id="Rectangle-38" x="0" y="0" width="2" height="10" rx="1"></rect>
              <rect id="Rectangle-38-Copy" x="6" y="0" width="2" height="10" rx="1"></rect>
          </g>
      </g>
      <g id="play" transform="translate(39.000000, 13.000000)">
          <circle id="Oval-18" stroke="#FFFFFF" stroke-width="1.36363636" cx="15" cy="15" r="15.6818182"></circle>
          <path d="M8.67272323,10.4870796 L18.1759454,8.88983165 C18.9186438,8.76500309 19.6219133,9.26588555 19.7467419,10.0085839 C19.7718912,10.158216 19.7718912,10.3109961 19.7467419,10.4606281 L18.1494939,19.9638503 C18.0246653,20.7065487 17.3213958,21.2074312 16.5786974,21.0826026 C16.2990443,21.0356001 16.0410012,20.9025829 15.840483,20.7020647 L7.9345088,12.7960905 C7.40197568,12.2635574 7.40197568,11.4001506 7.9345088,10.8676175 C8.135027,10.6670993 8.39307013,10.5340822 8.67272323,10.4870796 Z" id="Rectangle-33" fill="#FFFFFF" transform="translate(13.636364, 15.000210) rotate(-315.000000) translate(-13.636364, -15.000210) "></path>
      </g>
      <g id="next" transform="translate(119.000000, 21.000000)" fill="#FFFFFF">
          <path d="M3.33360989,3.41145465 L11.3805836,2.10706879 C11.8684479,2.02798773 12.3280479,2.35937199 12.407129,2.84723626 C12.4230393,2.94538963 12.4224798,3.04550838 12.4054735,3.14347781 L11.0145832,11.1560769 C10.9300545,11.6430269 10.4667796,11.9692538 9.97982964,11.8847252 C9.79691364,11.8529732 9.62840093,11.7651179 9.49763861,11.6333314 L2.84155517,4.92511821 C2.49344614,4.57428282 2.49565629,4.00767643 2.84649167,3.6595674 C2.97901021,3.52807868 3.14933241,3.44132538 3.33360989,3.41145465 Z" id="Rectangle-2-Copy" transform="translate(7.500207, 6.996471) rotate(-315.000000) translate(-7.500207, -6.996471) "></path>
          <rect id="Rectangle-Copy" x="14.4083601" y="2.22727273" width="1.59163987" height="9.54545455" rx="0.795819936"></rect>
      </g>
      <g id="volume" transform="translate(147.000000, 20.000000)" stroke="#FFFFFF" stroke-linecap="round" stroke-width="1.5">
          <polygon id="Rectangle-11" stroke-linejoin="round" points="0.769042969 3.96923828 4.33996582 3.96923828 9.42712402 0.787841797 9.42712402 15.2797852 4.33996582 12.0783691 0.769042969 12.0783691"></polygon>
          <path d="M18.6568542,12 C18.6568542,9.62458252 17.6215555,7.49097203 15.9775663,6.02577685 C14.5637346,4.76570808 12.6997148,4 10.6568542,4" id="Oval-8" transform="translate(14.656854, 8.000000) rotate(45.000000) translate(-14.656854, -8.000000) "></path>
          <path d="M14.8284271,10.1715729 C14.8284271,8.98386414 14.3107777,7.91705889 13.4887832,7.1844613 C12.7818673,6.55442692 11.8498574,6.17157288 10.8284271,6.17157288" id="Oval-8" transform="translate(12.828427, 8.171573) rotate(45.000000) translate(-12.828427, -8.171573) "></path>
      </g>
      <g id="loop" transform="translate(178.000000, 20.000000)" stroke="#FFFFFF" stroke-linecap="round" stroke-width="1.5">
          <g id="Group-7">
              <path d="M9.77777778,0.444444444 L12,2.66666667" id="Line"></path>
              <path d="M9.55555556,2.66666667 L15.1193416,2.66666667 C18.4285045,2.66666667 21.1111111,5.45245045 21.1111111,8.88888889 C21.1111111,12.3253273 18.4285045,15.1111111 15.1193416,15.1111111 M15.5555556,15.1111111 C14.8975336,15.1111111 9.13251987,15.1111111 6.7543036,15.1111111 C3.26946461,15.1111111 0.444444444,12.3253273 0.444444444,8.88888889 C0.444444444,5.45245045 3.26946461,2.66666667 6.7543036,2.66666667 L7.20500782,2.66666667" id="Rectangle-61" transform="translate(10.777778, 8.888889) scale(-1, 1) translate(-10.777778, -8.888889) "></path>
          </g>
      </g>
      <g id="single" transform="translate(210.000000, 20.000000)">
          <g id="Group-7">
              <path d="M9.77777778,0.444444444 L12,2.66666667" id="Line" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M9.55555556,2.66666667 L15.1193416,2.66666667 C18.4285045,2.66666667 21.1111111,5.45245045 21.1111111,8.88888889 C21.1111111,12.3253273 18.4285045,15.1111111 15.1193416,15.1111111 M15.5555556,15.1111111 C14.8975336,15.1111111 9.13251987,15.1111111 6.7543036,15.1111111 C3.26946461,15.1111111 0.444444444,12.3253273 0.444444444,8.88888889 C0.444444444,5.45245045 3.26946461,2.66666667 6.7543036,2.66666667 L7.20500782,2.66666667" id="Rectangle-61" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" transform="translate(10.777778, 8.888889) scale(-1, 1) translate(-10.777778, -8.888889) "></path>
              <text id="1" font-family="PingFangSC-Regular, PingFang SC" font-size="10.6666667" font-weight="normal" letter-spacing="0.190476179" fill="#FFFFFF">
                  <tspan x="8" y="11.8888889">1</tspan>
              </text>
          </g>
      </g>
      <g id="list" transform="translate(242.000000, 22.000000)" fill="#FFFFFF">
          <rect id="Rectangle-60" x="2.94736842" y="0" width="12.6315789" height="1.5" rx="0.75"></rect>
          <rect id="Rectangle-60" x="2.94736842" y="5.63333333" width="12.6315789" height="1.5" rx="0.75"></rect>
          <rect id="Rectangle-60" x="2.94736842" y="11.2666667" width="12.6315789" height="1.5" rx="0.75"></rect>
          <rect id="Rectangle-60-Copy" x="0" y="0" width="2.10526316" height="1.5" rx="0.75"></rect>
          <rect id="Rectangle-60-Copy-2" x="0" y="5.63333333" width="2.10526316" height="1.5" rx="0.75"></rect>
          <rect id="Rectangle-60-Copy-3" x="0" y="11.2666667" width="2.10526316" height="1.5" rx="0.75"></rect>
      </g>
      <g id="locked" transform="translate(268.000000, 23.000000)">
          <path d="M0.920127796,4 L8.0798722,4 C8.58804475,4 9,4.41195525 9,4.9201278 L9,10.0798722 C9,10.5880448 8.58804475,11 8.0798722,11 L0.920127796,11 C0.411955246,11 -4.87891139e-17,10.5880448 -1.11022302e-16,10.0798722 L1.11022302e-16,4.9201278 C4.87891139e-17,4.41195525 0.411955246,4 0.920127796,4 Z" id="Rectangle-6" fill="#FFFFFF"></path>
          <path d="M1.59790039,6 L1.59790039,3 C1.59790039,1.34314575 2.94104614,0 4.59790039,0 C6.25475464,0 7.59790039,1.34314575 7.59790039,3 L7.59790039,6" id="Rectangle-7" stroke="#FFFFFF" stroke-width="0.920127796"></path>
      </g>
      <g id="unlocked" transform="translate(287.000000, 22.000000)">
          <path d="M4.9201278,5 L12.0798722,5 C12.5880448,5 13,5.41195525 13,5.9201278 L13,11.0798722 C13,11.5880448 12.5880448,12 12.0798722,12 L4.9201278,12 C4.41195525,12 4,11.5880448 4,11.0798722 L4,5.9201278 C4,5.41195525 4.41195525,5 4.9201278,5 Z" id="Rectangle-6" fill="#FFFFFF"></path>
          <path d="M0.597900391,6 L0.597900391,3 C0.597900391,1.34314575 1.94104614,0 3.59790039,0 C4.98923582,0 6.15935279,0.947148813 6.49865476,2.2318499" id="Rectangle-7" stroke="#FFFFFF" stroke-width="0.920127796" stroke-linecap="round" stroke-linejoin="round" transform="translate(3.548278, 3.000000) scale(-1, 1) translate(-3.548278, -3.000000) "></path>
      </g> -->
    </svg>
    <div class="voice-player" :style="{'bottom': isLock ? '0' : '-50px'}">
      <div class="voice-player-hand"></div>
      <div class="box-shadow-wrapper">
        <div class="voice-player-lock">
          <a :class="{'locked': isLock, 'unlocked': !isLock}" @click="isLock = !isLock"></a>
        </div>
      </div>
      <div class="voice-player-wrapper">
        <a href="javascript:;" class="voice-player-cover">
          <img :src="curRadio.cover_url" alt="">
        </a>
        <div class="btns">
          <a class="pre" @click="pre()">
            <svg width="20" height="20">
              <!-- <use xlink:href="#icon-pre"></use> -->
            </svg>
          </a>
          <a :class="{'play': !isPlay, 'pause': isPlay}" @click="play()"></a>
          <a class="next" @click="next()"></a>
        </div>
        <div class="play-body">
          <div class="play-body-title">
            <span v-text="curRadio.title"></span>
          </div>
          <div class="play-body-progress">
            <div class="progress">
              <i class="progress-load" style="width: 0%;"></i>
              <i class="progress-cur" :style="{'width': curProgress}">
                <span class="progress-btn">
                </span>
              </i>
            </div>
            <div class="playtime">
              <span>00:{{toParseTime(curTime)}}</span>
              <!-- 00:{{toParseTime(curTime)}} -->
              <span>/</span>
              <span>00:{{toParseTime(duration)}}</span>
            </div>
          </div>
        </div>
        <div class="play-controls">
          <div class="player-volume-wrapper" v-show="isShowVolume">
            <div class="player-volume">
              <div class="player-volume-progress" ref="trunk">
                <i class="player-volume-cur" :style="{'height': volumeHeight}">
                  <span class="player-volume-btn"  @mousemove="moveVolume($event)">
                  </span>
                </i>
              </div>
            </div>
          </div>
          <a class="volume" @click="isShowVolume = !isShowVolume"></a>
          <a :class="{'sort': isLoop, 'single': !isLoop}" @click="loopPlay()"></a>
          <a class="list" @click="isShowList = !isShowList"></a>
        </div>
      </div>
    </div>
    <div class="voice-player-list" v-show="isShowList">
      <div class="voice-player-list-head clearfix">
        <h4>播放列表({{radioList.length}})</h4>
      </div>
      <div class="voice-overflow">
        <div class="voice-player-list-content">
          <ul>
            <li class="clearfix" v-for="(card, index) in radioList" :key="index" @click="goPlay(index)">
              <div class="col1" v-text="index + 1"></div>
              <div class="col2" :class="{'current': index === curIndex}" v-text="card.title"></div>
              <div class="col3" v-text="toParseTime(card.sound_time)"></div>
            </li>
          </ul>
        </div>
      </div>
      <!-- <div class="voice-player-list-content">
        <ul>
          <li class="clearfix" v-for="(card, index) in radioList" :key="index" @click="goPlay(index)">
            <div class="col1" v-text="index + 1"></div>
            <div class="col2" :class="{'current': index === curIndex}" v-text="card.title"></div>
            <div class="col3" v-text="toParseTime(card.sound_time)"></div>
          </li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import $ from 'jquery'
import Bus from '../../bus'
import SoundCtrl from '../../plugins/soundCtrl'

export default {
  data () {
    return {
      listOrder: 1, // 排序方向， 默认值是1＝从小到大;-1=从大到小
      page: 1, // 页码， 默认值是1
      pageSize: 16, // 每一页的数量，默认值是16
      radioList: [],
      curRadio: {},
      curIndex: 0,
      curTime: 0,
      curProgress: 0,
      interval: null,
      duration: 0,
      isPlay: false,
      isEnd: false,
      isShowVolume: false,
      isShowList: false,
      isLoop: true,
      isLock: true,
      tagVolume: false,
      thunk: null, // 拖拽DOM元素
      volumeHeight: '50%',
      sndctr: SoundCtrl
    }
  },
  created () {
    Bus.$on('getRadioCardList', (code) => {
      let params = {
        code: code,
        listOrder: this.listOrder,
        page: this.page,
        pageSize: this.pageSize
      }
      this.getRadioCardList(params).then((res) => {
        this.page = res.page
        if (res.cards.length > 0) {
          this.radioList = res.cards
          this.curIndex = 0
          this.playRadio()
        }
        console.log(res)
      })
    })

    Bus.$on('radioPlay', () => {
      this.play()
    })

    Bus.$on('radioPause', () => {
      this.pause()
    })
  },
  mounted () {
    this.thunk = this.$refs.trunk
    this.thunkBtn = this.$refs.trunk_btn
    this.thunk.onmousedown = (e) => {
      this.downVolume(e)
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
      return false
    }
  },
  methods: {
    ...mapActions({
      getRadioCardList: 'course/getRadioCardList'
    }),
    toParseTime (data) {
      let m = parseInt(data / 60)
      if (m < 10) {
        m = '0' + m
      }
      let s = Math.round(data % 60)
      if (s < 10) {
        s = '0' + s
      }
      return m + ':' + s
    },
    pre () {
      this.curIndex--
      if (this.curIndex < 0) {
        return
      }
      this.playRadio()
    },
    next () {
      this.curIndex++
      if (this.curIndex === this.radioList.length) {
        return
      }
      this.playRadio()
    },
    play () {
      if (this.isEnd) {
        this.curTime = 0
        this.isEnd = false
      }
      if (this.isPlay) {
        this.pause()
      } else {
        this.interval = setInterval(() => {
          this.curTime++
          this.curProgress = (this.curTime / this.duration).toFixed(4) * 100 + '%'
          console.log(this.curProgress)
        }, 1000)
        this.sndctr.play(() => {
          this.end()
        })
        this.isPlay = !this.isPlay
      }
    },
    end () {
      this.isPlay = false
      this.curProgress = '100%'
      this.isEnd = true
      clearInterval(this.interval)
      if (this.isLoop) {
        this.next()
      }
    },
    pause () {
      this.sndctr.pause()
      this.isPlay = false
      clearInterval(this.interval)
    },
    playRadio () {
      this.curRadio = this.radioList[this.curIndex]
      this.curTime = 0
      this.isEnd = false
      clearInterval(this.interval)
      this.sndctr.setSndCallback(this.curRadio.sound_url, () => {
        this.duration = Math.round(this.sndctr.getDuration())
        this.interval = setInterval(() => {
          this.curTime++
          this.curProgress = (this.curTime / this.duration).toFixed(4) * 100 + '%'
          // console.log(this.curProgress)
        }, 1000)
      })
      this.isPlay = true
      this.sndctr.play(() => {
        this.end()
        console.log('end')
        if (this.isLoop === false) {
          this.playRadio()
        }
      })
    },
    goPlay (index) {
      this.curIndex = index
      this.playRadio()
    },
    loopPlay () {
      this.isLoop = !this.isLoop
      // if (this.isEnd) {
      //   this.next()
      // }
    },
    moveVolume (e) {
      this.downVolume(e)
    },
    downVolume (e) {
      let height = $('.player-volume-progress').offset().top + 90 - e.pageY
      if (height > 90 || height < 0) {
        return
      }
      this.volumeHeight = (height * 1.0 / 90 * 100).toFixed(2) + '%'
      this.sndctr.setVolume(height * 1.0 / 90)
      console.log(height)
    }
  }
}
</script>

<style lang="less" scoped>

.voice-player-container {
  .voice-player {
    .voice-player-hand {
      position: absolute;
      left: 0;
      right: 0;
      height: 20px;
      top: -20px;
    }
    .box-shadow-wrapper {
      position: absolute;
      left: 0;
      right: 0;
      .voice-player-lock {
        position: absolute;
        right: 40px;
        top: -14px;
        width: 64px;
        height: 14px;
        background: url('./../../../static/images/discovery/radio-player-lock-bg.svg') center no-repeat;
        background-size: 100%;
        opacity: .95;
        text-align: center;
        cursor: pointer;
        z-index: 99;
        .locked {
          width: 10px;
          height: 10px;
          background-image: url('./../../../static/images/discovery/radio-player-locked.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          margin-top: 2px;
        }
        .unlocked {
          width: 10px;
          height: 10px;
          background-image: url('./../../../static/images/discovery/radio-player-unlock.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          margin-top: 2px;
        }
      }
    }
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: rgba(0, 57, 91, .8);
    z-index: 99;
    .voice-player-wrapper {
      width: 1200px;
      height: 100%;
      margin: 0 auto;
      padding: 0 40px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .voice-player-cover {
        width: 30px;
        height: 30px;
        background-image: url('./../../../static/images/discovery/radio-player-bg.png');
        background-repeat: no-repeat;
        background-size: cover;
        display: inline-block;
        vertical-align: middle;
        img {
          width: 30px;
          height: 30px;
          object-fit: cover;
        }
      }
      .btns {
        display: inline-block;
        .pre {
          width: 14px;
          height: 16px;
          background-image: url('./../../../static/images/discovery/radio-player-pre.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
          margin-left: 27px;
          fill: #f86442;
          cursor: pointer;
        }
        .play {
          width: 30px;
          height: 30px;
          background-image: url('./../../../static/images/discovery/radio-player-play.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
          margin-left: 20px;
          margin-right: 20px;
          cursor: pointer;
        }
        .pause {
          width: 30px;
          height: 30px;
          background-image: url('./../../../static/images/discovery/radio-player-pause.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
          margin-left: 20px;
          margin-right: 20px;
          cursor: pointer;
        }
        .next {
          width: 14px;
          height: 16px;
          background-image: url('./../../../static/images/discovery/radio-player-next.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
          cursor: pointer;
        }
      }
      .play-body{
        position: relative;
        width: 670px;
        margin-left: 35px;
        display: inline-block;
        .play-body-title{
          display: block;
          height: 36px;
          line-height: 36px;
          font-size: 12px;
          color: #ffffff;
        }
        .play-body-progress {
          display: flex;
          justify-content: space-between;
          .progress {
            display: inline-block;
            position: relative;
            width: 540px;
            height: 2px;
            background: transparent linear-gradient(to right,rgba(0,0,0,.85),rgba(0,0,0,.95));
            .progress-load {
              height: 100%;
              width: 0%;
              background-color: #a3a3ac;
              display: block;
            }
            .progress-cur {
              position: relative;
              left: 0;
              top: -2px;
              display: block;
              height: 100%;
              width: 0%;
              background-color: #FFD343;
              z-index: 1;
              .progress-btn{
                position: absolute;
                right: -5px;
                top: -4px;
                font-size: 0;
                background-color: #ffffff;
                height: 10px;
                width: 10px;
                border-radius: 50%;
                cursor: pointer;
              }
            }
          }
          .playtime {
            display: flex;
            line-height: 3px;
            font-size: 12px;
            color: #ffffff;
            margin-left: 10px;
            span {
              color: #D8D8D8;
            }
          }
        }
      }
      .play-controls {
        display: inline-block;
        margin-left: 100px;
        .volume {
          width: 18px;
          height: 16px;
          background-image: url('./../../../static/images/discovery/radio-player-volume.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
        }
        .sort {
          width: 22px;
          height: 16px;
          background-image: url('./../../../static/images/discovery/radio-player-sort.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
          margin-left: 20px;
        }
        .single {
          width: 22px;
          height: 16px;
          background-image: url('./../../../static/images/discovery/radio-player-single.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
          margin-left: 20px;
        }
        .list {
          width: 16px;
          height: 13px;
          background-image: url('./../../../static/images/discovery/radio-player-list.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
          margin-left: 20px;
          margin-top: 3px;
        }
        .player-volume-wrapper {
          position: absolute;
          bottom: 50px;
          margin-left: -18px;
          .player-volume {
            display: block;
            width: 46px;
            height: 134px;
            background-color: rgba(0, 57, 91, .8);
            .player-volume-progress {
              position: absolute;
              top: 16px;
              left: 50%;
              margin-left: -1px;
              width: 2px;
              height: 90px;
              background: #40404c;
              .player-volume-cur {
                position: absolute;
                left: 0;
                bottom: -2px;
                display: block;
                height: 0%;
                width: 100%;
                background-color: #f86442;
                .player-volume-btn {
                  position: absolute;
                  right: -4px;
                  top: -4px;
                  font-size: 0;
                  background-color: #ffffff;
                  height: 10px;
                  width: 10px;
                  border-radius: 50%;
                  cursor: pointer;
                }
              }
            }
            .player-volume-progress::before {
              content: "";
              cursor: pointer;
              height: 100%;
              width: 6px;
              top: 0;
              left: -7px;
              position: absolute;
              right: 0;
              bottom: 0;
            }
          }
        }
      }
    }
  }
  .voice-player-list {
    position: fixed;
    left: 50%;
    bottom: 50px;
    width: 1080px;
    margin-left: -540px;
    background: rgba(0,17,26,.8);
    box-shadow: 0 -2px 4px 0 rgba(0,0,0,.2);
    border-radius: 3px 3px 0 0;
    z-index: 90;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .voice-player-list-head {
      width: 1080px;
      padding: 0 20px;
      height: 55px;
      line-height: 55px;
      color: #fff;
      border-bottom: 1px solid rgba(163,163,172,.2);
      h4 {
        font-weight: 400;
        float: left;
        font-size: 20px;
        letter-spacing: 0;
      }
    }
    .clearfix {
      zoom: 1;
    }
    .voice-overflow {
      width: 1080px;
      overflow: hidden;
    }
    .voice-player-list-content {
      height: 260px;
      width: 1100px;
      overflow-y: auto;
      ul {
        overflow: hidden;
        li {
          cursor: pointer;
          height: 42px;
          line-height: 42px;
          -webkit-transition: all .2s;
          -o-transition: all .2s;
          transition: all .2s;
          font-size: 14px;
          .col1 {
            display: inline-block;
            text-align: center;
            color: #B4B4B4;
            width: 40px;
            text-align: center;
            margin-left: 10px;
          }
          .col2 {
            display: inline-block;
            width: 560px;
            color: #fff;
            margin-left: 45px;
          }
          .col3 {
            float: right;
            margin-right: 30px;
            color: #a3a3ac;
          }
          .current {
            color: #FFD343;
          }
        }
      }
    }
  }
}
</style>
