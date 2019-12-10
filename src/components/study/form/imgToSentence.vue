<template>
  <div class="form">
    <div class="img-wrap">
      <a @click="play">
        <img :src="form.image" alt="">
      </a>
    </div>
    <div class="content">
      <div class="sentences">
        <a
          :id="'sentence' + index"
          v-for="(sentence, index) in sentences" :key="form.code + index"
          @click="check(sentence, index)">
          {{ sentence }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'

import soundCtrl from '../../../plugins/soundCtrl'
import SoundManager from '../../../plugins/soundManager'
import bus from '../../../bus'
export default {
  props: ['form'],
  data () {
    return {
      sentences: this.getSentences()
    }
  },
  created () {
    this.$on('init', () => {
      console.log('imgToSentence init')
      soundCtrl.setSnd(this.form.sound)
      soundCtrl.play()
      this.sentences = this.getSentences()
    })

    this.$on('break', () => {
      this.resetData()
    })
  },
  methods: {
    play () {
      soundCtrl.play()
    },
    check (sentence, index) {
      let score = 0
      this.$parent.$emit('setSwiperMousewheel', false)
      if (this.form.sentence === sentence) {
        score = 1
        $('#sentence' + index, this.$el).addClass('correct')
        SoundManager.playSnd('correct', () => {
          $('#sentence' + index, this.$el).removeClass('correct')
          this.$parent.$emit('setSwiperMousewheel', true)
          this.$parent.$emit('nextForm')
        })
      } else {
        score = 0
        $('#sentence' + index, this.$el).addClass('wrong')
        // 选择错误震动
        $('#sentence' + index, this.$el).addClass('shake')
        setTimeout(() => {
          $('#sentence' + index, this.$el).removeClass('shake')
          this.sentences = this.getSentences()
        }, 800)
        SoundManager.playSnd('wrong', () => {
          this.$parent.$emit('setSwiperMousewheel', true)
          $('#sentence' + index, this.$el).removeClass('wrong')
        })
      }
      let imgWrap = $('.img-wrap', this.$el)
      let offset = imgWrap.offset()
      console.log(imgWrap)
      let obj = {
        left: offset.left + (imgWrap.width() - 200) / 2,
        top: offset.top + (imgWrap.height() - 85) / 2
      }

      bus.$emit('calCoinStudy', {formCode: this.form.code, score: score, offset: obj})
      bus.$emit('setStudyFormScore', {formCode: this.form.code, score: score})
    },
    // 从句子数组中随机抽出3个句子进行选择（包含正确的句子）
    getSentences () {
      let answer = this.form.sentence
      let arr = [answer]
      let options = this.form.sentences.filter((sentence) => {
        return sentence !== answer
      })
      arr = arr.concat(_.sampleSize(options, 2))
      arr = _.shuffle(arr)
      return arr
    },
    resetData () {
    }
  }
}
</script>

<style lang="less" scoped>
</style>
