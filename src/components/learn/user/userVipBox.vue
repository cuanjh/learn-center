<template>
  <div class="vip-content">
    <div  class="prompt">
      <i class="vip-img"></i>
        <span v-if="isVip == 1">您的会员服务(年卡)有效期为：{{startTime}} 至 {{endTime}}</span>
        <span v-else>现在注册成为会员，12月圣诞好礼，新用户80%折！！！</span>
    </div>
    <div @click="goVip()" class="vip-btn">
      <a v-if="isVip == 1">升级会员</a>
      <a v-else>成为会员</a>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Bus from '../../../bus.js'
import cookie from '../../../tool/cookie'
export default {
  props: ['isVip', 'startTime', 'endTime'],
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  methods: {
    goVip () {
      let userId = cookie.getCookie('user_id')
      if (!userId) {
        Bus.$emit('showGoLoginBox')
        return false
      }
      let desc = '成为会员'
      if (this.isVip === 1) {
        desc = '升级会员'
      }
      window._czc.push(['_trackEvent', '学习系统', 'VIP banner', desc, '', '.vip-btn'])
      this.$router.push({ path: '/app/vip-index' })
    }
  }
}
</script>
<style lang="less" scoped>
.vip-content {
  // position: fixed;
  width: 890px;
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px 0 25px;
  height:90px;
  background-color: #ffffff;
  // box-shadow:0px 3px 10px 0px rgba(5,43,52,0.05);
  border-radius:5px;
  border-bottom: 10px solid #f6f8f9;
  .prompt {
    display: flex;
    align-items: center;
    font-size:16px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(253,157,28,1);
    .vip-img {
      display: inline-block;
      width: 66px;
      height: 60px;
      background: url('../../../../static/images/userInfo/vip-icon.svg') no-repeat center;
      background-size: cover;
      margin-right: 6px;
      margin-top: 14px;
    }
  }
  .vip-btn {
    a {
      font-size:14px;
      font-family:PingFang-SC-Bold;
      font-weight:bold;
      color:rgba(255,255,255,1);
      line-height:20px;
      padding: 6px 32px;
      background:linear-gradient(270deg,rgba(254,200,84,1) 0%,rgba(253,157,29,1) 100%);
      border-radius:20px;
      &:hover {
        background:linear-gradient(270deg,rgba(254,200,84,1) 0%,rgba(255,179,78,1) 100%);
      }
    }
  }
}
</style>
