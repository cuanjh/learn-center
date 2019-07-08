<template>
  <div class="form">
    <div class="img-wrap">
      <next-comp />
      <img :src="form.image" alt="">
      <record-comp />
    </div>
    <div class="content">
      <span class="text">{{ form.sentence }}</span>
      <trumpet-comp ref="trumpet" :sound="form.sound" />
    </div>
  </div>
</template>

<script>
import TrumpetComp from '../common/trumpet'
import RecordComp from '../common/record'
import nextComp from '../common/next'

export default {
  props: ['form'],
  components: {
    TrumpetComp,
    RecordComp,
    nextComp
  },
  created () {
    this.$on('break', () => {
      this.$refs['trumpet'].$emit('break')
    })

    this.$on('init', () => {
      console.log('repeatSpeak init')
      this.$refs['trumpet'].$emit('init')
    })

    this.$on('audioended', () => {
      console.log('repeat audioended')
    })

    this.$on('next', () => {
      this.$parent.$emit('nextForm')
    })
  }
}
</script>

<style lang="less" scoped>

</style>
