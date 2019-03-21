<template>
  <div class="user-buy">
    <div class="user-content">
      <div class="top"></div>
      <div class="content">
        <div class="user-message">
          <span>开通账户：</span>
          <div class="nickname">
            <img :src="user.photo" alt="头像">
            <span>{{user.nickname}}</span>
          </div>
        </div>
        <div class="router-card">
          <div class="card-cont">
            <div class="card">
              <div class="price">
                <span>¥</span>
                <span>{{ userBuy.money }}</span>
                <span>/mo</span>
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
            <span>Please select the payment method</span>
          </div>
        </div>
        <div class="pay-methods">
          <ul>
            <li>
              <a class="weixin">
                <i></i>
                <span>WeChat payment</span>
              </a>
            </li>
            <li>
              <a class="zhifubao" @click="purchase()">
                <i></i>
                <span>ZhiFuBao payment</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="checkbox">
          <label for="label" @click.stop="clickMe">
            <input type="checkbox" id="label" v-model="ckeckVal" >{{message}}
        </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
// import LogCollect from '../../../tool/logCollect'

export default {
  data () {
    return {
      ckeckVal: true,
      message: '支付即同意《xxxx-用户协议》支付后即可申请发票'
    }
  },
  mounted () {
    let productId = this.userBuy.product_id
    this.createAliWebOrder(productId)
    console.log('------>11', this.userBuy)
    console.log('======>22', this.user)
    console.log('======>33', this.aliPayUrl)
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      pay: state => state.user.pay
    }),
    user () {
      let user = this.userInfo
      if (Object.keys(user).length === 0) {
        user = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      return user
    },
    userBuy () {
      let userBuyVip = JSON.parse(localStorage.getItem('userBuy'))
      return userBuyVip
    },
    aliPayUrl () {
      return this.pay.aliWebPayUrl
    }
  },
  methods: {
    ...mapMutations({
      updatePurchaseIconPay: 'user/updatePurchaseIconPay'
    }),
    ...mapActions({
      createAliWebOrder: 'user/createAliWebOrder'
    }),
    clickMe () {
      let that = this
      console.log(that.ckeckVal)
    },
    purchase () {
      window.open(this.aliPayUrl)
    }
  }
}
</script>
<style lang="less" scoped>
.user-buy {
  width: 100%;
  .user-content {
    width: 1200px;
    margin: 20px auto 30px;
    background: #ffffff;
    border-radius:0px 0px 5px 5px;
    .top {
      width: 100%;
      height: 40px;
      background: #2A9FE4FF;
      border-radius:5px 5px 0px 0px;
    }
    .content {
      padding: 48px 60px 144px;
      .user-message {
        display: flex;
        align-items: center;
        width: 100%;
        span {
          font-size:16px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(10,43,64,1);
        }
        .nickname {
          img {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            margin: 0 10px 0 12px;
          }
          span {
            font-size:16px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(10,43,64,1);
            line-height: 34px;
          }
        }
      }
      .router-card {
        width: 100%;
        padding: 20px 0 40px;
        border-bottom:1px dashed rgba(200,212,219,1);
        .card-cont {
          width: 100%;
          .card {
            width: 240px;
            margin: 0 auto;
            background:rgba(255,255,255,1);
            box-shadow:0px 3px 10px 0px rgba(121,121,121,0.12);
            border:1px solid rgba(255,190,41,1);
            .price {
              padding-top: 41px;
              position: relative;
              text-align: center;
              span:nth-child(1) {
                font-size:26px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(144,162,174,1);
              }
              span:nth-child(2) {
                font-size:70px;
                font-family:DINCondensed-Bold;
                font-weight:bold;
                color:rgba(0,42,91,1);
              }
              span:nth-child(3) {
                position: absolute;
                bottom: 25px;
                font-size:16px;
                font-family:PingFang-SC-Bold;
                font-weight:bold;
                color:rgba(144,162,174,1);
                text-align: bottom;
              }
            }
            .expect {
              width: 100%;
              text-align: center;
              padding-bottom: 18px;
              span {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(0,42,91,1);
              }
            }
          }
        }
      }
      .pay-for {
        width: 100%;
        padding: 40px 0 56px;
        text-align: center;
        span {
          font-size:16px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(126,146,159,1);
        }
      }
      .hand {
        width: 100%;
        margin-bottom: 47px;
        .point {
          width: 100%;
          i {
            display: inline-block;
            width: 24px;
            height: 20px;
            background: url('../../../../static/images/hand.svg') no-repeat center;
            background-size: cover;
            margin-top: 4px;
          }
          span {
            font-size:20px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(10,43,64,1);
          }
        }
      }
      .pay-methods {
        width: 100%;
        ul {
          display: flex;
          li {
            width:300px;
            height:70px;
            margin-right: 50px;
            span {
              font-size:16px;
              font-family:PingFang-SC-Bold;
              font-weight:bold;
              color:rgba(10,58,0,1);
              line-height: 70px;
              margin-left: 20px;
            }
            .weixin {
              width: 100%;
              background:rgba(126,211,33,1);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius:8px;
              i {
                display: inline-block;
                width: 35px;
                height: 30px;
                background: url('../../../../static/images/weixin.svg') no-repeat center;
                background-size: cover;
              }
            }
            .zhifubao {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background:#2A9FE4;
              border-radius:8px;
              &:hover {
                background:#3FADEF;
              }
              i {
                display: inline-block;
                width: 38px;
                height: 30px;
                background: url('../../../../static/images/zhifubao.svg') no-repeat center;
                background-size: cover;
              }
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
