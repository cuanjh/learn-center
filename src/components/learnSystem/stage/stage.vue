<template>
  <div>
    <div class="sentence-box"></div>
    <transition name="fade">
    <div class="stage f-cb f-usn" v-show="isShow">
      <!-- <transition-group tag="div"> -->
      <div v-for='(type, index) in typeList' :key='index' class='f-cb'
        :class="[
          type,
          {
            current:cur==index,
            up:showGuide,
            'layout-3': isLayout3,
            'layout-4': typeList.length == 7 || typeList.length == 8,
            'translation': 'sentencetoimg,imgtosentencew,speaktoimg'.indexOf(type) > -1
          }
        ]">
          <component :is="'form-'+type" :data="list[index]" :ref="'comp'+index"></component>
      </div>
      <!-- </transition-group> -->
    </div>
    </transition>
    <progress-bar :class="{TLY : isTeacher}" :slideList="progress" :curSlide="curSlide" />
    <coin-box :coin="coin" :total="totalCoin" v-if="!isTeacher"></coin-box>
    <pause-window ref='pauseWindow'></pause-window>
    <setting-window ref='settingWindow'></setting-window>
    <tip-box ref="tipbox" :tip="micphoneTip" />
    <core-summary ref="summary"/>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import { mapState, mapMutations, mapActions } from 'vuex'

import ProgressBar from '../progress.vue'
import CoinBox from './coinBox.vue'
import PauseWindow from './pauseWindow.vue'
import SettingWindow from './settingWindow.vue'
import TipBox from '../tipbox.vue'
import CoreSummary from '../summary.vue'

import Recorder from '../../../plugins/recorder'
import common from '../../../plugins/common'
import Loader from '../../../plugins/loader'
import logCollect from '../../../plugins/logCollect'
import { onlyId } from '../../../plugins/onlyId'
import coinCache from '../../../plugins/coin_cache'

import Cookie from '../../../tool/cookie'

