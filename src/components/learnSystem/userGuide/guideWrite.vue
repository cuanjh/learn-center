<template>
  <div class="module-write guide-body" :class="{writeani:ani}">
    <header class="guide-header">
      <span class="write-icon learn-icon"></span> {{ $t('guide.write') }}
    </header>
    <section class="guide-container">
      <div class="sentence-box">
      </div>
      <div class="stage f-cb f-usn">
        <div v-for="(type, index) in typeList" :key="index" ref="type" v-show="show" :class="['f-cb', type, {current:cur==index}]">
          <transition name="fade" mode="out-in">
            <component :is="'form-'+type" :data="list[index]" :no-record="true" ref="compent"></component>
          </transition>
        </div>
      </div>
    </section>
    <guide-bottom :page="'write'" :disabled="disabled"></guide-bottom>
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
      if (page === 'write') {
        this.$data.ani = 'ani'
        setTimeout(() => {
          this.$el.querySelector('.sentence-box').remove()
        }, 300)
        this.$parent.$emit('changePage', page)
      } else {
        this.$data.ani = ''
      }
      return false
    })

    this.$on('show-com', () => {
      this.show = true
    })

    this.$on('hide-com', () => {
      this.show = false
    })

    this.$on('resize', () => {
      !this.finished && new DrawMask().resize(() => this.showTip())
    })

    this.$on('startInit', () => {
      let that = this
      Sound.setSnd(this.sound.url)
      new DrawMask().disable()
      Sound.play(() => {
        setTimeout(() => {
          new DrawMask().enable()
          this.finished = false
          this.$parent.$emit('next-component')
          setTimeout(() => {
            that.showTip()
            this.disabled = false
          }, 500)
        }, 1000)
      })
    })
  },
  methods: {
    showTip () {
      let mask = new DrawMask()
      let rightDom = $('.writewords', $('.module-write'))[0]
      console.log(rightDom)
      let { top, left, width, height } = rightDom.getClientRects()[0]

      mask.showRect({
        top: top - 50,
        left,
        width,
        height
      })

      mask.showRect({
        top: top - 50,
        left,
        width,
        height
      })

      // 显示点击手势
      mask.showGesture({
        left: left + width / 4,
        top: top + height - 40
      })

      mask.on('mousemove').on('click', () => {
        $(rightDom)
          .find('input')
          .focus()
        mask.off('mousemove').off('click')
        mask.hideMask()
        this.finished = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.module-write {
  z-index: 93;
  padding-top: 0;
  height: 554px;
  .guide-header {
    font-size: 18px;
    height: 105px;
    line-height: 105px;
  }
  .write-icon {
    background: url("../../../../static/images/user-guide/guide-write.png") 0 0
      no-repeat;
    width: 36px;
    height: 32px;
    margin-top: 39px;
    margin-right: 10px;
  }
  .guide-container {
    height: 378px;
  }
}
</style>
