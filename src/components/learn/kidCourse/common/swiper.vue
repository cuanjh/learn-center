<template>
  <div class="swiper" id="certify">
    <div class="current-swiper swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
          v-for="(item, index) in list"
          :key="'current-swiper-' + item.code"
          :id="chapterCode + '-' + item.code">
          <img class="picture" :src="item.image | urlFix('imageView2/0/w/2001/h/900/format/jpg')" alt="">
          <div class="content">
            <i @click="playSourceSound(index)"></i>
            <p :data-content="item.content || item.word" data-step="1">
              <span v-for="(content, index) in item.formatContent" :key="index" v-html="content.indexOf('-') > -1 ? content : ' ' + content" @click="showWordPanel($event, index)"></span>
            </p>
          </div>
          <div class="result-out"></div>
          <ise-area
            ref="ise"
            :isEvaluation="true"
            :formCode="chapterCode + '-' + type.charAt(0).toUpperCase() + type.slice(1) + '-' + (index + 1)"
            @startRecord="startRecord"
            @stopRecord="stopRecord"
            @playRecord="playRecord"
            @startEvaluate="startEvaluate"
            @goWordListBox="goWordListBox"
          />
          <div class="shade"></div>
        </div>
      </div>
      <!-- 提示刚刚充了会员 -->
      <div class="prompt-box" v-show="isPromptBox">
        <div>
          <span class="content">刚刚开通会员权益，快去再录一次吧！</span>
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
  </div>
</template>

<script>
import $ from 'jquery'
import Swiper from 'swiper'
import { mapActions, mapState, mapMutations } from 'vuex'
import IseArea from './iseArea.vue'
import Recorder from '../../../../plugins/recorder'
import cookie from '../../../../tool/cookie'
// import bus from '../../../../bus'
import GradeBox from './gradeBox.vue'
import EvaluatingBox from './evaluatingBox.vue'
import WordListBox from './wordListBox.vue'
import LastGradeBox from './lastGradeBox.vue'
import ScoreResultBox from './scoreResultBox.vue'
import NoVipGuideBox from './noVipGuideBox.vue'
import Tipbox from './tipbox.vue'
import bus from '../../../../bus'

