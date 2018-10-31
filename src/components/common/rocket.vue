<template>
  <div class='learn-back-to-top-btn-rocket animated slideInUp' @click='backTop' v-show='rocketShow'>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {
      rocketShow: false
    }
  },
  mounted () {
    let _this = this
    window.onscroll = function () {
      // scrollTop=滚动条相对于其顶部的偏移。
      let _headerDistance = $(window).scrollTop()
      // 是否显示小火箭的功能
      if (_headerDistance >= 100) {
        _this.rocketShow = true
      } else {
        _this.rocketShow = false
      }
    }
  },
  methods: {
    backTop () {
      $('body,html').animate({ scrollTop: 0 }, 200)
    }
  }
}
</script>

<style lang="less" scoped>
  .learn-back-to-top-btn-rocket{
    position: fixed;
    bottom: 100px;
    right: 100px;
    background-image: url('../../../static/images/home/back-top.png');
    background-repeat: no-repeat;
    background-size: cover;
    width: 60px;
    height: 60px;
    cursor: pointer;
    z-index:9999999;
  }
</style>
