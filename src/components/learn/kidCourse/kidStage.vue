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
    <div class="record-lists" v-if="recordState>0" @click="goKidRecordList(code, type, courseIndex)">
      <div class="record-lists-content">
        <div class="num-content">
          <i class="icon-img"></i>
          <div class="tip-blue">
            <i class="blue-img"></i>
            <span>我的{{type=='draw'?'绘本':'单词'}}录音</span>
          </div>
        </div>
        <p>{{recordState}}</p>
      </div>
    </div>
    <div class="kid-draws" id="swiper-kid">
      <div class="swiper-container index-swiper">
        <div class="swiper-wrapper">
          <kid-stage-item  v-for="(item, index) in list" :key="index" :item="item" :index="index"/>
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination" id="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import $ from 'jquery'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import KidStageItem from './kidStageItem.vue'
import Recorder from '../../../plugins/recorder'

export default {
  props: ['code', 'type', 'courseIndex'],
  data () {
    return {
      courseCode: '',
      list: [],
      recordState: null
    }
  },
  components: {
    KidStageItem
  },
  created () {
    this.initData()
    this.initRecordState()
    Recorder.init()
  },
  mounted () {
    let arr = this.code.split('-')
    this.courseCode = arr.slice(0, 2).join('-')
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
      this.$nextTick(() => {
        /* eslint-disable */
        var mySwiper = new Swiper('.index-swiper', {
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
              console.log($('#mother-sound0')[0])
              $('#mother-sound0')[0].play()
              this.emit('transitionEnd');//在初始化时触发一次transitionEnd事件，需要先设置transitionEnd
            },
            slideChange: function () {
              console.log('slideChange', this.activeIndex)
              $('#mother-sound'+this.activeIndex)[0].play()
              $('#mother-sound'+(this.previousIndex))[0].pause()
              $('#mother-sound'+(this.previousIndex))[0].currentTime = 0
            }
          }
        })
        /* eslint-enable */
      })
    },
    goKidRecordList (code, type, courseIndex) {
      this.$router.push({path: '/kid-record-list', query: {code: code, type: type, courseIndex: courseIndex}})
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
  width: 100%;
  padding: 0px 98px;
  position: relative;
  text-align: right;
  box-sizing: border-box;
  margin-top: 40px;
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
.kid-stage-container {
  display: inline-block;
  width: 100%;
  position: relative;
}
.kid-stage-container .kid-draws {
  width: 100%;
  height: 100%;
  padding: 40px 120px;
  background: #0581D1;
  box-sizing: border-box;
  position: relative;
  margin-top: 10%;
  .swiper-container {
    width: 100%;
    .swiper-wrapper {
      width: 100%;
      height: 100%;
    }
  }
}

.kid-stage-container .kid-draws #swiper-pagination {
  bottom: -110px;
  left: 50%;
}
.kid-stage-container .kid-draws #swiper-pagination .my-bullet {
  outline:none;
  width: 20px!important;
  height: 6px!important;
  background: #D5DCDF!important;
  border-radius: 5px!important;
  transition: width 0.3s ease-in-out !important;
  margin: 0 8px;
}
.kid-stage-container .kid-draws #swiper-pagination .my-bullet.my-bullet-active {
  width: 20px!important;
  height: 6px!important;
  background: #0581D1!important;
  border-radius: 5px!important;
}

</style>
<style scoped>
#swiper-kid .swiper-pagination-bullet {
  outline:none;
  width: 20px!important;
  height: 6px!important;
  background: #D5DCDF!important;
  border-radius: 5px!important;
  transition: width 0.3s ease-in-out !important;
  margin: 0 8px;
}
#swiper-kid .swiper-pagination-bullet-active {
  width: 20px!important;
  height: 6px!important;
  background: #0581D1!important;
  border-radius: 5px!important;
}
</style>
