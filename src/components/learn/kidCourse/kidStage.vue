<template>
  <div class="kid-stage-container">
    <div class="header">
      <header>
        <div class="header-content">
          <router-link :to="{path: '/app/kid-course-list/' + courseCode}" class="balk-icon" ></router-link>
          <p class="course-desc">
            <span>课程{{courseIndex}}</span>
            <span>{{type=='draw'?'绘本阅读':'绘本单词'}}</span>
          </p>
        </div>
      </header>
    </div>
    <div class="record-lists" @click="goKidRecordList(code, type)">
      <div class="record-lists-content" v-if="recordState>0">
        <div class="num-content">
          <i class="icon-img animat-target-img"></i>
          <div class="tip-blue">
            <i class="blue-img"></i>
            <span>我的{{type=='draw'?'绘本':'单词'}}录音</span>
          </div>
        </div>
        <p>{{recordState}}</p>
      </div>
    </div>
    <div class="kid-draws" id="swiper-kid">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <kid-stage-item  v-for="(item, index) in list"
                          :key="index" :item="item"
                          :index="index"
                          :type="type"
                          :courseCode="courseCode"
                          @initRecordState="initState"/>
        </div>
        <div class="mouse-text" v-show="showMose"><i></i><span>上下滚动鼠标可切换页面</span></div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination" id="swiper-pagination"></div>
      </div>
    </div>
    <div class="record-save-animat">
      <i ></i>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import $ from 'jquery'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import bus from '../../../bus'
import KidStageItem from './kidStageItem.vue'
import Recorder from '../../../plugins/recorder'

