<template>
  <div>
    <section class='user-setting-wrap'>
      <div class="user-setting-nav">
        <a @click='swapVipTab(true)' :class="{ 'active': activeTab === true }">基本资料</a>
        <a @click='swapVipTab(false)' :class="{ 'active': activeTab === false }">修改密码</a>
      </div>
      <div class='user-setting-form' v-show="activeTab === true">
        <div class="user-setting-item">
          <div class="user-setting-item-left">
            <span>昵称</span>
            <input type="text" placeholder='' maxlength="50"
                    :class="['reg-input', {'error':!nicknameError}]"
                    v-model="nickname">
          </div>
          <div class='learn-setting-error-tips-settingpage' v-show='!nicknameError'>
            <i></i><em>昵称限制50个字符</em>
          </div>
        </div>
        <div class="user-setting-item">
          <div class="user-setting-item-left">
            <span>手机</span>
            <input type="text" placeholder=''
                    :class="['reg-input', {'error':!phoneNumberValidator}]"
                    v-model="phone"
                    maxlength="11">
            <div class="bind-phone-box" v-if="!phonenumberConfirmed">
              <em class=''>未绑定</em>
              <a class=''
                 @click="bindPhoneNumber(phone)"
                 v-show="phoneNumberValidator&&phone">绑定手机</a>
            </div>
            <div class="bind-phone-box" v-if="phonenumberConfirmed">
              <em class=''>已绑定</em>
              <a class=''
                 @click="unbindIdentityFun('phonenumber')">解除绑定</a>
            </div>
          </div>
          <div class='learn-setting-error-tips-settingpage' v-show='!phoneNumberValidator&&phone'>
            <i></i><em>请输入正确的手机号</em>
          </div>
        </div>
        <div class="user-setting-item">
          <div class="user-setting-item-left">
            <span>邮箱</span>
            <input type="text" placeholder=''
                    :class="['reg-input', {'error':!mailValidator}]"
                    v-model="email">
            <div class="bind-phone-box" v-if="emailConfirmedStatus == 0">
              <em class=''>未绑定</em>
              <a class=''
                 @click="bindEmailFun(email)"
                 v-show="mailValidator&&email">绑定邮箱</a>
            </div>
            <div class="bind-phone-box" v-if="emailConfirmedStatus == 1">
              <em class='' v-show="false">未验证</em>
              <a class='' style=""
                 @click="confirmEmail(email)" v-show="false">验证邮箱</a>
              <a class='' style=''
                 @click="unbindIdentityFun('email')">删除邮箱</a>
            </div>
            <div class="bind-phone-box" v-if="emailConfirmedStatus == 2">
              <em class=''>已绑定</em>
              <a class='' style=""
                 @click="unbindIdentityFun('email')">解除绑定</a>
            </div>
          </div>
          <div class='learn-setting-error-tips-settingpage' v-show="!mailValidator&&email">
            <i></i><em>请输入正确的邮箱账号</em>
          </div>
        </div>
        <div class="user-setting-item" :class="{'error':!gender}">
          <span>性别</span>
          <div class='selsex'>
            <gender-selector id="selsex-content" ref="gender" :value="'male'" @update="updateGender"></gender-selector>
          </div>
        </div>
        <div class="user-setting-item" :class="{'error':!birthday}">
          <span>生日</span>
          <div class='seldate'>
            <date-picker id="seldate-content" ref="datePicker" @update="updateBirthday"></date-picker>
          </div>
        </div>
        <div class="user-setting-item" :class="{'error':!country}">
          <span>国籍/地区</span>
          <div class='selsex selcity'>
            <country-selector id="selcity-content" ref="country" :value="country" @update="updateCountry"></country-selector>
          </div>
        </div>
        <div class='user-setting-item expertLang-box' :class="{'error':!languageSkill}">
          <span>精通语言</span>
          <div class="selsex sellang">
            <language-skill-selector id="sellang-content" ref="langSkill" :value="languageSkill" @update="updateLanguageSkill"></language-skill-selector>
          </div>
        </div>
        <div  class="user-setting-item intro-box">
          <span>个人介绍</span>
          <textarea class='user-introduction-area' :maxlength='descMaxLeng' v-model='desc'></textarea>
          <p class='words-remain'>您还可以输入<span>{{ descMaxLeng - desc.length }}</span>字</p>
        </div>
        <button class='submit' @click="saveUserInfo()">保存修改</button>
        <p class='bindPhone-error-tips'
           v-show='noticeSetting'>
           <i class='user error'></i><em>带星号*的为必填内容，请填写完成后再保存修改</em>
        </p>
      </div>
      <div class="user-fixpassword" v-show="activeTab === false">
        <p class="user-password-text" v-if="!isAnonymous">
          <span>原密码</span>
          <input type="password" placeholder='' v-model="oldPsw" />
        </p>
        <div class='learn-setting-error-tips-settingpage' v-show="false">
          <i></i>您的密码输入错误，请重新输入
        </div>
        <p class="user-password-text" :class="{'error':false}">
          <span>新密码</span>
          <input type="password" placeholder=''
                  v-on:input="comparePwd()"
                  v-model="newPsw1">
        </p>
        <div class='learn-setting-error-tips-settingpage' v-show="false">
          <i></i>您的密码不符合规范，请重新输入
        </div>
        <p class="user-password-text">
          <span>确认密码</span>
          <input type="password" placeholder=''
                  v-on:input="comparePwd()"
                  v-model="newPsw2">
        </p>
        <!--  v-show="!isSame" -->
        <div class='learn-setting-error-tips-settingpage' v-show="!isSame">
          <i></i>两次输入的密码不同，请重新输入
        </div>
        <button class='submit' @click="modifyPsw()">保存修改</button>
        <p class='bindPhone-error-tips'
            style='bottom:-1px;top:initial;left:28px;'
            v-show='noticePsw'>
          <i class='user error psw-user-error'></i>
          <em>带星号*的为必填内容，请填写完成后再保存修改</em>
        </p>
      </div>
    </section>
    <setting-bind-phone></setting-bind-phone>
    <set-alert
      ref="setAlert"
      :alert-type="alertType"
      :bind-phone-num="phone"
      :alert-message="alertMessage"
      :bind-confirm-type="bindConfirmType"
      :alert-button="alertButton"
      @updateAlertMessage="updateAlertMessage"
      @updateAlertButton="updateAlertButton"
      @memberupdate="loadData"
      @close="closeWin()"
    >
    </set-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapState, mapMutations, mapActions } from 'vuex'
