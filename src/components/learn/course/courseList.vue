<template>
  <div class="current-course">
    <left-side />
    <level-tabs
      :levelDetail="levelDetail"
      :levelNum="levelNum"
      :curLevel="curLevel"
      @selLevel="selLevel"
    />
    <div class="course-content">
      <transition name="fade">
        <chapter-item
          :currentCourseCode="currentCourseCode"
          @loadChapterInfo="loadChapterInfo"
          v-show="isShow"
          ref="chapterItem"
        />
      </transition>
    </div>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import $ from 'jquery'
import Loading from '../../common/loading.vue'
import LeftSide from './leftSide.vue'
import LevelTabs from './levelTabs.vue'
import ChapterItem from './chapterItem.vue'

export default {
  data () {
    return {
      levels: [],
      isShow: true
    }
  },
  components: {
    LeftSide,
    LevelTabs,
    ChapterItem,
    Loading
  },
  mounted () {
    this.$parent.$emit('initLayout')
    this.$parent.$emit('navItem', 'course')
    // this.showLoading()

    this.initData()
  },
  computed: {
    ...mapState({
      'userInfo': state => state.userInfo,
      'currentCourseCode': state => state.course.currentCourseCode,
      'currentChapterCode': state => state.course.currentChapterCode,
      'curLevel': state => state.course.curLevel,
      'levelDetail': state => state.course.levelDetail,
      'levelNum': state => state.course.levelNum,
      'contentUrl': state => state.course.contentUrl,
      'chapters': state => state.course.chapters,
      'chapterTestResult': state => state.course.chapterTestResult,
      'loading': state => state.course.loading,
      'unlockCourses': state => state.course.unlockCourses,
      'learnCourses': state => state.course.learnCourses,
      historyCourseRecord: state => state.course.historyCourseRecord
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
      getCourseTestRanking: 'course/getCourseTestRanking',
      homeworkContent: 'course/homeworkContent',
      getUserInfo: 'getUserInfo'
    }),
    ...mapMutations({
      updateUnlockCourseList: 'course/updateUnlockCourseList',
      showLoading: 'course/showLoading',
      hideLoading: 'course/hideLoading',
      updateCurLevel: 'course/updateCurLevel'
    }),
    async loadChapterInfo (chapterCode) {
      if (this.unlockCourses.indexOf(chapterCode) > -1) {
        console.log(this.historyCourseRecord)
        if (this.historyCourseRecord[chapterCode] && Object.keys(this.historyCourseRecord[chapterCode]).length > 0) {
          this.$refs['chapterItem'].$emit('changeIsHistory', true)
          await this.setCurrentChapter(chapterCode)
          this.$refs['chapterItem'].$emit('changeIsShow', true)
        } else {
          this.showLoading()
          this.$refs['chapterItem'].$emit('changeIsHistory', false)
          await this.setCurrentChapter(chapterCode)
          await this.getChapterContent()

          await this.getProgress(chapterCode)

          await this.getCourseTestRanking(chapterCode)

          await this.homeworkContent(this.currentChapterCode + '-A8')

          this.hideLoading()
          this.$refs['chapterItem'].$emit('saveHistoryCourseData')
        }

        setTimeout(() => {
          this.$refs['chapterItem'].$emit('changeIsShow', true)
          let top = $('#' + chapterCode).offset().top - 116
          $('body,html').animate({ scrollTop: top }, 300, 'linear')
        }, 0)
        // $('body,html').scrollTop(top)
      }
    },
    async initData () {
      let res = await this.getUserInfo()
      let curCourseCode = res.info.current_course_code
      console.log('courselist initData', curCourseCode)
      this.$refs['chapterItem'].$emit('changeIsHistory', false)
      await this.getLearnInfo(curCourseCode)
      await this.getUnlockChapter(curCourseCode).then((res) => {
        console.log('courselist ==> ', res)
        this.updateUnlockCourseList(res)
      })
      await this.getCourseContent(this.contentUrl)
      await this.getChapterContent()

      await this.getRecord(this.currentChapterCode + '-A0')
      await this.getProgress(this.currentChapterCode)
      await this.homeworkContent(this.currentChapterCode + '-A8')
      await this.getCourseTestRanking(this.currentChapterCode)

      // let top = $('#' + this.currentChapterCode).offset().top - 116
      // $('body,html').animate({ scrollTop: top }, 100, 'linear')

      // this.hideLoading()
      this.$refs['chapterItem'].$emit('saveHistoryCourseData')
    },
    selLevel (level) {
      this.isShow = false
      setTimeout(() => {
        this.updateCurLevel(level)
        this.isShow = true
      }, 200)
    }
  }
}
</script>

<style scoped>
.current-course {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.course-content {
  display: inline-block;
  margin-left: 290px;
  vertical-align: top;
}

.loading {
  display: block;
  position: absolute;
  left: 55% ;
  top: 400px;
}

.fade-enter-active, .fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 1.5, 1.8, 1.0);
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@media screen and (max-width: 1024px) {
  .current-course {
    width: 960px;
  }

  .course-content {
    margin-left: 255px;
  }
}
</style>
