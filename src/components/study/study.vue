<template>
  <div class="study-container flex">
    <nav-bar :part="partObj"></nav-bar>
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
    <combo-comp ref="combo"/>
    <summary-comp ref="summary" @goBack="goBack"/>
    <record-list ref="record"/>
    <word-panel ref="wordPanel"/>
    <sentence-box/>
    <evaluating-iat-box />
    <noVip-guide-pro-box />
    <prompt-box />
    <yuyin-guide-box />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import _ from 'lodash'

// 定义层级关系 part -> slide -> form 粒度从大到小
// 组件
import NavBar from './navBar/index'
import SwiperComp from './swiper'
import ChoiceComp from './choice'
import SummaryComp from './summary'
import RecordList from './recordList'
import GoldAnimate from './common/goldAnimate'
import ComboComp from './common/combo'
import WordPanel from './common/wordPanel'

// 插件
import utils from '../../plugins/utils'
import Loader from '../../plugins/loader'
import SoundManager from '../../plugins/soundManager'
import bus from '../../bus'
import minx from './form/minx'

// 语音弹框
import SentenceBox from '../common/yuyin/sentenceBox'
import EvaluatingIatBox from '../common/yuyin/evaluatingIatBox'
import NoVipGuideProBox from '../common/yuyin/noVipGuideProBox'
import PromptBox from '../common/yuyin/promptBox'
import YuyinGuideBox from '../common/yuyin/yuyinGuideBox'

// 结束标志位
let END = -1
// 动画过渡时间
const TRANSALTE_TIME = 500

