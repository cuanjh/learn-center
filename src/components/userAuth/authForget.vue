<template>
  <div class="bg-box">
    <div class="forget-box" v-show="showFlag === 0">
      <h2>找回密码</h2>
      <p  class="tip"
          v-text="currentType == 2 ? '请在下方输入框里输入你的电子邮箱，以获取验证链接。':'请在下方输入框里输入你的电话号码，以手机便获取验证码。'"></p>
      <div class="item">
        <input  type="text"
                :placeholder="currentType == 2?'请输入你的电子邮箱':'请输入你的手机号码'"
                v-model="userName"
                @blur.prevent="blurPhoneFn()"
                @keyup.enter="goVerify">
      </div>
      <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
      <button v-bind:disabled="!isGoLogin" @click="goVerify()">
        <p>
          获取验证信息
          <i></i>
        </p>
      </button>
    </div>
    <send-success v-if="showFlag === 1" v-bind:email="userName"></send-success>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import validation from './../../tool/validation.js'
import errCode from './../../api/code.js'
import http from './../../api/userAuth.js'
import sendSuccess from './authSendEmailOk.vue'
import $ from 'jquery'

export default {
  data () {
    return {
      loading: false,
      errText: '',
      userName: '',
      showFlag: 0 // 显示标识 0 验证信息 1 邮件发送成功
    }
  },
  components: {
    sendSuccess
  },
  mounted () {},
  computed: {
    currentType () {
      let urlarr = this.$route.path.split('/')
      let type = Number(urlarr[urlarr.length - 1])
      return type
    },
    usernameType () {
      // 用户输入的账号类型两种，分别是  phone  email, 返回fasle说明二者验证均不通过
      if (this.currentType === 2) {
        return 'email'
      } else if (this.currentType === 1) {
        return 'phone'
      } else {
        return false
      }
    },
    isGoLogin () {
      return this.userName
    }
  },
  methods: {
    ...mapActions({
      userEditPwd: 'userEditPwd'
    }),
    // 失去焦点
    blurPhoneFn () {
      if (validation.phoneNumber(this.userName) || validation.email(this.userName)) {
        $('input[type="text"]').css('border-color', '#E6EBEE')
        this.errText = ''
        return false
      }
    },
    // 获取验证信息
    goVerify () {
      this.errText = ''
      var type = this.usernameType
      console.log('type', type)
      if (type === 'phone') {
        if (!validation.phoneNumber(this.userName)) {
          this.errText = errCode['er01']
          $('input[type="text"]').css('border-color', '#D0021B')
          return false
        }
      }
      if (type === 'email') {
        if (!validation.email(this.userName)) {
          this.errText = errCode['er05']
          $('input[type="text"]').css('border-color', '#D0021B')
          return false
        }
      }
      var forgetType = validation.phoneNumber(this.userName) ? 'phone' : 'email'
      if (forgetType === 'phone') {
        http.checkPhone({identity: this.userName}).then(res => {
          console.log('忘记手机密码', res)
          if (res.success) {
            if (res.exists) {
              this.$router.push({path: `/auth/reset-phone/${this.userName}`})
            } else {
              this.loading = false
              this.errText = errCode['e07']
            }
          } else {
            this.loading = false
            this.errText = errCode[res.code]
          }
        })
      } else {
        http.checkEmail({identity: this.userName}).then(res => {
          console.log('忘记邮箱密码', res)
          if (res.success) {
            if (res.exists) {
              this.sendMail()
            } else {
              this.loading = false
              this.errText = errCode['e07']
            }
          } else {
            this.loading = false
            this.errText = errCode[res.code]
          }
        })
      }
    },
    sendMail () {
      http.sendEmail({
        email: this.userName,
        lang: 'zh-CN'
      }).then(res => {
        if (res.success) {
          this.showFlag = 1
        } else {
          this.loading = false
          this.errText = errCode[res.code]
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .forget-box {
    position: relative;
    width: 380px;
    border-radius: 5px;
    background-color: #fff;
    margin: 0 auto;
    padding: 40px 43px 70px;
  }
  .bg-box {
    min-height: 630px;
    padding: 80px 0px;
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
  .forget-box .item {
    margin: 20px 0 50px;
  }
  .forget-box .item input {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 20px;
    font-size: 14px;
    color: #000;
    border: 1px solid #ececec;
    border-radius: 20px;
    background-color: #fff;
    padding: 10px 0 10px 24px;
    position: relative;
  }
  .forget-box h2 {
    line-height: 36px;
    font-size: 26px;
    font-weight: 400;
    text-align: center;
    color: #333;
    margin-top: 10px;
  }
  .forget-box .tip {
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #666;
  }
  .forget-box button {
    position: relative;
    display: block;
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 20px;
    background-color: #299fe4;
    p {
      width: 150px;
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
      transition: padding-right 218ms ease;
      display: block;
    }
  }
  .forget-box button:disabled {
    background-color: #cacaca;
    cursor: not-allowed;
    &:hover i {
      display: none;
    }
  }
  .err-tip {
    height: 40px;
    font-size: 14px;
    line-height: 20px;
    color: #dd2b2b;
    padding-left: 40px;
    padding-top: 20px;
    position: absolute;
    bottom: 110px;
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
  input[type="text"]:focus {
    border-color: #2A9FE4FF;
  }
</style>
