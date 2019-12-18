<template>
  <div :class="['form', form.form_show_type]">
    <div class="img-wrap">
      <next-comp @next="next"/>
      <img :src="form.image" alt="">
      <transition name="fade" mode="out-in">
        <record-comp ref="recordItem" @afterPostQiniu="afterPostQiniu" v-show="isShow" :sentence="form.sentence" :code="form.code"/>
      </transition>
    </div>
    <div class="content">
      <p class="text" :data-content="form.sentence">
        <span v-for="(w, index) in formatSentence" :data-content="w" :key="index" v-html="(langCode == 'CHI' || langCode == 'JPN' || langCode == 'KOR') ? w : (w === '.' ? w : ' ' + w)" @click="showWordPanel($event, index)"></span>
      </p>
      <trumpet-comp ref="trumpet" :sound="form.sound" />
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
import TrumpetComp from '../common/trumpet'
import RecordComp from '../common/record'
import nextComp from '../common/next'
import bus from '../../../bus'
import ASR from '../../../plugins/xf_asr'
import { mapMutations, mapState } from 'vuex'
import utils from '../../../plugins/utils'

export default {
  props: ['form'],
  data () {
    return {
      isShow: false,
      formatSentence: [],
      iseWords: [],
      iatRecorder: null,
      isIatFinished: false,
      counterDownTime: 0,
      counterDownTimeout: null,
      score: 0,
      contentArr: [],
      resultText: '',
      resultOut: '',
      recordUrl: ''
    }
  },
  components: {
    TrumpetComp,
    RecordComp,
    nextComp
  },
  created () {
    this.$on('break', () => {
      this.reset()
      this.$refs['trumpet'].$emit('break')
    })

    this.$on('init', () => {
      console.log('repeatSpeak init')
      bus.$emit('setStudyFormScore', {formCode: this.form.code, score: 1})
      this.updatexfSpeechState(true)
      this.initIatRecorder()
      this.$refs['trumpet'].$emit('init', false, () => {
        this.isShow = true
      })
      this.$refs['recordItem'].closeRecord()
      this.formatSentence = this.formatContent(this.form.sentence)
    })

    this.$on('iseResultSet', () => {
      this.iseResultSet()
    })

    // 开始语音识别
    this.$on('startIatRecorder', () => {
      // $('#result_output').text('')
      this.start()
    })
    // 停止语音识别
    this.$on('stopIatRecorder', () => {
      this.stop()
      this.isIatFinished = true
    })
    this.$on('showIatSentenceBox', () => {
      let originSentence = $('#pro-swiper .swiper-slide-active').find('.content p').html()
      let resultSentence = this.resultOut
      bus.$emit('showIatSentenceBox', {originSentence, resultSentence})
    })
  },
  mounted () {
    console.log('form-code', this.form)
  },
  computed: {
    ...mapState({
      xfSpeechState: state => state.xfSpeechState,
      xfIatlangObj: state => state.xfIatlangObj,
      xfIATScoreRange: state => state.xfIATScoreRange
    }),
    langCode () {
      return this.form.code.split('-')[0]
    }
  },
  methods: {
    ...mapMutations([
      'updatexfSpeechState'
    ]),
    reset () {
      this.$refs['recordItem'].reset()
      this.isShow = false
      this.formatSentence = []
      setTimeout(() => {
        this.formatSentence = this.formatContent(this.form.sentence)
      }, 10)
    },
    next () {
      this.$parent.$emit('nextForm')
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
        if (this.langCode === 'CHI' || this.langCode === 'JPN' || this.langCode === 'KOR') {
          arr = arrBR[m].split('')
        }
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
          result.push('<br/>')
        }
      }
      return result
    },
    // 评测结果处理
    iseResultSet () {
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      this.iseWords = []
      if (xfISEResult && xfISEResult.length > 0) {
        let formObj = xfISEResult.find(item => {
          return item.form_code === this.form.code
        })
        if (!formObj) {
          return false
        }
        this.iseWords = formObj.words_score
        $('#pro-swiper .swiper-slide-active').find('.content p').data('isevaluate', '1')
        $('#pro-swiper .swiper-slide-active').find('.content p span').removeClass('right')
        $('#pro-swiper .swiper-slide-active').find('.content p span').removeClass('wrong')

        this.iseWords.forEach((word, index) => {
          let score = parseInt(word.score)
          switch (true) {
            case score >= 80:
              $('#pro-swiper .swiper-slide-active').find('.content p span:nth-child(' + (index + 1) + ')').addClass('right')
              break
            case score < 60:
              $('#pro-swiper .swiper-slide-active').find('.content p span:nth-child(' + (index + 1) + ')').addClass('wrong')
              break
            default:
              break
          }
        })
      }
    },
    showWordPanel (event, index) {
      let isEvaluate = $('.swiper-slide-active').find('.content p').data('isevaluate')
      if (isEvaluate !== '1') {
        return
      }
      if (this.iseWords.length > 0 && this.iseWords[index]) {
        let offset = $(event.target).offset()
        let word = this.iseWords[index]
        bus.$emit('showWordPanel', {word: word, offset: offset})
      }
    },
    initIatRecorder () {
      let arr = this.form.code.split('-')
      let language = this.xfIatlangObj[arr[0]]
      // 语音识别小语种配置
      let url = 'wss://iat-niche-api.xfyun.cn/v2/iat'
      let host = 'iat-niche-api.xfyun.cn'
      if (arr[0] === 'ENG' || arr[0] === 'CHI') {
        url = 'wss://iat-api.xfyun.cn/v2/iat'
        host = 'iat-api.xfyun.cn'
      }

      this.iatRecorder = new ASR.IatRecorder({
        language: language,
        host: host,
        url: url,
        onClose: () => {
          this.stop()
          this.resetIAT()
          this.iatFinished()
        },
        onError: (data) => {
          this.stop()
          this.resetIAT()
          alert('WebSocket连接失败')
        },
        onMessage: (e) => {
          let jsonData = JSON.parse(e.data)
          if (jsonData.data && jsonData.data.result) {
            console.log('onMessage result', jsonData.data.result)
            this.setResult(jsonData.data.result)
          } else {
            this.updatexfSpeechState(false)
            this.tip = '今日语音识别服务量已用完！请明天再试哦！'
            bus.$emit('show-prompt', this.tip)
          }
        },
        onStart: () => {
          this.setResultOut('')
          this.counterDown()
        }
      })
    },
    start () {
      if (!this.xfSpeechState) {
        return false
      }
      this.resultOut = ''
      this.resultText = ''
      this.iatRecorder.start()
    },
    stop () {
      this.iatRecorder.stop()
    },
    resetIAT () {
      this.counterDownTime = 0
      clearTimeout(this.counterDownTimeout)
      this.iatRecorder.reset()
    },
    setResult (data) {
      var str = ''
      let resultStr = ''
      let ws = data.ws
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w
      }
      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs === 'apd') {
        this.resultText = this.resultOut
      }
      resultStr = this.resultText + str
      if (resultStr.trim()) {
        this.resultOut = resultStr
        this.setResultOut(resultStr)
      }
      console.log(this.resultOut)
    },
    counterDown () {
      if (this.counterDownTime === 60) {
        this.stop()
      } else if (this.counterDownTime > 60) {
        this.reset()
        return false
      }
      this.counterDownTime++
      console.log(this.counterDownTime)
      this.counterDownTimeout = setTimeout(() => {
        this.counterDown()
      }, 1000)
    },
    // 设置语音识别结果
    setResultOut (resultOut) {
      this.$nextTick(() => {
        $('#pro-swiper .swiper-slide-active').find('.result-out').text(resultOut)
        if (resultOut === '') {
          $('.swiper-slide-active').find('.content p span').removeClass('right')
          $('.swiper-slide-active').find('.content p span').removeClass('wrong')
        }
        // 文本匹配
        $('#pro-swiper .swiper-slide-active').find('.content p span').removeClass('right')
        $('#pro-swiper .swiper-slide-active').find('.content p span').removeClass('wrong')
        let content = $('#pro-swiper .swiper-slide-active').find('.content p').data('content')
        let split = ' '
        if (this.langCode === 'CHI' || this.langCode === 'JPN' || this.langCode === 'KOR') {
          split = ''
        }
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
          .trim(' ').split(split)
        this.contentArr = []
        for (let i = 0; i < arr1.length; i++) {
          let item = arr1[i].trim().replace(new RegExp('—', 'g'), '').trim()
          if (item.length > 0) {
            this.contentArr.push(item)
          }
        }
        console.log('resultOut', resultOut)
        console.log('content', this.contentArr)
        let arr = resultOut.toLowerCase().replace(new RegExp(/\?/, 'g'), ' ').replace(new RegExp(',', 'g'), ' ').replace(new RegExp(/\./, 'g'), ' ').replace(new RegExp('\'', 'g'), '’').replace(new RegExp('!', 'g'), '').split(split)
        let result = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].trim().length > 0) {
            result.push(arr[i].trim())
          }
        }
        if (result.length === 0) {
          return false
        }
        let spanArr = $('#pro-swiper .swiper-slide-active').find('.content p span')
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
            .replace(new RegExp('à', 'g'), 'à')
            .replace(new RegExp('ộ', 'g'), 'ộ')
            .replace(new RegExp('è', 'g'), 'è')
            .replace(new RegExp('ó', 'g'), 'ó')
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
    iatFinished () {
      // this.$refs['ise'][this.curPage - 1].evaluateFinished()
      let total = this.contentArr.length
      let right = $('#pro-swiper .swiper-slide-active').find('.content p span.right').length
      let wrong = $('#pro-swiper .swiper-slide-active').find('.content p span.wrong').length
      console.log(total)
      console.log(right)
      console.log(wrong)
      console.log(Math.round((right * 1.0 / total).toFixed(2) * 100))
      let scoreRate = Math.round((right * 1.0 / total).toFixed(2) * 100)
      this.score = 0
      let scoreDesc = ''
      _.forIn(this.xfIATScoreRange, (valArr, key) => {
        let arr = key.split('-')
        let start = parseInt(arr[0])
        let end = parseInt(arr[1])
        if (scoreRate >= start && scoreRate <= end) {
          let sVal = parseInt(valArr[0].split('-')[0])
          let eVal = parseInt(valArr[0].split('-')[1])
          this.score = utils.getRndInteger(sVal, eVal)
          scoreDesc = valArr[2]
        }
      })
      if (right === 0) {
        this.score = 0
        scoreDesc = 'try again!'
      }
      if (scoreRate === 0 && right === 0 && wrong === 0) {
        this.score = ''
        scoreDesc = 'no record.'
      }
      console.log(this.score, scoreDesc)
      this.$refs['recordItem'].setScore({score: this.score, scoreDesc: scoreDesc})
      this.$refs['recordItem'].recordStop()
    },
    // 存储语音识别结果
    setIatSentenceResult () {
      let xfIATResult = JSON.parse(localStorage.getItem('xfIATResult'))
      if (!xfIATResult) {
        xfIATResult = []
      }
      let originSentence = $('#pro-swiper .swiper-slide-active').find('.content p').html()
      let resultSentence = this.resultOut
      let formObj = {
        form_code: this.form.code,
        originSentence: originSentence,
        resultSentence: resultSentence,
        score: this.score,
        recordUrl: this.recordUrl
      }
      console.log('fromObj', formObj)
      let formIndex = xfIATResult.findIndex(item => {
        return item.form_code === this.form.code
      })
      if (formIndex === -1) {
        xfIATResult.push(formObj)
      } else {
        xfIATResult.splice(formIndex, 1, formObj)
      }
      console.log(resultSentence)
      if (resultSentence) {
        localStorage.setItem('xfIATResult', JSON.stringify(xfIATResult))
      }
    },
    afterPostQiniu (url) {
      this.recordUrl = url
      this.setIatSentenceResult()
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active {
  animation: fade-in .5s;
}
.fade-leave-active {
  animation: fade-in .1s reverse;
}
@keyframes fade-in {
  0% {
    transform: translateY(0);
    -webkit-transform: translateY(0);
    -o-transform: translateY(0);
    -moz-transform: translateY(0);
  }
  100% {
    transform: translateY(-150px);
    -webkit-transform: translateY(-150px);
    -o-transform: translateY(-150px);
    -moz-transform: translateY(-150px);
  }
}
.text {
  span {
    cursor: pointer;
  }
}
</style>
