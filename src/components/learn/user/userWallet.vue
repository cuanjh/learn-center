<template>
<section class='user-wallet-wrap'>
    <div class='userVip-top-wrap user-wallet-top'>
      <div class='userVip-top-tips'>
        <span>我的金币</span>
        <span><i class="coins-icon"></i>{{ userInfo ? userInfo.coins : '' }}</span>
      </div>
      <div class='userVip-top-btns'>
      </div>
    </div>
    <div class="user-wallet-bottom">
      <div class="userVip-bottom-nav">
        <a @click='swapVipTab2' :class="{ 'active': activeTab === false }">金币充值</a>
        <a @click='swapVipTab' :class="{ 'active': activeTab === true }">收支明细</a>
      </div>
      <!-- <ol v-show='activeTab'>
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
      </ol> -->
      <div class="payment-detail" v-show='activeTab'>
        <ul>
          <li v-for='(item, index) in RecordList' :key="index">
            <div class="detail-left">
              <p>{{ item.desc['title'] }}</p>
              <p>{{ item.desc['describle'] }}</p>
              <p>{{ item['trade_date'] }}</p>
            </div>
            <div class="detail-right" :class="{'spending': item.money <= 0}">
              <span>
                <em v-show="item.money > 0">+</em>{{ item.money }}
              </span>
            </div>
          </li>
        </ul>
        <div class="up-all">
          <div class="up-all-content" v-if="record.length>5">
            <a @click="loadMoreRecord()" v-text="isShowRecord?'全部展开':'收起'"></a>
            <i v-show="isShowRecord"></i>
            <i class="active" v-show="isShowRecord === false"></i>
          </div>
          <div v-else>
            <span>已经是全部内容了</span>
          </div>
        </div>
      </div>
      <div class="user-wallet-purchase-icon" v-show='!activeTab'>
        <div class='user-title-purchase-item-wrap'>
          <!-- <div class='user-title-purchase-item' v-for='(item, index) in coinsProduct' :key="index">
            <p>{{ item.product }}<span>金币</span></p>
            <p>赠送</p>
            <p>{{ item.gave_coins }} 金币</p>
            <p @click='purchaseIconPay(item.product_id)'>支付:<span>￥{{ item.total_money }}</span></p>
          </div> -->
          <div class='user-title-purchase-item' v-for='(item, index) in coinsProduct' :key="index">
            <div class="product">
              <div class="purchase">
                <p><span>¥</span>{{ item.total_money }}</p>
                <p>/ {{ item.product }}金币</p>
              </div>
              <div class="gave">
                <p>赠送</p>
                <p>{{ item.gave_coins }}</p>
              </div>
            </div>
            <a class="go-pay" @click='purchaseIconPay(item)'>立即购买</a>
          </div>
        </div>
      </div>
    </div>
    <div></div>
    <!-- <pay-alert ref="payAlert"></pay-alert> -->
  </section>
</template>

<script>
import LogCollect from '../../../tool/logCollect'
import { mapState, mapMutations, mapActions } from 'vuex'
import $ from 'jquery'
import cookie from '../../../tool/cookie'
import Bus from '../../../bus.js'
import PayAlert from './userPayAlert.vue'

