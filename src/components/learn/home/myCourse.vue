<template>
  <div class="my-course">
    <div class="title">我的课程</div>
    <div class="current-chapter">
      <img :src="learnInfo.current_chapter_bg_img" alt="">
      <div class="course-brief-shade">
        <div class="course-brief-title">
          <span>课程{{ curCourseNum }}：{{ curCourseDesc }}</span>
        </div>
        <div class="course-brief-core">
          <span>核心{{ curCoreNum }}</span>
        </div>
        <div class="course-brief-words">{{ curCourseWords }}</div>
        <div class="change-course">
          <span class="pre"><i></i></span>
          <span class="next"><i></i></span>
        </div>
        <router-link class="start-learn" tag="div" :to="{path: '/learn/stage/A0' + curCoreNum}">开始学习</router-link>
      </div>
    </div>
    <div class="current-course">
      <dl>
        <dt><img :src="curArchiveCourse['course_flag'] | urlFix('imageView2/0/w/200/h/200/format/jpg')"></dt>
        <dd>
          <p>
            <span>{{curCourseName}}</span>
            <i @click="isShowSubscribeCourses = !isShowSubscribeCourses"></i>
          </p>
          <p>世界语言地图官方课程</p>
          <learn-course-list class="subscribe-courses" v-show="isShowSubscribeCourses"></learn-course-list>
        </dd>
      </dl>
      <div class="progress-area">
        <p>学完 {{ learnInfo.chapter_num_finished + '/' + courseBaseInfo.chapter_num }}</p>
        <div class="progress-bg">
          <div class="progress" :style="{width: (curArchiveCourse['complete_rate'] ? curArchiveCourse['complete_rate']*100 : 0) +'%'}"></div>
        </div>
      </div>
      <div class="correct-rate">
        <p>正确率 {{ curChapterCorrectRate + '%' }}</p>
        <div class="progress-bg">
          <div class="progress" :style="{width: curChapterCorrectRate +'%'}"></div>
        </div>
      </div>
      <div class="learn-hours"><span>已学习 </span><span>{{ curArchiveCourse['learn_time']>0?parseInt(curArchiveCourse['learn_time']/(60*60))+' 小时':'暂无数据' }}</span></div>
      <router-link class="all-courses" tag="div" :to="{path: '/app/course-list'}">全部课程</router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LearnCourseList from '../../common/learnCourseList.vue'

export default {
  data () {
    return {
      curCourseCode: '',
      curCourseName: '',
      curCourseNum: 1,
      curCoreNum: 1,
      curCourseDesc: '',
      curCourseWords: '',
      curChapterCorrectRate: '',
      curChapterDesc: '',
      curArchiveCourse: {},
      isShowSubscribeCourses: false
    }
  },
  mounted () {
    this.initData()
  },
  components: {
    LearnCourseList
  },
  computed: {
    ...mapState({
      courseBaseInfo: state => state.course.courseBaseInfo,
      learnInfo: state => state.course.learnInfo,
      currentChapterCode: state => state.course.currentChapterCode,
      chapterDes: state => state.course.chapterDes,
      userInfo: state => state.userInfo
    }),
    ui () {
      let ui = this.userInfo
      if (Object.keys(ui).length === 0) {
        ui = JSON.parse(localStorage.getItem('userInfo'))
      }
      return ui
    }
  },
  methods: {
    ...mapMutations({
      updateChapterDes: 'course/updateChapterDes'
    }),
    ...mapActions({
      getLearnInfo: 'course/getLearnInfo',
      setCurrentChapter: 'course/setCurrentChapter',
      getLearnCourses: 'course/getLearnCourses',
      getCourseArchives: 'user/getCourseArchives'
    }),
    async initData () {
      var _this = this
      // await this.setCurrentChapter('ENG-Basic-Level1-Unit4-Chapter1')
      await _this.getLearnCourses()
      console.log('userInfo', _this.userInfo)
      // let curCourseCode = _this.userInfo.current_course_code

      let curCourseCode = _this.ui.current_course_code
      await _this.getLearnInfo(curCourseCode).then(() => {
        console.log('learnInfo', _this.learnInfo)
        console.log('courseBaseInfo', _this.courseBaseInfo)
        _this.curCourseCode = _this.courseBaseInfo.code
        _this.curCourseNum = parseInt(this.learnInfo.current_chapter_code.split('-')[3].split('').pop() - 1) * 6 + parseInt(_this.learnInfo.current_chapter_code.split('-')[4].split('').pop())
        _this.curCoreNum = _this.learnInfo.core_part_num_finished === 5 ? 5 : _this.learnInfo.core_part_num_finished + 1
        _this.curCourseDesc = _this.learnInfo.current_chapter_info.describe
        _this.curCourseWords = _this.learnInfo.current_chapter_info.words.split('/').join('、')
        let curChapter = _this.learnInfo.current_chapter_code
        _this.updateChapterDes(curChapter)
        let arr = curChapter.split('-')
        _this.learnInfo.correct_rates.forEach(item => {
          if (item.level_code === arr[2]) {
            item.rates.forEach(rate => {
              if (rate.unit === arr[3] && rate.chapter === arr[4]) {
                _this.curChapterCorrectRate = rate.correct_rate * 100
                _this.curChapterDesc = '当前为' + _this.chapterDes[1].replace(' ', '') + _this.chapterDes[2]
              }
            })
          }
        })
      })

      await _this.getCourseArchives().then((res) => {
        _this.curArchiveCourse = res.archives.filter(item => {
          return item.course_code === _this.curCourseCode
        })[0]
        _this.curCourseName = _this.curArchiveCourse.course_name['zh-CN']
        console.log('curArchiveCourse', _this.curArchiveCourse)
      })
    }
  }
}
</script>

