<template>
  <div :class="['form', form.form_show_type]" @click="check">
    <img :src="form.image" alt="">
  </div>
</template>

<script>
import soundCtrl from '../../../plugins/soundCtrl'
export default {
  props: ['form'],
  created () {
    this.$on('play', () => {
      this.playAudio()
    })
  },
  methods: {
    check () {
      this.$parent.$emit('check', this.form)
    },
    playAudio () {
      soundCtrl.setSnd(this.form.sound)
      soundCtrl.play(this.exit)
    },
    exit () {
      soundCtrl.pause()
      soundCtrl.setCurrentTime(0)
      this.$parent.$emit('playNext')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
