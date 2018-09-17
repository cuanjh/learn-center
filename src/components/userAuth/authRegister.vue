<style scoped>
  .bg-box {
    /* background-color: #fcf1d5; */
    background-size: cover;
    padding: 80px 0;
  }
  .resigter-box {
    width: 420px;
    margin: 0 auto;
    padding: 30px 50px;
    border-radius: 5px;
    background-color: rgba(255, 255,255,.7);
  }
  .hello {
    line-height: 60px;
    text-align: center;
  }
  .hello img {
    display: inline-block;
    width: 60px;
    height: 60px;
    border: 3px solid #fff;
    border-radius: 8px;
    vertical-align: top;
    margin-right: 20px;
  }
  .hello span {
    display: inline-block;
    font-size: 34px;
    color: #299fe4;
    font-weight: bold;
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
  .resigter-box .tip {
    font-size: 17px;
    color: #666;
    text-align: center;
    line-height: 24px;
    margin-top: 12px;
    padding-bottom: 5px;
  }
  .phone-resigter .item, .mail-resigter .item {
    margin-top: 15px;
    overflow: hidden;
    position: relative;
  }
  .phone-resigter .item input, .mail-resigter .item input {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 20px;
    font-size: 14px;
    color: #000;
    border: 1px solid #fff;
    border-radius: 20px;
    background-color: #fff;
    padding: 10px 0 10px 24px;
    position: relative;
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
    background-color: #cacaca;
  }
  .go-register {
    font-size: 14px;
    line-height: 20px;
    color: #299fe4;
    text-align: right;
    padding-top: 8px;
  }
  .go-register span {
    cursor: pointer;
    font-weight: bold;
  }
  .register-btn {
    display: block;
    width: 100%;
    height: 40px;
    font-size: 16px;
    color: #fff;
    border: none;
    border-radius: 20px;
    background-color: #299fe4;
  }
  .register-btn:disabled {
    background-color: #cacaca;
    cursor: default;
  }
  .go-login {
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    text-align: right;
    line-height: 20px;
    color: #666;
    padding: 6px 15px;
  }
  .go-login span {
    cursor: pointer;
    color: #299fe4
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
  .asia {
    background: url('./../../../static/images/home/bg-asia.jpg') no-repeat;
    background-size: cover;
  }
  .europe {
    background: url('./../../../static/images/home/bg-european.jpg') no-repeat;
    background-size: cover;
  }
  .africa {
    background: url('./../../../static/images/home/bg-africa.jpg') no-repeat;
  }
</style>
<template>
  <div class="bg-box" v-bind:class="[registerLang.area]">
    <div class="resigter-box">
      <div class="hello">
        <img :src="registerLang.flag" alt="">
        <span>{{ registerLang.hi }}</span>
      </div>
      <p class="tip">马上注册并开始学习</p>
      <div class="phone-resigter" v-show="registerFlag">
        <div class="item">
          <input type="text" placeholder="手机号码" v-model="registerInfo.phone">
        </div>
        <div  class="item">
          <input type="password" placeholder="输入6-15位字母/数字" v-model="registerInfo.phonePwd">
        </div>
        <div  class="item verify-code">
          <input type="text" placeholder="输入验证码" v-model="registerInfo.imgCode">
          <img :src="imgCodeUrl" alt="图片验证码" @click="getCodeUrl">
        </div>
        <div  class="item phone-code">
          <input type="text" placeholder="手机验证码" v-model="registerInfo.phoneCode">
          <button v-bind:disabled="!isGetCode" @click="getCode">{{ time === 6?'获取':time+'s' }}</button>
        </div>
        <p class="go-register">
          <span @click="changeType">邮箱账号注册</span>
        </p>
      </div>
      <div class="mail-resigter" v-show="!registerFlag">
        <div class="item">
          <input type="text" placeholder="邮箱" v-model="registerInfo.email">
        </div>
        <div class="item">
          <input type="password" placeholder="输入6-15位字母/数字" v-model="registerInfo.emailPwd">
        </div>
        <div  class="item verify-code">
          <input type="text" placeholder="输入验证码" v-model="registerInfo.imgCode">
          <img :src="imgCodeUrl" alt="图片验证码" @click="getCodeUrl">
        </div>
        <p class="go-register">
          <span @click="changeType">手机号注册</span>
        </p>
      </div>
      <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
      <button class="register-btn" v-bind:disabled="loading" @click="goRegister">{{loading?'loading':'注册'}}</button>
      <p class="go-login">已有账号！ <router-link to="/auth/login"><span>去登陆</span></router-link></p>
    </div>
  </div>
</template>
<script>
import validation from './../../tool/validation.js'
import http from './../../api/userAuth.js'
import errCode from './../../api/code.js'
// import Config from './../../api/config.js'
import { randomString, encrypt } from './../../tool/untils.js'
import Cookies from 'js-cookie'
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      loading: false,
      registerLang: {},
      registerFlag: true, // true 手机号 false 邮箱
      registerInfo: {
        phone: '',
        email: '',
        phonePwd: '',
        emailPwd: '',
        phoneCode: '',
        imgCode: ''
      },
      imgCodeUrl: '', // 图片验证码
      time: 6,
      timer: null, // 定时器
      errText: '' // 错误提示
    }
  },
  computed: {
    isGetCode () {
      return validation.phoneNumber(this.registerInfo.phone) && this.time === 6
    }
  },
  mounted () {
    this.getCodeUrl()
    var _code = this.$route.params.code
    if (!_code) {
      this.$router.push('/auth/select-lang')
    }
    http.courseLists().then(res => {
      res.course_langs.forEach(element => {
        element.lang_infos.forEach(item => {
          if (item.lan_code === this.$route.params.code) {
            this.registerLang = item
            if (element.area_key === 'europe' || element.area_key === 'artificial') {
              this.registerLang.area = 'europe'
            } else if (element.area_key === 'africa') {
              this.registerLang.area = 'africa'
            } else {
              this.registerLang.area = 'asia'
            }
          }
        })
      })
    })
  },
  methods: {
    ...mapMutations({
      updateIsLogin: 'user/updateIsLogin'
    }),
    ...mapActions({
      updateInfo: 'user/updateInfo',
      getUserInfo: 'user/getUserInfo',
      getCaptchaUrl: 'user/getCaptchaUrl'
    }),
    changeType () {
      this.registerFlag = !this.registerFlag
    },
    getCode () {
      if (this.timer || !validation.phoneNumber(this.registerInfo.phone)) {
        return
      }
      http.sendCode({phonenumber: this.registerInfo.phone}).then(res => {
        if (res.success) {
          this.timer = setInterval(() => {
            --this.time
            if (this.time === 0) {
              this.time = 6
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        } else {
          this.errText = errCode[res.code]
        }
      })
    },
    goRegister () {
      this.errText = ''
      if (this.registerFlag) {
        if (!this.phoneRegister()) return false
      } else {
        if (!this.emailRegister()) return false
      }
      this.loading = true
      http.checkCaption({caption: this.registerInfo.imgCode}).then(res => {
        if (res.success) {
          if (res.result) {
            this.signUp()
          } else {
            this.loading = false
            this.errText = errCode['e04']
          }
        } else {
          this.loading = false
          this.errText = errCode[res.code]
        }
      })
    },
    getCodeUrl () { // 图片验证码链接
      this.getCaptchaUrl().then((res) => {
        this.imgCodeUrl = res
      })
    },
    signUp () { // 注册
      http.signUp({
        identity: this.registerFlag ? this.registerInfo.phone : this.registerInfo.email,
        password: encrypt(this.registerFlag ? this.registerInfo.phonePwd : this.registerInfo.emailPwd),
        nickname: '',
        type: this.registerFlag ? 'phonenumber' : 'email',
        verification_code: this.registerFlag ? this.registerInfo.phoneCode : null,
        lan_code: this.registerLang.lan_code
      }).then(res => {
        if (res.success) {
          Cookies.set('user_id', res.user_id)
          Cookies.set('verify', res.verify)
          console.log(randomString)
          var date = new Date()
          var params = {
            nickname: randomString(10),
            gender: 'male',
            country_code: 'CN',
            birthday: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
            photo_url: 'http://uploadfile.talkmate.com/app_image/male.jpg?v=1',
            course_code: this.registerLang.lan_code + '-Basic',
            description: '这个家伙很懒，什么都没有留下'
          }
          this.updateInfo(params).then((res) => {
            if (res.success) {
              localStorage.removeItem('lastCourseCode')
              this.updateIsLogin('1')
              this.$router.push({ path: '/app/course-list' })
            } else {
              this.errText = errCode[res.code]
            }
          })
        } else {
          this.loading = false
          this.getCodeUrl()
          this.errText = errCode[res.code]
        }
      })
    },
    phoneRegister () {
      if (!validation.phoneNumber(this.registerInfo.phone)) {
        this.errText = errCode['e01']
        return false
      }
      if (!validation.pwd(this.registerInfo.phonePwd)) {
        this.errText = errCode['e02']
        return false
      }
      if (!validation.verfiyCode(this.registerInfo.imgCode) || !validation.verfiyCode(this.registerInfo.phoneCode)) {
        this.errText = errCode['e03']
        return false
      }
      return true
    },
    emailRegister () {
      if (!validation.email(this.registerInfo.email)) {
        this.errText = errCode['e05']
        return false
      }
      if (!validation.pwd(this.registerInfo.emailPwd)) {
        this.errText = errCode['e02']
        return false
      }
      if (!validation.verfiyCode(this.registerInfo.imgCode)) {
        this.errText = errCode['e03']
        return false
      }
      return true
    }
  }
}
</script>
