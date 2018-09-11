<template>
  <div>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert' v-show="alertType=='bindSuccess'">
      <div class='vip-update-success-logo animated tada'></div>
      <p>{{ alertMessage }}</p>
      <span @click="closeView">确定</span>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert' v-show="alertType=='bindSuccessPhone'">
      <div class='vip-update-success-logo animated tada'></div>
      <p>{{ alertMessage }}</p>
      <span @click="closeViewJump">确定</span>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert' v-show="alertType=='bindConfirm'">
      <div class='vip-update-success-logo animated tada'></div>
      <p>您确定要解除绑定？</p>
      <p class='setting-login-twoBtns-adjust'><span @click="unbindIdentityFn()">确定</span><span @click="closeView">取消</span></p>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert setting-alert-unbind-fail' v-show="alertType=='bindAccount'">
      <div class='vip-update-success-logo animated tada'></div>
      <p>抱歉！<br>您还没进行绑定！请返回绑定</p>
      <span @click="jumpBind">确定</span>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert setting-alert-unbind-fail' v-show="alertType=='saveNotice'">
      <div class='vip-update-success-logo animated tada'></div>
      <p><i>哦！</i>您还没有进行保存<br>为了不丢失刚才输入的内容,请返回保存哦！</p>
      <!-- 进行返回判定和逻辑的设定 -->
      <p class='setting-login-twoBtns-adjust learn-userInfo-save'><span @click="unbindIdentityFn()">确定</span><span @click="closeView">取消</span></p>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert setting-alert-unbind-fail' v-show="alertType=='bindEmail'">
      <div class='vip-update-success-logo animated tada'></div>
      <p>一封验证邮件已发送至您的邮箱<br>请登录您的邮箱查收并验证！</p>
      <span @click='closeViewJump'>确定</span>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert setting-alert-unbind-fail' v-show='false'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>抱歉！该手机号已绑定过！</p>
      <span>重新输入</span>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert setting-alert-unbind-fail' v-show='false'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>抱歉！该邮箱已绑定过！</p>
      <span>重新输入</span>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert setting-alert-unbind-fail' v-show='false'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>您的账号已在其它终端登录<br>请重新登录！</p>
      <span>登录</span>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert setting-alert-unbind-fail' v-show='false'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>您的密码已修改成功<br>请重新登录！</p>
      <span>重新登录</span>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns setting-alert setting-alert-unbind-fail' v-show="alertType=='showMessage'">
      <div class='vip-update-success-logo animated tada'></div>
      <p v-html="alertMessage"></p>
      <span @click="closeView">{{ alertButton }}</span>
    </section>
    <section class='user-settingView-alert-bindPhone' v-show="alertType=='bindPhone'">
      <p class='userView-bindPhone-title'><i></i>绑定手机号</p>
      <i class='close' @click="closeView"></i>
      <div class='userView-bindPhone-main'>
        <p class='bindPhone-sentNumber'>验证码已发送至：<span>+86 {{ bindPhoneNum }}</span></p>
        <p class='receive-btn'>
          <input type="text" :class="{error: isBindPhoneError}" v-model="verificationCode">
          <span v-show='resendPhone' @click='resendPhoneVer'>重新获取</span>
          <span v-show='!resendPhone' class='countDown'><em>{{ verPhoneSecond }}</em>秒后重新获取</span>
        </p>
        <p class='bindPhone-error-tips' v-show="isBindPhoneError"><i class='user error'></i><em>{{ alertMessage }}</em></p>
        <p class='bindPhone-btn-phone' @click="bindPhone"><span>绑定手机</span></p>
        <p class='bindPhone-time-limited-tips'>您的验证码在5分钟内有效</p>
      </div>
    </section>
    <section class='user-settingView-alert-bindPhone' v-show="alertType=='bindPhoneNumber'">
      <p class='userView-bindPhone-title'><i></i>绑定手机号</p>
      <i class='close' @click="closeView"></i>
      <div class='userView-bindPhone-main'>
        <p class='bindPhone-sentNumber'>验证码已发送至：<span>+86 {{ bindPhoneNum }}</span></p>
        <p class='receive-btn'>
          <input type="text" :class="{error: isBindPhoneError}" v-model="verificationCode">
          <span v-show='resendPhone' @click='resendPhoneVer'>重新获取</span>
          <span v-show='!resendPhone' class='countDown'><em>{{ verPhoneSecond }}</em>秒后重新获取</span>
        </p>
        <p class='bindPhone-error-tips' v-show="isBindPhoneError"><i class='user error'></i><em>{{ alertMessage }}</em></p>
        <p class='bindPhone-btn-phone' @click="resetAnonymous"><span>绑定手机</span></p>
        <p class='bindPhone-time-limited-tips'>您的验证码在5分钟内有效</p>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  props: [
    /**
     * 弹窗显示类型
     * bindPhone 绑定手机号,需要设置bindPhoneNum
     * showMessage 显示错误信息,需要设置alertMessage,alertButton
     * bindSuccess 手机号绑定成功
     * bindConfirm 确认要解除绑定,需要设置bindConfirmType
     */
    'alertType',
    'bindConfirmType', // 需要接触绑定的类型 邮箱=email , 手机号=phonenumber
    'bindPhoneNum', // 需要绑定的手机号
    'alertMessage', // 显示信息,支持dom标签
    'alertButton', // 显示信息,button名称,点击效果为关闭窗口
    'phonePsw' // 匿名用户密码
  ],
  data () {
    return {
      isBindPhoneError: false, // 绑定手机号是否有错误
      verificationCode: '', // 绑定手机的短信验证码
      resendPhone: true, // 重新发送短信
      verPhoneSecond: 60 // 60秒倒计时
    }
  },
  watch: {
    // 监听弹窗显示类型,当有弹窗时触发全屏黑幕
    alertType () {
      if (this.alertType !== '') {
        /**
         * 弹窗时重置内部数据,防止冲突
         * @todo 后续要考虑把弹框组件分离,目前耦合太严重
         */
        this.isBindPhoneError = false
        this.verificationCode = ''
        this.resendPhone = true
        this.verPhoneSecond = 60
        this.updateCoverState(true)
        if (this.alertType === 'bindPhone') {
          this.sixtyPhoneReveres()
        }
        if (this.alertType === 'bindPhoneNumber') {
          this.sixtyPhoneReveres()
        }
      } else {
        this.verPhoneSecond = 60
        this.updateCoverState(false)
      }
    }
  },
  methods: {
    ...mapMutations({
      updateCoverState: 'course/updateCoverState',
      updateAlertType: 'user/updateAlertType',
      updateUserInfo: 'user/updateUserInfo'
    }),
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
      bindPhoneNumber: 'user/bindPhoneNumber',
      resetAnonymous: 'user/resetAnonymous',
      sendCode: 'user/sendCode',
      unbindIdentity: 'user/unbindIdentity'
    }),
    // 关闭本页面
    closeView () {
      this.updateCoverState(false)
      // 告诉父组件,自己需要关闭
      this.$emit('close', '')
    },
    jumpBind () {
      this.updateAlertType('')
      this.$dispatch('anonymous')
      this.$router.go('/v2/user/bind')
    },
    closeViewJump () {
      this.updateAlertType('')
      this.updateCoverState(false)
      // 告诉父组件,自己需要关闭
      this.$emit('close')
      this.$router.go('/v2/user/setting')
    },
    // 绑定手机号
    bindPhone () {
      var _this = this
      var params = {}
      params.phonenumber = this.bindPhoneNum
      params.verification_code = this.verificationCode

      _this.bindPhoneNumber(params).then((res) => {
        if (res.success) {
          _this.updateAlertType('bindSuccess')
          _this.$emit('updateAlertMessage', '恭喜您绑定手机成功！')
          _this.$emit('updateAlertButton', '确定')
          _this.getUserInfo().then((res) => {
            this.updateUserInfo(res)
          })
          _this.$emit('memberupdate')
        } else {
          this.showAlert(res)
        }
      })
    },
    resetAnonymous () {
      var _this = this
      var params = {}
      params.phonenumber = this.bindPhoneNum
      params.password = this.phonePsw
      params.verification_code = this.verificationCode
      _this.resetAnonymous(params).then((res) => {
        if (res.success) {
          _this.updateAlertType('bindSuccessPhone')
          _this.$emit('updateAlertMessage', '恭喜您绑定手机成功！')
          _this.$emit('updateAlertButton', '确定')
          _this.$store.dispatch('modefiyPhoneMemberInfo', {
            phoneNumber: _this.bindPhoneNum
          })
        } else {
          this.showAlert(res)
        }
      })
    },
    // 重新发送短信验证码
    resendPhoneVer () {
      var params = {}
      params.phonenumber = this.bindPhoneNum
      params.type = 'bind_phonenumber'
      this.sendCode(params)
      this.sixtyPhoneReveres()
    },
    // 手机找回密码时倒计时函数
    sixtyPhoneReveres () {
      var _this = this
      _this.verPhoneSecond = 60
      _this.resendPhone = false
      var timeId = setInterval(() => {
        _this.verPhoneSecond--
        if (_this.verPhoneSecond <= 0) {
          clearInterval(timeId)
          _this.resendPhone = true
        }
      }, 1000)
    },
    // 解绑信息
    unbindIdentityFn () {
      var params = {}
      params.identity_type = this.bindConfirmType
      var _this = this
      _this.unbindIdentity(params).then((res) => {
        if (res.success) {
          _this.getUserInfo().then((res) => {
            this.updateUserInfo(res)
          })
          _this.$emit('memberupdate')
          _this.closeView()
        } else {
          this.showAlertView(res)
        }
      })
    },
    showAlertView (res) {
      this.updateAlertType('showMessage')
      this.$emit('updateAlertMessage', res.errorMsg)
      this.$emit('updateAlertButton', '确定')
    },
    showAlert (res) {
      this.$emit('updateAlertMessage', res.errorMsg)
      this.isBindPhoneError = true
    }
  }
}
</script>

