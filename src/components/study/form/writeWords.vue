<template>
  <div class="form">
    <div class="img-wrap">
      <next-comp />
      <img :src="form.image" alt="">
    </div>
    <div class="content">
      <span class="text" v-show="!innerlocked">{{ form.sentence }}</span>
      <input type="text"
        @input="check()"
        @keydown.90="preventUndo($event)"
        @keyup.13="keyCheck($event)"
        v-model="input"
        v-show="innerlocked"
        :maxlength="form.sentence.length" />
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

import NextComp from '../common/next'

import soundCtrl from '../../../plugins/soundCtrl'
import SoundManager from '../../../plugins/soundManager'
import minx from './minx'

export default {
  props: ['form'],
  data () {
    return {
      input: '',
      innerlocked: false
    }
  },
  components: {
    NextComp
  },
  created () {
    this.$on('init', () => {
      console.log('writeWords init')
      this.input = ''
      this.innerlocked = true
      this.focus()
      this.playAudio()
    })

    this.$on('next', () => {
      this.input = this.form.sentence
      this.innerlocked = false
      this.$parent.$emit('nextForm')
    })

    this.$on('break', () => {
      this.innerlocked = false
    })
  },
  mixins: [minx.shake],
  methods: {
    focus () {
      setTimeout(() => {
        $(this.$el).find('input').focus()
      }, 100)
    },
    playAudio () {
      soundCtrl.stop()
      soundCtrl.setSnd(this.form.sound)
      soundCtrl.play()
    },
    check () {
      if (this.input === this.form.sentence) {
        SoundManager.playSnd('correct')
        soundCtrl.play(this.exit)
      } else {
        if (this.input.length === this.form.sentence.length) {
          this.shake($(this.$el))
          SoundManager.playSnd('wrong')
        }
      }
    },
    preventUndo (e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        console.log('preventDefault')
      }
    },
    keyCheck () {
      this.check()
    },
    exit () {
      this.innerlocked = false
      this.$parent.$emit('nextForm')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
