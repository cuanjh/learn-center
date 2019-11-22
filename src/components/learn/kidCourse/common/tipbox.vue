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
  </div>
</template>

<script>
import dialog from '../../../../plugins/dialog'

export default {
  props: ['tip'],
  data () {
    return {
      show: false,
      window: {}
    }
  },
  created () {
    this.$on('tipbox-show', () => {
      this.window = dialog({
        content: document.querySelector('.tipbox')
      }).showModal()
    })
  },
  methods: {
    close () {
      this.window.remove()
    }
  }
}
</script>

<style lang="less" scoped>
.tipbox {
  // position: relative;
  text-align: center;
  width: 480px;
  background: #fff;
  height: auto;
  border-radius: 4px;
  // left: 50%;
  // margin-left: -240px;
  // margin-top: -100px;
  // top: 50%;
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
