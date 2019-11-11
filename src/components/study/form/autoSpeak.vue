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
import bus from '../../../bus'
export default {
  props: ['form'],
  components: {
    TrumpetComp
  },
  created () {
    this.$on('init', () => {
      console.log('autospeak init')
      this.$refs['trumpet'].$emit('init', false, () => {
        this.$parent.$emit('nextForm')
        bus.$emit('setStudyFormScore', {formCode: this.form.code, score: 1})
        console.log(this.form)
      })
    })

    this.$on('break', () => {
      this.$refs['trumpet'].$emit('break')
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
