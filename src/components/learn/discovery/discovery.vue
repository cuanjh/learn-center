<template>
  <div>discory</div>
</template>

<script>
export default {
  mounted () {
    this.$parent.$emit('initLayout')
    this.$parent.$emit('navItem', 'discovery')
  }
}
</script>

<style scoped>

</style>
