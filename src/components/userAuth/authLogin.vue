<template>
  <div class="bg-box">
    <div class="user-login" v-show="goPhone">
      <h2 v-text="headerTitle"></h2>
      <div class="phone-resigter">
        <div class="item">
          <div class="areacode" @click="areaCode">
            +
            <span>86</span>
            <i class="arrow"></i>
          </div>
          <input id="phoneNumber" type="text" placeholder="输入手机号码" v-model="registerInfo.phone" @keyup.enter="goLogin">
        </div>
        <div class="item phone-code">
          <input type="text" placeholder="手机验证码" v-model="registerInfo.phoneCode" @keyup.enter="goLogin">
          <button v-bind:disabled="!isGetCode" @click="getCode">{{ time === 60?'获取':time+'s' }}</button>
        </div>
        <div class="item verify-code">
          <input type="text" placeholder="输入验证码" v-model="registerInfo.imgCode" @keyup.enter="goLogin">
          <img :src="imgCodeUrl" alt="图片验证码" @click="getCodeUrl">
        </div>
      </div>
      <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
      <!-- <button class="register-btn" v-bind:disabled="loading">{{loading?'loading':'注册'}}</button> -->
      <!-- 新用户登录 老用户注册 -->
      <button class="register-btn" v-bind:disabled="!isGoLogin" >登录<p></p></button>
      <div class="login-pwd">
        <p @click="goPwdLogin">密码登录</p>
      </div>
      <div class="divider">
        <span class="line"></span>
        <span>或者</span>
        <span class="line"></span>
      </div>
      <!-- 第三方登录 -->
      <div class="third-party">
        <div class="third weixin">
          <i></i>
        </div>
        <div class="third weibo">
          <i></i>
        </div>
        <div class="third qq">
          <i></i>
        </div>
      </div>
      <!-- 新用户邮箱注册 老用户邮箱登录  @click="changeTypeEmail" -->
      <div class="go-email-register">
        <router-link tag="span" to="/auth/register">邮箱登录</router-link>
      </div>
      <div class="privacy">
        <p>
          <span>我声明,我已经阅读并接受</span>
          <span @click="showAreement">使用条款及隐私政策</span>
        </p>
      </div>
      <div class="areacode-box" v-show="shoeAreaCode">
        <div>
          <ul class="code-tab">
            <li class="js-code-tab">常用</li>
            <li class="js-code-tab">A</li>
            <li class="js-code-tab">B</li>
            <li class="js-code-tab">C</li>
            <li class="js-code-tab">D</li>
            <li class="js-code-tab">E</li>
            <li class="js-code-tab">F</li>
            <li class="js-code-tab">G</li>
            <li class="js-code-tab curr">H</li>
            <li class="js-code-tab">J</li>
            <li class="js-code-tab">K</li>
            <li class="js-code-tab">L</li>
            <li class="js-code-tab">M</li>
            <li class="js-code-tab">N</li>
            <li class="js-code-tab">P</li>
            <li class="js-code-tab">R</li>
            <li class="js-code-tab">S</li>
            <li class="js-code-tab">T</li>
            <li class="js-code-tab">W</li>
            <li class="js-code-tab">X</li>
            <li class="js-code-tab">Y</li>
            <li class="js-code-tab">Z</li>
          </ul>
        </div>
        <div class="code-title">
          <span>常用</span>
          <p class="line"></p>
        </div>
        <div class="code-list">
          <ul class="nano-content">
            <li data-code="853">中国澳门（+853 ）</li>
            <li data-code="886">中国台湾（+886 ）</li>
            <li data-code="852">中国香港（+852 ）</li>
            <li data-code="86">中国大陆（+86 ）</li>
            <li data-code="1">美国（+1 ）</li>
            <li data-code="31">加拿大（+1 ）</li>
            <li data-code="509">日本（+81 ）</li>
            <li data-code="504">洪都拉斯（+504 ）</li>
            <li data-code="82">韩国（+82 ）</li>
            <li data-code="64">新西兰（+64 ）</li>
          </ul>
        </div>
      </div>
    </div>
    <authPwdLogin v-show="goPwd"></authPwdLogin>
    <authAgreement v-show="panelShow" @hidden="hiddenShow"></authAgreement>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import validation from './../../tool/validation.js'
import http from './../../api/userAuth.js'
// import { encrypt } from './../../tool/untils.js'
// import Cookie from '../../tool/cookie'
// import errCode from './../../api/code.js'
import authPwdLogin from './authPwdLogin'
import authAgreement from './authAgreement'

// import Cookies from 'js-cookie'

