<template>
  <div class="user-login-pwd">
    <div class="go-phone-login" v-show="type == 2">
      <div class="bg-img" @click="goAuthLogin()"></div>
    </div>
    <h2 v-text="type == 2 ?'邮箱登录!':'密码登录!'"></h2>
    <input  class="input_text" type="text"
            :placeholder="type == 2 ?'请输入正确的邮箱':'请输入手机号'"
            v-model="userName"
            @blur.prevent="blurPEFn()"
            @keyup.enter="goLogin">
    <input  class="input_text"
            type="password"
            @blur.prevent="blurPwdFn()"
            placeholder="输入密码"
            v-model="userPwd"
            @keyup.enter="goLogin">
    <div class="auto-forget">
      <!-- <p class="go-registered">
        <router-link to="/auth/register"><span>没有账号！去注册</span></router-link>
      </p> -->
      <div class="auto-content">
        <div class="auto-login" :class="{'checked': isSaveLoginState}" @click="isSaveLoginState = !isSaveLoginState">
          <i></i>
          <span :class="{'checked':isSaveLoginState}">记住密码</span>
        </div>
        <p class="forget">
          <router-link :to="{path: '/auth/forget/' + type}"><span>忘记密码了!</span></router-link>
        </p>
      </div>
      <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
      <button @click="goLogin()" v-bind:disabled="!isGoLogin">
        <p>
          登录
          <i></i>
        </p>
      </button>
    </div>
    <div class="email-login">
      <p v-show="type == 1" @click="goAuthLogin()">验证码登录</p>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import validation from './../../tool/validation.js'
import { encrypt } from './../../tool/untils.js'
import Cookie from '../../tool/cookie'
import errCode from './../../api/code.js'
import $ from 'jquery'
// import Cookies from 'js-cookie'

