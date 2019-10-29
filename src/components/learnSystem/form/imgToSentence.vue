<template>
  <div :class="{right:state_right, error:state_error}">
    <div class="image-container">
      <img :src="data.image" alt="" @click="repeat()">
    </div>
    <div class="skip" @click="skip" v-show="showSkip"></div>
    <div class="text" :class="{rtl:dir}">
      <div class="trumpet" :class='{playing:hornPlaying}' @click="repeat()"></div>
      <span v-text="switchState ? data.sentence_phoneticize : data.sentence" v-show="data.sentence_box_show==true">
      </span>
      <b></b>
    </div>
</div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'

import Vue from 'vue'
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
      score: 0,
      finished: false,
      selected: false,
      state_right: false,
      state_error: false,
      child: null,
      sndctr: SoundCtrl,
      // locked: false,
      // switch_state: false,
      // dir: Config.direction < 0,
      hornPlaying: false,
      showSkip: false, // 是否显示跳过按钮
      has_dispatch_wrong: false, // 答错的时候，只dispatch一次消息
      isSkip: false,
      isAutoSkip: false
    }
  },
  mixins: [minx.shake, minx.formScore, minx.learnProgLog],
  created () {
    // 下一步操作
    this.$on('start', () => {
      // 初始化数据
      // console.log('ITS', this.data)
      this.init()
      this.next()
      this.switchGroupPhoneticize()
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
      this.locked ? this.exit() : this.repeat()
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
      autoJump: state => state.learn.autoJump,
      switchState: state => state.learn.switchState
    }),
    dir () {
      return this.direction < 0
    }
  },
  methods: {
    ...mapMutations({
      updateLocked: 'learn/updateLocked',
      updateFormScore: 'course/updateFormScore',
      updateSwitchState: 'learn/updateSwitchState'
    }),
    init () {
      // 初始选项view
      var _this = this
      var id = _.uniqueId('sentence-')
      $('.text-head').hide()
      $('.sentence-box').append(
        `<div id='s-${id}'></div>`
      )
      this.child = new Vue({
        el: '#s-' + id,
        template:
        `<transition name="fade">
            <div class="text-head" id='${id}' v-show="show">
              <div :class="{rtl:dirChild}"">
                <a :class="{border:isTeacher}" v-for='(itm, index) in sentences' :key="index" @click='checkChild($event, itm)' class="txt-box">
                  <span>{{switch_state ?itm.phoneticize : itm.sentence}}</span>
                </a>
              </div>
            </div>
          </transition>`,
        data: {
          sentences: [],
          show: true,
          switch_state: false,
          dirChild: this.direction < 0,
          isTeacher: 0
        },
        methods: {
          checkChild (evnet, itm) {
            _this.check(event, itm)
          }
        }
      })

      // 初始选项数据
      this.data.sentence_box_show = false
    },

    next () {
      this.child.sentences = this.getSentences()
      // console.log(this.child.sentences)
      this.sndctr.setSnd(this.data.sound)
      var _this = this
      this.hornPlaying = true
      // Config.locked = true
      this.updateLocked(true)
      this.sndctr.play(() => {
        _this.hornPlaying = false
        // Config.locked = false
        this.updateLocked(false)
      })
      this.selected = true
    },

    // 重读
    repeat () {
      if (this.locked || this.locked) return
      this.sndctr.stop()
      this.sndctr.setSnd(this.data.sound)
      var _this = this
      this.hornPlaying = true
      // Config.locked = true
      this.updateLocked(true)
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
      // var Child = this.child
      // if (!_.isEmpty(Child)) {
      //   // Child.$destroy(true)
      // }
    },
    // 检查对错
    check (event, itm) {
      // 选择正确则屏蔽点击
      if (this.data.sentence_box_show) return

      // 分数只有第一次点击有效
      if (itm.sentence === this.data.sentence) {
        SoundManager.playSnd('correct')
        if (!this.finished) {
          this.finished = true
          this.score = 100
        }

        // add by david_li, 金币逻辑
        if (!this.has_dispatch_wrong) {
          // 如果是答错一次以后才答对的，那么不dispatch消息
          this.$parent.$emit('correct')
        } else {
          this.has_dispatch_wrong = false // 为下一句话置回初始状态
        }

        // 显示文本框
        this.data.sentence_box_show = true
        // Config.locked = true
        this.updateLocked(true)
        this.state_right = true
        var _this = this
        this.timeoutId_next = setTimeout(() => {
          _this.sndctr.setSnd(_this.data.sound)

          _this.hornPlaying = true
          // Config.locked = true
          this.updateLocked(true)
          if (this.autoJump) {
            _this.sndctr.play(_this.exit)
          } else {
            _this.sndctr.play(_this.showSkipIcon)
          }

          _this.state_right = false
        }, _this.delay_next)
      } else {
        SoundManager.playSnd('wrong')
        if (!this.finished) {
          this.finished = true
          this.score = 0
        }
        this.shake(event.currentTarget)

        // add by david_li, 金币逻辑
        if (!this.has_dispatch_wrong) {
          // 第一次答错时dispatch消息,再次答错不dispatch消息
          this.$parent.$emit('wrong')
          this.has_dispatch_wrong = true
        }
      }
    },
    showSkipIcon () {
      this.showSkip = true
    },
    skip () {
      this.isSkip = true
      this.exit()
    },
    // 结束退出
    exit () {
      // bool为true说明是第一次进来，就不发送
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

      var score = this.getScore()
      this.$parent.$emit('next-component', score)
      this.showSkip = false
      this.child.show = false
      this.updateLocked(false)
      // Config.locked = false
      this.hornPlaying = false
    },

    clear () {
      // console.log('clear/////////////')
      this.finished = false
      this.selected = false
      // this.locked = false
      this.score = 0
      // this.switchState = false
      this.updateSwitchState(false)
      this.state_error = false
      this.state_right = false
      // Config.locked = false
      this.updateLocked(false)
    },

    getScore () {
      var score = this.score / 100
      this.formScore()
      return score
    },

    getSentences () {
      var answer = _.find(this.data.sentences, {
        'sentence': this.data.sentence
      })
      var arr = [answer]
      var _this = this
      var options = _.filter(this.data.sentences, (itm, i) => {
        return _this.data.sentence !== itm.sentence
      })
      arr = _.union(arr, _.sampleSize(options, 2))
      arr = _.shuffle(arr)
      return arr
    },

    switchGroupPhoneticize () {
      // this.switch_state = this.switchState
      if (this.child.$data) {
        this.child.switch_state = this.switchState
      }
    }
  }
}
</script>
