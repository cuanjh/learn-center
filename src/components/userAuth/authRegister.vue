<template>
  <div class="bg-box">
    <div class="resigter-box">
      <div class="mail-resigter">
        <h2>邮箱登录!</h2>
        <div class="item">
          <input type="text" placeholder="邮箱账号" v-model="registerInfo.email">
        </div>
        <div class="item">
          <input type="password" placeholder="输入密码" v-model="registerInfo.emailPwd">
        </div>
        <div class="item">
          <input type="password" placeholder="确定密码" v-model="registerInfo.emailPwd">
        </div>
        <router-link tag="div" to="/auth/login" class="login-pwd">
          <p>已有账号</p>
        </router-link>
        <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
        <button @click="goLogin" v-bind:disabled="!isGoLogin">注册<i></i></button>
        <router-link tag="div" to="/auth/login" class="go-email-register">
          <span>手机注册</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      registerInfo: {
        phone: '',
        imgCode: '',
        email: '',
        emailPwd: ''
      },
      errText: '',
      loading: false
    }
  }
}
</script>

<style lang="less" scoped>
.bg-box {
    min-height: 630px;
    /* background-color: #fcf1d5; */
    background-size: cover;
    padding: 80px 0;
  }
  .resigter-box {
    width: 420px;
    margin: 0 auto;
    padding: 30px 50px;
    border-radius: 5px;
    background-color: #ffffff;
  }
  .mail-resigter {
    border-radius: 5px;
    background-color: #fff;
    margin: 0px auto;
  }
  h2 {
    line-height: 36px;
    font-size: 26px;
    font-weight: 600;
    text-align: center;
    color: #333333;
  }
  input {
    display: block;
    width: 100%;
    height: 40px;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    border: 1px solid #E6EBEE;
    border-radius: 20px;
    background-color: #fff;
    padding: 10px 24px;
  }
  input::-webkit-input-placeholder {
    font-size: 14px;
    color: #D8D8D8;
  }
  input::-moz-placeholder {
    font-size: 14px;
    color: #D8D8D8;
  }
  input:-moz-placeholder {
    font-size: 14px;
    color: #D8D8D8;
  }
  input:-ms-placeholder {
    font-size: 14px;
    color: #D8D8D8;
  }
  .phone-resigter .item, .mail-resigter .item {
    margin-top: 15px;
    overflow: hidden;
    position: relative;
  }
  .phone-resigter .item input, .mail-resigter .item input {
    width: 100%;
    height: 38px;
    border-radius: 84px;
    display: block;
    line-height: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    border:1px solid #E6EBEE;
    border-radius: 84px;
    background-color: #fff;
    padding: 10px 0 10px 21px;
    position: relative;
  }
  button {
    position: relative;
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 84px;
    background-color: #74C105;
    &:hover p {
      display: block;
    }
    p {
      display: none;
      width: 20px;
      height: 20px;
      background: url('../../../static/images/authLogin/going.svg') no-repeat center;
      background-size: cover;
      position: absolute;
      top: 26%;
      left: 60%;
    }
  }
  button:disabled {
    background-color: #D6DFE4;
    cursor: not-allowed;
    &:hover p {
      display: none;
    }
  }
  .go-email-register {
    padding: 31px 0 21px 0;
    text-align: center;
  }
  .go-email-register span {
    cursor: pointer;
    width: 56px;
    height: 14px;
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color:rgba(42,159,228,1);
    line-height: 14px;
    text-decoration: underline;
  }
  .login-pwd {
    width: 100%;
    overflow: hidden;
  }
  .login-pwd p{
    cursor: pointer;
    font-size:14px;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:rgba(153,153,153,1);
    line-height:14px;
    float: right;
    margin-right: 10px;
    padding: 10px 0 25px 0;
    user-select:none;
    &:hover {
      color: #2A9FE4;
    }
  }
</style>
