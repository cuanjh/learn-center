<template>
  <div class="homework-wrap">
    <div class="homework-container">
      <a href="javascript:;" class="homework-balk" @click="back()">
        <p></p>
        <span>返回</span>
      </a>
      <div class="homework-content">
        <div class="homework-title">
          <p>{{courseName + '·' + chapterDes.join('·')}}</p>
        </div>
        <div class="my-work">
          <p class="line"></p>
          <span>我的作业</span>
        </div>
        <!-- 作业列表，分为语音和写作 -->
        <div class="homework-list">
          <speakwork class="homework-item" @initData="initData" v-for="(homework, index) in homeworkList" :key="index" :homework="homework"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import speakwork from './speakwork.vue'
import Recorder from '../../../plugins/recorder'

export default {
  data () {
    return {
      curChapterCode: '',
      courseCode: '',
      courseName: '',
      homeworkList: []
    }
  },
  created () {
    Recorder.init()
  },
  components: {
    speakwork
  },
  mounted () {
    this.$parent.$emit('initLayout')
    // 判断如果currentChapterCode不存在去localStorgae中取
    this.curChapterCode = localStorage.getItem('currentChapterCode')
    console.log(this.curChapterCode)
    this.courseCode = this.curChapterCode.split('-').slice(0, 2).join('-')
    console.log(this.courseCode)
    this.getOneCourseSub({course_code: this.courseCode}).then(res => {
      console.log('courseSubInfo', res)
      this.courseName = res.subInfo.name[this.$i18n.locale]
    })
    this.updateChapterDes(this.curChapterCode)
    this.initData()
  },
  computed: {
    ...mapState({
      currentChapterCode: state => state.course.currentChapterCode,
      tips: state => state.learn.tips,
      chapterDes: state => state.course.chapterDes
    }),
    isKid () {
      let isKid = localStorage.getItem('isKid')
      return isKid
    }
  },
  methods: {
    ...mapActions({
      getOneCourseSub: 'getOneCourseSub',
      setModuleComplete: 'setModuleComplete',
      getHomeworkContent: 'getHomeworkContent'
    }),
    ...mapMutations({
      updateChapterDes: 'course/updateChapterDes'
    }),
    initData () {
      let activityCode = this.curChapterCode + '-A8'
      this.getHomeworkContent(activityCode).then(res => {
        this.homeworkList = res.contents
        let complete = this.homeworkList.filter(item => {
          return item.has_done === true
        })
        if (complete.length === this.homeworkList.length) {
          this.setModuleComplete({chapter_code: this.curChapterCode, module: 'homework_complete'})
        }
      })
    },
    back () {
      let isKid = localStorage.getItem('isKid')
      if (isKid === '1') {
        this.$router.push({path: '/app/kid-course-list/' + this.courseCode})
      } else {
        this.$router.push({path: '/app/course-list/' + this.courseCode})
      }
    }
  }
}
</script>

<style lang="less" scoped>
a {
  text-decoration:none;
}
.homework-container {
  width: 890px;
  margin: 80px auto 0;
  .homework-balk {
    display: block;
    width: 80px;
    height: 30px;
    background: #ffffff;
    text-align: center;
    line-height: 30px;
    border-radius: 6px;
    margin-bottom: 28px;
    &:hover{
      background: #2a9fe4;
    }
    p {
      display: inline-block;
      background: url(../../../../static/images/homework/balck.png);
      background-size: 100% 100%;
      margin-top: 6px;
      width: 12px;
      height: 18px;
    }
    span {
      font-size: 16px;
      color: #333333;
      &:hover {
        color: #ffffff;
      }
    }
  }
  .homework-content {
    width: 100%;
    .homework-title {
      width: 100%;
      height: 70px;
      background: #2a9fe4;
      p {
        display: inline-block;
        vertical-align: middle;
        line-height: 70px;
        font-size: 26px;
        color: #ffffff;
        margin-left: 20px;
      }
    }
    .my-work {
      width: 100%;
      height: 60px;
      background: #ffffff;
      line-height: 60px;
      .line {
        display: inline-block;
        vertical-align: middle;
        line-height: 60px;
        width: 8px;
        height: 20px;
        background: #2a9fe4;
        margin: 20px 10px 20px 20px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      span {
        font-size: 24px;
      }
    }
    // 语音css
    .homework-list {
      width: 106%;
      margin-top: 20px;
      overflow: hidden;

    }
    .homework-item {
      display: inline-block;
      width: 32.3333%;
    }

  }
}
</style>
