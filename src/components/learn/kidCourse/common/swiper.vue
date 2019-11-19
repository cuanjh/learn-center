<template>
  <div class="swiper">
    <div class="current-swiper swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in list" :key="'current-swiper-' + item.code">
          <img class="picture" :src="item.image" alt="">
          <div class="content">
            <i @click="playSourceSound(index)"></i>
            <p :data-content="item.content || item.word" v-html="item.formatContent"></p>
          </div>
          <ise-area
            ref="ise"
            :isEvaluation="true"
            :index="index"
            @startRecord="startRecord"
            @stopRecord="stopRecord"
            @playRecord="playRecord"
            @startEvaluate="startEvaluate"
            @goWordListBox="goWordListBox"
          />
        </div>
      </div>
    </div>

    <div class="nocurrent-swiper left-swiper swiper-container swiper-no-swiping">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in list" :key="'left-swiper-' + item.code">
          <img class="picture" :src="item.image" alt="">
          <div class="content">
            <i></i>
            <p :data-content="item.content || item.word" v-html="item.formatContent"></p>
          </div>
        </div>
      </div>
    </div>

    <div class="nocurrent-swiper right-swiper swiper-container swiper-no-swiping">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in list" :key="'right-swiper-' + item.code">
          <img class="picture" :src="item.image" alt="">
          <div class="content">
            <i></i>
            <p :data-content="item.content || item.word" v-html="item.formatContent"></p>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-page-container">
      <p>
        <span>{{ curPage }}</span> / <span>{{ totalPage }}</span>
      </p>
    </div>
    <button @click="goGradeBox()">测试学完后的弹框</button>
    <grade-box ref="gradeBox"/>
    <evaluating-box />
    <word-list-box ref="WordListBox"/>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import Swiper from 'swiper'
