<template>
  <transition name="fade">
    <div class="common-modal-container" v-show="isShow">
      <div class="common-madal">
       <section class='user-settingView-alert-bindPhone'>
        <p class='userView-bindPhone-title'>绑定手机号</p>
        <i class='close' @click="closeView()"></i>
        <div class='userView-bindPhone-main'>
          <p class='bindPhone-sentNumber'>验证码已发送至：<span>+86 {{ phone }}</span></p>
          <p class='receive-btn'>
            <input type="text" v-model="verificationCode">
            <!-- <a v-show='resendPhone' @click='resendPhoneVer'>重新获取</a> -->
            <button v-bind:disabled="!isGetCode" @click="resendPhoneCode()"><em>{{ time === 60 ? '重新获取' : time+'s秒后重新获取' }}</em></button>
          </p>
          <a class='bindPhone-btn-phone' @click="resetAnonymousPhone()"><span>绑定手机</span></a>
          <p class='bindPhone-time-limited-tips'>您的验证码在5分钟内有效</p>
        </div>
      </section>
      </div>
    </div>
  </transition>
</template>
<script>
import Bus from '../../../bus.js'
import { mapState, mapActions, mapMutations } from 'vuex'
import cookie from '../../../tool/cookie'

export default {
  data () {
    return {
      isShow: false,
      phone: '',
      time: 60,
      verificationCode: ''
    }
  },
  created () {
    Bus.$on('showBindPhone', (data) => {
      console.log('绑定手机号', data)
      this.isShow = true
      this.phone = data
      this.initSendCode(data)
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    // 手机验证码获取
    isGetCode () {
      return this.time === 60
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions({
      getUserInfo: 'getUserInfo', // 获取用户信息
      userBindPhone: 'userBindPhone', // 绑定手机号
      sendCode: 'getSendCode'
    }),
    ...mapMutations({
      updateIsAnonymous: 'updateIsAnonymous'
    }),
    initSendCode (phone) {
      this.sendCode({phonenumber: phone, codeLen: '4'}).then(res => {
        console.log('发送验证码', res)
        if (res.success) {
          this.timer = setInterval(() => {
            --this.time
            if (this.time === 0) {
              this.time = 60
              clearInterval(this.timer)
            }
          }, 1000)
        }
      })
    },
    // 重新获取
    resendPhoneCode () {
      this.initSendCode(this.phone)
    },
    closeView () {
      this.isShow = false
    },
    // 绑定手机
    resetAnonymousPhone () {
      console.log('我要绑定手机了')
      var _this = this
      var params = {}
      params.phonenumber = this.phone
      params.code = this.verificationCode
      console.log(params)
      if (!this.verificationCode) {
        _this.alertMessageError('输入验证码不正确！')
        return false
      }
      _this.userBindPhone(params).then((res) => {
        console.log('res', res)
        if (res.success) {
          _this.isShow = false
          _this.alertMessageError('恭喜你，绑定手机号成功')
          _this.verificationCode = ''
          // _this.$parent.loadData()
          cookie.delCookie('is_anonymous')
          cookie.setCookie('is_anonymous', false)
          _this.updateIsAnonymous(false)
          _this.$router.push({ path: '/app/index' })
          _this.getUserInfo()
        } else {
          _this.alertMessageError(res)
        }
      })
    },
    // 提示用户的信息不完整
    alertMessageError (msg) {
      let obj = {
        className: 'warnIcon',
        description: `${msg}`,
        btnDesc: '确定',
        isLink: false
      }
      Bus.$emit('showCommonModal', obj)
    }
  }
}
</script>
<style lang="less" scoped>
.common-modal-container {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index:99999999;
  overflow: hidden;
  .common-madal {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 56px 80px;
    margin-left: -190px;
    margin-top: -130px;
    width:560px;
    height:390px;
    background:#fff;
    box-shadow:0px 5px 12px 0px rgba(0,32,50,0.3);
    border-radius:5px;
    text-align: center;
    .userView-bindPhone-title {
      width: 100%;
      font-size:22px;
      font-weight:bold;
      color:rgba(10,43,64,1);
    }
    .close {
      width: 12px;
      height: 12px;
      background-image: url('../../../../static/images/userInfo/close.svg');
      background-repeat: no-repeat;
      background-size: contain;
      position: absolute;
      top: 20px;
      right: 20px;
      opacity: 1;
    }
    .userView-bindPhone-main {
      width: 100%;
      .bindPhone-sentNumber {
        font-size:16px;
        font-weight:500;
        color:rgba(126,146,159,1);
        line-height:22px;
        padding: 40px 0 28px;
      }
      .receive-btn {
        display: flex;
        margin-bottom: 48px;
        input {
          width: 230px;
          height: 44px;
          line-height: 44px;
          border-radius: 5px;
          background-color: #ffffff;
          border: solid 1px #C8D4DBFF;
          padding-left: 20px;
          margin-right: 20px;
        }
        button {
          display: inline;
          padding: 0 20px;
          font-size:14px;
          font-weight:500;
          color:rgba(250,250,250,1);
          background:#0581D1;
          border-radius:5px;
          &:hover {
            background: #2A9FE4;
          }
        }
      }
      button:disabled {
        cursor: not-allowed;
        background:rgba(178,192,201,1);
        &:hover {
          background: #B2C0C9FF;
        }
      }
      .bindPhone-btn-phone {
        padding: 8px 68px;
        font-size:16px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        background: #0581D1;
        border-radius: 20px;
        margin: 44px 0 20px;
        &:hover {
          background: #2A9FE4;
        }
      }
      .bindPhone-time-limited-tips {
        padding-top: 20px;
        font-size:14px;
        font-weight:500;
        color:rgba(229,110,110,1);
      }
    }
  }
}
</style>