export default {
  components: {
    PayAlert
  },
  data () {
    return {
      isShowRecord: true,
      activeTab: false,
      type: false
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
    },
    RecordList () {
      var obj = this.record
      if (Object.keys(obj).length > 0) {
        if (this.isShowRecord) {
          return this.record.slice(0, 5)
        } else {
          return this.record
        }
      }
      return []
    }
  },
  methods: {
    ...mapMutations({
      updatePurchaseIconPay: 'user/updatePurchaseIconPay'
    }),
    ...mapActions({
      getTradeRecord: 'user/getTradeRecord',
      createAliWebOrder: 'user/createAliWebOrder'
    }),
    close () {
    },
    // 立即购买
    purchaseIconPay (productItem) {
      let userId = cookie.getCookie('user_id')
      if (!userId) {
        Bus.$emit('showGoLoginBox')
        return false
      }
      console.log('购买的金币明细', productItem)
      Bus.$emit('showBuyMoneyBox', productItem, this.type)
      // this.createAliWebOrder(productId)
      // this.updatePurchaseIconPay(true)
      // this.$refs['payAlert'].$emit('isShowPayAlert', true)
    },
    // 收支明细样式
    swapVipTab () {
      this.activeTab = true
      setTimeout(() => {
        let height = $('.user-wallet-wrap').height()
        $('.user-wrap').css('min-height', height + 50 + 'px')
      }, 100)
    },
    // 金币充值样式
    swapVipTab2 () {
      this.activeTab = false
      setTimeout(() => {
        let height = $('.user-wallet-wrap').height()
        $('.user-wrap').css('height', height + 'px')
      }, 100)
    },
    // loadMore () {
    //   this.getTradeRecord()
    // },
    // 张开收支明细
    loadMoreRecord () {
      this.isShowRecord = !this.isShowRecord
    }
  }
}
</script>

<style lang="less" scoped>
.user-wallet-wrap {
  width: 100%;
  margin-top: 90px;
}
.user-wallet-top {
  width: 100%;
  // height: 100px;
  background: #fff;
  border-radius: 5px;
}

