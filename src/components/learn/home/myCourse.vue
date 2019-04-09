<template>
  <div class="my-course">
    <div class="title">我的课程</div>
    <div class="current-chapter" v-if="!isDefault && userId && curCourseCode">
      <img :src="curCourseObj['courseBg']" alt="">
      <div class="course-brief-shade">
        <div class="course-brief-title">
          <span> {{ courseDesc }} </span>
        </div>
        <div class="course-brief-core">
          <span>{{ curCourseObj['courseCore'] ? '核心' + curCourseObj['courseCore'] : '' }}</span>
        </div>
        <div class="course-brief-words">{{ curCourseObj['courseWords'] }}</div>
        <div class="change-course">
          <span class="pre" @click="pre()" v-show="isShowPre"><i></i></span>
          <span class="next" @click="next()" v-show="isShowNext"><i></i></span>
        </div>
        <a class="start-learn" @click="startLearn()">开始学习</a>
      </div>
    </div>
    <div class="current-chapter-none" v-else-if="!isDefault">
      <img alt="">
      <div class="course-brief-shade">
        <div class="course-brief-title">
          <span>学习一门语言，了解一个新的世界</span>
        </div>
      </div>
    </div>
    <div class="current-chapter" v-else>
      <div class="course-brief-shade">
      </div>
    </div>
    <div class="current-course" v-if="!isDefault && userId && curChapterCode" >
      <dl @mouseleave="isShowSubscribeCourses = false">
        <dt><img :src="courseBaseInfo['flag'] | urlFix('imageView2/0/w/200/h/200/format/jpg')"></dt>
        <dd>
          <a :class="{'active': isShowSubscribeCourses}" @mouseenter="isShowSubscribeCourses = true">
            <span>{{ courseBaseInfo.name }}</span>
            <i></i>
          </a>
          <p>世界语言地图官方课程</p>
          <transition name="fade">
            <learn-course-list :type="'index'" :subscribeLangCourses="subscribeLangCourses" class="subscribe-courses" v-show="isShowSubscribeCourses" />
          </transition>
        </dd>
      </dl>
      <div class="progress-area">
        <p>学完 {{ (learnInfo.chapter_num_finished ? learnInfo.chapter_num_finished : 0) + '/' + (courseBaseInfo.chapter_num ? courseBaseInfo.chapter_num : 0) }}</p>
        <div class="progress-bg">
          <div class="progress" :style="{width: (curArchiveCourse['complete_rate'] ? curArchiveCourse['complete_rate']*100 : 0) +'%'}"></div>
        </div>
      </div>
      <div class="correct-rate">
        <p>正确率 {{ curChapterCorrectRate }}</p>
        <div class="progress-bg">
          <div class="progress" :style="{width: curChapterCorrectRate }"></div>
        </div>
      </div>
      <div class="learn-hours"><span>已学习 </span><span>{{ curArchiveCourse['learn_time']>0?parseInt(curArchiveCourse['learn_time']/(60*60))+' 小时':'0 小时' }}</span></div>
      <a class="all-courses" @click="goCourseList()">全部课程</a>
    </div>
    <div class="current-course-none" v-else-if="!isDefault">
      <i></i>
      <router-link :to="{path: '/app/book-case'}" class="add-course">添加课程</router-link>
    </div>
    <div class="current-course" v-else>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LearnCourseList from '../../common/learnCourseList.vue'
