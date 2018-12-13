<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'

import Recorder from '../../plugins/recorder'
import SoundManager from '../../plugins/soundManager'
import autoSpeak from './form/autoSpeak'
import repeatSpeak from './form/repeatSpeak'
import sentenceToImg from './form/sentenceToImg'
import speakToImg from './form/speakToImg'
import imgToSentence from './form/imgToSentence.vue'
import writeWords from './form/writeWords.vue'
import makeSentence from './form/makeSentence.vue'
import fillGap from './form/fillGap.vue'

import Bus from '../../bus'

Vue.use(autoSpeak)
Vue.use(repeatSpeak)
Vue.use(sentenceToImg)
Vue.use(speakToImg)
Vue.use(imgToSentence)
Vue.use(writeWords)
Vue.use(makeSentence)
Vue.use(fillGap)

Vue.component('form-autospeak', autoSpeak)
Vue.component('form-repeatspeak', repeatSpeak)
Vue.component('form-sentencetoimg', sentenceToImg)
Vue.component('form-speaktoimg', speakToImg)
Vue.component('form-imgtosentence', imgToSentence)
Vue.component('form-writewords', writeWords)
Vue.component('form-makesentence', makeSentence)
Vue.component('form-fillgap', fillGap)

export default {
  created () {
    Bus.$on('initAnonymousData', () => {
      this.initAnonymousData()
    })
  },
  mounted () {
    console.log('mounted')
    SoundManager.load(this.sndEff)
    Recorder.init()
    this.getQiniuToken()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      contentUrl: state => state.course.contentUrl,
      currentChapterCode: state => state.course.currentChapterCode,
      'sndEff': state => state.learn.sndEff
    })
  },
  methods: {
    ...mapActions({
      getChapterContent: 'course/getChapterContent',
      getLearnInfo: 'course/getLearnInfo',
      getQiniuToken: 'learn/getQiniuToken',
      getUserInfo: 'user/getUserInfo',
      getUnlockChapter: 'course/getUnlockChapter',
      getCourseContent: 'course/getCourseContent',
      getRecord: 'course/getRecord',
      getProgress: 'course/getProgress'
    }),
    ...mapMutations({
      updateUnlockCourseList: 'course/updateUnlockCourseList'
    }),
    async initAnonymousData () {
      await this.getUserInfo()
      console.log(this.userInfo)
      let curCourseCode = this.userInfo.current_course_code
      await this.getLearnInfo(curCourseCode)
      await this.getUnlockChapter(curCourseCode).then((res) => {
        this.updateUnlockCourseList(res)
      })
      await this.getCourseContent(this.contentUrl)
      await this.getChapterContent()

      await this.getRecord(this.currentChapterCode + '-A0')
      await this.getProgress(this.currentChapterCode)
    }
  }
}
</script>

<style lang="less">
// @import '../../../static/less/lib.less';
@import "../../../static/less/ui-dialog.less";
@import "../../../static/less/animate.less";
@import "../../../static/less/toast.less";
@import "../../../static/less/learnsystem.less";
@import "../../../static/less/index.less";
</style>
