<template>
  <!-- <div id="tipbox-container" v-show="show">
    <div class="tipbox">
      <div class="head">{{$t("tipbox.title")}}</div>
      <div class="body">
        <span>{{tip}}</span>
      </div>
      <div class="footer">
        <div class="btn continue" @click="close">{{$t("tipbox.close")}}</div>
      </div>
    </div>
  </div> -->
  <div class="prompt-container" v-show="show">
    <div class="promptbox">
      <div class="close-img" @click="close()"></div>
      <div class="head">{{$t("tipbox.title")}}</div>
      <div class="body">
        <span>{{tip}}</span>
      </div>
      <div class="footer">
        <div class="btn continue" @click="close()">{{$t("tipbox.close")}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import bus from '../../../../bus'

export default {
  props: ['tip'],
  data () {
    return {
      show: false
    }
  },
  created () {
    this.$on('tipbox-show', () => {
      console.log(this.tip)
      this.show = true
    })
  },
  methods: {
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.prompt-container {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index:99999999;
  overflow: hidden;
  .promptbox {
    text-align: center;
    width: 480px;
    background: #fff;
    height: auto;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .close-img {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 30px;
    height: 30px;
    background: url('../../../../../static/images/kid/icon-close.png') no-repeat center;
    background-size: cover;
    cursor: pointer;
    &:hover {
      opacity: .8;
    }
  }
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
</style>
