<template>
  <div>
    <div v-for="(form, index) in data"
      :key="index"
      class="image-box"
      :class="{
        'layout-3': isLayout3,
        'layout-4': data.length == 7 || data.length == 8,
        current:index==repeat_len || (repeated && mouseover_form==form),
        right:sel_form==form && state_right,
        error:sel_form==form && state_error}"
      :style="{top:pos[index][0],left:pos[index][1]}"
      @click="check(form)"
      @mouseover="mouseover_form=form"
      @mouseout="mouseover_form=null">
      <div class="image-container">
        <img :src="form.image" alt="">
      </div>
      <div class="skip" @click="skip" v-show="showSkip"></div>
      <div class="text" :class="{rtl:dir}">
        <span v-text="state?form.sentence_phoneticize:form.sentence" v-show="form.sentence_box_show==true"></span>
        <b></b>
      </div>
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
import common from '../../../plugins/common'
import SoundManager from '../../../plugins/soundManager'

export default {
  props: ['data'],
  // 初始数据/////////////////////////////
  data () {
    return {
      timeoutId_next: null,
      timeoutId_shake: null,
      delay_next: 1000,
      delay_shake: 800,
      score: 100,
      finished: false,
      sndctr: SoundCtrl,
      cur_form: null, // 当前form
      form_index: 0, // 当前form的index
      form_len: 0, // form元素个数
      repeat_len: 0,
      repeated: false,
      forms: [], // 所有form
      sel_form: null,
      state_right: false,
      state_error: false,
      child: {}, // 选项dom
      pos: _.fill(Array(9), _.fill(Array(2), '25%')),
      locked: false,
      // dir: Config.direction < 0,
      mouseover_form: null,
      state: false,
      showSkip: false, // 是否显示跳过按钮
      has_dispatch_wrong: false, // 答错的时候，只dispatch一次消息
      isSkip: false,
      isAutoSkip: false
    }
  },
  mixins: [minx.formScore, minx.switchPhoneticize, minx.learnProgLog],
  created () {
    // 下一步操作
    this.$on('start', () => {
      console.log('start')
      var _this = this
      var num = _this.data.length

      _this.pos = _.fill(Array(9), _.fill(Array(2), '25%'))
      setTimeout(() => {
        _this.pos = common.getPos(num)
      }, 10)

      this.clear()
      this.init()
      this.next()
    })

    // 暂停
    this.$on('pause', () => {
      this.sndctr.stop()
      if (this.timeoutId_next && this.finished) {
        clearTimeout(this.timeoutId_next)
        this.finished = false
      }
    })

    // 暂停恢复
    this.$on('resume', () => {
      this.sndctr.stop()
      if (!this.repeated) {
        this.repeat_len = 0 // = Math.max(0, this.repeat_len-1)
      }
      this.next()
      // this.repeat()
    })

    this.$on('break', () => {
      console.log('break!!!')
      this.break()
    })

    // 拼音
    this.$on('switch-phoneticize', () => {
      this.switchPhoneticize()
      // this.state = Config.switch_state
      // console.log(this.state)
    })
  },
  computed: {
    ...mapState({
      direction: state => state.learn.direction,
      autoJump: state => state.learn.autoJump
    }),
    dir () {
      return this.direction < 0
    },
    isLayout3 () {
      if ([5, 6, 9].indexOf(this.data.length) !== -1) {
        return true
      }
      if (this.data.length === 3 && this.data.join(',').indexOf('sentencetoimg') === -1) {
        return true
      }
      return false
    }
  },
  methods: {
    ...mapMutations({
      updateFormScore: 'learn/updateFormScore'
    }),
    init () {
      // 初始选项view
      var _this = this
      var id = _.uniqueId('sentence-')
      $('.sentence-box').empty()
      $('.sentence-box').append(
        `<div id='s-${id}'></div>`
      )
      this.child = new Vue({
        el: '#s-' + id,
        template:
          `<transition name="fade">
            <div class="text-head" id='${id}' v-show="show">
              <div :class='{rtl:dir}' @click='repeat()'>
                <a :class='{border:isTeacher}'>
                  <b :class='{playing:hornPlaying}'></b>
                </a>
              </div>
            </div>
          </transition>`,
        data: {
          sentence: '',
          show: false,
          dir: this.direction < 0,
          hornPlaying: false,
          isTeacher: 0
        },
        methods: {
          repeat () {
            _this.repeat()
          }
        }
      })
      // 初始选项数据
      this.forms = _.cloneDeep(this.data)

      _.map(this.forms, (itm, idx) => {
        itm.score = 100
        itm.finished = false
        itm.repeated = false
      })
      // 初始文本框不可见
      _.map(this.data, (itm, idx) => {
        itm.sentence_box_show = false
      })
      // this.data = _.shuffle(this.data)

      this.form_len = this.data.length
    },
    skip () {
      this.isSkip = true
      this.next()
    },
    next (event) {
      // console.log('repeat_len:', this.repeat_len)
      // 先轮询每个form的声音
      // if (Config.isPause) return
      if (this.showSkip) {
        // 中断后续的响应时间
        // event.stopPropagation()
        this.showSkip = false
      }
      if (!this.repeated) {
        // 如果中断退出则跳出
        if (this.locked) return
        var form = this.forms[this.repeat_len]
        // console.log('form', form)
        if (!form.repeated) {
          form.repeated = true
          this.sndctr.stop()
          this.sndctr.setSnd(form.sound)
          this.sndctr.play(this.next)
        } else {
          this.repeat_len++

          if (this.repeat_len >= this.form_len) {
            this.repeated = true
            this.child.show = true
          }

          this.next()
        }
      } else {
        // repeat_len 复位
        if (this.repeat_len >= this.form_len - 1) {
          this.repeat_len = -1
        }
        // console.log('repeated:', this.repeat_len)
        // 开始选择
        if (this.cur_form && this.cur_form.finished) {
          if (this.form_index < this.form_len - 1) {
            // 隐藏文本框
            this.sel_form.sentence_box_show = false
            this.locked = false
            this.form_index++
          } else {
            // console.log('/////////////exit/////////////////')
            this.exit()
            return
          }
        }
        // 随机显示
        this.pos = common.randomItems(this.pos)

        this.cur_form = this.forms[this.form_index]
        this.child.sentence = this.cur_form.sentence
        this.sndctr.setSnd(this.cur_form.sound)
        this.child.hornPlaying = true
        var _this = this
        this.sndctr.play(() => {
          _this.child.hornPlaying = false
        })
      }
    },

    // 重读
    repeat () {
      // console.log('repeat')
      if (this.locked) return
      this.sndctr.stop()
      this.sndctr.setSnd(this.cur_form.sound)
      // this.sndctr.play()

      this.child.hornPlaying = true
      var _this = this
      this.sndctr.play(() => {
        _this.child.hornPlaying = false
      })
    },
    // 中断跳出
    break () {
      this.sndctr.stop()
      clearTimeout(this.timeoutId_next)
      this.timeoutId_next = null
      // this.clear()
      this.locked = true
      var Child = this.child
      var arr = Object.keys(Child)
      if (arr.length > 0) {
        Child.$destroy(true)
      }
    },
    // 检查对错
    check (itm) {
      // 选择正确则屏蔽点击
      if (
        !this.repeated ||
        (this.sel_form && this.sel_form.sentence_box_show)
      ) {
        return
      }

      this.sel_form = itm
      // 先清除延迟的shake
      // this.clearShake()
      this.state_error = false
      this.state_right = false
      // 分数只有第一次点击有效
      var curForm = this.cur_form
      var _this = this
      if (this.sel_form.sentence === curForm.sentence) {
        SoundManager.playSnd('correct')
        if (!curForm.finished) {
          curForm.finished = true
          curForm.score = 100
          this.locked = true
        }
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

        // add by david_li, 金币逻辑
        if (!this.has_dispatch_wrong) {
          // 如果是答错一次以后才答对的，那么不dispatch消息
          this.$parent.$emit('correct')
        } else {
          this.has_dispatch_wrong = false // 为下一句话置回初始状态
        }

        // 显示文本框
        this.sel_form.sentence_box_show = true
        this.state_right = true
        this.timeoutId_next = setTimeout(() => {
          if (this.autoJump) {
            _this.next()
          } else {
            _this.showSkip = true
          }
          _this.state_right = false
        }, _this.delay_next)
        // 清除shake计时器
        clearTimeout(this.timeoutId_shake)
      } else {
        SoundManager.playSnd('wrong')
        if (!curForm.finished) {
          curForm.finished = true
          curForm.score = 0
        }
        _this.child.hornPlaying = true
        this.sndctr.setSnd(this.cur_form.sound)
        this.sndctr.play(() => {
          _this.child.hornPlaying = false
        })

        this.shake(this)

        // add by david_li, 金币逻辑
        if (!this.has_dispatch_wrong) {
          // 第一次答错时dispatch消息,再次答错不dispatch消息
          this.$parent.$emit('wrong')
          this.has_dispatch_wrong = true
        }
      }

      // console.log('sel_form:', this.sel_form)
    },
    // wrong effect
    shake (itm) {
      var _this = this
      // 清除css和计时器
      $(itm.$el).removeClass('shake')
      clearTimeout(this.timeoutId_shake)
      // 重新添加css和计时器
      $(itm.$el).addClass('shake')
      this.state_error = true
      this.timeoutId_shake = setTimeout(() => {
        _this.pos = common.randomItems(_this.pos)
        $(itm.$el).removeClass('shake')

        _this.state_error = false
      }, this.delay_shake)
    },
    // 结束退出
    exit () {
      if (this.finished) return
      this.finished = true
      var score = this.getScore()
      console.log('score:', score)
      this.$parent.$emit('next-component', score)
    },

    clear () {
      this.finished = false
      this.cur_form = null
      this.form_index = 0
      this.form_len = 0
      this.forms = null
      this.repeat_len = 0
      this.repeated = false
      this.locked = false
      this.sel_form = null
      this.state_error = false
      this.state_right = false
    },

    getScore () {
      var score = 0
      _.map(this.forms, (itm, idx) => {
        if (itm.score === 100) score++
      })
      this.formScore()
      return score
    },

    mouseHandler (itm) {
      // var evt = arguments[0]
      // this.rollover = evt
      console.log('itm:', itm, this.repeated)
    }
  }
}
</script>