import cookie from '../../../tool/cookie'
import Bus from '../../../bus.js'
import Constant from '../../../api/constant'
import SetAlert from './userSettingAlert.vue'
import SettingBindPhone from './userSettingBindPhone.vue'
import DatePicker from '../../common/user/datepicker.vue'
import GenderSelector from '../../common/user/generSelector.vue'
import CountrySelector from '../../common/user/countrySelector.vue'
import LanguageSkillSelector from '../../common/user/languageSkillSelector.vue'

export default {
  components: {
    DatePicker,
    SetAlert,
    SettingBindPhone,
    GenderSelector,
    CountrySelector,
    LanguageSkillSelector
  },
  data () {
    return {
      activeTab: true, // tab切换,true=基本资料,false=修改密码
      nickname: '', // 用户昵称
      phone: '', // 用户的手机号码
      phonenumberConfirmed: false, // 手机号是否验证
      email: '', // 用户的email信息
      emailConfirmedStatus: 0, // 邮箱状态,0=未绑定,1=未验证,2=已验证
      gender: '', // 用户的性别信息,结构详见constant.js
      birthday: '', // 生日信息
      country: {}, // 用户的国籍信息
      languageSkill: [], // 精通语言
      desc: '', // 用户的描述信息
      // description: '',
      descMaxLeng: 30, // 描述的最大长度
      /**
       * 弹出框类型,详见UserSettingAlertView.vue
       */
      // alertType: '', // 弹出框类型,详见UserSettingAlertView
      alertMessage: '', // 弹出框的错误信息
      alertButton: '', // 弹出框的button名称
      bindConfirmType: 'email', // 默认解除绑定的类型
      oldPsw: '', // 原密码
      newPsw1: '', // 新密码1
      newPsw2: '', // 新密码2
      isSame: true, // 判断新密码两次输入是否一致
      noticePsw: false, // 以前密码没填全提示信息
      end: 'not use', // 没用
      noticeSetting: false // 以前修改用户信息提示
    }
  },
  created () {
    this.$on('coverShow', () => {
      this.updateAlertType('')
    })
    Bus.$on('settingUpdate', (type) => {
      this.unbindEmitMethod(type)
    })
  },
  mounted () {
    window.zhuge.track('学习系统-用户中心-设置')
    this.$parent.$emit('activeNavUserItem', 'setting')
    this.$parent.$emit('navItem', 'user')
    // let ui = JSON.parse(sessionStorage.getItem('userInfo'))
    this.loadData()
    // isAnonymous 为true就是匿名用户跳到绑定，false就是老用户
    let isAnonymous = cookie.getCookie('is_anonymous') === 'true'
    if (isAnonymous) {
      // this.updateUserAnonymous(true)
      this.$refs['setAlert'].$emit('isShowSetAlert', true)
      this.updateAlertType('bindAccount')
    }
    this.hoverSelect()
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      alertType: state => state.user.alertType
    }),
    nicknameError () {
      if (this.nickname.length === 0 || this.nickname.length > 50) {
        return false
      } else {
        return true
      }
    },
    phoneNumberValidator () {
      return /^1(3|4|5|6|7|8)\d{9}$/.test(this.phone)
    },
    mailValidator () {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)
    },
    passowrdValidator (pwd) {
      return /^(\w){6,15}$/.test(pwd) // 字母数字下划线 6-15位
    },
    languageHandler () {
      return this.$store.state.user.languageHandler
    },
    isAnonymous () {
      return cookie.getCookie('is_anonymous') === 'true'
    }
  },
  methods: {
    ...mapMutations({
      updateUserAnonymous: 'user/updateUserAnonymous',
      updateAlertType: 'user/updateAlertType'
    }),
    ...mapActions({
      getUserInfo: 'getUserInfo', // 获取用户信息
      userExistsPhone: 'userExistsPhone', // 验证手机号是否存在
      bindEmail: 'user/bindEmail',
      userExistsEmail: 'userExistsEmail', // 验证邮箱是否存在
      unbindIdentity: 'user/unbindIdentity', // 解除绑定
      // updateInfo: 'user/updateInfo',
      updateInfo: 'updateUserInfo',
      resetPwd: 'user/resetPwd',
      changePwd: 'user/changePwd'
      // getUserInfos: 'user/getUserInfo'
    }),
    loadData () {
      var _this = this
      var result = JSON.parse(sessionStorage.getItem('userInfo'))
      if (result.member_info['is_anonymous'] === 'true') {
        // _this.updateUserAnonymous(true)
        // _this.updateAlertType('bindAccount')
      }
      console.log('result', result)
      if (result.nickname === undefined) {
        _this.nickname = ''
      } else {
        _this.nickname = result.nickname
      }

      if (result.phonenumber === undefined || result.phonenumber === '') {
        _this.phonenumberConfirmed = false
        _this.phone = ''
      } else {
        _this.phonenumberConfirmed = true
        _this.phone = result.phonenumber
      }

      if (result.email === undefined || result.email === '') {
        _this.emailConfirmedStatus = 0
        _this.email = ''
      } else if (result.email_confirmed === 0) {
        _this.emailConfirmedStatus = 1
        _this.email = result.email
      } else {
        _this.emailConfirmedStatus = 2
        _this.email = result.email
      }
      if (result.gender === undefined || result.gender === '') {
        _this.gender = Constant.getGenderSelectorDataByCode('')
      } else {
        _this.gender = Constant.getGenderSelectorDataByCode(result.gender)
      }

      this.$refs['gender'].$emit('init', _this.gender)

      if (result.birthday === undefined || result.birthday < 1000) {
        _this.birthday = ''
      } else {
        // var _date = new Date(result.birthday * 1000)
        // _this.birthday =
        //   _date.getFullYear() +
        //   '-0' +
        //   (_date.getMonth() + 1) +
        //   '-0' +
        //   _date.getDate()
        _this.birthday = result.birthday
      }

      this.$refs['datePicker'].$emit('initDate', _this.birthday)

      if (result.country) {
        var _tmp = {}
        _tmp.language = result.country.country_code
        _tmp.name = result.country.country_name
        _this.country = _tmp
      }

      _this.$refs['country'].$emit('init', _this.country)

      _this.languageSkill = ''
      if (result.skill_langs.length === 0) {
        _this.languageSkill = ''
      } else {
        result.skill_langs.forEach((value, index, array) => {
          var _tmp = {}
          _tmp.lan_code = value.lan_code
          _tmp.name = value.name
          _this.languageSkill = _tmp
        })
      }

      _this.$refs['langSkill'].$emit('init', _this.languageSkill)

      if (result.description === undefined) {
        _this.desc = ''
      } else {
        _this.desc = result.description
      }
    },
    /**
     * true=显示基本资料
     * false=显示修改密码
     */
    swapVipTab (value) {
      this.activeTab = value
    },
    uploadPicBtn () {
      $('#avatar-modal').fadeIn()
    },
    // 解除绑定的方法
    unbindIdentityFun (type) {
      console.log('type', type)
      if (!(this.phone && this.email)) {
        this.alertMessageNotFull('不能解除唯一的身份证明')
        return false
      }
      this.type = type
      let obj = {
        className: 'warnIcon',
        buttonClass: 'buttonClass',
        description: `你确定要解除绑定吗？`,
        btnCancel: '取消',
        btnDesc: '确定',
        isLink: false,
        emitMethod: type
      }
      Bus.$emit('showCommonModal', obj)
    },
    async unbindEmitMethod (type) {
      var params = {}
      params.identity_type = type
      var _this = this
      await _this.unbindIdentity(params).then((res) => {
        console.log('解绑信息', res)
        if (res.success) {
          this.updateAlertType('')
          this.email = ''
        } else {
          _this.showAlertView(res)
        }
      })
      await _this.getUserInfo()
      _this.loadData()
    },
    // 绑定手机号
    async bindPhoneNumber (phonenumber) {
      let _this = this
      let params = {}
      params.phonenumber = phonenumber
      await _this.userExistsPhone(params).then(res => {
        console.log('res', res)
        if (res.exists) { // 存在
          this.phone = ''
          this.alertMessageNotFull('手机号已经存在！')
        } else { // 不存在
          Bus.$emit('showBindPhone', phonenumber)
        }
      })
    },
    showAlertView (errorinfo) {
      this.alertMessageNotFull(errorinfo.errorMsg)
    },
    // 监听性别组件的变更信息
    updateGender (newSelected) {
      this.gender = newSelected
    },
    // 监听国家组件的变更信息
    updateCountry (newSelected) {
      this.country = newSelected
    },
    // 监听精通语言组件的变更信息
    updateLanguageSkill (newSelected) {
      this.languageSkill = newSelected
    },
    updateBirthday (val) {
      this.birthday = val
    },
    // 绑定邮箱
    async bindEmailFun (email) {
      console.log('eamil', email)
      var _this = this
      let params = {}
      params.email = email
      await _this.userExistsEmail(params).then(res => {
        console.log('绑定邮箱返回', res)
        if (res.exists) { // 存在
          _this.alertMessageNotFull('邮箱已经存在！')
          _this.email = ''
        } else { // 不存在
          this.bindEmailMethod(email)
        }
      })
    },
    async bindEmailMethod (email) {
      var _this = this
      await this.bindEmail(email).then((res) => {
        console.log('绑定邮箱返回', res)
        if (res.success) {
          this.alertMessageNotFull('恭喜您绑定邮箱成功！')
        } else {
          _this.showAlertView(res)
        }
      })
      await _this.getUserInfo()
      _this.loadData()
    },
    // 发送邮箱确认邮件
    confirmEmail (email) {
      this.updateAlertType('showMessage')
      this.alertMessage = '一封验证邮件已发送至您的邮箱'
      this.alertButton = '确定'
    },
    // 提示用户的信息不完整
    alertMessageNotFull (msg, icon) {
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
    transForm (birthday) {
      if (birthday) {
        var _date = new Date(birthday * 1000)
        return (
          _date.getFullYear() +
          '-' +
          (_date.getMonth() + 1) +
          '-' +
          _date.getDate()
        )
      } else {
        return ''
      }
    },
    saveNotice () {
      this.updateAlertType('saveNotice')
    },
    // 保存修改用户信息
    async saveUserInfo () {
      var _params = {}
      if (this.nickname !== '') {
        _params.nickname = this.nickname
      } else {
        this.alertMessageNotFull('用户名不能为空！')
        return false
      }
      if (this.gender) {
        _params.gender = this.gender.language
      } else {
        this.alertMessageNotFull('性别不能为空！')
        return false
      }
      if (this.birthday) {
        _params.birthday = this.birthday
      } else {
        this.alertMessageNotFull('生日不能为空！')
        return false
      }
      if (this.country.language) {
        _params.country_code = this.country.language
      } else {
        this.alertMessageNotFull('国籍/地区不能为空！')
        return false
      }
      // 精通语言
      if (this.languageSkill) {
        _params.skillLangs = this.languageSkill['lan_code']
      } else {
        this.alertMessageNotFull('母语不能为空！')
        return false
      }
      if (this.desc !== '') {
        _params.description = this.desc
      }
      var photoUrl = $('#defaultUserImg').attr('src')
      if (photoUrl) {
        _params.photo_url = photoUrl.split('/').slice(3).join('/')
      }
      var _this = this
      await _this.updateInfo(_params).then((res) => {
        console.log('修改用户信息', res)
        if (res.success) {
          this.alertMessageNotFull('修改成功', 'okIcon')
          this.noticeSetting = false
        } else {
          _this.showAlertView(res)
        }
      })
      await _this.getUserInfo()
    },
    // 修改密码
    modifyPsw () {
      var _this = this
      var _params = {}
      if (this.isAnonymous) { // true 新用户
        if (this.newPsw1.length === 0 || this.newPsw2.length === 0) {
          this.alertMessageNotFull('两次输入的密码不一致!')
          return false
        }
        _params.password = this.newPsw2
        console.log('=====', _params)
        _this.resetPwd(_params).then((res) => {
          if (res.success) {
            this.alertMessageNotFull('密码修改成功!', 'okIcon')
          } else {
            _this.showAlertView(res)
          }
        })
      } else { // false 老用户
        if (this.oldPsw.length === 0) {
          this.alertMessageNotFull('旧密码不能为空！')
          return
        }
        if (this.newPsw1.length === 0) {
          this.alertMessageNotFull('新密码不能为空！')
          return
        }
        if (this.newPsw2.length === 0) {
          this.alertMessageNotFull('请确定密码，谢谢！')
          return
        }
        if (!this.isSame) {
          this.alertMessageNotFull('两次输入的新密码不一致！')
          return
        }
        _params.old_pwd = this.oldPsw
        _params.new_pwd = this.newPsw2
        _this.changePwd(_params).then((res) => {
          if (res.success) {
            this.alertMessageNotFull('密码修改成功!', 'okIcon')
          } else {
            _this.showAlertView(res)
          }
        })
      }
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
    },
    comparePwd () {
      if (!this.newPsw2) {
        this.isSame = true
        return
      }
      if (this.newPsw1 && this.newPsw2 && this.newPsw1 === this.newPsw2) {
        this.isSame = true
      } else {
        this.isSame = false
      }
    },
    hoverSelect () {
      $('.multiselect__content li').hover(() => {
        $('.multiselect__content li').css('background-color', '#EEF2F3FF')
      }, () => {
        $('.multiselect__content li').css('background-color', '#ffffff')
      })
    }
  }
}
</script>

