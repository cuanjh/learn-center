<template>
  <div class="introduce-app">
    <div class="introduce-app-cont">
      <div class="introduce-app-img"></div>
      <div class="ios-google">
        <i class="ios" @click="goDownLoadIos()"></i>
        <i class="google" @click="goDownLoadGoogle()"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    goDownLoadIos () {
      window.open('https://itunes.apple.com/cn/app/%E5%85%A8%E7%90%83%E8%AF%B4-talkmate-%E8%8B%B1%E8%AF%AD%E6%97%A5%E8%AF%AD%E9%9F%A9%E8%AF%AD%E7%AD%89%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B/id959231176?mt=8')
    },
    goDownLoadGoogle () {
      window.open('https://play.google.com/store/apps/details?id=com.kuyu')
    }
  }
}
</script>
<style lang="less" scoped>
.introduce-app {
  width: 280px;
  height: 200px;
  display: inline-block;
  background: #fff;
  .introduce-app-cont {
    width: 280px;
    background: #fff;
    .introduce-app-img {
      width: 280px;
      height: 220px;
      background: url('../../../static/images/introduceApp/introduceappimg.png') no-repeat center;
      background-size: cover;
    }
    .ios-google {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 12px 20px;
      i {
        border-radius: 5px;
      }
      .ios {
        cursor: pointer;
        display: inline-block;
        width: 114px;
        height: 36px;
        background: url("../../../static/images/introduceApp/iosapp.png") no-repeat center;
        background-size: cover;
        margin-right: 10px;
      }
      .google {
        cursor: pointer;
        display: inline-block;
        width: 114px;
        height: 36px;
        background: url("../../../static/images/introduceApp/google.png") no-repeat center;
        background-size: cover;
      }
    }
  }
}
</style>
