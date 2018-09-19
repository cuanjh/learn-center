<template>
  <div :class="{right:state_right, error:state_error}">
    <div class="image-container">
      <img :src="data.image">
    </div>
    <div class="text" :class="{rtl:dir}">
      <div class="trumpet" :class='{playing:hornPlaying}' @click="repeat()"></div>
      <span v-text="sentence"></span>
      <b></b>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import $ from 'jquery'
import _ from 'lodash'

import minx from './formMinx'
import SoundCtrl from '../../../plugins/soundCtrl'
import SoundManager from '../../../plugins/soundManager'

export default {
  props: ['data', 'noRecord'],
  data () {
    return {
      timeoutId_next: null,
      timeoutId_shake: null,
      delay_next: 1000,
      delay_shake: 800,
      score: 0,
      finished: false,
      state_right: false,
      state_error: false,
      child: {},
      sndctr: SoundCtrl,
      sentence: '',
      word: '',
      selected: false,
      choose: false, // 是否轮到自己
      innerlocked: false,
      switch_state: false,
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
  mixins: [minx.shake, minx.formScore, minx.learnProgLog],
  created () {
    // 下一步操作
    this.$on('start', () => {
      this.choose = true
      // 初始化数据
      this.init()
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
      this.selected ? this.exit() : this.repeat()
      this.state_right = this.state_error = false
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
      switchState: state => state.learn.switchState,
      dir () {
        return this.direction < 0
      }
    })
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
                <a :class="{border:isTeacher}" v-for='(word, index) in words' :key="index" @click='check(word, $event)'>
                  <span v-text="word"></span>
                </a>
              </div>
            </div>
          </transition>`,
        data: {
          words: [],
          show: true,
          dir: this.direction < 0,
          isShake: false,
          isTeacher: 0
        },
        methods: {
          check (itm, event) {
            _this.check(itm, event)
          }
        }
      })
    },

    next () {
      this.switchGroupPhoneticize()
      // console.log('sentence:', this.sentence)
      this.sndctr.setSnd(this.data.sound)
      var _this = this
      // Config.locked = true
      this.updateLocked(true)
      this.hornPlaying = true
      this.sndctr.play(() => {
        // Config.locked = false
        this.updateLocked(false)
        _this.hornPlaying = false
      })

      console.log(this.data)
    },

    // 重读
    repeat () {
      if (this.locked) return
      this.sndctr.stop()
      this.sndctr.setSnd(this.data.sound)
      this.hornPlaying = true
      // Config.locked = true
      this.updateLocked(true)
      var _this = this
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
      this.timeoutId_next = null
      this.clear()

      // 清除
      var Child = this.child
      if (!_.isEmpty(Child)) {
        Child.$destroy(true)
      }
    },
    // 检查对错
    check (itm, event) {
      // if (this.selected) return
      // 分数只有第一次点击有效
      if (itm === this.word) {
        SoundManager.playSnd('correct')
        // this.selected = true
        if (!this.finished) {
          this.finished = true
          this.score = 100
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

        // 显示文本框
        // this.sentence = this.switch_state
        //   ? this.data.sentence_phoneticize
        //   : this.data.sentence
        this.sentence = this.data.answer
        var _this = this
        this.finished = true
        this.state_right = true
        this.timeoutId_next = setTimeout(() => {
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
        let currentTarget = event.currentTarget
        this.shake(currentTarget)

        // add by david_li, 金币逻辑
        if (!this.has_dispatch_wrong) {
          // 第一次答错时dispatch消息,再次答错不dispatch消息
          this.$parent.$emit('wrong')
          this.has_dispatch_wrong = true
        }
      }
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

      this.hornPlaying = false
      this.finished = true
      // Config.locked = false
      this.updateLocked(false)
      var score = this.getScore()
      // console.log('score:', score)
      this.child.show = false
      this.$parent.$emit('next-component', score)
    },

    clear () {
      // console.log('clear/////////////')
      this.finished = false
      this.sentence = ''
      this.word = ''
      this.score = 0
      this.selected = false
      this.choose = false
      // Config.locked = false
      this.updateLocked(false)
      this.state_error = false
      this.state_right = false
    },

    getScore () {
      var score = this.score / 100
      this.formScore()
      return score
    },

    getSentence () {
      console.log('getSentence')
      var options = this.data.options
      var _sentence = this.data.sentence_show

      var option =
        this.direction < 0 ? options[options.length - 1] : options[0]
      var _key = this.getKey(option)

      var _txt = ''
      // 如果已经学完则完整显示句子
      if (this.finished) {
        _txt = _sentence
      } else {
        // 完整单词替换
        var reg = new RegExp('(\\b|^)' + option + '(\\b|$)', 'i')
        _txt = _sentence.replace(reg, _key)

        if (_txt.indexOf(_key) === -1) {
          _txt = _sentence.replace(option, _key)
        }
      }

      return _txt
    },

    getKey (word) {
      var key = ''
      var len = Math.max(5, word.length)
      while (len--) {
        key += '_'
      }
      return key
    },

    switchGroupPhoneticize () {
      if (!this.choose) return
      this.switch_state = this.switchState
      this.sentence = this.getSentence()

      var words = this.data.options

      this.word =
        this.direction < 0 ? words[words.length - 1] : words[0]
      // this.child.$set('words', _.shuffle(words))
      this.child.words = _.shuffle(words)
    }
  }
}
</script>
