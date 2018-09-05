<template>
  <!-- 是会员添加is-Vip  会员过期添加out-date-Vip-->
  <section v-bind:class='vipJudge'>
    <div class='userVip-top-wrap '>
      <div class='userVip-top-logo'></div>
      <div class='userVip-top-tips not-vip-tips'>
        <p>订阅全球说会员服务</p>
        <p>有效提升学习效率</p>
      </div>
      <div class='userVip-top-tips is-vip-tips'>
        <p>您的会员服务<span>{{ cardKind }}</span>有效期为：</p>
        <p><span v-text='startTime'></span> 至 <span v-text='endTime'></span></p>
      </div>
      <div class='userVip-top-tips outdate-vip-tips'>
        <p>您的会员服务<span>{{ cardKind }}</span>已到期</p>
        <p>续费会员继续享受所有功能</p>
      </div>
      <div class='userVip-top-btns'>
      </div>
    </div>
    <div class="userVip-bottom-wrap">
      <div class="userVip-bottom-nav userVip-member-bottom-nav">
        <p @click='swapVipTab' :class="{ 'active': activeTab === true }">会员升级</p>
        <p @click='swapVipTab2' :class="{ 'active': activeTab === false }">会员功能</p>
      </div>
      <div class="userVip-bottom-tab">
        <div class="userVip-bottom-tabItem" v-show="activeTab">
          <p>方式一:通过激活码升级</p>
          <div class='userVip-tabItem-active'>
            <p>会员卡激活：</p>
            <p><input type="text" placeholder='输入激活码' id='vip-codeNum-user'>
              <span @click='showConfirm' >激活</span>
            </p>
          </div>
          <div class='userVip-tabItem-purchase'>
            <p class='user-pay-update'>方式二:通过支付升级</p>
            <div v-for='(item, index) in productList' :key="index">
              <ol>
                <li>{{ item.product }}个月有效期
                  <span class='tips-small-tag' v-show="recommand === index">推荐</span>
                  <span class='tips-small-tag' v-show="value === index">超值</span></li>
                <li><span>{{ item.money }}</span><em>￥/月</em></li>
                <li><!-- <span>赠送</span>{{ item.gave_coins }}<span>金币</span> --></li>
                <li><span>合计：</span>{{ item.total_money }}<span>元</span></li>
                <li @click='purchase( item.product_id )'>点击购买</li>
              </ol>
            </div>
            <i class='user-vip-clearboth'></i>
          </div>
        </div>
        <div class="userVip-bottom-tabItem vip-introduction" v-show="!activeTab">
          <div class='vip-wrap-left'>
            <div class='vip-wrap-tips user-vip-tips-wrap'>
              <ul>
                <li v-for='(item, index) in items' :key="index">
                  <dl>
                    <dt></dt>
                    <dd>
                      <ol>
                        <li>{{ item.red }}</li>
                        <li>{{ item.gray }}</li>
                      </ol>
                    </dd>
                  </dl>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <user-alert ref="alert"></user-alert>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import I18nLocales from '../../../vueI18/locale'
import LogCollect from '../../../tool/logCollect'
import UserAlert from './userAlert.vue'

