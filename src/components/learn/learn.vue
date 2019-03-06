<template>
  <div class="learn-wrap">
    <!-- 头部 -->
    <learn-header ref="header"></learn-header>
    <div class="learn-cover learn-all-hide-cover" v-show="coverShow" @click="coverHide"></div> <!-- 遮罩 -->
    <div class="learn-cover learn-all-hide-cover" v-show="anonymousCover"></div>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <!-- 底部 -->
    <voice-player v-show="isShow" />
    <learn-bottom />
    <photo-uploader />
    <float-bar />
    <continue-learn />
    <goto-bind />
    <buy-chapter v-if="isShowBuyChapter"/>
    <!-- 匿名用户听电台提示弹框 -->
    <user-login-regist-box></user-login-regist-box>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import $ from 'jquery'
import learnHeader from './learnHeader.vue'
import learnBottom from './learnBottom.vue'
import PhotoUploader from '../common/user/photoUploader.vue'
import FloatBar from '../common/floatBar.vue'
import VoicePlayer from '../common/voicePlayer.vue'
import ContinueLearn from '../common/continueLearn.vue'
import BuyChapter from '../common/buyChapterConfirm.vue'
import GotoBind from '../common/gotoBind.vue'
import Bus from '../../bus'
import cookie from '../../tool/cookie'
import UserLoginRegistBox from '../common/userLoginRegistBox.vue'

export default {
  data () {
    return {
      isShow: false,
      isShowBuyChapter: false
    }
  },
  created () {
    this.$on('initLayout', () => {
      this.changeWrapHeight()
    })
    this.$on('navItem', (item) => {
      this.$refs.header.$emit('activeNavItem', item)
    })
    Bus.$on('changeCourseCode', (courseCode) => {
      // this.$router.push({ path: '/app/course-list' })
      this.$nextTick(() => {
        this.changeCourseCode(courseCode)
      })
    })
  },
  components: {
    learnHeader,
    learnBottom,
    PhotoUploader,
    FloatBar,
    VoicePlayer,
    ContinueLearn,
    BuyChapter,
    GotoBind,
    UserLoginRegistBox
  },
  mounted () {
    let userId = cookie.getCookie('user_id')
    if (userId) {
      this.isShowBuyChapter = true
    }
    this.updateIsShowVoicePlayer(this.$route)
  },
  watch: {
    $route (to, from) {
      this.updateIsShowVoicePlayer(to)
    }
  },
  computed: {
    ...mapState({
      currentChapterCode: state => state.course.currentChapterCode,
      contentUrl: state => state.course.contentUrl,
      coverShow: state => state.course.coverShow,
      anonymousCover: state => state.user.anonymousCover
    })
  },
  methods: {
    ...mapActions({
      getLearnInfo: 'course/getLearnInfo',
      getUnlockChapter: 'course/getUnlockChapter',
      getCourseContent: 'course/getCourseContent',
      getProgress: 'course/getProgress',
      getChapterContent: 'course/getChapterContent',
      getRecord: 'course/getRecord',
      getCourseTestRanking: 'course/getCourseTestRanking',
      homeworkContent: 'course/homeworkContent',
      setCurrentChapter: 'course/setCurrentChapter'
    }),
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
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

      await this.setCurrentChapter(that.currentChapterCode)
      if ($('#' + that.currentChapterCode).length > 0) {
        let top = $('#' + that.currentChapterCode).offset().top - 90
        $('body,html').animate({ scrollTop: top }, 100, 'linear')
      }

      await that.getRecord(that.currentChapterCode + '-A0')
      await that.getProgress(that.currentChapterCode)
      await that.getCourseTestRanking(that.currentChapterCode)
      await that.homeworkContent(that.currentChapterCode + '-A8')
      that.hideLoading()
    },
    coverHide () {
      this.updatePurchaseIconPay(false)
      this.updateConfirmAlert(false)
      this.updateSuccessAlert(false)
      this.updateErrorTip(false)
      this.updateAlertType('')
    },
    updateIsShowVoicePlayer (route) {
      let name = route.name ? route.name.toLowerCase() : ''
      if (name === 'learnindex' || route.path.indexOf('/discovery/') > -1) {
        this.isShow = true
      } else if (route.path.indexOf('/book-details/') > -1) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    }
  }
}
</script>

<style scoped>
  .learn-wrap {
    height: 100%;
    padding-top: 62px;
    background: #f6f8f9;
  }

  .learn-cover {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    overflow: hidden;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
