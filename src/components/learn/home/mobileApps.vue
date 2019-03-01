<template>
  <div class="mobile-apps">
    <div class="background-img"></div>
    <div class="content">
      <p class="title">Tallkmate Mobile Apps</p>
      <p class="text">
        <span>You can learn with talkmate on your smartphone or tablet.</span>
        <span>Collaborative learning and topic group chat rooms from</span>
        <span>more than 100 countries,</span>
        <span>this will make learning easier.</span>
      </p>
    </div>
    <div class="link">
      <router-link :to="{path: '/app/introduce-app'}" target="_blank">
        <a class="more">了解更多</a>
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
  position: relative;
  width: 100%;
  height:210px;
  background:#fff;
  box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
  border-radius:5px;
  .background-img {
    width: 100%;
    height: 100%;
    background: url('../../../../static/images/mobileapp/liaojieappbg.svg') no-repeat center;
    background-size: cover;
    border-radius: 5px;
  }
  // 介绍
  .content {
    position: absolute;
    top: 49px;
    left: 422px;
    p {
      display: inline-block;
      height:80px;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:20px;
      span {
        display: inline-block;
        width: 100%;
      }
    }
    p:nth-child(1) {
      width:386px;
      width:175px;
      height:22px;
      font-size:16px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(51,51,51,1);
      line-height:22px;
    }
  }
  // 了解
  .link {
    position: absolute;
    right: 37px;
    bottom: 28px;
    padding-top: 26px;
    color: #0A2B40;
    .more {
      display: inline-block;
      border-radius:18px;
      border:1px solid #90A2AE;
      font-family: PingFang-SC;
      font-weight: 600;
      font-size: 14px;
      color: #0A2B40;
      line-height: 20px;
      padding: 8px 38px;
      &:hover {
        color: #2A9FE4;
        border: 1px solid #2A9FE4;
      }
    }
  }
}
</style>
