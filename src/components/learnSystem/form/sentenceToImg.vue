<template>
  <div>
    <div class="image-box"
      v-for="(form, index) in data"
      :key="index"
      :style="{top:pos[index][0],left:pos[index][1]}"
      :class="{
        'layout-3': isLayout3,
        'layout-4': data.length == 7 || data.length == 8,
        current:mouseover_form == form,
        right:sel_form==form && state_right,
        error:sel_form==form && state_error
      }"
      @click="check(form)"
      @mouseover="mouseover_form=form"
      @mouseout="mouseover_form=null">
         <div class="image-container">
          <img :src="form.image">
        </div>
        <div class="skip" @click="skip" v-show="showSkip"></div>
        <div class="text" :class="{rtl:dir}">
          <span v-text="form.sentence" v-show="form.sentence_box_show==true"></span>
          <b></b>
        </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'

import _ from 'lodash'
import $ from 'jquery'

// import SoundCtrl from 'soundCtrl'
// import SoundManager from 'soundManager'
import SoundCtrl from '../../../plugins/soundCtrl'
import SoundManager from '../../../plugins/soundManager'
import minx from './formMinx'
import commonFn from '../../../plugins/common'

export default {
  props: ['data', 'cutdown'],
  name: 'form-sentencetoimg',
  // 初始数据/////////////////////////////
  data () {
    return {
      timeoutId_next: null,
      timeoutId_shake: null,
      delay_next: 1000,
      delay_shake: 800,
      score: 0,
      finished: false,
      sndctr: SoundCtrl,
      state_right: false,
      state_error: false,
      curForm: null, // 当前form
      form_index: 0, // 当前form的index
      form_len: 0, // form元素个数
      forms: [], // 所有form
      sel_form: null, // 选中的form数据
      child: {}, // 选项dom
      pos: _.fill(Array(9), _.fill(Array(2), '25%')),
      // switch_state: false,
      dir: this.direction < 0,
      mouseover_form: null,
      showSkip: false, // 是否显示跳过按钮
      has_dispatch_wrong: false, // 答错的时候，只dispatch一次消息
      isSkip: false,
      isAutoSkip: false
    }
  },
  computed: {
    ...mapState({
      'direction': state => state.learn.direction,
      'switch_state': state => state.learn.switch_state,
      'locked': state => state.learn.locked,
      'autoJump': state => state.learn.autoJump
    }),
    isLayout3 () {
      if ([5, 6, 9].indexOf(this.data.length) !== -1) {
        return true
      }
      if (this.typeList.length === 3 && this.typeList.join(',').indexOf('sentencetoimg') === -1) {
        return true
      }
      return false
    }
  },
  created () {
    // 下一步操作
    this.$on('start', () => {
      console.log('start')
      var _this = this
      var num = _this.data.length
      if (num > 3) {
        _this.$set(this, 'pos', _.fill(Array(9), _.fill(Array(2), '25%')))
        setTimeout(() => {
          _this.$set(this, 'pos', commonFn.getPos(num))
        }, 10)
      } else {
        _this.$set(this, 'pos', commonFn.getPos(num))
      }
      this.init()
      this.next(true)

      // if (this.cutdown) this.switch_state = false
      // this.switchGroupPhoneticize()
    })

    // 暂停
    this.$on('pause', () => {
      this.sndctr.pause()
      if (this.timeoutId_next && this.finished) {
        clearTimeout(this.timeoutId_next)
        this.finished = false
      }
      if (this.sel_form && this.sel_form.sentence_box_show) {
        this.sel_form.sentence_box_show = false
      }
    })

    // 暂停恢复
    this.$on('resume', () => {
      // this.repeat()
      this.next()
    })

    this.$on('break', () => {
      this.break()
    })

    this.$on('init', () => {
      console.log('init')
      var _this = this
      var num = this.data.length
      if (this.cutdown) {
        _this.$set(this, 'pos', [[0, '25%'], [0, '25%']])
        setTimeout(() => {
          _this.$set(this, 'pos', commonFn.getPos(num))
        }, 10)
        return
      }
      if (num <= 3) {
        _this.$set(this, 'pos', commonFn.getPos(num))
      }
    })

    // 拼音
    this.$on('switch-phoneticize', () => {
      this.switchGroupPhoneticize()
    })
  },
  mounted () {
    if (this.data.length) {
      this.$set(this, 'pos', commonFn.getPos(this.data.length))
    }
    // console.log(this.data)
  },
  mixins: [
    minx.shake,
    minx.switchGroupPhoneticize,
    minx.formScore,
    minx.learnProgLog
  ],
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
              <div :class="{rtl:dir}" @click="repeat()">
                <a :class="{border:isTeacher}" class="txt-box">
                  <span>{{sentence}}</span>
                  <b :class="{playing:hornPlaying}"></b>
                </a>
              </div>
            </div>
          </transition>`,
        data: {
          sentence: '',
          show: true,
          dir: this.direction < 0,
          hornPlaying: false, // 喇叭图标播放
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
        itm.score = 0
        itm.finished = false
      })
      // 初始文本框不可见
      _.map(this.data, (itm, idx) => {
        itm.sentence_box_show = false
      })
      console.log(_.shuffle(this.data))
      // this.data = _.shuffle(this.data)

      this.form_len = this.data.length
    },

    next (bool) {
      console.log('next')
      // bool为true说明是第一次进来，就不发送
      // 判断根节点为stage的时候发送
      if (!bool && this.$root.currentView === 'stage') {
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

      if (this.curForm && this.curForm.finished) {
        if (this.form_index < this.form_len - 1) {
          // 隐藏文本框
          this.sel_form.sentence_box_show = false
          this.form_index++
          // 随机位置
          this.pos = commonFn.randomItems(this.pos)
          // console.log('cur_form:', this.cur_form.sentence)
        } else {
          // console.log('/////////////exit/////////////////')
          // console.log(Config.autoJump)
          // console.log(this.showSkip)
          this.exit()
          return
        }
      }

      this.curForm = this.forms[this.form_index]
      this.child.sentence = this.curForm.sentence
      this.sndctr.setSnd(this.curForm.sound)
      var _this = this
      this.child.hornPlaying = true
      this.updateLocked(true)
      this.sndctr.play(() => {
        _this.child.hornPlaying = false
        this.updateLocked(false)
      })

      // this.switchGroupPhoneticize()
    },

    // 重读
    repeat () {
      // console.log('repeat')
      if (this.locked) return
      this.sndctr.stop()
      this.sndctr.setSnd(this.curForm.sound)
      var _this = this
      this.child.hornPlaying = true
      this.updateLocked(true)
      this.sndctr.play(() => {
        _this.child.hornPlaying = false
        this.updateLocked(false)
      })
    },
    // 中断跳出
    break () {
      this.sndctr.stop()
      clearTimeout(this.timeoutId_next)
      this.timeoutId_next = null
      this.clear()
      var Child = this.child
      if (!_.isEmpty(Child)) {
        // Child.$destroy(true)
      }
    },
    // 检查对错
    check (itm) {
      // 选择正确则屏蔽点击
      if (this.sel_form && this.sel_form.sentence_box_show) return
      this.sel_form = itm
      // console.log('itm:', itm)
      var curForm = this.curForm
      if (!curForm) return
      // console.log('cur_form:', cur_form)
      // 先清除延迟的shake
      this.clearShake()
      this.state_error = false
      this.state_right = false
      // 分数只有第一次点击有效
      if (this.sel_form.sentence === curForm.sentence) {
        if (!curForm.finished) {
          curForm.finished = true
          curForm.score = 100
        }
        SoundManager.playSnd('correct')

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
        if (this.autoJump) {
          this.exchangePosition()
          clearTimeout(this.timeoutId_shake)
        } else {
          this.showSkip = true
          this.shakeIsRight(itm, true)
        }
      } else {
        if (!curForm.finished) {
          curForm.finished = true
          curForm.score = 0
        }
        SoundManager.playSnd('wrong')
        this.shakeIsRight(itm, false)

        // add by david_li, 金币逻辑
        if (!this.has_dispatch_wrong) {
          // 第一次答错时dispatch消息,再次答错不dispatch消息
          this.$parent.$emit('wrong')
          this.has_dispatch_wrong = true
        }
      }
    },
    skip () {
      this.isSkip = true
      this.exchangePosition()
    },
    exchangePosition () {
      this.showSkip = false
      var _this = this
      this.timeoutId_next = setTimeout(() => {
        console.log('--timeoutId_next--')
        // 如果是cutdown则只选择一次就结束
        _this.cutdown ? _this.exit() : _this.next()
        _this.state_right = false
        // _this.sndctr.play(_this.cutdown ? _this.exit : _this.next)
      }, _this.delay_next)
    },
    // 结束退出
    exit () {
      if (this.finished) return
      this.finished = true
      var score = this.getScore()
      // console.log('score:', score)

      // 隐藏选项
      $('.text-head').hide()
      // pk 下的cutdown日志数据提交
      if (this.$root.currentView === 'pk') {
        // 发送日志消息 ：每个题的学习过程  如果自动跳过值为3，手动跳过值为2
        var realScore = score
        if (this.isAutoSkip) {
          realScore = 3
        } else if (this.isSkip) {
          realScore = 2
        }
        this.$parent.$emit('next-component', realScore, true)
        this.isSkip = false
      } else {
        this.$parent.$emit('next-component', score)
      }
    },

    clear () {
      this.finished = false
      this.curForm = null
      this.form_index = 0
      this.form_len = 0
      this.forms = null
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
    }
  }
}
</script>
