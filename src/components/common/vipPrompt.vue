<template>
  <div class="vip-content">
    <div class="vip-img"></div>
    <div class="prompt">
      <span>现在成为会员，12月圣诞好礼，新用户8折！！！</span>
    </div>
    <router-link tag="div" :to="{path: '/app/user/vip'}" class="vip-btn">
      <span>立即成为会员</span>
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
  margin-top: 10px;
  position: relative;
  display: flex;
  padding: 20px 50px;
  width:1200px;
  height:90px;
  background:linear-gradient(270deg,rgba(250,217,97,1) 0%,rgba(247,107,28,1) 100%);
  box-shadow:0px 3px 10px 0px rgba(5,43,52,0.05);
  border-radius:5px;
  .vip-img {
    width: 70px;
    height: 50px;
    background: url('../../../static/images/course/vipPrompt.svg') no-repeat center;
    background-size: cover;
  }
  .prompt {
    font-size: 20px;
    color: #fff;
    line-height: 46px;
    margin-left: 16px;
  }
  .vip-btn {
    cursor: pointer;
    position: absolute;
    right: 59px;
    top: 27px;
    width: 140px;
    height: 36px;
    background: #fff;
    border-radius: 20px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(248,124,39,1);
    text-align: center;
    line-height: 36px;
  }
}
</style>
