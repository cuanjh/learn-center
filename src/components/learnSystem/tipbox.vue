<template>
  <div id="tipbox-container" v-show="show">
    <div class="tipbox">
      <div class="head">{{$t("tipbox.title")}}</div>
      <div class="body">
        <span>{{tip}}</span>
      </div>
      <div class="footer">
        <div class="btn continue" @click="close">{{$t("tipbox.close")}}</div>
      </div>
    </div>

    <div id='confirm' class="tipbox">
      <div class="head"> {{$t("tipbox.title")}} </div>
      <div class="body">
        <span>{{tip}}</span>
      </div>
      <div class="footer">
        <div class="btn continue" @click="close">{{$t("tipbox.cancel")}}</div>
        <div class="btn continue" @click="ok">{{$t("tipbox.submit")}}</div>
      </div>
    </div>

    <div class="tipbox-tly">
      <div class="body">
        <span>{{tip}}</span>
      </div>
      <div class="footer">
        <div class="btn cancel" @click="close">{{$t("tipbox.cancel")}}</div>
        <div class="btn sure" @click="ok">{{$t("tipbox.submit")}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import $ from 'jquery'
import dialog from '../../plugins/dialog'

export default {
  name: 'tipbox',
  props: ['tip'],
  data () {
    return {
      show: false,
      window: {},
      order: ''
    }
  },
  computed: {
    ...mapState({
      'userInfo': state => state.userInfo
    }),
    isTeacher () {
      return this.userInfo.is_teacher
    }
  },
  created () {
    this.$on('tipbox-show', () => {
      this.window = dialog({
        content: document.querySelector('.tipbox')
      }).showModal()
    })

    this.$on('confirm-show', (param) => {
      this.order = param // 将参数作为指令，随后要传递出去,作为回调函数的识别机制  (通知父组件要调用的event名)
      // 判断是basic还是TLY，更换模板
      this.window = dialog({
        content: this.isTeacher ? $('.tipbox-tly')[0] : $('#confirm')[0]
      }).showModal()
    })
  },
  methods: {
    close () {
      this.window.remove()
      $('#tipbox-container').append($('.tipbox'))
      this.$parent.$emit('component-resume')
    },
    ok () {
      this.window.remove()
      $('#tipbox-container').append($('.tipbox'))
      this.$parent.$emit(this.order)
    }
  }
}
</script>

<style lang="less" scoped>
.tipbox-tly {
  width: 478px;
  height: 320px;
  box-sizing: border-box;
  border: 3px solid #40c0f1;
  border-radius: 6px;
  background-color: #fff;
  font-family: "黑体";
  font-weight: bolder;
  .body {
    height: 202px;
    width: 100%;
    background: url("../../../static/images/learnSystem/tip-bg.png") no-repeat center;
    text-align: center;
    & > span {
      display: inline-block;
      margin-top: 169px;
      font-size: 18px;
      line-height: 34px;
      color: #4f4f4f;
      text-align: center;
    }
  }
  .footer {
    box-sizing: border-box;
    height: 112px;
    width: 100%;
    padding-top: 44px;
    text-align: center;
  }
  .btn {
    box-sizing: border-box;
    display: inline-block;
    width: 120px;
    height: 40px;
    border: 1px solid #1b8cf4;
    border-radius: 18px;
    margin: 0 19px;
    font-size: 16px;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
    &.sure {
      background-color: #fff;
      color: #1b8cf4;
    }
    &.cancel {
      background-color: #55a4fc;
      color: #fff;
    }
  }
}

.feed-back,
.tipbox {
  text-align: center;
  width: 480px;
  background: #fff;
  height: auto;
  border-radius: 4px;
  .head {
    font-size: 1.7em;
    padding: 10px 0;
    background-color: #55a4fc;
    color: #fff;
    border-radius: 4px 4px 0 0;
  }
  .body {
    border-bottom: 1px solid #f0f0f0;
    font-size: 1.2em;
    color: #5a6caf;
    padding: 50px 20px;
    span {
      line-height: 2em;
    }
  }
  .footer {
    .btn {
      display: inline-block;
      margin: 10px 15px;
      border-radius: 3px;
      width: 123px;
      height: 35px;
      font-size: 1.1em;
      line-height: 35px;
      margin-top: 10px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  }
  .continue {
    background-color: #55a4fc;
    color: #fff;
    &:hover {
      background-color: darken(#55a4fc, 5%);
    }
  }
  .cancel {
    color: #b5bccf;
    background-color: #e9ecf6;
    &:hover {
      background-color: darken(#e9ecf6, 3%);
    }
  }
}

// feed-back
.feed-back {
  width: 540px;
  font-size: 0.9em;
  .url-con {
    background: #f1f3fb;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  .body {
    padding: 15px;
  }
  .u-title {
    position: relative;
    &:before,
    &:after {
      content: "";
      width: 200px;
      position: absolute;
      height: 1px;
      display: block;
      background: #f1f3fb;
      top: 10px;
    }
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
  }
  textarea {
    border: 1px solid #c8cee0;
    width: 90%;
    height: 80px;
    border-radius: 4px;
    font-size: 0.9em;
    padding: 10px;
    box-sizing: border-box;
    margin: 20px auto;
  }
  .form-control {
    font-size: 1.1em;
    text-align: left;
    margin: 10px;
    label {
      display: inline-block;
      width: 80px;
      line-height: 30px;
    }
    input {
      width: 380px;
      height: 30px;
      padding: 4px 8px;
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid #c8cee0;
    }
  }
}

.u-check-box {
  padding: 20px;
  .check {
    cursor: pointer;
    display: inline-block;
    margin-right: 20px;
  }
  span {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #c9cfe0;
    border-radius: 50%;
    position: relative;
    top: 3px;
    margin-right: 10px;
    b {
      position: absolute;
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      left: 3px;
      top: 3px;
      background: #3be08d;
      transform: scale(1);
      opacity: 1;
      transition: all 0.3s ease;
    }
    .radio-enter,
    .radio-leave {
      transform: scale(0);
      opacity: 0;
    }
  }
}
</style>
