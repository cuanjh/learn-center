<template>
  <div class="user-coins" v-show="showUserCoinsBox">
    <!-- <div class='user-coins-content'>
      <div class='update-success'></div>
      <p>哦!你的金币余额不足啦 !</p>
      <p>获取此课程需要{{radioMoney}}金币</p>
      <p>金币余额: {{userCoins}}</p>
      <p>
        <span class='go-buy' @click="gotoWallet">去充值</span>
      </p>
    </div> -->
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns goldShortage'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>哦!你的金币余额不足啦 !</p>
      <p>获取此课程需要{{radioMoney}}金币</p>
      <p>金币余额: {{ userCoins }}</p>
      <p>
        <span class='learn-begin-study-warn-cancel' @click="close()">取消</span>
        <span class='learn-begin-study-warn-cancel' @click="gotoWallet()">去充值</span>
      </p>
    </section>
  </div>
</template>
<script>
import Bus from '../../bus'
export default {
  data () {
    return {
      showUserCoinsBox: false,
      radioMoney: '',
      userCoins: ''
    }
  },
  created () {
    Bus.$on('showUserCoins', (coins, money) => {
      this.userCoins = coins
      this.radioMoney = money
      console.log('userCoins', this.userCoins)
      this.showUserCoinsBox = true
    })
  },
  methods: {
    gotoWallet () {
      this.$router.push({ path: '/app/user/wallet' })
      this.showUserCoinsBox = false
    },
    gotoVip () {
      this.$router.push({ path: '/app/user/vip' })
      this.showUserCoinsBox = false
    },
    close () {
      this.showUserCoinsBox = false
    }
  }
}
</script>
<style lang="less" scoped>
.user-coins {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
}
.user-coins-content{
  width: 424px;
  height: 284px;
  border-radius: 4px;
  background-color: #ffffff;
  position: fixed;
  z-index: 999;
  top:50%;
  left: 50%;
  margin-left: -212px;
  margin-top: -142px;
  text-align: center;
  box-shadow: 0 3px 5px 0 rgba(000, 000, 000, 0.3);
}
.vip-update-success{
  width: 424px;
  height: 284px;
  border-radius: 4px;
  background-color: #ffffff;
  position: fixed;
  z-index: 999;
  top:50%;
  left: 50%;
  margin-left: -212px;
  margin-top: -142px;
  text-align: center;
  box-shadow: 0 3px 5px 0 rgba(000, 000, 000, 0.3);
}
.vip-update-success-logo{
  width:110px;
  height: 110px;
  background-image: url(../../../static/images/learn/learn-vip-success.png);
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
  font-size: 16px;
  color: #4a4a4a;
}
.vip-update-success p:nth-of-type(1){
  padding-top: 74px;
}
.vip-update-success p:nth-of-type(2){
  padding-bottom: 40px;
}
.vip-update-success .vip-back-tolearn{
  width: 168px;
  height: 40px;
  border-radius: 100px;
  background-color: #fd8469;
  text-align: center;
  line-height: 40px;
  color:#fff;
  display:inline-block;
  cursor: pointer;
}
.vip-update-success .vip-back-tolearn:hover{
  background-color: #FA6F50;
}

.learn-begin-study-warn {
  width: 354px;
  height: 250px;
  box-shadow: 0 3px 5px 0 rgba(000, 000, 000, 0.3);
  margin-top: -125px;
  margin-left: -177px;
}

.learn-begin-study-warn-logo {
  background-image: url(../../../static/images/learn/learn-vip-warn.png);
  padding: 40px;
  margin-left: -56px;
  top: -50px;
  background-size: 86%;
}

.learn-begin-study-warn p:nth-of-type(1) {
  font-size: 16px;
  color: #4a4a4a;
  padding-top: 62px;
}

.learn-begin-study-warn p:nth-of-type(2) {
  color: #9b9b9b;
  padding-bottom: 43px;
  padding-top: 11px;
}

.learn-begin-study-warn p:nth-of-type(3) {
  height: 28px;
  width: 70%;
  margin: 0 auto;
}

.learn-begin-study-warn p:nth-of-type(3) span {
  width: 102px;
  height: 28px;
  border-radius: 100px;
  border: solid 1px #3c9bbe;
  line-height: 28px;
  font-size: 16px;
  font-weight: 300;
  color: #0e8abe;
  cursor: pointer;
}

.learn-begin-study-warn p:nth-of-type(3) span:hover {
  background-color: #3c9bbe;
  color: #fff;
}

.learn-begin-study-warn-cancel {
  float: left;
}

.learn-begin-study-warn-confirm {
  float: right;
}

.vip-bottom {
  width: 100%;
  height: 34px;
  border-radius: 0 0 4px 4px;
  background-color: #fd8469;
  line-height: 34px;
  color: #fde257;
  background-image: url('../../../static/images/learn/learn-huangguan-vip.png');
  background-repeat: no-repeat;
  background-position: 75px center;
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: pointer;
  font-size: 14px;
  background-size: 6%;
  background-position: 75px 8px;
}

.vip-bottom:hover {
  background-color: #fa6f50;
}

.vip-update-confirm p:nth-of-type(4) {
  height: 28px;
  // width: 100px;
  margin: 0 auto;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.vip-update-confirm p:nth-of-type(4) span {
  // width: 100%;
  height: 28px;
  border-radius: 100px;
  padding: 0 10px;
  border: solid 1px #3c9bbe;
  line-height: 28px;
  font-size: 16px;
  font-weight: 300;
  color: #0e8abe;
  cursor: pointer;
  margin-right: 20px;
}

.vip-update-confirm p:nth-of-type(4) span:hover {
  background-color: #3c9bbe;
  color: #fff;
}
</style>
