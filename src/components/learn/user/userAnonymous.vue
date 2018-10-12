<template>
  <div>
    <section class='user-bind-wrap'>
      <div class="userVip-bottom-nav">
        <p @click='swapVipTab(true)' :class="{ 'active': activeTab === true }">手机号绑定</p>
        <p @click='swapVipTab(false)' :class="{ 'active': activeTab === false }">邮箱绑定</p>
      </div>
      <div class='user-setting-form' v-show="activeTab === true">
        <form action="" style='padding-bottom: 20px;'>
          <div :class="{'error': !phone}">
            <span style='position:relative;top:2px'>手机</span>
            <input type="text" placeholder='请填写手机号' class='reg-input' v-model="phone" autocomplete="off">
          </div>
          <div class='learn-setting-error-tips-settingpage' v-show="!phone"><i></i><em>请输入正确的手机号</em></div>
          <div :class="{'error':false}" class='learn-bind-psd'><span style='position:relative;top:3px'>密码</span><input class='learn-bind-psd-input' type="password" placeholder='字母 / 数字 / 下划线 6-15位' v-model="newPsw"></div>
          <div class='learn-setting-error-tips-settingpage' v-show="false"><i></i>您的密码不符合规范，请重新输入</div>
            <div class='submit learn-bind-submit' @click="bindPhoneAccount()">我要绑定</div>
            <p v-show='notice' class='bindPhone-error-tips'><i class='user error'></i><em>请填写完成后再绑定</em></p>
        </form>
      </div>
      <div class="user-setting-form" v-show="activeTab === false">
        <form action="" style='padding-bottom: 20px;'>
          <div :class="{'error':!email}">
            <span style='position:relative;top:2px'>邮箱</span>
            <input type="text" placeholder='请填写邮箱账号' class='reg-input' v-model="email" autocomplete="off">
          </div>
          <div class='learn-setting-error-tips-settingpage' v-show='!email'><i></i><em>请输入正确的邮箱账号</em></div>
          <div :class="{'error':false}" class='learn-bind-psd'><span style='position:relative;top:3px'>密码</span><input class='learn-bind-psd-input' type="password" placeholder='字母 / 数字 / 下划线 6-15位' v-model="newPsw2"></div>
          <div class='learn-setting-error-tips-settingpage' v-show="false"><i></i>您的密码不符合规范，请重新输入</div>
          <div class='submit learn-bind-submit' @click="bindEmailAccount">我要绑定</div>
          <p v-show='noticeEmail' class='bindPhone-error-tips'><i class='user error'></i><em>请填写完成后再绑定</em></p>
        </form>
      </div>
    </section>
    <set-alert
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
import SetAlert from './userSettingAlert.vue'
import Vertify from '../../../tool/vertifyAccount'
export default {
  data () {
    return {
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
    this.newPsw = ''
    this.newPsw2 = ''
    this.email = ''
    this.phone = ''
  },
  computed: {
    ...mapState({
      alertType: state => state.user.alertType
    })
  },
  methods: {
    ...mapMutations({
      updateAlertType: 'user/updateAlertType',
      modefiyEmailMemberInfo: 'user/modefiyEmailMemberInfo'
    }),
    ...mapActions({
      sendCode: 'user/sendCode',
      resetAnonymous: 'user/resetAnonymous'
    }),
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
      if (emailVertify) {
        this.noticeEmail = false
        this.bindEmail()
      }
    },
    bindPhone (phone) {
      var _this = this
      var params = {}
      params.type = 'bind_phonenumber'
      params.phonenumber = this.phone
      this.sendCode(params).then((res) => {
        if (res.success) {
          _this.updateAlertType('bindPhoneNumber')
        } else {
          this.showAlertView(res)
        }
      })
    },
    bindEmail () {
      var _this = this
      var params = {}
      params.email = this.email
      params.password = this.newPsw2
      this.resetAnonymous(params).then((res) => {
        if (res.success) {
          setTimeout(() => {
            _this.updateAlertType('bindEmail')
            _this.modefiyEmailMemberInfo({
              email: params.email
            })
          }, 1000)
        } else {
          this.showAlertView(res)
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

<style scoped>
.user-bind-wrap {
  width: 100%;
  background: #fff;
}

.userVip-bottom-nav {
  width: 100%;
  height: 39px;
  line-height: 39px;
  text-align: center;
  font-size: 16px;
  color: #6d6d6d;
  border-bottom: 1px solid #ededed;
  position: relative;
}

.userVip-bottom-nav p {
  width: 50%;
  float: left;
  cursor: pointer;
  font-size: 16px;
  height: 39px;
}

.user-bind-wrap .userVip-bottom-nav p.active {
  color: #0e8abe;
  border-bottom: 4px solid #0e8abe;
}
.user-bind-wrap .userVip-bottom-nav p {
  background-image: url(../../../../static/images/learn/learn-bind-phone2.svg);
  background-repeat: no-repeat;
  padding-left: 20px;
}
.user-bind-wrap .userVip-bottom-nav p:first-child {
  background-position: 110px 12px;
  background-size: 13px;
}
.user-bind-wrap .userVip-bottom-nav p:last-child {
  background-position: 111px 13px;
  background-size: 16px;
}
.user-bind-wrap .userVip-bottom-nav p.active {
  background-image: url(../../../../static/images/learn/learn-bind-phone.svg);
}
.user-bind-wrap .userVip-bottom-nav p:nth-of-type(2) {
  background-image: url(../../../../static/images/learn/learn-bind-email2.svg);
}
.user-bind-wrap .userVip-bottom-nav p:nth-of-type(2).active {
  background-image: url(../../../../static/images/learn/learn-bind-email.svg);
}
.user-bind-wrap .userVip-bottom-nav p:nth-of-type(2):hover {
  background-image: url(../../../../static/images/learn/learn-bind-email.svg) !important;
}
.user-bind-wrap .userVip-bottom-nav p:nth-of-type(1):hover {
  background-image: url(../../../../static/images/learn/learn-bind-phone.svg) !important;
}
.user-setting-form {
  width: 100%;
  padding: 31px;
}
.user-setting-form form > div {
  /*height: 40px;*/
  line-height: 40px;
  margin: 15px 0;
}

.user-setting-form form > div.error .reg-input {
  border-color: #e46773;
}

.user-setting-form form > div .reg-input {
  width: 320px;
  border: 1px solid #dcdbdb;
  border-radius: 5px;
  padding-left: 19px;
}

.user-setting-form form > div > span {
  font-size: 20px;
  color: #4a4a4a;
  margin-right: 20px;
}

.learn-bind-psd {
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  color: #4a4a4a;
  margin-top: 24px;
}
.learn-bind-psd-input {
  width: 320px;
  border: 1px solid #dcdbdb;
  border-radius: 5px;
  padding-left: 18px;
  height: 45px;
  margin-left: 5px;
  font-size: 16px;
}
.learn-bind-submit {
  margin-top: 26px !important;
}
.learn-bind-error {
  color: #e46773;
  font-size: 10px;
}

.user-setting-form .submit {
  width: 162px;
  height: 47px;
  border-radius: 4px;
  background-color: #0e8abe;
  text-align: center;
  line-height: 47px;
  color: #fff;
  cursor: pointer;
  margin-top: -6px;
}

.user-setting-form .learn-setting-error-tips-settingpage {
  color: #e46773;
  font-size: 12px;
  height: 20px;
  margin: 0;
  line-height: 20px;
  padding-left: 64px;
}

.learn-setting-error-tips-settingpage i {
  display: inline-block;
  width: 13px;
  height: 13px;
  background: url(../../../../static/images/learn/learn-login-tanhao.svg) no-repeat;
  position: relative;
  top: 3px;
  margin-right: 5px;
}

.bindPhone-error-tips {
  font-size: 12px;
  color: #e46773;
  position: relative;
}

.bindPhone-error-tips i {
  display: inline-block;
  width: 13px;
  height: 13px;
  background: url(../../../../static/images/learn/learn-login-tanhao.svg) no-repeat;
  position: relative;
  top: 5px;
  margin-right: 5px;
}
</style>
