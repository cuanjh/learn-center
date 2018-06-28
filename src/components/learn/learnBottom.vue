<style scoped>
  .bottom-box {
    width: 100%;
    height: 90px;
    background-color: #fff;
  }
  .content {
    width: 1200px;
    height: 90px;
    font-size: 14px;
    color: #333333;
    line-height: 90px;
    margin: 0px auto;
  }
  .left {
    float: left;
  }
  .left p {
    float: left;
    margin-right: 30px;
  }
  .right {
    float: right;
  }
  .right * {
    float: left;
  }
  .right i {
    width: 30px;
    height: 30px;
    background: url('./../../../static/img/learn/logo-icon.png');
    background-size: 100%;
    margin-top: 30px;
    margin-left: 30px;
  }
</style>
<template>
  <div class="bottom-box">
    <div class="content">
      <div class="left">
        <p>2018 @ talkmate</p>
        <p>条框 | 隐私</p>
      </div>
      <div class="right">
        <p>帮助 | 联系我们</p>
        <i></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
