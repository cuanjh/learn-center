<template>
  <div>
    <img :src="data.image" alt="">
    <div class="text" :class="{ rtl:dir }">
      <div class="trumpet" :class="{ playing:hornPlaying }" @click="repeat()"></div>
      <span v-text="switch_state ? data.sentence_phoneticize : data.sentence"></span>
      <b></b>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import minx from './formMinx'
import SoundCtrl from '../../../plugins/soundCtrl'

export default {
  props: ['data'],
  // 初始数据
  data () {
    return {
      timeoutId_next: null,
      delay_next: 1000,
      score: 100,
      finished: false,
      selected: false, // 该组件是否处于选中状态
      sndctr: SoundCtrl,
      switch_state: false,
      // dir: Config.direction < 0,
      dir: 1 < 0,
      hornPlaying: false,
      isSkip: false,
      isAutoSkip: true
    }
  },
  computed: {
    ...mapState({
      'isPause': state => state.learn.isPause,
      'locked': state => state.learn.locked
    })
  },
  beforeDestroy () {
    this.break()
    // console.log('destroy!!!!!!!!!!!!!!')
  },
  mounted () {
    if (this.data) {
      this.switchPhoneticize()
    }
  },
  created () {
    // 下一步操作
    this.$on('start', () => {
      if (this.isPause) return
      this.next()
    })
    // 暂停
    this.$on('pause', () => {
      this.sndctr.pause()
      if (this.timeoutId_next && this.finished) {
        clearTimeout(this.timeoutId_next)
        this.finished = false
      }
    })
    // 暂停恢复
    this.$on('resume', () => {
      this.updateLocked(false)
      this.selected ? this.repeat() : this.next()
      //
    })
    // 中断跳出
    this.$on('break', () => {
      this.break()
      // console.log('// // // // // // break// // // // // // // ')
    })
    // 拼音
    this.$on('switch-phoneticize', () => {
      this.switchPhoneticize()
    })
  },
  mixins: [minx.switchPhoneticize, minx.formScore, minx.learnProgLog],
  methods: {
    ...mapMutations({
      updateLocked: 'learn/updateLocked',
      updateFormScore: 'learn/updateFormScore'
    }),
    // 下一步操作
    start () {
      if (this.isPause) return
      this.next()
    },
    next () {
      this.hornPlaying = true
      this.sndctr.setSnd(this.data.sound)
      this.sndctr.play(this.exit)
      this.selected = true
      this.updateLocked(true)
    },
    // 重读
    repeat () {
      console.log(1111)
      // 录音状态下不会重读
      if (this.locked) return
      this.sndctr.stop()
      this.sndctr.setSnd(this.data.sound)
      this.hornPlaying = true
      this.updateLocked(true)
      var _this = this
      if (!this.selected) {
        this.sndctr.play(() => {
          _this.hornPlaying = false
          this.updateLocked(false)
        })
      } else {
        this.sndctr.play(this.exit)
      }
    },
    // 中断跳出
    break () {
      this.sndctr.stop()
      clearTimeout(this.timeoutId_next)
      this.timeoutId_next = null
      this.clear()
    },

    // 结束清除
    clear () {
      this.finished = false
      this.selected = false
      this.updateLocked(false)
      this.hornPlaying = false
    },
    // 检查对错
    check () {
      this.score = 100
    },
    // 结束退出
    exit () {
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

      this.hornPlaying = false
      this.updateLocked(false)

      // if (this.finished) return
      var _this = this
      this.finished = true
      this.timeoutId_next = setTimeout(() => {
        _this.$parent.$emit('next-component', _this.getScore())
      }, _this.delay_next)
    },

    getScore () {
      var score = this.score / 100
      this.formScore()
      return score
    }
  }
}
</script>
