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
    <gold-animate ref="goldAnimate"/>
    <combo ref="combo" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

// 定义层级关系 part -> slide -> form 粒度从大到小
// 组件
import NavBar from './navBar/index'
import SwiperComp from './swiper'
import ChoiceComp from './choice'
import GoldAnimate from './common/goldAnimate'
import Combo from './common/combo'

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
const CUTDOWN_TIME = 3

export default {
  props: ['id'],
  data () {
    return {
      view: 'swiper',
      chapterCode: '',
      isShow: false,
      thunk: null, // promise
      partForms: [],
      slideForms: [],
      recordForms: {},
      slidesVal: [],
      curSlideIndex: 0,
      totalCoins: 0,
      cutdownTime: CUTDOWN_TIME,
      continueCorrect: 0, // 连对数
      continueWrong: 0, // 连错数
      continueCoins: 0, // 累计的金币数
      coinRules: [], // 金币规则
      minWrongNum: 3, // 连续错误次数超过3次，开始扣金币
      baseWrongCoin: 2 // 连错后每次扣除的金币数
    }
  },
  components: {
    NavBar,
    'swiper': SwiperComp,
    'choice': ChoiceComp,
    GoldAnimate,
    Combo
  },
  created () {
    this.$on('nextSlide', () => {
      this.postProgress({chapterCode: this.chapterCode, recordForms: this.recordForms})
      this.cutdownTime--
      if (this.cutdownTime === 0) {
        this.cutdownTime = CUTDOWN_TIME
        // this.postProgress({chapterCode: this.chapterCode, recordForms: this.recordForms})
      }
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

    // 计算学习金币
    bus.$on('calCoinStudy', (params) => {
      // score: 1 正确, 0 错误
      let score = params.score
      let offset = params.offset
      if (score) {
        this.continueCorrect++
        this.continueWrong = 0
        this.$refs['combo'].show({offset: offset, hits: this.continueCorrect})
      } else {
        this.continueWrong++
        this.continueCorrect = 0
      }
      let coins = 0
      // 连对大于base=2次
      if (this.continueCorrect >= this.coinRules.base) {
        // 根据连击正确数，获得对应的金币数
        let rule = this.coinRules.coin_rules.find(item => {
          return item.hits === this.continueCorrect
        })
        // 找到匹配的记录赋值
        if (rule) {
          coins = rule.coins
        }
        // 如果累计金币数量大于默认最大金币数，不获得金币
        if (this.continueCoins + coins > this.coinRules.max_coins) {
          coins = 0
        }
        // 计算累计金币数
        this.continueCoins += coins
        // 更新显示金币数量
        this.totalCoins += coins
        if (coins > 0) {
          this.$emit('animateGold', offset)
        }
      }
      // 连错大于3次
      if (this.continueWrong >= this.minWrongNum) {
        // 计算累计金币数
        this.continueCoins -= this.baseWrongCoin
        coins = Math.max(this.totalCoins - this.baseWrongCoin, 0)
        this.totalCoins = coins
      }
    })

    this.$on('animateGold', (offset) => {
      console.log(offset)
      this.$refs['goldAnimate'].show(offset)
    })

    // 每个form学完记录得分，params {formCode, score}
    bus.$on('setStudyFormScore', (params) => {
      console.log(params)
      let key = params.formCode.split('-').slice(5).join('-')
      _.set(this.recordForms, [key], params.score)
      this.setSlidesVal()
    })
  },
  mounted () {
    // 预加载内置音频
    SoundManager.load(this.sndEff)
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.totalCoins = userInfo.coins
    utils.resize()
    console.log(this.$route)
    console.log(this.id)
    this.getStudyCoinRules().then(res => {
      console.log('coin rules', res)
      this.coinRules = res.rules
    })
    this.chapterCode = this.id.split('-').slice(0, 5).join('-')
    this.initData()
  },
  computed: {
    ...mapState({
      sndEff: state => state.learn.sndEff
    }),
    part () {
      return {
        id: this.id,
        slidesVal: this.slidesVal,
        curSlideIndex: this.curSlideIndex,
        totalCoins: this.totalCoins
      }
    }
  },
  methods: {
    ...mapActions([
      'getProgress',
      'postProgress',
      'getStudyCoinRules'
    ]),
    async initData () {
      // 获取课程进度
      let progress = await this.getProgress({chapter_code: this.chapterCode})
      if (progress.state > 0) {
        this.recordForms = progress.record.forms
      }
      this.getPartForms()
    },
    setSlidesVal () {
      let that = this
      console.log(that.recordForms)
      this.slidesVal = []
      this.partForms.forEach((slide, i) => {
        let val = -1
        let sum = 0
        let formId = slide.slide_code.split('-').slice(5, 7).join('-')
        slide.forms.forEach((form, j) => {
          let v = that.recordForms[formId + '-' + (j + 1)]
          if (v === 0 || v === 1) {
            sum += that.recordForms[formId + '-' + (j + 1)]
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
        return that.id.indexOf(item.chapter_code) > -1
      })[0]
    },
    getPartForms () {
      let curChapterContent = JSON.parse(localStorage.getItem('curChapterContent'))
      console.log('curChapterContent', curChapterContent)
      if (this.id.indexOf('A0') > -1) {
        let allForms = curChapterContent.coreLessons.parts[0].slides
        let coreParts = this.getCoreParts()
        console.log(coreParts)
        let core = this.id.split('-').pop()
        let coreNum = parseInt(core.replace('A0', ''))
        let part = coreParts.parts[coreNum - 1]
        let slides = part.Slides
        let startSlideIndex = slides[0] - 1
        let endSlideIndex = slides[slides.length - 1]
        this.partForms = allForms.slice(startSlideIndex, endSlideIndex)
        console.log(part)
        this.setSlidesVal()
      } else {
        this.partForms = curChapterContent.improvement.parts.filter(item => {
          return item.slide_type_code === this.id
        })[0].slides
        console.log(this.partForms)
        this.setSlidesVal()
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
      // 上报学习进度得分
      this.postProgress({chapterCode: this.chapterCode, recordForms: this.recordForms})

      let part = this.id.split('-').pop()
      // 核心课程学完，直接学习下一个核心课程
      if (part.indexOf('A0') > -1) {
        let coreNum = parseInt(part.replace('A0', '')) + 1
        if (coreNum <= 5) {
          let id = this.chapterCode + '-A0' + coreNum
          this.$router.push({path: 'study', query: {id: id}})
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
</style>
