<template>
  <div class="float-bar-container">
    <a class="float-bar-item weixin"
      @mouseenter="isFocusWeixin = true"
      @mouseleave="isFocusWeixin = false">
      <transition name="fade">
        <div class="focus-weixin" v-show="isFocusWeixin">
          <p>关注微信公众号</p>
          <p></p>
          <p>扫一扫，关注我！</p>
          <div class="triangle_border_left">
          </div>
        </div>
      </transition>
    </a>
    <a class="float-bar-item weibo" href="https://weibo.com/u/5487063021" target="_blank">
    </a>
    <a class="float-bar-item facebook" v-show="false">
    </a>
    <a class="float-bar-item help"
      @mouseenter="isShowHelp = true"
      @mouseleave="isShowHelp = false">
      <transition name="fade">
        <div class="help-panel" v-show="isShowHelp">
          <p><i></i> 400-068-8056</p>
          <p><i></i> vip@talkmate.com</p>
          <div class="triangle_border_left">
          </div>
        </div>
      </transition>
    </a>
    <a class="float-bar-item top" @click="backToTop()">
    </a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isBackToTop: false,
      isFocusWeixin: false,
      isShowHelp: false
    }
  },
  mounted () {
    let _this = this
    window.onscroll = function () {
      // scrollTop=滚动条相对于其顶部的偏移。
      // /* eslint-disable */
      // let _headerDistance = $(window).scrollTop()
      // /* eslint-enable */
      // // 是否显示小火箭的功能
      // if (_headerDistance >= 100) {
      //   _this.isBackToTop = true
      // } else {
      //   _this.isBackToTop = false
      // }

      /* eslint-disable */
      if ($(document).scrollTop() + $(window).height() + 100 >= $(document).height()) {
        _this.isBackToTop = true
      } else {
        _this.isBackToTop = false
      }
      /* eslint-enable */
    }
  },
  methods: {
    backToTop () {
      /* eslint-disable */
      $('body,html').animate({ scrollTop: 0 }, 200)
      /* eslint-enable */
    }
  }
}
</script>

<style lang="less" scoped>
.float-bar-container {
  position: fixed;
  bottom: 100px;
  right: 10px;
  // background: red;
  z-index: 4;
  white-space: nowrap;
  .float-bar-item {
    position: relative;
    display: block;
    width: 46px;
    height: 46px;
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 1px;
    box-shadow: 0 5px 5px rgba(16, 48, 68,.1);
  }
  .weixin {
    background-image: url('../../../static/images/floatBar/icon-weixin.svg');
    &:hover {
      background-image: url('../../../static/images/floatBar/icon-weixin-hover.svg');
    }
  }
  .weibo {
    background-image: url('../../../static/images/floatBar/icon-weibo.svg');
    &:hover {
      background-image: url('../../../static/images/floatBar/icon-weibo-hover.svg');
    }
  }
  .facebook {
    background-image: url('../../../static/images/floatBar/icon-facebook.svg');
    &:hover {
      background-image: url('../../../static/images/floatBar/icon-facebook-hover.svg');
    }
  }
  .help {
    background-image: url('../../../static/images/floatBar/icon-help.svg');
    &:hover {
      background-image: url('../../../static/images/floatBar/icon-help-hover.svg');
    }
  }
  .top {
    background-image: url('../../../static/images/floatBar/icon-top.svg');
    &:hover {
      background-image: url('../../../static/images/floatBar/icon-top-hover.svg');
    }
  }
  .focus-weixin {
    position: absolute;
    left: -165px;
    top: -31px;
    width:153px;
    height:200px;
    padding: 21px;
    background:rgba(255,255,255,1);
    box-shadow:0px 5px 14px 0px rgba(10,43,64,0.21);
    border-right: 3px solid #2A9FE4;
    border-radius:3px;
    p {
      &:first-child {
        font-size: 16px;
        font-weight: bold;
        color: #103044;
      }
      &:nth-child(2) {
        margin-top: 15px;
        margin-left: 8px;
        width: 95px;
        height: 95px;
        background-image: url('../../../static/images/floatBar/focus-weixin.jpeg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      &:nth-child(3) {
        margin-top: 7px;
        font-size: 14px;
        font-weight: 500;
        color: #7E929F;
        margin-left: 4px;
      }
    }
    /*向左*/
    .triangle_border_left{
      width:0;
      height:0;
      border-width:8px 0 8px 8px;
      border-style:solid;
      border-color:transparent transparent transparent #2A9FE4;/*透明 透明 透明 灰*/
      left: 152px;
      top: 46px;
      position: absolute;
    }
  }
  .help-panel {
    position: absolute;
    left: -172px;
    top: -14px;
    width:160px;
    height:70px;
    background:rgba(255,255,255,1);
    box-shadow:0px 5px 14px 0px rgba(10,43,64,0.21);
    padding-top: 15px;
    border-right: 3px solid #2A9FE4;
    border-radius:3px;
    p {
      font-size: 13px;
      font-weight: 500;
      color: #0A2B40;
      &:first-child {
        i {
          margin: 2px 7px 0 13px;
          display: inline-block;
          width: 14px;
          height: 12px;
          background-image: url('../../../static/images/floatBar/icon-headset.svg');
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
      &:nth-child(2) {
        margin-top: 3px;
        i {
          margin: 5px 7px 0 13px;
          display: inline-block;
          width: 14px;
          height: 12px;
          background-image: url('../../../static/images/floatBar/icon-email.svg');
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    }
    /*向左*/
    .triangle_border_left{
      width:0;
      height:0;
      border-width:8px 0 8px 8px;
      border-style:solid;
      border-color:transparent transparent transparent #2A9FE4;/*透明 透明 透明 灰*/
      left: 159px;
      top: 30px;
      position: absolute;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
