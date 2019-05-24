<template>
  <div class="study-container">
    <nav-bar></nav-bar>
  </div>
</template>

<script>
import NavBar from './navBar/index'
export default {
  components: {
    NavBar
  }
}
</script>

<style lang="less" scoped>
.study-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #F1F5F8;
  // background-color: red;
}
.flex {
  display: flex;
  flex-direction: column;
}
</style>
