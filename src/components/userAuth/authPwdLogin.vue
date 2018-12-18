<template>
  <div class="bg-box">
    <div class="user-login">
      <h2 v-text="title?'密码登录!':'邮箱登录!'"></h2>
      <input class="input_text" type="text" :placeholder="reminder" v-model="userName" @keyup.enter="goLogin">
      <input class="input_text" type="password" placeholder="输入密码" v-model="userPwd" @keyup.enter="goLogin">
      <div class="auto-forget">
        <!-- <p class="go-registered">
          <router-link to="/auth/register"><span>没有账号！去注册</span></router-link>
        </p> -->
        <div class="auto-login" :class="{'checked': isSaveLoginState}" @click="isSaveLoginState = !isSaveLoginState">
          <i></i>
          <span :class="{'checked':isSaveLoginState}">记住密码</span>
          <!-- <input type="checkbox" v-model="checked" name="check" id="checkb" class="input_check" value="itemDes">
          <label class="labell" for="checkb">记住密码</label> -->
        </div>
        <!-- <div class="check">
           @change="savePwd"
          <label><input type="checkbox" id="rememberPwd" v-model="pwdChecked" value="" name="fruit">记住密码</label>
        </div> -->
        <!-- <input type="checkbox" id="rememberPwd" v-model="pwdCheched" @change="savePwd">记住密码 -->
        <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
        <button @click="goLogin" v-bind:disabled="!isGoLogin">登录<p></p></button>
        <p class="forget">
          <router-link to="/auth/forget"><span>忘记密码了!</span></router-link>
        </p>
      </div>
      <div class="email-login">
        <p v-text="loginText?'邮箱登录':'手机登录'" @click="goEmailLogin"></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import validation from './../../tool/validation.js'
import { encrypt } from './../../tool/untils.js'
import Cookie from '../../tool/cookie'
import errCode from './../../api/code.js'

// import Cookies from 'js-cookie'

export default {
  data () {
    return {
      userName: '', // 输入的用户手机或邮箱
      userPwd: '', // 输入的密码
      errText: '', // 错误信息提示
      title: true, // true是密码登录，false是邮箱登录
      reminder: '', // input里面的提示，手机号还是邮箱
      loginText: true, // 下面是邮箱登录还是手机登录
      isSaveLoginState: false // 记住密码
    }
  },
  mounted () {
    if (this.title) {
      this.reminder = '请输入手机号'
    }
    let userNameOld = Cookie.getCookie('userName')
    let userPwdOld = Cookie.getCookie('userPwd')
    if (userNameOld !== '' && userPwdOld !== '') {
      this.isSaveLoginState = true
      this.userName = userNameOld
      this.userPwd = userPwdOld
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
      login: 'user/login'
    }),
    // 切换密码邮箱登录
    goEmailLogin () {
      this.reminder = '请输入正确的邮箱'
      this.title = !this.title
      this.loginText = !this.loginText
      if (this.title) {
        this.reminder = '请输入手机号'
      }
    },
    async goLogin () {
      let _this = this
      _this.errText = ''
      if (!validation.phoneNumber(_this.userName) && !validation.email(_this.userName)) {
        _this.errText = errCode['e06']
        return false
      }
      if (!validation.pwd(_this.userPwd)) {
        _this.errText = errCode['e02']
        return false
      }
      let flag = true
      await _this.login({
        identity: _this.userName,
        password: encrypt(_this.userPwd)
      }).then(res => {
        if (res.success) {
          localStorage.removeItem('userInfo')
          Cookie.delCookieTalkmate('is_anonymous')
          Cookie.delCookie('user_id')
          Cookie.delCookie('verify')
          /* if (_this.isSaveLoginState) {
            Cookie.setCookieAuto('user_id', res.user_id)
            Cookie.setCookieAuto('verify', res.verify)
          } else {
            Cookie.setCookieSession('user_id', res.user_id)
            Cookie.setCookieSession('verify', res.verify)
          } */
          Cookie.setCookie('user_id', res.user_id)
          Cookie.setCookie('verify', res.verify)
          Cookie.setCookie('userName', _this.userName)
          Cookie.setCookie('userPwd', _this.userPwd)
          let UserId = Cookie.getCookie('user_id')
          let lastUserId = localStorage.getItem('last_user_id')
          if (lastUserId !== UserId) {
            localStorage.setItem('lastUserId', UserId)
            localStorage.removeItem('lastCourseCode')
          }
        } else {
          _this.errText = errCode[res.code]
          flag = false
        }
      })
      if (flag) {
        let lastCourseCode = localStorage.getItem('lastCourseCode')
        if (!lastCourseCode) {
          await _this.getUserInfo()
          _this.updateCurCourseCode(_this.userInfo.current_course_code)
          localStorage.setItem('lastCourseCode', _this.userInfo.current_course_code)
          _this.updateIsLogin('1')
          _this.$router.push({path: '/app/course-list'})
        } else {
          _this.updateCurCourseCode(lastCourseCode)
          _this.updateIsLogin('1')
          _this.$router.push({path: '/app/course-list'})
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .bg-box {
    padding: 80px 0px;
  }
  .user-login {
    width: 420px;
    /* height: 376px; */
    border-radius: 5px;
    background-color: #fff;
    margin: 0px auto;
    padding: 40px 50px 0px;
  }
  h2 {
    line-height: 36px;
    font-size: 26px;
    font-weight: 600;
    text-align: center;
    color: #299fe4;
  }
  .user-login .input_text {
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
    margin-top: 30px;
    margin-bottom: 20px;
  }
  input[type="password"] {
    margin-bottom: 10px;
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
    margin-top: 50px;
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
  .auto-forget {
    position: relative;
    font-size: 14px;
    overflow: hidden;
  }
  .auto-forget .auto-login {
    color: #B2C0C9;
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
  .auto-forget .forget {
    display: inline-block;
    width: 100%;
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    line-height: 20px;
    margin-top: 10px;
  }
  .auto-forget a {
    display: block;
    float: right;
  }
  .auto-forget span {
    color: #B2C0C9;
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
    bottom: 78px;
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
    padding: 40px 0 54px 0;
    text-align: center;
  }
  .email-login p {
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
