<style>
  body {
    background: #f1f5f8;
  }
  .learn-wrap {
    padding-top: 80px;
  }
</style>
<template>
  <div class="learn-wrap">
    <!-- 头部 -->
    <learn-header></learn-header>
    <router-view></router-view>
    <!-- 底部 -->
    <learn-bottom></learn-bottom>
  </div>
</template>
<script>
import learnHeader from './learnHeader.vue'
import learnBottom from './learnBottom.vue'
export default {
  data () {
    return {}
  },
  components: {
    learnHeader,
    learnBottom
  }
}
</script>