import { mapActions, mapState } from 'vuex'
import IseArea from './iseArea.vue'
import Recorder from '../../../../plugins/recorder'
import cookie from '../../../../tool/cookie'
// import bus from '../../../../bus'
import GradeBox from './gradeBox.vue'
import EvaluatingBox from './evaluatingBox.vue'
import WordListBox from './wordListBox.vue'

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
      qiniuToken: '',
      timerInterval: null, // 录音间隔器
      time: 0 // 录音计时
    }
  },
  components: {
    IseArea,
    GradeBox,
    EvaluatingBox,
    WordListBox
  },
  mounted () {
    // 录音插件初始化
    Recorder.init({inputSampleRate: 50400, sampleRate: 16000})
    // 获取课程数据
    this.initData()
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
      kidRecordList: state => state.kidRecordList
    })
  },
  methods: {
    ...mapActions([
      'getKidCourseContent',
      'getUploadFileToken',
      'xfISE',
      'getKidRecordSave',
      'getKidRecordList'
    ]),
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
        this.curPage = 1
        this.setProgress()
        setTimeout(() => {
          this.initSwiper()
        }, 100)
      })
    },
    // 获取数据后，初始化swiper
    initSwiper () {
      var swiper1 = new Swiper('.current-swiper', {
        mousewheel: true,
        allowTouchMove: false,
        on: {
          init: () => {
            this.iseResultSet()
            this.playSourceSound(this.curPage - 1)
          },
          slideChange: () => {
            console.log('改变了，activeIndex为' + swiper1.activeIndex)
            let activeIndex = swiper1.activeIndex
            this.curPage = activeIndex + 1
            this.isPlay = false
            this.playSourceSound(activeIndex)
            this.setProgress()
            this.$parent.$emit('hideWordPanel')
            swiper2.slideTo(activeIndex - 1)
            swiper3.slideTo(activeIndex + 1)
            setTimeout(() => {
              this.iseResultSet()
            }, 100)
          }
        }
      })
      var swiper2 = new Swiper('.left-swiper', {
        noSwiping: true
      })
      var swiper3 = new Swiper('.right-swiper', {
        initialSlide: 1,
        noSwiping: true
      })
      console.log(swiper1)
      console.log(swiper2)
      console.log(swiper3)
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
      let result = ''
      let arr = content.replace(new RegExp('\\n', 'g'), '<br/>').split(' ')
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
                result += '<span> ' + r[l].trim() + ' </span>' + tag
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
                result += '<span> ' + r[j].trim() + tag + ' </span>'
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
                result += '<span> ' + r[k].trim() + tag + ' </span>'
              }
            }
          } else {
            if (arr[i].trim() === '—') {
              result += arr[i].trim()
            } else {
              result += '<span> ' + arr[i].trim() + ' </span>'
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
          this.isPlay = true
        }
        this.audio.onended = () => {
          this.isPlay = false
        }
      } else {
        this.audio.pause()
        this.isPlay = false
      }
    },
    // 暂停原始录音播放
    pauseSourceSound () {
      this.audio.pause()
      this.isPlay = false
    },
    // 开始录音
    startRecord () {
      this.timerInterval = setInterval(() => {
        this.time++
      }, 1000)
      Recorder.startRecording()
    },
    // 停止录音
    stopRecord () {
      clearInterval(this.timerInterval)
      this.time = 0
      Recorder.stopRecording()
      this.$refs['ise'][this.curPage - 1].stopRecord()
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
      let content = item.content || item.words
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
        _this.xfISE({language: _this.xfLang[_this.chapterCode.split('-')[0]], text: content, url: url}).then(res => {
          console.log(res)
          if (res.code === '0' && res.data.read_sentence.rec_paper.read_chapter.except_info === '0') {
            let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
            if (!xfISEResult) {
              xfISEResult = {}
            }
            let id = _this.chapterCode + '-' + item.code
            _.set(xfISEResult, id, res.data.read_sentence.rec_paper.read_chapter)
            localStorage.setItem('xfISEResult', JSON.stringify(xfISEResult))
            this.iseResultSet()
          }
        })
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
      this.$refs.WordListBox.showWordListBox()
    },
    // 录音保存后，动画效果
    recordAnimate () {
      console.log($('.ise-area .play').offset())
      let offset = $('.swiper-slide-active .ise-area .play').offset()
      $('.record-save-animat').css({
        left: offset.left,
        top: offset.top
      })
      $('.record-save-animat').show()
      let targetOffest = $('.record-box .record-icon').offset()
      console.log(targetOffest)
      $('.record-save-animat').stop().animate({
        left: targetOffest.left,
        top: targetOffest.top
      }, {
        duration: 800,
        specialEasing: {
          left: 'linear',
          top: 'swing'
        },
        complete: () => {
          $('.record-save-animat').hide()
        }
      })
    },
    // 评测结果处理
    iseResultSet () {
      let id = this.chapterCode + '-' + this.list[this.curPage - 1].code
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      console.log(xfISEResult[id])
      if (xfISEResult[id]) {
        let words = []
        if (Array.isArray(xfISEResult[id].sentence)) {
          xfISEResult[id].sentence.forEach(sentence => {
            sentence.word.forEach(word => {
              if (word.content !== 'sil' && word.content !== 'fil') {
                words.push(word)
              }
            })
          })
        } else {
          words = xfISEResult[id].sentence.word.filter(item => {
            return item.content !== 'sil' && item.content !== 'fil'
          })
        }
        console.log(words)
        $('.swiper-slide-active').find('.content p span').removeClass('right')
        $('.swiper-slide-active').find('.content p span').removeClass('wrong')
        words.forEach((word, index) => {
          let score = parseFloat(word.total_score)
          switch (true) {
            case score >= 90:
              $('.swiper-slide-active').find('.content p span:nth-child(' + (index + 1) + ')').addClass('right')
              break
            case score < 60:
              $('.swiper-slide-active').find('.content p span:nth-child(' + (index + 1) + ')').addClass('wrong')
              $('.swiper-slide-active').find('.content p span:nth-child(' + (index + 1) + ')').click((ele) => {
                let offset = $(ele.currentTarget).offset()
                this.$parent.$emit('showWordPanel', {word: word, offset: offset})
              })
              break
            default:
              break
          }
        })
      }
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
  width:668px;
  height:480px;
  border-radius:10px;
  margin:0 auto;
  box-shadow:0 0 20px rgba(0,0,0,0.05);
  position:relative;
  z-index:99;
  background: #fff;
  .picture {
    width: 100%;
    height: 280px;
    object-fit: cover;
  }
  .content {
    display: inline-flex;
    padding-top: 8px;
    padding-left: 16px;
    font-size: 20px;
    font-weight: 600;
    color: #3C5B6F;
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
}
.left-swiper {
  position:absolute;
  left:50px;
  top:103px;
  z-index:1;
}
.right-swiper {
  position:absolute;
  right:50px;
  left:auto;
  top:103px;
  z-index:1;
}
.nocurrent-swiper {
  width:400px;
  height:274px;
  border-radius:8px;
  box-shadow:0 0 20px rgba(0,0,0,0.05);
  background: #fff;
  .picture {
    width: 100%;
    max-height: 190px;
  }
  .content {
    display: inline-flex;
    padding: 12px 0 0 12px;
    font-size: 12px;
    font-weight: 600;
    color: #3C5B6F;
  }
  i {
    display: inline-block;
    width: 14px;
    height: 12px;
    margin: 3px 12px 0 0;
    background-image: url('../../../../../static/images/kid/icon-laba.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}
.nocurrent-swiper:before {
  content:'';
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(237,240,240,0.5);
  z-index:99;
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
}

.record-save-animat {
  position: absolute;
  display: none;
  z-index: 999999;
  i {
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url('../../../../../static/images/kidcontent/icon-record-list.png') no-repeat center;
    background-size: cover;
  }
}
</style>
