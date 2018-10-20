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
  beforeCreate () {
    let browser = this.getOSAndBrowser().browser
    let reg = new RegExp('\\d+', 'g')
    let version = browser.match(reg)[0]
    if (!((browser.indexOf('Firefox') > -1 && version >= 21) || (browser.indexOf('Chrome') > -1 && version >= 17) || (browser.indexOf('Opera') > -1 && version >= 18))) {
      location.href = 'update.html'
    }
  },
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
      updateUserInfo: 'user/updateUserInfo',
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
    },
    getOSAndBrowser () {
      let h = navigator.platform
      let e = navigator.userAgent
      let g = []
      let f = {os: 'Other', browser: 'Other'}
      if (h.indexOf('Win') > -1) {
        if (e.indexOf('Windows NT 5.0') > -1) {
          f.os = 'Windows 2000'
        } else {
          if (e.indexOf('Windows NT 5.1') > -1) {
            f.os = 'Windows XP'
          } else {
            if (e.indexOf('Windows NT 5.2') > -1) {
              f.os = 'Windows 2003'
            } else {
              if (e.indexOf('Windows NT 6.0') > -1) {
                f.os = 'Windows Vista'
              } else {
                if (e.indexOf('Windows NT 6.1') > -1 || e.indexOf('Windows 7') > -1) {
                  f.os = 'Windows 7'
                } else {
                  if (e.indexOf('Windows 8') > -1) {
                    f.os = 'Windows 8'
                  } else {
                    if (e.indexOf('Windows NT 10.0') > -1) {
                      f.os = 'Windows 10'
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        if (h.indexOf('Mac') > -1) {
          f.os = 'Mac'
        } else {
          if (h.indexOf('X11') > -1) {
            f.os = 'Unix'
          } else {
            if (h.indexOf('Linux') > -1) {
              f.os = 'Linux'
            }
          }
        }
      }
      if (/[Ff]irefox(\/\d+\.\d+)/.test(e)) {
        g = /([Ff]irefox)\/(\d+\.\d+)/.exec(e)
      } else {
        if (/MSIE \d+\.\d+/.test(e)) {
          g = /MS(IE) (\d+\.\d+)/.exec(e)
        } else {
          if (/[Cc]hrome\/\d+/.test(e)) {
            g = /([Cc]hrome)\/(\d+)/.exec(e)
          } else {
            if (/[Vv]ersion\/\d+\.\d+\.\d+(\.\d)* *[Ss]afari/.test(e)) {
              g = /[Vv]ersion\/(\d+\.\d+\.\d+)(\.\d)* *([Ss]afari)/.exec(e)
            } else {
              if (/[Oo]pera.+[Vv]ersion\/\d+\.\d+/.test(e)) {
                g = /([Oo]pera).+[Vv]ersion\/(\d+)\.\d+/.exec(e)
              } else {
                if (/rv:11.0\) like Gecko/.test(e)) {
                  g = ['IEEdge', 'IE', '11']
                }
              }
            }
          }
        }
      }
      if (g.length >= 3) {
        f.browser = g[1] + g[2]
      }
      return f
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
