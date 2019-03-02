<template>
  <div class="user-login" v-show="showLoginBox">
    <div class="login-content">
      <div class="login">
        <div class="img close" @click="close()"></div>
        <div class="img bg-img"></div>
        <p>为了更好的学习体验，请创建个人账号！</p>
        <router-link :to="{path: '/auth/login'}" class="go-login">去创建</router-link>
        <a class="look" @click="close()">暂不创建</a>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from '../../bus'
export default {
  data () {
    return {
      showLoginBox: false
    }
  },
  created () {
    Bus.$on('showGoLoginBox', () => {
      this.showLoginBox = true
    })
  },
  methods: {
    close () {
      this.showLoginBox = false
    }
  }
}
</script>
<style lang="less" scoped>
.user-login {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index: 99;
  .login-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width:560px;
    height:384px;
    background:#CCEBFF;
    box-shadow:0px 5px 12px 0px rgba(0,32,50,0.3);
    border-radius:5px;
    .login {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .img {
        width: 14px;
        height: 14px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .close {
        position: absolute;
        top: 14px;
        right: 14px;
        background-image: url('../../../static/images/authLogin/close-login.svg');
      }
      .bg-img {
        margin-top: 42px;
        width: 140px;
        height: 142px;
        background-image: url('../../../static/images/authLogin/earth.svg');
      }
      p {
        font-size:20px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(23,66,108,1);
        line-height:28px;
        padding: 19px 0 41px;
      }
      .go-login {
        width: 198px;
        height: 36px;
        font-size:14px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:36px;
        text-align: center;
        background:rgba(5,129,209,1);
        border-radius:18px;
        &:hover {
          background: #2A9FE4;
        }
        &:active {
          background:rgba(5,129,209,1);
        }
      }
      .look {
        font-size:14px;
        font-family:PingFang-SC-Medium;
        color:#90A2AE;
        line-height:20px;
        margin-top: 12px;
        &:hover {
          color: #2A9FE4;
        }
        &:active {
          color:#90A2AE;
        }
      }
    }
  }
}
</style>
