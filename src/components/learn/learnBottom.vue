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

<style scoped>
  .bottom-box {
    width: 100%;
    height: 60px;
    background-color: #fff;
    border-top: 1px solid rgba(106,135,142,0.28);
    position: relative;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .content {
    width: 1200px;
    height: 60px;
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
    background: url('./../../../static/images/learn/logo-icon.png');
    background-size: 100%;
    margin-top: 15px;
    margin-left: 30px;
  }

  p {
    height: 60px;
    line-height: 60px;
  }
  @media screen and (max-width: 1024px) {
    .content {
      width: 960px;
    }
  }
</style>
