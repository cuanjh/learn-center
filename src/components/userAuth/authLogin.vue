<template>
  <div class="bg-box">
    <div class="user-login" v-show="type == 0">
      <div class="go-email-login">
        <div class="bg-img" @click="goEmail()"></div>
      </div>
      <h2 v-text="headerTitle"></h2>
      <div class="phone-resigter">
        <div class="item">
          <div class="areacode" @click="areaCode()">
            +
            <span>86</span>
            <i class="arrow"></i>
          </div>
          <input  id="phoneNumber"
                  type="text"
                  placeholder="输入手机号码"
                  v-model="phone"
                  @keyup.enter="getCode">
        </div>
        <div class="item phone-code">
          <input  id="phoneCode"
                  type="text"
                  placeholder="手机验证码"
                  v-model="phoneCode"
                  @keyup.enter="goLogin">
          <button v-bind:disabled="!isGetCode" @click="getCode">{{ time === 60 ? message :time+'s' }}</button>
        </div>
        <div class="item verify-code" v-show="false">
          <input  id="imgCode"
                  type="text"
                  placeholder="输入验证码"
                  v-model="imgCode"
                  @keyup.enter="goLogin">
          <img :src="imgCodeUrl" alt="图片验证码" @click="getCodeUrl">
        </div>
      </div>
      <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
      <!-- <button class="register-btn" v-bind:disabled="!isGoLogin" >登录<p></p></button> -->
      <button class="register-btn" v-bind:disabled="!isGoLogin" @click="goLogin()">
        <p>
          登录
          <i></i>
        </p></button>
      <div class="login-pwd">
        <p @click="goPwdLogin()">手机密码登录</p>
      </div>
      <div class="divider">
        <span class="line"></span>
        <span>或者</span>
        <span class="line"></span>
      </div>
      <!-- 第三方登录 -->
      <div class="third-party">
        <div class="third weixin" @click="weixinGoLogin()">
          <i></i>
        </div>
        <div class="third weibo" @click="weiboGoLogin()">
          <i></i>
        </div>
        <div class="third qq" @click="qqGoLogin()">
          <i></i>
        </div>
      </div>
      <!-- 新用户邮箱注册 老用户邮箱登录  @click="changeTypeEmail" -->
      <!-- <div class="go-email-register">
        <span @click="goEmail()">邮箱登录</span>
      </div> -->
      <div class="privacy">
        <p>
          <span>我声明,我已经阅读并接受</span>
          <a @click="showAreement()">使用条款及隐私政策</a>
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
    <auth-pwd-login v-show="type == 1 || type == 2" :type='type' @updateType='updateType'></auth-pwd-login>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { deviceId } from './../../tool/untils'
import validation from './../../tool/validation.js'
// import http from './../../api/userAuth.js'
// import { encrypt } from './../../tool/untils.js'
import Cookie from '../../tool/cookie'
import errCode from './../../api/code.js'
import AuthPwdLogin from './authPwdLogin'
import $ from 'jquery'

// import Cookies from 'js-cookie'

