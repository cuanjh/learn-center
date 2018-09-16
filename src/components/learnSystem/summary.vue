<template>
  <div>
    <div class="summary-container" v-show="show">
      <div class="core-summary-box">
        <div class="core-summary-header">
          <div class="header-left">
            <dl>
              <dt><img :src="userInfo.photo"></dt>
              <dd>
                <p v-text='coreDes[core] + "完成"'></p>
                <p class="summary-star">
                  <span class="summary-yellow-star"><i v-for="index in stars" :key="index"></i></span>
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
        <div class="core-summary-content">
          <div class="tooltip">
            <i></i>
            <span v-if="own">系统已把你的录音自动生成了本节课程！</span>
            <span v-else>没有收录到你的课程语音，去听听其他语伴的吧！</span>
          </div>
          <div class="record-box" @click="ShowDetail(code + '-' + core)">
            <dl>
              <dt><img :src="imgCover | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt=""></dt>
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
        <div class="core-summary-footer">
          <a class="btn review" @click="back">返回</a>
          <a class="btn review" @click="review">复习</a>
          <a class="btn continue" @click="continueLearn">继续学习</a>
        </div>
      </div>
    </div>
    <record-list
      ref="record"
      :isShow="isShow"
      @updateIsShow="updateIsShow" />
  </div>

</template>

<script>
import dialog from '../../plugins/dialog'
import { mapState, mapActions } from 'vuex'
import RecordList from './recordList.vue'

export default {
  data () {
    return {
      window: {},
      isShow: false,
      show: false,
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
      userInfo: {},
      courseBaseInfo: {},
      recordCourseList: []
    }
  },
  components: {
    RecordList
  },
  created () {
    var _this = this
    this.$on('coreSummary-show', (id) => {
      let curChapterCode = _this.code
      var arr = curChapterCode.split('-')
      _this.level = arr[2].toLowerCase()
      _this.chapter = arr[4].toLowerCase().replace('chapter', '课程')
      _this.core = id
      let activityCode = curChapterCode + '-' + _this.core

      _this.getFinishedInfo(activityCode).then(() => {
        _this.stars = _this.finishedInfo.stars
        _this.correctHits = _this.finishedInfo.correct_hits
        _this.correctRate = Math.round(parseFloat(_this.finishedInfo.correct_rate * 100)) + '%'
        _this.coins = _this.finishedInfo.coins
        _this.imgCover = _this.finishedInfo.record_course.cover
        _this.recordPhoto = _this.finishedInfo.record_course.photo
        _this.nickname = _this.finishedInfo.record_course.nickname
        _this.recordCount = _this.finishedInfo.record_course.record_count
        _this.own = _this.finishedInfo.record_course.own
        _this.recordCourse = _this.finishedInfo.record_course

        let ui = this.$store.state.user.userInfo
        _this.userInfo = (Object.keys(ui).length === 0) ? JSON.parse(localStorage.getItem('userInfo')) : ui

        let cbi = this.$store.state.course.courseBaseInfo
        _this.courseBaseInfo = (Object.keys(cbi).length === 0) ? JSON.parse(localStorage.getItem('courseBaseInfo')) : cbi

        this.window = dialog({
          width: '652px',
          content: document.querySelector('.core-summary-box')
        }).showModal()
      })
    })
    this.$on('coreSummary-hide', () => {
      if (Object.keys(this.window).length > 0) {
        this.window.close()
      }
    })
  },
  mounted () {
    console.log(this.id)
  },
  computed: {
    ...mapState({
      curChapterCode: state => state.course.currentChapterCode,
      finishedInfo: state => state.learn.finishedInfo
    }),
    code () {
      let curChapterCode
      if (!this.curChapterCode) {
        curChapterCode = localStorage.getItem('currentChapterCode')
      } else {
        curChapterCode = this.curChapterCode
      }
      return curChapterCode
    }
  },
  methods: {
    ...mapActions({
      getFinishedInfo: 'learn/getFinishedInfo',
      getRecordCourseList: 'learn/getRecordCourseList'
    }),
    review () {
      this.window.close()
      this.$parent.$emit('switch-slide', 0)
    },
    back () {
      this.window.close()
      this.$router.push({ path: '/app/course-list' })
    },
    continueLearn () {
      this.window.close()
      let currentRoute = this.$router.currentRoute
      let id = currentRoute.params.id
      let core = parseInt(id.replace('A0', ''))
      if (core < 5) {
        this.$router.push('/learn/stage/A0' + (core + 1))
      } else {
        this.$router.push('/app/course-list')
      }
    },
    ShowDetail (activityCode) {
      let _this = this
      _this.getRecordCourseList(activityCode).then((res) => {
        console.log(res)
        if (res.course_list.length > 0) {
          _this.recordCourseList = res.course_list
          _this.$refs['record'].$emit('init', res.course_list, _this.recordCourse)
          _this.isShow = true
        } else {
          return false
        }
      })
    },
    updateIsShow (flag) {
      this.isShow = flag
    }
  }
}
</script>

<style lang="less" scoped>
.summary-container {
  opacity: 0.7;
  background: rgb(0, 0, 0);
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  z-index: 1025;
}
.core-summary-box {
  width: 652px;
  background-color: #ffffff;
  .core-summary-header {
    height: 160px;
    background-color: #2A9FE4;
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
        top: 8px;
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
        height:17px;
        background:url(../../../static/images/learnSystem/icon-record.png) no-repeat;
        background-size:100% 100%;
        vertical-align: bottom;
      }
      span {
        font-weight: bolder;
        font-size: 14px;
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
            vertical-align: top;
            font-size: 16px;
            font-weight: bold;
          };
        };
        p:nth-of-type(2) {
          margin-top: 20px;
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

.summary-yellow-star i{
  float:left;
  width:26px;
  height:26px;
  margin-left:4px;
  background:url(../../../static/images/learnSystem/summary-star.png) no-repeat;
  background-size:100% 100%;
}

.summary-gray-star i{
  float:left;
  width:26px;
  height:26px;
  margin-left:4px;
  background:url(../../../static/images/learnSystem/summary-star-gray.png) no-repeat;
  background-size:100% 100%;
}
</style>
