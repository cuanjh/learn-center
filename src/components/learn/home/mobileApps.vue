<template>
  <div class="mobile-apps">
    <div class="title">Tallkmate Mobile Apps</div>
    <div class="desc">You can learn with talkmate on your smartphone or tablet.</div>
    <div class="link">
      <span class="more">了解更多</span>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.mobile-apps {
  width:580px;
  height:230px;
  background:#fff;
  box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
  border-radius:5px;
  display: inline-block;
  padding-top: 41px;
  padding-left: 47px;
  .title {
    height:22px;
    font-size:16px;
    font-weight:600;
    color:#333333;
    line-height:22px;
  }
  .desc {
    height:20px;
    font-size:14px;
    font-weight:400;
    color:#333333;
    line-height:20px;
  }
  .link {
    margin-top: 80px;
    .more {
      float: right;
      height:36px;
      border-radius:18px;
      border:1px solid #90A2AE;
      padding: 8px 37px;
      font-size:14px;
      font-weight:bold;
      color:#3C5B6F;
      line-height:20px;
      margin-right: 36px;
      cursor: pointer;
    }
  }
}
</style>