import bus from '../../../bus'
import cookie from '../../../tool/cookie'
export default {
  data () {
    return {
      isDefault: true, // 默认展示内容
      userId: '',
      curCourseCode: '',
      curCourseObj: {
        courseLevel: '',
        courseNum: 1,
        courseCore: 0,
        courseDesc: '',
        courseWords: '',
        courseBg: '',
        purchased: false
      },
      levelObj: {
        'Level1': 'A1',
        'Level2': 'A2',
        'Level3': 'B1',
        'Level4': 'B2',
        'Level5': 'C1',
        'Level6': 'C2'
      },
      curChapterCode: '',
      maxLevelNum: 6,
      curChapterCorrectRate: '',
      curArchiveCourse: {},
      isShowSubscribeCourses: false,
      isShowNext: true,
      isShowPre: true,
      subscribeLangCourses: []
    }
  },
  created () {
    bus.$on('loadIndexCourse', (code) => {
      this.isShowSubscribeCourses = false
      this.initData(code)
    })
  },
  mounted () {
    // this.getUserInfo()
    this.userId = cookie.getCookie('user_id')
    this.getMoreLearnCourses().then(res => {
      if (res.success) {
        let learnCourses = res.learn_courses
        learnCourses.forEach(item => {
          if (!parseInt(item.course_type)) {
            this.subscribeLangCourses.push(item)
          }
        })
        this.subscribeLangCourses = this.subscribeLangCourses.reverse()
        console.log('订阅的官方课程', this.subscribeLangCourses)
      }
    })
    if (this.userId) {
      let courseCode = ''
      if (cookie.getCookie('purchaseCourseCode')) {
        courseCode = cookie.getCookie('purchaseCourseCode')
      }
      this.initData(courseCode)
    } else {
      bus.$emit('loadRecommendRadio', '')
      this.isDefault = false
    }
  },
  components: {
    LearnCourseList
  },
  computed: {
    ...mapState({
      courseBaseInfo: state => state.course.courseBaseInfo,
      learnInfo: state => state.course.learnInfo,
      currentChapterCode: state => state.course.currentChapterCode,
      assetsUrl: state => state.course.assetsUrl,
      chapterDes: state => state.course.chapterDes,
      unlock: state => state.course.unlock,
      unlockCourses: state => state.course.unlockCourses,
      chapters: state => state.course.chapters,
      userInfo: state => state.userInfo,
      historyCourseRecord: state => state.course.historyCourseRecord
    }),
    courseDesc () {
      if (this.curCourseObj['courseLevel'] && this.curCourseObj['courseNum'] && this.curCourseObj['courseDesc']) {
        return this.curCourseObj['courseLevel'] + ' 课程' + this.curCourseObj['courseNum'] + '：' + this.curCourseObj['courseDesc']
      } else {
        return ' '
      }
    },
    isVip () {
      if (!this.userInfo.member_info) {
        return
      }
      return this.userInfo.member_info['member_type']
    }
  },
  methods: {
    ...mapMutations({
      updateUnlockCourseList: 'course/updateUnlockCourseList'
    }),
    ...mapActions({
      getLearnInfo: 'course/getLearnInfo',
      setCurrentChapter: 'course/setCurrentChapter',
      getLearnCourses: 'course/getLearnCourses',
      getMoreLearnCourses: 'getMoreLearnCourses',
      getUnlockChapter: 'course/getUnlockChapter',
      getCourseContent: 'course/getCourseContent',
      getProgress: 'course/getProgress',
      getChapterContent: 'course/getChapterContent',
      getCourseTestRanking: 'course/getCourseTestRanking',
      homeworkContent: 'course/homeworkContent',
      getCourseArchives: 'user/getCourseArchives',
      getUserInfo: 'getUserInfo'
    }),
    async initData (courseCode) {
      var _this = this
      let res = await this.getUserInfo()
      console.log(res)
      this.curCourseCode = res.info.current_course_code
      if (courseCode) {
        this.curCourseCode = courseCode
      }
      if (this.curCourseCode) {
        let res1 = await _this.getLearnInfo(this.curCourseCode)
        await _this.getUnlockChapter(this.curCourseCode).then((res) => {
          _this.updateUnlockCourseList(res)
        })
        this.curChapterCode = res1.info.learnInfo.current_chapter_code
        this.maxLevelNum = res1.info.courseBaseInfo.level_num
        let contentUrl = res1.info.courseBaseInfo.content_config.content_url
        await _this.getCourseContent(contentUrl)
        // await _this.getLearnCourses()
        await this.setCurrentChapter(this.curChapterCode)
        await this.getChapterContent()
        bus.$emit('loadRecommendRadio', this.curCourseCode)
        let obj = this.chapters.filter((item) => {
          return item.code === this.curChapterCode
        })[0]
        this.curCourseObj['courseLevel'] = this.levelObj[this.curChapterCode.split('-')[2]]
        this.curCourseObj['courseNum'] = obj ? parseInt(obj.code.split('-')[3].split('').pop() - 1) * 6 + parseInt(obj.code.split('-')[4].split('').pop()) : 1
        this.curCourseObj['courseCore'] = _this.learnInfo.core_part_num_finished === 5 ? 5 : _this.learnInfo.core_part_num_finished + 1
        this.curCourseObj['courseDesc'] = obj ? obj.info['zh-cn'].describe : ''
        this.curCourseObj['courseWords'] = obj ? obj.info['zh-cn'].words.split('/').join('、') : ''
        this.curCourseObj['courseBg'] = this.assetsUrl + (obj ? obj.image.replace('200x200', '1200x488') : '')
        this.curCourseObj['purchased'] = obj ? obj.purchased : false
        console.log(this.curCourseObj)

        _this.curChapterCorrectRate = '0%'
        let arr = this.curChapterCode.split('-')
        _this.learnInfo.correct_rates.forEach(item => {
          if (item.level_code === arr[2]) {
            item.rates.forEach(rate => {
              if (rate.unit === arr[3] && rate.chapter === arr[4]) {
                _this.curChapterCorrectRate = Math.round(rate.correct_rate * 100) + '%'
              }
            })
          }
        })

        await _this.getCourseArchives().then((res) => {
          _this.curArchiveCourse = res.archives.filter(item => {
            return item.course_code === this.curCourseCode
          })[0]
          console.log('curArchiveCourse', _this.curArchiveCourse)
        })
      } else {
        bus.$emit('loadRecommendRadio', this.curCourseCode)
      }
      await this.getUserInfo()
      this.isDefault = false
      cookie.delCookieTalkmate('purchaseCourseCode')
    },
    pre () {
      /* eslint-disable */
      $('.course-brief-core').css({marginLeft: '150px'})
      /* eslint-enable */
      this.isShowNext = true
      let coreNum = this.curCourseObj['courseCore']
      if (coreNum === 1) {
        let arr = this.curChapterCode.split('-')
        if (this.curChapterCode === arr[0] + '-' + arr[1] + '-Level1-Unit1-Chapter1') {
          this.isShowPre = false
          return
        }

        let chapterNum = parseInt(arr[4].toLowerCase().replace('chapter', ''))
        let unitNum = parseInt(arr[3].toLowerCase().replace('unit', ''))
        let levelNum = parseInt(arr[2].toLowerCase().replace('level', ''))
        if (chapterNum > 1) {
          this.curChapterCode = arr[0] + '-' + arr[1] + '-' + arr[2] + '-' + arr[3] + '-Chapter' + (chapterNum - 1)
        } else {
          if (unitNum > 1) {
            this.curChapterCode = arr[0] + '-' + arr[1] + '-' + arr[2] + '-Unit' + (unitNum - 1) + '-Chapter6'
          } else {
            if (levelNum > 1) {
              this.curChapterCode = arr[0] + '-' + arr[1] + '-Level' + (levelNum - 1) + '-Unit4-Chapter6'
            } else {
              this.curChapterCode = arr[0] + '-' + arr[1] + '-Level1-Unit1-Chapter1'
            }
          }
        }

        console.log('pre chapter code', this.curChapterCode)
        let obj = this.chapters.filter((item) => {
          return item.code === this.curChapterCode
        })[0]
        this.curCourseObj['courseLevel'] = this.levelObj[this.curChapterCode.split('-')[2]]
        this.curCourseObj['courseNum'] = parseInt(obj.code.split('-')[3].split('').pop() - 1) * 6 + parseInt(obj.code.split('-')[4].split('').pop())
        this.curCourseObj['courseCore'] = 5
        this.curCourseObj['courseDesc'] = obj.info['zh-cn'].describe
        this.curCourseObj['courseWords'] = obj.info['zh-cn'].words.split('/').join('、')
        this.curCourseObj['courseBg'] = this.assetsUrl + obj.image.replace('200x200', '1200x488')
        this.curCourseObj['purchased'] = obj.purchased
      } else {
        this.curCourseObj['courseCore'] = coreNum - 1
      }
      /* eslint-disable */
      $('.course-brief-core').animate({marginLeft: '40px'}, "linear")
      /* eslint-enable */
    },
    next () {
      this.isShowPre = true
      /* eslint-disable */
      $('.course-brief-core').css({marginLeft: '150px'})
      /* eslint-enable */
      let coreNum = this.curCourseObj['courseCore']
      if (coreNum === 5) {
        let arr = this.curChapterCode.split('-')
        if (this.curChapterCode === arr[0] + '-' + arr[1] + '-Level' + this.maxLevelNum + '-Unit4-Chapter6') {
          this.isShowNext = false
          return
        }

        let chapterNum = parseInt(arr[4].toLowerCase().replace('chapter', ''))
        let unitNum = parseInt(arr[3].toLowerCase().replace('unit', ''))
        let levelNum = parseInt(arr[2].toLowerCase().replace('level', ''))
        if (chapterNum < 6) {
          this.curChapterCode = arr[0] + '-' + arr[1] + '-' + arr[2] + '-' + arr[3] + '-Chapter' + (chapterNum + 1)
        } else {
          if (unitNum < 4) {
            this.curChapterCode = arr[0] + '-' + arr[1] + '-' + arr[2] + '-Unit' + (unitNum + 1) + '-Chapter1'
          } else {
            if (levelNum < this.maxLevelNum) {
              this.curChapterCode = arr[0] + '-' + arr[1] + '-Level' + (levelNum + 1) + '-Unit1-Chapter1'
            } else {
              this.curChapterCode = arr[0] + '-' + arr[1] + '-Level' + this.maxLevelNum + '-Unit4-Chapter6'
            }
          }
        }

        console.log('next chapter code', this.curChapterCode)
        let obj = this.chapters.filter((item) => {
          return item.code === this.curChapterCode
        })[0]
        this.curCourseObj['courseLevel'] = this.levelObj[this.curChapterCode.split('-')[2]]
        this.curCourseObj['courseNum'] = parseInt(obj.code.split('-')[3].split('').pop() - 1) * 6 + parseInt(obj.code.split('-')[4].split('').pop())
        this.curCourseObj['courseCore'] = 1
        this.curCourseObj['courseDesc'] = obj.info['zh-cn'].describe
        this.curCourseObj['courseWords'] = obj.info['zh-cn'].words.split('/').join('、')
        this.curCourseObj['courseBg'] = this.assetsUrl + obj.image.replace('200x200', '1200x488')
        this.curCourseObj['purchased'] = obj.purchased
      } else {
        this.curCourseObj['courseCore'] = coreNum + 1
      }
      /* eslint-disable */
      $('.course-brief-core').animate({marginLeft: '40px'}, "linear")
      /* eslint-enable */
    },
    startLearn () {
      let tips = ''
      if (this.unlockCourses.indexOf(this.curChapterCode) === -1) {
        tips = '完成上一课“核心课程”, <br>才能开启本课程！'
        bus.$emit('setContinueLearn', tips)
        return false
      }
      if (!this.curCourseObj['purchased'] && parseInt(this.isVip) !== 1) {
        bus.$emit('showBuyChapterPanel', this.curChapterCode)
        return false
      }

      let curCourseDetail = this.unlock[this.curChapterCode]
      let coreNum = parseInt(this.curCourseObj['courseCore'])
      let lastCore = 'A0' + ((coreNum === 1) ? 1 : coreNum - 1)
      let core = 'A0' + coreNum
      if (core !== 'A01' && !curCourseDetail[lastCore]) {
        tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
        bus.$emit('setContinueLearn', tips)
        return false
      }

      window._czc.push(['_trackEvent', '学习系统', '首页', '开始学习', '', '.start-learn'])
      if (this.curChapterCode === this.learnInfo.current_chapter_code) {
        this.$router.push({path: '/learn/stage/A0' + this.curCourseObj['courseCore']})
      } else {
        this.changeChapter(this.curChapterCode)
      }
    },
    async changeChapter (chapterCode) {
      if (this.historyCourseRecord[chapterCode] && Object.keys(this.historyCourseRecord[chapterCode]).length > 0) {
        await this.setCurrentChapter(chapterCode)
      } else {
        await this.setCurrentChapter(chapterCode)
        await this.getChapterContent()
        await this.getProgress(chapterCode)
        await this.getCourseTestRanking(chapterCode)
        await this.homeworkContent(chapterCode + '-A8')
      }
      this.$router.push({path: '/learn/stage/A0' + this.curCourseObj['courseCore']})
    },
    goCourseList () {
      bus.$emit('radioPause')
      window._czc.push(['_trackEvent', '学习系统', '首页', '全部课程', '', '.all-courses'])
      this.$router.push({ path: '/app/course-list' })
    }
  }
}
</script>

