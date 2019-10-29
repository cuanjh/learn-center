<template>
  <div class="bg-box">
    <div class="reset-box">
      <h2>密码重置</h2>
      <p class="tip">请在下方输入框里输入新的登录密码！</p>
      <div class="item">
        <input type="text" placeholder="输入新密码" v-model="pwd1">
      </div>
      <div class="item">
        <input type="text" placeholder="再次输入新密码" v-model="pwd2">
      </div>
      <div class="err-tip"><p v-show="errText">{{errText}}</p></div>
      <button class="ok-btn" v-bind:disabled="!isGoLogin" @click="goReset">
        <p>
          完成
          <i></i>
        </p>
      </button>
    </div>
  </div>
</template>
<script>
import validation from './../../tool/validation.js'
import errCode from './../../api/code.js'
import http from './../../api/userAuth.js'
export default {
  data () {
    return {
      pwd1: '',
      pwd2: '',
      errText: ''
    }
  },
  computed: {
    isGoLogin () {
      return this.pwd1 && this.pwd2
    }
  },
  methods: {
    goReset () {
      this.errText = ''
      if (!validation.pwd(this.pwd1) || !validation.pwd(this.pwd2)) {
        this.errText = errCode['e02']
        return false
      }
      if (this.pwd1 !== this.pwd2) {
        this.errText = errCode['e08']
        return false
      }
      this.loading = true
      http.resetPwdEmail({
        code: this.$route.params.code,
        password: this.pwd1
      }).then(res => {
        if (res.success) {
          this.$router.push({path: '/auth/login'})
        } else {
          this.loading = false
          this.errText = errCode[res.code]
        }
      })
    }
  }
}
</script>
<style  lang="less" scoped>
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
    min-height: 630px;
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
  .reset-box .ok-btn {
    display: block;
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 20px;
    background-color: #299fe4;
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
        margin-top: 3px;
      }
    }
    &:hover i {
      transition: padding-right 218ms ease;
      display: block
    }
  }
  .reset-box .ok-btn:disabled {
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
</style>
