<template>
  <div>
    <section class='user-bind-wrap'>
      <!-- <div class="userVip-bottom-nav">
        <p @click='swapVipTab(true)' :class="{ 'active': activeTab === true }">手机号绑定</p>
        <p @click='swapVipTab(false)' :class="{ 'active': activeTab === false }">邮箱绑定</p>
      </div> -->
      <div class="user-bind-nav">
        <a @click='swapVipTab(true)' :class="{ 'active': activeTab === true }">手机号绑定</a>
        <a @click='swapVipTab(false)' :class="{ 'active': activeTab === false }">邮箱绑定</a>
      </div>
      <div class='user-setting-form' v-show="activeTab === true">
        <form action="">
          <div class="user-bind-content" :class="{'error': !phone}">
            <span >手机</span>
            <input  type="text" placeholder='请填写手机号' class='reg-input'
                    id="phoneNumber"
                    readonly="readonly"
                    @focus="onFocus()"
                    @blur="phoneBlur()"
                    v-model="phone"
                    autocomplete="off"
                    maxlength="11">
          </div>
          <div class='learn-setting-error-tips-settingpage' v-show="!phoneNumberValidator&&phoneError">
            <i></i><em>请输入正确的手机号</em>
          </div>
          <div class="user-bind-content" :class="{'error':false}">
            <span >密码</span>
            <input  class='learn-bind-psd-input' type="password"
                    id="phonePwd"
                    readonly="readonly"
                    @focus="onFocus()"
                    placeholder='字母/数字/下划线 6-15位'
                    v-model="newPsw">
          </div>
          <div class='learn-setting-error-tips-settingpage' v-show="false">
            <i></i><em class="password">您的密码不符合规范，请重新输入</em>
          </div>
            <a class='submit learn-bind-submit' @click="bindPhoneAccount()">我要绑定</a>
            <p class='bindPhone-error-tips' v-show='notice'>
              <i class='user error'></i><em>请填写完成后再绑定</em>
            </p>
        </form>
      </div>
      <div class="user-setting-form" v-show="activeTab === false">
        <form action="">
          <div class="user-bind-content" :class="{'error':!email}">
            <span>邮箱</span>
            <input  type="text" placeholder='请填写邮箱账号' class='reg-input'
                    id="emailNumber"
                    readonly="readonly"
                    @focus="onFocus()"
                    @blur="emailBlur()"
                    v-model="email"
                    autocomplete="off">
          </div>
          <div class='learn-setting-error-tips-settingpage' v-show='!mailValidator&&emailError'>
            <i></i><em>请输入正确的邮箱账号</em>
          </div>
          <div class="user-bind-content learn-bind-psd" :class="{'error':false}">
            <span >密码</span>
            <input  class='learn-bind-psd-input' type="password"
                    id="emailPwd"
                    readonly="readonly"
                    @focus="onFocus()"
                    placeholder='字母/数字/下划线 6-15位'
                    v-model="newPsw2">
          </div>
          <div class='learn-setting-error-tips-settingpage' v-show="false">
            <i></i>您的密码不符合规范，请重新输入
          </div>
          <a class='submit learn-bind-submit' @click="bindEmailAccount()">我要绑定</a>
          <p v-show='noticeEmail' class='bindPhone-error-tips'>
            <i class='user error'></i><em>请填写完成后再绑定</em>
          </p>
        </form>
      </div>
    </section>
    <setting-bind-phone/>
    <set-alert
      ref="setAlert"
      :alert-type="alertType"
      :bind-phone-num="phone"
      :alert-message="alertMessage"
      :bind-confirm-type="bindConfirmType"
      :alert-button="alertButton"
      :phone-psw= "newPsw"
      @updateAlertMessage="updateAlertMessage"
      @updateAlertButton="updateAlertButton"
      @memberupdate="loadData"
      @close="closeWin()"
    >
    </set-alert>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Bus from '../../../bus.js'