export default {
  data () {
    return {
      panelShow: false, // 隐私政策
      shoeAreaCode: false, // 显示区域编码
      isNew: 1, // 0 是新用户 1 是老用户
      goPwd: false,
      headerTitle: '', // Hi，欢迎回来
      goPhone: true, // true 手机号 false 邮箱
      // registerFlagEmail: false, // 邮箱
      registerInfo: {
        phone: '',
        phoneCode: '',
        imgCode: '',
        email: '',
        emailPwd: ''
      },
      loading: false,
      errText: '',
      imgCodeUrl: '', // 图片验证码
      time: 60,
      timer: null // 定时器
    }
  },
  components: {
    authPwdLogin,
    authAgreement
  },
  mounted () {
    this.getCodeUrl()
    // let userId = Cookie.getCookie('user_id')
    // 把userId变成isNew
    if (this.isNew === 1) {
      this.headerTitle = 'Hi，欢迎回来'
    } else {
      this.headerTitle = '你好!'
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    // 手机验证码获取
    isGetCode () {
      return validation.phoneNumber(this.registerInfo.phone) && this.time === 60
    },
    isGoLogin () {
      return validation.phoneNumber(this.registerInfo.phone) && this.registerInfo.imgCode && this.registerInfo.phoneCode
    }
  },
  methods: {
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateIsLogin: 'user/updateIsLogin'
    }),
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
      getCaptchaUrl: 'user/getCaptchaUrl',
      login: 'user/login'
    }),
    // 控制隐私的显示隐藏
    showAreement () {
      this.panelShow = true
      this.goPhone = false
    },
    hiddenShow () {
      this.panelShow = false
      this.goPhone = true
    },
    // 显示区域编码
    areaCode () {
      this.shoeAreaCode = !this.shoeAreaCode
    },
    // 图片验证码链接
    getCodeUrl () {
      this.getCaptchaUrl().then((res) => {
        this.imgCodeUrl = res
      })
    },
    // 邮箱注册
    // changeTypeEmail () {
    //   // let userId = Cookie.getCookie('user_id')
    //   if (this.isNew === 1) {
    //     this.goPwd = true
    //   } else {
    //     this.registerFlagEmail = true
    //   }
    //   this.goPhone = false
    // },
    // changeTypePhone () {
    //   this.goPhone = true
    //   this.registerFlagEmail = false
    // },
    // 密码登录
    goPwdLogin () {
      this.goPwd = true
      this.goPhone = false
    },
    // 点击获取验证码
    getCode () {
      http.sendCode({phonenumber: this.registerInfo.phone}).then(res => {
        if (res.success) {
          this.timer = setInterval(() => {
            --this.time
            if (this.time === 0) {
              this.time = 10
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        }
      })
    }
    // 点击登录按钮去登陆
    // async goLogin () {
    //   this.errText = ''
    //   if (!validation.phoneNumber(this.registerInfo.phone)) {
    //     this.errText = errCode['e09'] // 'e06': '手机号或邮箱格式错误'
    //     return false
    //   }
    //   if (!validation.pwd(this.userPwd)) {
    //     this.errText = errCode['e02'] // 'e02': '密码格式错误'
    //     return false
    //   }
    //   this.loading = true
    //   let flag = true
    //   await this.login({
    //     identity: this.userName,
    //     password: encrypt(this.userPwd)
    //   }).then(res => {
    //     if (res.success) {
    //       // 先把localStorage里面的用户的信息和cookie里面的用户信息都清除了
    //       localStorage.removeItem('userInfo')
    //       Cookie.delCookieTalkmate('is_anonymous')
    //       Cookie.delCookie('user_id')
    //       Cookie.delCookie('verify')
    //       // if (this.autoFlag) {
    //       //   Cookie.setCookieAuto('user_id', res.user_id)
    //       //   Cookie.setCookieAuto('verify', res.verify)
    //       // } else {
    //       //   Cookie.setCookieSession('user_id', res.user_id)
    //       //   Cookie.setCookieSession('verify', res.verify)
    //       // }
    //       Cookie.setCookie('user_id', res.user_id)
    //       Cookie.setCookie('verify', res.verify)
    //       let UserId = Cookie.getCookie('user_id')
    //       let lastUserId = localStorage.getItem('last_user_id')
    //       if (lastUserId !== UserId) {
    //         localStorage.setItem('lastUserId', UserId)
    //         localStorage.removeItem('lastCourseCode')
    //       }
    //     } else {
    //       this.loading = false
    //       this.errText = errCode[res.code]
    //       flag = false
    //     }
    //   })
    //   // 如果是登陆状态的操作
    //   if (flag) {
    //     let lastCourseCode = localStorage.getItem('lastCourseCode')
    //     if (!lastCourseCode) {
    //       await this.getUserInfo()
    //       this.updateCurCourseCode(this.userInfo.current_course_code)
    //       localStorage.setItem('lastCourseCode', this.userInfo.current_course_code)
    //       // cookie里面有一个isLogin判断是否登陆，0是没登录 1是登陆状态
    //       this.updateIsLogin('1')
    //       this.$router.push({path: '/app/course-list'})
    //     } else {
    //       this.updateCurCourseCode(lastCourseCode)
    //       this.updateIsLogin('1')
    //       this.$router.push({path: '/app/course-list'})
    //     }
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
  .bg-box {
    padding: 80px 0px;
  }
  .user-login,.mail-resigter {
    position: relative;
    width: 440px;
    // height: 520px;
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
    color: #333333;
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
  .phone-resigter .item, .mail-resigter .item {
    margin-top: 15px;
    overflow: hidden;
    position: relative;
    .areacode {
      position: absolute;
      cursor: pointer;
      left: 21px;
      top: 6px;
      font-size: 16px;
      color: #1c1f21;
      text-align: left;
      line-height: 24px;
    }
    .arrow {
      display: inline-block;
      width: 9px;
      height: 24px;
      background: url('../../../static/images/authLogin/dropDown.svg') no-repeat center;
      background-size: 100%;
    }
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
  }
  .phone-resigter .item #phoneNumber {
    padding-left: 82px;
  }
  .phone-resigter .verify-code input,
  .mail-resigter .verify-code input {
    float: left;
    width: 180px;
  }
  .phone-resigter .verify-code img,
  .mail-resigter .verify-code img {
    float: right;
    width: 120px;
    height: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: #f2f2f2;
    padding: 4px 0px;
  }
  .phone-resigter .phone-code button {
    width: 58px;
    height: 28px;
    font-size: 12px;
    color: #fff;
    border-radius: 14px;
    border: none;
    background-color: #299fe4;
    position: absolute;
    right: 8px;
    top: 6px;
  }
  .phone-resigter .phone-code button:disabled {
    color: #fff;
    cursor: not-allowed;
    background-color: #D6DFE4;
  }
  .register-btn {
    position: relative;
    cursor: pointer;
    display: block;
    width: 100%;
    height: 40px;
    font-size: 16px;
    color: #fff;
    border: none;
    border-radius: 84px;
    background-color: #74C105;
    margin-top: 49px;
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
  .register-btn:disabled {
    background-color: #D6DFE4;
    cursor: not-allowed;
    &:hover p {
      display: none;
    }
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
    color:#B2C0C9;
    line-height:14px;
    float: right;
    margin-right: 10px;
    padding: 10px 0 25px 0;
  }
  .login-pwd p:hover {
    color: #2A9FE4
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
    background: url('./../../../static/images/authLogin/mark.svg') no-repeat center;
  }
  .user-login .err-tip {
    bottom: 232px;
  }
  .divider {
    text-align: center;
    line-height: 24px;
    color: #D6DFE4;
    span:nth-child(1), span:nth-child(3) {
      display: inline-block;
      width:90px;
      height:1px;
      border:1px solid #E5E5E5;
      margin-top: 10px;
    }
  }
  .third-party {
    display: flex;
    justify-content: space-around;
    margin-top: 14px;
    .third {
      width:30px;
      height:30px;
    }
    i {
      display: inline-block;
      width:30px;
      height:30px;
    }
    .weixin i{
      background: url('../../../static/images/authLogin/weixin.svg') no-repeat center;
      background-size: cover;
    }
    .weibo i{
      background: url('../../../static/images/authLogin/weibo.svg') no-repeat center;
      background-size: cover;
    }
    .qq i{
      background: url('../../../static/images/authLogin/QQ.svg') no-repeat center;
      background-size: cover;
    }
  }
  .go-email-register {
    padding: 31px 0 21px 0;
    text-align: center;
    span {
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
  }
  .privacy {
    width: 100%;
    display: inline-block;
    font-size: 13px;
    font-weight: 400;
    color: #A5B2BA;
    line-height: 18px;
    padding-bottom: 10px;
    span:nth-child(2) {
      &:hover {
        cursor: pointer;
        color: #2A9FE4;
      }
    }
  }
  ul li {
    padding: 0;
    margin: 0;
    list-style: none
  }
  .areacode-box {
    width: 320px;
    background: #ffffff;
    box-shadow: 0 8px 16px 0 rgba(28,31,33,.2);
    border-radius: 8px;
    position: absolute;
    top: 133px;
    left: 58px;
    padding: 10px 18px;
  }
  .areacode-box .code-tab {
    padding: 20px 0px;
  }
  .areacode-box .code-tab li {
    display: inline-block;
    font-size: 13px;
    color: #90A2AE;
    margin-right: 6px;
    cursor: pointer;
  }
  .areacode-box .code-title {
    margin: 0 0px 14px;
    font-size: 12px;
    color: #C8D4DB;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .areacode-box .code-title span {
    display: inline-block;
    width: 36px;
    line-height: 26px;
  }
  .areacode-box .code-title p {
    width: 240px;
    height: 1px;
    background: #D6DFE4;
    display: inline-block;
  }
  .areacode-box .code-list {
    width: 100%;
  }
  .code-list .nano-content {
    padding-inline-start: 0;
    width: 100%;
    height: 150px;
    overflow: auto;
  }
  .areacode-box .code-list li {
    width: 100%;
    font-size: 16px;
    color: #545c63;
    text-align: left;
    line-height: 36px;
    cursor: pointer;
    box-sizing: border-box;
  }
  .areacode-box .code-list li:hover {
    background: #EEF2F3;
  }
</style>
