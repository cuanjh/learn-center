<template>
  <div class="forget-email">
    <img src="./../../../static/images/authLogin/send.svg" alt="检查邮箱">
    <p>已发送!</p>
    <a :href="'https://' + emailUrl" v-show="emailUrl">立即前往</a>
  </div>
</template>
<script>
import { emailMatch } from './../../tool/email-match.js'
export default {
  props: {
    email: String
  },
  data () {
    return {
      emailUrl: emailMatch(this.email) // 根据用户的Email自动替换相应的邮箱登录地址   查找不到，返回false
    }
  },
  mounted () {
    console.log(this.email)
  }
}
</script>
<style scoped>
  .forget-email {
    width: 420px;
    border-radius: 5px;
    background-color: #fff;
    margin: 0 auto;
    padding: 40px 50px;
  }
  .forget-email h2 {
    line-height: 36px;
    font-size: 26px;
    font-weight: 400;
    text-align: center;
    color: #333;
    padding: 20px 0px;
  }
  .forget-email img {
    display: block;
    width: 100px;
    height: 100px;
    margin: 0px auto;
  }
  .forget-email p {
    font-size: 16px;
    color: #91D249;
    text-align: center;
  }
  .forget-email a {
    display: block;
    width: 200px;
    height: 40px;
    border-radius: 20px;
    font-size: 16px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    background-color: #299fe4;
    margin: 40px auto 0;
  }
</style>
