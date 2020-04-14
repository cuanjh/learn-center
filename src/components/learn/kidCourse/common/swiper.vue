<template>
  <div class="swiper" id="certify">
    <div class="current-swiper swiper-container " :id="'current-swiper-' + chapterCode + '-' + type">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
          v-for="(item, index) in list"
          :key="'current-swiper-' + item.code"
          :id="chapterCode + '-' + item.code">
          <img class="picture" :src="item.image.replace('http://course-assets.talkmate.com/', 'https://course-assets1.talkmate.com/') | urlFix('imageView2/0/w/2001/h/900/format/jpg')" alt="">
          <div class="slide-content">
            <div class="content">
              <i @click="playSourceSound(index)"></i>
              <p :data-content="item.content || item.word" data-isevaluate="">
                <span v-for="(content, index) in item.formatContent" :data-content="content" :key="index" v-html="(content.indexOf('-') > -1 || content === '?') ? content : ' ' + content" @click="showWordPanel($event, index)"></span>
              </p>
            </div>
            <div class="result-out" v-show="false"></div>
            <ise-area
              ref="ise"
              :formCode="chapterCode + '-' + type.charAt(0).toUpperCase() + type.slice(1) + '-' + (index + 1)"
              @startRecord="startRecord"
              @stopRecord="stopRecord"
              @playRecord="playRecord"
              @startEvaluate="startEvaluate"
              @goWordListBox="goWordListBox"
            />
          </div>
          <div class="shade"></div>
        </div>
      </div>
    </div>

    <div class="swiper-page-container">
      <div class="mouse-text" v-show="isShowMose"><i></i><span>上下滚动鼠标可切换页面哦！</span></div>
      <p>
        <span>{{ curPage }}</span> / <span>{{ totalPage }}</span>
      </p>
    </div>
    <!-- <button @click="goGradeBox()">测试学完后的弹框</button> -->
    <score-result-box ref="scoreResult"/>
    <grade-box ref="gradeBox"/>
    <evaluating-box />
    <noVip-guide-box ref="noVipGuideBox"/>
    <word-list-box ref="WordListBox"/>
    <tipbox ref="tipbox" :tip="tip"/>
    <prompt-box />
  </div>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
import Swiper from 'swiper'
import { mapActions, mapState, mapMutations } from 'vuex'
import IseArea from './iseArea.vue'
import Recorder from '../../../../plugins/recorder'
import xfSentence from '../../../../plugins/xf_sentence'
import utils from '../../../../plugins/utils'
import cookie from '../../../../tool/cookie'
// import bus from '../../../../bus'
import GradeBox from './gradeBox.vue'
import EvaluatingBox from './evaluatingBox.vue'
import WordListBox from './wordListBox.vue'
import LastGradeBox from './lastGradeBox.vue'
import ScoreResultBox from './scoreResultBox.vue'
import NoVipGuideBox from './noVipGuideBox.vue'
import Tipbox from './tipbox.vue'
// import PromptBox from './promptBox.vue'
import PromptBox from '../../../common/yuyin/promptBox.vue'
import bus from '../../../../bus'

