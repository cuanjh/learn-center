<template>
  <!-- Slider main container -->
  <div class="swiper-container" v-show="isShow">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
      <!-- Slides -->
      <div class="swiper-slide"
        v-for="(form, index) in slideForms"
        :key="form.code"
        >
        <keep-alive>
          <component :ref="'comp-' + index" :is="'form-' + form.form_show_type" :form='form' />
        </keep-alive>
        <div class="shade"></div>
      </div>
    </div>
    <!-- If we need pagination -->
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
// import Swiper from 'swiper'
import Swiper from 'swiper/dist/js/swiper.esm.bundle'
import 'swiper/dist/css/swiper.css'

import AutoSpeak from './form/autoSpeak'
import RepeatSpeak from './form/repeatSpeak'
import ImgToSentence from './form/imgToSentence'
import SentenceToImgBox from './form/sentenceToImgBox'
import WriteWords from './form/writeWords'
import MakeSentence from './form/makeSentence'
import FillGap from './form/fillGap'

// import utils from '../../plugins/utils'

export default {
  props: ['slideForms'],
  data () {
    return {
      isShow: false,
      mySwiper: null,
      offset: -110
    }
  },
  components: {
    'form-autoSpeak': AutoSpeak,
    'form-repeatSpeak': RepeatSpeak,
    'form-imgToSentence': ImgToSentence,
    'form-sentenceToImgBox': SentenceToImgBox,
    'form-writeWords': WriteWords,
    'form-makeSentence': MakeSentence,
    'form-fillGap': FillGap
  },
  created () {
    this.$on('init', () => {
      this.initSwiper()
      this.mySwiper.init()
    })

    this.$on('destroySwiper', () => {
      this.isShow = false
      this.mySwiper.destroy()
    })

    this.$on('nextForm', () => {
      console.log('nextForm', this.mySwiper.activeIndex, this.mySwiper.realIndex, this.mySwiper.previousIndex)
      if (this.slideForms.length - 1 === this.mySwiper.activeIndex) {
        this.$parent.$emit('nextSlide')
        this.$emit('destroySwiper')
      } else {
        this.mySwiper.slideTo(this.mySwiper.activeIndex + 1)
      }
    })
  },
  mounted () {

  },
  methods: {
    initSwiper () {
      let that = this
      that.mySwiper = new Swiper('.swiper-container', {
        init: false,
        slidesPerView: 'auto',
        spaceBetween: 168,
        slidesOffsetBefore: 0,
        slideToClickedSlide: true,
        simulateTouch: false,
        centeredSlides: true,
        grabCursor: true,
        observer: true,
        // setWrapperSize: true,
        mousewheel: {
          invert: true
        },
        on: {
          init: () => {
            this.isShow = true
            console.log('swiper initialized', this.mySwiper.activeIndex, this.mySwiper.realIndex, this.mySwiper.previousIndex)
            console.log(that.$refs)
            that.$refs['comp-' + that.mySwiper.activeIndex][0].$emit('init')
          },
          resize: () => {
            console.log('swiper resize')
            // that.mySwiper.update()
          },
          click: () => {
            console.log('swiper click')
          },
          slideChange: () => {
            console.log('slideChange', this.mySwiper.activeIndex, this.mySwiper.realIndex, this.mySwiper.previousIndex)
            console.log(that.$refs)
            // 重置前一个组件数据
            that.$refs['comp-' + that.mySwiper.previousIndex][0].$emit('break')
            // 初始化当前组件
            that.$refs['comp-' + that.mySwiper.activeIndex][0].$emit('init')
          }
        },
        breakpoints: {
          // when window width is <= 1400px
          1300: {
            // slidesPerView: 'auto',
            slidesOffsetBefore: 25,
            spaceBetween: 75
          }
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
