<template>
  <div class="record-container">
    <div :class="['play', {'playing': animat}]" :style="{'transform': 'translateX(-' + translateX + 'px)'}" @click="playMySound">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="record">
      <div class="record-decibel" v-show="recordState === 0">
        <span v-for="(height, index) in thumbHeightLeft" :key="'left' + index" :style="{'height': height + 'px'}"></span>
      </div>
      <i @click.stop.prevent="recordOpt()"></i>
      <div class="record-decibel" v-show="recordState === 0">
        <span v-for="(height, index) in thumbHeightLeft" :key="'right' + index" :style="{'height': height + 'px'}"></span>
      </div>
    </div>
    <div class="user" :style="{'transform': 'translateX(' + translateX + 'px)'}" v-show="isCanIat && xfSpeechState">
      <img class="photo" :src="photo" alt="" @click="goWordListBox()">
      <div :class="['mask', scoreClass]" v-show="isVip" @click="goWordListBox()">
        <span>{{ score }}</span>
        <p class="score-desc" v-text="scoreDesc" v-show="translateX > 0"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import _ from 'lodash'
import bus from '../../../bus'
import Recorder from '../../../plugins/recorder'
import SoundManager from '../../../plugins/soundManager'
// import XFSentence from '../../../plugins/xf_sentence'