export default {
  props: ['chapterCode', 'type'],
  data () {
    return {
      list: [],
      totalPage: 0,
      swiper: null,
      curPage: 1,
      audio: new Audio(),
      recordAudio: new Audio(),
      recordUrl: '',
      isPlay: false,
      isShowMose: true,
      qiniuToken: '',
      iseWords: [],
      timerInterval: null, // 录音间隔器
      time: 0, // 录音计时
      tip: '',
      contentArr: []
    }
  },
  components: {
    IseArea,
    GradeBox,
    EvaluatingBox,
    WordListBox,
    LastGradeBox,
    ScoreResultBox,
    NoVipGuideBox,
    Tipbox,
    PromptBox
  },
  created () {
    bus.$on('thisAudioPause', () => {
      this.audio.pause()
      $('.current-swiper .swiper-slide-active').find('.content i').removeClass('playing')
      this.isPlay = false
    })
    this.$on('showTip', () => {
      this.tip = this.tips.micphone
      this.$refs['tipbox'].$emit('tipbox-show')
    })
    this.$on('recordAnimate', () => {
      this.recordAnimate()
    })
    this.$on('reset', () => {
      this.reset(this.curPage - 1)
    })
    if (this.xfSpeechType === 'ise') {
      // 拉取讯飞测评数据
      this.xfISEPull({chapter_code: this.chapterCode}).then(res => {
        if (res.success) {
          localStorage.setItem('xfISEResult', JSON.stringify(res.forms))
          this.getAvarageScore()
        }
      })
    }
    bus.$on('kidRecordingSwiperMouse', (flag) => {
      if (flag) {
        this.swiper.mousewheel.disable()
        $('.current-swiper').addClass('swiper-no-swiping')
      } else {
        this.swiper.mousewheel.enable()
        $('.current-swiper').removeClass('swiper-no-swiping')
      }
    })
  },
  mounted () {
    // 获取课程数据
    this.initData()
    setTimeout(() => {
      this.isShowMose = false
    }, 5000)
    // 初始化录音插件
    this.initRecorder()
    // 获取qiniu token
    this.getUploadFileToken().then(res => {
      if (res.success) {
        this.qiniuToken = res.token
      }
      console.log('qiniuToken', this.qiniuToken)
    })
  },
  watch: {
    time (val) {
      // 监听录音计时，累计到60s，停止录音
      console.log(val)
      if (val === 60) {
        this.stopRecord()
      }
    }
  },
  computed: {
    ...mapState({
      xfLang: state => state.xfLang,
      kidRecordList: state => state.kidRecordList,
      tips: state => state.learn.tips,
      xfSpeechType: state => state.xfSpeechType,
      xfSpeechState: state => state.xfSpeechState,
      xfIATScoreRange: state => state.xfIATScoreRange,
      isVip: state => state.isVip
    }),
    formCode () {
      return this.chapterCode + '-' + this.type.charAt(0).toUpperCase() + this.type.slice(1) + '-' + this.curPage
    }
  },
  methods: {
    ...mapActions([
      'getKidCourseContent',
      'getUploadFileToken',
      'xfISE',
      'getKidRecordSave',
      'getKidRecordList',
      'setPartComplete',
      'xfISEUpload',
      'xfISEPull'
    ]),
    ...mapMutations([
      'updateCanRecord'
    ]),
    // 初始化录音
    initRecorder () {
      // 录音插件初始化
      Recorder.init({inputSampleRate: 50400, sampleRate: 16000}, (flag) => {
        this.updateCanRecord(flag)
        if (!flag) {
          this.tip = this.tips.micphone
          this.$refs['tipbox'].$emit('tipbox-show')
        }
      })
    },
    // 初始化数据
    initData () {
      let teacherContent = JSON.parse(localStorage.getItem('kidTeacherContent'))
      let data = []
      switch (this.type) {
        case 'draw':
          data = teacherContent.draw_contents
          break
        default:
          data = teacherContent.words
          break
      }
      this.list = []
      data.forEach(item => {
        let obj = item
        obj['formatContent'] = this.formatContent(obj.content || obj.word)
        this.preload(item.sound.replace('http://course-assets.talkmate.com/', 'https://course-assets1.talkmate.com/'))
        this.preload(item.image.replace('http://course-assets.talkmate.com/', 'https://course-assets1.talkmate.com/'))
        this.list.push(obj)
      })
      console.log(this.list)
      console.log('=========', data)
      this.totalPage = this.list.length
      this.curPage = 1
      this.setProgress()
      this.initSwiper()
    },
    // 获取数据后，初始化swiper
    initSwiper () {
      this.swiper = new Swiper('#current-swiper-' + this.chapterCode + '-' + this.type, {
        watchSlidesProgress: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: false,
        mousewheel: true,
        // mousewheel: {
        //   eventsTarged: '.kid-stage-container'
        // },
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        loop: false,
        allowTouchMove: false,
        preventClicksPropagation: true,
        slideToClickedSlide: true,
        on: {
          init: () => {
            this.playSourceSound(this.curPage - 1)
          },
          slideChange: () => {
            console.log(this.swiper)
            let showCircle = localStorage.getItem('showCircle')
            if (showCircle !== '1' && !this.isVip) {
              localStorage.setItem('showCircle', '1')
            }
            let circle = localStorage.getItem('showCircle')
            bus.$emit('localShowCircle', circle)

            this.reset(this.swiper.previousIndex)

            let activeIndex = this.swiper.activeIndex
            this.curPage = activeIndex + 1
            this.setProgress()
            this.playSourceSound(activeIndex)
            if (this.list.length === this.curPage) {
              bus.$emit('thisAudioPause')
              bus.$emit('setIsShowIseReport', true)
              let activityCode = this.chapterCode + '-' + this.type.charAt(0).toUpperCase() + this.type.slice(1)
              this.setPartComplete({part_code: activityCode})
            }
            console.log('curPage' + this.curPage)
          },
          progress: function (progress) {
            for (let i = 0; i < this.slides.length; i++) {
              let slide = this.slides.eq(i)
              let slideProgress = this.slides[i].progress
              let translate = slideProgress * 290 + 'px'
              let scale = 1 - Math.abs(slideProgress) / 3
              let zIndex = 999 - Math.abs(Math.round(10 * slideProgress))
              slide.transform('translateX(' + translate + ') scale(' + scale + ')')
              slide.css('zIndex', zIndex)
              slide.css('opacity', 1)
              if (Math.abs(slideProgress) > 3) {
                slide.css('opacity', 0)
              }
            }
          },
          setTransition: function (transition) {
            for (var i = 0; i < this.slides.length; i++) {
              var slide = this.slides.eq(i)
              slide.transition(transition)
            }
          }
        }
      })
      console.log('initSwiper', this.swiper)
    },
    // 设置学习进度
    setProgress () {
      let progress = Math.round((this.curPage * 1.0 / this.totalPage * 100), 2)
      this.$emit('setProgress', progress)
    },
    // 格式化内容，添加span标签
    formatContent (content) {
      if (!content) {
        return ''
      }
      let result = []
      let arrBR = content.split('\n')
      console.log(arrBR)
      for (let m = 0; m < arrBR.length; m++) {
        let arr = arrBR[m].split(' ')
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].trim().length > 0) {
            if (arr[i] === '<br/>') {
              result.push('<br/>')
            } else if (arr[i].indexOf('<br/>') > -1) {
              let r = arr[i].split('<br/>')
              for (let l = 0; l < r.length; l++) {
                if (r[l].trim().length > 0) {
                  let tag = ''
                  if (l === 0) {
                    tag = '<br/>'
                  }
                  result.push(r[l].trim() + tag)
                }
              }
            } else if (arr[i].indexOf('?') > -1) {
              let r = arr[i].split('?')
              for (let j = 0; j < r.length; j++) {
                if (r[j].trim().length > 0) {
                  result.push(r[j].trim())
                  if (j === 0) {
                    let last = result.pop()
                    result.push(last + '?')
                  }
                }
              }
            } else if (arr[i].indexOf('”') > -1) {
              let r = arr[i].split('”')
              for (let k = 0; k < r.length; k++) {
                if (r[k].trim().length > 0) {
                  let tag = ''
                  if (k === 0) {
                    tag = '”'
                  }
                  result.push(r[k].trim() + tag)
                }
              }
            } else if (arr[i].indexOf('《') > -1) {
              let r = arr[i].split('《')
              if (r[0].length > 0) {
                result.push(r[0])
              }
              result.push('《' + r[1])
            } else {
              if (arr[i].trim() === '—') {
                result.push(arr[i].trim())
                continue
              } else if (arr[i].trim().indexOf('-') > -1) {
                let arr1 = arr[i].trim().split('-')
                result.push(arr1[0])
                result.push('-' + arr1[1])
              } else {
                result.push(arr[i].trim())
              }
            }
          }
        }
        if (arrBR.length > 1 && m === 0) {
          let last = result.pop()
          result.push(last + '<br/>')
        }
      }
      return result
    },
    // 预加载
    preload (url) {
      if (/mp3/i.test(url)) {
        let audio = new Audio()
        audio.src = url
      } else {
        let image = new Image()
        image.src = url
      }
    },
    // 播放原始音频
    playSourceSound (index) {
      this.recordAudio.pause()
      if (this.$refs['ise']) {
        this.$refs['ise'][index].resetPlay()
      }

      if (!this.isPlay) {
        let item = this.list[index]
        this.audio.src = item.sound.replace('http://course-assets.talkmate.com/', 'https://course-assets1.talkmate.com/')
        this.audio.oncanplay = () => {
          this.audio.play()
          $('.current-swiper .swiper-slide-active').find('.content i').addClass('playing')
          this.isPlay = true
        }
        this.audio.onended = () => {
          $('.current-swiper .swiper-slide-active').find('.content i').removeClass('playing')
          this.isPlay = false
        }
      } else {
        bus.$emit('thisAudioPause')
      }
    },
    // 暂停原始录音播放
    pauseSourceSound () {
      bus.$emit('thisAudioPause')
    },
    // 开始录音
    startRecord () {
      bus.$emit('thisAudioPause')
      this.timerInterval = setInterval(() => {
        this.time++
      }, 1000)
      Recorder.startRecording()
      let index = this.curPage - 1
      this.$refs['ise'][index].resetPlay()
      this.recordAudio.pause()
      if (this.xfSpeechType === 'iat' && this.isVip) {
        this.$parent.$emit('startIatRecorder')
      }
      if (this.isVip) {
        bus.$emit('kidRecordingSwiperMouse', true)
      }
    },
    // 停止录音
    stopRecord () {
      clearInterval(this.timerInterval)
      this.time = 0
      Recorder.stopRecording()
      this.$refs['ise'][this.curPage - 1].stopRecord()
      if (this.xfSpeechType === 'iat') {
        this.$parent.$emit('stopIatRecorder')
      }
    },
    // 播放录音
    playRecord (flag) {
      console.log('playRecord', flag)
      let item = this.kidRecordList.filter(record => {
        return record.list_order === this.curPage
      })[0]
      if (!item) {
        let msg = '没有识别到正确录音，再录一次吧！'
        bus.$emit('show-prompt', msg)
        return
      }
      let index = this.curPage - 1
      if (flag) {
        this.recordAudio.src = item.record_sound_url
        this.recordAudio.oncanplay = () => {
          this.pauseSourceSound()
          this.recordAudio.play()
          this.$refs['ise'][index].recordPlaying()
        }
        this.recordAudio.onended = () => {
          this.$refs['ise'][index].resetPlay()
        }
      } else {
        // 暂停播放
        this.recordAudio.pause()
        this.$refs['ise'][index].resetPlay()
      }
    },
    // 开始测评录音
    startEvaluate () {
      console.log('startEvaluate')
      let _this = this
      let item = this.list[this.curPage - 1]
      let content = item.content || item.word
      // 1: 上传七牛云
      let date = new Date()
      let d = date.format('yyyy/MM/dd')
      let time = date.getTime()
      let userId = cookie.getCookie('user_id')
      let fileAudioKey = 'feed/sound/' + d + '/' + userId + '/' + time + '.wav'
      Recorder.uploadQiniuVoice(this.qiniuToken, fileAudioKey).then(data => {
        console.log('data', data)
        // 2-1: 调用讯飞测评服务
        let qiniuUrl = data.key
        if (!qiniuUrl) {
          return
        }
        this.recordUrl = process.env.QINIU_DOMAIN + qiniuUrl
        // 讯飞语音测评服务
        if (this.isVip && this.xfSpeechType === 'ise') {
          _this.xfISE({language: _this.xfLang[_this.chapterCode.split('-')[0]], text: content, url: this.recordUrl}).then(res => {
            console.log(res)
            if (res.code === '0') {
              if (JSON.parse(res.data.read_sentence.rec_paper.read_chapter.is_rejected)) {
                this.$refs['scoreResult'].setScoreResult('noRecord')
                this.$refs['ise'][this.curPage - 1].noResultAlert()
                setTimeout(() => {
                  bus.$emit('kidRecordingSwiperMouse', false)
                }, 300)
                return
              }
              let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
              if (!xfISEResult) {
                xfISEResult = []
              }
              let sentenceScore = res.data.read_sentence.rec_paper.read_chapter.total_score
              if (!Array.isArray(res.data.read_sentence.rec_paper.read_chapter.sentence) && !Array.isArray(res.data.read_sentence.rec_paper.read_chapter.sentence.word)) {
                sentenceScore = res.data.read_sentence.rec_paper.read_chapter.sentence.word.total_score
              }
              let formObj = {
                form_code: this.formCode,
                sentence: item.content || item.word,
                score: Math.round(parseFloat(sentenceScore)),
                record_url: this.recordUrl
              }
              let words = xfSentence.getWords(res.data.read_sentence.rec_paper.read_chapter.sentence)
              formObj['words_score'] = words
              console.log('fromObj', formObj)
              // let formIndex = xfISEResult.findIndex(item => {
              //   return item.form_code === this.formCode
              // })
              let result = []
              for (let i = 0; i < xfISEResult.length; i++) {
                if (xfISEResult[i].form_code !== this.formCode) {
                  result.push(xfISEResult[i])
                }
              }
              result.push(formObj)
              // if (formIndex === -1) {
              //   xfISEResult.push(formObj)
              // } else {
              //   xfISEResult.splice(formIndex, 1, formObj)
              // }
              localStorage.setItem('xfISEResult', JSON.stringify(result))
              this.getAvarageScore()
              this.$refs['scoreResult'].setScoreResult(formObj.score)
              this.iseResultSet()
              this.$refs['ise'][this.curPage - 1].evaluateFinished()
              if (this.list.length === this.curPage) {
                this.xfISEUpload({forms: localStorage.getItem('xfISEResult')})
              }
            }
            // 2-2: 保存录音到后台
            this.saveRecord(qiniuUrl)
          })
        } else {
          // 2-2: 保存录音到后台
          this.saveRecord(qiniuUrl)
        }
      })
    },
    saveRecord (qiniuUrl) {
      // 2-2: 保存录音到后台
      let courseCode = this.chapterCode.split('-').slice(0, 2).join('-')
      let item = this.list[this.curPage - 1]
      Recorder.getTime((duration) => {
        // 请求后端接口
        let params = {
          sound_url: qiniuUrl,
          sound_time: Math.round(duration),
          course_code: courseCode,
          code: item.code,
          teacher_module: this.type
        }
        console.log(params)
        this.getKidRecordSave(params).then(res => {
          console.log('res', res)
          // 返回成功之后再处理 返回失败具体提示
          if (res.success) {
            this.getKidRecordList({chapter_code: this.chapterCode, teacher_module: this.type})
            if (!(this.isVip && this.xfSpeechState)) {
              this.recordAnimate()
              this.$refs['ise'][this.curPage - 1].reset()
            }
          }
        })
      })
    },
    // 点击最后的出现评测的弹框
    goGradeBox () {
      this.$refs.gradeBox.showGradeBox(this.list)
    },
    goWordListBox () {
      console.log(this.iseWords)
      if (this.isVip && this.iseWords.length === 0) {
        this.tip = '当前没有评测结果，请重新录音哦！'
        this.$refs['tipbox'].$emit('tipbox-show')
        return false
      }
      this.$refs.WordListBox.showWordListBox(this.iseWords)
    },
    // 录音保存后，动画效果
    recordAnimate () {
      this.$parent.$emit('recordAnimate')
      if (this.xfSpeechType === 'ise') {
        setTimeout(() => {
          let isShowKidGuide3 = localStorage.getItem('isShowKidGuide3')
          if (isShowKidGuide3 !== '1' && this.curPage === this.totalPage) {
            bus.$emit('kidGuideShow3', $('#score-report'))
            localStorage.setItem('isShowKidGuide3', '1')
          }
        }, 1500)
      }
    },
    // 评测结果处理
    iseResultSet () {
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      this.iseWords = []
      if (xfISEResult && xfISEResult.length > 0) {
        let formObj = xfISEResult.find(item => {
          return item.form_code === this.formCode
        })
        if (!formObj) {
          return false
        }
        this.$refs['ise'][this.curPage - 1].setScore(formObj.score)
        this.iseWords = formObj.words_score
        console.log('iseWords' + this.iseWords)
        $('.current-swiper .swiper-slide-active').find('.content p').data('isevaluate', '1')
        $('.current-swiper .swiper-slide-active').find('.content p span').removeClass('right')
        $('.current-swiper .swiper-slide-active').find('.content p span').removeClass('wrong')

        this.iseWords.forEach((word, index) => {
          let score = parseInt(word.score)
          switch (true) {
            case score >= 80:
              $('.swiper-slide-active').find('.content p span:nth-child(' + (index + 1) + ')').addClass('right')
              break
            case score < 60:
              $('.swiper-slide-active').find('.content p span:nth-child(' + (index + 1) + ')').addClass('wrong')
              break
            default:
              break
          }
        })

        let isShowKidGuide = localStorage.getItem('isShowKidGuide')
        if (isShowKidGuide !== '1' && this.isVip) {
          setTimeout(() => {
            bus.$emit('kidGuideShow', $('.current-swiper .swiper-slide-active .content').find('p'))
            bus.$emit('kidRecordingSwiperMouse', false)
          }, 3500)
        }
      }
    },
    showWordPanel (event, index) {
      let isEvaluate = $('.swiper-slide-active').find('.content p').data('isevaluate')
      if (isEvaluate !== '1') {
        return
      }
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      this.iseWords = []
      if (xfISEResult && xfISEResult.length > 0) {
        let formObj = xfISEResult.find(item => {
          return item.form_code === this.formCode
        })
        if (!formObj) {
          return false
        }
        this.iseWords = formObj.words_score
      }
      if (this.iseWords.length > 0 && this.iseWords[index]) {
        let offset = $(event.target).offset()
        let word = this.iseWords[index]
        this.$parent.$emit('showWordPanel', {word: word, offset: offset})
      }
    },
    // 设置语音识别结果
    setResultOut (resultOut) {
      this.$nextTick(() => {
        $('.current-swiper .swiper-slide-active').find('.result-out').text(resultOut)
        if (resultOut === '') {
          $('.swiper-slide-active').find('.content p span').removeClass('right')
          $('.swiper-slide-active').find('.content p span').removeClass('wrong')
        }
        // 文本匹配
        $('.current-swiper .swiper-slide-active').find('.content p span').removeClass('right')
        $('.current-swiper .swiper-slide-active').find('.content p span').removeClass('wrong')
        let content = $('.current-swiper .swiper-slide-active').find('.content p').data('content')
        let arr1 = content.toLowerCase()
          .replace(new RegExp(/\?/, 'g'), ' ')
          .replace(new RegExp(',', 'g'), ' ')
          .replace(new RegExp(/\./, 'g'), ' ')
          .replace(new RegExp('-', 'g'), ' ')
          .replace(new RegExp('!', 'g'), ' ')
          .replace(new RegExp('“', 'g'), ' ')
          .replace(new RegExp('”', 'g'), ' ')
          .replace(new RegExp('"', 'g'), ' ')
          .replace(new RegExp(':', 'g'), ' ')
          .replace(new RegExp('《', 'g'), ' ')
          .replace(new RegExp('》', 'g'), ' ')
          .trim(' ').split(' ')
        this.contentArr = []
        for (let i = 0; i < arr1.length; i++) {
          let item = arr1[i].trim().replace(new RegExp('—', 'g'), '').trim()
          if (item.length > 0) {
            this.contentArr.push(item)
          }
        }
        console.log('resultOut', resultOut)
        console.log('content', this.contentArr)
        let arr = resultOut.toLowerCase().replace(new RegExp(/\?/, 'g'), ' ').replace(new RegExp(',', 'g'), ' ').replace(new RegExp(/\./, 'g'), ' ').replace(new RegExp('\'', 'g'), '’').replace(new RegExp('!', 'g'), '').split(' ')
        let result = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].trim().length > 0) {
            result.push(arr[i].trim())
          }
        }
        // for (let j = 0; j < result.length; j++) {
        //   if (result[j] === this.contentArr[j]) {
        //     $('.current-swiper .swiper-slide-active').find('.content p span:nth-child(' + (j + 1) + ')').addClass('right')
        //   } else {
        //     $('.current-swiper .swiper-slide-active').find('.content p span:nth-child(' + (j + 1) + ')').addClass('wrong')
        //   }
        // }
        if (result.length === 0) {
          return false
        }
        let spanArr = $('.current-swiper .swiper-slide-active').find('.content p span')
        for (let s = 0; s < spanArr.length; s++) {
          let span = spanArr[s]
          let content1 = $(span).data('content')
          if (content1 === '—') {
            continue
          }
          content1 = content1
            .toLowerCase()
            .replace(new RegExp(/\?/, 'g'), '')
            .replace(new RegExp(',', 'g'), '')
            .replace(new RegExp(/\./, 'g'), '')
            .replace(new RegExp('-', 'g'), '')
            .replace(new RegExp('—', 'g'), '')
            .replace(new RegExp('!', 'g'), '')
            .replace(new RegExp('《', 'g'), '')
            .replace(new RegExp('》', 'g'), '')
            .replace(new RegExp('“', 'g'), '')
            .replace(new RegExp('”', 'g'), '')
            .replace(new RegExp('"', 'g'), '')
            .replace(new RegExp(':', 'g'), '')
            .replace(new RegExp('<br/>', 'g'), '')
            .replace(new RegExp('¡', 'g'), '')
            .replace(new RegExp('¿', 'g'), '')
            .replace(new RegExp('\'', 'g'), '’')
          let findIndex = result.findIndex(r => {
            return r === content1
          })
          console.log(content1, findIndex, result)
          if (!result[s] && findIndex === -1) {
            continue
          }
          if (findIndex > -1) {
            $(span).addClass('right')
          } else {
            $(span).addClass('wrong')
          }
        }
      })
    },
    getAvarageScore () {
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      if (!xfISEResult || xfISEResult.length === 0) {
        return
      }
      let sumScore = 0
      let count = 0
      xfISEResult.forEach(item => {
        if (item.form_code.indexOf(this.chapterCode + '-' + this.type.charAt(0).toUpperCase() + this.type.slice(1) + '-') > -1) {
          sumScore += item.score
          count++
        }
      })
      let avaScore = Math.round(sumScore * 1.0 / count)
      console.log(avaScore)
      // this.$refs['lastGradeBox'].setAvarageScore(avaScore)
    },
    iatFinished () {
      this.$refs['ise'][this.curPage - 1].evaluateFinished()
      // this.$refs['scoreResult'].setScoreResult('iatPerfect')
      // this.$refs['scoreResult'].setScoreResult('iatNice')
      // let total = $('.current-swiper .swiper-slide-active').find('.content p span').length
      let total = this.contentArr.length
      let right = $('.current-swiper .swiper-slide-active').find('.content p span.right').length
      let wrong = $('.current-swiper .swiper-slide-active').find('.content p span.wrong').length
      console.log(total)
      console.log(right)
      console.log(wrong)
      console.log(Math.round((right * 1.0 / total).toFixed(2) * 100))
      let scoreRate = Math.round((right * 1.0 / total).toFixed(2) * 100)
      let score = 0
      let scoreDesc = ''
      _.forIn(this.xfIATScoreRange, (valArr, key) => {
        let arr = key.split('-')
        let start = parseInt(arr[0])
        let end = parseInt(arr[1])
        if (scoreRate >= start && scoreRate <= end) {
          let sVal = parseInt(valArr[0].split('-')[0])
          let eVal = parseInt(valArr[0].split('-')[1])
          score = utils.getRndInteger(sVal, eVal)
          scoreDesc = valArr[3]
        }
      })
      console.log(score)
      console.log(scoreDesc)
      if (right === 0) {
        score = 0
      }
      if (scoreRate === 0 && right === 0 && wrong === 0) {
        score = 'noRecord'
      }
      console.log(score)
      let resultOut = $('.current-swiper .swiper-slide-active').find('.result-out').text()
      if (resultOut) {
        this.$refs['ise'][this.curPage - 1].setScore(score)
        this.setIatSentenceResult(score)
      }
      this.$refs['scoreResult'].setScoreResult(score)
      this.stopRecord()
      setTimeout(() => {
        bus.$emit('kidRecordingSwiperMouse', false)
      }, 200)
    },
    reset (preIndex) {
      this.$parent.$emit('hideWordPanel')
      Recorder.stopRecording()
      clearInterval(this.timerInterval)
      this.time = 0
      this.isPlay = false
      $('.current-swiper .swiper-slide-active').find('.content i').removeClass('playing')
      this.$refs['ise'][preIndex].reset()
      if (this.xfSpeechType === 'iat') {
        this.$parent.$emit('reset')
      }
    },
    // 存储语音识别结果
    setIatSentenceResult (score) {
      let xfIATResult = JSON.parse(localStorage.getItem('xfIATResult'))
      if (!xfIATResult) {
        xfIATResult = []
      }
      let originSentence = $('.current-swiper .swiper-slide-active').find('.content p').html()
      let resultSentence = $('.current-swiper .swiper-slide-active').find('.result-out').text()
      let formObj = {
        form_code: this.formCode,
        originSentence: originSentence,
        resultSentence: resultSentence,
        score: score,
        recordUrl: this.recordUrl
      }
      console.log('fromObj', formObj)
      let formIndex = xfIATResult.findIndex(item => {
        return item.form_code === this.formCode
      })
      if (formIndex === -1) {
        xfIATResult.push(formObj)
      } else {
        xfIATResult.splice(formIndex, 1, formObj)
      }
      localStorage.setItem('xfIATResult', JSON.stringify(xfIATResult))
    }
  }
}
</script>

