<template>
  <div class="record-save-animat">
    <i></i>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {}
  },
  methods: {
    show () {
      let offset = $('.swiper-slide-active .ise-area .play').offset()
      $('.record-save-animat').css({
        left: offset.left,
        top: offset.top
      })
      $('.record-save-animat').show()
      $('.record-save-animat').stop().animate({
        left: $('body').width() - 156,
        top: 10
      }, {
        duration: 800,
        specialEasing: {
          left: 'linear',
          top: 'linear'
        },
        complete: () => {
          $('.record-save-animat').hide()
        }
      })
    }
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
