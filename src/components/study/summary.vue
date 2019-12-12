<template>
  <div class="summary-container" v-show="isShow">
    <div class="core-summary-box">
      <a href="javascript:;" class="close" @click="close" v-show="false"><i></i></a>
      <div class="core-summary-header">
        <div class="header-left">
          <dl>
            <dt><img :src="userInfo.photo"></dt>
            <dd>
              <p v-text='coreDes[core] + "完成"'></p>
              <p class="summary-star">
                <span class="summary-yellow-star"><i v-for="index in stars" :key="index" :class="{active:active}"></i></span>
                <span class="summary-gray-star"><i v-for="index in (5 - stars)" :key="index"></i></span>
              </p>
            </dd>
          </dl>
        </div>
        <div class="header-right">
          <ul>
            <li>
              <span>正确率</span>
              <span>{{correctRate}}</span>
            </li>
            <div class="line"></div>
            <li>
              <span>最高连击</span>
              <span>{{correctHits}}</span>
            </li>
            <div class="line"></div>
            <li>
              <span>获得金币</span>
              <span>{{coins}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="evaluate-report" @click="lookScoreReport()">
        <p ><i></i><span>查看语音评分报告</span></p>
        <i class="go-vip"></i>
      </div>
      <div v-if="hasRecord" class="core-summary-content">
        <div class="tooltip">
          <i></i>
          <span v-if="own">系统已把你的录音自动生成了本节课程！</span>
          <span v-else>没有收录到你的课程语音，去听听其他语伴的吧！</span>
        </div>
        <div class="record-box" @click="ShowDetail(id)">
          <dl>
            <dt><img :src="imgCover | urlFix('imageView2/0/w/183/h/86/format/jpg')" alt=""></dt>
            <dd>
              <p>
                <img :src="recordPhoto">
                <span>{{ nickname }}</span>
              </p>
              <p>
                {{ courseBaseInfo.name + ' '+ levelDes[this.level] + '.' + this.chapter + '.' + coreDes[this.core] + ' ' + '已收录'+ recordCount +'条录音' }}
              </p>
            </dd>
          </dl>
        </div>
      </div>
      <div v-else  class="core-summary-content">
        <div class="no-record"></div>
      </div>
      <div class="core-summary-footer">
        <a class="btn review" @click="back">返回</a>
        <a class="btn review" @click="review">复习</a>
        <a class="btn continue" @click="continueLearn">继续学习</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import bus from '../../bus'

export default {
  data () {
    return {
      id: '',
      active: true, // 星星动画
      window: {},
      isShow: false,
      level: '',
      levelDes: {
        level1: '初级A1',
        level2: '初级A2',
        level3: '中级B1',
        level4: '中级B2',
        level5: '高级C1',
        level6: '高级C2'
      },
      chapter: '',
      core: '',
      coreDes: {
        'A01': '核心1',
        'A02': '核心2',
        'A03': '核心3',
        'A04': '核心4',
        'A05': '核心5',
        'A1': '听力',
        'A2': '口语',
        'A3': '阅读',
        'A4': '写作',
        'A5': '语法',
        'A6': '听说'
      },
      stars: 5,
      correctRate: '100%',
      correctHits: 0,
      coins: 0,
      imgCover: '',
      nickname: '',
      recordPhoto: '',
      own: '1',
      recordCourse: {},
      recordCount: 0,
      hasRecord: 0,
      userInfo: {},
      courseBaseInfo: {},
      recordCourseList: []
    }
  },
  created () {
    var _this = this
    this.$on('coreSummary-show', (id) => {
      this.id = id
      var arr = id.split('-')
      _this.core = arr.pop()
      _this.level = arr[2].toLowerCase()
      _this.chapter = arr[4].toLowerCase().replace('chapter', '课程')
      let activityCode = id

      _this.getFinishedInfo(activityCode).then(() => {
        console.log(_this.finishedInfo)
        _this.stars = _this.finishedInfo.stars
        _this.correctHits = _this.finishedInfo.correct_hits
        _this.correctRate = Math.round(parseFloat(_this.finishedInfo.correct_rate * 100)) + '%'
        _this.coins = _this.finishedInfo.coins
        _this.imgCover = _this.finishedInfo.record_course.cover
        _this.recordPhoto = _this.finishedInfo.record_course.photo
        let nickname = _this.finishedInfo.record_course.nickname
        if (!nickname) {
          nickname = '用户' + _this.finishedInfo.record_course.talkmate_id
        }
        _this.nickname = nickname
        _this.recordCount = _this.finishedInfo.record_course.record_count
        _this.own = _this.finishedInfo.record_course.own
        _this.hasRecord = _this.finishedInfo.record_course.has_record
        _this.recordCourse = _this.finishedInfo.record_course

        _this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

        let cbi = this.$store.state.course.courseBaseInfo
        _this.courseBaseInfo = (Object.keys(cbi).length === 0) ? JSON.parse(localStorage.getItem('courseBaseInfo')) : cbi

        _this.isShow = true
      })
    })
    this.$on('coreSummary-hide', () => {
      this.isShow = false
    })
  },
  computed: {
    ...mapState({
      finishedInfo: state => state.learn.finishedInfo
    })
  },
  methods: {
    ...mapActions({
      getFinishedInfo: 'learn/getFinishedInfo',
      getRecordCourseList: 'learn/getRecordCourseList'
    }),
    review () {
      this.isShow = false
      this.$parent.$emit('changeSlide', 0)
    },
    back () {
      this.isShow = false
      this.$emit('goBack')
    },
    continueLearn () {
      this.isShow = false
      this.$parent.$emit('continueLearn')
    },
    ShowDetail (activityCode) {
      let _this = this
      _this.getRecordCourseList(activityCode).then((res) => {
        console.log(res)
        if (res.course_list.length > 0) {
          _this.recordCourseList = res.course_list
          _this.$parent.$emit('RecordListInit', res.course_list, _this.recordCourse)
        } else {
          return false
        }
      })
    },
    updateIsShow (flag) {
      this.isShow = flag
    },
    close () {
      this.isShow = false
    },
    lookScoreReport () {
      console.log('弹语音评分报告')
      this.$emit('coreSummary-hide')
      bus.$emit('busGradeIATModal')
    }
  }
}
</script>

<style lang="less" scoped>
.summary-container {
  background: rgba(0, 0, 0, .5);
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  z-index: 99;
}
.core-summary-box {
  width: 652px;
  background-color: #ffffff;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -326px;
  margin-top: -225px;
  border-radius: 4px;
  .close {
    position: absolute;
    right: 0;
    top: -54px;
    width: 30px;
    height: 30px;
    background: url('../../../static/images/kid/icon-close.png') no-repeat center;
    background-size: cover;
  }
  .core-summary-header {
    height: 160px;
    background-color: #2A9FE4;
    border-radius: 4px 4px 0 0;
    .header-left {
      float: left;
      dl>dt {
        float: left;
        margin-top: 40px;
        margin-left: 30px;
        img {
          display: inline-block;
          width: 80px;
          height: 80px;
          border: 2px solid #fff;
          border-radius: 80px;
          object-fit: cover;
        }
      };
      dd {
        display: inline-block;
        margin-left: 20px;
        p:nth-of-type(1) {
          margin-left: 4px;
          position: relative;
          top: 45px;
          font-size: 20px;
          font-weight: bolder;
          color: #fff;
        }
      }
    };
    .header-right {
      float: right;
      margin-top: 30px;
      margin-right: 20px;
      height: 84px;
      text-align: center;
      ul li{
        display: inline-block;
        padding: 16px;
        text-align: center;
        span{
          display: block;
        };
        span:nth-of-type(1){
          font-size: 12px;
          color: #9DDAFF;
          font-weight: bolder;
        };
        span:nth-of-type(2){
          margin-top: 18px;
          font-size: 24px;
          color: #fff;
        }
      }
      .line {
        width: 1px;
        height: 32px;
        top: 35px;
        display: inline-block;
        position: relative;
        background-color: #9DDAFF;
      }
    }
  };
  .core-summary-content {
    background-color: #fff;
    padding: 20px 25px 40px;
    .tooltip {
      i {
        float:left;
        margin-right: 8px;
        width:13px;
        height:25px;
        background:url(../../../static/images/learnSystem/icon-record.png) no-repeat;
        background-size:100% 17px;
        vertical-align: bottom;
        background-position: center;
      }
      span {
        font-weight: 500;
        font-size: 16px;
        color: #2A9FE4;
      }
    };
    .record-box {
      height: 116px;
      background-color: #F1F5F8;
      border-radius: 3px;
      margin-top: 15px;
      padding: 15px;
      cursor: pointer;
      dl>dt {
        float: left;
        img {
          display: inline-block;
          width: 183px;
          height: 86px;
          border-radius: 3px;
          object-fit: cover;
        }
      };
      dd {
        display: inline-block;
        margin-left: 20px;
        p:nth-of-type(1) {
          position: relative;
          top: 5px;
          font-size: 20px;
          font-weight: bolder;
          color: #fff;
          img {
            height: 30px;
            width: 30px;
            margin-top: -5px;
            border-radius: 50%;
          };
          span {
            color: #333333;
            line-height: 20px;
            font-size: 16px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 240px;
            display: inline-block;
          };
        };
        p:nth-of-type(2) {
          margin-top: 30px;
          color: #333333;
          font-size: 14px;
        }
      }
    }
  }
  .core-summary-footer {
    text-align: center;
    margin-bottom: 50px;
    .btn {
      height: 36px;
      line-height: 36px;
      width: 140px;
      border-radius: 18px;
      font-size: 14px;
      display: inline-block;
      text-align: center;
      font-weight: bold;
      margin: 0 20px;
    }
    .review {
      border: 1px solid #2A9FE4;
      background-color: #fff;
      color: #2A9FE4;
    }
    .continue {
      color: #fff;
      background-color: #2A9FE4;
    }
  }
}

.summary-star{
  margin-top: 55px;
}

// .summary-star .summary-yellow-star {
//   display: inline-block;
//   width: 150px;
//   height: 26px;
// }
.summary-star .summary-yellow-star i{
  float:left;
  width:26px;
  height:26px;
  margin-left:4px;
  background:url(../../../static/images/learnSystem/summary-star.png) no-repeat;
  background-size:100% 100%;
}

.summary-star .summary-yellow-star i.active {
  animation: scaleDraw 1s ease;
  -webkit-animation: scaleDraw 1s ease;
  -ms-animation: scaleDraw 1s ease;
  -moz-animation: scaleDraw 1s ease;
  -o-animation: scaleDraw 1s ease;
}
@keyframes scaleDraw {
  0%{
      transform: scale(5);
      opacity: 0;
  }
  100%{
    transform: scale(1);
      opacity: 1;
  }
}
.summary-yellow-star i.active:nth-child(1){
  animation-delay:0.2s;
  -webkit-animation-delay:0.2s;
  -ms-animation-delay:0.2s;
  -o-animation-delay:0.2s;
  -moz-animation-delay:0.2s;
}
.summary-yellow-star i.active:nth-child(2){
  animation-delay:0.4s;
  -webkit-animation-delay:0.4s;
  -ms-animation-delay:0.4s;
  -o-animation-delay:0.4s;
  -moz-animation-delay:0.4s;
}
.summary-yellow-star i.active:nth-child(3){
  animation-delay:0.6s;
  -webkit-animation-delay:0.6s;
  -ms-animation-delay:0.6s;
  -o-animation-delay:0.6s;
  -moz-animation-delay:0.6s;
}
.summary-yellow-star i.active:nth-child(4){
  animation-delay:0.8s;
  -webkit-animation-delay:0.8s;
  -ms-animation-delay:0.8s;
  -o-animation-delay:0.8s;
  -moz-animation-delay:0.8s;
}
.summary-yellow-star i.active:nth-child(5){
  animation-delay:1s;
  -webkit-animation-delay:1s;
  -ms-animation-delay:1s;
  -o-animation-delay:1s;
  -moz-animation-delay:1s;
}

.summary-gray-star i{
  float:left;
  width:26px;
  height:26px;
  margin-left:4px;
  background:url(../../../static/images/learnSystem/summary-star-gray.png) no-repeat;
  background-size:100% 100%;
}

.no-record {
  width: 169px;
  height: 127px;
  background: url(../../../static/images/learnSystem/summary-no-record.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px auto 5px;
}

.evaluate-report {
  height: 50px;
  width: 100%;
  display: inline-block;
  cursor: pointer;
  background: #FFB94E;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  p {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color:rgba(255,255,255,1);
    i {
      display: inline-block;
      width: 14px;
      height: 13px;
      background: url('../../../static/images/kid/icon-vip.png') no-repeat center;
      background-size: cover;
      margin-right: 6px;
    }
  }
  .go-vip {
    display: inline-block;
    width: 10px;
    height: 17px;
    background: url('../../../static/images/kid/icon-go.png') no-repeat center;
    background-size: cover;
    cursor: pointer;
  }
}
</style>
