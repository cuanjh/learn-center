<template>
  <div class="vip-content">
    <div class="vip-img"></div>
    <div class="prompt">
      <span>现在成为会员，12月圣诞好礼，新用户8折！！！</span>
    </div>
    <router-link tag="div" :to="{path: '/app/user/vip'}" class="vip-btn">
      <span>升级会员</span>
    </router-link>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
// vip
.vip-content {
  margin: 15px 0;
  position: relative;
  display: flex;
  padding-top: 13px;
  padding-left: 82px;
  width:960px;
  height:76px;
  // background:linear-gradient(270deg,rgba(250,217,97,1) 0%,rgba(247,107,28,1) 100%);
  background-color: #E84C4CFF;
  box-shadow:0px 3px 10px 0px rgba(5,43,52,0.05);
  border-radius:38px;
  .vip-img {
    width: 63px;
    height: 50px;
    background: url('../../../static/images/course/vipPrompt.svg') no-repeat center;
    background-size: cover;
  }
  .prompt {
    font-size: 16px;
    font-weight: 800;
    color: #fff;
    line-height: 50px;
    margin-left: 32px;
  }
  .vip-btn {
    cursor: pointer;
    position: absolute;
    right: 37px;
    top: 22px;
    width: 140px;
    height: 36px;
    background: #fff;
    border-radius: 20px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:#A92222FF;
    text-align: center;
    line-height: 36px;
  }
}
</style>
