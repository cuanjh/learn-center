<template>
  <div class="buy-container" v-show="showBuyBox">
    <div class="buy-radio" v-show="contentShow">
      <div class="close-button" @click="closeButton()"></div>
      <div class="buy-title">
        <p>付费内容提示</p>
        <p>收听完整内容需要你购买订阅哦～</p>
      </div>
      <!-- 课程详情 -->
      <div class="course-introduce">
        <div class="introduce-content">
          <div class="triangle"></div>
          <div class="course">
            <p>{{itemRadio.title ||itemRadio.module_name}}</p>
            <div class="price">
              <p>课程共计 {{itemRadio.cards_count}} 课</p>
              <p class="yuan">
                <span>{{itemRadio.money}}</span>
                <span>元/年</span>
              </p>
            </div>
          </div>
        </div>
        <div class="instruc">
          <p>订阅说明：1、购买完成后不可退回；2、购买有效期为1年。</p>
        </div>
        <!-- 支付信息 -->
        <div class="pay">
          <div class="weixin">
            <i></i>
            <span>微信扫码付款</span>
          </div>
          <div class="zhifubao">
            <i @click="goPayRadio()"></i>
            <span>支付宝扫码付款</span>
          </div>
        </div>
      </div>
      <!-- 了解会员 -->
      <div class="vip-understand" v-show="isVip !== 1 && (itemRadio.free_for_member !== 0 || itemRadio.free_for_member === true)">
        <div class="vip-cont">
          <div class="left">
            <i></i>
            <span>加入VIP，畅听更多"会员免费"课程！</span>
          </div>
          <router-link tag="div" :to="{path: '/app/user/vip'}" class="right">
            <span>了解会员</span>
            <i></i>
          </router-link>
        </div>
      </div>
      <!-- 遇到问题 -->
      <div class="have-problem">
        <div class="problem-content">
          <div class="phone" v-show="activeButton">
            <div class="phone-cont">
              <p>
                <i></i>
                <span>400-068-8056</span>
              </p>
              <p>
                <i></i>
                <span>vip@talkmate.com</span>
              </p>
            </div>
          </div>
          <div class="button">
            <p  @mouseenter='showActiveButton' @mouseleave="hideActiveButton">
              <i></i>
              <span>遇到问题</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 支付成功 -->
    <div class="pay-success" v-show="successBox">
      <div class="pay-content">
        <p class="bg-img"><i></i></p>
        <p>你已支付成功并完成电台订阅</p>
        <p><span @click="know()">知道了</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import bus from '../../bus'
