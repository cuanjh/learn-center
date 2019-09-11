<template>
   <div class="video-container" v-show="isShow">
    <div class="video-content">
      <div class="kid-video-box">
        <video id="myVideo" controls="controls" autoplay="autoplay" ref='video'>
          <!-- <source id="video-source" src="http://vjs.zencdn.net/v/oceans.mp4" type="video/mp4"> -->
        </video>
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
            <li v-for="(item, index) in songs" :key="index" @click="playSong(item)" :class="{'active':item.code == currentVideo.code}">
              <div class="img-box">
                <img :src="item.image" alt="">
              </div>
              <p class="text">
                <span>{{item.title}}</span>
                <span>{{convertTimeMMSS(item.sound_time)}}</span>
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
// import { mapActions } from 'vuex'
import Bus from '../../../bus'

export default {
  data () {
    return {
      isShow: false,
      isActive: 'hello',
      songs: [],
      songsAll: [],
      currentVideo: {}
    }
  },
  created () {
    Bus.$on('showSongsModal', (data) => {
      console.log('儿歌详情data===>', data)
      this.songsAll = data
      this.songs = data.hello
      this.currentVideo = data.hello[0]
      this.$refs.video.src = data.hello[0].sound
      this.isShow = true
    })
  },
  mounted () {
  },
  methods: {
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
      this.$refs.video.src = itemvideo.sound
      $('#myVideo')[0].play()
    },
    convertTimeMMSS (seconds) {
      return new Date(seconds * 1000).toISOString().substr(14, 5)
    },
    // 关闭蒙层
    closeModal () {
      this.isShow = false
      $('#myVideo')[0].pause()
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
  .video-content {
    position: absolute;
    top: 50%;
    left: 50%;
    background:rgba(255,255,255,1);
    border-radius:5px;
    border:1px solid rgba(151,151,151,1);
    transform: translate(-50%, -50%);
    padding: 36px;
    display: flex;
    justify-content: space-between;
    .kid-video-box {
      width: 728px;
      display: flex;
      flex: 1;
      .video-player{
        width: 728px!important;
        height: 100%;
        display: block;
      }
      .video-js.vjs-fluid, .video-js.vjs-16-9, .video-js.vjs-4-3 {
        height: 604px!important;
      }
      .vjs_video_4926-dimensions.vjs-fluid {
        padding-top: 0!important;
      }
    }
    .kid-video-box #myVideo {
      width: 100%;
      height: 100%;
      outline: none;
    }
    .right-list {
      display: flex;
      flex-direction: column;
      width: 400px;
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
        ul {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 24px 20px;
          li {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            border-radius: 5px;
            &:hover {
              cursor: pointer;
              background: rgba(74, 144, 226, .5);
              .text {
                color: #fff;
              }
            }
            &.active {
              background: rgba(74, 144, 226, .7);
              .text {
                color: #fff;
              }
            }
            .img-box {
              width: 160px;
              height: 86px;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 5px
              }
            }
            .text {
              font-size: 16px;
              display: flex;
              flex: 1;
              flex-direction: column;
              justify-content: center;
              padding-left: 18px;
              font-size:14px;
              font-weight:400;
              color:rgba(155,155,155,1);
              span:nth-child(1) {
                padding-bottom: 10px;
                font-size: 20px;
              }
            }
          }
        }
      }
    }
  }
  .icon-close {
    position: absolute;
    top: -48px;
    right: -26px;
    width: 40px;
    height: 40px;
    background: url('../../../../static/images/icon-cloce.png') no-repeat center;
    background-size: cover;
    cursor: pointer;
  }
}
</style>
