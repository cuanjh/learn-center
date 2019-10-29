<template>
  <div class="module-speak guide-body" :class="{speakani:ani}">
    <header class="guide-header">
      <span class="speak-icon learn-icon"></span> {{ $t('guide.speak') }}
    </header>
    <section class="guide-container">
      <div class="sentence-box" id="speak-box">
      </div>
      <div class="stage f-cb f-usn">
        <div v-for="(type, index) in typeList" :key="index" class="f-cb" ref="type" v-show="show" :class="[type, {current:cur==index}]">
          <transition name="fade" mode="out-in">
            <component :is="'form-'+type" :data="list[index]" ref="compent" :no-record="true"></component>
          </transition>
        </div>
      </div>
    </section>
    <guide-bottom :page="'speak'" :disabled="disabled"></guide-bottom>
  </div>
</template>

<script>
import $ from 'jquery'
import DrawMask from '../../../plugins/drawMask'
import Sound from '../../../plugins/soundCtrl'
import Recorder from '../../../plugins/recorder'

import GuideBottom from './guideBottom.vue'

let tip = null
export default {
  props: ['typeList', 'list', 'cur', 'sound'],
  data () {
    return {
      ani: '',
      show: false,
      disabled: true,
      finished: true
    }
  },
  components: {
    GuideBottom
  },
  mounted () {
    tip = new Tips()
  },
  created () {
    this.$on('changePage', (page) => {
      if (page === 'speak') {
        this.ani = 'ani'
        $('#speak-box').remove()
        this.$parent.$emit('changePage', page)
      } else {
        this.ani = ''
      }
    })
    this.$on('show-com', () => {
      this.show = true
    })

    this.$on('hide-com', () => {
      this.show = false
    })

    this.$on('resize', () => {
      !this.finished && new DrawMask().resize(() => tip.resize(this))
    })

    this.$on('startInit', () => {
      new DrawMask().disable()
      Sound.setSnd(this.sound.url)
      Sound.play(() => {
        new DrawMask().enable()
        setTimeout(() => {
          this.finished = false
          this.$parent.$emit('next-component')
          setTimeout(() => {
            tip.showTip()
            this.disabled = false
          }, 500)
        }, 1000)
      })
    })
  }
}

class Tips {
  constructor () {
    this.current = 0
    this.com = null
    this.gesturePos = [
      () => ({
        left: this.left + this.width / 2 - 10,
        top: this.top + this.height / 2 - 10
      }),
      () => ({
        left: this.left + this.width / 2 + 40,
        top: this.top + this.height / 2 - 16
      }),
      () => ({
        left: this.left + this.width - 45,
        top: this.top + 24
      })
    ]
  }
  showTip () {
    if (!Recorder.isActivity()) {
      return
    }
    this.resize(this)
    setTimeout(() => {
      this.firstStep()
    }, 1500)
  }

  resize (_this) {
    if (!Recorder.isActivity()) {
      return
    }
    this.com = _this
    this.$right_dom = $(`.repeatspeak.current`)

    let { top, left, width, height } = this.$right_dom[0].getClientRects()[0]

    this.top = top
    this.left = left
    this.width = width
    this.height = height

    this.mask = new DrawMask()
    this.mask.showRect({
      top: top - 50,
      left,
      width,
      height
    })
    if ($('.help-tip').css('display') !== 'none') {
      this.mask.showGesture(this.gesturePos[this.current]())
    }
  }

  firstStep () {
    var timer = null
    this.mask.showGesture(this.gesturePos[this.current]())
    this.mask.on('click', () => {
      this.mask.off('click')
      this.$right_dom.find('.microphone-container')[0].click()
      $('.help-tip').hide()
      timer = setTimeout(() => {
        this.current = 1
        this.secondStep()
      }, 12500)

      // 重新挂载点击事件，点击录音按键语音完毕，进去下一step（省去等待时间）
      setTimeout(() => {
        this.mask.on('click', () => {
          clearTimeout(timer)
          this.mask.off('click')
          this.$right_dom.find('.microphone-container')[0].click()
          this.current = 1
          this.secondStep()
        })
      }, 1500)
    })
  }
  secondStep () {
    setTimeout(() => {
      this.mask.showGesture(this.gesturePos[this.current]())
    }, 1000)
    this.mask.on('click', () => {
      this.mask.off('click')
      this.$right_dom.find('.mic-play')[0].click()
      $('.help-tip').hide()
      setTimeout(() => {
        this.current = 2
        this.thirdStep()
      }, 2500)
    })
  }
  thirdStep () {
    this.mask.showGesture(this.gesturePos[this.current]())
    this.mask.on('click', () => {
      this.$right_dom.find('.skip')[0].click()
      this.mask.off('click').off('mousemove')
      this.mask.hideMask()
      this.com.finished = true
    })
  }
}
</script>

<style lang="less" scoped>
.module-speak {
  z-index: 95;
  height: 554px;
  padding-top: 0;
  .guide-header {
    font-size: 18px;
    height: 105px;
    line-height: 105px;
  }
  .learn-icon {
    background: url("../../../../static/images/user-guide/guide-listen.png") 0 0 no-repeat;
    width: 36px;
    height: 32px;
    float: left;
    margin-top: 35px;
    margin-right: 15px;
}
  .guide-container{
    height: 378px;
  }
}
</style>