<style scoped>
  .my-course {
    width: 1180px;
    margin: 30px auto 0;
  }

  .my-course .title {
    margin: 10px 0;
    color: #849EA5;
    font-size: 15px;
    height: 21px;
    line-height: 21px;
    line-height: 30px;
    font-weight: bold;
  }

  .my-course .current-chapter {
    position: relative;
    display: inline-flex;
    background-color: #D8D8D8;
    width: 820px;
    height: 360px;
    margin-right: 14px;
    border-radius: 5px;
  }

  .current-chapter img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  .course-brief-shade{
    position: relative;
    height: 100%;
    width: 100%;
    background-image: url('../../../../static/images/learnIndex/icon-course-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 5px;
    z-index: 2;
  }

  .course-brief-title{
    font-size: 28px;
    color: #ffffff;
    height: 45px;
    line-height: 45px;
    font-weight: bold;
    margin-top: 44px;
    margin-left: 40px;
  }

  .course-brief-core {
    font-size: 16px;
    color: #ffffff;
    height: 22px;
    line-height: 22px;
    font-weight: 500;
    margin: 30px 0 0 40px;
  }

  .course-brief-words {
    font-size: 16px;
    color: #ffffff;
    height: 22px;
    line-height: 22px;
    font-weight: 500;
    margin: 2px 0 0 40px;
  }

  .change-course {
    float: left;
    width: 102px;
    height: 36px;
    margin-top: 125px;
    margin-left: 40px;
  }

  .change-course span {
    display: inline-block;
    height: 36px;
    width: 36px;
    border-radius: 50%;
    text-align: center;
    /* margin-right: 30px; */
    cursor: pointer;
  }

  .change-course .pre {
    float: left;
  }

  .change-course .pre i {
    background-image: url('../../../../static/images/learnIndex/course-pre.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    width: 36px;
    height: 36px;
  }

  .change-course .next {
    float: right;
  }
  .change-course .next i{
    background-image: url('../../../../static/images/learnIndex/course-next.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    width: 36px;
    height: 36px;
  }

  .start-learn {
    /* background-color: #2A9FE4; */
    background: rgba(5,129,209,1);
    color: #ffffff;
    border-radius: 21px;
    width: 160px;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    font-weight: 800;
    text-align: center;
    margin-right: 30px;
    float: right;
    margin-top: 125px;
    cursor: pointer;
  }

  .start-learn:hover {
    background-color: #2A9FE4;
  }

  .start-learn:active {
    background: rgba(5,129,209,1);
  }

  .my-course .current-course {
    display: inline-block;
    width: 340px;
    height: 360px;
    padding: 32px 35px;
    border-radius: 5px;
    background: #ffffff;
    box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
  }

  .current-course .subscribe-courses {
    left: 13px;
    top: 46px;
    width: 300px;
  }

  .subscribe-courses>img {
    left: 150px !important;
  }

  .current-course dl {
    width: 100%;
    height: 65px;
  }
  .current-course dt {
    float: left;
    margin-right: 15px;
  }

  .current-course dt img {
    display: inline-block;
    background: #ffffff;
    width: 72px;
    height: 72px;
    border: 3px solid #eaeaea;
    border-radius: 8px;
    object-fit: cover;
  }

  .current-course dd {
    height: 100px;
    padding-top:5px;
    position: relative;
  }

  .current-course dd a {
    font-size: 24px;
    line-height:48px;
    color: #333333;
    font-weight: bold;
    /* word-break: break-all; */
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .current-course dd a span {
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .current-course dd a i {
    margin-top: 20px;
    width: 12px;
    height: 9px;
    display: inline-block;
    background-image: url('../../../../static/images/learnIndex/icon-triangle.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .current-course dd .active span {
    color: #2A9FE4 !important;
  }

  .current-course dd .active i {
      background-image: url('../../../../static/images/learnIndex/icon-triangle-hover.svg') !important;
  }

  .current-course dd p:nth-of-type(1) {
    height:18px;
    font-size:13px;
    font-weight:400;
    color:#888888;
    line-height:18px;
    display: inline-block;
  }

  .progress-area {
    display: inline-block;
    margin-top: 24px;
    height: 34px;
  }

  .progress-area p {
    font-size: 12px;
    font-weight: 500;
    color: #98B2BE;
    height: 17px;
    line-height: 17px;
    margin-bottom: 3px;
  }

  .progress-bg {
    width: 264px;
    height: 6px;
    background-color: #f6f8f9;
    border-radius: 6px;
    display: inline-block;
  }

  .progress-area .progress{
    background-color: #2A9FE4;
    height: 6px;
    border-radius: 6px;
    width:0;
  }

  .correct-rate {
    display: inline-block;
    height: 34px;
  }

  .correct-rate p {
    font-size: 12px;
    font-weight: 500;
    color: #98B2BE;
    height: 17px;
    line-height: 17px;
    margin-bottom: 3px;
  }

  .correct-rate .progress{
    background-color: #7ED321;
    height: 6px;
    border-radius: 6px;
    width:0;
  }

  .progress-val{
    display: inline-block;
    font-size: 14px;
    line-height: 6px;
    color: #cbcbcb;
    font-weight: bold;
  }

  .learn-hours {
    font-weight: 500;
    font-size: 12px;
    color: #98B2BE;
    height: 17px;
    line-height: 17px;
    margin-top: 4px;
  }

  .all-courses {
    float:right;
    margin-top: 73px;
    width: 140px;
    height: 38px;
    line-height: 36px;
    border-radius: 21px;
    border: 1px solid #B2C0C9;
    font-size: 14px;
    font-weight: 800;
    text-align: center;
    color: #0A2B40;
    cursor: pointer;
  }

  .all-courses:hover {
    color: #2A9FE4;
    border: 1px solid #2A9FE4;
  }

  .chartroom {
    margin-top: 30px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .my-course .current-chapter-none {
    position: relative;
    display: inline-flex;
    background-color: #D8D8D8;
    width: 820px;
    height: 360px;
    margin-right: 14px;
    border-radius: 5px;
  }

  .current-chapter-none img {
    position: absolute;
    width: 820px;
    height: 360px;
    object-fit: cover;
    border-radius: 5px;
    background-image: url('../../../../static/images/learnIndex/course-default.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .my-course .current-course-none{
    display: inline-block;
    width: 340px;
    height: 360px;
    padding: 32px 35px;
    border-radius: 5px;
    background: #ffffff;
    text-align: center;
    box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
  }

  .current-course-none i {
    display: inline-block;
    width: 235px;
    height: 105px;
    background-image: url('../../../../static/images/learnIndex/add-course-default.svg');
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: 63px;
  }

  .add-course {
    /* background-color: #2A9FE4; */
    display: block;
    background: rgba(5,129,209,1);
    color: #ffffff;
    border-radius: 21px;
    width: 160px;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    font-weight: 800;
    text-align: center;
    margin: 71px auto 0;
    cursor: pointer;
  }
  .add-course:hover {
    background: #2A9FE4;
  }
  .add-course:active {
    background: rgba(5,129,209,1);
  }
</style>