export default {
  components: {
    UserAlert
  },
  data () {
    return {
      activeTab: true,
      items: I18nLocales[Vue.config.lang].vip.left.tips,
      errorTip: false,
      codeNum: '',
      recommand: 2,
      value: 3
    }
  },
  mounted () {
    this.$parent.$emit('activeNavUserItem', 'vip')
    this.$parent.$emit('navItem', 'user')

    var _memberType = this.ui.member_info.member_type
    var _entryPage = this.$router.currentRoute.fullPath
    LogCollect.payMemberEnter(_memberType, _entryPage)
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      productList: state => state.user.productList
    }),
    ui () {
      let ui = this.userInfo
      if (Object.keys(ui).length === 0) {
        ui = JSON.parse(localStorage.getItem('userInfo'))
      }
      return ui
    },
    vipJudge () {
      var tempJunge = 0
      if (this.ui.member_info !== undefined) {
        tempJunge = this.ui.member_info.member_type || 0
      }
      if (tempJunge === 0) {
        return 'no-Vip'
      } else if (tempJunge === 1) {
        return 'is-Vip'
      } else if (tempJunge === 2) {
        return 'out-date-Vip'
      }
    },
    startTime () {
      var startTime = 0
      if (this.ui.member_info !== undefined) {
        startTime = this.ui.member_info.start_time * 1000 || 0
      }
      var date = new Date(startTime)
      var Y = date.getFullYear() + '-'
      var M = date.getMonth() + 1 + '-'
      var D = date.getDate()
      return Y + M + D
    },
    endTime () {
      var endTime = 0
      if (this.ui.member_info !== undefined) {
        endTime = this.ui.member_info.end_time * 1000 || 0
      }
      var date = new Date(endTime)
      var Y = date.getFullYear() + '-'
      var M = date.getMonth() + 1 + '-'
      var D = date.getDate()
      return Y + M + D
    },
    cardKind () {
      if (this.ui.member_info) {
        var month = this.ui.member_info['month_num']
        if (month === 1) {
          return '(月卡)'
        } else if (month === 3) {
          return '(季卡)'
        } else if (month === 6) {
          return '(半年卡)'
        } else if (month === 12) {
          return '(年卡)'
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      updateCoverState: 'course/updateCoverState',
      updatePurchaseIconPay: 'user/updatePurchaseIconPay'
    }),
    ...mapActions({
      createAliWebOrder: 'user/createAliWebOrder'
    }),
    swapVipTab (e) {
      this.activeTab = true
    },
    swapVipTab2 () {
      this.activeTab = false
    },
    showConfirm () {
      this.codeNum = document.getElementById('vip-codeNum-user').value
      this.$refs.alert.$emit('UserVipCode', this.codeNum)
      if (!this.codeNum) {
        return
      }
      this.$refs.alert.$emit('ifConfirmShow', true)
      this.updateCoverState(true)
    },
    purchase (productId) {
      this.createAliWebOrder(productId)
      this.updatePurchaseIconPay(true)
      this.updateCoverState(true)
    }
  }
}
</script>

