<style scoped>
  .forget-box {
    width: 420px;
    border-radius: 5px;
    background-color: #fff;
    margin: 0 auto;
    padding: 40px 50px;
  }
  .bg-box {
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
    margin-top: 10px;
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
    padding: 20px 0px;
  }
  .forget-box .tip {
    font-size: 12px;
    text-align: center;
    color: #d8d8d8;
    padding-top: 10px;
  }
  .forget-box button {
    display: block;
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 20px;
    background-color: #299fe4;
  }
  .forget-box button:disabled {
    background-color: #cacaca;
    cursor: default;
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
</style>
<template>
  <div class="bg-box">
    <div class="forget-box" v-show="showFlag === 0">
      <h2>忘记密码</h2>
      <div class="item">
        <input type="text" placeholder="输入手机号/邮箱" v-model="userName">
      </div>
      <p class="tip">输入注册全球说(talkmate)账号时填写的邮箱或手机号码</p>
      <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
      <button v-bind:disabled="loading" @click="goVerify">{{loading?'loading':'获取验证信息'}}</button>
    </div>
    <send-success v-if="showFlag === 1" v-bind:email="userName"></send-success>
  </div>
</template>
<script>
import validation from './../../tool/validation.js'
import errCode from './../../api/code.js'
import http from './../../api/userAuth.js'
import sendSuccess from './authSendEmailOk.vue'
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
  methods: {
    goVerify () {
      this.errText = ''
      if (!validation.phoneNumber(this.userName) && !validation.email(this.userName)) {
        this.errText = errCode['e06']
        return false
      }
      var forgetType = validation.phoneNumber(this.userName) ? 'phone' : 'email'
      this.loading = true
      if (forgetType === 'phone') {
        http.checkPhone({identity: this.userName}).then(res => {
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
