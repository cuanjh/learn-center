<template>
  <div class="kid-stage-container">
    <nav-comp :chapterCode="code" :type="type"/>
    <progress-bar ref="progress"/>
    <div class="kid-content">
      <div class="kid-content-wrap" :style="{height: kidContentHeight + 'px'}">
        <swiper-comp ref="swiper" :chapterCode="code" :type="type" @setProgress="setProgress"/>
      </div>
    </div>
    <record-animate />
    <word-panel ref="wordPanel"/>
    <test-yuyin v-show="false" :chapterCode="code"/>
    <guide v-show="false"/>
  </div>
</template>

<script>
import $ from 'jquery'
import NavComp from './common/nav.vue'
import ProgressBar from './common/progress.vue'
import SwiperComp from './common/swiper.vue'
import WordPanel from './common/wordPanel.vue'
import Guide from './common/guide.vue'
import RecordAnimate from './common/recordAnimate.vue'
import TestYuyin from './testYuyin.vue'

import ASR from '../../../plugins/xf_asr.js'
import { mapMutations } from 'vuex'

export default {
  props: ['code', 'type'],
  inject: ['reload'],
  data () {
    return {
      notSupportTip: '请试用chrome浏览器且域名为localhost或127.0.0.1测试',
      iatRecorder: null,
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
    Guide,
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
      this.stop()
    })
  },
  mounted () {
    console.log('kid-stage-container', $('.kid-stage-container').height())
    this.kidContentHeight = $('.kid-stage-container').height() - 150
    let lang = this.code.split('-')[0]
    if (lang === 'KEN') {
      this.updatexfSpeechType('ise')
      // this.updatexfSpeechType('iat')
    } else {
      this.updatexfSpeechType('iat')
      this.initIatRecorder()
    }
  },
  methods: {
    ...mapMutations([
      'updatexfSpeechType'
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
          setTimeout(() => {
            this.$refs['swiper'].setResultOut('')
          }, 2000)
        },
        onError: (data) => {
          this.stop()
          this.reset()
          alert('WebSocket连接失败')
        },
        onMessage: (e) => {
          let jsonData = JSON.parse(e.data)
          if (jsonData.data && jsonData.data.result) {
            this.setResult(jsonData.data.result)
          }
        },
        onStart: () => {
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
      console.log(resultStr)
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
      this.counterDownTimeout = setTimeout(() => {
        this.counterDown()
      }, 1000)
    },
    setProgress (progress) {
      console.log(progress)
      this.$refs['progress'].setProgress(progress)
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
.kid-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-image: url('../../../../static/images/kid/pic-kid-content-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: center;
  .kid-content-wrap {
    width: 100%;
    max-height: 530px;
    background: rgba(0, 0, 0, 0);
  }
}
.kid-stage-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
