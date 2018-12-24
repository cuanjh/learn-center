<template>
<section class='user-wallet-wrap'>
    <div class='userVip-top-wrap user-wallet-top'>
      <div class='userVip-top-logo'></div>
      <div class='userVip-top-tips'>
        <p>现有金币:</p>
        <p>{{ userInfo.coins }}</p>
      </div>
      <div class='userVip-top-btns'>
      </div>
    </div>
    <div class="user-wallet-bottom">
      <div class="userVip-bottom-nav">
        <p @click='swapVipTab2' :class="{ 'active': activeTab === false }">金币充值</p>
        <p @click='swapVipTab' :class="{ 'active': activeTab === true }">收支明细</p>
      </div>
      <ol v-show='activeTab'>
        <li v-for='(item, index) in record' :key="index" :class="item['trade_type']">
          <i></i>
          <span></span>
          <ul>
            <li>{{ item.desc['title'] }}</li>
            <li>{{ item.desc['describle'] }}</li>
            <li>{{ item['trade_date'] }}</li>
          </ul>
          <span :class="{'fu': item.money <= 0}">
            <em v-show="item.money > 0">+</em>{{ item.money }}
          </span>
        </li>
        <p class='learn-user-wallet-load-more' @click='loadMore' v-show='!loadingMore' v-if="!findGuide">
          <i class='rotateMore' :class="{ 'rotateMore-loading' : showLoading}"></i>加载更多
        </p>
        <p class='learn-user-wallet-load-no-more' v-show='loadingMore' v-if="!findGuide"><i></i>没有更多了</p>
        <div class='user-course-nocourse' v-show='findGuide'>
          <dl>
            <dt></dt>
            <dd>
              <p>放心！你的金币很安全</p>
              <p>快到<router-link tag="span" :to="{path: '/app/find'}">“发现”</router-link>里订阅喜欢的课程收入第一笔奖金吧</p>
            </dd>
          </dl>
        </div>
      </ol>
      <div class="user-wallet-purchase-icon" v-show='!activeTab'>
        <div class='user-title-purchase-item-wrap'>
          <div class='user-title-purchase-item' v-for='(item, index) in coinsProduct' :key="index">
            <p>{{ item.product }}<span>金币</span></p>
            <p>赠送</p>
            <p>{{ item.gave_coins }} 金币</p>
            <p @click='purchaseIconPay(item.product_id)'>支付:<span>￥{{ item.total_money }}</span></p>
          </div>
        </div>
      </div>
    </div>
    <div></div>
    <pay-alert ref="pay"></pay-alert>
  </section>
</template>

<script>
import LogCollect from '../../../tool/logCollect'
import { mapState, mapMutations, mapActions } from 'vuex'
import $ from 'jquery'

import PayAlert from './userPayAlert.vue'

