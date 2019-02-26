<template>
  <div class="mobile-apps">
    <div class="title">Tallkmate Mobile Apps</div>
    <div class="desc">You can learn with talkmate on your smartphone or tablet.</div>
    <div class="link">
      <i></i>
      <router-link :to="{path: '/app/introduce-app'}" target="_blank">
        <span class="more">了解更多</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.mobile-apps {
  // width:580px;
  width: 100%;
  height:210px;
  background:#fff;
  box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
  border-radius:5px;
  // display: inline-block;
  padding: 42px 40px 28px;
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
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 26px;
    color: #0A2B40;
    i {
      display: inline-block;
      width: 108px;
      height: 72px;
      background: url('../../../../static/images/liaojieapp.svg') no-repeat center;
      background-size: cover;
    }
    .more {
      display: inline-block;
      border-radius:18px;
      border:1px solid #90A2AE;
      font-family: PingFang-SC;
      font-size: 14px;
      line-height: 20px;
      padding: 8px 38px;
    }
  }
}
</style>