export default {
  props: ['type'], // 1手机密码登录 2邮箱登录
  data () {
    return {
      userName: '', // 输入的用户手机或邮箱
      userPwd: '', // 输入的密码
      errText: '', // 错误信息提示
      isSaveLoginState: false // 记住密码
    }
  },
  mounted () {
    console.log('type', this.type)
    let checked = JSON.parse(Cookie.getCookie('isChecked'))
    console.log('checked', checked)
    if (checked === true) {
      let userNameOld = Cookie.getCookie('userName')
      let userPwdOld = Cookie.getCookie('userPwd')
      this.userName = userNameOld
      this.userPwd = userPwdOld
      this.isSaveLoginState = true
    } else {
      Cookie.delCookie('userName')
      Cookie.delCookie('userPwd')
      this.userName = ''
      this.userPwd = ''
      this.isSaveLoginState = false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    isGoLogin () {
      return this.userName && this.userPwd
    }
  },
  methods: {
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateIsLogin: 'user/updateIsLogin',
      updateUserInfo: 'user/updateUserInfo'
    }),
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
      login: 'user/login',
      userPwdLogin: 'userPwdLogin'
    }),
    // 失去焦点
    blurPEFn () {
      if (validation.phoneNumber(this.userName)) {
        $('input[type="text"]').css('border-color', '#E6EBEE')
        this.errText = ''
        return false
      }
      if (validation.email(this.userName)) {
        $('input[type="text"]').css('border-color', '#E6EBEE')
        this.errText = ''
        return false
      }
    },
    blurPwdFn () {
      if (validation.pwd(this.userPwd)) {
        $("input[type='password']").css('border-color', '#E6EBEE')
        this.errText = ''
        return false
      }
    },
    // 切换到手机验证码登录
    goAuthLogin () {
      this.$emit('updateType', 0)
    },
    async goLogin () {
      let _this = this
      _this.errText = ''
      if (this.type === 1) {
        if (!validation.phoneNumber(_this.userName)) {
          _this.errText = errCode['er01']
          $('input[type="text"]').css('border-color', '#D0021B')
          return false
        }
      } else {
        if (!validation.email(_this.userName)) {
          _this.errText = errCode['er05']
          $('input[type="text"]').css('border-color', '#D0021B')
          return false
        }
      }
      /* if (!validation.phoneNumber(_this.userName) && !validation.email(_this.userName)) {
        _this.errText = errCode['e06']
        return false
      } */
      if (!validation.pwd(_this.userPwd)) {
        _this.errText = errCode['er04']
        $('input[type="password"]').css('border-color', '#D0021B')
        return false
      }
      // let flag = true
      await _this.userPwdLogin({
        identity: _this.userName,
        password: encrypt(_this.userPwd)
      }).then(res => {
        console.log('res', res)
        // if (res.success) {
        //   if (_this.isSaveLoginState) {
        //     Cookie.setCookie('user_id', res.user_id)
        //     Cookie.setCookie('verify', res.verify)
        //     Cookie.setCookie('userName', _this.userName)
        //     Cookie.setCookie('userPwd', _this.userPwd)
        //   } else {
        //     Cookie.delCookie('user_id', res.user_id)
        //     Cookie.delCookie('verify', res.verify)
        //     Cookie.delCookie('userName', _this.userName)
        //     Cookie.delCookie('userPwd', _this.userPwd)
        //   }
        //   localStorage.removeItem('userInfo')
        //   Cookie.delCookieTalkmate('is_anonymous')
        //   Cookie.delCookie('user_id')
        //   Cookie.delCookie('verify')
        //   /* if (_this.isSaveLoginState) {
        //     Cookie.setCookieAuto('user_id', res.user_id)
        //     Cookie.setCookieAuto('verify', res.verify)
        //   } else {
        //     Cookie.setCookieSession('user_id', res.user_id)
        //     Cookie.setCookieSession('verify', res.verify)
        //   } */
        //   Cookie.setCookie('isChecked', _this.isSaveLoginState)
        //   Cookie.setCookie('user_id', res.user_id)
        //   Cookie.setCookie('verify', res.verify)
        //   // Cookie.setCookie('userName', _this.userName)
        //   // Cookie.setCookie('userPwd', _this.userPwd)
        //   let UserId = Cookie.getCookie('user_id')
        //   let lastUserId = localStorage.getItem('last_user_id')
        //   if (lastUserId !== UserId) {
        //     localStorage.setItem('lastUserId', UserId)
        //     localStorage.removeItem('lastCourseCode')
        //   }
        // } else {
        //   _this.errText = errCode[res.code]
        //   flag = false
        // }
      })
      // if (flag) {
      //   let lastCourseCode = localStorage.getItem('lastCourseCode')
      //   if (!lastCourseCode) {
      //     await _this.getUserInfo()
      //     _this.updateCurCourseCode(_this.userInfo.current_course_code)
      //     localStorage.setItem('lastCourseCode', _this.userInfo.current_course_code)
      //     _this.updateIsLogin('1')
      //     _this.$router.push({path: '/app/course-list'})
      //   } else {
      //     _this.updateCurCourseCode(lastCourseCode)
      //     _this.updateIsLogin('1')
      //     _this.$router.push({path: '/app/course-list'})
      //   }
      // }
    }
  }
}
</script>

