<template>
  <div :class="['form', form.form_show_type]">
    <div class="img-wrap">
      <next-comp />
      <img :src="form.image" alt="">
    </div>
    <div class="content">
      <span class="text" v-show="!isShow"></span>
      <div class="make-sentence" v-show="isShow">
        <span class="sentence">
          <i v-for="(itm, index) in options"
            :key="index"
            v-text="itm"
            @click="reset(index)">
          </i>
        </span>
        <div class="words">
          <a v-for="(word, index) in words"
            :key="'word' + index"
            @click="makeSentence(index)">
            <span v-text="word"></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'

import NextComp from '../common/next'

import soundCtrl from '../../../plugins/soundCtrl'
import SoundManager from '../../../plugins/soundManager'
import minx from './minx'
import bus from '../../../bus'
export default {
  props: ['form'],
  data () {
    return {
      isShow: false,
      options: [],
      words: []
    }
  },
  components: {
    NextComp
  },
  created () {
    this.$on('init', () => {
      console.log('makeSentence init')
      bus.$emit('setStudyFormScore', {formCode: this.form.code, score: 0})
      this.isShow = true
      this.resetAll()
      this.playAudio()
    })
    this.$on('break', () => {
      this.isShow = false
    })
  },
  mixins: [minx.shake],
  methods: {
    playAudio () {
      soundCtrl.setSnd(this.form.sound)
      soundCtrl.play()
    },
    reset (index) {
      var word = this.options[index]
      this.options[index] = ''
      this.words.push(word)
    },
    makeSentence (index) {
      var word = this.words[index]
      this.words.splice(index, 1)
      let i = _.findIndex(this.options, (o) => {
        return o === ''
      })
      this.options[i] = word

      if (!this.words.length) this.check()
    },
    check () {
      this.$parent.$emit('setSwiperMousewheel', false)
      // 选择完毕
      var sentence = this.options.join(' ')
      var answer = this.form.sentence
      answer = answer.split(/\s+/).join(' ')
      let score = 0
      if (sentence === answer) {
        score = 1
        SoundManager.playSnd('correct')
        soundCtrl.play(this.exit)
      } else {
        this.shake($(this.$el))
        SoundManager.playSnd('wrong')
        this.resetAll()
        this.playAudio()
      }
      let imgWrap = $('.img-wrap', this.$el)
      let offset = imgWrap.offset()
      console.log(imgWrap)
      let obj = {
        left: offset.left + (imgWrap.width() - 200) / 2,
        top: offset.top + (imgWrap.height() - 85) / 2
      }
      this.$parent.$emit('calCoinStudy', {formCode: this.form.code, score: score, offset: obj})
      bus.$emit('setStudyFormScore', {formCode: this.form.code, score: score})
    },
    resetAll () {
      this.options.length = 0
      this.form.words.forEach(item => {
        this.options.push('')
      })
      this.words = _.shuffle(this.form.words)
      this.$parent.$emit('setSwiperMousewheel', true)
    },
    exit () {
      this.$parent.$emit('setSwiperMousewheel', true)
      setTimeout(() => {
        this.isShow = false
        this.options.length = 0
        this.$parent.$emit('nextForm')
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.make-sentence {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.sentence {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  i {
    min-width: 58px;
    border-bottom: 1px solid #C8D4DB;
    font-size: 18px;
    font-weight: 600;
    color: #3C5B6F;
    height: 26px;
    line-height: 25px;
    margin-right: 10px;
    text-align: center;
    cursor: pointer;
  }
}
.words {
  margin-top: 40px;
  min-height: 50px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  a {
    background: #ECF0F3;
    padding: 7px 18px;
    margin-right: 12px;
    margin-bottom: 6px;
    border-radius: 4px;
    span {
      font-size: 21px;
      font-weight: 600;
      color: #3C5B6F;
      line-height: 29px;
    }
  }
}
</style>
