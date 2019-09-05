<template>
   <div class="video-container">
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
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      isActive: 'hello',
      songs: [],
      songsAll: [],
      currentVideo: {}
    }
  },
  mounted () {
    this.initKidContent()
  },
  methods: {
    ...mapActions({
      getKidCourseContent: 'getKidCourseContent'
    }),
    initKidContent () {
      this.getKidCourseContent({chapter_code: 'KEN-Basic-Level1-Unit1-Chapter1 '}).then(res => {
        console.log('kid内容返回====>', res)
        if (res.success) {
          console.log(this.currentVideo)
          this.songsAll = res.teacherContent.songs
          this.songs = res.teacherContent.songs.hello
          this.currentVideo = res.teacherContent.songs.hello[0]
          this.$refs.video.src = res.teacherContent.songs.hello[0].sound
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
      this.$refs.video.src = itemvideo.sound
      $('#myVideo')[0].play()
    },
    convertTimeMMSS (seconds) {
      return new Date(seconds * 1000).toISOString().substr(14, 5)
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
    width:1200px;
    height:656px;
    background:rgba(0,0,0,1);
    border:1px solid rgba(151,151,151,1);
    transform: translate(-50%, -50%);
    padding: 25px;
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
        .item {
          width: 46%;
          text-align: center;
          &:hover {
            background:rgba(51,51,51,1);
            border-radius:6px 0px 0px 6px;
            a {
              color: #4a90e2;
            }
          }
          &.active {
            background:rgba(51,51,51,1);
            border-radius:6px 0px 0px 6px;
            a {
              color:#4a90e2;
            }
          }
          a {
            display: inline-block;
            font-size:20px;
            font-weight:400;
            color:rgba(155,155,155,1);
          }
        }
      }
      .song-content {
        background: #333333;
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
            margin-bottom: 10px;
            margin-bottom: 36px;
            &:hover {
              cursor: pointer;
              background: rgb(68, 66, 66);
            }
            &.active {
              background: rgb(68, 66, 66);
            }
            .img-box {
              width: 160px;
              height: 86px;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
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
}
</style>
