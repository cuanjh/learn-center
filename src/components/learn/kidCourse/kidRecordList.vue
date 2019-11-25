<template>
  <div class="record-lists-container">
    <div class="header">
      <div class="header-container">
        <div class="header-content">
          <div class="left">
            <a href="javascript:;"  class="balk-icon" @click="goKidStage()"></a>
            <p class="course-desc">
              <span>课程{{courseIndex}}</span>
              <span>{{type=='draw'?'绘本阅读':'绘本单词'}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="record-lists">
      <div class="top-contant">
        <h1 >我的{{type=='draw'?'绘本':'单词'}}录音</h1>
        <div class="share-record">
          <span>分享到：</span>
          <share-box class="this-share-box" :type="recordType" />
        </div>
        <!-- <button class="share" @click="shareRecord()">分享</button> -->
      </div>
      <div class="record-swiper">
        <div class="swiper-container">
          <div class="swiper-wrapper" :class="{'draw': type == 'draw'}">
            <div class="swiper-slide" v-for="(item, index) in recordLists" :key="index">
              <div class="slide-content">
                <div class="record-img" @click="playClik('record-sound'+index, 'loading'+index)">
                  <img v-if="type == 'draw'" :src="item.image | urlFix('imageView2/0/w/2000/h/900/format/jpg')" alt="">
                  <img v-else :src="item.image | urlFix('imageView2/0/w/858/h/618/format/jpg')" alt="">
                  <audio preload="load" class="mother-sound" :id="'mother-sound'+index" :src="item.sound_url"></audio>
                </div>
                <div class="record-desc">
                  <p class="text">{{item.content || item.word}}</p>
                  <div class="record-playVoice-button">
                    <div class="play-box">
                      <audio preload="load" @ended.native="audioEnd()" class="record-sound" :id="'record-sound'+index" :src="item.record_sound_url"></audio>
                      <i :id="'loading'+index" @click="playClik('record-sound'+index, 'loading'+index)">
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
          <div class="mouse-text" v-show="showMose"><i></i><span>上下滚动鼠标可切换页面</span></div>
          <!-- 如果需要分页器 -->
          <div class="swiper-pagination" id="swiper-pagination"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import $ from 'jquery'
import Bus from '../../../bus'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import ShareBox from '../../common/shareBox'

export default {
  name: 'kidRecordList',
  props: ['code', 'type'],
  data () {
    return {
      showMose: true,
      recordType: '4',
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
  computed: {
    courseIndex () {
      let arr = this.code.split('-')
      let num = (parseInt(arr[3].toLowerCase().replace('unit', '')) - 1) * 6 + parseInt(arr[4].toLowerCase().replace('chapter', ''))
      return num
    }
  },
  created () {
  },
  mounted () {
    console.log(this.code, this.type)
    setTimeout(() => {
      this.initDataList()
    }, 300)
    setTimeout(() => {
      this.showMose = false
    }, 3000)
    // 给页面绑定滑轮滚动事件
    if (document.addEventListener) { // firefox
      document.addEventListener('DOMMouseScroll', this.scrollFunc, false)
    }
    // 滚动滑轮触发scrollFunc方法  //ie 谷歌
    window.onmousewheel = document.onmousewheel = this.scrollFunc
  },
  updated () {
    this.resetStyle()
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'getLearnInfoV5',
      'getkidRecordShare',
      'getKidRecordList'
    ]),
    async initDataList () {
      // 录音列表
      let res = await this.getKidRecordList({chapter_code: this.code, teacher_module: this.type})
      this.recordLists = res.records
      console.log('kid record Lists', this.recordLists)
      await this.swiperInit()
      await this.mySwiper.init()
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
      this.resetStyle()
    },
    swiperInit () {
      let that = this
      /* eslint-disable */
      this.$nextTick(() => {
        that.mySwiper = new Swiper('.swiper-container', {
          loop: false,
          autoplay: false, //自动轮播
          slidesPerView: 3,
          initialSlide: 0,
          centeredSlides:true,
          slidesPerView: 'auto',
          observer: true,
          spaceBetween: 0,
          mousewheel: {
            releaseOnEdges: true,
          },
          slideToClickedSlide: true,
          allowTouchMove: false,
          autoHeight : true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          on:{
            init: function(){
              //Swiper初始化了
              console.log('当前的slide序号是'+this.activeIndex);
              console.log($('#record-sound0')[0])
              $('.play-box i').removeClass('loading')
              $('#loading' + this.activeIndex).addClass('loading')
              let audio = document.getElementById('record-sound' + this.activeIndex)
              audio.play()
              audio.onloadedmetadata = () => {
                audio.play()
              }
              audio.addEventListener('ended', () => {
                $('#loading' + this.activeIndex).removeClass('loading')
                that.mySwiper.slideNext()
              }, false)
            },
            slideChange: function () {
              console.log('slideChange', this.activeIndex)
              that.mySwiper.initialSlide = this.activeIndex
              let audio = document.getElementById('record-sound' + this.activeIndex)
              $('#loading'+this.activeIndex).addClass('loading')
              $('#loading'+this.previousIndex).removeClass('loading')
              $('#record-sound'+this.activeIndex)[0].play()
              $('#record-sound'+this.previousIndex)[0].pause()
              $('#record-sound'+this.previousIndex)[0].currentTime = 0
              audio.addEventListener('ended', () => {
                $('#loading' + this.activeIndex).removeClass('loading')
                that.mySwiper.slideNext()
              }, false)
            }
          }
        })
      })
      /* eslint-enable */
    },
    goKidStage () {
      this.$router.push({path: '/app/kid-stage', query: {code: this.code, type: this.type}})
    },
    // 播放录音
    playClik (id1, id2) {
      console.log(id1, id2)
      let audio = $('#' + id1)[0]
      let load = $('#' + id2)
      if (audio.paused) {
        audio.play()
        load.addClass('loading')
      } else {
        audio.pause()
        audio.currentTime = 0
        load.removeClass('loading')
      }
    },
    audioEnd () {
      $('.play-box i').removeClass('loading')
      this.mySwiper.slideNext()
    },
    // 播放母语
    // 点击图片播放母语音频
    playMother (e) {
      console.log(e)
      $('#' + e)[0].play()
    },
    resetStyle () {
      $('#swiper-pagination').find('.swiper-pagination-bullet').css({
        'width': '20px',
        'height': '6px',
        'border-radius': '6px',
        'margin-right': '8px'
      })
      $('#swiper-pagination').find('.swiper-pagination-bullet .swiper-pagination-bullet-active').css({
        'width': '20px',
        'height': '6px',
        'background': '#0581D1',
        'border-radius': '6px',
        'margin-right': '8px'
      })
    },
    scrollFunc (e) {
      e = e || window.event
      if (e.wheelDelta) { // 判断浏览器IE，谷歌滑轮事件
        if (e.wheelDelta > 0) { // 当滑轮向上滚动时
          this.showMose = false
        }
        if (e.wheelDelta < 0) { // 当滑轮向下滚动时
          this.showMose = false
        }
      } else if (e.detail) { // Firefox滑轮事件
        if (e.detail > 0) { // 当滑轮向上滚动时
          this.showMose = false
        }
        if (e.detail < 0) { // 当滑轮向下滚动时
          this.showMose = false
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.record-lists-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  width: 100%;
  height: 62px;
  background: #fff;
  .header-container {
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
        background: url('../../../../static/images/kidcontent/icon-back.png') no-repeat center;
        background-size: cover;
        border-radius: 50%;
        margin-right: 26px;
        &:hover {
          background: url('../../../../static/images/kidcontent/icon-back-active.png') no-repeat center;
          background-size: cover;
        }
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
  display: flex;
  flex-direction: column;
  flex: 1;
  .top-contant {
    text-align: center;
    padding: 5% 7%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    h1 {
      font-size:30px;
      font-weight:600;
      color:rgba(60,91,111,1);
    }
    .share-record {
      display: flex;
      position: absolute;
      right: 7%;
      span {
        font-size: 14px;
        font-weight: 500;
        color: #4a4a4a;
        line-height: 30px;
        padding-right: 6px;
      }
    }
  }
}
.record-swiper {
  width: 100%;
  padding: 0 7% 3%;
  flex: 1;
  display: flex;
  flex-direction: column;
  .swiper-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    // background: pink;
    .swiper-wrapper {
      width: 100%;
      height: 86%!important;
      // background: burlywood;
    }
    .draw {
      width: 100%;
      height: 76%!important;
    }
    .mouse-text {
      text-align: center;
      position: absolute;
      bottom: 12%;
      span {
        font-size: 14px;
        font-weight: 500;
        color: #4a4a4a;
        line-height: 30px;
      }
      i {
        display: inline-block;
        width: 20px;
        height: 30px;
        background: url('../../../../static/images/kidcontent/icon-mouse-img.png') no-repeat center;
        background-size: cover;
      }
    }
  }
}
.swiper-slide {
 // width: 568px!important;
  width: 36%!important;
  height: 90%!important;
  border-radius:4px;
  background: #fff;
  padding-bottom: 20px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  transition: 300ms;
  transform: scale(0.6);
  border-radius:4px;
  background: #fff;
}
.slide-content {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  .record-img {
    // width: 568px;
    // height: 217px;
    width: 100%;
    height: 70% !important;
    border-radius: 4px 4px 0 0;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px 4px 0 0;
      object-fit: cover;
      cursor: pointer;
    }
  }
  .record-desc {
    position: relative;
    height: 30%;
    .text {
      font-size:16px;
      font-weight:600;
      color:rgba(60,91,111,1);
      line-height:18px;
      padding: 12px 50px 0px 18px;
    }
    .record-playVoice-button {
      width: 100%;
      padding: 16px 30px 0px;
      text-align: center;
      position: absolute;
      bottom: 0;
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
.draw {
  .swiper-slide {
    height: 100%;
    .record-img {
      width: 100%!important;
      height: 60%!important;
    }
    .record-desc {
      position: relative;
      height: 40%;
    }
  }
}
.swiper-slide-active,.swiper-slide-duplicate-active{
  transform: scale(1);
  box-shadow:0px 48px 37px -30px rgba(0,0,0,0.11);
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
.record-swiper #swiper-pagination {
  // bottom: 70px;
  // bottom: 0;
  // left: 50%;
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
