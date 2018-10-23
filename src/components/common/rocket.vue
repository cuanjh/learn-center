<template>
    <div class='learn-back-to-top-btn-rocket animated slideInUp' @click='backTop' v-show='rocketShow'>
      <img src="../../../static/images/learn-user-btn-rocket.svg">
    </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {
      backTopBtn: false,
      rocketShow: false
    }
  },
  mounted () {
    let _this = this
    window.onscroll = function () {
      // scrollTop=滚动条相对于其顶部的偏移。
      let _headerDistance = $(window).scrollTop()
      // bottomScroll=页面的总高度 - 当前窗口的高度
      let _bottomScroll = $(document).height() - $(window).height()

      // 返回顶部的功能,不过好像已经没有使用了
      if (_headerDistance >= 100) {
        _this.backTopBtn = true
      } else {
        _this.backTopBtn = false
      }
      // 是否显示小火箭的功能
      if (_headerDistance >= window.innerHeight) {
        _this.rocketShow = true
      }
      if (_headerDistance >= 59 && _bottomScroll > 120) {
        _this.learnfixed = true
      } else if (_headerDistance < 59) {
        _this.learnfixed = false
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
    width: 60px;
    height: 85px;
    cursor: pointer;
    z-index:9999999;
  }
</style>