export default {
  props: ['code', 'sentence'],
  data () {
    return {
      isShowScoring: false,
      recordState: -1, // -1: 开始录音, 0: 正在录音, 1: 录音结束
      translateX: 0,
      photo: '',
      score: '',
      scoreClass: '',
      scoreDesc: '评分中...',
      thumbHeightLeft: _.fill(Array(5), 2), // 左侧录音声音幅度
      thumbHeightRight: _.fill(Array(5), 2), // 右侧录音声音幅度
      isRecord: false, // 这个是表示是否开始录音
      recording: false, // 是否是正在录音
      animat: false, // 播放自己录音的动画
      recordActivity: false, // 录音是否激活
      time: 0, // 累计时间
      timerInterval: null, // 时间间隔器
      iseWords: [] // 测评的单词
    }
  },
  created () {
    this.$on('init', () => {
    })
  },
  mounted () {
    console.log('录音组件父组件的数值', this.sentence, this.code)
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.photo = userInfo.photo
    // 初始化
    Recorder.init()
  },
  watch: {
    time (val) {
      if (val === 60) {
        this.recordStop()
      }
    }
  },
  computed: {
    ...mapState({
      xfSpeechType: state => state.xfSpeechType,
      xfSpeechState: state => state.xfSpeechState,
      xfLang: state => state.xfLang,
      isVip: state => state.isVip,
      xfIatlangObj: state => state.xfIatlangObj
    }),
    isCanIat () {
      let flag = false
      let lang = this.code.split('-')[0]
      if (this.xfIatlangObj[lang]) {
        flag = true
      }
      return flag
    }
  },
  methods: {
    ...mapActions({
      getQiniuToken: 'learn/getQiniuToken', // 获取七牛token
      xfISE: 'xfISE'
    }),
    ...mapMutations({
      updateQiniuToken: 'learn/updateQiniuToken', // 更新七牛token
      updateLocked: 'learn/updateLocked',
      updateCanRecord: 'updateCanRecord'
    }),
    reset () {
      this.isShowScoring = false
      this.recordState = -1 // -1: 开始录音, 0: 正在录音, 1: 录音结束
      this.translateX = 0
      this.photo = ''
      this.score = ''
      this.scoreClass = ''
      this.scoreDesc = '评分中...'
      this.thumbHeightLeft = _.fill(Array(5), 2) // 左侧录音声音幅度
      this.thumbHeightRight = _.fill(Array(5), 2) // 右侧录音声音幅度
      this.isRecord = false // 这个是表示是否开始录音
      this.recording = false // 是否是正在录音
      this.animat = false // 播放自己录音的动画
      this.recordActivity = false // 录音是否激活
      this.time = 0 // 累计时间
      clearInterval(this.timerInterval)
    },
    recordOpt () {
      this.recordState++
      if (this.recordState === 1) {
        this.recordStop()
        if (this.isCanIat && this.xfSpeechState) {
          this.$parent.$emit('stopIatRecorder')
        }
      } else {
        this.translateX = 0
        setTimeout(() => {
          this.recordState = 0
          this.startRecord()
          if (this.isCanIat && this.xfSpeechState) {
            this.$parent.$emit('startIatRecorder')
          }
        }, 600)
      }
      if (this.recordState > 1) {
        this.scoreClass = ''
        this.scoreDesc = '评分中...'
        this.score = ''
        this.recordState = -1
      }
    },
    // 点击开始录音
    startRecord () {
      this.isRecord = true
      _.delay(() => {
        SoundManager.playSnd('recordPro')
      }, 500)
      _.delay(() => {
        Recorder.startRecording()
        this.updateLocked(true)
      }, 1000)
      this.timerInterval = setInterval(() => {
        this.time++
      }, 1000)
      bus.$on('record_setVolume', data => {
        var res = []
        for (var i = 0; i < data[0].length; i = i + 820) {
          var value = Math.abs(data[0][i]) * 20
          value = value * value * 16
          value = value >= 50 ? 50 - 2 : value
          value = parseInt(value + 2)
          res.push(value)
        }
        let copy = res
        let copyReverse = copy.reverse()
        this.thumbHeightLeft = res
        this.thumbHeightRight = copyReverse
      })
    },
    // 点击停止录音
    recordStop () {
      this.recordState = 1
      this.isShowScoring = true
      this.translateX = 120
      Recorder.stopRecording()
      bus.$off('record_setVolume')
      console.log('record stop!!!!!')
      clearInterval(this.timerInterval)
      this.time = 0
      this.recordActivity = false
      this.uploadQiniu()
    },
    // 点击播放自己的录音
    playMySound () {
      this.animat = !this.animat
      if (this.animat) {
        let audio = Recorder.audio
        Recorder.playRecording()
        audio.addEventListener('ended', () => {
          this.animat = false
        })
      } else {
        Recorder.stopRecordSoud()
      }
    },
    // 关闭录音
    closeRecord () {
      this.isRecord = false
      this.animat = false
      Recorder.stopRecording()
      bus.$off('record_setVolume')
    },
    uploadQiniu () {
      // let _this = this
      let isHaveRecord = Recorder.isHaveRecord()
      if (isHaveRecord) {
        this.getQiniuToken().then(res => {
          if (res.success) {
            let qiniuToken = res.token
            console.log(qiniuToken)
            Recorder.uploadQiniu(qiniuToken, this.code, this.sentence).then(recorderUrl => {
              let url = 'http://records.talkmate.com/' + recorderUrl
              this.$emit('afterPostQiniu', url)
              // let url = 'http://records.talkmate.com/' + recorderUrl
              // console.log(this.isVip, this.xfSpeechType)
              // // 讯飞语音测评服务
              // if (this.isVip && this.xfSpeechType === 'ise') {
              //   _this.xfISE({language: this.xfLang[_this.code.split('-')[0]], text: _this.sentence, url: url}).then(res => {
              //     console.log(res)
              //     if (res.code === '0') {
              //       if (JSON.parse(res.data.read_sentence.rec_paper.read_chapter.is_rejected)) {
              //         this.setScore('')
              //         return
              //       }
              //       let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
              //       if (!xfISEResult) {
              //         xfISEResult = []
              //       }
              //       let sentenceScore = res.data.read_sentence.rec_paper.read_chapter.total_score
              //       if (!Array.isArray(res.data.read_sentence.rec_paper.read_chapter.sentence.word)) {
              //         sentenceScore = res.data.read_sentence.rec_paper.read_chapter.sentence.word.total_score
              //       }
              //       let formObj = {
              //         form_code: _this.code,
              //         sentence: _this.sentence,
              //         score: Math.round(parseFloat(sentenceScore)),
              //         record_url: url
              //       }
              //       let words = XFSentence.getWords(res.data.read_sentence.rec_paper.read_chapter.sentence)
              //       formObj['words_score'] = words
              //       console.log('fromObj', formObj)
              //       this.iseWords = formObj.words_score
              //       let formIndex = xfISEResult.findIndex(item => {
              //         return item.form_code === _this.code
              //       })
              //       if (formIndex === -1) {
              //         xfISEResult.push(formObj)
              //       } else {
              //         xfISEResult.splice(formIndex, 1, formObj)
              //       }
              //       localStorage.setItem('xfISEResult', JSON.stringify(xfISEResult))
              //       this.$parent.$emit('iseResultSet')
              //       this.setScore(formObj.score)
              //       // this.getAvarageScore()
              //       // this.$refs['scoreResult'].setScoreResult(formObj.score)
              //       // this.iseResultSet()
              //       // this.$refs['ise'][this.curPage - 1].evaluateFinished()
              //       // if (this.list.length === this.curPage) {
              //       //   this.xfISEUpload({forms: localStorage.getItem('xfISEResult')})
              //       // }
              //     }
              //   })
              // }
            })
          }
        })
      }
      console.log(isHaveRecord)
    },
    setScore (score) {
      console.log(score)
      if (score !== '') {
        this.score = Math.round(parseFloat(score))
      }

      this.scoreClass = ''
      this.scoreDesc = ''
      switch (true) {
        case score >= 80:
          this.scoreClass = 'perfect'
          this.scoreDesc = 'perfect!'
          break
        case score >= 60:
          this.scoreClass = 'good'
          this.scoreDesc = 'nice!'
          break
        default:
          this.scoreClass = 'try'
          this.scoreDesc = 'try again!'
          break
      }
      this.isShowScoring = false
    },
    goWordListBox () {
      if (this.xfSpeechType === 'ise') {
        // 弹录音列表
        console.log(this.iseWords)
        if (!this.isVip) {
          bus.$emit('showNoVipModal')
          return false
        }
        let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
        if (xfISEResult.length === 0) {
          return false
        }
        bus.$emit('showWordListBox', this.iseWords)
      } else {
        this.$parent.$emit('showIatSentenceBox')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.record-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .play {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    z-index: 1;
    transition: transform .5s ease-in;
    cursor: pointer;
    span {
      width: 3px;
      height: 8px;
      margin: 0 1px;
      background: #0581D1;
      border-radius: 4px;
      &:nth-child(2) {
        height: 14px;
      }
      &:nth-child(3) {
        height: 20px;
      }
      &:nth-child(4) {
        height: 14px;
      }
    }
  }
  .record {
    display: flex;
    z-index: 2;
    i {
      cursor: pointer;
      display: inline-block;
      width: 70px;
      height: 70px;
      background: url('../../../../static/images/study/icon-record.png') no-repeat center;
      background-size: cover;
    }
  }
  .user {
    position: absolute;
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    z-index: 1;
    transition: transform .5s ease-in;
    .photo {
      width: 100%;
      height: 100% !important;
      border-radius: 50%!important;
      object-fit: cover;
    }
    .mask {
      cursor: pointer;
      position: absolute;
      width: 100%;
      height: 100%;
      background:rgba(151,151,151, .5);
      border-radius: 50%;
      top: 0;
      text-align: center;
      span {
        line-height: 48px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        text-shadow:0px 1px 3px rgba(0,0,0,0.6);
      }
      .score-desc {
        position: absolute;
        top: -25px;
        left: -15px;
        font-size: 12px;
        font-weight: 500;
        color: #fff;
        width: 80px;
      }
    }
    .perfect {
      border: 2px solid #20C03B;
      .score-desc {
        color: #5CF676;
      }
    }
    .good {
      border: 2px solid #515151;
      .score-desc {
        color: #070707;
      }
    }
    .try {
      border: 2px solid #FF685F;
      .score-desc {
        color: #FF685F;
      }
    }
  }
}
.record-decibel {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  span {
    width: 2px;
    height: 2px;
    border-radius: 2px;
    background: #fff;
    margin: 0 5px;
    transition: height 0.3s ease;
  }
}

.playing {
  span:nth-child(3) {
    animation: load3 0.7s ease infinite;
    -webkit-animation: load3 0.7s ease infinite;
    -ms-animation: load3 0.7s ease infinite;
    -moz-animation: load3 0.7s ease infinite;
    -o-animation: load3 0.7s ease infinite;
  }
  @keyframes load3 {
    0%, 100%{
      height: 26px;
    }
    50%{
      height: 20px;
    }
  }
  span:nth-child(2), span:nth-child(4) {
    animation: load2 0.7s ease infinite;
    -webkit-animation: load2 0.7s ease infinite;
    -ms-animation: load2 0.7s ease infinite;
    -moz-animation: load2 0.7s ease infinite;
    -o-animation: load2 0.7s ease infinite;
  }
  @keyframes load2 {
    0%, 100%{
      height: 20px;
    }
    50%{
      height: 14px;
    }
  }
  span:nth-child(1), span:nth-child(5) {
    animation: load1 0.7s ease infinite;
    -webkit-animation: load1 0.7s ease infinite;
    -ms-animation: load1 0.7s ease infinite;
    -moz-animation: load1 0.7s ease infinite;
    -o-animation: load1 0.7s ease infinite;
  }
  @keyframes load1 {
    0%, 100%{
      height: 8px;
    }
    50%{
      height: 14px;
    }
  }
}
</style>
