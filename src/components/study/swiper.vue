<template>
  <!-- Slider main container -->
  <div id="pro-swiper" class="swiper-container" v-show="isShow">
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
import Swiper from 'swiper/dist/js/swiper.esm.bundle'
import 'swiper/dist/css/swiper.css'

import AutoSpeak from './form/autoSpeak'
import RepeatSpeak from './form/repeatSpeak'
import ImgToSentence from './form/imgToSentence'
import SentenceToImgBox from './form/sentenceToImgBox'
import WriteWords from './form/writeWords'
import MakeSentence from './form/makeSentence'
import FillGap from './form/fillGap'
import bus from '../../bus'
import minx from './form/minx'
import { mapState } from 'vuex'

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
      setTimeout(() => {
        this.mySwiper.init()
      }, 500)
    })

    this.$on('destroySwiper', () => {
      this.isShow = false
      this.mySwiper.destroy()
    })

    this.$on('nextForm', () => {
      console.log('nextForm', this.mySwiper.activeIndex, this.mySwiper.realIndex, this.mySwiper.previousIndex)
      this.setIsLearn(this.mySwiper.activeIndex)
      if (this.slideForms.length - 1 === this.mySwiper.activeIndex) {
        this.$parent.$emit('nextSlide')
        this.$emit('destroySwiper')
      } else {
        this.mySwiper.slideTo(this.mySwiper.activeIndex + 1)
      }
    })

    this.$on('setSwiperMousewheel', (flag) => {
      if (flag) {
        this.mySwiper.mousewheel.enable()
      } else {
        this.mySwiper.mousewheel.disable()
      }
    })

    this.$on('calCoinStudy', (params) => {
      this.$parent.$emit('calCoinStudy', params)
    })
    this.$on('setStudyFormScore', (params) => {
      this.$parent.$emit('setStudyFormScore', params)
    })
    bus.$on('proRdcordingSwiperMousew', (res) => {
      this.$emit('setSwiperMousewheel', res)
    })
  },
  mounted () {

  },
  mixins: [minx.isLearned],
  computed: {
    ...mapState({
      recordForms: state => state.recordForms
    })
  },
  methods: {
    initSwiper () {
      let that = this
      that.mySwiper = new Swiper('#pro-swiper', {
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
        mousewheel: true,
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
            this.setIsLearn(this.mySwiper.previousIndex)
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
    },
    setIsLearn (index) {
      let comp = this.$refs['comp-' + index]
      if (comp && comp[0]['form']) {
        let form = comp[0]['form']
        if (!form.code) {
          return false
        }
        let isLearn = this.isLearned(form.code)
        if (!isLearn) {
          this.$parent.$emit('setStudyFormScore', {formCode: form.code, score: 0})
        }
      }
    }
  }
}
</script>

<style lang="less">

</style>
