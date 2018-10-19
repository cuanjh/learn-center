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
        @selLevel="selLevel"
      />
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
import Loading from '../../common/loading/loading.vue'
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
    this.showLoading()
    let curCourseCode = this.currentCourseCode
    if (!curCourseCode) {
      curCourseCode = localStorage.getItem('currentCourseCode')
    }
    this.initData(curCourseCode)
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
      'unlockCourses': state => state.course.unlockCourses,
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
      getCourseTestRanking: 'course/getCourseTestRanking',
      homeworkContent: 'course/homeworkContent'
    }),
    ...mapMutations({
      updateUnlockCourseList: 'course/updateUnlockCourseList',
      showLoading: 'course/showLoading',
      hideLoading: 'course/hideLoading',
      updateCurLevel: 'course/updateCurLevel'
    }),
    async loadChapterInfo (chapterCode) {
      if (this.unlockCourses.indexOf(chapterCode) > -1) {
        this.showLoading()
        await this.setCurrentChapter(chapterCode)

        await this.getChapterContent()

        await this.getProgress(chapterCode)

        await this.getCourseTestRanking(chapterCode)

        await this.homeworkContent(this.currentChapterCode + '-A8')

        this.hideLoading()
        this.$refs['chapterItem'].$emit('changeIsShow', false)
        let top = $('#' + chapterCode).offset().top - 90
        $('body,html').animate({ scrollTop: top }, 100, 'linear')
        // $('body,html').scrollTop(top)
      }
    },
    async initData (curCourseCode) {
      console.log('courselist initData', curCourseCode)
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
      this.hideLoading()
    },
    selLevel (level) {
      this.isShow = false
      setTimeout(() => {
        this.updateCurLevel(level)
        this.isShow = true
      }, 100)
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