import $ from 'jquery'
import SetAlert from './userSettingAlert.vue'
import Vertify from '../../../tool/vertifyAccount'
import SettingBindPhone from './userSettingBindPhone.vue'

export default {
  data () {
    return {
      phoneError: false,
      emailError: false,
      activeTab: true,
      phone: '',
      notice: false,
      noticeEmail: false,
      newPsw: '',
      email: '',
      newPsw2: '',
      // alertType: '', // 弹出框类型,详见UserSettingAlertView
      alertMessage: '', // 弹出框的错误信息
      alertButton: '', // 弹出框的button名称
      bindConfirmType: 'email' // 默认解除绑定的类型
    }
  },
  components: {
    SettingBindPhone,
    SetAlert
  },
  created () {
    this.$on('coverShow', () => {
      this.updateAlertType('')
    })
  },
  mounted () {
    this.$parent.$emit('activeNavUserItem', 'bind')
    this.$parent.$emit('navItem', 'user')
    // this.newPsw = ''
    // this.newPsw2 = ''
    // this.email = ''
    // this.phone = ''
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      alertType: state => state.user.alertType
    }),
    phoneNumberValidator () {
      return /^1(3|4|5|6|7|8)\d{9}$/.test(this.phone)
    },
    mailValidator () {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)
    }
  },
  methods: {
    ...mapMutations({
      updateAlertType: 'user/updateAlertType',
      modefiyEmailMemberInfo: 'user/modefiyEmailMemberInfo'
    }),
    ...mapActions({
      getUserInfo: 'getUserInfo', // 获取用户信息
      // sendCode: 'user/sendCode',
      userExistsPhone: 'userExistsPhone', // 验证手机号是否存在
      userExistsEmail: 'userExistsEmail', // 验证邮箱是否存在
      // sendCode: 'getSendCode', // 发送验证码
      // resetAnonymous: 'user/resetAnonymous',
      anonymousUserBindEmail: 'anonymousUserBindEmail'
    }),
    onFocus () {
      $('#phoneNumber,#phonePwd,#emailNumber,#emailPwd').removeAttr('readOnly')
      this.phoneError = false
      this.emailError = false
    },
    phoneBlur () {
      if (!this.phoneNumberValidator && this.phone) {
        this.phoneError = true
      }
    },
    emailBlur () {
      if (!this.mailValidator && this.email) {
        this.emailError = true
      }
    },
    // 提示用户的信息不完整
    alertMessageNotBox (msg, icon) {
      // this.noticeSetting = true
      let obj = {
        className: 'warnIcon',
        description: `${msg}`,
        btnDesc: '确定',
        isLink: false
      }

      if (icon) {
        obj.className = icon
      }
      Bus.$emit('showCommonModal', obj)
    },
    swapVipTab (value) {
      this.activeTab = value
      if (value) {
        this.newPsw2 = ''
        this.email = ''
        this.noticeEmail = false
      } else {
        this.newPsw = ''
        this.phone = ''
        this.notice = false
      }
    },
    bindPhoneAccount () {
      if (this.phone.length <= 0 || this.newPsw.length <= 0) {
        this.notice = true
        return
      }
      var phoneVertify = Vertify.vertifyPhone(this.phone, this.newPsw)
      if (phoneVertify) {
        this.notice = false
        this.bindPhone(this.phone)
      }
    },
    bindEmailAccount () {
      // 正则匹配
      if (this.email.length <= 0 || this.newPsw2.length <= 0) {
        this.noticeEmail = true
        return
      }
      var emailVertify = Vertify.vertifyEmail(this.email, this.newPsw2)
      if (!emailVertify) {
        this.alertMessageNotBox('输入邮箱格式不正确！')
        return false
      }
      if (emailVertify) {
        this.noticeEmail = false
        this.bindEmail(this.email)
      }
    },
    bindPhone (phone) {
      let _this = this
      let params = {}
      params.phonenumber = phone
      _this.userExistsPhone(params).then(res => {
        console.log('res', res)
        if (res.exists) { // 存在
          this.phone = ''
          this.newPsw = ''
          this.alertMessageNotBox('手机号已经存在！')
        } else { // 不存在
          Bus.$emit('showBindPhone', phone)
        }
      })
      // var _this = this
      // var params = {}
      // params.type = 'bind_phonenumber'
      // params.phonenumber = this.phone
      // this.sendCode(params).then((res) => {
      //   // this.$refs['setAlert'].$emit('isShowSetAlert', true)
      //   this.alertMessageNotBox('手机号已经存在！')
      //   if (res.success) {
      //     _this.updateAlertType('bindPhoneNumber')
      //   } else {
      //     this.showAlertView(res)
      //   }
      // })
    },
    bindEmail (email) {
      console.log('eamil', email)
      var _this = this
      let params = {}
      params.email = email
      _this.userExistsEmail(params).then(res => {
        console.log('绑定邮箱返回', res)
        if (res.exists) { // 存在
          _this.alertMessageNotBox('邮箱已经存在！')
          _this.email = ''
        } else { // 不存在
          this.bindEmailFN(email)
        }
      })
      // var _this = this
      // var params = {}
      // params.email = email
      // params.password = this.newPsw2
      // this.resetAnonymous(params).then((res) => {
      //   console.log('res', res)
      //   // this.$refs['setAlert'].$emit('isShowSetAlert', true)
      //   // this.alertMessageNotBox('邮箱已经存在！')
      //   if (res.success) {
      //     setTimeout(() => {
      //       _this.updateAlertType('bindEmail')
      //       _this.modefiyEmailMemberInfo({
      //         email: params.email
      //       })
      //     }, 1000)
      //   } else {
      //     this.showAlertView(res)
      //   }
      // })
    },
    bindEmailFN (email) {
      let _this = this
      let params = {}
      params.email = email
      params.password = this.newPsw2
      _this.anonymousUserBindEmail(params).then((res) => {
        console.log('res', res)
        if (res.success) {
          // setTimeout(() => {
          //   _this.updateAlertType('bindEmail')
          //   _this.modefiyEmailMemberInfo({
          //     email: params.email
          //   })
          // }, 1000)
          _this.alertMessageNotBox('恭喜你绑定成功', 'okIcon')
          _this.getUserInfo()
        } else {
          _this.alertMessageNotBox(res.errorMsg)
        }
      })
    },
    showAlertView (errorinfo) {
      this.updateAlertType('showMessage')
      this.alertMessage = errorinfo.errorMsg
      this.alertButton = '确定'
    },
    loadData () {
    },
    closeWin () {
      this.updateAlertType('')
      this.$refs['setAlert'].$emit('isShowSetAlert', false)
    },
    updateAlertMessage (msg) {
      this.alertMessage = msg
    },
    updateAlertButton (text) {
      this.alertButton = text
    }
  }
}
</script>