export default {
  data () {
    return {
      itemRadio: {},
      showBuyBox: false,
      contentShow: true,
      activeButton: false,
      successBox: false
    }
  },
  created () {
    bus.$on('showBuyRadio', (radio) => {
      console.log('当前要购买的人民币radio', radio)
      this.itemRadio = radio.course_info
      this.showBuyBox = true
      let params = {
        product_id: radio.course_info.product_id,
        course_code: radio.course_info.code
      }
      console.log('创建订单', params)
      this.createAliRadioOrder(params)
    })
    // 支付完成
    this.$on('successBox', (e) => {
      console.log('支付完成', e)
      this.successBox = e
    })
  },
  mounted () {
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo, // 用户信息
      pay: state => state.user.pay
    }),
    aliPayUrl () {
      return this.pay.aliWebPayUrl
    },
    isVip () {
      if (!this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    }
  },
  methods: {
    ...mapActions({
      createAliRadioOrder: 'user/createAliRadioOrder'
    }),
    showActiveButton () {
      this.activeButton = true
    },
    hideActiveButton () {
      this.activeButton = false
    },
    closeButton () {
      this.showBuyBox = false
    },
    // 知道了
    know () {
      this.$emit('successBox', false)
      this.showBuyBox = false
    },
    // 支付宝支付接口
    goPayRadio () {
      window.open(this.aliPayUrl)
    }
  }
}
</script>
<style lang="less" scoped>
// 弹框提示
.buy-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
  .buy-radio {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    background: #ffffff;
    transform: translate(-300px, -50%);
    box-shadow:0px 5px 12px 0px rgba(0,32,50,0.3);
    border-radius:5px;
    // 关闭
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      background: url('../../../static/images/close.svg') no-repeat center;
      background-size: cover;
      &:hover {
        cursor: pointer;
        background: url('../../../static/images/closehover.svg') no-repeat center;
        background-size: cover;
      }
    }
    .buy-title {
      width: 100%;
      padding: 56px 0 27px;
      p {
        font-size:14px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(126,146,159,1);
        line-height:20px;
        text-align: center;
      }
      p:nth-child(1) {
        font-size:22px;
        font-weight:bold;
        color:rgba(10,43,64,1);
        line-height:30px;
        padding-bottom: 5px;
      }
    }
    .course-introduce {
      position: relative;
      width: 100%;
      padding: 0 30px 53px;
      .introduce-content {
        position: relative;
        width: 100%;
        .triangle {
          width: 100%;
          height: 80px;
          background: url('../../../static/images/courseBg.svg') no-repeat center;
          background-size: cover;
        }
        .course {
          width: 100%;
          position: absolute;
          top: 0;
          font-size:13px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(126,146,159,1);
          line-height:18px;
          padding: 15px 32px 10px;
          p {
            font-size:16px;
            font-family:PingFang-SC-Bold;
            font-weight:bold;
            color:rgba(10,43,64,1);
            line-height:22px;
          }
          .price {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px 0px;
            p {
              font-size:13px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(126,146,159,1);
              line-height:18px;
            }
            .yuan {
              font-size:13px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(255,167,23,1);
              line-height:18px;
              display: flex;
              align-items: baseline;
            }
            span:nth-child(1) {
              font-size:26px;
              font-family:PingFang-SC-Bold;
              font-weight:bold;
              color:rgba(255,167,23,1);
              line-height:34px;
              margin-right: 5px;
            }
          }
        }
      }
      .instruc {
        width: 100%;
        p {
          font-size:12px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(178,192,201,1);
          line-height:17px;
          padding: 5px 0 38px;
          text-align: right;
        }
      }
      .pay {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          display: inline-block;
          width: 94px;
          height: 94px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        span {
          font-size:12px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(60,91,111,1);
          line-height:17px;
          padding-top: 5px;
        }
        .weixin {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 30px;
          i {
            background-image: url('../../../static/images/pay-icon/weixin.svg');
          }
        }
        .zhifubao {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          i {
            background-image: url('../../../static/images/pay-icon/zhifubao.svg');
          }
        }
      }
    }
    .vip-understand {
      width: 100%;
      .vip-cont {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 16px 29px;
        background:rgba(42,159,228,1);
        box-shadow:0px 2px 20px 0px rgba(0,102,160,0.32);
        border-radius:12px 12px 5px 5px;
        i {
          display: inline-block;
          width: 28px;
          height: 22px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        span {
          font-size:14px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:20px;
        }
        .left {
          display: flex;
          align-items: center;
          span {
            margin-left: 10px;
          }
          i {
            background-image: url('../../../static/images/yellowvip.svg');
          }
        }
        .right {
          display: flex;
          align-items: center;
          span {
            padding-right: 13px;
          }
          i {
            width: 10px;
            height: 10px;
            background-image: url('../../../static/images/instrocevip.svg');
          }
          &:hover {
            cursor: pointer;
            span {
              color:rgba(255,255,255,.5);
            }
            i {
              background-image: url('../../../static/images/instroceviphover.svg');
            }
          }
        }
      }
    }
    // 遇到问题
    .have-problem {
      position: absolute;
      bottom: 80px;
      right: 0;
      .problem-content {
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        .button {
          display: inline-block;
          background:rgba(255,255,255,1);
          box-shadow:0px 2px 6px 0px rgba(0,32,50,0.1);
          border-radius:11px 0px 0px 11px;
          padding: 23px 6px;
          p {
            width: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size:13px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:#B2C0C9FF;
            span {
              padding-top: 6px;
            }
            i {
              background-image: url('../../../static/images/problem.svg');
            }
            &.active {
              cursor: pointer;
              i {
                background-image: url('../../../static/images/problemhover.svg');
              }
              span {
                color: #3C5B6FFF;
              }
            }
          }
          &:hover {
            cursor: pointer;
            i {
              background-image: url('../../../static/images/problemhover.svg');
            }
            span {
              color: #3C5B6FFF;
            }
          }
        }
        .phone {
          display: inline-block;
          background:rgba(255,255,255,1);
          box-shadow:0px 2px 6px 0px rgba(126,146,159,1);
          border-radius:5px;
          margin-top: 25px;
          .phone-cont {
            width: 100%;
            height: 100%;
            padding: 14px 18px;
            p {
              display: flex;
              align-items: center;
              font-size:13px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(10,43,64,1);
              line-height:18px;
              span {
                padding-left: 10px;
              }
            }
            p:nth-child(1) {
              padding-bottom: 5px;
              i {
                width: 15px;
                height: 13px;
                background-image: url('../../../static/images/phone.svg');
              }
            }
            p:nth-child(2) {
              i {
                width: 16px;
                height: 13px;
                background-image: url('../../../static/images/email.svg');
              }
            }
          }
        }
      }
    }
  }
  // 支付成功
  .pay-success {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 460px;
    background: #ffffff;
    transform: translate(-230px, -50%);
    box-shadow:0px 5px 12px 0px rgba(0,32,50,0.3);
    border-radius:5px;
    .pay-content {
      width: 100%;
      height: 100%;
      padding: 51px 0 37px;
      text-align: center;
      .bg-img {
        width: 100%;
        i {
          display: inline-block;
          width: 90px;
          height: 90px;
          background: url('../../../static/images/discovery/pay-zhifubao-success.svg') no-repeat center;
          background-size: cover;
        }
      }
      p:nth-child(2) {
        font-size:18px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(10,43,64,1);
        padding: 28px 0 20px;
      }
      p:last-child {
        font-size:14px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(144,162,174,1);
        line-height:20px;
        span:hover {
          cursor: pointer;
          color: #2A9FE4FF;
        }
      }
    }
  }
}
</style>