export default {
  props: ['code', 'type'],
  data () {
    return {
      showMose: true,
      list: [],
      recordState: null,
      mySwiper: null
    }
  },
  components: {
    KidStageItem
  },
  computed: {
    courseIndex () {
      let arr = this.code.split('-')
      let num = (parseInt(arr[3].toLowerCase().replace('unit', '')) - 1) * 6 + parseInt(arr[4].toLowerCase().replace('chapter', ''))
      return num
    },
    courseCode () {
      let arr = this.code.split('-')
      return arr.slice(0, 2).join('-')
    }
  },
  created () {
    Recorder.init()
    bus.$on('animateRecord', (offset) => {
      $('.record-save-animat').css({
        left: offset.left,
        top: offset.top
      })
      $('.record-save-animat').show()
      let targetOffest = $('.animat-target-img').offset()
      console.log(targetOffest)
      $('.record-save-animat').stop().animate({
        left: targetOffest.left,
        top: targetOffest.top
      }, {
        duration: 800,
        specialEasing: {
          left: 'linear',
          top: 'swing'
        },
        complete: () => {
          $('.record-save-animat').hide()
        }
      })
    })
  },
  mounted () {
    setTimeout(() => {
      this.initData()
      this.initRecordState()
    }, 300)
    // 给页面绑定滑轮滚动事件
    if (document.addEventListener) { // firefox
      document.addEventListener('DOMMouseScroll', this.scrollFunc, false)
    }
    // 滚动滑轮触发scrollFunc方法  //ie 谷歌
    window.onmousewheel = document.onmousewheel = this.scrollFunc
  },
  updated () {
  },
  methods: {
    ...mapActions([
      'getKidCourseContent',
      'getKidRecordState'
    ]),
    async initData () {
      let res = await this.getKidCourseContent({chapter_code: this.code})
      switch (this.type) {
        case 'draw':
          this.list = res.teacherContent.draw_contents
          break
        case 'word':
          this.list = res.teacherContent.words
          break
        default:
          this.list = res.teacherContent.words
          break
      }
      console.log('kid stage list', this.list)
      await this.swiperInit()
      await this.mySwiper.init()
    },
    async initRecordState () {
      let res = await this.getKidRecordState({chapter_code: this.code})
      console.log('录音数量返回', res)
      switch (this.type) {
        case 'draw':
          this.recordState = res.state.draw_record_num
          break
        case 'word':
          this.recordState = res.state.word_record_num
          break
        default:
          this.recordState = res.state.draw_record_num
          break
      }
      console.log('kid record State', this.recordState)
    },
    swiperInit () {
      let that = this
      /* eslint-disable */
      this.$nextTick(() => {
        that.mySwiper = new Swiper('.swiper-container', {
          loop: false,
          autoplay: false, //自动轮播
          initialSlide: 0,
          centeredSlides:true,
          slidesPerView: 3,
          spaceBetween: 30,
          mousewheel: {
            releaseOnEdges: true,
          },
          slideToClickedSlide: true,
          autoHeight : true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          on:{
            init: function () {
              //Swiper初始化了
              console.log('当前的slide序号是'+this.activeIndex);
              console.log($('#mother-sound0')[0])
              let audio = document.getElementById('mother-sound' + this.activeIndex)
              audio.play()
              audio.onloadedmetadata = () => {
                audio.play()
              }
              audio.addEventListener('ended', () => {
                audio.pause()
              }, false)
            },
            slideChange: function () {
              console.log('slideChange', this.activeIndex)
              $('#mother-sound'+this.activeIndex)[0].play()
              $('#mother-sound'+(this.previousIndex))[0].pause()
              $('#mother-sound'+(this.previousIndex))[0].currentTime = 0
              bus.$emit('clearDate', false)
            }
          }
        })
        this.resetStyle()
      })
      /* eslint-enable */
    },
    resetStyle () {
      $('#swiper-pagination').find('.swiper-pagination-bullet').css({
        'width': '20px',
        'height': '6px',
        'border-radius': '6px',
        'margin-right': '8px'
      })
      $('#swiper-pagination').find('.swiper-pagination-bullet-active').css({
        'width': '20px',
        'height': '6px',
        'background': '#0581D1',
        'border-radius': '6px',
        'margin-right': '8px'
      })
    },
    goKidRecordList (code, type) {
      this.$router.push({path: '/app/kid-record-list', query: {code: code, type: type}})
    },
    initState () {
      this.initRecordState()
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
  width: 100%;
  padding: 1% 98px 0;
  position: relative;
  text-align: right;
  box-sizing: border-box;
  min-height: 50px;
  .record-lists-content{
    display: inline-block;
    position: relative;
    cursor: pointer;
    p {
      font-size:20px;
      font-weight:600;
      color:rgba(195,208,216,1);
      line-height: 50px;
      margin-left: 14px;
      position: absolute;
      top: 0;
      right: -30px;
    }
  }
  .num-content {
    position: relative;
    text-align: center;
    .icon-img {
      display: inline-block;
      width: 50px;
      height: 50px;
      background: url('../../../../static/images/kidcontent/icon-record-list.png') no-repeat center;
      background-size: cover;
    }
  }
  .tip-blue {
    position: absolute;
    top: 39px;
    left: -62px;
    display: flex;
    justify-content: center;
    align-items: center;
    animation:  fadeUpDown 3s ease;
    .blue-img {
      display: inline-block;
      width: 180px;
      height: 104px;
      background: url('../../../../static/images/kidcontent/pic-blue-record-list.png') no-repeat center;
      background-size: cover;
    }
    span {
      position: absolute;
      font-size:15px;
      font-weight:600;
      color:rgba(255,255,255,1);
    }
  }
}
 @keyframes fadeUpDown {
  0% {
    transform: translate(0px, 0px);
  }
  17% {
    transform: translate(0px, -10px);
  }
  34% {
    transform: translate(0px, 0px);
  }
  51% {
    transform: translate(0px, -10px);
  }
  68% {
    transform: translate(0px, 0px);
  }
  85% {
    transform: translate(0px, -10px);
  }
  100%{
    transform: translate(0px, 0px);
  }
}
.kid-stage-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.kid-stage-container .kid-draws {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 7% 2%;
  // background: #0581D1;
  box-sizing: border-box;
  position: relative;
  z-index: 999999;
  .swiper-container {
    width: 100%;
    // min-height: 500px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .swiper-wrapper {
      width: 100%;
      height: 100%;
    }
    .mouse-text {
      text-align: center;
      position: absolute;
      bottom: 12%;
      span {
        font-size:14px;
        font-weight:500;
        color:rgba(74,74,74,1);
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
.record-save-animat {
  position: absolute;
  display: none;
  z-index: 999999;
  i {
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url('../../../../static/images/kidcontent/icon-record-list.png') no-repeat center;
    background-size: cover;
  }
}
</style>
<style lang="css" scoped>
.swiper-pagination {
  bottom: 0!important;
}
.swiper-pagination .swiper-pagination-bullet {
  outline:none;
  width: 20px!important;
  height: 6px!important;
  background: #D5DCDF!important;
  border-radius: 5px!important;
  transition: width 0.3s ease-in-out !important;
  margin: 0 8px;
}
.swiper-pagination .swiper-pagination-bullet-active {
  width: 20px!important;
  height: 6px!important;
  background: #0581D1!important;
  border-radius: 5px!important;
}
</style>