<style lang="less" scoped>
.user-bind-wrap {
  width: 100%;
  background: #fff;
  // margin-top: 90px;
  .user-bind-nav {
    width: 100%;
    height: 60px;
    background-color: #ffffff;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #6d6d6d;
    border-bottom: 1px solid #ededed;
    border-radius: 4px;
    position: relative;
    padding-left: 25px;
    a {
      display: inline-block;
      float: left;
      height: 60px;
      font-size:16px;
      font-family:PingFangSC-Semibold;
      font-weight:500;
      color:#3C5B6FFF;
      text-align: center;
      margin-right: 50px;
      // border-right: 1px solid #EEF2F3;
      line-height: 60px;
      &:hover {
        color: #2A9FE4;
      }
      &.active {
        color: #0581D1;
        font-weight: bold;
        border-bottom: 3px solid #2A9FE4FF;
      }
    }
    a:last-child {
      border-right: 0;
    }
  }
}

// .user-setting-form form > div {
//   /*height: 40px;*/
//   line-height: 40px;
//   margin: 15px 0;
// }

// .user-setting-form form > div.error .reg-input {
//   border-color: #e46773;
// }

// .user-setting-form form > div .reg-input {
//   width: 320px;
//   border: 1px solid #dcdbdb;
//   border-radius: 5px;
//   padding-left: 19px;
// }

