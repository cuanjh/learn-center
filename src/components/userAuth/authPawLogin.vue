<template>
  <div class="bg-box">
    <div class="user-login">
      <h2>欢迎使用全球说!</h2>
      <input type="text" placeholder="输入手机/邮箱" v-model="userName" @keyup.enter="goLogin">
      <input type="password" placeholder="输入密码" v-model="userPwd" @keyup.enter="goLogin">
      <div class="auto-forget">
        <p class="go-registered">
          <router-link to="/auth/register"><span>没有账号！去注册</span></router-link>
        </p>
        <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
        <button @click="goLogin" v-bind:disabled="!isGoLogin">{{loading?'loading':'登录'}}</button>
        <p class="forget">
          <router-link to="/auth/forget"><span>忘记了，找回密码!</span></router-link>
        </p>
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
      loading: false,
      autoFlag: true,
      userName: '',
      userPwd: '',
      errText: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    isGoLogin () {
      return validation.phoneNumber(this.userName) && this.userPwd
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
    autoLogin () {
      this.autoFlag = !this.autoFlag
    },
    async goLogin () {
      this.errText = ''
      if (!validation.phoneNumber(this.userName) && !validation.email(this.userName)) {
        this.errText = errCode['e06']
        return false
      }
      if (!validation.pwd(this.userPwd)) {
        this.errText = errCode['e02']
        return false
      }
      this.loading = true
      let flag = true
      await this.login({
        identity: this.userName,
        password: encrypt(this.userPwd)
      }).then(res => {
        if (res.success) {
          localStorage.removeItem('userInfo')
          Cookie.delCookieTalkmate('is_anonymous')
          Cookie.delCookie('user_id')
          Cookie.delCookie('verify')
          // if (this.autoFlag) {
          //   Cookie.setCookieAuto('user_id', res.user_id)
          //   Cookie.setCookieAuto('verify', res.verify)
          // } else {
          //   Cookie.setCookieSession('user_id', res.user_id)
          //   Cookie.setCookieSession('verify', res.verify)
          // }
          Cookie.setCookie('user_id', res.user_id)
          Cookie.setCookie('verify', res.verify)
          let UserId = Cookie.getCookie('user_id')
          let lastUserId = localStorage.getItem('last_user_id')
          if (lastUserId !== UserId) {
            localStorage.setItem('lastUserId', UserId)
            localStorage.removeItem('lastCourseCode')
          }
        } else {
          this.loading = false
          this.errText = errCode[res.code]
          flag = false
        }
      })
      if (flag) {
        let lastCourseCode = localStorage.getItem('lastCourseCode')
        if (!lastCourseCode) {
          await this.getUserInfo()
          this.updateCurCourseCode(this.userInfo.current_course_code)
          localStorage.setItem('lastCourseCode', this.userInfo.current_course_code)
          this.updateIsLogin('1')
          this.$router.push({path: '/app/course-list'})
        } else {
          this.updateCurCourseCode(lastCourseCode)
          this.updateIsLogin('1')
          this.$router.push({path: '/app/course-list'})
        }
      }
    }
  }
}
</script>

<style scoped>
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
  input {
    display: block;
    width: 100%;
    height: 40px;
    font-size: 14px;
    color: #000;
    line-height: 20px;
    border: 1px solid #ececec;
    border-radius: 20px;
    background-color: #fff;
    padding: 10px 24px;
  }
  input::-webkit-input-placeholder {
    font-size: 14px;
    color: #b8b8b8;
  }
  input::-moz-placeholder {
    font-size: 14px;
    color: #b8b8b8;
  }
  input:-moz-placeholder {
    font-size: 14px;
    color: #b8b8b8;
  }
  input:-ms-placeholder {
    font-size: 14px;
    color: #b8b8b8;
  }
  input[type="text"] {
    margin-top: 30px;
    margin-bottom: 20px;
  }
  input[type="password"] {
    margin-bottom: 10px;
  }
  button {
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 20px;
    background-color: #299fe4;
    margin-top: 79px;
  }
  button:disabled {
    background-color: #cacaca;
    cursor: default;
  }
  .auto-forget {
    position: relative;
    font-size: 14px;
    overflow: hidden;
    padding-bottom: 40px;
  }
  .auto-forget .auto-login {
    float: left;
    color: #999;
    overflow: hidden;
  }
  .auto-forget .forget {
    height: 14px;
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color:rgba(153,153,153,1);
    line-height: 20px;
    margin-top: 10px;
  }
  .auto-forget a {
    display: block;
    float: right;
  }
  .auto-forget span {
    color: #299fe4;
  }
  .err-tip {
    height: 40px;
    font-size: 14px;
    line-height: 20px;
    color: #dd2b2b;
    padding-left: 40px;
    padding-top: 20px;
    position: absolute;
    bottom: 116px;
  }
  .err-tip p:before {
    content: "";
    display: block;
    width: 20px;
    height: 20px;
    position: absolute;
    left: 15px;
    top: 20px;
    background: url('./../../../static/images/home/error.svg') no-repeat center;
  }
  .go-registered {
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color:rgba(153,153,153,1);
    line-height: 20px;
  }
  .go-registered span {
    color: #299fe4;
  }
</style>
