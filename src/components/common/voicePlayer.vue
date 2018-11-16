<template>
  <div class="voice-player-container">
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
            <!-- <svg width="20" height="20">
              <image xlink:href="./../../../static/images/discovery/radio-player-pre.svg" width="20" height="20" />
            </svg> -->
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
              00:{{toParseTime(curTime)}}
              <span> / 00:{{toParseTime(duration)}}</span>
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
      <div class="voice-player-list-content">
        <ul>
          <li class="clearfix" v-for="(card, index) in radioList" :key="index">
            <div class="col1" v-text="index + 1"></div>
            <div class="col2" :class="{'current': index === curIndex}" v-text="card.title"></div>
            <div class="col3" v-text="toParseTime(card.sound_time)"></div>
          </li>
        </ul>
      </div>
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
          console.log(this.curProgress)
        }, 1000)
      })
      this.isPlay = true
      this.sndctr.play(() => {
        this.end()
        console.log('end')
      })
    },
    loopPlay () {
      this.isLoop = !this.isLoop
      if (this.isEnd) {
        this.next()
      }
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
            line-height: 3px;
            font-size: 12px;
            display: inline-block;
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
    .voice-player-list-head {
      margin: 0 20px;
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
    .voice-player-list-content {
      overflow-y: auto;
      height: 260px;
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