<style scoped>
.vip-update-success {
  width: 424px;
  height: 284px;
  border-radius: 4px;
  background-color: #fff;
  position: fixed;
  z-index: 9999999999;
  top: 50%;
  left: 50%;
  margin-left: -212px;
  margin-top: -142px;
  text-align: center;
  box-shadow: 0 3px 5px 0 rgba(0,0,0,.3);
}

.setting-alert .vip-update-success-logo {
  width: 110px;
  height: 110px;
  background-image: url(../../../../static/images/learn/learn-vip-warn.svg);
  background-repeat: no-repeat;
  background-color: #fff;
  background-position: 50%;
  border-radius: 50%;
  padding: 70px;
  position: absolute;
  top: -65px;
  left: 50%;
  margin-left: -75px;
}

.vip-update-success p {
  font-size: 20px;
  color: #4a4a4a;
}

.vip-update-success p:first-of-type {
  margin-top: 65px;
  padding-top: 54px;
}

.user-alert-two-btns span {
  margin-top: 72px;
}

.vip-update-confirm span {
  width: 174px;
  height: 40px;
  border-radius: 100px;
  display: inline-block;
  line-height: 40px;
  background-color: #fd8469;
  cursor: pointer;
  color: #fff;
  margin: 54px 25px;
}

.setting-login-twoBtns-adjust {
  width: 100%;
  margin-top: 50px;
}
.setting-login-twoBtns-adjust span {
  margin: 0;
  width: 120px;
  font-size: 18px;
  margin: 0px !important;
}
.setting-login-twoBtns-adjust span:nth-of-type(1) {
  margin-right: 32.5px !important;
}
.setting-login-twoBtns-adjust span:nth-of-type(2) {
  margin-left: 32.5px;
}
.setting-alert-unbind-fail span {
  margin-top: 44px;
}
.setting-alert-unbind-fail p:nth-of-type(1) {
  font-size: 17px;
}
.setting-alert-unbind-fail p i {
  font-size: 22px;
  font-weight: 400;
  position: relative;
  bottom: 5px;
}
.user-settingView-alert-bindPhone {
  width: 566px;
  height: 400px;
  border-radius: 4px;
  background-color: #ffffff;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -283px;
  z-index: 99999999;
  padding: 33px;
}
.userView-bindPhone-title {
  width: 100%;
  height: 43px;
  line-height: 25px;
  text-align: center;
  font-size: 20px;
  padding-left: 20px;
  color: #3c9bbe;
  border-bottom: 1px solid #d8d8d8;
}
.userView-bindPhone-title i {
  position: absolute;
  width: 17px;
  height: 23px;
  background: url(../../../../static/images/learn/learn-user-setting-bindphone.svg)
    no-repeat;
  background-repeat: no-repeat;
  left: 215px;
}
.user-settingView-alert-bindPhone .close {
  width: 17px;
  height: 17px;
  background-image: url(../../../../static/images/learn/learn-user-setting-bindphone-close.svg);
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 20px;
  right: 20px;
  opacity: 1;
}
.user-settingView-alert-bindPhone .userView-bindPhone-main {
  text-align: center;
}
.user-settingView-alert-bindPhone .bindPhone-sentNumber {
  font-size: 14px;
  color: #9b9b9b;
  margin-top: 40px;
  margin-bottom: 36px;
}
.user-settingView-alert-bindPhone .receive-btn {
  margin-bottom: 60px;
}
.user-settingView-alert-bindPhone .receive-btn input {
  width: 224px;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #dcdbdb;
  padding-left: 20px;
  margin-right: 20px;
}
.user-settingView-alert-bindPhone .receive-btn input.error {
  border-color: #e46773;
}
.user-settingView-alert-bindPhone .receive-btn span {
  display: inline-block;
  width: 134px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  background-color: #3c9bbe;
  cursor: pointer;
}
.user-settingView-alert-bindPhone .receive-btn span:last-child {
  display: inline-block;
  width: 134px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  background-color: #d6d6d6;
  cursor: default !important;
}
.user-settingView-alert-bindPhone .receive-btn span:first-child:hover {
  background-color: #05618d;
}
.user-settingView-alert-bindPhone .bindPhone-btn-phone {
  width: 246px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  border-radius: 100px;
  background-color: #3c9bbe;
  margin: 0 auto;
  cursor: pointer;
}
.bindPhone-btn-phone:hover {
  background-color: #05618d;
}
.bindPhone-time-limited-tips {
  color: #e46773;
  font-size: 12px;
  padding-top: 17px;
}
.bindPhone-error-tips {
  font-size: 12px;
  color: #e46773;
  position: absolute;
  top: 230px;
  left: 93px;
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
.learn-userInfo-save {
  margin-top: 8px !important;
}
</style>
