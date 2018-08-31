<template>
  <div class="module-read guide-body" :class="{readani:ani}">
    <header class="guide-header">
      <span class="read-icon learn-icon"></span> {{ $t('guide.read') }}
    </header>
    <section class="guide-container">
      <div class="sentence-box">
      </div>
      <div class="stage f-cb f-usn">
        <div v-for="(type, index) in typeList" :key="index" class="f-cb" ref="type" v-show="show" :class="[type, 'f-cb', {current:cur==index}]">
          <transition name="fade" mode="out-in">
            <component :is="'form-'+type" :data="list[index]" :no-record="true" ref="compent"></component>
          </transition>
        </div>
      </div>
    </section>
    <guide-bottom :page="'read'" :disabled="disabled"></guide-bottom>
  </div>
</template>

<script>
import $ from 'jquery'
import DrawMask from '../../../plugins/drawMask'
import Sound from '../../../plugins/soundCtrl'

import GuideBottom from './guideBottom.vue'
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
  created () {
    this.$on('changePage', (page) => {
      if (page === 'read') {
        this.$data.ani = 'ani'
        setTimeout(() => {
          this.$el.querySelector('.sentence-box').remove()
        }, 300)
        this.$parent.$emit('changePage', page)
      } else {
        this.$data.ani = ''
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
      new DrawMask().disable()
      Sound.setSnd(this.sound.url)
      Sound.play(() => {
        new DrawMask().enable()
        setTimeout(() => {
          this.finished = false
          this.$parent.$emit('next-component')
          setTimeout(() => {
            showTip.call(this)
            this.disabled = false
          }, 500)
        }, 1000)
      })
    })
  }
}

function showTip () {
  let rightDom = $(`.sentence-box`).find('a:contains(are)')[0]
  let { top, left, width, height } = rightDom.getClientRects()[0]
  let mask = new DrawMask()

  mask.showRect({
    top: top - 50,
    left,
    width,
    height
  })

  // 显示点击手势
  mask.showGesture({
    left: left + width / 2,
    top: top + height / 2
  })

  mask.on('mousemove').on('click', () => {
    rightDom.click()
    mask.off('mousemove').off('click')
    mask.hideMask()
    this.finished = true
  })
}
</script>

<style lang="less" scoped>
.module-read {
  z-index: 94;
  padding-top: 0;
  height: 554px;
  .guide-header {
    font-size: 18px;
    height: 105px;
    line-height: 105px;
  }
  .read-icon {
    background: url("../../../../static/images/user-guide/guide-read.png") 0 0
      no-repeat;
    width: 36px;
    height: 32px;
    margin-top: 41px;
    margin-right: 15px;
    float: left;
  }
  .guide-container {
    height: 378px;
  }
}

</style>
