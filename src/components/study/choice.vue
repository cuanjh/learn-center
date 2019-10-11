<template>
  <div class="choice-container">
    <div class="sentence-box">
      <a class="text-box" @click="playAudio" v-show="isShowTextBox">
        <span v-show="isShowSentence">
          {{ curForm.sentence }}
        </span>
        <trumpet-comp ref="trumpet" :sound="curForm.sound"/>
      </a>
    </div>
    <div class="choice-list">
      <div class="choice-item"
        :id="'form' + form.form_id"
        v-for="(form, index) in slideForms"
        :style="{top:pos[index][0],left:pos[index][1]}"
        :key="index"
        >
        <keep-alive>
          <component
            :class="{'active': (curLoopIndex == index && form.form_show_type == 'speakToImg') }"
            :ref="'comp-' + index" :is="'form-' + form.form_show_type"
            :form='form' />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'

import SentenceToImg from './form/sentenceToImg'
import SpeakToImg from './form/speakToImg'
import TrumpetComp from './common/trumpet'

import common from '../../plugins/common'
import utils from '../../plugins/utils'
import soundCtrl from '../../plugins/soundCtrl'
import SoundManager from '../../plugins/soundManager'
import bus from '../../bus'
export default {
  props: ['slideForms'],
  data () {
    return {
      isShowTextBox: false,
      isShowSentence: false,
      isCheck: false,
      sndctr: soundCtrl,
      curLoopIndex: 0,
      curIndex: 0,
      curForm: this.slideForms[0],
      pos: _.fill(Array(9), _.fill(Array(2), '25%'))
    }
  },
  components: {
    TrumpetComp,
    'form-sentenceToImg': SentenceToImg,
    'form-speakToImg': SpeakToImg
  },
  created () {
    this.$on('init', () => {
      this.curForm = this.slideForms[0]
      if (this.curForm.form_show_type === 'sentenceToImg') {
        this.isShowSentence = true
        this.isCheck = true
      }
      if (_.every(this.slideForms, ['form_show_type', 'sentenceToImg'])) {
        this.isShowTextBox = true
        this.isShowSentence = true
        this.pos = common.randomItems(utils.getPos(this.slideForms.length))
        this.curForm = this.slideForms[this.curIndex]
        this.$refs['trumpet'].$emit('init', this.curForm)
      } else {
        this.isShowTextBox = false
        this.isShowSentence = false
        this.pos = utils.getPos(this.slideForms.length)
        this.loopPlay()
      }
    })

    this.$on('check', (form) => {
      console.log('check', form)
      if (!this.isCheck) {
        return
      }
      let formObj = $('#form' + form.form_id)
      let offset = formObj.offset()
      let obj = {
        left1: offset.left + formObj.width() / 2,
        top1: offset.top + formObj.height() / 2,
        left2: offset.left + formObj.width() / 2 + 30,
        top2: offset.top + formObj.height() / 2,
        left3: offset.left + formObj.width() / 2 + 50,
        top3: offset.top + formObj.height() / 2,
        left4: offset.left + formObj.width() / 2,
        top4: offset.top + formObj.height() / 2 + 20,
        left5: offset.left + formObj.width() / 2 + 25,
        top5: offset.top + formObj.height() / 2 + 20
      }
      // bus.$emit('animateGold', obj)
      if (this.curForm.form_id === form.form_id) {
        formObj.addClass('correct')
        bus.$emit('animateGold', obj)
        bus.$emit('showCombo', obj)
        SoundManager.playSnd('correct', () => {
          formObj.removeClass('correct')
          this.curIndex++
          if (this.curIndex !== this.slideForms.length) {
            this.pos = common.randomItems(this.pos)
            this.curForm = this.slideForms[this.curIndex]
            setTimeout(() => {
              this.$refs['trumpet'].$emit('init')
            }, 100)
          } else {
            this.resetData()
            this.$parent.$emit('nextSlide')
          }
        })
      } else {
        formObj.addClass('wrong')
        this.shake(form.form_id)
        SoundManager.playSnd('wrong', () => {
          formObj.removeClass('wrong')
          if (this.curIndex !== this.slideForms.length) {
            this.pos = common.randomItems(this.pos)
            this.curForm = this.slideForms[this.curIndex]
            setTimeout(() => {
              this.$refs['trumpet'].$emit('init')
            }, 100)
          } else {
            this.resetData()
            this.$parent.$emit('nextSlide')
          }
        })
      }
    })

    this.$on('playNext', () => {
      this.curLoopIndex++
      this.loopPlay()
    })
  },
  methods: {
    playAudio () {
      this.$refs['trumpet'].play(true)
    },
    loopPlay () {
      if (this.curLoopIndex === this.slideForms.length) {
        this.isCheck = true
        this.curLoopIndex = -1
        this.isShowTextBox = true
        this.pos = common.randomItems(utils.getPos(this.slideForms.length))
        this.$refs['trumpet'].$emit('init')
        return
      }
      this.$refs['comp-' + this.curLoopIndex][0].$emit('play')
    },
    resetData () {
      this.isShowTextBox = false
      this.isShowSentence = false
      this.isCheck = false
      this.curIndex = 0
      this.curLoopIndex = 0
      this.curForm = {}
      this.pos = _.fill(Array(9), _.fill(Array(2), '25%'))
    },
    shake (formId) {
      $('#form' + formId).addClass('shake')
      setTimeout(() => {
        $('#form' + formId).removeClass('shake')
      }, 800)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