export default {
  props: ['id'],
  data () {
    return {
      view: 'swiper',
      chapterCode: '',
      unlockChapters: null,
      langCode: '',
      courseCode: '',
      curLevel: '',
      isShow: false,
      thunk: null, // promise
      partForms: [],
      slideForms: [],
      recordForms: {},
      curPartForms: {}, // 点击过的form
      slidesVal: [],
      curSlideIndex: 0,
      isChangeSlide: false,
      totalCoins: 0,
      learnTime: 0, // 学习时长
      learnInterval: null, // 学习时长间隔器
      continueCorrect: 0, // 连对数
      maxContinueHits: 0, // 最大连击数
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
    ComboComp,
    SummaryComp,
    RecordList,
    WordPanel,
    SentenceBox,
    EvaluatingIatBox,
    NoVipGuideProBox,
    PromptBox,
    YuyinGuideBox
  },
  created () {
    this.$on('nextSlide', () => {
      if (this.curSlideIndex + 1 === this.partForms.length) {
        this.continueCorrect = 0
        this.changeSlide(-1)
      } else {
        if (this.view === 'choice') {
          this.$refs['choice'].resetData()
        }
        this.isShow = false
        this.curSlideIndex++
        let resource = this.getResource(this.curSlideIndex)
        this.changeSlide(Loader(resource))
      }
    })

    this.$on('changeSlide', (index) => {
      this.isShow = false
      if (this.view === 'swiper') {
        this.$refs['swiper'].$emit('destroySwiper')
      }
      this.isChangeSlide = true
      this.curSlideIndex = index
      console.log('changeSlide', index)
      let resource = this.getResource(this.curSlideIndex)
      this.changeSlide(Loader(resource))
    })

    // 计算学习金币
    this.$on('calCoinStudy', (params) => {
      // score: 1 正确, 0 错误
      let score = params.score
      let offset = params.offset
      if (typeof this.curPartForms[params.formCode] === 'undefined') {
        _.set(this.curPartForms, [params.formCode], params.score)
      } else {
        return false
      }
      if (score) {
        console.log('score', score)
        this.continueCorrect++
        this.maxContinueHits = Math.max(this.continueCorrect, this.maxContinueHits)
        this.continueWrong = 0
        this.$refs['combo'].$emit('show', {offset: offset, hits: this.continueCorrect})
      } else {
        this.continueWrong++
        this.continueCorrect = 0
      }
      // 判断当前form是否已经学习
      let isLearned = this.isLearned(params.formCode)
      let coins = 0
      // 连对大于base=2次
      if (this.continueCorrect >= this.coinRules.base && !isLearned) {
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

        if (coins > 0) {
          // 计算累计金币数
          this.continueCoins += coins
          // 更新显示金币数量
          this.totalCoins += coins
          this.$emit('animateGold', offset)
        }
      }
      // 连错大于3次 (不再扣除金币)
      if (this.continueWrong >= this.minWrongNum && !isLearned) {
        // 计算累计金币数
        // this.continueCoins -= this.baseWrongCoin
        // coins = Math.max(this.totalCoins - this.baseWrongCoin, 0)
        // this.totalCoins = coins
      }
    })

    this.$on('animateGold', (offset) => {
      console.log(offset)
      this.$refs['goldAnimate'].show(offset)
    })

    // 每个form学完记录得分，params {formCode, score}
    this.$on('setStudyFormScore', (params) => {
      console.log(params)
      let key = params.formCode.split('-').slice(5).join('-')
      _.set(this.recordForms, [key], params.score)
      console.log('setStudyFormScore', this.recordForms)
      this.updateRecordForms(this.recordForms)
      this.setSlidesVal()
    })

    // 返回
    this.$on('goBack', () => {
      // 上报学习进度得分
      this.postProgress({chapterCode: this.chapterCode, recordForms: this.recordForms})
      // 保存学习获得的金币, 累计金币数可为正数和负数，正数表示连对奖励的金币，负数表示连续做错扣除的金币
      if (this.continueCoins !== 0) {
        this.postCoins({coins: this.continueCoins, courseCode: this.courseCode}).then(res => {
          this.continueCoins = 0
        })
      }
      this.goBack()
    })

    // 继续学习
    this.$on('continueLearn', () => {
      // 核心课程学完，直接学习下一个核心课程
      if (this.id.indexOf('A0') > -1) {
        let part = this.id.split('-').pop()
        let coreNum = parseInt(part.replace('A0', '')) + 1
        if (coreNum <= 5) {
          let nextId = this.chapterCode + '-A0' + coreNum
          this.$router.push({path: 'study', query: {id: nextId}})
        } else {
          this.goBack()
        }
      } else {
        this.goBack()
      }
    })

    this.$on('RecordListInit', (courseList, recordCourse) => {
      this.$refs['record'].$emit('init', courseList, recordCourse)
    })

    // 显示单词面板
    bus.$on('showWordPanel', (params) => {
      this.$refs['wordPanel'].show(params)
    })
    // 隐藏单词面板
    bus.$on('hideWordPanel', () => {
      this.$refs['wordPanel'].hide()
    })
    this.getUserInfo()
  },
  mounted () {
    localStorage.removeItem('xfIATResult')
    // 记录学习时长
    this.learnInterval = setInterval(() => {
      this.learnTime++
    }, 1000)
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
    let arr = this.id.split('-')
    this.chapterCode = arr.slice(0, 5).join('-')
    this.langCode = arr.slice(0, 1).join('-')
    this.courseCode = arr.slice(0, 2).join('-')
    this.curLevelCode = arr.slice(0, 3).join('-')
    this.getUnlockChapter(this.courseCode).then(res => {
      console.log('unlockChapters', res)
      this.unlockChapters = res.unlock
    })
    // let lang = arr[0]
    // if (lang === 'ENG') {
    //   this.updatexfSpeechType('ise')
    //   // 拉取讯飞测评数据
    //   this.xfISEPull({chapter_code: this.chapterCode}).then(res => {
    //     if (res.success) {
    //       localStorage.setItem('xfISEResult', JSON.stringify(res.forms))
    //     }
    //   })
    // } else {
    //   this.updatexfSpeechType('iat')
    // }
    this.updatexfSpeechType('iat')
    this.initData()
  },
  computed: {
    ...mapState({
      sndEff: state => state.learn.sndEff
    }),
    partObj () {
      return {
        id: this.id,
        slidesVal: this.slidesVal,
        curSlideIndex: this.curSlideIndex,
        totalCoins: this.totalCoins
      }
    }
  },
  mixins: [minx.isLearned],
  methods: {
    ...mapActions([
      'getUserInfo',
      'getCatalog',
      'getChapterContent',
      'getCorePartInfo',
      'getProgress',
      'getStudyCoinRules',
      'postProgress',
      'postCoins',
      'setPartComplete',
      'setModuleComplete',
      'setChapterUnlock',
      'getUnlockChapter',
      'postActivityRecord',
      'xfISEPull',
      'xfISEUpload'
    ]),
    ...mapMutations([
      'updateRecordForms',
      'updatexfSpeechType'
    ]),
    initData () {
      // 获取课程进度
      this.getProgress({chapter_code: this.chapterCode}).then(progress => {
        this.recordForms = progress.record.forms
        console.log('recordForms', this.recordForms)
        this.updateRecordForms(this.recordForms)
        this.getPartForms()
      })
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
      console.log('slidesVal', this.slidesVal)
    },
    getCoreParts () {
      let that = this
      console.log(JSON.parse(localStorage.getItem('courseBaseInfo')))
      let corePartInfos = JSON.parse(localStorage.getItem('courseBaseInfo')).corePartInfos
      return corePartInfos.filter(item => {
        return that.id.indexOf(item.chapter_code) > -1
      })[0]
    },
    async getPartForms () {
      let res1 = await this.getCatalog({course_code: this.courseCode})
      let catalogs = res1.catalogInfo.catalogs
      let curLevel = catalogs.find(item => {
        return item.code === this.curLevelCode
      })
      let curLevelChapters = curLevel.chapters
      let curChapterObj = curLevelChapters.find(item => {
        return item.code === this.chapterCode
      })
      let chapterUrl = curChapterObj.chapter_url.replace('http://course-assets.talkmate.com/', 'https://course-assets1.talkmate.com/')
      let curChapterContent = await this.getChapterContent(chapterUrl)
      console.log('curChapterContent', curChapterContent)
      if (this.id.indexOf('A0') > -1) {
        let allForms = curChapterContent.coreLessons.parts[0].slides
        let corePartInfos = await this.getCorePartInfo({lang_code: this.langCode})
        let coreParts = corePartInfos.parts_info.find(item => {
          return this.chapterCode.indexOf(item.chapter_code) > -1
        })
        console.log(coreParts)
        let core = this.id.split('-').pop()
        let coreNum = parseInt(core.replace('A0', ''))
        let part = coreParts.parts[coreNum - 1]
        let slides = part.slides
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
      for (let i = 0; i < this.slidesVal.length; i++) {
        if (this.slidesVal[i] === -1 && !this.isChangeSlide) {
          this.curSlideIndex = i
          break
        }
      }
      console.log('curSlideIndex', this.curSlideIndex)
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
        sentences.push(val.sentence)
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
      let arr = this.id.split('-')
      let part = arr.pop()
      // 上报学习进度得分
      this.postProgress({chapterCode: this.chapterCode, recordForms: this.recordForms})

      // 上报测评结果(仅识别)
      // let arr = this.id.split('-')
      // if (arr[0] === 'ENG') {
      //   // 保存测评信息
      //   this.xfISEUpload({forms: localStorage.getItem('xfISEResult')})
      // }
      // 保存学习获得的金币, 累计金币数可为正数和负数，正数表示连对奖励的金币，负数表示连续做错扣除的金币
      if (this.continueCoins !== 0) {
        this.postCoins({coins: this.continueCoins, courseCode: this.courseCode}).then(res => {
          this.continueCoins = 0
        })
      }

      let unlockChapter = this.unlockChapters[this.chapterCode]
      // 设置当前part完成
      this.setPartComplete({part_code: this.id})
      if (part === 'A05') {
        if (unlockChapter && !unlockChapter['Core_complete']) {
          // 设置当前module完成
          this.setModuleComplete({chapter_code: this.chapterCode, module: 'core_complete'})
        }
        if (unlockChapter && !unlockChapter['Homework']) {
          // 解锁作业课程
          this.setChapterUnlock({chapter_code: this.chapterCode, module: 'homework'})
        }
        if (unlockChapter && !unlockChapter['Improvement']) {
          // 解锁强化课程
          this.setChapterUnlock({chapter_code: this.chapterCode, module: 'improvement'})
        }
        let nextChapterCode = this.getNextChapterCode()
        if (!this.unlockChapters[nextChapterCode]) {
          // 解锁下一课程
          this.setChapterUnlock({chapter_code: nextChapterCode, module: 'core'})
        }
      }

      // 清除学习时长计时器
      clearInterval(this.learnInterval)
      // 计算当前part的正确率和完成率
      let partRate = this.calPartRate()
      console.log('partRate', partRate)
      // 统计学习信息
      let params = {
        activity_code: this.id,
        coins: this.continueCoins,
        correct_hits: this.maxContinueHits,
        learn_time: this.learnTime,
        correct_rate: partRate.correctRate,
        course_complete_rate: partRate.completeRate
      }
      let _this = this
      this.postActivityRecord(params).then((res) => {
        _this.$refs['summary'].$emit('coreSummary-show', _this.id)
      })
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
      this.isChangeSlide = false
    },
    // 计算本部分的正确率和完成率
    calPartRate () {
      let correctCount = 0
      let completeCount = 0
      let formCodes = []
      this.partForms.forEach(item => {
        item.forms.forEach(f => {
          let formCode = f.code.split('-').slice(5).join('-')
          formCodes.push(formCode)
          if (this.recordForms[formCode] === 1) {
            correctCount++
            completeCount++
          }
          if (this.recordForms[formCode] === 0) {
            completeCount++
          }
        })
      })
      return {
        correctRate: parseFloat((correctCount / formCodes.length).toFixed(2)),
        completeRate: parseFloat((completeCount / formCodes.length).toFixed(2))
      }
    },
    getNextChapterCode () {
      let nextChapter = ''
      let arr = this.chapterCode.split('-')
      if (arr[4].toLowerCase() === 'chapter6') {
        if (arr[3] === 'Unit4') {
          if (arr[2] === 'Level7') {
            return
          } else {
            let level = 'Level' + parseInt(arr[2].replace('Level', '')) + 1
            nextChapter = arr[0] + '-' + arr[1] + '-' + level + 'Unit1-Chapter1'
          }
        } else {
          let unit = 'Unit' + (parseInt(arr[3].replace('Unit', '')) + 1)
          nextChapter = arr[0] + '-' + arr[1] + '-' + arr[2] + '-' + unit + '-Chapter1'
        }
      } else {
        let chapter = 'Chapter' + (parseInt(arr[4].replace('Chapter', '')) + 1)
        nextChapter = arr[0] + '-' + arr[1] + '-' + arr[2] + '-' + arr[3] + '-' + chapter
      }
      return nextChapter
    },
    goBack () {
      // 上报学习进度得分
      // this.postProgress({chapterCode: this.chapterCode, recordForms: this.recordForms})
      let isKid = localStorage.getItem('isKid')
      if (isKid === '1') {
        this.$router.push({path: '/app/kid-course-list/' + this.courseCode})
      } else {
        this.$router.push({path: '/app/course-list/' + this.courseCode})
      }
    }
  },
  watch: {
    $route (to, from) {
      localStorage.removeItem('xfIATResult')
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