<style lang="less" scoped>
.swiper {
  width:100%;
  max-width: 1200px;
  margin:0 auto;
  position:relative;
}
.current-swiper {
  // width:668px;
  height:580px;
  // border-radius:10px;
  margin:0 auto;
  position:relative;
  .picture {
    width: 100%;
    height: 270px;
    object-fit: cover;
    border-radius: 10px 10px 0 0;
  }
  .content {
    position: relative;
    display: inline-flex;
    padding-top: 16px;
    padding-left: 16px;
    font-size: 20px;
    font-weight: 600;
    color: #3C5B6F;
    p {
      margin-left: 30px;
      span {
        cursor: pointer;
      }
    }
  }
  i {
    display: inline-block;
    width: 20px;
    height: 17px;
    margin: 6px 16px 0 0;
    background-image: url('../../../../../static/images/kid/icon-laba.png');
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    position: absolute;
  }
  .playing {
    background-image: url('../../../../../static/images/kid/icon-laba.gif');
  }
  .swiper-slide {
    width:668px;
    height:480px;
    background: #fff;
    border-radius:10px;
    box-shadow: 0 8px 30px #ddd;
    box-shadow:0px 3px 10px 0px rgba(196,208,213,0.1);
    position: relative;
    .slide-content {
      width: 100%;
      min-height: 200px;
      position: absolute;
      bottom: 0;
      background: #fff;
      border-radius:0 0 10px 10px;
      padding-bottom: 30px;
    }
  }
}

