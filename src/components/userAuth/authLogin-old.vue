<template>
  <div class="bg-box">
    <div class="user-login">
      <h2 v-text="headerTitle"></h2>
      <input type="text" placeholder="输入手机/邮箱" v-model="userName" @keyup.enter="goLogin">
      <input type="password" placeholder="输入密码" v-model="userPwd" @keyup.enter="goLogin">
      <div class="auto-forget">
        <p class="auto-login">
          <i v-bind:class="{'active':autoFlag}" @click="autoLogin"></i>
          <span>自动登录</span>
        </p>
        <router-link to="/auth/forget">
          <p class="forget">忘记了密码？</p>
        </router-link>
      </div>
      <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
      <button @click="goLogin" v-bind:disabled="loading">{{loading?'loading':'登录'}}</button>
      <p class="go-registered">
        没有账号！
        <router-link to="/auth/select-lang"><span>去注册</span></router-link>
      </p>
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
      headerTitle: '', // Hi，欢迎回来
      loading: false,
      autoFlag: true,
      userName: '',
      userPwd: '',
      errText: ''
    }
  },
  mounted () {
    let userId = Cookie.getCookie('user_id')
    if (userId) {
      this.headerTitle = 'Hi，欢迎回来'
    } else {
      this.headerTitle = '你好!'
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
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
    // 点击登录按钮去登陆
    async goLogin () {
      this.errText = ''
      if (!validation.phoneNumber(this.userName) && !validation.email(this.userName)) {
        this.errText = errCode['e06'] // 'e06': '手机号或邮箱格式错误'
        return false
      }
      if (!validation.pwd(this.userPwd)) {
        this.errText = errCode['e02'] // 'e02': '密码格式错误'
        return false
      }
      this.loading = true
      let flag = true
      await this.login({
        identity: this.userName,
        password: encrypt(this.userPwd)
      }).then(res => {
        if (res.success) {
          // 先把localStorage里面的用户的信息和cookie里面的用户信息都清除了
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
      // 如果是登陆状态的操作
      if (flag) {
        let lastCourseCode = localStorage.getItem('lastCourseCode')
        if (!lastCourseCode) {
          await this.getUserInfo()
          this.updateCurCourseCode(this.userInfo.current_course_code)
          localStorage.setItem('lastCourseCode', this.userInfo.current_course_code)
          // cookie里面有一个isLogin判断是否登陆，0是没登录 1是登陆状态
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
    min-height: 765px;
    padding: 80px 0px;
  }
  .user-login {
    width: 420px;
    height: 376px;
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
  }
  button:disabled {
    background-color: #cacaca;
    cursor: default;
  }
  .auto-forget {
    font-size: 14px;
    overflow: hidden;
  }
  .auto-forget .auto-login {
    float: left;
    color: #999;
    overflow: hidden;
  }
  .auto-forget .auto-login i {
    float: left;
    width: 16px;
    height: 16px;
    cursor: pointer;
    border-radius: 3px;
    background-color: #999;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 2px;
  }
  .auto-forget .auto-login .active {
    background: url('./../../../static/images/home/checkbox-ok.svg') #299fe4 no-repeat center center;
  }
  .auto-forget .forget {
    float: right;
    margin-right: 10px;
    color: #299fe4;
  }
  .err-tip {
    height: 40px;
    font-size: 14px;
    line-height: 20px;
    color: #dd2b2b;
    padding-left: 40px;
    padding-top: 20px;
    position: relative;
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
    float: right;
    line-height: 20px;
    font-size: 14px;
    color: #999;
    padding-right: 12px;
    margin-top: 10px;
  }
  .go-registered span {
    color: #299fe4;
  }
</style>
