<style scoped>
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
  .bg-box {
    padding: 80px 0px;
  }
  .reset-box {
    width: 420px;
    border-radius: 5px;
    background-color: #fff;
    margin: 0 auto;
    padding: 40px 50px;
  }
  .reset-box .item {
    margin-top: 10px;
    position: relative;
  }
  .reset-box .item input {
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
  }
  .reset-box .item button {
    /* width: 56px; */
    height: 28px;
    font-size: 12px;
    border-radius: 14px;
    border: none;
    color: #fff;
    background-color: #299fe4;
    padding: 0 16px;
    position: absolute;
    top: 6px;
    right: 8px;
  }
  .reset-box .item button:disabled {
    color: #fff;
    cursor: not-allowed;
    background-color: #cacaca;
  }
  .reset-box h2 {
    line-height: 36px;
    font-size: 26px;
    font-weight: 400;
    text-align: center;
    color: #333;
  }
  .reset-box .tip {
    font-size: 16px;
    color: #f6a623;
    text-align: center;
    padding: 10px 0 20px;
  }
  .reset-box .ok-btn {
    display: block;
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 20px;
    background-color: #299fe4;
  }
  .reset-box .ok-btn:disabled {
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
    <div class="reset-box">
      <h2>密码重置</h2>
      <p class="tip">信息已经发送至手机</p>
      <div class="item phone-code">
        <input type="text" placeholder="手机验证码" v-model="phoneCode">
        <button v-bind:disabled="!isGetCode" @click="getCode">{{isGetCode?'重新获取':time+'s'}}</button>
      </div>
      <div class="item">
        <input type="password" placeholder="请输入新密码" v-model="pwd1">
      </div>
      <div class="item">
        <input type="password" placeholder="再次输入新密码" v-model="pwd2">
      </div>
      <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
      <button class="ok-btn" v-bind:disabled="loading" @click="goReset">{{loading?'loading':'确定'}}</button>
    </div>
  </div>
</template>
<script>
import validation from './../../tool/validation.js'
import errCode from './../../api/code.js'
import http from './../../api/userAuth.js'
import { encrypt } from './../../tool/untils.js'
export default {
  data () {
    return {
      loading: false,
      phoneCode: '',
      pwd1: '', // 第一次输入
      pwd2: '', // 第二次输入
      errText: '',
      time: 6, // 60s重新发送
      timer: null // 定时器
    }
  },
  computed: {
    isGetCode () {
      return this.time === 6
    }
  },
  mounted () {
    if (validation.phoneNumber(this.$route.params.phone)) {
      this.getCode()
    } else {
      this.$router.push('/auth/forget')
    }
  },
  methods: {
    getCode () {
      if (this.timer) return
      http.sendCodeReset({
        phonenumber: this.$route.params.phone,
        type: 'reset_password'
      }).then(res => {
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
    goReset () {
      this.errText = ''
      if (!validation.verfiyCode(this.phoneCode)) {
        this.errText = errCode['e03']
        return false
      }
      if (!validation.pwd(this.pwd1) || !validation.pwd(this.pwd2)) {
        this.errText = errCode['e02']
        return false
      }
      if (this.pwd1 !== this.pwd2) {
        this.errText = errCode['e08']
        return false
      }
      this.loading = true
      http.resetPwdPhone({
        phonenumber: this.$route.params.phone,
        new_pwd: encrypt(this.pwd1),
        re_pwd: encrypt(this.pwd2),
        verification_code: this.phoneCode
      }).then(res => {
        if (res.success) {
          console.log('改成功了')
        } else {
          this.loading = false
          this.errText = errCode[res.code]
        }
      })
    }
  }
}
</script>
