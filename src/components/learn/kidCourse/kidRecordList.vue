<template>
  <div class="record-lists-container">
    <div class="header">
      <header>
        <div class="header-content">
          <div class="left">
            <a href="javascript:;"  class="balk-icon" @click="goKidStage()"></a>
            <p class="course-desc">
              <span>课程{{courseIndex}}</span>
              <span>{{type=='draw'?'绘本阅读':'绘本单词'}}</span>
            </p>
          </div>
          <share-box :type="typeNum"/>
        </div>
      </header>
    </div>
    <div class="record-lists">
      <div class="top-contant">
        <h1 >我的{{type=='draw'?'绘本':'单词'}}录音</h1>
        <!-- <button class="share" @click="shareRecord()">分享</button> -->
      </div>
      <div class="record-swiper">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in recordLists" :key="index">
              <div class="slide-content">
                <div class="record-img">
                  <img :src="item.image" alt="">
                  <audio preload="load" class="mother-sound" :id="'mother-sound'+index" :src="item.sound_url"></audio>
                </div>
                <div class="record-desc">
                  <p class="text">{{item.content || item.word}}</p>
                  <div class="record-playVoice-button">
                    <div class="play-box" @click="playMyRecord($event, index)">
                      <audio preload="load" class="record-sound" :id="'record-sound'+index" :src="item.record_sound_url"></audio>
                      <i :id="'loading'+index">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination" id="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import $ from 'jquery'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import ShareBox from '../../common/shareBox'
import Bus from '../../../bus'

