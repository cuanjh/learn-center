<template>
  <div @click="goOn()">discory</div>
</template>

<script>
export default {
  mounted () {
    this.$parent.$emit('initLayout')
    this.$parent.$emit('navItem', 'discovery')
  },
  methods: {
    goOn () {
      this.$router.push({ path: '/app/headline' })
    }
  }
}
</script>

<style scoped>

</style>
