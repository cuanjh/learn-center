<template>
  <div class="record-save-animat">
    <i></i>
  </div>
</template>

<script>
import $ from 'jquery'
import bus from '../../../../bus'
export default {
  data () {
    return {}
  },
  created () {
    bus.$on('recordAnimate', () => {
      let offset = $('.swiper-slide-active .ise-area .play').offset()
      $('.record-save-animat').css({
        left: offset.left,
        top: offset.top
      })
      $('.record-save-animat').show()
      setTimeout(() => {
        let targetOffest = $('.record-box .record-icon').offset()
        console.log('targetOffest', targetOffest)
        $('.record-save-animat').stop().animate({
          left: targetOffest.left,
          top: targetOffest.top
        }, {
          duration: 800,
          specialEasing: {
            left: 'linear',
            top: 'swing'
          },
          complete: () => {
            $('.record-save-animat').hide()
          }
        })
      }, 10)
    })
  }
}
</script>

<style lang="less" scoped>
.record-save-animat {
  position: absolute;
  display: none;
  z-index: 999999;
  i {
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url('../../../../../static/images/kidcontent/icon-record-list.png') no-repeat center;
    background-size: cover;
  }
}
</style>
