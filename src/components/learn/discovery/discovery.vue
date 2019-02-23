<template>
  <div class="discovery-wrap">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  components: {
  },
  mounted () {
    this.$parent.$emit('initLayout')
    this.$parent.$emit('navItem', 'discovery')
  }
}
</script>

<style scoped>
.discovery-wrap {
  /* background: #ecf4f7; */
  width: 100%;
  min-height: 1000px;
  margin-top: -12px;
}
</style>