// .user-setting-form form > div > span {
//   font-size: 20px;
//   color: #4a4a4a;
//   margin-right: 20px;
// }

// .learn-bind-psd {
//   font-size: 18px;
//   font-weight: normal;
//   font-style: normal;
//   font-stretch: normal;
//   color: #4a4a4a;
//   margin-top: 24px;
// }
// .learn-bind-psd-input {
//   width: 320px;
//   border: 1px solid #dcdbdb;
//   border-radius: 5px;
//   padding-left: 18px;
//   height: 45px;
//   margin-left: 5px;
//   font-size: 16px;
// }
// .learn-bind-submit {
//   margin-top: 26px !important;
// }
// .learn-bind-error {
//   color: #e46773;
//   font-size: 10px;
// }

// .user-setting-form .submit {
//   width: 162px;
//   height: 47px;
//   border-radius: 4px;
//   background-color: #0e8abe;
//   text-align: center;
//   line-height: 47px;
//   color: #fff;
//   cursor: pointer;
//   margin-top: -6px;
// }

// .user-setting-form .learn-setting-error-tips-settingpage {
//   color: #e46773;
//   font-size: 12px;
//   height: 20px;
//   margin: 0;
//   line-height: 20px;
//   padding-left: 64px;
// }

// .learn-setting-error-tips-settingpage i {
//   display: inline-block;
//   width: 13px;
//   height: 13px;
//   background: url(../../../../static/images/learn/learn-login-tanhao.svg) no-repeat;
//   position: relative;
//   top: 3px;
//   margin-right: 5px;
// }

.bindPhone-error-tips {
  display: flex;
  align-items: center;
  font-size:12px;
  font-weight:400;
  color:rgba(221,43,43,1);
  position: relative;
  padding-top: 14px;
  padding-left: 88px;
}

.bindPhone-error-tips i {
  display: inline-block;
  width: 13px;
  height: 13px;
  background: url('../../../../static/images/userInfo/error-icon.svg') no-repeat center;
  background-position: center;
  position: relative;
  // top: 3px;
  margin-right: 8px;
}

.user-setting-form {
  width: 100%;
  form {
    padding: 62px 60px 240px;
    .user-bind-content {
      display: inline-block;
      span {
        display: inline-block;
        text-align: right;
        width: 64px;
        font-size: 14px;
        font-weight: 500;
        color: #444444;
        line-height: 40px;
      }
      input {
        width: 280px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid #C8D4DBFF;
        padding: 0 10px;
        margin: 0 14px 16px 20px;
      }
    }
    .learn-setting-error-tips-settingpage {
      display: inline-block;
      position: relative;
      font-size:12px;
      font-weight:400;
      color:rgba(221,43,43,1);
      line-height: 12px;
      line-height: 40px;
      i {
        display: inline-block;
        position: absolute;
        top: 50%;
        margin-top: -6px;
        width: 12px;
        height: 12px;
        background: url('../../../../static/images/userInfo/error-icon.svg') no-repeat center;
        background-size: cover;
      }
      em {
        margin-left: 18px;
      }
    }
  }
  input {
    font-size: 14px;
  }
  // 保存修改
  .submit {
    display: block;
    width: 160px;
    height: 36px;
    font-size:16px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    padding: 6px 48px;
    background: #0581D1;
    color: #fff;
    border-radius: 22px;
    margin-left: 88px;
    margin-top: 32px;
    &:hover {
      background: #2A9FE4;
    }
    &:active {
      background: #0581D1;
    }
  }
}
</style>
