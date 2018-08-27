<template>
  <div :class="{right:state_right, error:state_error}">
    <div class="image-container">
      <img :src="data.image">
    </div>
    <div class="text" :class="{rtl:dir}">
      <div class="trumpet" :class='{playing:hornPlaying}' @click="repeat()"></div>
      <span><i v-for="(itm, index) in options" :key="index" v-text="itm" @click="reset(index)"></i></span>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import $ from 'jquery'

import { mapState, mapMutations } from 'vuex'

import minx from './formMinx'
import SoundCtrl from '../../../plugins/soundCtrl'
import SoundManager from '../../../plugins/soundManager'

export default {
  props: ['data'],
  data () {
    return {
      timeoutId_next: null,
      timeoutId_shake: null,
      delay_next: 1000,
      delay_shake: 800,
      timeoutId_reset: null,
      state_right: false,
      state_error: false,
      delay_rest: 100,
      score: 100,
      finished: false,
      selected: false,
      child: {},
      sndctr: SoundCtrl,
      options: [],
      innerlocked: false,
      // dir: Config.direction < 0,
      hornPlaying: false,
      has_dispatch_wrong: false, // 答错的时候，只dispatch一次消息
      isSkip: false,
      isAutoSkip: false
    }
  },
  beforeDestroy () {
    this.break()
  },
  mixins: [minx.formScore, minx.learnProgLog],
  created () {
    // 下一步操作
    this.$on('start', () => {
      // 初始化数据
      this.init()
      this.next()
      this.selected = true
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
      // this.repeat()
      this.state_right = this.state_error = false
      if (this.locked) this.exit()
    })

    this.$on('break', () => {
      this.break()
    })

    // 拼音
    this.$on('switch-phoneticize', () => {
      this.switchGroupPhoneticize()
    })
  },
  computed: {
    ...mapState({
      direction: state => state.learn.direction,
      locked: state => state.learn.locked,
      switchState: state => state.learn.switchState
    }),
    dir () {
      return this.direction < 0
    }
  },
  methods: {
    ...mapMutations({
      updateLocked: 'learn/updateLocked',
      updateFormScore: 'learn/updateFormScore'
    }),
    init () {
      // 初始选项view
      var _this = this

      var id = _.uniqueId('sentence-')
      $('.text-head').hide()
      $('.sentence-box').empty()
      $('.sentence-box').append(
        `<div id='s-${id}'></div>`
      )
      this.child = new Vue({
        el: '#s-' + id,
        template:
          `<transition name="fade">
            <div class="text-head" id='${id}' v-show="show">
              <div :class="{rtl:dir}"">
                <a :class="{border:isTeacher}" v-for='(word, index) in words' :key="index" @click='placed(index)'>
                  <span>{{word}}</span>
                </a>
              </div>
            </div>
          </transition>`,
        data: {
          words: [],
          show: true,
          dir: this.direction < 0,
          isTeacher: 0
        },
        methods: {
          placed: (idx) => {
            _this.placed(idx)
          }
        }
      })
    },

    next () {
      this.switchGroupPhoneticize()
      // console.log(this.child.words)
      var _this = this
      this.hornPlaying = true
      // Config.locked = true
      this.updateLocked(true)
      this.sndctr.setSnd(this.data.sound)
      this.sndctr.play(() => {
        _this.hornPlaying = false
        // Config.locked = false
        this.updateLocked(false)
      })
    },

    // 重读
    repeat () {
      // console.log('repeat')
      if (this.innerlocked || this.locked) return
      this.sndctr.stop()

      var _this = this
      this.hornPlaying = true
      // Config.locked = true
      this.updateLocked(true)
      this.sndctr.setSnd(this.data.sound)
      this.sndctr.play(() => {
        _this.hornPlaying = false
        // Config.locked = false
        this.updateLocked(false)
      })
    },
    // 中断跳出
    break () {
      this.sndctr.stop()
      clearTimeout(this.timeoutId_next)
      clearTimeout(this.timeoutId_reset)
      this.timeoutId_next = null
      this.clear()
      var Child = this.child
      if (_.isEmpty(Child)) {
        return
      }
      Child.$destroy(true)
    },
    // 检查对错
    check () {
      // 选择完毕
      var sentence = this.options.join(' ')
      var answer = this.switch_state
        ? this.data.sentence_phoneticize
        : this.data.sentence
      answer = answer.split(/\s+/).join(' ')
      if (sentence === answer) {
        SoundManager.playSnd('correct')
        if (!this.finished) {
          this.finished = true
          this.score = 100
          this.innerlocked = true
          // Config.locked = true
          this.updateLocked(true)
        }

        // add by david_li, 金币逻辑
        if (!this.has_dispatch_wrong) {
          // 如果是答错一次以后才答对的，那么不dispatch消息
          this.$parent.$emit('correct')
        } else {
          this.has_dispatch_wrong = false // 为下一句话置回初始状态
        }

        this.state_right = true
        var _this = this
        this.timeoutId_next = setTimeout(() => {
          _this.sndctr.stop()
          _this.sndctr.setSnd(_this.data.sound)

          _this.hornPlaying = true
          // Config.locked = true
          this.updateLocked(true)

          _this.sndctr.play(_this.exit)

          _this.state_right = false
        }, _this.delay_next)
      } else {
        SoundManager.playSnd('wrong')
        if (!this.finished) {
          this.finished = true
          this.score = 0
        }
        this.shake()

        // add by david_li, 金币逻辑
        if (!this.has_dispatch_wrong) {
          // 第一次答错时dispatch消息,再次答错不dispatch消息
          this.$parent.$emit('wrong')
          this.has_dispatch_wrong = true
        }

        this.resetAll()
        this.sndctr.setSnd(this.data.sound)
        this.sndctr.play()
      }
    },

    // wrong effect
    shake () {
      var _this = this
      // 清除css和计时器
      var $dom = $('.current')
      $dom.removeClass('shake')
      clearTimeout(this.timeoutId_shake)
      // 重新添加css和计时器
      $dom.addClass('shake')
      this.state_error = true
      this.timeoutId_shake = setTimeout(() => {
        // _this.pos = common.randomItems(_this.pos)
        $dom.removeClass('shake')

        _this.state_error = false
      }, this.delay_shake)
    },

    resetAll () {
      // var _this = this
      if (this.options.length) {
        this.reset(0)
        this.timeoutId_reset = setTimeout(
          this.resetAll,
          this.delay_rest
        )
      }
    },
    // 匹配
    placed (idx) {
      var word = this.child.words[idx]
      this.child.words.splice(idx, 1)
      this.options.push(word)

      if (!this.child.words.length) this.check()
    },
    // 选项重置
    reset (idx) {
      if (this.innerlocked || !this.selected) return
      var word = this.options[idx]

      this.options.splice(idx, 1)
      this.child.words.push(word)
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

      // if (this.finished) return
      this.finished = true
      // this.locked = false
      this.selected = false
      var score = this.getScore()
      console.log('score:', score)
      this.$parent.$emit('next-component', score)
      // Config.locked = false
      this.updateLocked(false)
      this.hornPlaying = false
    },

    clear () {
      console.log('clear/////////////')
      this.finished = false
      this.score = 100
      this.options = []
      this.innerlocked = false
      this.selected = false
      this.state_error = false
      this.state_right = false
    },

    getScore () {
      var score = this.score / 100
      this.formScore()
      return score
    },

    switchGroupPhoneticize () {
      this.switch_state = this.switchState
      var sentence = this.switch_state
        ? this.data.sentence_phoneticize
        : this.data.sentence

      var words = sentence.split(/\s+/)
      // console.log('words:', words)

      if (!this.finished) {
        this.options.splice(0, this.options.length)
        this.child.words = _.shuffle(words)
      } else {
        this.options = words
      }
    }
  }
}
</script>
