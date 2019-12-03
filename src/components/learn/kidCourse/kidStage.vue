<template>
  <div class="kid-stage-container">
    <nav-comp @back="back" :chapterCode="code" :type="type"/>
    <progress-bar ref="progress"/>
    <div class="kid-content">
      <div class="kid-content-wrap" :style="{height: kidContentHeight + 'px'}">
        <swiper-comp
          ref="swiper"
          :chapterCode="code"
          :type="type"
          @setProgress="setProgress"/>
      </div>
    </div>
    <record-animate ref="recordAnimate"/>
    <word-panel ref="wordPanel"/>
    <test-yuyin v-show="false" :chapterCode="code"/>
    <guide1 />
    <guide2 />
    <guide3 />
  </div>
</template>

<script>
import $ from 'jquery'
import NavComp from './common/nav.vue'
import ProgressBar from './common/progress.vue'
import SwiperComp from './common/swiper.vue'
import WordPanel from './common/wordPanel.vue'
import Guide1 from './common/guide.vue'
import Guide2 from './common/guide2.vue'
import Guide3 from './common/guide3.vue'
import RecordAnimate from './common/recordAnimate.vue'
import TestYuyin from './testYuyin.vue'

import ASR from '../../../plugins/xf_asr.js'
import { mapMutations, mapActions } from 'vuex'
import bus from '../../../bus'

export default {
  props: ['code', 'type'],
  inject: ['reload'],
  data () {
    return {
      notSupportTip: '请试用chrome浏览器且域名为localhost或127.0.0.1测试',
      iatRecorder: null,
      isIatFinished: false,
      counterDownTime: 0,
      counterDownTimeout: null,
      resultText: '',
      resultOut: '',
      isRouterAlive: true,
      langObj: {
        KEN: 'en_us',
        KFR: 'fr_fr',
        KSP: 'es_es'
      },
      kidContentHeight: 0
    }
  },
  components: {
    NavComp,
    ProgressBar,
    SwiperComp,
    WordPanel,
    TestYuyin,
    Guide1,
    Guide2,
    Guide3,
    RecordAnimate
  },
  created () {
    // 显示单词面板
    this.$on('showWordPanel', (params) => {
      this.$refs['wordPanel'].show(params)
    })
    // 隐藏单词面板
    this.$on('hideWordPanel', (params) => {
      this.$refs['wordPanel'].hide()
    })
    // 开始语音识别
    this.$on('startIatRecorder', () => {
      $('#result_output').text('')
      this.start()
    })
    // 停止语音识别
    this.$on('stopIatRecorder', () => {
      this.isIatFinished = true
      this.stop()
    })
    this.$on('recordAnimate', () => {
      this.$refs['recordAnimate'].show()
    })

    this.$on('reset', () => {
      this.isIatFinished = false
      this.stop()
      this.reset()
    })
    let lang = this.code.split('-')[0]
    if (lang === 'KEN') {
      this.updatexfSpeechType('ise')
      // this.updatexfSpeechType('iat')
    } else {
      this.updatexfSpeechType('iat')
      this.initIatRecorder()
    }
  },
  mounted () {
    console.log('kid-stage-container', $('.kid-stage-container').height())
    this.kidContentHeight = $('.kid-stage-container').height() - 150
  },
  methods: {
    ...mapMutations([
      'updatexfSpeechType'
    ]),
    ...mapActions([
      'xfISEUpload'
    ]),
    initIatRecorder () {
      let arr = this.code.split('-')
      let language = this.langObj[arr[0]]
      let url = 'wss://iat-api.xfyun.cn/v2/iat'
      let host = 'iat-api.xfyun.cn'
      // 语音识别小语种配置
      if (arr[0] !== 'KEN') {
        url = 'wss://iat-niche-api.xfyun.cn/v2/iat'
        host = 'iat-niche-api.xfyun.cn'
      }
      this.iatRecorder = new ASR.IatRecorder({
        language: language,
        host: host,
        url: url,
        onClose: () => {
          this.stop()
          this.reset()
          // if (this.isIatFinished) {
          //   this.$refs['swiper'].iatFinished()
          // } else {
          //   this.$refs['swiper'].setResultOut('')
          // }
          this.$refs['swiper'].iatFinished()
          // setTimeout(() => {
          //   this.$refs['swiper'].setResultOut('')
          // }, 2000)
        },
        onError: (data) => {
          this.stop()
          this.reset()
          alert('WebSocket连接失败')
        },
        onMessage: (e) => {
          let jsonData = JSON.parse(e.data)
          if (jsonData.data && jsonData.data.result) {
            console.log('onMessage result', jsonData.data.result)
            // if (this.isIatFinished) {
            //   this.setResult(jsonData.data.result)
            // }
            this.setResult(jsonData.data.result)
          }
        },
        onStart: () => {
          this.$refs['swiper'].setResultOut('')
          this.counterDown()
        }
      })
    },
    start () {
      this.resultOut = ''
      this.resultText = ''
      this.iatRecorder.start()
    },
    stop () {
      this.iatRecorder.stop()
    },
    reset () {
      this.counterDownTime = 0
      clearTimeout(this.counterDownTimeout)
      this.iatRecorder.reset()
    },
    setResult (data) {
      var str = ''
      var resultStr = ''
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
      this.resultOut = resultStr
      this.$refs['swiper'].setResultOut(this.resultOut)
    },
    counterDown () {
      if (this.counterDownTime === 60) {
        this.stop()
      } else if (this.counterDownTime > 60) {
        this.reset()
        return false
      }
      this.counterDownTime++
      // this.counterDownTimeout = setTimeout(() => {
      //   this.counterDown()
      // }, 1000)
    },
    setProgress (progress) {
      console.log(progress)
      this.$refs['progress'].setProgress(progress)
    },
    back () {
      bus.$emit('thisAudioPause')
      let arr = this.code.split('-')
      if (arr[0] === 'KEN') {
        // 保存测评信息
        this.xfISEUpload({forms: localStorage.getItem('xfISEResult')})
      }
      this.$router.push({path: '/app/kid-course-list/' + arr.slice(0, 2).join('-')})
    }
  },
  watch: {
    $route (to, from) {
      console.log('监听子路由的变化', to)
      this.reload()
    }
  }
}
</script>

<style lang="less" scoped>
.kid-stage-container {
  width: 100%;
  height: 100%;
  position: relative;
  // display: flex;
  // flex-direction: column;
  overflow: hidden;
}
.kid-content {
  height: 100%;
  width: 100%;
  // display: flex;
  // flex-direction: row;
  // align-items: center;
  background-image: url('../../../../static/images/kid/pic-kid-content-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: center;
  .kid-content-wrap {
    width: 100%;
    height: 100%!important;
    padding-top: 6%;
  }
}
@media (max-height: 675px){
  .kid-stage-container {
    overflow: auto;
  }
  .kid-content {
    height: 108%;
    .kid-content-wrap {
      padding-top: 3%;
    }
  }
}
@media (max-width: 1300px){
  .kid-content-wrap {
    padding-top: 3%!important;
  }
}
</style>