export default {
  data () {
    return {
      message: '获取',
      headerTitle: '',
      shoeAreaCode: false, // 显示区域编码
      goPhone: true, // true 手机号 false 邮箱
      phone: '',
      phoneCode: '',
      imgCode: '',
      // email: '',
      // emailPwd: ''
      loading: false,
      errText: '',
      imgCodeUrl: '', // 图片验证码
      time: 60,
      timer: null, // 定时器
      type: 0 // 0验证码登录 1手机密码登录 2邮箱登录
    }
  },
  components: {
    AuthPwdLogin
  },
  mounted () {
    this.getCodeUrl()
    let userId = Cookie.getCookie('user_id')
    if (!userId) {
      this.headerTitle = '你好!'
    } else {
      this.headerTitle = 'Hi，欢迎回来!'
    }
  },
  computed: {
    ...mapState({
      loginInfo: state => state.loginInfo
    }),
    // 手机验证码获取
    isGetCode () {
      return this.phone && this.time === 60
    },
    isGoLogin () {
      return validation.phoneNumber(this.phone) && this.phoneCode
    }
  },
  methods: {
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateIsLogin: 'user/updateIsLogin'
    }),
    ...mapActions({
      getCaptchaUrl: 'user/getCaptchaUrl',
      login: 'user/login',
      userLogin: 'userLogin',
      sendCode: 'getSendCode'
    }),
    // 更新type
    updateType (type) {
      this.type = type
    },
    // 邮箱登录
    goEmail () {
      this.type = 2
      console.log('type', this.type)
    },
    // 手机密码登录
    goPwdLogin () {
      this.type = 1
      console.log('type', this.type)
    },
    // 控制隐私的显示隐藏
    showAreement () {
      let routeDate = this.$router.resolve({
        name: 'authAgreement'
      })
      window.open(routeDate.href)
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
    // 点击获取验证码
    getCode () {
      if (!validation.phoneNumber(this.phone)) {
        this.errText = errCode['er01']
        $('#phoneNumber').css('border-color', '#D0021B')
        return false
      }
      // 发送验证码
      this.sendCode({phonenumber: this.phone, codeLen: '6'}).then(res => {
        console.log('发送验证码', res)
        if (res.success) {
          $('input[type="text"]').css('border-color', '#E6EBEE')
          this.errText = ''
          this.timer = setInterval(() => {
            --this.time
            if (this.time === 0) {
              this.time = 60
              this.message = '重新获取'
              clearInterval(this.timer)
              this.tim = null
            }
          }, 1000)
        } else {
          this.errText = errCode[res.code]
        }
      })
    },
    // 点击登录按钮去登陆
    async goLogin () {
      let _this = this
      _this.errText = ''
      if (!validation.phoneNumber(_this.phone)) {
        _this.errText = errCode['er01'] // 'er01': '请输入正确的手机号'
        return false
      }
      if (!validation.verfiyCode(_this.phoneCode)) {
        _this.errText = errCode['er02'] // 'er02': '验证码错误'
      }

      // 快速登录，有手机号就正常登录没有就相当于注册登录
      await _this.userLogin({phonenumber: _this.phone, code: _this.phoneCode})
      if (_this.loginInfo.success) {
        $('input[type="text"]').css('border-color', '#E6EBEE')
        this.errText = ''
        // 先把localStorage里面的用户的信息和cookie里面的用户信息都清除了
        localStorage.removeItem('userInfo')
        Cookie.delCookieTalkmate('is_anonymous')
        Cookie.delCookie('user_id')
        Cookie.delCookie('verify')
        let info = _this.loginInfo.result
        // 把后台返回的用户信息存进去
        Cookie.setCookie('user_id', info.user_id)
        Cookie.setCookie('verify', info.verify)
        _this.$router.push({path: '/app/index'})
      } else {
        _this.errText = errCode[_this.loginInfo.code]
      }
    },
    // 第三方登录

    weixinGoLogin () {
      let _deviceId = deviceId()
      console.log('deviceid', _deviceId)
      let url = 'http://talkmate.com/umv1/user-web/sns-login?ty=wx' + '&deviceid=' + _deviceId + '&loginurl=http://beat-study.talkmate.com/app/index'
      // window.open(url)
      window.location.href = url
    },
    weiboGoLogin () {
      // http://talkmate.com/umv1/user-web/sns-login
      // 登录：deviceid
      // 回调：loginurl
      // 类型：ty:wb、wx、qq
      // http://beat-study.talkmate.com/app/index
      let _deviceId = deviceId()
      console.log('deviceid', _deviceId)
      let url = 'http://talkmate.com/umv1/user-web/sns-login?ty=wb' + '&deviceid=' + _deviceId + '&loginurl=http://beat-study.talkmate.com/app/index'
      // window.open(url)
      window.location.href = url
    },
    qqGoLogin () {
      // http://talkmate.com/umv1/user-web/sns-login
      // 登录：deviceid
      // 回调：loginurl
      // 类型：ty:wb、wx、qq
      // http://beat-study.talkmate.com/app/index
      let _deviceId = deviceId()
      console.log('deviceid', _deviceId)
      let url = 'http://talkmate.com/umv1/user-web/sns-login?ty=qq' + '&deviceid=' + _deviceId + '&loginurl=http://beat-study.talkmate.com/app/index'
      // window.open(url)
      window.location.href = url
    }
  }
}
</script>

