<template>
  <div class="trumpet" @click="play">
    <i :class="{'playing': isPlaying}"></i>
  </div>
</template>

<script>
import soundCtrl from '../../../plugins/soundCtrl'
export default {
  props: ['sound'],
  data () {
    return {
      isSlow: false,
      isPlaying: false
    }
  },
  created () {
    this.$on('init', (form, cb) => {
      if (form) {
        soundCtrl.setSnd(form.sound)
      } else {
        soundCtrl.setSnd(this.sound)
      }
      this.isPlaying = true
      soundCtrl.play(() => {
        this.isPlaying = false
        if (cb) {
          cb()
        }
      })
    })

    this.$on('break', () => {
      this.break()
    })
  },
  methods: {
    play (flag) {
      this.isPlaying = true
      let rate = 1
      if (flag) {
        rate = 1
      }
      if (this.isSlow) {
        rate = 0.75
      }
      soundCtrl.setRate(rate)
      soundCtrl.play(this.break)
      this.isSlow = !this.isSlow
    },
    break () {
      console.log('break')
      this.isSlow = false
      this.isPlaying = false
      soundCtrl.setRate(1)
      soundCtrl.pause()
      soundCtrl.setCurrentTime(0)
    }
  }
}
</script>