<style lang="less" scoped>
  a {
    text-decoration: none;
  }
  .user-login-pwd {
    position: relative;
    width: 380px;
    /* height: 376px; */
    border-radius: 5px;
    background-color: #fff;
    margin: 0px auto;
    padding: 40px 40px 0px;
  }
  .user-login-pwd .go-phone-login {
    width: 42px;
    height: 42px;
    position: absolute;
    right: 14px;
    top: 14px;
    cursor: pointer;
    .bg-img {
      width: 42px;
      height: 42px;
      background: url('../../../static/images/authLogin/phone.svg') no-repeat center;
      background-size: cover;
    }
    .bg-img:hover {
      width: 42px;
      height: 42px;
      background: url('../../../static/images/authLogin/phoneHover.svg') no-repeat center;
      background-size: cover;
      animation: seconddiv 1.5s ease-in-out;
    }
  }
  @keyframes seconddiv{
    0% {transform: scale(1.1,1.1);}
    30% {transform: scale(1,1);}
    60% {transform: scale(1.1,1.1);}
    100% {transform: scale(1,1);}
  }
  h2 {
    line-height: 36px;
    font-size: 26px;
    font-weight: 600;
    text-align: center;
    color: #333;
  }
  .user-login-pwd .input_text {
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
    color: #D6DFE4;
  }
  input::-moz-placeholder {
    font-size: 14px;
    color: #D6DFE4;
  }
  input:-moz-placeholder {
    font-size: 14px;
    color: #D6DFE4;
  }
  input:-ms-placeholder {
    font-size: 14px;
    color: #D6DFE4;
  }
  input[type="text"] {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  input[type="password"] {
    margin-bottom: 6px;
  }
  button {
    position: relative;
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 84px;
    background-color: #74C105;
    margin-top: 52px;
    p {
      width: 80px;
      margin: 0 auto;
      i {
        display: none;
        width: 20px;
        height: 20px;
        background: url('../../../static/images/authLogin/going.svg') no-repeat center;
        background-size: cover;
        float: right;
        margin-top: 2px;
      }
    }
    &:hover i {
      display: block;
    }
  }
  button:disabled {
    background-color: #D6DFE4;
    cursor: not-allowed;
    &:hover i {
      display: none;
    }
  }
  .auto-forget {
    position: relative;
    font-size: 14px;
    overflow: hidden;
  }
  .auto-forget .auto-login {
    width: 110px;
    color: #B2C0C9;
    font-size: 14px;
    overflow: hidden;
    user-select: none;
    display: flex;
    justify-content: start;
    align-items: center
  }
  .auto-forget .auto-login .input_check {
    cursor: pointer;
    display: block;
    width: 16px;
    height: 16px;
    border: 1px solid #E6EBEE;
    border-radius: 20px;
    background-color: #fff;
    appearance: checkbox;
    -webkit-appearance: checkbox;
  }
  .auto-forget .auto-login .labell {
    cursor: pointer;
    position: absolute;
    margin-left: 20px;
    font-size: 16px;
    color: #B2C0C9;
  }
  .auto-forget .auto-login i {
    display: inline-block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid #B5C2CB;
    margin-left: 10px;
    margin-right: 10px;
    &:hover {
      border-color: #2A9FE4;
    }
  }
  .auto-forget .auto-login.checked i {
    background: url('./../../../static/images/home/checkbox-ok.svg') #2A9FE4 no-repeat center center;
  }
  .auto-forget .auto-login.checked span:hover {
    cursor: pointer;
  }
  .auto-forget .auto-login.checked span.checked {
    background: #ffffff;
    color: #2A9FE4;
    user-select: none;
  }
  .auto-forget .auto-content {
    display: flex;
    justify-content: space-between;
  }
  .auto-forget .forget {
    display: inline-block;
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    line-height: 20px;
    margin-right: 10px;
  }
  .auto-forget .forget a {
    display: block;
    float: right;
  }
  .auto-forget span {
    color: #90A2AE;
  }
  .auto-forget span:hover {
    color: #2A9FE4;
  }
  .err-tip {
    height: 40px;
    font-size: 14px;
    line-height: 20px;
    color: #dd2b2b;
    padding-left: 40px;
    padding-top: 20px;
    position: absolute;
    bottom: 42px;
  }
  .err-tip p:before {
    content: "";
    display: block;
    width: 20px;
    height: 20px;
    position: absolute;
    left: 15px;
    top: 20px;
    background: url('./../../../static/images/authLogin/mark.svg') no-repeat center;
  }
  .go-registered {
    display: inline-block;
    width: 100%;
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color:rgba(153,153,153,1);
    line-height: 20px;
  }
  .go-registered span {
    // color: #299fe4;
    color: #B2C0C9
  }
  .go-registered span:hover {
    color: #2A9FE4;
  }
  .email-login {
    padding: 30px 0 72px;
    text-align: center;
  }
  .email-login p {
    display: inline-block;
    cursor: pointer;
    height: 14px;
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color:rgba(42,159,228,1);
    line-height: 14px;
    text-decoration: underline;
  }
</style>
