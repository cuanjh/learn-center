<template>
  <div class="bg-box">
    <div class="user-login">
      <h2>Hi，欢迎回来</h2>
      <input type="text" placeholder="输入手机/邮箱" v-model="userName">
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
import http from './../../api/userAuth.js'
import validation from './../../tool/validation.js'
import errCode from './../../api/code.js'
import { encrypt } from './../../tool/untils.js'
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
    })
  },
  methods: {
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateIsLogin: 'user/updateIsLogin',
      updateUserInfo: 'user/updateUserInfo'
    }),
    ...mapActions({
      getUserInfo: 'user/getUserInfo'
    }),
    autoLogin () {
      this.autoFlag = !this.autoFlag
    },
    goLogin () {
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
      http.login({
        identity: this.userName,
        password: encrypt(this.userPwd)
      }).then(res => {
        if (res.success) {
          localStorage.removeItem('userInfo')
          localStorage.removeItem('user_id')
          localStorage.removeItem('verify')
          // Cookies.set('user_id', res.user_id)
          // Cookies.set('verify', res.verify)
          localStorage.setItem('user_id', res.user_id)
          localStorage.setItem('verify', res.verify)
          // let UserId = Cookies.get('user_id')
          // let lastUserId = Cookies.get('last_user_id')
          let UserId = localStorage.getItem('user_id')
          let lastUserId = localStorage.getItem('last_user_id')
          if (lastUserId !== UserId) {
            // Cookies.set('lastUserId', UserId)
            localStorage.setItem('lastUserId', UserId)
            localStorage.removeItem('lastCourseCode')
          }

          let lastCourseCode = localStorage.getItem('lastCourseCode')
          if (!lastCourseCode) {
            this.$nextTick(() => {
              this.getUserInfo().then((res) => {
                this.updateUserInfo(res)
                this.updateCurCourseCode(this.userInfo.current_course_code)
                localStorage.setItem('lastCourseCode', this.userInfo.current_course_code)
                this.updateIsLogin('1')
                this.$router.push({path: '/app/course-list'})
              })
            })
          } else {
            this.updateCurCourseCode(lastCourseCode)
            this.updateIsLogin('1')
            this.$router.push({path: '/app/course-list'})
          }
        } else {
          this.loading = false
          this.errText = errCode[res.code]
        }
      })
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
