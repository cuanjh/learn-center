<template>
  <div class='progress'>
     <div class="progress-bar-container">
      <span class="prev" v-if="slideList.length>12" @click="tab(-1)"></span>
      <div class="progress-bar">
        <b
          v-for="(item, index) in slideList"
          :key="index"
          :class="{great:item>=0&&item<1,perfect:item==1,current:index==curSlide}"
          @click="switch_slide(index)"
        >{{ index+1 }}</b>
      </div>
      <span class="next" v-if="slideList.length>12" @click="tab(1)"></span>
    </div>
    <div class="btn back" @click="back"><b></b>{{$t("progress.back")}}</div>
    <div class="btn switch" @click="phoneticize_switch" v-if="p_switch">
      <a :class="{active:!switch_idx}">{{switch_text[0]}}</a>
      <a :class="{active:switch_idx==1}">{{switch_text[1]}}</a>
    </div>
    <div class="btn pasue" @click="pause"><b></b>{{$t("progress.pause")}}</div>
    <div class="btn smenu" @click="menu" style="display:none"><b></b></div>
    <div class="vertical-btn f-cb" v-show="menu_show">
        <button class="btn s-qq" id="s-customer" style="display: none;"><span></span>{{$t("progress.qq")}}</button>
        <button class="btn s-sound" @click="sound"><span></span>{{$t("progress.speach")}}</button>
        <a class="btn s-help" target="help"><span></span>{{$t("progress.help")}}</a>
        <button class="btn s-feedback" @click="feedback"><span></span>{{$t("progress.feedback")}}</button>
        <button class="btn s-teacher" @click="teacher"><span></span>{{$t("progress.teacher")}}</button>
    </div>
    <!-- <feed-back style="display:none" :url="feedURL"></feed-back> -->
  </div>
</template>

<script>
// import FeedBack from '../feed-back/feed-back.vue'

import { mapState } from 'vuex'
import $ from 'jquery'

