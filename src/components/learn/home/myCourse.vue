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
        <router-link class="start-learn" tag="div" :to="{path: '/learn/stage/A0' + curCoreNum}">开始学习</router-link>
      </div>
    </div>
    <div class="current-course">
      <dl>
        <dt><img :src="curArchiveCourse['course_flag'] | urlFix('imageView2/0/w/200/h/200/format/jpg')"></dt>
        <dd>
          <p>
            <span>{{curCourseName}}</span>
          </p>
          <p>世界语言地图官方课程</p>
        </dd>
      </dl>
      <div class="progress-area">
        <div class="progress-bg">
          <div class="progress" :style="{width: (curArchiveCourse['complete_rate'] ? curArchiveCourse['complete_rate']*100 : 0) +'%'}"></div>
        </div>
        <div class="progress-val"
          v-text="(parseFloat(curArchiveCourse['complete_rate']) > 0 ? curArchiveCourse['complete_rate']*100 : 0)+'%'">
        </div>
      </div>
      <div class="learn-hours"><span>已学习 </span><span>{{ curArchiveCourse['learn_time']>0?parseInt(curArchiveCourse['learn_time']/(60*60))+' 小时':'暂无数据' }}</span></div>
      <div class="correct-rate"><span v-text="curChapterCorrectRate ? curChapterCorrectRate : '暂无数据'"></span></div>
      <router-link class="all-courses" tag="div" :to="{path: '/app/course-list'}">全部课程</router-link>
    </div>
    <chartroom class="chartroom"/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Chartroom from './chartroom.vue'

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
      curArchiveCourse: {}
    }
  },
  created () {
    this.initData()
  },
  components: {
    Chartroom
  },
  computed: {
    ...mapState({
      courseBaseInfo: state => state.course.courseBaseInfo,
      learnInfo: state => state.course.learnInfo,
      currentChapterCode: state => state.course.currentChapterCode,
      chapterDes: state => state.course.chapterDes,
      userInfo: state => state.user.userInfo

    })
  },
  methods: {
    ...mapMutations({
      updateChapterDes: 'course/updateChapterDes'
    }),
    ...mapActions({
      getLearnInfo: 'course/getLearnInfo',
      getLearnCourses: 'course/getLearnCourses',
      getUserInfo: 'user/getUserInfo',
      getCourseArchives: 'user/getCourseArchives'
    }),
    async initData () {
      // await this.getUserInfo()
      await this.getUserInfo()
      await this.getLearnCourses()
      console.log('userInfo', this.userInfo)
      await this.getLearnInfo().then(() => {
        console.log('learnInfo', this.learnInfo)
        console.log('courseBaseInfo', this.courseBaseInfo)
        this.curCourseCode = this.courseBaseInfo.code
        this.curCourseNum = parseInt(this.learnInfo.current_chapter_code.split('-')[3].split('').pop() - 1) * 6 + parseInt(this.learnInfo.current_chapter_code.split('-')[4].split('').pop())
        this.curCoreNum = this.learnInfo.core_part_num_finished + 1
        this.curCourseDesc = this.learnInfo.current_chapter_info.describe
        this.curCourseWords = this.learnInfo.current_chapter_info.words.split('/').join('、')
        let curChapter = this.learnInfo.current_chapter_code
        this.updateChapterDes(curChapter)
        let arr = curChapter.split('-')
        this.learnInfo.correct_rates.forEach(item => {
          if (item.level_code === arr[2]) {
            item.rates.forEach(rate => {
              if (rate.unit === arr[3] && rate.chapter === arr[4]) {
                this.curChapterCorrectRate = '正确率 ' + rate.correct_rate * 100 + '%（当前为' + this.chapterDes[1].replace(' ', '') + this.chapterDes[2] + '）'
              }
            })
          }
        })
      })

      await this.getCourseArchives().then((res) => {
        this.curArchiveCourse = res.archives.filter(item => {
          return item.course_code === this.curCourseCode
        })[0]
        this.curCourseName = this.curArchiveCourse.course_name['zh-CN']
        console.log('curArchiveCourse', this.curArchiveCourse)
      })
    }
  }
}
</script>

<style scoped>
  .my-course {
    width: 1200px;
    margin: 30px auto;
  }

  .my-course .title {
    color: #849EA5;
    font-size: 16px;
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
    margin-top: 45px;
    margin-left: 50px;
  }

  .course-brief-core{
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    font-weight: 500;
    margin: 30px 0 0 50px;
  }

  .course-brief-words {
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    font-weight: 500;
    margin: 0 0 0 50px;
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
    margin-left: 50px;
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
    margin-top: 32px;
  }

  .progress-bg {
    width: 228px;
    height: 6px;
    background-color: #ecf1f4;
    border-radius: 6px;
    display: inline-block;
  }

  .progress{
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
    font-weight: 400;
    font-size: 14px;
    color: #888888;
    line-height: 20px;
  }

  .correct-rate {
    font-weight: 400;
    font-size: 14px;
    color: #888888;
    line-height: 20px;
  }

  .all-courses {
    margin-top: 88px;
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
