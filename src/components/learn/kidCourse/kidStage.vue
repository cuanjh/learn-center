<template>
  <div class="kid-stage-container">
    <nav-comp :chapterCode="code" :type="type"/>
    <progress-bar ref="progress"/>
    <div class="kid-content">
      <div class="kid-content-wrap" :style="{height: kidContentHeight + 'px'}">
        <swiper-comp :chapterCode="code" :type="type" @setProgress="setProgress"/>
      </div>
    </div>
    <div class="record-save-animat">
      <i ></i>
    </div>
    <word-panel ref="wordPanel"/>
    <!-- <div class="record-lists" v-show="false">
      <i class="icon-img animat-target-img" v-if="recordState==0"></i>
      <div class="record-lists-content" @click="goKidRecordList(code, type)" v-if="recordState>0">
        <div class="num-content" >
          <i class="icon-img animat-target-img"></i>
          <div class="tip-blue" @click="goKidRecordList(code, type)" v-show="showMyRecordNumTip == 1">
            <i class="blue-img"></i>
            <span>我的{{type=='draw'?'绘本':'单词'}}录音</span>
          </div>
        </div>
        <p>{{recordState}}</p>
      </div>
    </div>
    <div class="kid-draws" id="swiper-kid" v-show="false">
      <div class="swiper-container">
        <div class="swiper-wrapper" :class="{'draw': type == 'draw'}">
          <kid-stage-item  v-for="(item, index) in list"
                          :key="index" :item="item"
                          :index="index"
                          :type="type"
                          :chapterCode="code"
                          @initRecordState="initState"
                          />
        </div>
        <div class="mouse-text" v-show="showMose"><i></i><span>上下滚动鼠标可切换页面</span></div>
        <div class="swiper-pagination" id="swiper-pagination"></div>
      </div>
    </div>-->
    <test-yuyin v-show="false" :chapterCode="code"/>
    <audio id="myYeah" src="../../../../static/sounds/yeah.mp3"></audio>
    <transition name="fade">
      <div class="common-modal-container" v-show="isFinish">
        <div class="common-madal">
          <div class="finish"></div>
        </div>
      </div>
    </transition>
    <guide v-show="false"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import $ from 'jquery'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import bus from '../../../bus'
import KidStageItem from './kidStageItem.vue'
import NavComp from './common/nav.vue'
import ProgressBar from './common/progress.vue'
import SwiperComp from './common/swiper.vue'
import WordPanel from './common/wordPanel.vue'
import Guide from './common/guide.vue'
import TestYuyin from './testYuyin.vue'
// import Recorder from '../../../plugins/recorder'

