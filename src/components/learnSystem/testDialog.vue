<template>
  <div>
    <section class="module-test-dialog" :id="id">
      <header class="dialog-header">
        {{testDialog.title.micro}}
      </header>
      <div class="main-body">
        <div class="bar-container graph">
            <div class="bar" v-for="i in 23" :key="i"></div>
        </div>
        <div class="bar-container listen">
          <div class="micro-icon"></div>
        </div>
        <div class="bar-container play">
          <div class="play-icon"></div>
        </div>
        <canvas width="112" height="112" class="arch"></canvas>
      </div>
      <div class="finish-region clearfix">
        <span class="icon"></span>
        <span class="text"></span>
      </div>
      <div class="btn-region">
        <a href="javascript:;" class="btn next disabled">{{ guide.next }}</a>
        <a href="javascript:;" class="btn yes">{{ testDialog.btn.yes }}</a>
        <a href="javascript:;" class="btn no">{{ testDialog.btn.no }}</a>
      </div>
    </section>
    <canvas-comp ref="canvas"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import $ from 'jquery'
import _ from 'lodash'
import EventEmitter from 'event-emitter'
import common from '../../plugins/common'
import Recorder from '../../plugins/recorder'

import CanvasComp from './canvas.vue'

let $event = new EventEmitter()

export default {
  props: {
    microFinishCallback: Function,
    soundFinishCallback: Function
  },
  name: 'test-dialog',
  data () {
    return {
      id: common.createId(),
      container: null,
      $graph: null,
      $listen: null,
      $play: null,
      $next: null,
      $yes: null,
      $no: null,
      $text: null,
      $icon: null,
      ctx: null,
      voice: false,
      stopDraw: false,
      audio: new Audio()
    }
  },
  components: {
    CanvasComp
  },
  mounted () {
    this.audio.src = 'https://course-assets1.talkmate.com/new_guide/sample.mp3'
    this.container = $('#' + this.id)
    this.$graph = this.container.find('.graph')
    this.$listen = this.container.find('.listen')
    this.$play = this.container.find('.play')
    this.ctx = this.container.find('.arch')[0].getContext('2d')
    this.$next = this.container.find('.next')
    this.$yes = this.container.find('.yes')
    this.$no = this.container.find('.no')
    this.$text = this.container.find('.text')
    this.$icon = this.container.find('.icon')

    this.$listen.css('display', 'flex')
    this.$next.show()
    this.bindEvent()
    this.show()
  },
  computed: {
    ...mapState({
      testDialog: state => state.learn.testDialog,
      guide: state => state.learn.guide
    })
  },
  methods: {
    bindMessageEvent () {
      // 重置尺寸
      window.onresize = () => {
        this.setPos()
      }

      // 绑定麦克风回调
      $event.on('record_setVolume', data => {
        var res = []
        for (var i = 0; i < data.length; i = i + 186) {
          var value = Math.abs(data[i]) * 6
          value = value * value * 16
          value = value >= 50 ? 50 - _.random(3, 10) : value
          res.push(value)
        }
        this.voice = true
        this.setBar(res)
      })
    },
    bindEvent () {
      var that = this
      // 下一步
      that.container.delegate('.next', 'click', (e) => {
        var target = $(e.target)
        if (!target.hasClass('disabled')) {
          that.$next.hide()
          that.$yes.show()
          that.$no.show()
          that.$listen.hide()
          that.$graph.hide()
          that.$play.css('display', 'flex')
          that.$text.text('')
          that.$icon.removeClass('icon-success')
          that.$icon.removeClass('icon-error')
        }
      })

      // yes
      that.container.delegate('.yes', 'click', () => {
        if (typeof that.microFinishCallback === 'function') {
          that.microFinishCallback(that.voice)
        }
        if (typeof that.soundFinishCallback === 'function') {
          that.soundFinishCallback(true)
        }
        that.audio.pause()
        that.hide()
      })

      // yes
      that.container.delegate('.no', 'click', () => {
        if (typeof that.microFinishCallback === 'function') {
          that.microFinishCallback(that.voice)
        }
        if (typeof that.soundFinishCallback === 'function') {
          that.soundFinishCallback(false)
        }
        that.audio.pause()
        that.hide()
      })

      // 点击canvas
      that.container.delegate('.arch', 'click', () => {
        if (that.$listen.css('display') === 'flex') {
          that.stopDraw = false
          Recorder.startRecording()
          that.$listen.hide()
          that.$graph.css('display', 'flex')
          that.draw()
        } else if (that.$graph.css('display') === 'flex') {
          that.stopDraw = true
          Recorder.stopRecording()
          that.$graph.hide()
          that.$listen.css('display', 'flex')
          that.$next.removeClass('disabled')
          setTimeout(() => {
            that.clearDraw()
            that.voiceFinish()
          }, 10)
        } else if (that.$play.css('display') === 'flex') {
          if (that.audio.readyState === 4) {
            that.audio.play()
          }
        }
      })
    },
    clearDraw () {
      this.ctx.clearRect(0, 0, 112, 112)
    },
    setBar (res) {
      var bars = this.$graph.find('.bar')
      for (var i = 0, len = res.length; i < len; i++) {
        bars[i].style.height = res[i] + 'px'
      }
    },
    // 销毁
    destroy () {
      $(this.container).remove()
      this.$refs.canvas.destroy()
    },
    // 声音检测完毕
    voiceFinish (state) {
      this.$icon.removeClass('icon-success')
      this.$icon.removeClass('icon-error')
      if (this.voice) {
        this.$icon.addClass('icon-success')
        this.$text.text(this.testDialog.success)
      } else {
        this.$icon.addClass('icon-error')
        this.$text.text(this.testDialog.error.micro)
      }
    },
    // 显示弹出框
    show () {
      this.container.show()
      this.$refs.canvas.show()
      this.setPos()
      document.documentElement.style.overflow = 'hidden'
    },
    // 隐藏弹出框
    hide () {
      this.container.hide()
      this.$refs.canvas.hide()
      document.documentElement.style.overflow = 'auto'
    },
    // 重置位置
    setPos () {
      let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft
      if (this.container) {
        this.container.css({
          top: ((window.innerHeight - this.container.height()) / 4 + scrollTop) + 'px',
          left: ((window.innerWidth - this.container.width()) / 2 + scrollLeft) + 'px'
        })
      }
    },
    // 画录音状态
    draw () {
      /* eslint-disable */
      let value = 0;
      let _this = this;

      (function draw () {
        value += (1 / 30 / 10)
        _this.ctx.clearRect(0, 0, 112, 112)
        _this.ctx.beginPath()
        _this.ctx.arc(56, 56, 53, 0, Math.PI * 2 * value, false)
        _this.ctx.lineWidth = 6.7
        _this.ctx.strokeStyle = '#6ade80'
        _this.ctx.stroke()
        if (value <= 1 && !_this.stopDraw) {
          requestAnimationFrame(draw)
        } else {
          Recorder.stopRecording()
          _this.voiceFinish()
          _this.ctx.clearRect(0, 0, 112, 112)
          _this.$graph.hide()
          _this.$listen.css('display', 'lex')
          _this.$next.removeClass('disabled')
        }
      })()
      /* eslint-enable */
    }
  }
}
</script>

