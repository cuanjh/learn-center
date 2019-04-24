<template>
  <div class="user-buy">
    <div class="user-content">
      <div class="top"></div>
      <div class="content">
        <div class="user-message">
          <span>购买账户：</span>
          <div class="nickname" v-if="userInfo">
            <img :src="userInfo.photo?userInfo.photo:''" alt="头像">
            <span>{{userInfo.nickname}}</span>
          </div>
        </div>
        <div class="router-card">
          <div class="card-cont">
            <div class="card">
              <div class="price">
                <span>¥</span>
                <span>{{ userBuy.total_money }}</span>
                <span></span>
              </div>
              <div class="expect">
                <span>{{ userBuy.product }}个月有效期</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pay-for">
          <span>应支付：</span>
          <span>{{userBuy.total_money}}元</span>
        </div>
        <div class="hand">
          <div class="point">
            <i></i>
            <span>请选择付款方式</span>
          </div>
        </div>
        <div class="pay-methods">
          <div class="pay">
            <div class="weixin">
              <img id="qrCode" :src="weixinUrl" alt>
              <!-- <i></i> -->
              <span>微信付款</span>
            </div>
            <div class="zhifubao">
              <i @click="purchase()"></i>
              <span>支付宝付款</span>
            </div>
          </div>
        </div>
        <div class="checkbox" v-show="false">
          <label for="label" @click.stop="clickMe">
            <input type="checkbox" id="label" v-model="ckeckVal">
            {{message}}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../bus.js'
// import LogCollect from '../../../tool/logCollect'

export default {
  data () {
    return {
      showWX: false,
      ckeckVal: true,
      message: '支付即同意《xxxx-用户协议》支付后即可申请发票'
    }
  },
  mounted () {
    this.getUserInfo()
    let productId = this.userBuy.product_id
    console.log('productId', productId)
    let params = {
      product_id: productId,
      course_code: ''
    }
    this.createAliRadioOrder(params)
    this.createWeixinRadioOrder(params)
    console.log('------>11', this.userBuy)
    console.log('======>22', this.user)
    console.log('======>33', this.aliPayUrl)
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      // pay: state => state.user.pay
      pay: state => state.user.pay, // 支付宝订单数据
      payWeixin: state => state.user.payWeixin // 微信支付订单数据
    }),
    userBuy () {
      let userBuyVip = JSON.parse(localStorage.getItem('userBuy'))
      return userBuyVip
    },
    // 支付宝链接
    aliPayUrl () {
      return this.pay.aliWebPayUrl
    },
    // 微信链接
    weixinUrl () {
      return this.payWeixin.aliWebPayUrl
    }
  },
  methods: {
    ...mapActions({
      getUserInfo: 'getUserInfo',
      // createAliWebOrder: 'user/createAliWebOrder'
      createAliRadioOrder: 'user/createAliRadioOrder', // 创建支付宝订单
      createWeixinRadioOrder: 'user/createWeixinRadioOrder' // 创建微信支付订单
    }),
    clickMe () {
      let that = this
      console.log(that.ckeckVal)
    },
    purchase () {
      window.open(this.aliPayUrl)
      let obj = {
        className: 'vipIcon',
        description: '未完成支付请先完成支付！<br/>支付成功后请刷新页面。',
        btnDesc: '知道了',
        isLink: false
      }
      Bus.$emit('showCommonModal', obj)
    }
  }
}
</script>
<style lang="less" scoped>
.user-buy {
  width: 100%;
  .user-content {
    width: 1026px;
    margin: 26px auto 30px;
    background: #ffffff;
    border-radius: 0px 0px 5px 5px;
    .top {
      width: 100%;
      height: 14px;
      background: #2a9fe4ff;
      border-radius: 5px 5px 0px 0px;
    }
    .content {
      padding: 28px 60px 76px;
      .user-message {
        display: flex;
        align-items: center;
        width: 100%;
        span {
          font-size: 16px;
          font-weight: 500;
          color: rgba(10, 43, 64, 1);
        }
        .nickname {
          img {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            margin: 0 10px 0 12px;
          }
          span {
            font-size: 16px;
            // font-family: PingFangSC-Semibold;
            font-weight: 600;
            color: rgba(10, 43, 64, 1);
            line-height: 34px;
          }
        }
      }
      .router-card {
        width: 100%;
        padding: 20px 0 40px;
        border-bottom: 1px dashed rgba(200, 212, 219, 1);
        .card-cont {
          width: 100%;
          .card {
            width: 264px;
            margin: 0 auto;
            height:120px;
            background:rgba(255,255,255,1);
            box-shadow:0px 6px 13px 0px rgba(76,37,4,0.2);
            border:2px solid rgba(255,190,41,1);
            .price {
              padding-top: 32px;
              position: relative;
              margin-left: 90px;
              span:nth-child(1) {
                font-size: 20px;
                font-weight: 500;
                color: rgba(144, 162, 174, 1);
              }
              span:nth-child(2) {
                font-size: 53px;
                font-family: DINCondensed-Bold;
                font-weight: bold;
                color: rgba(0, 42, 91, 1);
              }
              span:nth-child(3) {
                position: absolute;
                bottom: 18px;
                font-size: 12px;
                font-weight: bold;
                color: rgba(144, 162, 174, 1);
                text-align: bottom;
              }
            }
            .expect {
              width: 100%;
              text-align: center;
              margin-top: -6px;
              span {
                font-size: 11px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(0, 42, 91, 1);
              }
            }
          }
        }
      }
      .pay-for {
        width: 100%;
        padding: 30px 0 30px;
        text-align: center;
        span {
          font-size: 16px;
          font-weight: 500;
          color: rgba(126, 146, 159, 1);
        }
      }
      .hand {
        width: 100%;
        margin-bottom: 27px;
        .point {
          width: 100%;
          i {
            display: inline-block;
            width: 24px;
            height: 20px;
            background: url("../../../../static/images/hand.svg") no-repeat
              center;
            background-size: cover;
          }
          span {
            height: 22px;
            line-height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: rgba(10, 43, 64, 1);
          }
        }
      }
      .pay-methods {
        width: 100%;
        .pay {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 12px;
            font-weight: 500;
            color: #7e929f;
            line-height: 17px;
            padding-top: 4px;
          }
          .weixin {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-right: 50px;
            img {
              width: 130px;
              height: 130px;
              background-color: #eaeaea;
              background-repeat: no-repeat;
              background-size: cover;
            }
            i {
              position: absolute;
              width: 22px;
              height: 22px;
              display: inline-block;
              background-image: url("../../../../static/images/pay-icon/icon-wx.svg");
              background-repeat: no-repeat;
              background-size: cover;
              margin-top: -10px;
            }
          }
          .zhifubao {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            i {
              cursor: pointer;
              display: inline-block;
              width: 126px;
              height: 126px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
              background-image: url("../../../../static/images/pay-icon/icon-alipay1.svg");
            }
          }
        }
      }
      .checkbox {
        margin-top: 63px;
        text-align: center;
        input {
          width: 16px;
          height: 16px;
          border: 1px solid #f5f3f3;
          margin-top: 4px;
          margin-right: 10px;
          cursor: pointer;
          -webkit-appearance: checkbox;
          appearance: checkbox;
          -webkit-appearance: checkbox;
          -webkit-appearance: checkbox;
          -ms-appearance: checkbox;
          -moz-appearance: checkbox;
          -o-appearance: checkbox;
        }
        input:checked {
          content: "\2714";
          text-align: center;
          font-size: 16px;
          color: white;
        }
      }
    }
  }
}
</style>