export default {
  props: ['slideList', 'curSlide'],
  name: 'progress-bar',
  components: {
    // FeedBack
  },
  data () {
    return {
      // switch: Config.switch,
      switch_idx: 0,
      menu_show: false, // 按钮文字是否显示
      // switch_text: this.switch_text, //  切换按钮文字
      // url: this.URL.help, // 帮助连接
      feedURL: '', // 反馈的路径
      viewNum: 12, // 展示题目选择按钮的个数
      width: 50, // 每一个按钮的宽度
      offset: null // 手动设置的偏移量，服务于题目页码的翻页
    }
  },
  computed: {
    ...mapState(['p_switch', 'switch_text', 'apiPath', 'switch_state']),
    currentSlide () {
      return this.$parent.$data.cur_slide
    },
    maxOffset () {
      // 允许的最大偏移量
      return (this.data.length - this.viewNum) * this.width
    },
    autoOffset () {
      var num = this.viewNum
      var width = this.width
      var max = this.maxOffset

      if (this.data.length <= num) {
        return (num - this.data.length) / 2 * width
      } else {
        if (this.currentSlide > num / 2) {
          return -Math.min((this.currentSlide - num / 2) * width, max)
        } else {
          return 0
        }
      }
    },
    computedOffset () {
      // 如果有值，手动替换值优先级高于自动
      return this.offset !== null ? this.offset : this.autoOffset
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.width = $('.progress b').outerWidth(true)
    })
    // 菜单，返回等按钮的点击以及hover效果   css无法添加，用js手动添加
    $('.progress.TLY .btn').mousedown((event) => {
      event.preventDefault()
      $(this).addClass('click')
    })
    $(window).mouseup((event) => {
      $('.progress.TLY .btn').removeClass('click')
    })

    $('.progress.TLY>.btn').hover(
      () => {
        $(this)
          .stop()
          .clearQueue()
          .animate({ top: '-30' }, 200)
      },
      () => {
        $(this)
          .stop()
          .clearQueue()
          .animate({ top: '-20' }, 200)
      }
    )
    $('.progress>.btn')
      .not($('.progress.TLY>.btn'))
      .hover(
        () => {
          $(this).css(
            'background',
            'linear-gradient(0deg, #59b3ff 0%, #4e9ef6 100%)'
          )
        },
        () => {
          $(this).css('background', '#b7bed4')
        }
      )
    // BizQQWPA.addCustom({
    //     aty: '0',
    //     a: '0',
    //     nameAccount: 800097949,
    //     selector: 's-customer'
    // })
  },
  methods: {
    switch_slide (index) {
      console.log('switch-slide:' + index)
      // 点选题目页码后，清空页码手动位移量，自动调整
      this.offset = null
      if (index !== this.curSlide) {
        this.$parent.$emit('switch-slide', index)
      }
    },
    back () {
      console.log(11111)
      this.$parent.$emit('exit', 'back-content')
      // this.$dispatch('back-content')
    },
    pause () {
      console.log(1)
      this.$parent.$emit('component-pause')
      console.log(2)
    },
    menu () {
      this.menu_show = !this.menu_show
    },
    phoneticize_switch () {
      this.$data.switch_idx = !this.$data.switch_idx
      this.switch_state = !this.switch_state
      this.$dispatch('change-switch')
    },
    sound () {
      this.$parent.$emit('sound_setting')
      this.menu_show = !this.menu_show
    },
    teacher () {
      this.$parent.$emit('teacher_setting')
      this.menu_show = !this.menu_show
    },
    feedback () {
      this.feedURL = window.location.href
        .split('/')
        .slice(5)
        .join('/')
      this.$dispatch('open-feedback')
    },
    qq () {},
    tab (direction) {
      // 手动进行题目页码翻页
      var max = this.maxOffset
      if (this.offset !== null) {
        this.offset = this.offset - direction * this.viewNum * this.width
      } else {
        this.offset = this.autoOffset - direction * this.viewNum * this.width
      }
      this.offset = Math.min(Math.max(this.offset, -max), 0)
    }
  },
  created () {
    this.$on('other-click', (target) => {
      if (
        target.tagName === 'B' &&
        $(target)
          .parent()
          .hasClass('smenu')
      ) {
        return
      }
      if ($(target).hasClass('smenu')) {
        return
      }
      this.menu_show = false
    })
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/progress_tly.less';
.progress {
  height: 50px;
  position: fixed;
  bottom: 0;
  // line-height: 50px;
  text-align: center;
  width: 100%;
  left: 0;
  z-index: 1;
  //progress中每一个进度按钮
  .progress-bar-container {
    width: 312px;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    & > span {
      display: block;
      width: 20px;
      height: 30px;
      margin: 10px;
      position: absolute;
      top: 0;
      background: url("../../../static/images/learnSystem/progress/left.png") no-repeat center;
      &:hover {
        cursor: pointer;
        background-image: url("../../../static/images/learnSystem/progress/left-hover.png");
      }
      &.prev {
        left: -40px;
      }
      &.next {
        right: -40px;
        transform: rotateY(180deg);
      }
    }
  }
  .progress-num {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 300;
    color: #54a3fc;
  }
  .progress-bar {
    width: 312px;
    height: 500x;
    line-height: 45px;
    display: inline-block;
    transition-duration: 300ms;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    b {
      flex-shrink: 0;
      display: inline-block;
      border-radius: 50%;
      background-color: #c8cdde;
      color: #ffffff;
      width: 18px;
      height: 18px;
      margin: 0 4px;
      transition: all 0.3s ease;
      font-weight: bolder;
      // margin-top: 17px;
      line-height: 18px;
      font-family: "宋体";
      &.perfect {
        background-color: #1ec8ba;
        cursor: pointer;
      }
      &.great {
        background-color: #f4b401;
        // color: #f4b401;
        cursor: pointer;
      }
      &.current {
        position: relative;
        &:after {
          content: "";
          border: 4px solid #c8cdde;
          position: absolute;
          width: 26px;
          height: 26px;
          top: -4px;
          left: -4px;
          border-radius: 50%;
          // opacity: 0.5;
        }
      }
      &.progress-grade {
        transition: none;
        font-size: 14px;
        top: 0px;
        font-weight: 200;
        line-height: 24px;
        width: 24px;
        height: 24px;
        background-color: #fff;
        color: #000;
        margin: 0 8px;
        .num {
          display: block;
          height: 16px;
          font-size: 14px;
          line-height: 16px;
          font-weight: 300;
          color: #54a3fc;
          position: absolute;
          top: 44px;
          left: 0;
        }
        &:after {
          content: "";
          border: 3px solid #c8cdde;
          position: absolute;
          width: 24px;
          height: 24px;
          top: -3px;
          left: -3px;
          border-radius: 50%;
          opacity: 0.5;
        }
        &.current {
          font-weight: 200;
          line-height: 34px;
          width: 34px;
          height: 34px;
          background-color: #54a3fc;
          color: #fff;
          margin: 0 8px;
          &:after {
            content: "";
            border: 6px solid #54a3fc;
            position: absolute;
            width: 34px;
            height: 34px;
            top: -6px;
            left: -6px;
            border-radius: 50%;
            opacity: 0.5;
          }
        }
      }
    }
  }
}
.p-pk {
  & > b {
    position: relative;
    top: -10px;
    cursor: default;
  }
  img {
    display: inline-block;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin: 0 10px;
  }
  .btn {
    top: 5px !important;
  }
  .timer {
    // background-color: @main-color;
    padding: 0 10px;
    font-size: 20px;
    // color: @main-color;
    margin: 0 10px;
    border-radius: 20px;
    display: inline-block;
    position: relative;
    top: -10px;
    height: 35px;
    transition: all 0.3s ease;
    width: 55px;
    line-height: 35px;
    span {
      color: #fff;
      position: relative;
      z-index: 111;
    }
  }
  .grade-timer {
    position: absolute;
    top: 0px;
    right: 50px;
    border-radius: 3px;
  }
  .warning {
    background-color: #f4b401;
  }
  .error {
    background-color: #e55a23;
  }
  .warning,
  .error {
    &:after {
      content: "";
      position: absolute;
      top: 0;
      padding: 0 10px;
      left: 0;
      height: 35px;
      width: 55px;
      border-radius: 20px;
      animation-name: diffuse;
      animation-duration: 1000ms;
      animation-delay: 0;
      animation-iteration-count: infinite;
    }
  }
  .warning {
    &:after {
      background: #f4b401;
    }
  }
  .error {
    &:after {
      background: #e55a23;
    }
  }
}

/* ==========================================================================
    setting
   ========================================================================== */

.progress {
  .btn {
    border-radius: 3px;
    background: #b7bed4;
    font-size: 1.3em;
    padding: 10px;
    color: #fff;
    position: absolute;
    cursor: pointer;
    line-height: 18px;
    top: 0;
    // height: 18px;
    b {
      border-radius: 0;
      display: inline-block;
      position: relative;
      margin-top: 4px;
    }
  }
  .back {
    left: 50px;
    b {
      background: url(../../../static/images/learnSystem/progress/back.png);
      width: 7px;
      height: 11px;
      margin-right: 5px;
    }
  }
  .smenu {
    right: 40px;
    b {
      background: url(../../../static/images/learnSystem/progress/hamburg.png);
      width: 18px;
      height: 13px;
    }
  }
  .switch {
    padding: 0;
    right: 165px;
    background: #e9ecf6;
    border: 1px solid #b7bed4;
    height: 36px;
    a {
      color: #b7bed4;
      display: inline-block;
      width: 38px;
      height: 37px;
      line-height: 37px;
      text-align: center;
      &.active {
        background: #b7bed4;
        color: #fff;
      }
    }
    &:hover {
      background: #e9ecf6;
      a {
        &.active {
          background: linear-gradient(0deg, #59b3ff 0%, #4e9ef6 100%);
        }
      }
    }
  }
  .pasue {
    right: 90px;
    b {
      background: url(../../../static/images/learnSystem/progress/pause.png);
      width: 10px;
      height: 12px;
      margin-right: 5px;
    }
  }
}

@keyframes diffuse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@import "../../../static/less/setting.less";
</style>