export default {
  props: ['code', 'type'],
  inject: ['reload'],
  data () {
    return {
      myRecordNumTip: 1,
      // showTipsStop: 1,
      // showTipSave: 1,
      showMose: true,
      list: [],
      recordState: null,
      mySwiper: null,
      isFinish: false,
      finishedCount: 0,
      kidContentHeight: 0
    }
  },
  components: {
    KidStageItem,
    NavComp,
    ProgressBar,
    SwiperComp,
    WordPanel,
    TestYuyin,
    Guide
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo // 用户信息
    }),
    // 是否vip
    isVip () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    },
    courseIndex () {
      let arr = this.code.split('-')
      let num = (parseInt(arr[3].toLowerCase().replace('unit', '')) - 1) * 6 + parseInt(arr[4].toLowerCase().replace('chapter', ''))
      return num
    },
    courseCode () {
      let arr = this.code.split('-')
      return arr.slice(0, 2).join('-')
    },
    showMyRecordNumTip () {
      let tip = JSON.parse(sessionStorage.getItem('myRecordNumTip'))
      if (tip) {
        return tip
      }
      return this.myRecordNumTip
    }
  },
  created () {
    // Recorder.init()
    bus.$on('animateRecord', (offset) => {
      console.log('offset-->', offset)
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

    this.$on('showWordPanel', (params) => {
      this.$refs['wordPanel'].show(params)
    })
    this.$on('hideWordPanel', (params) => {
      this.$refs['wordPanel'].hide()
    })
  },
  mounted () {
    console.log('kid-stage-container', $('.kid-stage-container').height())
    this.kidContentHeight = $('.kid-stage-container').height() - 150
    this.initData()
    // this.finishedCount = 0
    // setTimeout(() => {
    //   this.initData()
    //   this.initRecordState()
    // }, 300)
    // setTimeout(() => {
    //   this.showMose = false
    // }, 3000)
    // // 给页面绑定滑轮滚动事件
    // if (document.addEventListener) { // firefox
    //   document.addEventListener('DOMMouseScroll', this.scrollFunc, false)
    // }
    // // 滚动滑轮触发scrollFunc方法  //ie 谷歌
    // window.onmousewheel = document.onmousewheel = this.scrollFunc
  },
  methods: {
    ...mapActions([
      'getKidCourseContent',
      'kidUpload',
      'setPartComplete',
      'getKidRecordList'
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
      // let localXfResult = JSON.parse(localStorage.getItem('xfISEResult'))
      // console.log('kid stage list', this.list)
      // if (localXfResult && this.isVip === 1) {
      //   await bus.$emit('busGradeBox', this.list)
      // }

      // await this.swiperInit()
      // await this.mySwiper.init()
    },
    initRecordState () {
      this.getKidRecordList({chapter_code: this.code, teacher_module: this.type}).then(res => {
        console.log('录音数量返回', res)
        if (res.success) {
          this.recordState = res.records.length
        }
      })
    },
    swiperInit () {
      let that = this
      /* eslint-disable */
      this.$nextTick(() => {
        that.mySwiper = new Swiper('.swiper-container2', {
          loop: false,
          autoplay: false, //自动轮播
          initialSlide: 0,
          centeredSlides:true,
          slidesPerView: 'auto',
          spaceBetween: 0,
          slideToClickedSlide: true,
          allowTouchMove: false,
          mousewheel: {
            releaseOnEdges: true,
          },
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
                $('.trumpet' + this.activeIndex).addClass('trumpetPlaying')
              }
              audio.addEventListener('ended', () => {
                audio.pause()
                $('.trumpet' + this.activeIndex).removeClass('trumpetPlaying')
              }, false)
            },
            slideChange: function () {
              let audio = document.getElementById('mother-sound' + this.activeIndex)
              console.log('slideChange', this.activeIndex)
              $('#mother-sound'+this.activeIndex)[0].play()
              $('#mother-sound'+(this.previousIndex))[0].pause()
              $('#mother-sound'+(this.previousIndex))[0].currentTime = 0
              $('.trumpet' + this.previousIndex).removeClass('trumpetPlaying')
              $('.trumpet' + this.activeIndex).addClass('trumpetPlaying')
              let activeIndex = this.activeIndex
              audio.addEventListener('ended', () => {
                if (that.list.length === activeIndex + 1 && that.finishedCount === 0) { 
                  that.isFinish = true
                  $('#myYeah')[0].play()
                  that.finishedCount++
                  setTimeout(() => {
                    that.isFinish = false
                  }, 3000)
                }
                $('.trumpet' + activeIndex).removeClass('trumpetPlaying')
              }, false)
              bus.$emit('clearDate', false)
              if (that.list.length === this.activeIndex + 1) {
                let activityCode = that.code + '-' + that.type.charAt(0).toUpperCase() + that.type.slice(1)
                that.setPartComplete({part_code: activityCode})
              }
              $('.kid-draws .swiper-slide .img-box').removeAttr('style', 'pointer-events')
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
      $('#swiper-pagination').find('.swiper-pagination-bullet .swiper-pagination-bullet-active').css({
        'width': '20px',
        'height': '6px',
        'background': '#0581D1',
        'border-radius': '6px',
        'margin-right': '8px'
      })
    },
    goKidRecordList () {
      this.$router.push({path: '/app/kid-record-list', query: {code: this.code, type: this.type}})
      this.myRecordNumTip = 2
      JSON.stringify(sessionStorage.setItem('myRecordNumTip', this.myRecordNumTip))
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
    },
    setProgress (progress) {
      console.log(progress)
      this.$refs['progress'].setProgress(progress)
    }
  },
  watch: {
    $route (to, from) {
      console.log('监听子路由的变化', to)
      this.reload()
    }
  }
}
</script>

<style lang="less" scoped>
.kid-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-image: url('../../../../static/images/kid/pic-kid-content-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  // background-position: center;
  background-position-y: center;
  .kid-content-wrap {
    width: 100%;
    max-height: 530px;
    // opacity: 0;
    background: rgba(0, 0, 0, 0);
  }
}
.record-lists {
  width: 100%;
  padding: 1% 98px 0;
  position: relative;
  text-align: right;
  box-sizing: border-box;
  min-height: 50px;
  .animat-target-img {
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url('../../../../static/images/kidcontent/icon-record-list.png') no-repeat center;
    background-size: cover;
    opacity: 0;
  }
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
    .animat-target-img {
      display: inline-block;
      width: 50px;
      height: 50px;
      background: url('../../../../static/images/kidcontent/icon-record-list.png') no-repeat center;
      background-size: cover;
      opacity: 1;
    }
  }
  .tip-blue {
    position: absolute;
    z-index: 999;
    cursor: pointer;
    top: 44px;
    left: -32px;
    display: flex;
    justify-content: center;
    align-items: center;
    animation:  fadeUpDown 2s ease;
    .blue-img {
      display: inline-block;
      width: 118px;
      height: 70px;
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
  25% {
    transform: translate(0px, -10px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  75% {
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
  overflow: hidden;
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
  // .swiper-container {
  //   width: 100%;
  //   // min-height: 500px;
  //   height: 100%;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   // justify-content: center;
  //   // background: pink;
  //   .swiper-wrapper {
  //     width: 100%;
  //     height: 70%!important;
  //     padding-top: 7%;
  //     // background: burlywood;
  //   }
  //   .draw {
  //     width: 100%;
  //     height: 66%!important;
  //     padding-top: 8%;
  //     // background: rgb(207, 124, 15);
  //   }
  //   .mouse-text {
  //     text-align: center;
  //     position: absolute;
  //     bottom: 12%;
  //     span {
  //       font-size:14px;
  //       font-weight:500;
  //       color:rgba(74,74,74,1);
  //       line-height: 30px;
  //     }
  //     i {
  //       display: inline-block;
  //       width: 20px;
  //       height: 30px;
  //       background: url('../../../../static/images/kidcontent/icon-mouse-img.png') no-repeat center;
  //       background-size: cover;
  //     }
  //   }
  // }
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

.common-modal-container {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index:99999999;
  overflow: hidden;
  .common-madal {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 25px;
    margin-left: -334px;
    margin-top: -229px;
    width:668px;
    height:458px;
    border-radius:5px;
    text-align: center;
  }
  .finish {
    width: 100%;
    height: 100%;;
    background: url('../../../../static/images/kidcontent/pic-kid-finished.png') no-repeat center;
    background-size: cover;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
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