<style lang="less" scoped>
input {
  display: inline-block;
  -webkit-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  -o-appearance: none;
  appearance: none;
  outline: none;
  color: inherit;
  overflow: visible;
  background-color: transparent;
  box-shadow: none;
  border-radius: 0;
}
.user-setting-wrap {
  width: 100%;
  background: #fff;
}

.user-setting-form>div .error {
  border-color: #e46773;
}

.user-setting-form > div .selsex {
  width: 140px;
  /*height: 40px;*/
  display: inline-block;
}
.user-setting-form .multiselect__tags {
  padding: 0;
  border-color: #dcdbdb;
}
.user-setting-form .multiselect__input,
.user-setting-form .multiselect__single {
  min-height: auto;
  height: 40px;
  line-height: 40px;
  margin-bottom: 0;
  padding-left: 15px;
  font-size: 18px;
}
.user-setting-form .multiselect__select {
  z-index: 999;
  height: 24px;
  right: 1px;
  top: 7px;
}
.user-setting-form > div > span {
  font-size: 18px;
}
.user-setting-form .seldate {
  /*width:100px;*/
  height: 40px;
  line-height: 40px;
  display: inline-block;
}
.user-setting-form .seldate input {
  height: 40px !important;
  line-height: 40px;
  border-radius: 5px;
  border-color: #dcdbdb !important;
}
.user-setting-form .picker-wrap {
  width: 400px !important;
}
.user-setting-form .btn-prev,
.user-setting-form .btn-next {
  padding: 0 5px !important;
}
.user-setting-form > div .selcity {
  width: 220px;
}
.user-setting-form .multiselect__input,
.user-setting-form .multiselect__single {
  color:#dcdbdb !important;
}
.user-setting-form .user-introduction-area {
  width: 474px;
  height: 127px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #dcdbdb;
  resize: none;
  padding: 0 20px;
  line-height: 34px;
  margin-left: 23px;
}

