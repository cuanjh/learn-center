<template>
  <div class="trumpet" @click="play">
    <i></i>
  </div>
</template>

<script>
import soundCtrl from '../../../plugins/soundCtrl'
export default {
  props: ['sound'],
  data () {
    return {
      isSlow: false
    }
  },
  created () {
    this.$on('init', (form) => {
      if (form) {
        soundCtrl.setSnd(form.sound)
      } else {
        soundCtrl.setSnd(this.sound)
      }
      soundCtrl.play(this.exit)
    })

    this.$on('break', () => {
      this.break()
    })
  },
  methods: {
    play (flag) {
      let rate = 1
      if (flag) {
        rate = 1
      }
      if (this.isSlow) {
        rate = 0.75
      }
      soundCtrl.setRate(rate)
      soundCtrl.play(this.exit)
      this.isSlow = !this.isSlow
    },
    break () {
      console.log('break')
      if (!this.audioElem) return
      this.isSlow = false
      soundCtrl.setRate(1)
      soundCtrl.pause()
      soundCtrl.setCurrentTime(0)
    },
    exit () {
      console.log('audio exit')
      this.$parent.$emit('audioended')
    }
  }
}
</script>
