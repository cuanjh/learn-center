<template>
  <div class="vip-content">
    <div  class="prompt">
      <i class="vip-img"></i>
        <span>现在成为会员，12月圣诞好礼，新用户8折！！！</span>
    </div>
    <!-- <router-link class="vip-btn" :to="{path: 'vip-index'}"></router-link> -->
    <router-link tag="div" :to="{path: '/app/user/vip'}" class="vip-btn">
      <span v-if="isVip === 0">成为会员</span>
      <span v-if="isVip === 1">升级会员</span>
    </router-link>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {}
  },
  mounted () {
    console.log('isvip', this.isVip)
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    isVip () {
      if (!this.userInfo.member_info) {
        return 0
      }
      console.log('header', this.userInfo.member_info.member_type)
      return this.userInfo.member_info.member_type
    }
  }
}
</script>
<style lang="less" scoped>
// vip
.vip-content {
  margin: 20px 0;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height:76px;
  // background:linear-gradient(270deg,rgba(250,217,97,1) 0%,rgba(247,107,28,1) 100%);
  background-color: #E84C4CFF;
  box-shadow:0px 3px 10px 0px rgba(5,43,52,0.05);
  border-radius:5px;
  .prompt {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 800;
    color: #fff;
    line-height: 50px;
    .vip-img {
      display: inline-block;
      width: 63px;
      height: 50px;
      background: url('../../../static/images/course/vipPrompt.svg') no-repeat center;
      background-size: cover;
      margin-right: 32px;
    }
  }
  .vip-btn {
    cursor: pointer;
    width: 140px;
    height: 36px;
    background: #fff;
    border-radius: 20px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:500;
    color:#A92222FF;
    text-align: center;
    line-height: 36px;
  }
}
</style>