.user-fixpassword .submit:hover {
  background-color: #05618d;
}

.user-setting-form > div.intro-box {
  height: 177px;
}

.intro-box {
  position: relative;
  display: flex;
  align-items: flex-start;
}
.user-setting-form .words-remain {
  color: #b0b0b0;
  font-size: 14px;
  position: absolute;
  bottom: 11px;
  left: 96px;
}
.user-setting-form .words-remain span {
  color: #3c9bbe;
}
.user-setting-wrap .user-setting-form .seldate .datetime-picker:before {
  position: absolute;
  right: 16px;
  top: 15px;
  color: #999;
  margin-top: 4px;
  border-style: solid;
  border-width: 5px 5px 0;
  border-color: #999 transparent transparent;
  content: "";
  -webkit-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}
.user-setting-wrap .user-setting-form .seldate-arrowUp .datetime-picker:before {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.user-setting-wrap .user-setting-form .multiselect__tags {
  /*width:294px;*/
}
.user-setting-form .multiselect__tag {
  background: #3c9bbe;
}
.user-setting-form
  .learn-study-doc-right-wrap
  ol
  > li:nth-of-type(1)
  .multiselect__tags {
  width: 123px;
}
.user-setting-form .multiselect__tag ~ .multiselect__input {
  /*display: none;*/
}
.user-setting-form .multiselect__tag-icon {
  border-radius: 0px 5px 5px 0px;
}
.user-setting-form .multiselect__tag-icon:hover {
  background: #05618d;
}
.user-wrap .user-setting-form > div .sellang {
  width: 190px;
}
.user-wrap .user-setting-require-item {
  color: #ff785a;
  position: relative;
  top: 5px;
  left: 2px;
}
.user-wrap .user-setting-require-item-adjust-spe {
  left: 5px;
}
.user-setting-form > div.error .reg-input {
  border-color: #e46773;
}
.user-setting-form > div.error .multiselect__tags {
  border-color: #e46773;
}
.user-setting-form .bind-logical-textState {
  font-size: 14px;
  color: #0e8abe;
  margin-right: 22px;
}
.user-setting-form .bind-logical-btnState {
  display: inline-block;
  width: 80px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  border-radius: 4px;
  background-color: #0e8abe;
  cursor: pointer;
  margin-top: 6px;
}
.user-setting-form .adjustOff {
  position: relative;
  /* right: 56px; */
  line-height: 30px;
}
.user-setting-form .bind-logical-btnState:hover {
  background: #05618d;
}
.user-setting-form .adjust {
  position: relative;
  right: 70px;
  line-height: 40px;
}
.user-setting-form .bindEmail {
  line-height: 30px;
}
.user-right-wrap {
  position: relative;
}
.user-setting-form .upload-section-user {
  margin-bottom: 30px;
  height: 90px;
}
.user-setting-form .upload-section-user .adjust {
  right: -20px;
  top: 53px;
}
.user-setting-form .upload-section-user img {
  width: 90px;
  height: 90px;
  border-radius: 500px;
  cursor: default;
  display: inline-block;
}

.user-setting-form .seldate .Wdate {
  background-position: 150px center;
  height: 40px !important;
  line-height: 40px;
  padding-left: 15px;
}
.user-setting-form .error .seldate .Wdate {
  border-color: #e46773 !important;
}
.user-fixpassword p.error > input {
  border-color: #e46773;
  /* margin-top: 10px; */
}
.user-setting-wrap .user-setting-form .multiselect__input,
.user-setting-wrap .user-setting-form .multiselect__single {
  font-size: 16px;
}
.user-setting-form .seldate .Wdate {
  background-image: url(../../../../static/images/learn/learn-login-rili.svg);
  background-size: 15px 20px;
}
.psw-user-error {
  margin-top: 8px !important;
}
.user-setting-wrap {
  width: 100%;
  background: #fff;
  border-radius: 5px;
  .user-setting-nav {
    width: 100%;
    height: 60px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #6d6d6d;
    border-bottom: 1px solid #ededed;
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
      line-height: 60px;
      border-bottom: 3px solid transparent;
      transition: none;
      &:hover {
        color: #2A9FE4;
      }
      &.active {
        color: #0581D1;
        font-size: 18px;
        font-weight: bold;
        border-bottom: 3px solid #2A9FE4FF;
      }
    }
    a:last-child {
      border-right: 0;
    }
  }
  // 基本资料设置样式
  .user-setting-form {
    padding: 60px 54px 114px;
    .user-setting-item {
      width: 100%;
      padding-bottom: 16px;
      span {
        display: inline-block;
        text-align: right;
        width: 64px;
        font-size:14px;
        font-weight:500;
        color:rgba(68,68,68,1);
        line-height: 40px;
      }
      .user-setting-item-left {
        input {
          width: 280px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid #C8D4DBFF;
          padding: 0 10px;
          margin: 0 14px 0 20px;
        }
        .bind-phone-box {
          position: relative;
          display: inline-block;
          height: 40px;
          line-height: 40px;
          em {
            position: absolute;
            left: -76px;
            font-size: 14px;
            color: #0e8abe;
          }
          a {
            display: inline-block;
            width: 80px;
            height: 30px;
            line-height: 30px;
            color: #fff;
            font-size: 14px;
            text-align: center;
            border-radius: 4px;
            background-color: #0581D1;
            margin-top: 6px;
            &:hover {
              background: #2A9FE4;
            }
          }
        }
      }
      .learn-setting-error-tips-settingpage {
        display: flex;
        align-items: center;
        padding-left: 88px;
        padding-top: 4px;
        em {
          font-size:12px;
          font-weight:400;
          color:rgba(221,43,43,1);
        }
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url('../../../../static/images/userInfo/error-icon.svg') no-repeat center;
          background-size: cover;
          margin-right: 8px;
        }
      }
      .seldate {
        width: 220px;
        margin-left: 23px;
        .cov-vue-date {
          width: 220px;
          input {
            width: 220px;
          }
        }
      }
      .sellang {
        width: 220px;
      }
      .selsex {
        // width: 140px;
        margin-left: 23px;
        #selsex-content {
          width: 100%;
          .multiselect__tags {
            .multiselect__input {
              width: 100%;
            }
          }
        }
      }
    }
    .intro-box {
      position: relative;
      display: flex;
      align-items: flex-start;
      .words-remain {
        left: 90px;
        bottom: 26px;
        span {
          display: inline;
          line-height: 20px;
          color: #0581D1;
          padding: 0 6px;
        }
      }
    }
  }
  // 修改密码
  .user-fixpassword {
    width: 100%;
    padding: 62px 60px 240px;
    .user-password-text {
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
      font-size:12px;
      font-weight:400;
      color:rgba(221,43,43,1);
      padding: 0px 0 46px 88px;
      line-height: 12px;
      i {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: url('../../../../static/images/userInfo/error-icon.svg') no-repeat center;
        background-size: cover;
        margin-right: 8px;
      }
    }
  }
  // 保存修改
  .submit {
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