var END = -1 // 结束标志位
var TRANSALTE_TIME = 500 // 动画过渡时间
let CUTDOWN_TIME = 3 // 每学3个同步一次学习进度
let t // 计时器
export default {
  props: ['id'],
  data () {
    return {
      cur: -1, // 当前的子组件
      isTeacher: 0,
      // totalCoin: 0, // 所有的金币数
      coin: 0, // 获取的金币数
      continue_correct: 0, // 连对数
      max_continue_correct: 0, // 最高连击数
      continue_wrong: 0, // 连错数,
      last_time: 0, // 持续时间,
      isFirst: 0, // 是否第一次进入当前slide，0非首次，1为首次
      showGuide: false, // 用户引导层是否显示
      micphoneTip: '', // 提示框文字
      cutdownTime: CUTDOWN_TIME,
      thunk: {}, // promise
      score: 0, // 分数
      resultForms: {},
      forms: {},
      typeList: [],
      list: [],
      isShow: true,
      isPop: false
    }
  },
  components: {
    ProgressBar,
    CoinBox,
    PauseWindow,
    SettingWindow,
    TipBox,
    CoreSummary
  },
  beforeRouteLeave (to, from, next) {
    this.$refs['summary'].$emit('coreSummary-hide')
    next()
  },
  beforeRouteUpdate (to, form, next) {
    console.log('router update')
    if (to.name === 'stage') {
      let id = to.params.id
      if (id.indexOf('A0') > -1) {
        this.updateCurCoreParts(id)
      }
      this.chapterProgress(id)
      this.timeCount()

      var that = this
      let _coinCache = coinCache.get(that.completePath)
      if (_coinCache === null) {
        coinCache.set(that.completePath, that.coin)
      } else {
        that.coin = _coinCache
        let coins = parseInt(this.totalCoin) + _coinCache
        that.updateTotalCoin(coins)
      }

      var resource = this.getResource(this.curSlide)
      this.changeData(this, Loader(resource))

      next()
    } else {
      next()
    }
  },
  created () {
    this.$on('exit', (param) => {
      console.log('exit')
      // 题型组件通知打开退出菜单
      this.micphoneTip = this.tips.exit_learn_system
      this.$refs.tipbox.$emit('confirm-show', param)

      // 组件暂停
      this.$emit('component-pause', 'pasue')
    })

    this.$on('calCoin', () => {
      console.log('calCoin')
      var that = this
      var minNum = 3 // 开始扣金币的最小数值
      var baseCoin = 2 // 连错后每次扣除的金币

      if (that.continue_correct & that.continue_wrong) { return }
      // 连续错误及连续正确均有值说明连续被中断，不再计算
      this.getCoinCalculationRule().then(() => {
        var rules = this.coinCalculationRule.rules
        var coin = 0 // 答对题目获取对应的金币个数
        $(rules.coin_rules).each((index, el) => {
          if (that.continue_correct === el.hits) {
            coin = el.coins
          }
        })

        if ((that.coin + coin) > rules.max_coins) {
          // 每个part获取的金币数量进行限制
          coin = Math.max((rules.max_coins - that.coin), 0)
        }
        if ((that.continue_correct >= rules.base)) {
          // 连续正确
          that.coin += coin
          let coins = that.totalCoin + coin
          that.updateTotalCoin(coins)
        } else if (that.continue_wrong >= minNum) {
          // 连续错误
          that.coin -= baseCoin
          let coins = Math.max((that.totalCoin - baseCoin), 0)
          that.updateTotalCoin(coins)
        }
      })
    })

    this.$on('correct', () => {
      if (this.progress[this.curSlide] !== -1) { return false } // 如果题目做过不再计算

      this.continue_correct += 1
      this.$emit('calCoin')
      this.continue_wrong = 0
    })

    this.$on('wrong', () => {
      console.log('wrong')
      if (this.progress[this.curSlide] !== -1) { return false } // 如果题目做过不再计算

      this.max_continue_correct = Math.max(this.continue_correct, this.max_continue_correct) // 更新最高连击数
      this.continue_wrong += 1
      this.$emit('calCoin')
      this.continue_correct = 0
    })

    this.$on('delTimer', () => {
      clearTimeout(this.timer)
      this.showGuide = false
      // this.$broadcast('delPosition')
    })
    // 执行下一个组件
    this.$on('next-component', (score) => {
      this.$emit('delTimer')
      this.score += score || 0
      this.cur++

      if (this.cur === this.list.length) {
        var s = this.score / this.comLength

        // 修改进度条进度
        if (!this.isTeacher) {
          this.updateProgressScore({ curSlide: this.curSlide, score: s })
        }
        this.score = 0
        this.cur = this.list.length - 1
        this.$emit('next-slide')

        return
      }

      // 开始运行组件
      setTimeout(() => {
        this.component_start()
      }, 100)
      return false
    })

    // 返回目录
    this.$on('back-content', () => {
      if (this.isTeacher) {
        var url = [
          'v2',
          'paradise',
          this.LANG.lang + '-' + this.LANG.code,
          // Config.LANG.lang,
          // Config.LANG.code,
          this.data[0]
        ]
        // return console.log(Config.index + url.join('/'))
        return (window.location.href = this.index + url.join('/'))
      }
      // 保存学习进度
      this.postProgress().then(() => {
        coinCache.update(this.coin)
      })
      this.getProgress(this.curChapterCode)
      // 退出学习日志数据收集
      var whetherFirst = (this.progress[0] === -1) - 0
      var chapterCode = localStorage.getItem('currentChapterCode')
      var currentForm = chapterCode + '-' + this.id + '-' + this.curSlide + '-' + (this.cur + 1)
      console.log(currentForm)
      logCollect.learnExit(whetherFirst, currentForm)

      onlyId.del() // 删除临时cookie，下次判定就是初次学习
      console.log(2222)
      this.subComps().forEach((item) => {
        if (item.length > 0) {
          item[0].$emit('break')
        }
      })
      this.$router.push({path: '/app/course-list'})
      // this.$dispatch('change-router', _.take(this.data, 3).join('/'))
    })

    // 下一个slide
    this.$on('next-slide', () => {
      // 每次向下学slide Time自减1
      // 每 CUTDOWN_TIME 次 同步一次学习进度
      this.cutdownTime--
      if (this.cutdownTime === 0) {
        this.cutdownTime = CUTDOWN_TIME
        this.postProgress().then(() => {
          coinCache.update(this.coin)
        })
        this.getProgress(this.curChapterCode)
      }
      // console.log('slides done:', this.cur_slide)
      if (this.curSlide + 1 === this.progress.length) {
        this.thunk = -1
      }
      this.$emit('switch-slide', this.curSlide + 1, true)
      return false
    })

    // 组件暂停
    this.$on('component-pause', (pasue) => {
      console.log(this.subComps())
      var cur = _.get(this.subComps(), this.cur)[0]
      if (!cur) {
        return
      }
      this.updatePause(true)
      _.get(this.subComps(), this.cur)[0].$emit('pause')

      if (pasue) {
        return
      }
      this.$refs.pauseWindow.$emit('pause-show')
    })
    // 组件恢复
    this.$on('component-resume', () => {
      this.updatePause(false)
      if (this.subComps().length > 0) {
        _.get(this.subComps(), this.cur)[0].$emit('resume')
      }
    })

    // 声音设置
    this.$on('sound_setting', () => {
      this.$refs.settingWindow.$emit('setting-show')
      // 组件暂停
      this.$emit('component-pause', 'pasue')
      return false
    })

    this.$on('teacher_setting', () => {
      this.$refs.settingWindow.$emit('teacher-show')

      // 组件暂停
      this.$emit('component-pause', 'pasue')
      return false
    })

    this.$on('open-feedback', () => {
      this.$broadcast('feedback-show')

      // 组件暂停
      this.$emit('component-pause', 'pasue')
      return false
    })

    // 切换slide
    this.$on('switch-slide', (slide, normal) => {
      $('.text-head').hide()
      this.score = 0
      // 广播组件销毁
      this.component_destroy()
      this.isShow = false
      this.cur = -1
      this.updateCurSlide(slide)
      // normal为正常下一个跳转，false时则重置状态重新加载
      if (normal) {
        /**
         * write by feng_hong@talkmate.com
         * 正常跳转也加上预加载的读条
         * @todo 更合理的方式是监听下预加载是否失败,如果失败了发个消息回来,先采用这种方式处理
         */
        if (END === this.thunk) {
          // 如果下一个课程已经没有了, 直接跳过, 而不是继续预加载
          this.changeData(this)
        } else {
          let resource1 = this.getResource(this.curSlide)
          this.changeData(this, Loader(resource1))
        }
      } else {
        let resource2 = this.getResource(this.curSlide)
        /**
         * pkLoad仅仅是借用之前的方法名而已
         * 这里的业务含义是在预加载失败后,会读条加载新的资源数据
         */
        this.changeData(this, Loader(resource2))
      }
    })

    this.$on('setTimer', () => {
      console.log('setTimer')
      var history = this.recordForm && this.recordForm.length
      var that = this
      clearTimeout(that.timer)
      if (this.showGuide) { return }
      if (history) { return }
      if (!this.isFirst) { return }
      if (!this.canRecord) { return }
      //  ↑ ↑ ↑ 如果user-box已经打开、有历史记录、或者麦克风选项关闭，不再提示
      that.timer = setTimeout(() => {
        if (!that.isPause && this.canRecord) {
          that.showGuide = true
          // that.$broadcast('updatePosition')
        }
      }, 4000)
    })
  },
  mounted () {
    let isAnonymous = Cookie.getCookie('is_anonymous') === 'true'
    console.log('isAnonymous--->', isAnonymous)
    if (isAnonymous) {
      this.initAnonymousData()
    } else {
      this.initData()
    }
  },
  computed: {
    ...mapState({
      currentCourseCode: state => state.course.currentCourseCode,
      curCorePart: state => state.course.curCorePart,
      curChapterContent: state => state.course.curChapterContent,
      recordForm: state => state.course.recordForm,
      currentChapterCode: state => state.course.currentChapterCode,
      progress: state => state.course.progress,
      curSlide: state => state.course.curSlide,
      pathArr: state => state.course.pathArr,
      core: state => state.course.core,
      homework: state => state.course.homework,
      improvement: state => state.course.improvement,
      coreComplete: state => state.course.coreComplete,
      homeworkComplete: state => state.course.homeworkComplete,
      improvementComplete: state => state.course.improvementComplete,
      unlockCourses: state => state.course.unlockCourses,
      coinCalculationRule: state => state.learn.coinCalculationRule,
      tips: state => state.learn.tips,
      formScores: state => state.course.formScores,
      canRecord: state => state.learn.canRecord,
      userInfo: state => state.userInfo,
      totalCoin: state => state.user.totalCoin,
      contentUrl: state => state.course.contentUrl
    }),
    comLength () {
      return _.flattenDeep(this.list).length
    },
    completePath () {
      let path = this.curChapterCode + '-' + this.id + '-Slide' + this.curSlide
      return path
    },
    isLayout3 () {
      if ([5, 6, 9].indexOf(this.typeList.length) !== -1) {
        return true
      }
      if (this.typeList.length === 3 && this.typeList.join(',').indexOf('sentencetoimg') === -1) {
        return true
      }
      return false
    },
    curChapterCode () {
      let curChapterCode
      if (!this.currentChapterCode) {
        curChapterCode = localStorage.getItem('currentChapterCode')
      } else {
        curChapterCode = this.currentChapterCode
      }
      return curChapterCode
    },
    ui () {
      let ui = this.userInfo
      if (Object.keys(ui).length === 0) {
        ui = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      return ui
    }
  },
  watch: {
    cur (val) {
      // 单组件单题，单组件多题数据类型不一样
      var isRepeat =
        (this.list[val] ? this.list[val].form_show_type : false) ===
        'repeatSpeak'
      if (isRepeat) {
        this.$emit('setTimer')
      }
    }
  },
  methods: {
    ...mapActions({
      getCoinCalculationRule: 'learn/getCoinCalculationRule',
      postProgress: 'course/postProgress',
      postActivityRecord: 'learn/postActivityRecord',
      postCoin: 'learn/postCoin',
      postUnlockChapter: 'course/postUnlockChapter',
      getUnlockChapter: 'course/getUnlockChapter',
      getProgress: 'course/getProgress',
      getUserInfo: 'user/getUserInfo',
      getChapterContent: 'course/getChapterContent',
      getLearnInfo: 'course/getLearnInfo',
      getCourseContent: 'course/getCourseContent',
      getRecord: 'course/getRecord'
    }),
    ...mapMutations({
      updateCurSlide: 'course/updateCurSlide',
      chapterProgress: 'course/chapterProgress',
      updateCurCoreParts: 'course/updateCurCoreParts',
      updateCurAssets: 'learn/updateCurAssets',
      updatePause: 'learn/updatePause',
      updateFormScore: 'course/updateFormScore',
      setFormScoresNull: 'course/setFormScoresNull',
      updateProgressScore: 'course/updateProgressScore',
      updateUnlockCourseList: 'course/updateUnlockCourseList',
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateCurChapter: 'course/updateCurChapter',
      updateTotalCoin: 'user/updateTotalCoin'
    }),
    getTypeList (list) {
      console.log('typelist')

      var arr = []
      _.map(list, (val) => {
        if (_.isArray(val)) {
          arr.push(val[0].form_show_type.toLowerCase())
        } else {
          arr.push(val.form_show_type.toLowerCase())
        }
      })

      return arr
    },
    getList (data) {
      console.log('list')
      let _slide = this.forms
      let slide = []
      let mergeArray = []

      _.map(data, (val) => {
        _slide[val.idx][val.type] = val.url
      })
      // 将imgtosentence的选项提取出来
      var imgtosen = _.groupBy(_slide, 'form_show_type').imgToSentence
      var sentences = []
      _.each(imgtosen, (val) => {
        sentences.push({
          sentence: val.sentence
        })
      })

      // 赋值到相应组件中
      _.map(_slide, (val) => {
        if (!/auto|repeat|fill|write|make|imgtosentence$/ig.test(val.form_show_type)) {
          mergeArray.push(val)
        } else {
          val.sentences = sentences
          slide.push(val)
        }
      })
      !_.isEmpty(mergeArray) && slide.push(mergeArray)
      return slide
    },
    // 学习卡片组件
    subComps () {
      let compArr = Object.keys(this.$refs).filter((val) => { return val.indexOf('comp') > -1 })
      var arr = []
      compArr.forEach((item) => {
        arr.push(_.get(this.$refs, item))
      })
      return arr
    },
    // 开始执行组件
    timeCount: function () {
      this.last_time += 1
      t = setTimeout(this.timeCount, 1000)
    },
    stopCount: function () {
      clearTimeout(t)
    },
    component_start: function () {
      this.$nextTick(function () {
        console.log('component_start')
        if (_.get(this.subComps(), this.cur)[0]) {
          _.get(this.subComps(), this.cur)[0].$emit('start')
        }
      })
    },
    resetSize () {
      // 重置
      common.reset()
      window.onresize = () => {
        common.resize(this.list, this.typeList)
      }
      this.$nextTick(() => {
        common.resize(this.list, this.typeList)
      })
    },
    getResource (curSlide) {
      let forms = {}
      let curChapterContent = {}
      if (Object.keys(this.curChapterContent).length === 0) {
        curChapterContent = JSON.parse(localStorage.getItem('curChapterContent'))
      } else {
        curChapterContent = this.curChapterContent
      }
      if (this.id.indexOf('A0') > -1) {
        let startSlideNum = this.curCorePart.Slides[0]
        let realSlideNum = startSlideNum + curSlide - 1

        forms = curChapterContent.coreLessons.parts[0]
          .slides[realSlideNum].forms
      } else {
        curChapterContent.improvement.parts.forEach((item) => {
          if (item.slide_type_code.indexOf(this.id) > -1) {
            forms = item.slides[curSlide].forms
          }
        })
      }
      forms = _.cloneDeep(forms)
      this.$set(this, 'forms', forms)
      var resource = []
      _.map(this.forms, function (val, idx) {
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
    // 销毁所有组件
    component_destroy () {
      this.subComps().forEach((item) => {
        if (item.length > 0) {
          item[0].$emit('break')
        }
      })
    },
    updateIsShowDialog (flag) {
      this.showDialog = flag
    },
    async initAnonymousData () {
      console.log(4444)
      await this.getUserInfo()
      console.log('userInfo===>', this.userInfo)
      // let curCourseCode = this.userInfo.current_course_code

      let curCourseCode = this.ui.current_course_code
      this.updateCurCourseCode(curCourseCode)
      await this.getLearnInfo(curCourseCode)
      await this.getUnlockChapter(curCourseCode).then((res) => {
        console.log('init unlock', res)
        this.updateUnlockCourseList(res)
      })
      await this.getCourseContent(this.contentUrl)
      await this.getChapterContent()

      await this.getRecord(this.currentChapterCode + '-A0')
      await this.getProgress(this.currentChapterCode)
      console.log(5555)
      this.initData()
    },
    async initData () {
      await this.getUserInfo()
      console.log(3333)
      // this.totalCoin = this.userInfo.coins
      localStorage.setItem('userCoin', this.userInfo.coins)
      // var that = this
      // let _coinCache = coinCache.get(that.completePath)
      // if (_coinCache === null) {
      //   coinCache.set(that.completePath, that.coin)
      // } else {
      //   that.coin = _coinCache
      //   that.totalCoin = parseInt(this.totalCoin) + _coinCache
      // }

      console.log('stage')
      let id = this.id
      localStorage.setItem('chapterType', this.id)
      if (id.indexOf('A0') > -1) {
        this.updateCurCoreParts(id)
      }

      this.chapterProgress(this.id)
      // this.typeList = this.getTypeList()
      // this.list = this.getList()

      this.timeCount()

      var resource = this.getResource(this.curSlide)
      this.changeData(this, Loader(resource))

      // this.$emit('next-component')
      // 弹出提示、/////////////////////////////////////////////

      this.$nextTick(() => {
        if (
          Recorder.isActivity() !== true &&
          Recorder.refuseRecord !== true &&
          this.canRecord
        ) {
          this.micphoneTip = this.tips.micphone
          this.isPop = true
        } else if (Recorder.refuseRecord) {
          this.micphoneTip = this.tips.micphone_failed
          this.isPop = true
        }
        if (this.isPop) {
          this.$refs.tipbox.$emit('tipbox-show')
          this.updatePause(true)
        }
      })
      await this.getCoinCalculationRule()
      this.isFirst = Number(this.progress[0] === -1)
      // 判断是否是第一次进入，日志数据提交
      if (!onlyId.get()) {
        onlyId.set()
        var whetherFirst = this.isFirst
        logCollect.learnStart(whetherFirst)
      }
    },
    // 重设Data数据
    async changeData (_this, trunk) {
      !trunk && (trunk = _this.thunk)
      if (trunk === END) {
        // // 核心课程结束则解锁其他的模块
        // if (_this.data[3] == "A0") {
        //   var open = Model.unlockProgress(_.take(_this.data, 4))
        //   //解锁提示
        //   if (open)
        //     toaster.success(Config.tips.chapter_opened)
        // } else {
        //   Model.postProgress(_.take(_this.data, 4))
        // }
        await _this.postProgress()
        _this.stopCount() // 停止计时器

        await _this.getProgress(_this.curChapterCode)
        console.log(_this.coin)
        _this.$emit('calCoin') // 结束前清算结果
        console.log(_this.coin)
        _this.postCoin(_this.coin)

        // Model.postRecord(_this.coin, _this.last_time, _this.max_continue_correct, _.take(_this.data, 4))
        // // 结束到总结页面
        // _this.$emit("goto-summary")

        // // 章节结束打点
        // //<courseEnd>
        // var code = _.values(Config.LANG).concat(_.take(_this.data, 4)).join("-")
        // statistics.finish_activity(code)
        // //</courseEnd>
        // return

        let cr, ccr
        if (_this.id.indexOf('A0') > -1) {
          // 截取数组当前核心部分
          // let arr = _.values(_this.formScores)
          // let formsRecord = arr.slice(_this.curCorePart.start_form - 1, _this.curCorePart.end_form)
          let formsRecord = []
          _this.curCorePart.Slides.forEach((slide) => {
            Object.keys(_this.formScores).filter((item) => {
              return item.indexOf('A0-' + slide + '-') > -1
            }).map((el) => {
              return _this.formScores[el]
            }).forEach((i) => {
              formsRecord.push(i)
            })
          })

          let correctArr = formsRecord.filter((item) => {
            return item === 1
          })
          cr = (correctArr.length / (_this.curCorePart.end_form - _this.curCorePart.start_form + 1)).toFixed(2)
          ccr = (formsRecord.length / (_this.curCorePart.end_form - _this.curCorePart.start_form + 1)).toFixed(2)
        } else {
          let curChapterContent = {}
          if (Object.keys(_this.curChapterContent).length === 0) {
            curChapterContent = JSON.parse(localStorage.getItem('curChapterContent'))
          } else {
            curChapterContent = _this.curChapterContent
          }

          let formsLength = 0
          curChapterContent.improvement.parts.forEach((item) => {
            if (item.slide_type_code.indexOf(_this.id) > -1) {
              var slides = item.slides
              slides.forEach((i) => {
                formsLength += i.forms.length
              })
            }
          })
          let arr1 = []
          _.forIn(_this.formScores, (value, key) => {
            if (key.indexOf('-' + _this.id + '-') > -1) {
              arr1.push(value)
            }
          })
          let correctArr1 = arr1.filter((item) => {
            return item === 1
          })
          cr = (correctArr1.length / formsLength).toFixed(2)
          ccr = (arr1.length / formsLength).toFixed(2)
        }

        let nextChapter
        if (_this.id.indexOf('A05') > -1) {
          let arr = _this.curChapterCode.split('-')
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
          var params = {
            chapter_code: nextChapter,
            core: 1,
            homework: 0,
            improvement: 0,
            core_complete: 0,
            homework_complete: 0,
            improvement_complete: 0,
            learn_time: 0,
            correct_rate: 0,
            group_id: ''
          }

          if (_this.unlockCourses.indexOf(nextChapter) === -1) {
            await _this.postUnlockChapter(params)
            await _this.getUnlockChapter(nextChapter).then((res) => {
              _this.updateUnlockCourseList(res)
            })
          }
        }
        var payload = {
          activityCode: _this.curChapterCode + '-' + _this.id,
          coins: _this.coin,
          correctHits: _this.continue_correct,
          learnTime: _this.last_time,
          correctRate: cr,
          courseCompleteRate: ccr
        }
        await _this.postActivityRecord(payload).then((res) => {
          console.log(res)
        })
        var params1 = {
          chapter_code: _this.curChapterCode,
          core: (_this.core) ? 1 : 0,
          homework: (_this.id.indexOf('A05') > -1) ? 1 : 0,
          improvement: (_this.id.indexOf('A05') > -1) ? 1 : 0,
          core_complete: (_this.id.indexOf('A05') > -1) ? 1 : 0,
          homework_complete: (_this.homeworkComplete) ? 1 : 0,
          improvement_complete: (_this.improvementComplete) ? 1 : 0,
          learn_time: _this.last_time,
          correct_rate: cr,
          group_id: ''
        }
        await _this.postUnlockChapter(params1).then((res) => {
          console.log(res)
        })
        // if (nextChapter) {
        //   _this.updateCurChapter(nextChapter)
        // }
        _this.$refs['summary'].$emit('coreSummary-show', _this.id)
        _this.setFormScoresNull()
        return false
      }
      _.delay(() => {
        setTimeout(() => {
          trunk.then((cb, data) => {
            console.log(data)
            var List = _this.getList(data)
            var Type = _this.getTypeList(List)
            _this.$set(_this, 'typeList', Type)
            _this.$set(_this, 'list', List)
            _this.$nextTick(() => {
              // 重置 cur 游标 否则会出现视图更新 cur未更新的状态
              _this.cur = -1
              _this.$emit('next-component')
            })
            // 重置
            common.reset()
            window.onresize = () => {
              common.resize(List, Type)
            }
            _this.$nextTick(() => {
              common.resize(List, Type)
            })
            _this.isShow = true
            // 预加载
            _this.preLoad(_this)
          }).catch((cb, err) => {
            console.log(err.stack)
          })
        }, 100)
      }, TRANSALTE_TIME)
    },
    preLoad (_this) {
      try {
        var resource = _this.getResource(_this.curSlide + 1)
        _this.thunk = resource ? Loader(resource) : END
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
