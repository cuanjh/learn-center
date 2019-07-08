<template>
  <div class="form">
    <a @click="check">
      <img :src="form.image" alt="">
    </a>
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
.form {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  a {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
}
</style>
