<template>
  <div class="current-course">
    <left-side
      :user-info="userInfo"
    />
    <div class="course-list">
      <level-tabs
        :levelDetail="levelDetail"
        :levelNum="levelNum"
        :curLevel="curLevel"
        @loadChapterInfo="loadChapterInfo"
      />
      <chapter-item
        :currentCourseCode="currentCourseCode"
        @loadChapterInfo="loadChapterInfo"
      />
    </div>
    <pulse-loader :loading="loading" class="loading"/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import LeftSide from './leftSide.vue'
import LevelTabs from './levelTabs.vue'
import ChapterItem from './chapterItem.vue'

export default {
  data () {
    return {
      levels: []
    }
  },
  components: {
    LeftSide,
    LevelTabs,
    ChapterItem,
    PulseLoader
  },
  mounted () {
    this.$parent.$emit('initLayout')
    this.$parent.$emit('navItem', 'course')
    this.showLoading()
    let curCourseCode = this.currentCourseCode
    if (!curCourseCode) {
      curCourseCode = localStorage.getItem('currentCourseCode')
    }
    this.$nextTick(() => {
      Promise.all([
        this.getLearnInfo(curCourseCode).then((res) => {
          this.updateCourseInfo(res)
        }),
        this.getUnlockChapter(curCourseCode).then((res) => {
          this.updateUnlockCourseList(res)
        })
      ]).then(() => {
        this.getCourseContent(this.contentUrl).then((res) => {
          this.updateChapters(res)
          this.updateCurChapterUrl(this.currentChapterCode)
          this.updateCurChapter(this.currentChapterCode)
          this.getChapterContent().then((res) => {
            this.updateChapterContent(res)
            setTimeout(() => {
              this.hideLoading()
            }, 100)
          })
        })
      }).then(() => {
        this.getRecord(this.currentChapterCode + '-A0')
        this.getProgress(this.currentChapterCode).then((res) => {
          if (res.state !== 0) {
            this.updateCurChapterProgress(res.record.forms)
          } else {
            this.updateCurChapterProgress('')
          }
          this.homeworkContent(this.currentChapterCode + '-A8').then((res) => {
            this.updateHomeworkContent(res.contents)
          })
        })
        this.getCourseTestRanking(this.currentChapterCode).then((res) => {
          this.updateChapterTestResult(res.result.current_user)
        })
      })
    })
  },
  computed: {
    ...mapState({
      'userInfo': state => state.user.userInfo,
      'currentCourseCode': state => state.course.currentCourseCode,
      'currentChapterCode': state => state.course.currentChapterCode,
      'curLevel': state => state.course.curLevel,
      'levelDetail': state => state.course.levelDetail,
      'levelNum': state => state.course.levelNum,
      'contentUrl': state => state.course.contentUrl,
      'chapters': state => state.course.chapters,
      'chapterTestResult': state => state.course.chapterTestResult,
      'loading': state => state.course.loading,
      'learnCourses': state => state.course.learnCourses
    })
  },
  methods: {
    ...mapActions({
      getLearnInfo: 'course/getLearnInfo',
      getCourseContent: 'course/getCourseContent',
      getUnlockChapter: 'course/getUnlockChapter',
      getRecord: 'course/getRecord',
      getProgress: 'course/getProgress',
      getChapterContent: 'course/getChapterContent',
      setCurrentChapter: 'course/setCurrentChapter',
      getCourseTestRanking: 'learn/getCourseTestRanking',
      homeworkContent: 'course/homeworkContent'
    }),
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateChapters: 'course/updateChapters',
      updateCurChapterProgress: 'course/updateCurChapterProgress',
      updateCurCoreParts: 'course/updateCurCoreParts',
      chapterProgress: 'course/chapterProgress',
      updateCurChapterUrl: 'course/updateCurChapterUrl',
      updateCurChapter: 'course/updateCurChapter',
      updateCourseInfo: 'course/updateCourseInfo',
      updateChapterTestResult: 'course/updateChapterTestResult',
      updateChapterContent: 'course/updateChapterContent',
      updateUnlockCourseList: 'course/updateUnlockCourseList',
      showLoading: 'course/showLoading',
      hideLoading: 'course/hideLoading',
      updateHomeworkContent: 'course/updateHomeworkContent'
    }),
    loadChapterInfo (chapterCode) {
      this.showLoading()
      this.$nextTick(() => {
        this.setCurrentChapter(chapterCode).then(() => {
          this.updateCurChapterUrl(chapterCode)
          this.updateCurChapter(chapterCode)
          this.getChapterContent().then((res) => {
            this.updateChapterContent(res)
          })
          this.getProgress(chapterCode).then((res) => {
            if (res.state !== 0) {
              this.updateCurChapterProgress(res.record.forms)
            } else {
              this.updateCurChapterProgress('')
            }
            this.homeworkContent(this.currentChapterCode + '-A8').then((res) => {
              this.updateHomeworkContent(res.contents)
              this.hideLoading()
            })
          })
          this.getCourseTestRanking(chapterCode).then((res) => {
            this.updateChapterTestResult(res.result.current_user)
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.current-course {
  width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 40px;
}

.course-list {
  min-width: 879px;
  display: inline-block;
  margin-left: 20px;
  vertical-align: top;
}

.loading {
  display: block;
  position: absolute;
  left: 55% ;
  top: 400px;
}
</style>
