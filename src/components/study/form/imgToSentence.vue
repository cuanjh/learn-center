<template>
  <div class="form">
    <div class="img-wrap">
      <a @click="play">
        <img :src="form.image" alt="">
      </a>
    </div>
    <div class="content">
      <transition-group class="sentences" name="flip-list" tag="div">
        <a
          :id="'sentence' + index"
          v-for="(item, index) in sentences" :key="form.code + index"
          @click="check(item, index)">
          {{ item.sentence }}
        </a>
      </transition-group>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'

import soundCtrl from '../../../plugins/soundCtrl'
import SoundManager from '../../../plugins/soundManager'
export default {
  props: ['form'],
  data () {
    return {
      sentences: this.form.sentences
    }
  },
  created () {
    this.$on('init', () => {
      console.log('imgToSentence init')
      soundCtrl.setSnd(this.form.sound)
      soundCtrl.play()
      this.sentences = _.shuffle(this.sentences)
    })

    this.$on('break', () => {
      this.resetData()
    })
  },
  methods: {
    play () {
      soundCtrl.play()
    },
    check (item, index) {
      if (this.form.sentence === item.sentence) {
        $('#sentence' + index, this.$el).addClass('correct')
        SoundManager.playSnd('correct', () => {
          $('#sentence' + index, this.$el).removeClass('correct')
          this.$parent.$emit('nextForm')
        })
      } else {
        $('#sentence' + index, this.$el).addClass('wrong')
        // 选择错误震动
        $('#sentence' + index, this.$el).addClass('shake')
        setTimeout(() => {
          $('#sentence' + index, this.$el).removeClass('shake')
          this.sentences = _.shuffle(this.sentences)
        }, 800)
        SoundManager.playSnd('wrong', () => {
          $('#sentence' + index, this.$el).removeClass('wrong')
        })
      }
    },
    resetData () {
    }
  }
}
</script>

<style lang="less" scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>
