<template>
  <div class="next" @click="next">
    <i></i>
  </div>
</template>

<script>
export default {
  methods: {
    next () {
      this.$emit('next')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
