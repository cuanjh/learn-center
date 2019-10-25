<template>
   <div class="video-container">
    <div class="video-content" id="video-content">
      <div class="kid-video-box">
        <video id="myVideo" @ended.native="end()" autoplay="autoplay" :src="currentVideo.sound + '&v=2'"></video>
        <div class="controls">
          <div id="voice-player-progress" class="progress" >
            <i class="progress-load" style="width: 0%;"></i>
            <i class="progress-cur"  :style="{'width': curProgress + 'px'}">
              <span id="progressCurBtn"
                    class="progress-btn"
                    @mousedown="onMouseDownProgress($event)"
                    :style="{'left': curProgress + 'px'}">
              </span>
            </i>
          </div>
          <div class="left-btns">
            <a href="javascript:;" class="play-btn" @click="play()">
              <i class="icon-play" v-if="!isPlay"></i>
              <i class="icon-pause" v-if="isPlay"></i>
            </a>
            <a href="javascript:;" class="play-next"  @click="next()"></a>
            <div class="playtime" v-if="currentVideo">
              <span>{{toParseTime(curTime)}} </span>
              <span>&nbsp;/&nbsp;</span>
              <span>{{toParseTime(currentVideo.sound_time)}}</span>
            </div>
          </div>
          <div class="full-screen" @click="fullScreen()">
            <a href="javascript:;"></a>
          </div>
        </div>
      </div>
      <div class="right-list">
        <div class="top-tabs">
          <div class="item " @click="tabChange('hello')" v-bind:class="{'active': 'hello' == isActive}">
            <a href="javascript:;">hello</a>
          </div>
          <div class="item" @click="tabChange('goodbye')" v-bind:class="{'active': 'goodbye' == isActive}">
            <a href="javascript:;">goodbye</a>
          </div>
        </div>
        <div class="song-content">
          <ul>
            <li v-for="(item, index) in songs"
                :key="index"
                @click="playSong(item)"
                :class="{'active':item.code == currentVideo.code}">
              <div class="img-box">
                <img :src="item.image" alt="">
              </div>
              <p class="text">
                <span>{{item.title}}</span>
                <span>{{toParseTime(item.sound_time)}}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="icon-close" @click="closeModal()"></div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import { mapActions } from 'vuex'
import Bus from '../../../bus'