export default {
  props: ['code', 'type', 'courseIndex'],
  data () {
    return {
      typeNum: '4',
      showShareBox: false,
      courseInfo: {
        code: '',
        title: '',
        text: '',
        flag: '',
        courseName: '',
        chapterCode: '',
        teacherModule: ''
      },
      recordLists: []
    }
  },
  components: {
    ShareBox
  },
  mounted () {
    console.log(this.code, this.type)
    this.initDataList()
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'getLearnInfoV5',
      'getkidRecordShare',
      'getKidRecordLists'
    ]),
    async initDataList () {
      // 录音列表
      let res = await this.getKidRecordLists({chapter_code: this.code, teacher_module: this.type})
      console.log(res)
      this.recordLists = res.records
      console.log('kid record Lists', this.recordLists)
      await this.swiperInit()
      // 1. 当前学习的语言课程
      let userInfo = await this.getUserInfo()
      console.log(userInfo)
      let curCourseCode = userInfo.info.current_course_code
      this.courseInfo.code = curCourseCode
      let shareContnt = await this.getkidRecordShare({course_code: curCourseCode, chapter_code: this.code, teacher_module: this.type})
      console.log(shareContnt)
      this.courseInfo.title = shareContnt.shareInfo.title
      this.courseInfo.text = shareContnt.shareInfo.content
      // 2.1 获取该课程的学习信息
      let kidInfo = await this.getLearnInfoV5({course_code: curCourseCode})
      console.log(kidInfo)
      this.courseInfo.flag = kidInfo.info.courseBaseInfo.flag
      this.courseInfo.courseName = kidInfo.info.courseBaseInfo.name
      this.courseInfo.chapterCode = this.code
      this.courseInfo.teacherModule = this.type
      console.log(this.courseInfo)
      Bus.$emit('shareCardContent', this.courseInfo)
    },
    swiperInit () {
      this.$nextTick(() => {
        /* eslint-disable */
        var mySwiper = new Swiper('.swiper-container', {
          loop: false,
          autoplay: false, //自动轮播
          speed: 1000,
          slidesPerView: "auto",
          centeredSlides:true,
          mousewheel: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          on:{
            init: function(){
              //Swiper初始化了
              console.log('当前的slide序号是'+this.activeIndex);
              console.log($('#record-sound0')[0])
              // $('#loading0').addClass('loading')
              // $('#record-sound0')[0].play()
              $('.play-box i').removeClass('loading')
              $('#loading' + this.activeIndex).addClass('loading')
              let audio = document.getElementById('record-sound' + this.activeIndex)
              audio.play()
              audio.onloadedmetadata = () => {
                audio.play()
              }
              audio.addEventListener('ended', () => {
                $('#loading' + this.activeIndex).removeClass('loading')
              }, false)
              this.emit('transitionEnd');//在初始化时触发一次transitionEnd事件，需要先设置transitionEnd
            },
            slideChange: function () {
              console.log('slideChange', this.activeIndex)
              $('#loading'+this.activeIndex).addClass('loading')
              $('#loading'+this.previousIndex).removeClass('loading')
              $('#record-sound'+this.activeIndex)[0].play()
              $('#record-sound'+(this.previousIndex))[0].pause()
              $('#record-sound'+(this.previousIndex))[0].currentTime = 0
              let audio = document.getElementById('record-sound' + this.activeIndex)
               audio.addEventListener('ended', () => {
                $('#loading' + this.activeIndex).removeClass('loading')
              }, false)
            }
          }
        })
        /* eslint-enable */
      })
    },
    goKidStage () {
      this.$router.push({path: '/kid-stage', query: {code: this.code, type: this.type, courseIndex: this.courseIndex}})
    },
    // 播放录音
    playMyRecord (e, index) {
      console.log(e, index)
      this.watchaudio(index)
    },
    watchaudio (index) {
      console.log(index)
      $('.play-box i').removeClass('loading')
      $('#loading' + index).addClass('loading')
      let audio = document.getElementById('record-sound' + index)
      audio.play()
      audio.onloadedmetadata = () => {
        audio.play()
      }
      audio.addEventListener('ended', () => {
        $('#loading' + index).removeClass('loading')
      }, false)
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  width: 100%;
  height: 62px;
  background: #fff;
  header {
    width: 100%;
    height: 62px;
    .header-content {
      padding: 0 80px;
      width: 100%;
      height: 62px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
      }
      .balk-icon {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: #EEF2F3;
        border-radius: 50%;
        margin-right: 26px;
      }
      .course-desc {
        font-size:17px;
        font-weight:600;
        color:rgba(60,91,111,1);
      }
    }
  }
}
.record-lists {
  .top-contant {
    text-align: center;
    position: relative;
    padding: 64px 126px;
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
      font-size:36px;
      font-weight:600;
      color:rgba(60,91,111,1);
    }
    .share {
      width:184px;
      height:74px;
      background:rgba(74,144,226,1);
      box-shadow:0px 34px 20px -29px rgba(74,144,226,0.81);
      border-radius:37px;
      font-size:36px;
      font-weight:600;
      color:rgba(255,255,255,1);
      position: absolute;
      right: 126px;
      &:hover{
        background: rgba(74,144,226,.8);
      }
    }
  }
}
.record-swiper {
  width: 100%;
  padding: 0 126px;
  .swiper-container {
    width: 100%;
    .swiper-wrapper {
      width: 100%;
      height: 100%;
    }
  }
}
.swiper-slide {
  width: 568px!important;
  min-height: 358px!important;
  border-radius:4px;
  background: #fff;
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
.swiper-slide .slide-content {
  width: 100%;
  height: 100%;
  .record-img {
    width: 568px;
    height: 217px;
    border-radius: 4px 4px 0 0;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px 4px 0 0;
      object-fit: cover;
    }
  }
  .record-desc {
    position: relative;
    .text {
      font-size:20px;
      font-weight:600;
      color:rgba(60,91,111,1);
      line-height:28px;
      padding: 22px 50px 0px 28px;
    }
    .record-playVoice-button {
      width: 100%;
      height: 50px;
      margin: 6px 30px 0;
      text-align: center;
      .play-box {
        display: inline-block;
        width: 50px;
        height: 50px;
        text-align: center;
      }
      i {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 50px;
        height: 50px;
        padding: 0 10px;
        background: #FFCE00;
        border-radius: 50%;
        margin: 0 auto;
        box-sizing: border-box;
        cursor: pointer;
        &.loading {
          opacity: 1;
        }
        span {
          display: inline-block;
          width: 3px;
          height: 8px;
          border-radius: 4px;
          background-color: #fff;
        }
        span:nth-child(2){
          height: 14px;
        }
        span:nth-child(3){
          height: 20px;
        }
        span:nth-child(4){
          height: 14px;
        }
      }
      i.loading span:nth-child(3) {
        animation: load3 0.7s ease infinite;
        -webkit-animation: load3 0.7s ease infinite;
        -ms-animation: load3 0.7s ease infinite;
        -moz-animation: load3 0.7s ease infinite;
        -o-animation: load3 0.7s ease infinite;
      }
      @keyframes load3 {
        0%, 100%{
          height: 26px;
        }
        50%{
          height: 20px;
        }
      }
      i.loading span:nth-child(2), i.loading span:nth-child(4) {
        animation: load2 0.7s ease infinite;
        -webkit-animation: load2 0.7s ease infinite;
        -ms-animation: load2 0.7s ease infinite;
        -moz-animation: load2 0.7s ease infinite;
        -o-animation: load2 0.7s ease infinite;
      }
      @keyframes load2 {
        0%, 100%{
          height: 20px;
        }
        50%{
          height: 14px;
        }
      }
      i.loading span:nth-child(1), i.loading span:nth-child(5) {
        animation: load1 0.7s ease infinite;
        -webkit-animation: load1 0.7s ease infinite;
        -ms-animation: load1 0.7s ease infinite;
        -moz-animation: load1 0.7s ease infinite;
        -o-animation: load1 0.7s ease infinite;
      }
      @keyframes load1 {
        0%, 100%{
          height: 14px;
        }
        50%{
          height: 8px;
        }
      }
    }
  }
}
.swiper-slide-prev {
  transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -webkit-transition: all 0.5s;
  -webkit-transform: scale(0.7,0.7);
  -moz-transform: scale(0.7,0.7);
  transform: scale(0.7,0.7);
  -webkit-overflow-scrolling:touch;
  position: relative;
}
.swiper-slide-prev .slide-content::after {
  position:absolute;
  left: 0;
  top:0;
  display: block;
  width:100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  content: attr(data-text);
  transition:all 1s ease;
  z-index: 2;
}
.swiper-slide-next {
  transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -webkit-transition: all 0.5s;
  -webkit-transform: scale(0.7,0.7);
  -moz-transform: scale(0.7,0.7);
  transform: scale(0.7,0.7);
  -webkit-overflow-scrolling:touch;
  position: relative;
  z-index: 1;
}
.swiper-slide-next .slide-content::after {
  position:absolute;
  left: 0;
  top:0;
  display: block;
  width:100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  content: attr(data-text);
  transition:all 1s ease;
  z-index: 2;
}
.swiper-slide-active {
  transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -webkit-transition: all 0.5s ease;
  -webkit-transform: scale(1,1);
  -moz-transform: scale(1,1);
  transform: scale(1,1);
  -webkit-overflow-scrolling:touch;
  box-shadow:0px 48px 37px -30px rgba(0,0,0,0.11);
}
.record-swiper #swiper-pagination {
  bottom: 70px;
  left: 50%;
  .swiper-pagination-bullet {
    outline:none;
    width: 20px !important;
    height: 6px !important;
    background: #D5DCDF !important;
    border-radius: 5px !important;
    transition: width 0.3s ease-in-out  !important;
    margin: 0 8px !important;
  }
  .swiper-pagination-bullet-active {
    width: 20px !important;
    height: 6px !important;
    background: #0581D1 !important;
    border-radius: 5px !important;
  }
}
</style>
