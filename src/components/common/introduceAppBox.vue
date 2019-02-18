<template>
  <div class="introduce-app">
    <div class="introduce-app-cont">
      <div class="introduce-app-img"></div>
      <div class="ios-google">
        <i class="ios"></i>
        <i class="google"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.introduce-app {
  width: 296px;
  height: 200px;
  display: inline-block;
  margin-top: 20px;
  background: #fff;
  .introduce-app-cont {
    width: 296px;
    background: #fff;
    .introduce-app-img {
      width: 296px;
      height: 260px;
      background: pink;
    }
    .ios-google {
      width: 100%;
      display: inline-block;
      text-align: center;
      padding: 12px 20px;
      .ios {
        cursor: pointer;
        display: inline-block;
        width: 114px;
        height: 36px;
        background: url("../../../static/images/ios.svg") no-repeat center;
        background-size: cover;
        margin-right: 10px;
      }
      .google {
        cursor: pointer;
        display: inline-block;
        width: 114px;
        height: 36px;
        background: url("../../../static/images/google.svg") no-repeat center;
        background-size: cover;
      }
    }
  }
}
</style>