export default {
  data () {
    return {
      isActive: 'hello',
      songs: [],
      songsAll: [],
      currentVideo: {},
      isPlay: false, // 播放暂停按钮控制
      curTime: 0, // 当前的时间
      duration: 0, // 总时间
      isEnd: false,
      curProgress: 0, // 计算播放的长度的比值
      progressFlag: '',
      video: document.getElementById('myVideo'),
      curIndex: 0
    }
  },
  created () {
    Bus.$on('showSongsModal', (data) => {
      let sessSongs = JSON.parse(sessionStorage.getItem('sessionSongsAll'))
      if (!sessSongs) {
        this.initSongs(data)
      } else {
        this.songsAll = sessSongs
        this.songs = sessSongs.hello
        this.currentVideo = sessSongs.hello[0]
        this.video = $('#myVideo')[0]
        this.$nextTick(() => {
          this.play()
        })
      }
    })
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'getKidCourseContent' // 儿歌
    ]),
    initSongs (code) {
      this.getKidCourseContent({chapter_code: code}).then(res => {
        console.log('儿歌返回==》', res)
        if (res.success) {
          this.curIndex = 0
          this.songsAll = res.teacherContent.songs
          sessionStorage.setItem('sessionSongsAll', JSON.stringify(this.songsAll))
          this.songs = res.teacherContent.songs.hello
          this.currentVideo = res.teacherContent.songs.hello[this.curIndex]
          this.video = $('#myVideo')[0]
          this.$nextTick(() => {
            this.play()
          })
        }
      })
    },
    tabChange (tabActive) {
      this.isActive = tabActive
      if (this.isActive === 'hello') {
        this.songs = this.songsAll.hello
      } else {
        this.songs = this.songsAll.bye
      }
    },
    playSong (itemvideo) {
      console.log(itemvideo)
      this.currentVideo = itemvideo
      this.curIndex = itemvideo.order - 1
      this.video.pause()
      this.video.currentTime = 0
      this.play()
    },
    // 点击播放
    play () {
      if (this.video.paused || this.video.ended) {
        if (this.video.ended) {
          this.isPlay = false
          this.video.currentTime = 0
        }
        this.isPlay = true
        this.progressFlag = setInterval(this.getProgress, 60)
        this.$nextTick(() => {
          this.video.play()
        })
      } else {
        this.video.pause()
        this.isPlay = !this.isPlay
        clearInterval(this.progressFlag)
      }
    },
    end () {
      console.log('video播完了')
      this.isPlay = false
      this.video.pause()
      this.video.currentTime = 0
      this.curProgress = $('#voice-player-progress').width()
      this.isEnd = true
    },
    // 点击next
    next () {
      this.curIndex++
      console.log(this.curIndex)
      console.log(this.songs)
      let lastLength = this.songs.length
      if (this.curIndex === lastLength) {
        this.curIndex = 0
      }
      this.currentVideo = this.songs[this.curIndex]
      this.isPlay = !this.isPlay
      this.video.pause()
      this.video.currentTime = 0
      this.play()
      console.log(this.currentVideo)
    },
    // 点击全屏
    fullScreen () {
      this.video.webkitRequestFullScreen()
    },
    getProgress () {
      let percent = this.video.currentTime / this.video.duration
      this.curProgress = percent.toFixed(4) * ($('#voice-player-progress').width() - 10)
      this.curTime = this.video.currentTime
      if (this.curTime === this.video.duration) {
        this.isPlay = false
        this.next()
      }
    },
    onMouseDownProgress (ev) {
      let _this = this
      let progressWidth = $('#voice-player-progress').width()
      let progressCur = document.getElementById('progressCurBtn')
      let oevent = ev || event
      let distanceX = oevent.clientX - progressCur.offsetLeft
      document.onmousemove = (ev) => {
        let oevent = ev || event
        let left = oevent.clientX - distanceX
        if (left < 0) {
          left = 0
        }
        if (progressWidth >= left) {
          _this.curProgress = left
        } else {
          _this.curProgress = progressWidth
        }
        let time = left / progressWidth * _this.video.duration
        if (time > _this.video.duration) {
          time = _this.video.duration
        }
        _this.curTime = time
        _this.setCurrentTime(_this.curTime)
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
      return false
    },
    setCurrentTime (time) {
      this.video.currentTime = time
    },
    // 关闭蒙层
    closeModal () {
      this.isPlay = false
      this.video.pause()
      this.video.currentTime = 0
      this.isActive = 'hello'
      this.songsAll = []
      this.songs = []
      this.curIndex = 0
      this.$emit('closeModal')
      // sessionStorage.removeItem('sessionSongsAll')
    },
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
    }
  }
}
</script>
<style lang="less" scoped>
.video-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1050;
  overflow: hidden;
  outline: 0;
  background: rgba(51,51,51,.39);
  // padding: 100px 130px;
  .video-content {
    position: absolute;
    top: 55%;
    left: 50%;
    background:rgba(255,255,255,1);
    border-radius:5px;
    border:1px solid rgba(151,151,151,1);
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;
    width: 80%;
    height: 70%;
    padding: 20px;
    .kid-video-box {
      position: relative;
      // width: 728px;
      width: 70%;
      padding-bottom: 54px;
      .controls {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 54px;
        background: #4A90E2;
        padding: 0 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        .left-btns {
          display: flex;
          align-items: center;
          a, i {
            &:hover {
              opacity: .8;
            }
          }
          .play-btn {
            display: inline-block;
            width: 20px;
            height: 20px;
            .icon-play {
              display: inline-block;
              width: 20px;
              height: 20px;
              background: url('../../../../static/images/kidcontent/icon-play.png') no-repeat center;
              background-size: cover;
            }
            .icon-pause {
              display: inline-block;
              width: 20px;
              height: 20px;
              background: url('../../../../static/images/kidcontent/icon-pause.png') no-repeat center;
              background-size: cover;
            }
          }
          .play-next {
            display: inline-block;
            width: 24px;
            height: 24px;
            background: url('../../../../static/images/kidcontent/icon-next.png') no-repeat center;
            background-size: cover;
            margin: 0 20px;
          }
          .playtime {
            font-size:20px;
            font-weight:500;
            color:rgba(255,255,255,1);
          }
        }
        .full-screen {
          width: 24px;
          height: 24px;
          a {
            display: inline-block;
            width: 24px;
            height: 24px;
            background: url('../../../../static/images/kidcontent/icon-full-screen.png') no-repeat center;
            background-size: cover;
            &:hover {
              opacity: .8;
            }
          }
        }
        .progress {
          display: inline-block;
          position: absolute;
          top: -4px;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: rgba(255, 255, 255, .2);
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
            background-color: #FFB131;
            z-index: 1;
            .progress-btn{
              position: absolute;
              right: -5px;
              top: -4px;
              font-size: 0;
              background-color: #FFB131;
              height: 10px;
              width: 10px;
              border-radius: 50%;
              cursor: pointer;
            }
          }
        }
      }
    }
    .kid-video-box #myVideo {
      width: 100%;
      // height: 546px;
      height: 100%;
      outline: none;
      object-fit: fill;
    }
    .right-list {
      display: flex;
      flex-direction: column;
      // width: 400px;
      flex: 1;
      margin-left: 20px;
      .top-tabs {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        background:#fff;
        box-shadow:0px 0px 6px 2px rgba(0,0,0,0.19);
          border-radius:5px;
        .item {
          width: 50%;
          text-align: center;
          padding: 10px 0;
          border-radius: 5px 0 0 5px;
          &:hover {
            background:rgba(255,255,255,.5);
            a {
              color: #4a90e2;
            }
          }
          &.active {
            background:#4A90E2;
            a {
              color:#fff;
            }
          }
          a {
            display: inline-block;
            font-size:20px;
            font-weight:400;
            color:#9B9B9B;
          }
        }
        .item:last-child {
          border-radius: 0px 5px 5px 0px;
        }
      }
      .song-content {
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 6px 2px rgba(0,0,0,0.15);
        border-radius:5px;
        display: flex;
        flex: 1;
        height: 100%;
        ul {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 12px 0;
          overflow-y: auto;
          li {
            display: flex;
            align-items: center;
            // margin-bottom: 10%;
            // border-radius: 5px;
            padding: 12px 20px;
            &:hover {
              cursor: pointer;
              .text {
                color: #4A90E2;
              }
            }
            &.active {
              background: #EDF4FC;
              .text {
                color: #4A90E2;
              }
            }
            .img-box {
              width: 100px;
              height: 100%;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 5px
              }
            }
            .text {
              font-size: 14px;
              display: flex;
              flex: 1;
              flex-direction: column;
              justify-content: center;
              padding-left: 18px;
              font-size:14px;
              font-weight:400;
              color:rgba(155,155,155,1);
              span:nth-child(1) {
                display: inline-block;
                height: 40px;
                font-size: 18px;
                font-weight: 500;
                line-height: 20px;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              span:nth-child(2) {
                padding-top: 10px;
              }
            }
          }
          li:last-child {
            margin-bottom: 0px;
          }
        }
        /*滚动条样式*/
        ul::-webkit-scrollbar {/*滚动条整体样式*/
          width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
        }
        ul::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px #fff;
          background: #EEF2F3;
        }
        ul::-webkit-scrollbar-track {/*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,1);
          border-radius: 0;
          background: rgba(255,255,255,1);
        }
      }
    }
  }
  .icon-close {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 30px;
    height: 30px;
    background: url('../../../../static/images/icon-close-img.png') no-repeat center;
    background-size: cover;
    cursor: pointer;
    z-index: 999;
    &:hover {
      background: url('../../../../static/images/icon-close-img-active.png') no-repeat center;
      background-size: cover;
    }
  }
}
</style>
