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
                  maxlength="11"
                  @blur="phoneBlur"
                  @keyup.enter="getCode">
        </div>
        <div class="item verify-code" v-show="false">
          <input  id="imgCode"
                  type="text"
                  placeholder="输入验证码"
                  v-model="imgCode"
                  @keyup.enter="goLogin">
          <img :src="imgCodeUrl" v-if="imgCodeUrl" alt="图片验证码" @click="getCodeUrl">
        </div>
        <div id="__nc" class="ncContainer" v-if="!isNC">
          <div id="nc"></div>
        </div>
        <!-- <div id="ncDom" class="nc-container" v-show="false"></div> -->
        <div class="item phone-code" v-else>
          <input  id="phoneCode"
                  type="text"
                  readonly="readonly"
                  @focus="onFocus()"
                  placeholder="手机验证码"
                  maxlength="4"
                  v-model="phoneCode"
                  @keyup.enter="goLogin">
          <button v-bind:disabled="!isGetCode" @click="getCode">{{ time === 60 ? message :time+'s' }}</button>
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
      <!--  v-show="shoeAreaCode" -->
      <div class="areacode-box" v-show="false">
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
import validation from './../../tool/validation.js'
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
      isNC: false,
      // shoeAreaCode: false, // 显示区域编码
      goPhone: true, // true 手机号 false 邮箱
      phone: '',
      phoneCode: '',
      imgCode: '',
      loading: false,
      errText: '',
      imgCodeUrl: '', // 图片验证码
      time: 60,
      timer: null, // 定时器
      type: 0, // 0验证码登录 1手机密码登录 2邮箱登录
      aliSessionId: '',
      aliToken: '',
      aliSign: '',
      aliScene: 'nc_message'
    }
  },
  components: {
    AuthPwdLogin
  },
  mounted () {
    // 初始化滑块认证
    this.ncCaptchaVerify()
    // this.getCodeUrl()
    let userId = Cookie.getCookie('user_id')
    console.log('userId', userId)
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
      return validation.phoneNumber(this.phone) && validation.verfiyCode(this.phoneCode)
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
      sendCode: 'getSendCodeV2',
      userSnsLogin: 'userSnsLogin',
      getUserInfo: 'getUserInfo'
    }),
    onFocus () {
      $('#phoneCode').removeAttr('readOnly')
    },
    // 手机号失去焦点
    phoneBlur () {
      console.log(this.phone)
      if (this.phone.length === 11 && validation.phoneNumber(this.phone)) {
        $('input[type="text"]').css('border-color', '#E6EBEE')
        this.errText = ''
      }
    },
    // 更新type
    updateType (type) {
      this.type = type
    },
    // 邮箱登录
    goEmail () {
      this.type = 2
      if (!this.phoneCode && this.time === 60) {
        this.phone = ''
        this.time = 60
        this.phoneCode = ''
      }
      console.log('type', this.type)
    },
    // 手机密码登录
    goPwdLogin () {
      this.type = 1
      if (!this.phoneCode && this.time === 60) {
        this.phone = ''
        this.time = 60
        this.phoneCode = ''
      }
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
      this.sendCode({phonenumber: this.phone, codeLen: '4', appName: 'Talkmate', aliSessionId: this.aliSessionId, aliToken: this.aliToken, aliSign: this.aliSign, aliScene: this.aliScene}).then(res => {
        console.log('发送验证码', res)
        if (res.success) {
          window.zhuge.track('登录-点击获取验证码')
          $('input[type="text"]').css('border-color', '#E6EBEE')
          if (res.data.Code === 100) {
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
            this.$message({
              type: 'warning',
              message: '验证不通过'
            })
            return false
          }
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
      this.delCommonCookie()
      // 快速登录，有手机号就正常登录没有就相当于注册登录
      await _this.userLogin({phonenumber: _this.phone, code: _this.phoneCode})
      if (_this.loginInfo.success) {
        window.zhuge.track('登录-手机验证码登录')
        $('input[type="text"]').css('border-color', '#E6EBEE')
        this.errText = ''
        // 先把localStorage里面的用户的信息和cookie里面的用户信息都清除了
        localStorage.removeItem('userInfo')

        let info = _this.loginInfo.result
        // 把后台返回的用户信息存进去
        this.setCommonCookie(info)

        this.updateIsLogin('1')
        await this.getUserInfo()
        window._czc.push(['_trackEvent', '学习系统', '登录', '手机验证码登录', '', '.register-btn'])
        _this.$router.push({path: '/app/index'})
      } else {
        _this.errText = errCode[_this.loginInfo.code]
      }
    },
    // 第三方登录
    weixinGoLogin () {
      this.delCommonCookie()
      this.userSnsLogin({ty: 'wx'}).then((res) => {
        window.zhuge.track('登录-微信')
        window._czc.push(['_trackEvent', '学习系统', '登录', '微信第三方登录', '', '.weixin'])
        console.log('res', res)
        window.location.href = res
      })
    },
    weiboGoLogin () {
      this.delCommonCookie()
      this.userSnsLogin({ty: 'wb'}).then((res) => {
        window.zhuge.track('登录-微博')
        window._czc.push(['_trackEvent', '学习系统', '登录', '微博第三方登录', '', '.weibo'])
        console.log('res', res)
        window.location.href = res
      })
    },
    qqGoLogin () {
      this.delCommonCookie()
      this.userSnsLogin({ty: 'qq'}).then((res) => {
        window.zhuge.track('登录-qq')
        window._czc.push(['_trackEvent', '学习系统', '登录', 'qq第三方登录', '', '.qq'])
        console.log('res', res)
        window.location.href = res
      })
    },
    delCommonCookie () {
      localStorage.removeItem('userInfo')
      Cookie.delCookieTalkmate('is_anonymous')
      Cookie.delCookieTalkmate('hasPhone')
      Cookie.delCookieTalkmate('user_id')
      Cookie.delCookieTalkmate('verify')
      Cookie.delCookieTalkmate('device_id')
      Cookie.delCookie('device_id')
      Cookie.delCookie('is_anonymous')
      Cookie.delCookie('hasPhone')
      Cookie.delCookie('user_id')
      Cookie.delCookie('verify')
      Cookie.delCookie('userName')
      Cookie.delCookie('userPwd')
    },
    setCommonCookie (info) {
      Cookie.setCookie('user_id', info.user_id)
      Cookie.setCookieAuto('user_id', info.user_id)
      Cookie.setCookie('verify', info.verify)
      Cookie.setCookieAuto('verify', info.verify)
      Cookie.setCookie('is_anonymous', info.is_anonymous)
      Cookie.setCookie('hasPhone', info.hasPhone)
    },
    ncCaptchaVerify () {
      let ncToken = ['FFFF0N000000000094A1', (new Date()).getTime(), Math.random()].join(':')
      // let NCOpt = {
      //   // 声明滑动验证需要渲染的目标元素ID。
      //   renderTo: '#ncDom',
      //   // 应用类型标识。它和使用场景标识（scene字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
      //   appkey: 'FFFF0N000000000094A1',
      //   // 使用场景标识。它和应用类型标识（appkey字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
      //   scene: 'nc_message',
      //   // 滑动验证码的主键，请勿将该字段定义为固定值。确保每个用户每次打开页面时，其token值都是不同的。系统默认的格式为：'您的appkey'+'时间戳'+'随机数'。
      //   token: ncToken,
      //   // 滑动条的宽度。
      //   customWidth: 300,
      //   // 业务键字段，可为空。为便于线上问题的排查，建议您按照线上问题定位文档中推荐的方法配置该字段值。
      //   trans: { key1: 'code0' },
      //   // 语言。PC端Web页面场景默认支持18国语言，详细配置方法请参见自定义文案与多语言文档。
      //   language: 'cn',
      //   // 是否启用。一般情况，保持默认值（true）即可。
      //   isEnabled: true,
      //   // 内部网络请求的超时时间。一般情况建议保持默认值（3000ms）。
      //   timeout: 3000,
      //   // 允许服务器超时重复次数，默认5次。超过重复次数后将触发报错。
      //   times: 5,
      //   // 前端滑动验证通过时会触发该回调参数。您可以在该回调参数中将请求标识（token）、会话ID（sessionid）、签名串（sig）字段记录下来，随业务请求一同发送至您的服务端调用验签。
      //   callback: (data) => {
      //     window.console && console.log(ncToken)
      //     window.console && console.log(data.csessionid)
      //     window.console && console.log(data.sig)
      //   }
      // }
      /* eslint-disable */
      // var nc = new noCaptcha(NCOpt)
      /* eslint-enable */
      // 用于自定义文案。详细配置方法请参见自定义文案与多语言文档。
      // nc.upLang('cn', {
      //   _startTEXT: '请按住滑块，拖动到最右边',
      //   _yesTEXT: '验证通过',
      //   _error300: '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
      //   _errorNetwork: '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>'
      // })

      /* eslint-disable */
      var nc1 = NoCaptcha.init({
        // 声明滑动验证需要渲染的目标元素ID。
        renderTo: '#nc',
        // 应用类型标识。它和使用场景标识（scene字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
        appkey: 'FFFF0N000000000094A1',
        // 使用场景标识。它和应用类型标识（appkey字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
        scene: 'nc_message',
        // 滑动验证码的主键，请勿将该字段定义为固定值。确保每个用户每次打开页面时，其token值都是不同的。系统默认的格式为：'您的appkey'+'时间戳'+'随机数'。
        token: ncToken,
        // 滑动条的宽度。
        // customWidth: 300,
        // 业务键字段，可为空。为便于线上问题的排查，建议您按照线上问题定位文档中推荐的方法配置该字段值。
        trans: { key1: 'code0' },
        // 语言。PC端Web页面场景默认支持18国语言，详细配置方法请参见自定义文案与多语言文档。
        language: 'cn',
        // 是否启用。一般情况，保持默认值（true）即可。
        // isEnabled: true,
        // 内部网络请求的超时时间。一般情况建议保持默认值（3000ms）。
        timeout: 3000,
        // 允许服务器超时重复次数，默认5次。超过重复次数后将触发报错。
        retryTimes: 5,
        // 验证通过后，验证码组件是否自动隐藏，默认不隐藏（false）。
        bannerHidden: false,
	      // 是否默认不渲染，默认值false。当设置为true时，不自动渲染，需要自行调用show方法进行渲染。
        initHidden: false,
        // 前端滑动验证通过时会触发该回调参数。您可以在该回调参数中将请求标识（token）、会话ID（sessionid）、签名串（sig）字段记录下来，随业务请求一同发送至您的服务端调用验签。
        callback: (data) => {
          window.console && console.log(ncToken)
          window.console && console.log(data.csessionid)
          window.console && console.log(data.sig)
          this.aliSessionId = data.csessionid
          this.aliToken = ncToken
          this.aliSign = data.sig
          setTimeout(() => {
            this.isNC = true
          }, 1000)
        }
      })
      NoCaptcha.setEnabled(true)
      // 请务必在此处调用一次reset()方法。
      nc1.reset(); 
      // 用于配置滑动验证的自定义文案。详细信息，请参见自定义文案与多语言文档。
      NoCaptcha.upLang('cn', {
        //加载状态提示。
        'LOADING':"加载中...", 
        //等待滑动状态提示。
       'SLIDER_LABEL': "请按住滑块，拖动到最右边", 
        //验证通过状态提示。
        'CHECK_Y':"验证通过", 
        //验证失败触发拦截状态提示。
        'ERROR_TITLE':"非常抱歉，这出错了..." 
      });
      /* eslint-enable */
    }
  }
}
</script>

<style lang="less" scoped>
html,body{-webkit-text-size-adjust:none;}
.pcss5{-webkit-text-size-adjust:none;}
  .bg-box {
    min-height: 640px;
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
      background: url('../../../static/images/authLogin/emailhover.svg') no-repeat center;
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
    padding: 38px 40px 0px;
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
  .phone-resigter {
    .item {
      overflow: hidden;
      position: relative;
      margin-top: 16px;
      .areacode {
        position: absolute;
        cursor: pointer;
        left: 21px;
        top: 6px;
        font-size: 14px;
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
    .item:nth-child(1) {
      margin-top: 20px;
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
    padding:4px 15px;
    font-size: 13px;
    color: #fff;
    border-radius: 84px;
    border: none;
    background-color:#0581D1;
    position: absolute;
    right: 8px;
    top: 6px;
  }
  .phone-resigter .phone-code button:hover {
    background-color: #2A9FE4;
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
    bottom: 260px;
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
      background: #E5E5E5;
      margin-top: 10px;
    }
  }
  .third-party {
    display: flex;
    justify-content: center;
    margin-top: 14px;
    .third {
      width:32px;
      height:32px;
      margin-right: 30px;
    }
    .third:last-child {
      margin-right: 0px;
    }
    i {
      cursor: pointer;
      display: inline-block;
      width:32px;
      height:32px;
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
  .phone-resigter .item input:focus {
    border-color: #2A9FE4FF;
  }
</style>

<style>
/* .nc-container {
  margin-top: 16px;
  font-size: 13px;
}
.nc_scale {
  height: 44px;
  border-radius: 84px;
}

.nc-container .nc_scale .nc_bg {
  width: 0;
  border-top-left-radius: 84px;
  border-bottom-left-radius: 84px;
  left: 25px;
}

.nc-container .nc_scale span {
  width: 50px;
  height: 50px;
  line-height: 44px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #a7c2d5;
  box-shadow: 4px 0px 12px 0px rgba(0,0,0,0.12);
  top: -3px;
}

.nc-container .nc_scale .scale_text {
  font-size: 13px;
}

.nc-container .scale_text.scale_text span[data-nc-lang="_startTEXT"] {
  border-radius: 84px;
  box-shadow: 0px 1px 9px 0px rgba(0,0,0,0.07) inset;
}

.nc-container .nc_scale .btn_ok {
  border-color: #FFFFFF;
  line-height: 45px;
  font-size: 45px;
}

.nc-container .nc_scale .nc-align-center.scale_text2 {
  background: #76c61d;
  border-radius: 84px;
}

.nc-container .scale_text.scale_text.slidetounlock span[data-nc-lang="_yesTEXT"] {
  box-shadow: none;
} */

.ncContainer {
  width: 100% !important;
  margin-top: 16px !important;
  height: 44px !important;
}

._nc {
  font-size: 13px !important;
}
._nc .stage1 {
  height: 44px !important;
  padding: 0 !important;
  width: 100% !important;
}

._nc .stage1 .slider {
  height: 44px !important;
  left: 0 !important;
  right: 0 !important;
  border-radius: 84px !important;
}

._nc .stage1 .button {
  border-radius: 50% !important;
  width: 50px !important;
  height: 50px !important;
  box-shadow: 4px 0px 12px 0px rgba(219, 166, 166, 0.12) !important;
  top: -3px !important;
  left: -2px;
}

._nc .icon-slide-arrow {
  font-size: 26px !important;
  left: 13px !important;
  color: #a7c2d5 !important;
}

._nc .stage1 .track div, ._nc .stage1 .label {
  height: 44px !important;
  line-height: 44px !important;
  font-size: 13px !important;
}

._nc .stage1 .track {
  border-top-left-radius: 84px !important;
  border-bottom-left-radius: 84px !important;
}

._nc .icon-ok {
  font-size: 45px !important;
}

._nc .stage1 .icon.yes {
  background-position: -40px 0 !important;
  margin-top: 1px !important;
  margin-left: -7px !important;
}
</style>
