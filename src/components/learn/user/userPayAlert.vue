<template>
  <div>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-payAlert-view user-payAlert-goali' v-show='purchaseIconPay'>
      <div class='vip-update-success-logo animated tada' v-show='chooseLogo'></div>
      <div class='vip-update-success-logo vip-icon-logo animated tada' v-show='!chooseLogo'></div>
      <p>请去支付宝进行支付购买！</p>
      <p></p>
      <p></p>
      <span >
        <a @click="goAli()" v-show="payShow" :href="aliPayUrl" target="_blank">去支付宝</a>
        <a  v-show='!payShow' class='pay-alert-order-creating'>订单创建中...</a></span>
      <em @click='close'></em>
    </section>
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-payAlert-view' v-show='goAliAlert'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>请在支付页面进行购买！</p>
      <p class='adjust-alert-tips'>未完成充值前请不要关闭此窗口！</p>
      <p>支付成功后请刷新页面。</p>
      <span @click="close">支付完成</span>
      <em @click='close'></em>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import LogCollect from '../../../tool/logCollect'
export default {
  data () {
    return {
      goAliAlert: false,
      chooseLogo: true
    }
  },
  mounted () {
    // 判断导航栏
    var str = window.location.pathname.search('vip')
    if (str !== -1) {
      this.chooseLogo = true
    } else {
      this.chooseLogo = false
    }
  },
  created () {
    this.$on('goAliAlert', (e) => {
      this.goAliAlert = e
    })
  },
  computed: {
    ...mapState({
      pay: state => state.user.pay,
      payShow: state => state.user.payShow,
      userInfo: state => state.userInfo,
      purchaseIconPay: state => state.user.purchaseIconPay
    }),
    aliPayUrl () {
      return this.pay.aliWebPayUrl
    }
  },
  methods: {
    ...mapMutations({
      updateCoverState: 'course/updateCoverState',
      updatePurchaseIconPay: 'user/updatePurchaseIconPay'
    }),
    close (e) {
      this.updateCoverState(false)
      this.$emit('goAliAlert', false)
      this.updatePurchaseIconPay(false)
    },
    goAli () {
      let ui = this.userInfo
      var _memberType = ui.member_info.member_type
      var _productId = this.pay.productId
      var _orderNo = this.pay.tradeNo
      var _payType = 'aliweb' // web端目前只有一种支付渠道,先写死,后续处理
      var _coinNum = ui.coins
      if (_productId.indexOf('member') !== -1) {
        LogCollect.payMemberPay(_memberType, _orderNo, _payType, _productId)
      } else if (_productId.indexOf('coin') !== -1) {
        LogCollect.payCoinBuy(
          _memberType,
          _coinNum,
          _orderNo,
          _payType,
          _productId
        )
      } else if (_productId.indexOf('course') !== -1) {
      }
      this.$emit('goAliAlert', true)
      this.updatePurchaseIconPay(false)
    }
  }
}
</script>

<style scoped>
.user-payAlert-view em {
  width: 17px;
  height: 17px;
  background: url(../../../../static/images/learn/learn-user-chahao.svg) no-repeat;
  background-size: contain;
  position: absolute;
  top: 17px;
  right: 17px;
  cursor: pointer;
}
.user-payAlert-view p:nth-of-type(1) {
  padding-bottom: 10px;
}

.user-payAlert-view p:nth-of-type(2),
.user-payAlert-view p:nth-of-type(3) {
  font-size: 14px;
  color: #ff5c3b;
}
.user-payAlert-view p:nth-of-type(2) {
  padding-bottom: 0px !important;
}
.user-payAlert-view span {
  margin: 42px 25px;
}
.user-payAlert-view span a {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.user-payAlert-view .vip-update-success-logo {
  background-image: url(../../../../static/images/learn/learn-user-jinbi3.svg);
}
.user-payAlert-goali .vip-update-success-logo {
  background-image: url(../../../../static/images/learn/learn-vip-success.png);
}
.user-payAlert-goali .vip-icon-logo {
  background-image: url(../../../../static/images/learn/learn-user-jinbi3.svg);
}
.user-payAlert-goali .vip-update-success p:nth-of-type(1) {
  padding-top: 74px;
}
.adjust-alert-tips {
  position: relative;
  top: 3px;
}
.user-payAlert-view span a.pay-alert-order-creating {
  background-color: #fff;
  color: #ff785a;
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

.vip-update-success-logo {
  width: 110px;
  height: 110px;
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

.vip-update-confirm p:first-of-type {
  margin-top: 25px;
  padding-top: 70px;
  font-size: 20px;
}

.vip-update-success p {
  color: #4a4a4a;
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
  margin: 42px 25px;
}
</style>
