<template>
  <div>
    <div class="login-box">
      <div class="login-content">
        <div class="login-log">
          <i></i>
        </div>
        <div class="login-item">
          <div class="title">
            <span>学习就是最好的保护!</span>
          </div>
          <div class="login">
            <input type="text" placeholder="手机号码" v-model="phone">
          </div>
          <div class="phone-code">
            <input type="text" placeholder="输入验证码" v-model="phoneCode">
            <button class="button" v-bind:disabled="!isGetCode" @click="getCode">{{ time === 60 ? message : time+'s' }}</button>
          </div>
          <div class="me-phone">
            <p class="login-in">
              <span>有自己的账号，</span>
              <router-link :to="{path: '/auth/login'}" tag="span">直接登录!</router-link>
            </p>
          </div>
          <button class="learn" v-bind:disabled="!isGoStudy" @click="goStudy()">立即学习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import validation from './../../tool/validation.js'
import errCode from './../../api/code.js'
import Cookie from '../../tool/cookie'

export default {
  data () {
    return {
      message: '获取验证码',
      phone: '',
      phoneCode: '',
      time: 60
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
    // 立即学习
    isGoStudy () {
      return validation.phoneNumber(this.phone) && this.phoneCode
    }
  },
  methods: {
    ...mapActions({
      sendCode: 'getSendCode',
      userLogin: 'userLogin'
    }),
    // 点击获取验证码
    getCode () {
      if (!validation.phoneNumber(this.phone)) {
        this.errText = errCode['er01']
        return false
      }
      // 发送验证码
      this.sendCode({phonenumber: this.phone, codeLen: '4'}).then(res => {
        console.log('发送验证码', res)
        if (res.success) {
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
    // 点击立即学习
    goStudy () {
      let _this = this
      _this.errText = ''
      if (!validation.phoneNumber(_this.phone)) {
        _this.errText = errCode['er01'] // 'er01': '请输入正确的手机号'
        return false
      }
      if (!validation.verfiyCode(_this.phoneCode)) {
        _this.errText = errCode['er02'] // 'er02': '验证码错误'
      }

      _this.delCommonCookie()
      // 快速登录，有手机号就正常登录没有就相当于注册登录
      _this.userLogin({phonenumber: _this.phone, code: _this.phoneCode})
      if (_this.loginInfo.success) {
        this.errText = ''
        let info = _this.loginInfo.result
        // 把后台返回的用户信息存进去
        _this.setCommonCookie(info)
        this.updateIsLogin('1')
        _this.$router.push({path: '/app/index'})
      } else {
        _this.errText = errCode[_this.loginInfo.code]
      }
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
    }
  }
}
</script>
<style lang="less" scoped>
input {
  display: block;
  width: 100%;
  height: 40px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(216,216,216,1);
  border: 1px solid #c9c1c1;
  border-radius: 20px;
  background-color: #fff;
  padding: 10px 14px;
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
  margin-bottom: 20px;
}
// 登录区域
.login-box {
  margin: 15px 0;
  width: 100%;
  background: #fff;
  .login-content {
    width: 50%;
    margin: 0 auto;
    padding: 50px 0 80px 0;
    .login-log {
      width: 200px;
      height: 60px;
      margin: 0 auto;
      i {
        display: inline-block;
        width: 200px;
        height: 60px;
        background: url('https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1') no-repeat center;
        background-size: cover;
      }
    }
    .login-item {
      width: 315px;
      margin: 10px auto 0;
      .title {
        font-size: 20px;
        color: #333333;
        text-align: center;
        margin-bottom: 20px;
      }
      .login {
        input {
          width: 315px;
          color: #333333;
        }
      }
      .phone-code {
        display: flex;
        justify-content: space-between;
        input {
          width: 170px;
          color: #333333;
          margin-bottom: 10px;
        }
        .button {
          cursor: pointer;
          display: block;
          height: 40px;
          width: 120px;
          border: 1px solid #2A9FE4FF;
          text-align: center;
          line-height: 40px;
          border-radius: 20px;
          padding: 0 14px;
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(30,158,231,1);
        }
        .button:disabled {
          background-color: #D6DFE4;
          cursor: not-allowed;
          border: none;
          color: #ffffff;
        }
      }
      .me-phone {
        .login-in {
          width: 100%;
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(216,216,216,1);
          span:nth-child(2) {
            cursor: pointer;
            color: #1E9EE7FF;
          }
        }
      }
      .learn {
        cursor: pointer;
        display: block;
        font-size:14px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(255,255,255,1);
        text-align: center;
        width:200px;
        height:36px;
        background:rgba(42,159,228,1);
        border-radius:100px;
        margin: 28px auto 0;
        line-height: 36px;
      }
      .learn:disabled {
        background-color: #D6DFE4;
        cursor: not-allowed;
      }
    }
  }
}
</style>
