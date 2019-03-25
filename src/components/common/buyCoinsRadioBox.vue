<template>
  <div class="buy-coins-container" v-show="showBuyCoinsBox">
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
            <div class="price">
              <span>本次支付</span>
              <span>{{itemRadio.money}}</span>
              <span>金币</span>
            </div>
          </div>
        </div>
        <div class="instruc">
          <p>订阅说明：1、购买完成后不可退回；2、购买有效期为1年。</p>
        </div>
        <!-- 支付 -->
        <div class="pay">
          <p>
            <span @click="clickPay()">立即支付</span>
          </p>
        </div>
      </div>
      <!-- 了解会员 -->
      <div class="vip-understand" v-show="isVip !== 1">
        <div class="vip-cont">
          <div class="left">
            <i></i>
            <span>加入VIP，畅听更多"会员免费"课程！</span>
          </div>
          <!-- :to="{path: '/app/user/vip'}"  -->
          <a @click="knowVip()" class="right">
            了解会员
            <i></i>
          </a>
        </div>
      </div>
    </div>
    <!-- 支付成功 -->
    <div class="pay-success" v-show="successShow">
      <div class="pay-content">
        <p class="bg-img"><i></i></p>
        <p>支付成功</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../bus'
export default {
  // props: ['itemRadio', 'showBuyCoinsBox'],
  data () {
    return {
      itemRadio: {},
      itemRadioDetail: {},
      subscibenoInfo: {},
      showBuyCoinsBox: false,
      contentShow: true,
      successShow: false
    }
  },
  created () {
    Bus.$on('showBuyCoinsRadio', (radio) => {
      console.log('当前要购买的金币radio', radio)
      this.itemRadio = radio
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (userInfo.coins < radio.money) {
        Bus.$emit('showUserCoins', userInfo.coins, radio.money)
      } else {
        this.showBuyCoinsBox = true
      }
    })
    Bus.$on('hiddenBuyCoinsBox', (radioDetail) => {
      console.log('组件传过来的radio的详情页面', radioDetail)
      this.itemRadioDetail = radioDetail
      this.subscibenoInfo = radioDetail.relation
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo // 用户信息
    }),
    isVip () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    }
  },
  methods: {
    ...mapActions({
      postPurchaseCourse: 'course/postPurchaseCourse' // 金币订阅课程
    }),
    // 关闭按钮
    closeButton () {
      this.showBuyCoinsBox = false
    },
    knowVip () {
      this.showBuyCoinsBox = false
      this.$router.push({path: '/app/user/vip'})
    },
    // 初始化订阅的状态
    async initSubscibe (radioDetail) {
      await this.postPurchaseCourse({code: radioDetail.course_info.code}).then(res => {
        console.log('订阅课程返回', res)
        // purchased_state状态值显示隐藏 0未购买 1已购买 隐藏 2购买已删除
        this.subscibenoInfo.purchased_state = 1
      })
    },
    // 立即订阅
    clickPay () {
      this.contentShow = false
      this.successShow = true
      setTimeout(() => {
        this.successShow = false
        this.showBuyCoinsBox = false
        this.initSubscibe(this.itemRadioDetail)
        this.contentShow = true
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
// 弹框提示
.buy-coins-container{
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
          height: 32px;
          position: absolute;
          top: 50%;
          margin-top: -5px;
          .price{
            width: 100%;
            height: 32px;
            font-size:15px;
            font-family:PingFang-SC-Bold;
            font-weight:bold;
            color:rgba(255,167,23,1);
            line-height:16px;
            text-align: center;
            span:nth-child(2) {
              font-size: 27px;
              font-family:Impact;
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
        display: inline-block;
        width: 100%;
        text-align: center;
        p {
          font-size:15px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(255,255,255,1);
          line-height:21px;
          span {
            cursor: pointer;
            padding: 8px 50px;
            background:linear-gradient(270deg,rgba(12,183,234,1) 0%,rgba(5,129,209,1) 100%);
            border-radius:19px;
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
        span, a {
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
          i {
            margin-left: 3px;
            width: 10px;
            height: 10px;
            background-image: url('../../../static/images/instrocevip.svg');
          }
          &:hover {
            color:rgba(255,255,255,.5);
            i {
              background-image: url('../../../static/images/instroceviphover.svg');
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
          width: 70px;
          height: 70px;
          background: url('../../../static/images/discovery/subscribe-success.svg') no-repeat center;
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