<style lang="less" scoped>
html,body{-webkit-text-size-adjust:none;}
.pcss5{-webkit-text-size-adjust:none;}
  .bg-box {
    min-height: 765px;
    padding: 80px 0px;
  }
  .user-login .go-email-login {
    width: 42px;
    height: 42px;
    position: absolute;
    right: 14px;
    top: 14px;
    cursor: pointer;
    .bg-img {
      width: 42px;
      height: 42px;
      background: url('../../../static/images/authLogin/email.svg') no-repeat center;
      background-size: cover;
    }
    .bg-img:hover {
      width: 42px;
      height: 42px;
      background: url('../../../static/images/authLogin/emailHover.svg') no-repeat center;
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
  .user-login {
    position: relative;
    width: 380px;
    // height: 520px;
    border-radius: 5px;
    background-color: #fff;
    margin: 0px auto;
    padding: 40px 40px 0px;
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
  .phone-resigter .item {
    margin-top: 10px;
    overflow: hidden;
    position: relative;
    .areacode {
      position: absolute;
      cursor: pointer;
      left: 21px;
      top: 6px;
      font-size: 14px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color: #103044;
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
  .phone-resigter .item input {
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
  .phone-resigter .verify-code input {
    float: left;
    width: 180px;
  }
  .phone-resigter .verify-code img {
    float: right;
    width: 108px;
    height: 38px;
    border-radius: 20px;
    cursor: pointer;
    background-color: #f2f2f2;
    padding: 4px 0px;
  }
  .phone-resigter .phone-code button {
    padding: 0 10px;
    height: 26px;
    font-size: 13px;
    color: #fff;
    border-radius: 84px;
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
    font-weight: bold;
    border: none;
    border-radius: 84px;
    background-color: #74C105;
    margin-top: 50px;
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
      transition: padding-right 218ms ease;
    }
  }
  .register-btn:disabled {
    background-color: #D6DFE4;
    cursor: not-allowed;
    &:hover i {
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
    color:#3C5B6F;
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
    bottom: 250px;
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
  .divider {
    text-align: center;
    line-height: 24px;
    font-size: 13px;
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
      width:40px;
      height:40px;
    }
    i {
      cursor: pointer;
      display: inline-block;
      width:40px;
      height:40px;
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
  // .go-email-register {
  //   padding: 31px 0 21px 0;
  //   text-align: center;
  //   span {
  //     cursor: pointer;
  //     width: 56px;
  //     height: 14px;
  //     font-size: 14px;
  //     font-family: PingFang-SC-Medium;
  //     font-weight: 500;
  //     color:rgba(42,159,228,1);
  //     line-height: 14px;
  //     text-decoration: underline;
  //   }
  // }
  .privacy {
    width: 100%;
    display: inline-block;
    font-size: 13px;
    font-weight: 400;
    color: #A5B2BA;
    line-height: 18px;
    padding: 38px 0 20px;
    text-align: center;
    a {
      text-decoration: none;
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
    font-size:13px;
    font-family:PingFangSC-Semibold;
    font-weight:600;
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
    font-size:13px;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color: #103044;
    text-align: left;
    line-height: 36px;
    cursor: pointer;
    box-sizing: border-box;
  }
  .areacode-box .code-list li:hover {
    background: #EEF2F3;
  }
</style>
