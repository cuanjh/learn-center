<template>
  <div :class="['form', form.form_show_type]">
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
      this.$parent.$emit('setStudyFormScore', {formCode: this.form.code, score: 1})
      this.$refs['trumpet'].$emit('init', false, () => {
        this.$parent.$emit('nextForm')
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
