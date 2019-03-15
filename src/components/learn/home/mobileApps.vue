<template>
  <div class="mobile-apps">
    <div class="background-img"></div>
    <div class="content">
      <!-- <p class="title">Tallkmate Mobile Apps</p> -->
      <p>Talkmate-全球说移动应用程序</p>
      <p class="text">
        <!-- <span>You can learn with talkmate on your smartphone or tablet.</span>
        <span>Collaborative learning and topic group chat rooms from</span>
        <span>more than 100 countries,</span>
        <span>this will make learning easier.</span> -->
        <span>你可以通过智能手机或平板电脑与语伴学习。</span>
        <span>来自一百多个国家的语伴学习互助和主题群聊室，让学习更容易。</span>
      </p>
    </div>
    <div class="link">
      <a href="javascript:;" @click="learnMore()" class="more">
        <span>了解更多</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    learnMore () {
      window._czc.push(['_trackEvent', '学习系统', '首页', 'app了解更多', '', '.more'])
      let routeData = this.$router.resolve({path: '/app/introduce-app'})
      window.open(routeData.href, '_blank')
    }
  }
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
    left: 382px;
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
      height:30px;
      font-size:18px;
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
