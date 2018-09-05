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
  mounted () {
    console.log('mounted')
    SoundManager.load(this.sndEff)
    Recorder.init()
    this.getQiniuToken()
  },
  computed: {
    ...mapState({
      'sndEff': state => state.learn.sndEff
    })
  },
  methods: {
    ...mapActions({
      getChapterContent: 'course/getChapterContent',
      getQiniuToken: 'learn/getQiniuToken'
    }),
    ...mapMutations({
      updateCurCoreParts: 'course/updateCurCoreParts',
      updateCurChapterUrl: 'course/updateCurChapterUrl',
      chapterProgress: 'course/chapterProgress'
    })
  }
}
</script>

<style lang="less">
  // @import '../../../static/less/lib.less';
  @import '../../../static/less/ui-dialog.less';
  @import '../../../static/less/animate.less';
  @import "../../../static/less/toast.less";
  @import "../../../static/less/learnsystem.less";
  @import "../../../static/less/index.less";
</style>
