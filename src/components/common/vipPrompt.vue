<template>
  <div class="vip-content">
    <div  class="prompt">
      <i class="vip-img"></i>
        <span>成为VIP会员，开启畅学新体验！</span>
    </div>
    <!-- <router-link class="vip-btn" :to="{path: 'vip-index'}"></router-link> -->
    <div @click="goVip()" class="vip-btn">
      <a v-if="isVip == 1">升级会员</a>
      <a v-else>成为会员</a>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Bus from '../../bus.js'
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
      if (!this.userInfo || !this.userInfo.member_info) {
        return 0
      }
      console.log('header', this.userInfo.member_info.member_type)
      return this.userInfo.member_info.member_type
    }
  },
  methods: {
    goVip () {
      if (!this.userInfo) {
        Bus.$emit('showGoLoginBox')
        return
      }
      let desc = '成为会员'
      if (this.isVip === 1) {
        desc = '升级会员'
      }
      window.zhuge.track('学习系统-点击进入会员中心', {
        name: desc
      })
      window._czc.push(['_trackEvent', '学习系统', 'VIP banner', desc, '', '.vip-btn'])
      // this.$router.push({ path: '/app/vip-home' })
      let routeUrl = this.$router.resolve({
        path: '/app/vip-home'
      })
      window.open(routeUrl.href, '_blank')
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
    a {
      display: inline-block;
      width: 140px;
      height: 36px;
      background: #fff;
      border-radius: 20px;
      font-size:14px;
      font-weight:600;
      color:#A92222FF;
      text-align: center;
      line-height: 36px;
      &:hover {
        background: rgba(255, 255, 255, .8);
      }
    }
  }
}
</style>
