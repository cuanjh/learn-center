<template>
  <div class="record-container">
    <div class="start-record" v-if="!isRecord"><i class="start-img" @click.stop.prevent="startRecord()"></i></div>
    <div class="record-content" v-if="isRecord">
      <div class="recording-btns" @click.stop.prevent="recordStop()" v-if="recording">
        <div class="left-animated loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="recording-img"></div>
        <div class="right-animated loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="record-end-btns" :class="{'ending': eningAnimated}" v-if="!recording">
        <div id="animatButton" class="record-playVoice-btn" @click.stop.prevent="playMySound()">
          <i :class="{'loading': animat}" >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </i>
        </div>
        <div class="record-clear-btn" @click.stop.prevent="againRecord()">
          <i ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'
import bus from '../../../bus'
import Recorder from '../../../plugins/recorder'
import SoundManager from '../../../plugins/soundManager'

export default {
  props: ['code', 'sentence'],
  data () {
    return {
      eningAnimated: false,
      isRecord: false, // 这个是表示是否开始录音
      recording: false, // 是否是正在录音
      animat: false, // 播放自己录音的动画
      recordActivity: false // 录音是否激活
    }
  },
  created () {
    this.$on('init', () => {
      this.init()
    })
    this.$on('record-stop', () => { // 停止录音
      Recorder.stopRecording()
      // 停止检测录音音量
      bus.$off('record_setVolume')
    })
    this.$on('record-reset', () => { // 重新开始录音
    })

    this.$on('record-stop-playing', () => { // 停止播放
      Recorder.stopRecordSoud()
    })

    this.$on('record-start', () => { // 开始录音
      if (this.recording) {
        this.recordStop()
        return
      }
      this.isRecord = true
      this.recording = true
      _.delay(() => {
        SoundManager.playSnd('recordPro')
      }, 500)
      _.delay(() => {
        Recorder.startRecording()
        this.updateLocked(true)
      }, 1000)
    })

    this.$on('upload-qiniu', () => { // 上传七牛云
    })
  },
  cumputed: {
    ...mapState({
      qiniuToken: state => state.learn.qiniuToken
    })
  },
  mounted () {
    console.log('录音组件父组件的数值', this.sentence, this.code)
    // 初始化
    Recorder.init()
    this.$on('record-stop-playing', () => {
      Recorder.stopRecordSoud()
    })
  },
  methods: {
    ...mapActions({
      getQiniuToken: 'learn/getQiniuToken' // 获取七牛token
    }),
    ...mapMutations({
      updateQiniuToken: 'learn/updateQiniuToken', // 更新七牛token
      'updateLocked': 'learn/updateLocked'
    }),
    // 点击开始录音
    startRecord () {
      this.$emit('record-start')
    },
    // 点击停止录音
    recordStop () {
      Recorder.stopRecording()
      bus.$off('record_setVolume')
      console.log('record stop!!!!!')
      this.recording = false
      this.eningAnimated = false
      this.recordActivity = false
      this.playMySound()
    },
    // 点击播放自己的录音
    playMySound () {
      this.animat = !this.animat
      if (this.animat) {
        let audio = Recorder.audio
        Recorder.playRecording()
        audio.addEventListener('ended', () => {
          this.animat = false
        })
      } else {
        Recorder.stopRecordSoud()
      }
    },
    // 点击重新开始录音
    againRecord (e) {
      this.eningAnimated = true
      setTimeout(() => {
        this.startRecord()
      }, 500)
    },
    // 关闭录音
    closeRecord () {
      this.isRecord = false
      this.recording = false
      this.animat = false
      Recorder.stopRecording()
      bus.$off('record_setVolume')
    }
  }
}
</script>

<style scoped>

</style>
