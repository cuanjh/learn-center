<template>
  <div class="learn-wrap">
    <!-- 头部 -->
    <learn-header ref="header"></learn-header>
    <div class="learn-cover learn-all-hide-cover" v-show="coverShow" @click="coverHide"></div> <!-- 遮罩 -->
    <div class="learn-cover learn-all-hide-cover" v-show="anonymousCover"></div>
    <router-view></router-view>
    <!-- 底部 -->
    <learn-bottom></learn-bottom>
    <photo-uploader></photo-uploader>
    <rocket></rocket>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import $ from 'jquery'
import learnHeader from './learnHeader.vue'
import learnBottom from './learnBottom.vue'
import PhotoUploader from '../common/user/photoUploader.vue'
import Rocket from '../common/rocket.vue'
import Bus from '../../bus'

export default {
  data () {
    return {
    }
  },
  created () {
    this.getUserInfo()
    this.$on('initLayout', () => {
      this.changeWrapHeight()
    })
    this.$on('navItem', (item) => {
      this.$refs.header.$emit('activeNavItem', item)
    })
    Bus.$on('changeCourseCode', (courseCode) => {
      this.$router.push({ path: '/app/course-list' })
      this.$nextTick(() => {
        this.changeCourseCode(courseCode)
      })
    })
  },
  components: {
    learnHeader,
    learnBottom,
    PhotoUploader,
    Rocket
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      currentChapterCode: state => state.course.currentChapterCode,
      contentUrl: state => state.course.contentUrl,
      coverShow: state => state.course.coverShow,
      anonymousCover: state => state.user.anonymousCover
    })
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
      getLearnInfo: 'course/getLearnInfo',
      getUnlockChapter: 'course/getUnlockChapter',
      getCourseContent: 'course/getCourseContent',
      getProgress: 'course/getProgress',
      getChapterContent: 'course/getChapterContent',
      getRecord: 'course/getRecord',
      getCourseTestRanking: 'course/getCourseTestRanking',
      homeworkContent: 'course/homeworkContent'
    }),
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateCoverState: 'course/updateCoverState',
      updatePurchaseIconPay: 'user/updatePurchaseIconPay',
      updateConfirmAlert: 'user/updateConfirmAlert',
      updateSuccessAlert: 'user/updateSuccessAlert',
      updateErrorTip: 'user/updateErrorTip',
      updateAlertType: 'user/updateAlertType',
      showLoading: 'course/showLoading',
      hideLoading: 'course/hideLoading',
      updateUnlockCourseList: 'course/updateUnlockCourseList'

    }),
    changeWrapHeight () {
      /**
       * 为了完成导航栏会往下掉的动效, body不能设置样式为100%, 否则无法正确计算高度
       * 故而凡是页面高度不足一屏的都需要动态设置页面高度, 避免背景颜色无法完整填充
       */
      var clientHeight = $(window).innerHeight()
      $('.current-course').css('min-height', clientHeight + 'px')
      $('.test-level-wrap').css('min-height', clientHeight + 'px')
      $('.confirm-wrap').css('min-height', clientHeight + 'px')
      $('.homework-wrap').css('min-height', clientHeight + 'px')
      $('.user-wrap').css('min-height', clientHeight + 'px')
    },
    async changeCourseCode (courseCode) {
      var that = this
      that.showLoading()
      that.updateCurCourseCode(courseCode)
      await that.getLearnInfo(courseCode)
      await that.getUnlockChapter(courseCode).then((res) => {
        that.updateUnlockCourseList(res)
      })
      await that.getCourseContent(that.contentUrl)

      await that.getChapterContent()

      let top = $('#' + that.currentChapterCode).offset().top - 90
      $('body,html').animate({ scrollTop: top }, 100, 'linear')

      await that.getRecord(that.currentChapterCode + '-A0')
      await that.getProgress(that.currentChapterCode)
      await that.getCourseTestRanking(that.currentChapterCode)
      await that.homeworkContent(that.currentChapterCode + '-A8')
      that.hideLoading()
    },
    coverHide () {
      this.updateCoverState(false)
      this.updatePurchaseIconPay(false)
      this.updateConfirmAlert(false)
      this.updateSuccessAlert(false)
      this.updateErrorTip(false)
      this.updateAlertType('')
    }
  }
}
</script>

<style scoped>
  .learn-wrap {
    padding-top: 80px;
    background: #f1f5f8;
  }

  .learn-cover {
    width: 100%;
    height: 100%;
    opacity: .9;
    background-color: #003d5a;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    overflow: hidden;
  }
</style>