.user-wallet-wrap .userVip-top-tips {
  padding: 0px 55px 0px 25px;
  line-height: 100px;
  display: flex;
  justify-content: space-between;
  span {
    font-size:20px;
    font-family:PingFangSC-Semibold;
    font-weight:600;
    color:rgba(68,68,68,1);
  }
  span:last-child {
    font-size:40px;
    font-family:DINCondensed-Bold;
    font-weight:bold;
    color:rgba(51,51,51,1);
    i {
      display: inline-block;
      width: 38px;
      height: 44px;
      background: url('../../../../static/images/userInfo/purse.svg') no-repeat center;
      background-size: cover;
      margin-top: 17px;
      margin-right: 16px;
    }
  }
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
}
.userVip-bottom-nav a {
  display: inline-block;
  float: left;
  height: 60px;
  font-size:16px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:#3C5B6FFF;
  text-align: center;
  margin-right: 50px;
  // border-right: 1px solid #EEF2F3;
  line-height: 60px;
}
.userVip-bottom-nav a:last-child {
  border-right: 0;
}
.userVip-bottom-nav a:hover {
  color: #2A9FE4;
}
.userVip-bottom-nav a.active {
  color: #0581D1;
  border-bottom: 3px solid #2A9FE4FF;
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

.payment-detail {
  width: 100%;
  background: #fff;
  ul {
    padding: 25px 55px 46px;
    li {
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #E6EBEEFF;
      .detail-left {
        font-size:14px;
        font-family:PingFang-SC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        p:nth-child(1) {
          font-size:14px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(68,68,68,1);
        }
        p:nth-child(2) {
          padding: 1px 0 5px;
        }
      }
      .detail-right {
        font-size:18px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(60,91,111,1);
      }
      .spending {
        color:rgba(42,159,228,1);
      }
    }
    li:last-child {
      border-bottom: none;
    }
  }
  .up-all {
    width: 100%;
    background: rgba(221, 221, 221, .1);
    text-align: center;
    line-height: 42px;
    font-size:14px;
    font-family:PingFangSC-Semibold;
    font-weight:600;
    color:rgba(42,159,228,1);
    a {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    i {
      display: inline-block;
      width: 10px;
      height: 6px;
      background: url('../../../../static/images/upAll.svg') no-repeat center;
      background-size: cover;
      margin-left: 10px;
    }
    .active {
      display: inline-block;
      width: 10px;
      height: 6px;
      background: url('../../../../static/images/upAllActive.svg') no-repeat center;
      background-size: cover;
      margin-left: 10px;
    }
    .up-all-content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .course-related {
      width: 100%;
      min-height: 445px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      i {
        display: inline-block;
        width: 145px;
        height: 82px;
        background-image: url('../../../../static/images/discovery/language-related.svg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      span {
        padding-top: 18px;
        font-size:16px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(200,212,219,1);
        line-height:22px;
      }
    }
  }
}

.user-wallet-purchase-icon {
  width: 100%;
  // height: 312px;
  // border-radius: 4px;
  background-color: #ffffff;
  .user-title-purchase-item-wrap {
    width: 100%;
    padding: 54px 38px 70px;
    display: flex;
    justify-content: space-between;
    .user-title-purchase-item {
      position: relative;
      width: 190px;
      border-radius:5px;
      border:1px solid rgba(236,240,243,1);
      &:hover {
        box-shadow: 0 0 26px 0 rgba(187, 187, 187, 0.5);
        -webkit-transition: all 0.3s ease-in-out;
        -moz-transition: all 0.3s ease-in-out;
        -ms-transition: all 0.3s ease-in-out;
        -o-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
      }
      .product {
        padding: 36px 54px;
        text-align: center;
        p {
          font-size:14px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(126,146,159,1);
        }
        .purchase {
          p:nth-child(1) {
            font-size:36px;
            font-family:PTSans-CaptionBold;
            font-weight:normal;
            color:rgba(93,155,4,1);
            span {
              font-size:22px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(127,201,97,1);
            }
          }
        }
        .gave {
          padding-top: 60px;
          p:nth-child(2) {
            font-size: 22px;
          }
        }
      }
      .go-pay {
        display: inline-block;
        text-align: center;
        width: 100%;
        font-size:16px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(255,255,255,1);
        padding: 14px 0;
        background: #7FC961FF;
        border-radius: 0 0 5px 5px;
      }
    }
  }
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
// .user-title-purchase-item {
//   width: 133px;
//   height: 230px;
//   background-color: #ffffff;
//   border: solid 1px #7bc16b;
//   margin-right: 21px;
//   -webkit-transition: all 0.3s ease-in-out;
//   -moz-transition: all 0.3s ease-in-out;
//   -ms-transition: all 0.3s ease-in-out;
//   -o-transition: all 0.3s ease-in-out;
//   transition: all 0.3s ease-in-out;
// }
// .user-title-purchase-item:hover {
//   box-shadow: 0 0 26px 0 rgba(187, 187, 187, 0.5);
//   -webkit-transition: all 0.3s ease-in-out;
//   -moz-transition: all 0.3s ease-in-out;
//   -ms-transition: all 0.3s ease-in-out;
//   -o-transition: all 0.3s ease-in-out;
//   transition: all 0.3s ease-in-out;
// }
// .user-title-purchase-item:nth-last-of-type(1) {
//   margin-right: 0;
// }
// .user-title-purchase-item-wrap {
//   padding: 38px 26px;
//   display: flex;
// }
// .user-title-purchase-item p {
//   margin-top: 20px;
//   text-align: center;
// }
// .user-title-purchase-item p:nth-of-type(1) {
//   width: 100%;
//   height: 84px;
//   background-color: #7bc16b;
//   color: #fff;
//   font-size: 34px;
//   font-weight: bolder;
//   padding-top: 20px;
// }
// .user-title-purchase-item p:nth-of-type(1) span {
//   font-size: 16px;
//   position: relative;
//   top: 4px;
//   left: 2px;
// }
// .user-title-purchase-item p:nth-of-type(2) {
//   font-size: 12px;
//   color: #9b9b9b;
// }
// .user-title-purchase-item p:nth-of-type(3) {
//   font-size: 14px;
//   color: #fec62e;
//   margin-top: 0;
//   font-weight: bold;
// }
// .user-title-purchase-item p:nth-of-type(4) {
//   width: 110px;
//   height: 30px;
//   margin: 0 auto;
//   line-height: 30px;
//   border-radius: 24.5px;
//   background-color: #7bc16b;
//   text-align: center;
//   color: #fff;
//   font-size: 14px;
//   margin-top: 20px;
//   cursor: pointer;
// }
// .user-title-purchase-item p:nth-of-type(4):hover {
//   background-color: #6ab359;
// }
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