export default {
  props: ['chapterCode', 'type'],
  data () {
    return {
      list: [],
      totalPage: 0,
      curPage: 1,
      audio: new Audio(),
      recordAudio: new Audio(),
      isPlay: false,
      isPromptBox: false,
      isShowMose: true,
      qiniuToken: '',
      iseWords: [],
      repeatIndex: -1,
      timerInterval: null, // 录音间隔器
      time: 0, // 录音计时
      tip: ''
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
    Tipbox
  },
  created () {
    bus.$on('thisAudioPause', () => {
      this.audio.pause()
      $('.current-swiper .swiper-slide-active').find('.content i').removeClass('playing')
      this.isPlay = false
    })
    bus.$on('upUserVip', () => {
      this.isPromptBox = true
      setTimeout(() => {
        this.isPromptBox = false
      }, 3000)
    })
    this.$on('showTip', () => {
      this.tip = this.tips.micphone
      this.$refs['tipbox'].$emit('tipbox-show')
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
    // 获取课程数据
    this.initData()
  },
  mounted () {
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
      xfSyllPhone: state => state.xfSyllPhone,
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
      this.getKidCourseContent({chapter_code: this.chapterCode}).then(res => {
        console.log(res)
        let data = []
        switch (this.type) {
          case 'draw':
            data = res.teacherContent.draw_contents
            break
          default:
            data = res.teacherContent.words
            break
        }
        this.list = []
        data.forEach(item => {
          let obj = item
          obj['formatContent'] = this.formatContent(obj.content || obj.word)
          this.preload(item.sound)
          this.preload(item.image)
          this.list.push(obj)
        })
        console.log(this.list)
        console.log('=========', data)
        this.totalPage = this.list.length
        // if (this.xfSpeechType === 'ise') {
        //   this.totalPage = this.list.length + 1
        // }
        this.curPage = 1
        this.setProgress()
        setTimeout(() => {
          this.initSwiper()
        }, 10)
      })
    },
    // 获取数据后，初始化swiper
    initSwiper () {
      var swiper1 = new Swiper('.current-swiper', {
        watchSlidesProgress: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: false,
        mousewheel: true,
        // mousewheel: {
        //   eventsTarged: '.kid-stage-container'
        // },
        loop: false,
        allowTouchMove: false,
        preventClicksPropagation: true,
        slideToClickedSlide: true,
        on: {
          init: () => {
            if (this.xfSpeechType === 'ise') {
              this.iseResultSet()
            }
            this.playSourceSound(this.curPage - 1)
          },
          slideChange: () => {
            console.log(this.curPage, this.totalPage, swiper1.progress)
            console.log('改变了，activeIndex为' + swiper1.activeIndex)
            this.repeatIndex = -1
            this.$parent.$emit('hideWordPanel')
            let activeIndex = swiper1.activeIndex
            this.curPage = activeIndex + 1
            this.setProgress()
            this.isPlay = false
            $('.current-swiper .swiper-slide-active').find('.content i').removeClass('playing')
            this.playSourceSound(activeIndex)
            if (this.xfSpeechType === 'ise') {
              setTimeout(() => {
                this.iseResultSet()
              }, 100)
            }
            if (this.list.length === this.curPage) {
              let activityCode = this.chapterCode + '-' + this.type.charAt(0).toUpperCase() + this.type.slice(1)
              this.setPartComplete({part_code: activityCode})
            }
            console.log('curPage' + this.curPage)
          },
          reachEnd: () => {
            bus.$emit('thisAudioPause')
            bus.$emit('setIsShowIseReport', true)
          },
          progress: function (progress) {
            for (let i = 0; i < this.slides.length; i++) {
              let slide = this.slides.eq(i)
              let slideProgress = this.slides[i].progress
              console.log('slideProgress', slideProgress)
              let translate = slideProgress * 290 + 'px'
              console.log(translate)
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
      console.log(swiper1)
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
      let arr = content.replace(new RegExp('\\n', 'g'), '<br/>').replace(new RegExp('—', 'g'), ' ').split(' ')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].trim().length > 0) {
          if (arr[i].indexOf('<br/>') > -1) {
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
                let tag = ''
                if (j === 0) {
                  tag = '?'
                }
                result.push(r[j].trim() + tag)
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
      if (!this.isPlay) {
        let item = this.list[index]
        this.audio.src = item.sound
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
      if (this.xfSpeechType === 'iat') {
        this.$parent.$emit('startIatRecorder')
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
      let item = this.kidRecordList[this.curPage - 1]
      if (!item) return
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
        let url = process.env.QINIU_DOMAIN + qiniuUrl
        // 讯飞语音测评服务
        if (this.isVip && this.xfSpeechType === 'ise') {
          _this.xfISE({language: _this.xfLang[_this.chapterCode.split('-')[0]], text: content, url: url}).then(res => {
            console.log(res)
            if (res.code === '0') {
              if (JSON.parse(res.data.read_sentence.rec_paper.read_chapter.is_rejected)) {
                this.$refs['scoreResult'].setScoreResult('tryAgain')
                this.$refs['ise'][this.curPage - 1].noResultAlert()
                return
              }
              let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
              if (!xfISEResult) {
                xfISEResult = []
              }
              let formObj = {
                form_code: this.formCode,
                sentence: item.content || item.word,
                score: Math.round(parseFloat(res.data.read_sentence.rec_paper.read_chapter.total_score)),
                record_url: url
              }
              let words = this.getWords(res.data.read_sentence.rec_paper.read_chapter.sentence)
              formObj['words_score'] = words
              console.log('fromObj', formObj)
              let formIndex = xfISEResult.findIndex(item => {
                return item.form_code === this.formCode
              })
              if (formIndex === -1) {
                xfISEResult.push(formObj)
              } else {
                xfISEResult.splice(formIndex, 1, formObj)
              }
              localStorage.setItem('xfISEResult', JSON.stringify(xfISEResult))
              this.getAvarageScore()
              this.$refs['scoreResult'].setScoreResult(formObj.score)
              this.iseResultSet()
              this.$refs['ise'][this.curPage - 1].evaluateFinished()
              if (this.list.length === this.curPage) {
                this.xfISEUpload({forms: localStorage.getItem('xfISEResult')})
              }
            }
          })
        }
        // 2-2: 保存录音到后台
        let courseCode = this.chapterCode.split('-').slice(0, 2).join('-')
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
              this.recordAnimate()
            }
          })
        })
      })
    },
    // 点击最后的出现评测的弹框
    goGradeBox () {
      this.$refs.gradeBox.showGradeBox(this.list)
    },
    goWordListBox () {
      console.log(this.iseWords)
      if (!this.isVip) {
        bus.$emit('showNoVipModal')
        return false
      }
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
        $('.swiper-slide-active').find('.content p span').removeClass('right')
        $('.swiper-slide-active').find('.content p span').removeClass('wrong')

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
            localStorage.setItem('isShowKidGuide', '1')
          }, 3500)
        }
      }
    },
    showWordPanel (event, index) {
      if (this.iseWords.length > 0 && this.iseWords[index]) {
        let offset = $(event.target).offset()
        let word = this.iseWords[index]
        if (this.repeatIndex !== index) {
          this.$parent.$emit('hideWordPanel')
          this.$parent.$emit('showWordPanel', {word: word, offset: offset})
          this.repeatIndex = index
        } else {
          this.$parent.$emit('hideWordPanel')
          this.repeatIndex = -1
        }
      }
    },
    // 设置语音识别结果
    setResultOut (resultOut) {
      this.$nextTick(() => {
        $('.current-swiper .swiper-slide-active').find('.result-out').text(resultOut)
        if (resultOut === '') {
          $('.swiper-slide').find('.content p span').removeClass('right')
          $('.swiper-slide').find('.content p span').removeClass('wrong')
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
          .trim(' ').split(' ')
        let contentArr = []
        for (let i = 0; i < arr1.length; i++) {
          let item = arr1[i].trim().replace(new RegExp('—', 'g'), '').trim()
          if (item.length > 0) {
            contentArr.push(item)
          }
        }
        console.log('resultOut', resultOut)
        console.log('content', contentArr)
        let arr = resultOut.toLowerCase().replace(new RegExp(/\?/, 'g'), ' ').replace(new RegExp(',', 'g'), ' ').replace(new RegExp(/\./, 'g'), ' ').replace(new RegExp('\'', 'g'), '’').split(' ')
        let result = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].trim().length > 0) {
            result.push(arr[i].trim())
          }
        }
        for (let j = 0; j < result.length; j++) {
          if (result[j] === contentArr[j]) {
            $('.current-swiper .swiper-slide-active').find('.content p span:nth-child(' + (j + 1) + ')').addClass('right')
          } else {
            $('.current-swiper .swiper-slide-active').find('.content p span:nth-child(' + (j + 1) + ')').addClass('wrong')
          }
        }
      })
    },
    // 获取句子中所有的单词
    getWords (sentence) {
      let words = []
      if (Array.isArray(sentence)) {
        sentence.forEach(sentence => {
          sentence.word.forEach(word => {
            if (word.content !== 'sil' && word.content !== 'fil') {
              let w = {}
              w['word'] = word.content
              w['score'] = word.total_score
              w['phonemes'] = this.getPhones(word.syll)
              w['phonetic_symbol'] = this.getSylls(this.getPhones(word.syll))
              words.push(w)
            }
          })
        })
      } else {
        if (Array.isArray(sentence.word)) {
          sentence.word.forEach(word => {
            if (word.content !== 'sil' && word.content !== 'fil') {
              let w = {}
              w['word'] = word.content
              w['score'] = Math.round(parseFloat(word.total_score))
              w['phonemes'] = this.getPhones(word.syll)
              w['phonetic_symbol'] = this.getSylls(this.getPhones(word.syll))
              words.push(w)
            }
          })
        } else {
          let w = {}
          w['word'] = sentence.word.content
          w['score'] = Math.round(parseFloat(sentence.word.total_score))
          w['phonemes'] = this.getPhones(sentence.word.syll)
          w['phonetic_symbol'] = this.getSylls(this.getPhones(sentence.word.syll))
          words.push(w)
        }
      }
      return words
    },
    // 获取所有的音素
    getPhones (syll) {
      let phones = []
      if (Array.isArray(syll)) {
        syll.forEach(item => {
          if (Array.isArray(item.phone)) {
            item.phone.forEach(p => {
              let pObj = {}
              pObj['phoneme'] = '[' + this.xfSyllPhone[p.content] + ']'
              pObj['state'] = parseInt(p.dp_message)
              phones.push(pObj)
            })
          } else {
            let pObj = {}
            pObj['phoneme'] = '[' + this.xfSyllPhone[item.content] + ']'
            pObj['state'] = parseInt(item.dp_message)
            phones.push(pObj)
          }
        })
      } else {
        if (syll) {
          if (Array.isArray(syll.phone)) {
            syll.phone.forEach(item => {
              let pObj = {}
              pObj['phoneme'] = '[' + this.xfSyllPhone[item.content] + ']'
              pObj['state'] = parseInt(item.dp_message)
              phones.push(pObj)
            })
          } else {
            let pObj = {}
            pObj['phoneme'] = '[' + this.xfSyllPhone[syll.phone.content] + ']'
            pObj['state'] = parseInt(syll.phone.dp_message)
            phones.push(pObj)
          }
        }
      }
      return phones
    },
    // 获取单词发音
    getSylls (phones) {
      if (phones) {
        let syll = '['
        phones.forEach(p => {
          syll += p.phoneme.replace('[', '').replace(']', '')
        })
        syll += ']'
        return syll
      }
    },
    getAvarageScore () {
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      if (xfISEResult.length === 0) {
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
  height:500px;
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
    display: inline-flex;
    padding-top: 16px;
    padding-left: 16px;
    font-size: 20px;
    font-weight: 600;
    color: #3C5B6F;
    p {
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
  }
  .prompt-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    div {
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      display: flex;
    }
    .content {
      font-size:16px;
      font-weight:400;
      color:rgba(255,255,255,1);
      background: rgba(0, 0, 0, 74);
      line-height:22px;
      padding: 10px 16px;
      border-radius: 4px;
    }
  }
}

.swiper-wrapper {
  align-items: center;
}

.swiper-slide-active {
  box-shadow: 0px 3px 10px 0px rgba(196,208,213,0.1) !important;
}

.swiper-page-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
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
  height: 22px;
  font-size: 16px;
  font-weight: 400;
  color: #BEBEBE;
  line-height: 22px;
  text-align: center;
  margin-top: 8px;
}
</style>