export default {
  components: {
    PayAlert
  },
  data () {
    return {
      activeTab: false
    }
  },
  mounted () {
    this.$parent.$emit('activeNavUserItem', 'wallet')
    this.$parent.$emit('navItem', 'user')
    let ui = JSON.parse(sessionStorage.getItem('userInfo'))

    var _memberType = ui.member_info.member_type
    var _entryPage = this.$router.currentRoute.fullPath
    LogCollect.payCoinEnter(_memberType, _entryPage)
  },
  methods: {
    ...mapMutations({
      updateCoverState: 'course/updateCoverState',
      updatePurchaseIconPay: 'user/updatePurchaseIconPay'
    }),
    ...mapActions({
      getTradeRecord: 'user/getTradeRecord',
      createAliWebOrder: 'user/createAliWebOrder'
    }),
    close () {
      this.updateCoverState(false)
    },
    purchaseIconPay (productId) {
      this.createAliWebOrder(productId)
      this.updatePurchaseIconPay(true)
      this.updateCoverState(true)
    },
    swapVipTab () {
      this.activeTab = true
      setTimeout(() => {
        let height = $('.user-wallet-wrap').height()
        $('.user-wrap').css('height', height + 30 + 'px')
      }, 100)
    },
    swapVipTab2 () {
      this.activeTab = false
      setTimeout(() => {
        let height = $('.user-wallet-wrap').height()
        $('.user-wrap').css('height', height + 'px')
      }, 100)
    },
    loadMore () {
      this.getTradeRecord()
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      record: state => state.user.record,
      coinsProduct: state => state.user.coinsProduct,
      showLoading: state => state.user.showLoading,
      loadingMore: state => state.user.loadingMore
    }),
    findGuide () {
      if (this.record.length > 0) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>
.user-wallet-wrap {
  width: 100%;
}
.user-wallet-top {
  width: 100%;
  height: 147px;
  background: #fff;
  border-radius: 5px;
}

.user-wallet-wrap .userVip-top-logo {
  background-image: url(../../../../static/images/learn/learn-user-jinbi32.svg);
  background-size: contain;
  width: 128px;
  margin: 0 35px 0 34px;
  float: left;
  height: 100%;
  background-position: 50%;
  background-repeat: no-repeat;
}

.user-wallet-wrap .userVip-top-tips {
  width: 214px;
  padding: 45px 18px;
  padding-left: 0;
  float: left;
  height: 100%;
}

.user-wallet-wrap .userVip-top-tips p {
  text-align: left;
  color: #4a4a4a;
}
.user-wallet-wrap .userVip-top-tips p:nth-of-type(1) {
  font-size: 20px;
}
.user-wallet-wrap .userVip-top-tips p:nth-of-type(2) {
  color: #f49a3a;
  font-size: 25px;
}
.user-wallet-wrap .userVip-top-btns p {
  margin-top: 24px;
  width: 230px;
}

.user-wallet-bottom {
  width: 100%;
  border-radius: 5px;
  background: #fff;
  margin-top: 20px;
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
}

.user-wallet-bottom-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  background-color: #66b8e0;
  border-radius: 5px 5px 0 0;
}
.user-wallet-bottom ol {
  padding: 0 27px;
}
.user-wallet-bottom ol li {
  border-bottom: 1px solid #ededed;
  height: 96px;
  /*line-height: 96px;*/
  font-size: 18px;
  color: #4a4a4a;
  /*background-image: url(../../../../static/images/learn/learn-user-shouji.png);
        background-repeat: no-repeat;
        background-position: left center;
        background-size: 28px 28px;*/
  padding-left: 48px;
  position: relative;
}
.user-wallet-bottom ol > li:nth-last-of-type(1) {
  border-bottom: none;
}
.user-wallet-bottom ol > li i {
  position: absolute;
  width: 28px;
  height: 28px;
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
  left: 0;
  top: 50%;
  margin-top: -32px;
}
.user-wallet-bottom ol > li.account_init i {
  background-image: url(../../../../static/images/learn/learn-user-zhuce.svg);
}
.user-wallet-bottom ol > li.perfect_user_info i {
  background-image: url(../../../../static/images/learn/learn-user-wanshan.svg);
}
.user-wallet-bottom ol > li.purchase_course i {
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
}
.user-wallet-bottom ol > li.sell_course i {
  background-image: url(../../../../static/images/learn/learn-user-chushoukecheng.svg);
}
.user-wallet-bottom ol > li.thank_homework i {
  background-image: url(../../../../static/images/learn/learn-user-shang.svg);
}
.user-wallet-bottom ol > li.thanked_homework i {
  background-image: url(../../../../static/images/learn/learn-user-beidaxie.svg);
}
.user-wallet-bottom ol > li.purchase_homeworks i {
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
}
.user-wallet-bottom ol > li.purchase_course_chapter i {
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
}
.user-wallet-bottom ol > li.purchase_coins i {
  background-image: url(../../../../static/images/learn/learn-user-jinbi.svg);
}
.user-wallet-bottom ol > li.study_add i {
  background-image: url(../../../../static/images/learn/learn-user-xuexi.svg);
}
.user-wallet-bottom ol > li.study_minus i {
  background-image: url(../../../../static/images/learn/learn-user-xuexi.svg);
}
.user-wallet-bottom ol > li.fired_game_add i {
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
}
.user-wallet-bottom ol > li.fired_game_minus i {
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
}
.user-wallet-bottom ol > li.fired_game i {
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
}
.user-wallet-bottom ol > li.fired_game_activity i {
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
}
.user-wallet-bottom ol > li.boss_challenged i {
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
}
.user-wallet-bottom ol > li.bind_phonenumber i {
  background-image: url(../../../../static/images/learn/learn-user-shouji.svg);
}
.user-wallet-bottom ol > li.bind_email i {
  background-image: url(../../../../static/images/learn/learn-user-bangding.svg);
}
.user-wallet-bottom ol > li.email_confirmed i {
  background-image: url(../../../../static/images/learn/learn-user-yanzhengyouxiang.svg);
}
.user-wallet-bottom ol > li.daily_sign_in i {
  background-image: url(../../../../static/images/learn/learn-user-meiridenglu.svg);
}
.user-wallet-bottom ol > li.mark_homeworks i {
  background-image: url(../../../../static/images/learn/learn-user-zuoye.svg);
}
.user-wallet-bottom ol > li.write_homeworks i {
  background-image: url(../../../../static/images/learn/learn-user-tijiao.svg);
}
.user-wallet-bottom ol > li.share_get i {
  background-image: url(../../../../static/images/learn/learn-user-fenxiang.svg);
}
.user-wallet-bottom ol > li.open_official_course i {
  background-image: url(../../../../static/images/learn/learn-user-kecheng.svg);
}
.user-wallet-bottom ol > li.v39_update_gave i {
  background-image: url(../../../../static/images/learn/learn-user-shengji.svg);
}
.user-wallet-bottom ol > li.member_gave_coins i {
  background-image: url(../../../../static/images/learn/learn-user-check.svg);
}

/*自定义的 汉语拼音class 后续更改*/
.user-wallet-bottom ol > li.meiridenglu i {
  background-image: url(../../../../static/images/learn/learn-user-meiti.svg);
}

.user-wallet-bottom ol > li span {
  width: 50%;
  text-align: right;
  float: right;
  height: 100%;
  line-height: 96px;
  display: none;
}
.user-wallet-bottom ol > li span:nth-of-type(2) {
  text-align: right;
  color: #f3993a;
  font-size: 20px;
  display: inline-block;
  width: 20%;
}
.user-wallet-bottom ol > li span.fu {
  color: #7ed321;
}
.user-wallet-purchase-icon {
  width: 100%;
  height: 312px;
  border-radius: 4px;
  background-color: #ffffff;
}
.user-wallet-purchase-icon .user-close {
  width: 19.2px;
  height: 19.2px;
  background: url(../../../../static/images/learn/learn-user-chahao.svg) no-repeat;
  background-position: center center;
  background-size: contain;
  position: absolute;
  top: 20.8px;
  right: 20.8px;
  cursor: pointer;
}
.user-wallet-purchase-icon .user-title {
  width: 100%;
  height: 1px;
  background: #d8d8d8;
  margin-top: 51px;
  position: relative;
}
.user-wallet-purchase-icon .user-title span {
  font-size: 22px;
  color: #003d5a;
  position: absolute;
  left: 50%;
  margin-left: -68px;
  margin-top: -38px;
  background: #fff;
  padding: 26px;
}
.user-title-purchase-item {
  width: 133px;
  height: 230px;
  background-color: #ffffff;
  border: solid 1px #7bc16b;
  float: left;
  margin-right: 21px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.user-title-purchase-item:hover {
  box-shadow: 0 0 26px 0 rgba(187, 187, 187, 0.5);
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.user-title-purchase-item:nth-last-of-type(1) {
  margin-right: 0;
}
.user-title-purchase-item-wrap {
  padding: 38px 26px;
}
.user-title-purchase-item p {
  margin-top: 20px;
  text-align: center;
}
.user-title-purchase-item p:nth-of-type(1) {
  width: 100%;
  height: 84px;
  background-color: #7bc16b;
  color: #fff;
  font-size: 34px;
  font-weight: bolder;
  padding-top: 20px;
}
.user-title-purchase-item p:nth-of-type(1) span {
  font-size: 16px;
  position: relative;
  top: 4px;
  left: 2px;
}
.user-title-purchase-item p:nth-of-type(2) {
  font-size: 12px;
  color: #9b9b9b;
}
.user-title-purchase-item p:nth-of-type(3) {
  font-size: 14px;
  color: #fec62e;
  margin-top: 0;
  font-weight: bold;
}
.user-title-purchase-item p:nth-of-type(4) {
  width: 110px;
  height: 30px;
  margin: 0 auto;
  line-height: 30px;
  border-radius: 24.5px;
  background-color: #7bc16b;
  text-align: center;
  color: #fff;
  font-size: 14px;
  margin-top: 20px;
  cursor: pointer;
}
.user-title-purchase-item p:nth-of-type(4):hover {
  background-color: #6ab359;
}
.user-wallet-bottom .userVip-bottom-nav p.active {
  color: #0e8abe;
  border-bottom: 4px solid #0e8abe;
  height: 39px;
}
.userVip-bottom-nav p:hover {
  color: #0e8abe;
}
.user-wallet-bottom ol > li ul li {
  height: auto;
  border: none;
  padding-left: 0;
}
.user-wallet-bottom ol > li ul {
  float: left;
  padding: 18px 0 0 0;
}
.user-wallet-bottom ol > li ul li {
  font-size: 14px;
  color: #9b9b9b;
  line-height: 22px;
}
.user-wallet-bottom ol > li ul li:nth-of-type(1) {
  font-size: 18px;
  color: #4a4a4a;
}
.learn-user-wallet-load-more {
  margin-top: 0;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #0e8abe;
  border-top: 1px solid #ededed;
  cursor: pointer;
}
.learn-user-wallet-load-no-more {
  margin-top: 0;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: gray;
  border-top: 1px solid #ededed;
}
@keyframes loadRotate {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotateMore {
  display: inline-block;
  background-image: url(../../../../static/images/learn/learn-user-roate-load.svg);
  background-repeat: no-repeat;
  background-position: center center;
  width: 20px;
  height: 20px;
  margin: 15px 10px 0 0;
}
.rotateMore-loading {
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  -webkit-animation: loadRotate 1s linear infinite;
}
</style>
