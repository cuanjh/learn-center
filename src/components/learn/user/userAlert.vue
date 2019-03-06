<template>
  <div class="user-alert-container" v-show="isShow">
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns' v-show='confirmAlert'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>您确定使用激活码激活会员？</p>
      <span @click="activateCode">确定激活</span>
      <em @click='close'></em>
    </section>
    <section class='vip-update-success animated flipInX slow' v-show='successAlert'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>{{ $t("vip.alert.p1") }}</p>
      <p>{{ $t("vip.alert.p2") }}</p>
      <router-link tag="span" class='vip-back-tolearn' @click="close" v-show='!judgeBackLearn' :to="{path: '/app/find'}">{{ $t("vip.alert.back") }}</router-link>
      <router-link tag="span" class='vip-back-tolearn' @click="close" v-show='judgeBackLearn' :to="{path: ''}">{{ $t("vip.alert.back") }}</router-link>
    </section>
    <section class='vip-update-success animated flipInX slow vip-error-notice' v-show='errorTip'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>{{ errorMessage }}</p>
      <p></p>
      <span class='vip-back-tolearn' @click="close">返回</span>
    </section>
    <section class='vip-update-success animated flipInX slow charge-success-alert' v-show='purchaseSuccess'>
      <div class='vip-update-success-logo animated tada'></div>
      <p class='charge-success'>您的充值操作已完成请点击刷新后查看！</p>
      <span class='vip-back-tolearn' @click="close">确定</span>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LogCollect from '../../../tool/logCollect'

export default {
  data () {
    return {
      isShow: false,
      codeNum: '',
      purchaseAlert: false,
      judgeBackLearn: false,
      errorMessage: ''
    }
  },
  created () {
    this.$on('isShowAlert', (flag) => {
      this.isShow = flag
    })

    this.$on('ifConfirmShow', (e) => {
      this.updateConfirmAlert(e)
    })

    this.$on('UserVipCode', (e) => {
      this.codeNum = e
    })

    this.$on('purchaseAlert', (e) => {
      this.purchaseAlert = e
    })

    this.$on('errorTip', (e) => {
      this.updateErrorTip(e)
    })

    this.$on('successAlert', (e) => {
      this.updateSuccessAlert(e)
    })
  },
  computed: {
    ...mapState({
      confirmAlert: state => state.user.confirmAlert,
      successAlert: state => state.user.updateSuccessAlert,
      errorTip: state => state.user.errorTip,
      purchaseSuccess: state => state.user.purchaseSuccess,
      userInfo: state => state.userInfo
    }),
    ui () {
      let ui = this.userInfo
      if (Object.keys(ui).length === 0) {
        ui = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      return ui
    }
    // backLearn () {
    //   var learnCourses = this.$store.state.course.learnCourses
    //   if (learnCourses.length <= 0) {
    //     this.judgeBackLearn = false
    //   } else {
    //     this.judgeBackLearn = true
    //     return learnCourses[0]
    //   }
    // }
  },
  methods: {
    ...mapMutations({
      updateConfirmAlert: 'user/updateConfirmAlert',
      updateErrorTip: 'user/updateErrorTip',
      updateSuccessAlert: 'user/updateSuccessAlert',
      updatePurchaseSuccess: 'user/updatePurchaseSuccess'
    }),
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
      getMemberCard: 'user/getMemberCard'
    }),
    activateCode () {
      var _memberType = this.ui.member_info.member_type
      var _this = this
      _this.getMemberCard(_this.codeNum).then((res) => {
        if (res.success) {
          this.updateSuccessAlert(true)
          _this.updateConfirmAlert(false)
          LogCollect.payMemberCard(
            _memberType,
            _this.codeNum,
            1,
            res.member_info.money
          )
        } else {
          _this.errorMessage = res.errorMsg
          _this.updateErrorTip(true)
          _this.updateConfirmAlert(false)
          LogCollect.payMemberCard(_memberType, _this.codeNum, 0, 0)
        }
      })
    },
    close () {
      this.updateErrorTip(false)
      this.updateSuccessAlert(false)
      this.updatePurchaseSuccess(false)
      this.updateConfirmAlert(false)
      this.isShow = false
      this.getUserInfo()
    }
    // ,
    // backLearn () {
    //   this.successAlert = false
    //   this.$dispatch('coverState', this.successAlert)
    // }
  }
}
</script>

<style scoped>
.user-alert-container {
  position:fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index:99999999;
  overflow: hidden;
}
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

.vip-update-success-logo{
  width:110px;
  height: 110px;
  background-image: url(../../../../static/images/learn/learn-vip-success.png);
  background-repeat: no-repeat;
  background-color: #fff;
  background-position: center center;
  border-radius: 50%;
  padding: 70px;
  position:absolute;
  top:-65px;
  left: 50%;
  margin-left: -75px;
}
.vip-update-success p{
  margin-top: 65px;
  font-size: 20px;
  color: #4a4a4a;
}
.vip-update-success p:nth-of-type(1){
  padding-top: 54px;
}
.vip-update-success p:nth-of-type(2){

}
.vip-update-success .vip-back-tolearn{
  width: 168px;
  height: 40px;
  border-radius: 100px;
  background-color: #2A9FE4;
  text-align: center;
  line-height: 40px;
  color:#fff;
  display:inline-block;
  cursor: pointer;
}
.vip-update-success .vip-back-tolearn:hover{
  background-color: #2A9FE4;
}

.vip-update-confirm span {
  width: 174px;
  height: 40px;
  border-radius: 100px;
  display: inline-block;
  line-height: 40px;
  background-color: #2A9FE4;
  cursor: pointer;
  color: #fff;
  margin: 54px 25px;
}

.user-alert-two-btns span {
  margin-top: 72px;
}

.user-alert-two-btns em {
  width: 17px;
  height: 17px;
  background: url(../../../../static/images/learn/learn-user-chahao.svg) no-repeat;
  background-size: contain;
  position: absolute;
  top: 17px;
  right: 17px;
  cursor: pointer;
}
.user-alert-two-btns p:nth-of-type(1) {
  margin-top: 65px;
}
.user-alert-two-btns span {
  margin-top: 72px;
}
.charge-success-alert .charge-success {
  padding-top: 77px !important;
  margin-bottom: 70px;
}
.vip-error-notice p:nth-of-type(1) {
  padding-top: 70px !important;
  font-size: 20px;
}
</style>