<style lang="less" scoped>
.module-test-dialog {
  position: absolute;
  width: 603px;
  height: 308px;
  z-index: 902;
  background-color: #fff;
  display: none;
  border-radius: 5px;
  .dialog-header {
    color: #5c68b0;
    font-size: 20px;
    text-align: center;
    height: 103px;
    line-height: 134px;
  }
  .bar-container {
    display: none;
    background-color: #54a4fb;
    height: 102px;
    width: 102px;
    border-radius: 96px;
    border: #eaedf4 8px solid;
    cursor: pointer;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    .bar {
      height: 2px;
      width: 2px;
      max-height: 50px;
      min-height: 2px;
      background: #fff;
      margin: 0 1px;
      transition: height 0.3s ease;
    }
  }
  .main-body {
    position: relative;
  }
  .arch {
    cursor: pointer;
    left: 50%;
    top: 50%;
    margin-left: -56px;
    margin-top: -56px;
    position: absolute;
    z-index: 21;
  }
  .micro-icon {
    background: url("../../../static/images/learnSystem/microphone1.png") 0 0 no-repeat;
    width: 28px;
    height: 47px;
  }
  .btn-region {
    padding-top: 18px;
  }
  .play-icon {
    background: url("../../../static/images/learnSystem/play1.png") 0 0 no-repeat;
    background-size: cover;
    width: 85px;
    height: 85px;
  }
  .btn {
    width: 123px;
    height: 35px;
    line-height: 34px;
    color: #fff;
    font-size: 16px;
    display: none;
    border-radius: 3px;
    background-color: #55a4fc;
    float: right;
    text-align: center;
    text-decoration: none;
    &:hover {
      background-color: #59b3ff;
    }
    &:active {
      background: -webkit-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: -moz-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: -o-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: -ms-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: linear-gradient(0deg, #59b3ff 0%, #4e9ff6 100%);
    }
  }
  .next {
    float: none;
    margin: 0 auto;
    display: block;
  }
  .yes {
    margin-left: 25px;
    margin-right: 165px;
  }
  .no {
    background-color: #f4b401;
    &:hover {
      background-color: #ffc33e;
    }
    &:active {
      background: -webkit-linear-gradient(90deg, #f4b401 0%, #ec9b00 100%);
      background: -moz-linear-gradient(90deg, #f4b401 0%, #ec9b00 100%);
      background: -o-linear-gradient(90deg, #f4b401 0%, #ec9b00 100%);
      background: -ms-linear-gradient(90deg, #f4b401 0%, #ec9b00 100%);
      background: linear-gradient(0deg, #f4b401 0%, #ec9b00 100%);
    }
  }
  .finish-region {
    height: 28px;
    border-bottom: #e7e7e7 1px solid;
    text-align: center;
    padding-left: 193px;
    padding-top: 12px;
  }
  .icon {
    float: left;
    margin-right: 8px;
  }
  .text {
    width: auto;
    float: left;
  }
  .icon-error {
    background: url("../../../static/images/user-guide/guide-error.png") 0 0
      no-repeat;
    width: image-width;
    height: image-height;
  }
  .icon-success {
    background: url("../../../static/images/user-guide/guide-check.png") 0 0
      no-repeat;
    width: image-width;
    height: image-height;
  }
  .disabled {
    background-color: #dfe2ed;
    &:hover {
      background-color: #dfe2ed;
    }
    &:active {
      background: none;
      background-color: #dfe2ed;
    }
  }
}
</style>
