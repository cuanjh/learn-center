<template>
  <div class="study-container flex">
    <nav-bar :part="part"></nav-bar>
    <transition name="fade">
      <div class="stage" v-show="isShow">
        <component
          :ref="view"
          :is="view"
          :slideForms="slideForms"
        />
      </div>
    </transition>
    <div class="gold">
      <i></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import $ from 'jquery'

// 定义层级关系 part -> slide -> form 粒度从大到小
// 组件
import NavBar from './navBar/index'
import SwiperComp from './swiper'
import ChoiceComp from './choice'

// 插件
import utils from '../../plugins/utils'
import Loader from '../../plugins/loader'
import SoundManager from '../../plugins/soundManager'
import bus from '../../bus'

// 结束标志位
let END = -1
// 动画过渡时间
const TRANSALTE_TIME = 500
// 每学3个Slide同步一次学习进度
// const CUTDOWN_TIME = 3

export default {
  props: ['chapterCode', 'id'],
  data () {
    return {
      view: 'swiper',
      isShow: false,
      thunk: null, // promise
      partForms: [],
      slideForms: [],
      slidesVal: [],
      curSlideIndex: 0,
      totalCoins: 0
    }
  },
  components: {
    NavBar,
    'swiper': SwiperComp,
    'choice': ChoiceComp
  },
  created () {
    this.$on('nextSlide', () => {
      this.isShow = false
      console.log('nextSlide')
      this.curSlideIndex++
      if (this.curSlideIndex === this.partForms.length) {
        this.changeSlide(-1)
      } else {
        let resource = this.getResource(this.curSlideIndex)
        this.changeSlide(Loader(resource))
      }
    })

    this.$on('changeSlide', (index) => {
      this.isShow = false
      if (this.view === 'swiper') {
        this.$refs['swiper'].$emit('destroySwiper')
      }
      console.log('changeSlide', index)
      this.curSlideIndex = index
      let resource = this.getResource(this.curSlideIndex)
      this.changeSlide(Loader(resource))
    })

    bus.$on('animateGold', (offset) => {
      $('.gold').css({
        left: offset.left,
        top: offset.top
      })
      $('.gold').show()
      let targetOffest = $('.gold-box').offset()
      console.log(targetOffest)
      // $('.gold').stop().animate({
      //   left: targetOffest.left
      // }, 1000, 'linear').animate({
      //   top: targetOffest.top
      // }, 1000, 'swing')
      $('.gold').stop().animate({
        left: targetOffest.left,
        top: targetOffest.top
      }, {
        duration: 1000,
        specialEasing: {
          left: 'linear',
          top: 'swing'
        },
        complete: () => {
          SoundManager.playSnd('gold')
          $('.gold').hide()
        }
      })
    })
  },
  mounted () {
    SoundManager.load(this.sndEff)
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.totalCoins = userInfo.coins
    utils.resize()
    console.log(this.$route)
    console.log(this.chapterCode, this.id)
    this.getPartForms()
  },
  computed: {
    ...mapState({
      sndEff: state => state.learn.sndEff
    }),
    part () {
      return {
        chapterCode: this.chapterCode,
        id: this.id,
        slidesVal: this.slidesVal,
        curSlideIndex: this.curSlideIndex,
        totalCoins: this.totalCoins
      }
    }
  },
  methods: {
    setSlidesVal (part) {
      // var that = this
      console.log(JSON.parse(localStorage.getItem('curChapterProgress')))
      let formsVal = JSON.parse(localStorage.getItem('curChapterProgress'))
      console.log(formsVal)
      this.partForms.forEach((slide, i) => {
        let val = -1
        let sum = 0
        let formId = slide.slide_code.split('-').slice(5, 7).join('-')
        slide.forms.forEach((form, j) => {
          let v = formsVal[formId + '-' + (j + 1)]
          if (v === 0 || v === 1) {
            sum += formsVal[formId + '-' + (j + 1)]
          } else {
            sum = -1
          }
        })
        if (sum === slide.forms.length) {
          val = 1
        } else if (sum >= 0) {
          val = 0
        } else {
          val = -1
        }
        this.slidesVal.push(val)
      })
      for (let i = 0; i < this.slidesVal.length; i++) {
        if (this.slidesVal[i] === -1) {
          this.curSlideIndex = i
          break
        }
      }
      console.log('slidesVal', this.slidesVal)
      console.log('curSlideIndex', this.curSlideIndex)
    },
    getCoreParts () {
      let that = this
      console.log(JSON.parse(localStorage.getItem('courseBaseInfo')))
      let corePartInfos = JSON.parse(localStorage.getItem('courseBaseInfo')).corePartInfos
      return corePartInfos.filter(item => {
        return that.chapterCode.indexOf(item.chapter_code) > -1
      })[0]
    },
    getPartForms () {
      let curChapterContent = JSON.parse(localStorage.getItem('curChapterContent'))
      console.log('curChapterContent', curChapterContent)
      if (this.id.indexOf('A0') > -1) {
        let allForms = curChapterContent.coreLessons.parts[0].slides
        let coreParts = this.getCoreParts()
        console.log(coreParts)
        let coreNum = parseInt(this.id.replace('A0', ''))
        let part = coreParts.parts[coreNum - 1]
        let slides = part.Slides
        let startSlideIndex = slides[0] - 1
        let endSlideIndex = slides[slides.length - 1]
        this.partForms = allForms.slice(startSlideIndex, endSlideIndex)
        console.log(part)
        this.setSlidesVal(part)
      } else {
        this.partForms = curChapterContent.improvement.parts.filter(item => {
          return item.slide_type_code === this.chapterCode + '-' + this.id
        })[0].slides
        console.log(this.partForms)
        this.setSlidesVal(this.partForms)
      }
      console.log('partForms', this.partForms)
      let resource = this.getResource(this.curSlideIndex)
      console.log('getResource', this.getResource(this.curSlideIndex))
      this.changeSlide(Loader(resource))
    },
    getSlideForms (data) {
      let forms = this.partForms[this.curSlideIndex].forms
      let slide = []
      let mergeArray = []

      _.map(data, (val) => {
        forms[val.idx][val.type] = val.url
      })
      // 将imgtosentence的选项提取出来
      var imgtosen = _.groupBy(forms, 'form_show_type').imgToSentence
      var sentences = []
      _.each(imgtosen, (val) => {
        sentences.push({
          sentence: val.sentence
        })
      })

      // 赋值到相应组件中
      _.map(forms, (val) => {
        if (!/auto|repeat|fill|write|make|imgtosentence$/ig.test(val.form_show_type)) {
          mergeArray.push(val)
        } else {
          val.sentences = sentences
          slide.push(val)
        }
      })
      slide = slide.concat(mergeArray)
      return slide
    },
    getFormsTypes (data) {
      var arr = []
      _.map(data, (val) => {
        if (_.isArray(val)) {
          arr.push(val[0].form_show_type.toLowerCase())
        } else {
          arr.push(val.form_show_type.toLowerCase())
        }
      })
      return _.uniq(arr)
    },
    getResource (slideIndex) {
      let resource = []
      if (this.partForms.length === slideIndex) {
        return null
      }
      let forms = this.partForms[slideIndex].forms
      _.map(forms, (val, idx) => {
        val.form_id = idx + 1
        resource.push([{
          url: val.image,
          idx: idx,
          type: 'image'
        }, {
          url: val.sound,
          idx: idx,
          type: 'sound'
        }])
      })
      return _.flattenDeep(resource)
    },
    finishStudy () {
      if (this.id.indexOf('A0') > -1) {
        let coreNum = parseInt(this.id.replace('A0', '')) + 1
        if (coreNum <= 5) {
          this.$router.push({path: 'study', query: {chapterCode: this.chapterCode, id: 'A0' + coreNum}})
        } else {
          this.$router.push({path: 'app/course-list'})
        }
      }
    },
    changeSlide (thunk) {
      let that = this
      !thunk && (thunk = this.thunk)
      if (thunk === END) {
        that.finishStudy()
      } else {
        _.delay(() => {
          thunk.then((cb, data) => {
            window.onresize = () => {
              utils.resize(this.data)
            }
            console.log(data)
            that.slideForms = []
            that.slideForms = that.getSlideForms(data)
            let formTypes = that.getFormsTypes(that.slideForms)
            console.log('slideForms', that.slideForms)
            console.log('formtypes', that.getFormsTypes(that.slideForms))
            console.log('groupby', _.groupBy(this.slideForms, 'form_show_type'))

            if (formTypes.length === 1 && (formTypes.indexOf('sentencetoimg') > -1 || formTypes.indexOf('speaktoimg') > -1)) {
              this.view = 'choice'
            } else {
              let arr = []
              if (formTypes.indexOf('sentencetoimg') > -1) {
                arr = that.slideForms.filter(item => {
                  return !(item.form_show_type === 'sentenceToImg')
                })
                arr.push({
                  form_show_type: 'sentenceToImgBox',
                  data: _.groupBy(this.slideForms, 'form_show_type').sentenceToImg
                })
                that.slideForms = []
                this.$set(this, 'slideForms', arr)
                // that.slideForms = arr
              }
              this.view = 'swiper'
            }
            setTimeout(() => {
              that.$refs[this.view].$emit('init')
              this.isShow = true
              utils.resize(this.slideForms)
            }, 0)
            that.preLoad()
          })
        }, TRANSALTE_TIME)
      }
    },
    preLoad () {
      try {
        let resource = this.getResource(this.curSlideIndex + 1)
        this.thunk = resource ? Loader(resource) : END
      } catch (error) {
        console.log(error)
      }
    },
    resetData () {
      this.view = 'swiper'
      this.isShow = true
      this.thunk = null // promise
      this.partForms = []
      this.slideForms = []
      this.slidesVal = []
      this.curSlideIndex = 0
    }
  },
  watch: {
    $route (to, from) {
      this.resetData()
      this.getPartForms()
    }
  }
}
</script>

<style lang="less">
@import url('../../../static/less/animate.less');
@import url('../../../static/less/study.less');
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.gold {
  position: absolute;
  display: none;
  i {
    width: 30px;
    height: 30px;
    background-image: url('../../../static/images/study/icon-gold.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
  }
}
</style>