<style scoped>
.userVip-top-wrap {
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  height: 147px;
}
.userVip-top-wrap > div {
  float: left;
  height: 100%;
}
.userVip-top-logo {
  width: 184px;
  height: 100%;
  background: url(../../../../static/images/learn/learn-user-huiyuan2.svg) no-repeat;
  background-position: center center;
}
.userVip-top-tips {
  width: 300px;
  padding: 45px 18px;
  padding-left: 0;
}
.userVip-top-tips p {
  font-size: 18px;
  text-align: left;
  color: #4a4a4a;
}
.userVip-top-tips p:nth-of-type(2) {
  padding-top: 5px;
}
.userVip-top-btns {
  padding: 30px 0px;
}
.userVip-top-btns p {
  width: 146px;
  height: 36px;
  line-height: 36px;
  border-radius: 100px;
  background-color: #7bc16b;
  font-size: 14px;
  color: #fff;
  text-align: center;
  margin-bottom: 16px;
  cursor: pointer;
}
.userVip-top-btns p:hover {
  background-color: #6ab359;
}
.userVip-bottom-wrap {
  border-radius: 5px;
  background-color: #fff;
  width: 100%;
  /*height:583px;*/
  margin-top: 20px;
  padding-bottom: 40px;
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
.userVip-bottom-nav::after {
  content: "";
  width: 1px;
  height: 102%;
  position: absolute;
  background-color: #ededed;
  top: 0;
  left: 50%;
  margin-left: -0.5px;
}
.userVip-bottom-nav p {
  width: 50%;
  float: left;
  cursor: pointer;
  font-size: 16px;
}
.userVip-bottom-nav p:nth-of-type(1) {
  /*border-right: 1px solid #ededed;*/
}
.userVip-bottom-nav p.active {
  border-bottom: 4px solid #e46773;
  height: 39px;
  color: #e46773;
}
.userVip-tabItem-active {
  margin: 30px 47px;
  margin-bottom: 38px;
  height: 36px;
  line-height: 36px;
}
.userVip-tabItem-active input {
  width: 260px;
  height: 100%;
  border: 0;
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
  transition: .3s all ease;
  -webkit-appearance: none;
}

input::-webkit-input-placeholder {
  color: #4a4a4a;
  font-size: 18px;
}
input:-moz-placeholder {
  color: #4a4a4a;
  font-size: 18px;
}
input:-ms-input-placeholder {
  color: #4a4a4a;
  font-size: 18px;
}

.userVip-tabItem-active p {
  float: left;
}
.userVip-tabItem-active p:nth-of-type(1) {
  color: #4a4a4a;
  font-size: 18px;
}
.userVip-tabItem-active p:nth-of-type(2) {
  width: 443px;
  height: 100%;
  line-height: 37px;
  border-radius: 100px;
  background-color: #ededed;
  padding-left: 30px;
}
.userVip-tabItem-active p:nth-of-type(2) span {
  display: inline-block;
  width: 146px;
  height: 36px;
  border-radius: 100px;
  background-color: #7bc16b;
  color: #fff;
  font-weight: bold;
  text-align: center;
  float: right;
  cursor: pointer;
}
.userVip-tabItem-active p:nth-of-type(2) span:hover {
  background-color: #6ab359;
}
.userVip-tabItem-purchase {
  padding: 0 20px;
}
.userVip-tabItem-purchase div {
  float: left;
  width: 147px;
  height: 225px;
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 #cccccc;
  margin-right: 10px;
  text-align: center;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.userVip-tabItem-purchase div:hover {
  box-shadow: 0 0 26px 0 rgba(187, 187, 187, 0.5);
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.userVip-tabItem-purchase div ol {
  position: relative;
  overflow: hidden;
}
.userVip-tabItem-purchase div:nth-last-of-type(1) {
  margin-right: 0;
}
.userVip-tabItem-purchase div ol li:nth-of-type(1) {
  font-size: 14px;
  color: #6d6d6d;
  border-bottom: 1px solid #ededed;
  margin: 0 13px;
  height: 40px;
  line-height: 40px;
}
.userVip-tabItem-purchase div ol li:nth-of-type(2) {
  margin-top: 10px;
}
.userVip-tabItem-purchase div ol li:nth-of-type(2) span {
  font-size: 50px;
  color: #7bc16b;
}
.userVip-tabItem-purchase div ol li:nth-of-type(2) em {
  font-size: 14px;
  color: #9b9b9b;
  position: relative;
  top: 10px;
}
.userVip-tabItem-purchase div ol li:nth-of-type(3) {
  text-align: center;
  color: #9b9b9b;
  font-size: 14px;
  padding: 15px 0 26px 0;
}
.userVip-tabItem-purchase div ol li:nth-of-type(4) {
  font-size: 12px;
  color: #807f7f;
}
.userVip-tabItem-purchase div ol li:nth-of-type(5) {
  width: 120px;
  height: 34px;
  margin: 0 auto;
  line-height: 34px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  border-radius: 30px;
  background-color: #80cd71;
  cursor: pointer;
}
.userVip-tabItem-purchase div ol li:nth-of-type(5):hover {
  background-color: #6ab359;
}
.tips-small-tag {
  width: 80px;
  height: 20px;
  color: #fff;
  line-height: 20px;
  text-align: center;
  background-color: #fec62e;
  position: absolute;
  top: 7px;
  left: -25px;
  font-size: 12px;
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.userVip-bottom-tabItem > p,
.user-pay-update {
  font-size: 20px;
  color: #4a4a4a;
  text-align: center;
  margin-top: 38px;
}
.user-pay-update {
  padding-bottom: 40px;
  margin: 0;
  border-top: 1px solid #dcdbdb;
  padding-top: 38px;
}
.userVip-bottom-tab .vip-introduction {
  width: 100%;
  /*height:915px;*/
}
.user-vip-tips-wrap {
  background: #fff;
  width: 100%;
}
.vip-introduction .vip-wrap-left {
  margin: 0;
  box-shadow: none;
}
.user-vip-clearboth {
  display: block;
  width: 100px;
  height: 1px;
  background: #fff;
  clear: both;
  opacity: none;
}
.vip-introduction .vip-wrap-tips {
  padding: 35px 20px 0 20px;
}
.is-Vip .userVip-top-wrap .userVip-top-logo {
  background-image: url(../../../../static/images/learn/learn-isvip-logo.svg);
}
.is-vip-tips p:nth-of-type(2) {
  color: #f3993a;
  font-size: 16px;
}
.is-Vip .userVip-top-wrap .not-vip-tips {
  display: none;
}
.outdate-vip-tips p:nth-of-type(2) {
  color: #f3993a;
  font-size: 16px;
}
.is-vip-tips,
.outdate-vip-tips {
  display: none;
}
.is-Vip .not-vip-tips,
.is-Vip .outdate-vip-tips {
  display: none;
}
.is-Vip .is-vip-tips {
  display: block;
}
.out-date-Vip .not-vip-tips,
.out-date-Vip .is-vip-tips {
  display: none;
}
.out-date-Vip .outdate-vip-tips {
  display: block;
}
.userVip-member-bottom-nav p:hover {
  color: #e46773 !important;
}

.vip-wrap-tips{
  padding:71px 20px 27.5px 20px;
}
.vip-wrap-tips ul>li{

}
.vip-wrap-tips ul>li dl{
  height: 35px;
  margin-bottom: 10px;
}
.vip-wrap-tips ul>li dl dt{
  float: left;
}
.vip-wrap-tips ul>li dl dt{
  height: 20px;
  background: url(../../../../static/images/learn/learn-diqiu.svg) no-repeat;
  float: left;
  background-size: inherit;
  background-position: center center;
  width: 20px;
    margin-right: 12px;
    background-size:contain;
    position:relative;
    top:4px;
}
.vip-wrap-tips ul>li dl dd{
  float: left;
}
.vip-wrap-tips ul>li:nth-of-type(1) dl dt{
  background-image: url(../../../../static/images/learn/learn-diqiu.svg);
  /*width:22px;*/
}
.vip-wrap-tips ul>li:nth-of-type(2) dl dt{
  background-image: url(../../../../static/images/learn/learn-youxian.svg);
  height:22px;
}
.vip-wrap-tips ul>li:nth-of-type(3) dl dt{
  background-image: url(../../../../static/images/learn/learn-tingli.svg);
}
.vip-wrap-tips ul>li:nth-of-type(4) dl dt{
  background-image: url(../../../../static/images/learn/learn-kouyu.svg);
  height:22px;
}
.vip-wrap-tips ul>li:nth-of-type(5) dl dt{
  background-image: url(../../../../static/images/learn/learn-yuedu.svg);
}
.vip-wrap-tips ul>li:nth-of-type(6) dl dt{
  background-image: url(../../../../static/images/learn/learn-gangbi.svg);
  height:18px;
}
.vip-wrap-tips ul>li:nth-of-type(7) dl dt{
  background-image: url(../../../../static/images/learn/learn-dengpao.svg);
}
.vip-wrap-tips ul>li:nth-of-type(8) dl dt{
  background-image: url(../../../../static/images/learn/learn-tingshuo.svg);
  height: 18px;
}
.vip-wrap-tips ul>li:nth-of-type(9) dl dt{
  background-image: url(../../../../static/images/learn/learn-huangguan-red.svg);
  background-position: center top;
}
.vip-wrap-tips ul>li:nth-of-type(10) dl dt{
  background-image: url(../../../../static/images/learn/learn-jiangpai.svg);
}
.vip-wrap-tips ul>li:nth-of-type(11) dl dt{
  background-image: url(../../../../static/images/learn/learn-pengyouquan.svg);
}
.vip-wrap-tips ul>li:nth-of-type(12) dl dt{
  background-image: url(../../../../static/images/learn/learn-fanyi.svg);
  height: 18px;
}
.vip-wrap-tips ul>li:nth-of-type(13) dl dt{
  background-image: url(../../../../static/images/learn/learn-xiazai.svg);
  height: 18px;
}
.vip-wrap-tips ul>li:nth-of-type(14) dl dt{
  background-image: url(../../../../static/images/learn/learn-pingfen.svg);
}
.vip-wrap-tips ul>li:nth-of-type(15) dl dt{
  background-image: url(../../../../static/images/learn/learn-diy.svg);
}
.vip-wrap-tips ul>li dl dd ol>li{
  font-size: 14px;
  color: #e46773;;
  height: 16px;
}
.vip-wrap-tips ul>li dl dd ol>li:nth-of-type(2){
  font-size: 14px;
  color: #9b9b9b;
  padding-top:2px;
}

</style>