<style scoped>
  .my-course {
    width: 1200px;
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
    margin-right: 16px;
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
    background: rgba(0,0,0,0.40);
    border-radius: 5px;
    z-index: 2;
  }

  .course-brief-title{
    font-size: 28px;
    color: #ffffff;
    line-height: 45px;
    font-weight: 500;
    margin-top: 44px;
    margin-left: 40px;
  }

  .course-brief-core{
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    font-weight: 500;
    margin: 30px 0 0 40px;
  }

  .course-brief-words {
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    font-weight: 500;
    margin: 2px 0 0 40px;
  }

  .change-course {
    float: left;
    width: 100px;
    height: 36px;
    margin-top: 125px;
    margin-left: 40px;
  }

  .change-course span {
    display: inline-flex;
    height: 36px;
    width: 36px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.4)
  }

  .change-course .pre {
    float: left;
  }

  .change-course .pre i {
    background-image: url('../../../../static/images/learnIndex/course-pre.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    width: 10px;
    height: 27px;
    margin-left: 10px;
    margin-top: 4px;
  }

  .change-course .next i{
    background-image: url('../../../../static/images/learnIndex/course-next.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    width: 12px;
    height: 20px;
    margin-left: 12px;
    margin-top: 8px;
  }

  .change-course .next {
    float: right;
  }

  .start-learn {
    background-color: #2A9FE4;
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
    /* width: 380px; */
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
    border: 2px solid #eaeaea;
    border-radius: 6px;
    object-fit: cover;
  }

  .current-course dd {
    height: 100px;
    padding-top:5px;
    position: relative;
  }

  .current-course dd p:nth-of-type(1) {
    font-size: 24px;
    line-height:48px;
    color: #333333;
    font-weight: bold;
    /* word-break: break-all; */
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .current-course dd p:nth-of-type(1) i {
    margin-top: 20px;
    width: 15px;
    height: 10px;
    display: inline-block;
    background-image: url('../../../../static/images/learnIndex/course-select-icon.svg');
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
  }

  .current-course dd p:nth-of-type(2) {
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
    background-color: #7ED321;
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
    background-color: #2A9FE4;
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
    margin-top: 78px;
    width: 140px;
    height: 38px;
    line-height: 36px;
    border-radius: 21px;
    border: 1px solid #717f85;
    font-size: 14px;
    font-weight: 800;
    text-align: center;
    color: #717f85;
    cursor: pointer;
  }

  .chartroom {
    margin-top: 30px;
  }
</style>
