<template>
  <div :class="['form', form.form_show_type]">
    <a @click="check">
      <img :src="form.image" alt="">
    </a>
  </div>
</template>

<script>
export default {
  props: ['form'],
  methods: {
    check () {
      this.$parent.$emit('check', this.form)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
