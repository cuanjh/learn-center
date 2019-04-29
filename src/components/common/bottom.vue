<template>
  <div class="bottom">
    <div class="content">
      <div class="copyright">北京酷语时代教育科技有限公司 版权所有 @2016</div>
      <div class="right">
        <router-link :to="{path: '/auth/auth-agreement'}" target="_blank">使用条款 | 隐私政策</router-link>
        /
        <a href="javascript:;">帮助</a>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bottom {
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-top: 1px solid rgba(106,135,142,0.28);
  .content {
    width: 1180px;
    margin: 0 auto;
    padding-top: 20px;
    .copyright {
      float: left;
      font-size: 14px;
      font-weight: 400;
      color: #6A878E;
    }
    .right {
      float: right;
      font-size: 14px;
      font-weight: 400;
      color: #3C5B6F
    }
  }
}
</style>
