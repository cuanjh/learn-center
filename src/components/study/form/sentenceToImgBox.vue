<template>
  <div :class="['choice-box', form.form_show_type]">
    <div class="sentence-box" v-show="isShow">
      <a class="text-box" @click="playAudio">
        <span>
          {{ curForm.sentence }}
        </span>
        <trumpet-comp ref="trumpet" :sound="curForm.sound"/>
      </a>
    </div>
    <div class="choice-form-box">
      <div class="choice-form"
        :id="'form' + item.form_id"
        :style="{top: pos[index]}"
        v-for="(item, index) in form.data"
        :key="index"
        @click="check(item)">
        <img :src="item.image" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import TrumpetComp from '../common/trumpet'
import common from '../../../plugins/common'
import SoundManager from '../../../plugins/soundManager'

import minx from './minx'

export default {
  props: ['form'],
  data () {
    return {
      isShow: false,
      curForm: this.form.data[0],
      curIndex: 0,
      pos: ['0', '0']
    }
  },
  components: {
    TrumpetComp
  },
  created () {
    this.$on('init', () => {
      this.curForm = this.form.data[0]
      this.curIndex = 0
      this.pos = common.randomItems(['0', '50%'])
      this.isShow = true
      this.$refs['trumpet'].$emit('init', this.form.data[0])
    })
    this.$on('break', () => {
      this.resetData()
    })
  },
  mixins: [minx.shake],
  methods: {
    playAudio () {
      this.$refs['trumpet'].play(true)
    },
    check (item) {
      let score = 0
      this.$parent.$emit('setSwiperMousewheel', false)
      if (this.curForm.form_id === item.form_id) {
        score = 1
        $('#form' + item.form_id).addClass('correct')
        SoundManager.playSnd('correct', () => {
          this.curIndex++
          if (this.curIndex === this.form.data.length) {
            this.$parent.$emit('setSwiperMousewheel', true)
            this.$parent.$emit('nextForm')
            return
          }
          this.pos = common.randomItems(['0', '50%'])
          console.log(this.curIndex)
          this.curForm = this.form.data[this.curIndex]
          this.$refs['trumpet'].$emit('init', this.curForm)
          $('#form' + item.form_id).removeClass('correct')
        })
      } else {
        $('#form' + item.form_id).addClass('wrong')
        this.shake($('#form' + item.form_id))
        SoundManager.playSnd('wrong', () => {
          $('#form' + item.form_id).removeClass('wrong')
        })
      }
      let imgWrap = $('#form' + item.form_id)
      let offset = imgWrap.offset()
      console.log(imgWrap)
      let obj = {
        left: offset.left + (imgWrap.width() - 200) / 2,
        top: offset.top + (imgWrap.height() - 85) / 2
      }
      this.$parent.$emit('calCoinStudy', {formCode: item.code, score: score, offset: obj})
      this.$parent.$emit('setStudyFormScore', {formCode: item.code, score: score})
    },
    resetData () {
      this.isShow = false
      this.curForm = this.form.data[0]
      this.curIndex = 0
      this.pos = ['0', '0']
    }
  }
}
</script>

<style lang="less" scoped>

</style>
