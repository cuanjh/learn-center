<template>
  <div class="module-listen guide-body" :class="{lisani:ani}">
    <header class="guide-header">
      <span class="lis-icon learn-icon"></span> {{ $t('guide.listen') }}
    </header>
    <section class="guide-container">
      <div class="sentence-box">
      </div>
      <div class="stage f-cb f-usn">
        <div v-for="(type, index) in typeList" :key="index" :class="[type, {current:0==index}]" class="f-cb" :ref="'type'" v-show="show">
          <transition name="fade" mode="out-in">
            <component :is="'form-'+type" :data="list[index]" :no-record="true" :ref="'compent'"></component>
          </transition>
        </div>
      </div>
    </section>
    <guide-bottom :page="'listen'" :disabled="disabled"></guide-bottom>
  </div>
</template>

<script>
import $ from 'jquery'
import DrawMask from '../../../plugins/drawMask'
import Sound from '../../../plugins/soundCtrl'

import GuideBottom from './guideBottom.vue'

export default {
  props: ['typeList', 'list', 'sound'],
  data () {
    return {
      ani: '',
      show: false, // 是否显示
      disabled: true, //  能否下一步
      finished: true // 是否完成
    }
  },
  components: {
    GuideBottom
  },
  created () {
    this.$on('changePage', (page) => {
      if (page === 'listen') {
        this.ani = 'ani'
        setTimeout(() => {
          this.$el.querySelector('.sentence-box').remove()
        }, 300)
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
      !this.finished && new DrawMask().resize(() => showTip.call(this))
    })

    this.$on('startInit', () => {
      // playSound
      new DrawMask().disable()
      // this.sound.src = this.sound
      Sound.setSnd(this.sound.url)
      Sound.play(() => {
        this.finished = false
        new DrawMask().enable()
        setTimeout(() => {
          this.$parent.$emit('next-component')
          setTimeout(() => {
            showTip.call(this)
            this.disabled = false
          }, 0)
        }, 1000)
      })
    })
  }
}

function showTip () {
  let rightTxt = $('.sentence-box span').text()
  let rightDom = $(`.image-box:contains('${rightTxt}')`)[0]
  let {
    top,
    left,
    width,
    height
  } = rightDom.getClientRects()[0]
  let mask = new DrawMask()

  mask.showRect({
    top: top - 50,
    left,
    width,
    height
  })

  // 显示点击手势
  mask.showGesture({
    left: left + width / 2 - 10,
    top: top + height / 2 - 30
  })

  mask.on('mousemove', () => {
    $(rightDom).addClass('current')
  }, () => {
    $(rightDom).removeClass('current')
  })
  mask.on('click', () => {
    rightDom.click()
    mask.off('click').off('mousemove').hideMask()
    this.finished = true
  })
}
</script>

<style lang="less" scoped>
.module-listen {
  z-index: 96;
  padding-top: 0;
  // height: 554px;
  .guide-header {
    font-size: 18px;
    height: 105px;
    line-height: 105px;
  }
  .lis-icon {
    background: url("../../../../static/images/user-guide/guide-listen.png") 0 0
      no-repeat;
    width: 36px;
    height: 32px;
    float: left;
    margin-top: 35px;
    margin-right: 15px;
  }
  .guide-container {
    height: 378px;
  }
}
</style>
