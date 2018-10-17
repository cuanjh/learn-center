<template>
<div :class="{right:state_right, error:state_error}">
   <div class="image-container">
      <img :src="data.image" @click="repeat()">
   </div>
    <div class="text write">
      <div class="skip" @click="skip" v-show="selected"></div>
        <div class="result">
<!--            <div v-class="err:error"></div>-->
          <input type="text" :class="{rtl:dir}" @input="check()" @keydown.90="preventUndo($event)" @keyup.13="keyCheck($event)" v-model="input" :readonly="input == data.sentence && innerlocked" :maxlength="data.sentence.length" />
          <div class="trumpet" :class='{playing:hornPlaying}' @click="repeat()"></div>
        </div>
    </div>
</div>
</template>

<script>
import $ from 'jquery'

import { mapState, mapMutations } from 'vuex'

import SoundCtrl from '../../../plugins/soundCtrl'
import SoundManager from '../../../plugins/soundManager'
import minx from './formMinx'

export default {
  props: ['data', 'noRecord'],
  // 初始数据/////////////////////////////
  data () {
    return {
      timeoutId_next: null,
      delay_next: 1000,
      delay_shake: 800,
      timeoutId_shake: null,
      score: 0,
      finished: false,
      state_right: false,
      state_error: false,
      sndctr: SoundCtrl,
      input: '',
      selected: false,
      innerlocked: false,
      error: false,
      // dir: Config.direction < 0,
      hornPlaying: false,
      has_dispatch_wrong: false, // 答错的时候，只dispatch一次消息
      isSkip: false,
      isAutoSkip: false
    }
  },

  /*
  compiled : function(){
    this.input = this.data.sentence
  },
  */

  beforeDestroy () {
    this.break()
    // console.log('destroy!!!!!!!!!!!!!!')
  },
  mixins: [minx.formScore, minx.learnProgLog],
  created () {
    this.$on('init', () => {
      this.input = this.data.sentence
    })

    // 下一步操作
    this.$on('start', () => {
      console.log(11111111111111111)
      this.init()
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
      this.innerlocked ? this.exit() : this.init()
    })

    // 中断跳出
    this.$on('break', () => {
      this.break()
      // console.log('////////////break//////////////')
    })
  },
  computed: {
    ...mapState({
      direction: state => state.learn.direction,
      locked: state => state.learn.locked
    }),
    dir () {
      return this.direction < 0
    }
  },
  methods: {
    ...mapMutations({
      updateLocked: 'learn/updateLocked',
      updateFormScore: 'course/updateFormScore'
    }),
    init () {
      var _this = this
      this.sndctr.setSnd(this.data.sound)
      // Config.locked = true
      this.updateLocked(true)
      this.hornPlaying = true
      this.sndctr.play(() => {
        _this.input = ''
        _this.selected = true
        // Config.locked = false
        this.updateLocked(false)
        _this.hornPlaying = false
      })
      // 显示输入框
      $(this.$el)
        .find('input')
        .focus()
    },
    // 重读
    repeat () {
      if (this.innerlocked || this.locked) return
      this.sndctr.stop()
      this.sndctr.setSnd(this.data.sound)
      this.sndctr.play()
      var _this = this
      this.hornPlaying = true
      this.sndctr.play(() => {
        _this.hornPlaying = false
        // 显示输入框
        $(_this.$el)
          .find('input')
          .focus()
      })
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
      this.score = 0
      this.input = ''
      this.finished = false
      this.selected = false
      this.innerlocked = false
      this.error = false
      // Config.locked = false
      this.updateLocked(false)
      this.state_error = false
      this.state_right = false
    },
    // 检查对错
    check () {
      if (this.input === this.data.sentence) {
        this.score = 100
        SoundManager.playSnd('correct')
        this.sndctr.stop()
        this.sndctr.setSnd(this.data.sound)
        this.state_right = true
        // var _this = this
        this.hornPlaying = true
        this.sndctr.play(this.exit)

        // add by david_li, 金币逻辑
        if (!this.has_dispatch_wrong) {
          // 如果是答错一次以后才答对的，那么不dispatch消息
          this.$parent.$emit('correct')
        } else {
          this.has_dispatch_wrong = false // 为下一句话置回初始状态
        }

        // 隐藏跳过
        this.selected = false
        this.innerlocked = true
        this.error = false
        // Config.locked = true
        this.updateLocked(true)
      } else {
        if (this.input.length === this.data.sentence.length) {
          SoundManager.playSnd('wrong')
          this.shake(this)

          // add by david_li, 金币逻辑
          if (!this.has_dispatch_wrong) {
            // 第一次答错时dispatch消息,再次答错不dispatch消息
            this.$parent.$emit('wrong')
            this.has_dispatch_wrong = true
          }

          this.error = true
        } else {
          this.error =
            this.data.sentence.indexOf(this.input) === -1
        }
      }
    },
    // wrong effect
    shake (itm) {
      var _this = this
      // console.log(this.$el)
      // 清除css和计时器
      var $dom = $(itm.$el).parent()
      /* $dom.removeClass('shake') */
      clearTimeout(this.timeoutId_shake)
      // 重新添加css和计时器
      $dom.addClass('shake')
      this.state_error = true
      this.timeoutId_shake = setTimeout(() => {
        $dom.removeClass('shake')

        _this.state_error = false
      }, this.delay_shake)
    },
    skip () {
      this.isSkip = true
      this.exit()
    },
    // 结束退出
    exit () {
      // 判断根节点为stage的时候发送
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

      // console.log('exit:', this.finished)
      // if (this.finished) return
      var _this = this
      // this.finished = true
      this.innerlocked = true
      this.state_right = false
      this.hornPlaying = false
      var score = this.getScore()
      this.timeoutId_next = setTimeout(() => {
        _this.$parent.$emit('next-component', score)
        // _this.locked = false
        // Config.locked = false
        this.updateLocked(false)
      }, _this.delay_next)

      // 隐藏跳过
      this.selected = false
      this.input = this.data.sentence
    },
    getScore () {
      var score = this.score / 100
      this.formScore()
      return score
    },

    preventUndo (e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        console.log('preventDefault')
      }
    },

    keyCheck () {
      this.check()
    }
  }
}
</script>
