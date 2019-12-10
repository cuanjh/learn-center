<template>
  <div class="form">
    <div class="img-wrap">
      <img :src="form.image" alt="">
    </div>
    <div class="content">
      <div class="fill-gap">
        <div class="sentence">
          <span class="text">{{ sentence }}</span>
          <trumpet-comp ref="trumpet" :sound="form.sound" />
        </div>
        <div class="words" v-show="isShow">
          <a v-for="(word, index) in words"
            :id="'word' + index"
            :key="'word' + index"
            @click="fillWords(word, index)">
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
import TrumpetComp from '../common/trumpet'

import soundCtrl from '../../../plugins/soundCtrl'
import SoundManager from '../../../plugins/soundManager'
import minx from './minx'
import bus from '../../../bus'
export default {
  props: ['form'],
  data () {
    return {
      isShow: false,
      sentence: '',
      finished: false,
      words: []
    }
  },
  components: {
    TrumpetComp
  },
  created () {
    this.$on('init', () => {
      console.log('fillGap init')
      this.isShow = true
      this.sentence = this.form.sentence_show
      this.words = _.shuffle(this.form.options)
      this.playAudio()
    })
  },
  mixins: [minx.shake],
  methods: {
    playAudio () {
      soundCtrl.setSnd(this.form.sound)
      soundCtrl.play()
    },
    fillWords (word, index) {
      this.$parent.$emit('setSwiperMousewheel', false)
      let score = 0
      let result = this.form.sentence_show.replace(/_+/g, word)
      if (this.form.answer === result) {
        score = 1
        $('#word' + index, this.$el).addClass('correct')
        SoundManager.playSnd('correct', () => {
          $('#word' + index, this.$el).removeClass('correct')
          this.$parent.$emit('setSwiperMousewheel', true)
          this.isShow = false
          this.$parent.$emit('nextForm')
        })
        this.sentence = result
        soundCtrl.play(this.exit)
      } else {
        $('#word' + index, this.$el).addClass('wrong')
        this.shake($('#word' + index, this.$el))
        SoundManager.playSnd('wrong', () => {
          this.$parent.$emit('setSwiperMousewheel', true)
          $('#word' + index, this.$el).removeClass('wrong')
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
    exit () {
    }
  }
}
</script>

<style lang="less" scoped>
.fill-gap {
  width: 100%;
  display: flex;
  flex-direction: column;
  .sentence {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .words {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-content: center;
    a {
      width: 160px;
      height: 70px;
      border-radius: 3px;
      border: 2px solid #C8D4DB;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 21px;
        font-weight: 600;
        color: #3C5B6F;
        line-height: 29px;
      }
    }
    .correct {
      border: 0;
      background: #7ED321;
      span {
        color: #fff;
      }
    }
    .wrong {
      border: 2px solid #DD2B2B;
    }
  }
}
</style>