.swiper-wrapper {
  align-items: center;
}

.swiper-slide-active {
  box-shadow: 0px 27px 80px -42px rgba(0,0,0,0.14) !important;
}

.swiper-page-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  p {
    width: 90px;
    height: 45px;
    line-height: 45px;
    background: #ECF0F2;
    border-radius: 23px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #B9BFC3;
  }
  .mouse-text {
    display: flex;
    align-items: center;
    position: absolute;
    left: 22%;
    bottom: 10px;
    span {
      font-size:14px;
      font-weight:500;
      color:rgba(74,74,74,1);
      line-height: 30px;
    }
    i {
      display: inline-block;
      width: 20px;
      height: 30px;
      background: url('../../../../../static/images/kidcontent/icon-mouse-img.png') no-repeat center;
      background-size: cover;
    }
  }
}

.swiper-slide-prev .shade,
.swiper-slide-next .shade {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, .5);
  top: 0;
  z-index: 2;
}

.result-out {
  min-height: 22px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 400;
  color: #BEBEBE;
  line-height: 22px;
  text-align: center;
  margin-top: 8px;
}
@media (max-height: 610px){
  .current-swiper {
    height:450px;
    margin:0 auto;
    position:relative;
    .picture {
      width: 100%;
      height: 200px;
    }
    .swiper-slide {
      height:400px;
    }
  }
  .swiper-page-container {
    margin-top: 0;
  }
}
@media (max-width: 1300px) {
  .current-swiper {
    height: auto;
    padding-bottom: 40px;
    .swiper-slide {
      // height: auto;
      padding-bottom: 30px;
    }
    .swiper-slide-active {
      box-shadow: 0px 17px 80px -42px rgba(0,0,0,0.14) !important;
    }
  }
}
@media (max-height: 750px) {
  .current-swiper {
    height: auto;
    padding-bottom: 40px;
    .swiper-slide {
      // height: auto;
      padding-bottom: 30px;
    }
    .swiper-slide-active {
      box-shadow: 0px 17px 80px -42px rgba(0,0,0,0.14) !important;
    }
  }
}
</style>
