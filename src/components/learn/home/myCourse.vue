<template>
  <div class="my-course">
    <div class="title">我的课程</div>
    <div>
      <div class="current-chapter">
        <img :src="learnInfo.current_chapter_bg_img" alt="">
        <div class="course-brief-shade">
          <div class="course-brief-title">
            <span>课程</span>
            <span>{{ curCourseNum }}</span>
            <span>核心</span>
            <span>{{ curCoreNum }}</span>
          </div>
          <div class="course-brief-describe">{{ curCourseDesc }}</div>
          <div class="course-brief-words">{{ curCourseWords }}</div>
          <router-link class="start-learn" tag="div" :to="{path: '/learn/stage/A0' + curCoreNum}">开始学习</router-link>
          <!-- <div class="course-brief-progress-title">学习进度：</div>
          <div class="course-brief-progress-area">
            <div class="course-brief-progress-bg">
              <div class="course-brief-progress" :style="{width: item.progress+'%'}"></div>
            </div>
            <div class="course-brief-progress-val">
              {{ (item.progress ? item.progress : 0)+'%'}}
            </div>
          </div>
          <div class="course-brief-shrink">
            <i class="shrink" @click="switchShow()"></i>
          </div> -->
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
            <!-- <p v-text='courseBaseInfo.name'></p>
            <p>{{$t('course.finished')}}&nbsp;<span v-text="finishedChapter + '/' + chapterNum"></span>&nbsp;{{$t('course.classHour')}}</p>
            <p class="vip" v-if="isVip === 1"><span><i></i>{{ vipEndDate }}到期</span><router-link tag="span" :to="{path: '/app/user/vip'}">会员续费</router-link></p>
            <p class="no-vip" v-else><span><i></i>你还不是会员</span><router-link tag="span" :to="{path: '/app/user/vip'}">成为会员</router-link></p> -->
          </dd>
        </dl>
        <div class="progress-area">
          <div class="progress-bg">
            <div class="progress" :style="{width: (curArchiveCourse['complete_rate'] ? curArchiveCourse['complete_rate']*100 : 0) +'%'}"></div>
          </div>
          <div class="progress-val"
            :style="{color: curArchiveCourse['complete_rate'] ? '#0581d1' : '#cbcbcb'}"
            v-text="(parseFloat(curArchiveCourse['complete_rate']) > 0 ? curArchiveCourse['complete_rate']*100 : 0)+'%'">
          </div>
        </div>
        <div class="learn-hours"><span>总时长</span><span>{{ curArchiveCourse['learn_time']>0?parseInt(curArchiveCourse['learn_time']/60)+'分钟':'暂无数据' }}</span></div>
        <div class="correct-rate"><span>正确率</span><span v-text="curArchiveCourse['correct_rate']>0?curArchiveCourse['correct_rate']*100+'%':'暂无数据'"></span></div>
        <router-link class="start-learn" tag="div" :to="{path: '/app/course-list'}">课程目录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      curCourseCode: '',
      curCourseName: '',
      curCourseNum: 1,
      curCoreNum: 1,
      curCourseDesc: '',
      curCourseWords: '',
      curArchiveCourse: {}
    }
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState({
      courseBaseInfo: state => state.course.courseBaseInfo,
      learnInfo: state => state.course.learnInfo,
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    ...mapActions({
      getLearnInfo: 'course/getLearnInfo',
      getUserInfo: 'user/getUserInfo',
      getCourseArchives: 'user/getCourseArchives'
    }),
    async initData () {
      // await this.getUserInfo()
      await this.getUserInfo()
      console.log('userInfo', this.userInfo)
      await this.getLearnInfo().then(() => {
        this.curCourseCode = this.courseBaseInfo.code
        this.curCourseNum = parseInt(this.learnInfo.current_chapter_code.split('-')[3].split('').pop() - 1) * 6 + parseInt(this.learnInfo.current_chapter_code.split('-')[4].split('').pop())
        this.curCoreNum = this.learnInfo.core_part_num_finished + 1
        this.curCourseDesc = this.learnInfo.current_chapter_info.describe
        this.curCourseWords = this.learnInfo.current_chapter_info.words.split('/').join('、')
      })
      console.log('userInfo', this.learnInfo)
      // console.log('courseBaseInfo', this.courseBaseInfo)
      // console.log('learnInfo', this.learnInfo)
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
    margin: 40px auto;
  }

  .my-course .title {
    line-height: 30px;
  }

  .my-course .current-chapter {
    position: relative;
    display: inline-flex;
    width: 65%;
    height: 300px;
    background: blue;
    margin-right: 18px;
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
    font-size: 30px;
    color: #ffffff;
    line-height: 48px;
    font-weight: 500;
    padding-top: 54px;
    padding-left: 36px;
  }

  .course-brief-describe{
    font-size: 18px;
    color: #ffffff;
    line-height: 24px;
    font-weight: 500;
    margin: 2px 0 0 36px;
  }

  .course-brief-words {
    font-size: 18px;
    color: #ffffff;
    line-height: 24px;
    font-weight: 500;
    margin: 2px 0 0 36px;
  }

  .start-learn {
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 30px;
    width: 130px;
    padding: 5px;
    text-align: center;
    margin-left: 40px;
    margin-top: 10px;
    cursor: pointer;
  }

  .my-course .current-course {
    display: inline-block;
    width: 33%;
    height: 300px;
    padding: 30px;
    background: green;
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
    width: 62px;
    height: 62px;
    border: #ffffff solid 2px;
    border-radius: 4px;
    box-shadow: #3179A3 0 2px 7px;
    object-fit: cover;
  }

  .current-course dd {
    height: 100px;
    position: relative;
  }

  .current-course dd p {
    font-size: 16px;
    font-weight: bold;
    padding-right: 20px;
  }

  .current-course dd p:nth-of-type(1) {
    font-size: 19px;
    line-height:26px;
    font-weight: 600px;
    color: #ffffff;
    /* word-break: break-all; */
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .current-course dd p:nth-of-type(2) {
    height:20px;
    font-size:14px;
    font-weight:500;
    color:#ffffff;
    line-height:20px;
    display: inline-block;
    margin-top: 15px
  }

  .progress-area {
    margin-right: 10px;
    width: 100%;
  }

  .progress-bg {
    width: 230px;
    height: 12px;
    background-color: #f4f4f4;
    border-radius: 100px;
    margin: 20px 0px;
    display: inline-block;
  }

  .progress{
    background-color: #2097DD;
    height: 12px;
    border-radius: 100px;
    width:0;
  }

  .progress-val{
    display: inline-block;
    font-size: 14px;
    color: #cbcbcb;
    line-height: 51px;
    font-weight: bold;
  }
</style>
