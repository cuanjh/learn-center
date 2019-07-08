<template>
  <div class="form">
    <div class="img-wrap">
      <img :src="form.image" alt="">
    </div>
    <div class="content">
      <span class="text">{{ form.sentence }}</span>
      <trumpet-comp ref="trumpet" :sound="form.sound" />
    </div>
  </div>
</template>

<script>
import TrumpetComp from '../common/trumpet'
export default {
  props: ['form'],
  components: {
    TrumpetComp
  },
  created () {
    this.$on('init', () => {
      console.log('autospeak init')
      this.$refs['trumpet'].$emit('init')
    })

    this.$on('break', () => {
      this.$refs['trumpet'].$emit('break')
    })

    this.$on('audioended', () => {
      console.log('audioended')
      this.$parent.$emit('nextForm')
    })
  },
  methods: {
    exit () {
    }
  }
}
</script>

<style lang="less" scoped>

</style>
