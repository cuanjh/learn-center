<template>
  <div class="bg-box">
    <div class="reset-box">
      <h2>密码重置</h2>
      <p class="tip">请在下方输入你手机收到的验证码</p>
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
      <button class="ok-btn" v-bind:disabled="!isGoOkLogin" @click="goReset">
        <p>
          完成
          <i></i>
        </p>
      </button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import validation from './../../tool/validation.js'
import errCode from './../../api/code.js'
// import http from './../../api/userAuth.js'
// import Cookie from '../../tool/cookie'
// import { encrypt } from './../../tool/untils.js'

export default {
  data () {
    return {
      loading: false,
      phoneCode: '',
      pwd1: '', // 第一次输入
      pwd2: '', // 第二次输入
      errText: '',
      time: 60, // 60s重新发送
      timer: null // 定时器
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    isGetCode () {
      return this.time === 60
    },
    isGoOkLogin () {
      return this.phoneCode && this.pwd1 && this.pwd2
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
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateIsLogin: 'user/updateIsLogin'
    }),
    ...mapActions({
      // resetPwdPhone: 'user/resetPwdPhone',
      // sendCodeReset: 'user/sendCodeReset',
      getUserInfo: 'user/getUserInfo',
      sendCode: 'getSendCode',
      userEditPwd: 'userEditPwd'
    }),
    // 获取验证码
    getCode () {
      if (this.timer) return
      this.sendCode({phonenumber: this.$route.params.phone, codeLen: '6'}).then(res => {
        if (res.success) {
          console.log('发送验证码成功', res)
          this.timer = setInterval(() => {
            --this.time
            if (this.time === 0) {
              this.time = 60
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        } else {
          this.errText = errCode[res.code]
        }
      })
    },
    async goReset () {
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
      await this.userEditPwd({phonenumber: this.$route.params.phone, code: this.phoneCode, password: this.pwd2}).then((res) => {
        console.log('修改密码成功', res)
        if (res.success) {
          this.$router.push({path: '/auth/login'})
        } else {
          this.errText = errCode[res.code]
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
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
  .bg-box {
    min-height: 560px;
    padding: 80px 0px;
  }
  .reset-box {
    position: relative;
    width: 380px;
    border-radius: 5px;
    background-color: #fff;
    margin: 0 auto;
    padding: 40px 40px 70px;
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
    color: #333333;
    border: 1px solid #E6EBEE;
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
    font-size: 14px;
    color: #666;
    text-align: center;
    padding: 10px 0 20px;
  }
  .reset-box .ok-btn {
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
    margin: 50px 0 0;
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
      transition: padding-right 218ms ease;
      display: block
    }
  }
  .reset-box .ok-btn:disabled {
    background-color: #D6DFE4;
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
</style>
