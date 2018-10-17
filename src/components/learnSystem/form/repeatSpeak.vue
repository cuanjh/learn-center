<template>
  <div>
     <div class="macphone-box">
        <img :src="data.image">
        <transition name="box" >
          <div class="m-b" v-show="mac_show">
            <microphone ref="microphone" :sentence="data.sentence" :code="data.code" :time="recordTime" @updateTime="updateRecordTime"></microphone>
          </div>
        </transition>
        <div class="skip" @click="skip" v-show="selected"></div>
        <div class="hidden-microphone" @click="hiddenMicrophoneFn" v-show="hiddenMicrophoneSelected"></div>
    </div>
    <div class="text" :class="{rtl:dir}">
      <div class="trumpet" :class="{playing:playing,unuseable:repeatDisable}" @click="repeat()"></div>
      <speak-slow :source="data.sound" :selected="selected" :repeat="!repeatDisable"></speak-slow>
      <span v-text="data.sentence">
      </span>
      <b></b>
    </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import microphone from '../microphone.vue'
import speakSlow from './speakSlow.vue'
import SoundCtrl from '../../../plugins/soundCtrl'
import Recorder from '../../../plugins/recorder'
import minx from './formMinx'

import _ from 'lodash'

export default {
  props: ['data'],
  components: {
    microphone,
    speakSlow
  },
  // 初始数据
  data () {
    return {
      mac_show: false,
      score: 100,
      finished: false,
      sndctr: SoundCtrl,
      selected: false, // skip 显示
      // hiddenMicrophone: true || this.hiddenMicrophone, //  是否显示隐藏麦克风按钮
      hiddenMicrophoneSelected: false,
      switch_state: false,
      dir: this.direction < 0,
      recordTime: 0,
      playing: false,
      repeatDisable: false,
      isSkip: false,
      isAutoSkip: false
    }
  },
  computed: {
    ...mapState({
      'isPause': state => state.learn.isPause,
      'locked': state => state.learn.locked,
      'hiddenMicrophone': state => state.learn.hiddenMicrophone,
      'direction': state => state.learn.direction,
      'speakwork': state => state.learn.speakwork,
      'canRecord': state => state.learn.canRecord
    })
  },
  mixins: [minx.switchPhoneticize, minx.formScore, minx.learnProgLog],
  created () {
    // 下一步操作
    this.$on('start', () => {
      if (this.isPause) return
      this.next()
    })

    this.$on('setScore', () => {
      this.score = 100
      return false
    })

    // 暂停
    this.$on('pause', () => {
      this.$data.sndctr.pause()
      this.$emit('microphone-reset')
      this.mac_show = false
      this.repeatDisable = false
      this.updateLocked(false)
    })

    // 暂停恢复
    this.$on('resume', () => {
      this.updateLocked(false)
      if (this.selected) {
        this.repeat()
      } else {
        if (this.locked) {
          this.exit()
        } else {
          this.next()
        }
      }
    })

    // 中断跳出
    this.$on('break', () => {
      this.break()
    })

    this.$on('stop-sound', () => {
      this.sndctr.stop()
      this.playing = false
      this.updateLocked(false)
    })

    // 拼音
    this.$on('switch-phoneticize', () => {
      this.switchPhoneticize()
    })

    this.$on('repeat-disable', () => {
      this.sndctr.stop()
      this.playing = false
      this.repeatDisable = true
    })

    this.$on('repeat-canuse', () => {
      this.repeatDisable = false
    })

    this.$on('stop-record-play', () => {
      this.$refs['microphone'].$emit('microphone-stop-playing')
    })

    this.$on('runSkip', () => {
      this.skip()
    })
  },
  mounted () {
    console.log(this.data)
    this.switchPhoneticize()
    var urlInfos = this.data.sound.split('/')
    var url = _.takeRight(urlInfos, 7).join('/')
    var source = '/' + url
    this.updateRecordUrl(source)
  },
  methods: {
    ...mapMutations({
      updateRecordUrl: 'learn/updateRecordUrl',
      updateLocked: 'learn/updateLocked',
      updateFormScore: 'course/updateFormScore'
    }),
    next () {
      console.log('next')
      if (this.finished) return
      this.selected = true
      this.hiddenMicrophoneSelected = this.hiddenMicrophone
      this.sndctr.stop()
      this.sndctr.setSnd(this.data.sound)

      this.updateLocked(true)
      this.playing = true
      this.sndctr.play(
        function () {
          this.playing = false
          this.updateLocked(false)
          if (Recorder.isActivity(this.speakwork, this.canRecord)) {
            this.recordTime = this.sndctr.getDuration() * 1.8
            this.mac_show = true
          } else {
            this.exit()
          }
        }.bind(this)
      )
    },

    // 重读
    repeat () {
      if (this.locked) return
      this.sndctr.setSnd(this.data.sound)

      this.updateLocked(true)
      this.playing = true
      this.$refs.microphone.$emit('microphone-stop-playing')
      if (this.finished || !this.selected) {
        this.sndctr.play(() => {
          this.updateLocked(false)
          this.playing = false
        })
      } else {
        this.next()
      }
    },
    // 中断跳出
    break () {
      this.sndctr.stop()
      this.clear()
      this.$refs.microphone.$emit('microphone-reset')
    },

    // 结束清除
    clear () {
      this.updateLocked(false)
      this.selected = false
      this.hiddenMicrophoneSelected = false
      this.finished = false
      this.score = 100
      this.mac_show = false
      this.playing = false
      this.repeatDisable = false
    },
    // 手动点击了跳过
    skip () {
      this.$parent.$emit('delTimer') //  清空guide-box定时器
      this.isSkip = true
      this.exit()
    },
    // 结束退出
    exit () {
      if (this.mac_show) {
        this.$refs['microphone'].$emit('upload-qiniu')
      }

      //  判断根节点为stage的时候发送
      if (this.$root.currentView === 'stage') {
        // 发送日志消息 ：每个题的学习过程  如果自动跳过值为3，手动跳过值为2
        var res = ''
        if (this.isAutoSkip) {
          res = 3
        } else if (this.isSkip) {
          res = 2
        }
        this.learnProgLog(res)
        this.isSkip = false
      }

      // 默认传参,取消冒泡
      if (arguments.length) {
        arguments[0].stopPropagation()
      }
      var score = this.getScore()
      if (this.finished) return

      this.sndctr.stop()
      this.mac_show = false
      this.updateLocked(false)
      this.finished = false
      this.selected = false
      this.hiddenMicrophoneSelected = false
      this.playing = false
      this.$refs.microphone.$emit('microphone-reset')
      this.$parent.$emit('next-component', score / 100)
    },
    //  教师模式,隐藏麦克风显示
    hiddenMicrophoneFn () {
      this.mac_show = !this.mac_show
      return true
    },
    getScore () {
      var score = this.score //  / 100
      this.formScore()
      return score
    },
    updateRecordTime (data) {
      this.recordTime = data
    }
  }
}
</script>
