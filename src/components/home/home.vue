<style scoped>
  .home-box {
    width: 100%;
    min-height: 100vh;
    background-color: #299fe4;
  }
</style>
<template>
  <div class="home-box">
    <home-head></home-head>
    <router-view class="router-box"></router-view>
    <home-bottom></home-bottom>
  </div>
</template>
<script>
import homeHead from './homeHeader.vue'
import homeBottom from './homeBottom.vue'
export default {
  data () {
    return {}
  },
  components: {
    homeHead,
    homeBottom
  },
  mounted () {
    const routerView = document.querySelector('.router-box')
    const contentHeight = document.documentElement.scrollHeight
    const routerMinHeight = contentHeight - 80 - 330
    routerView.style.minHeight = routerMinHeight + 'px'
  }
}
</script>
