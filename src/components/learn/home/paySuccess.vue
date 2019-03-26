<template>
  <div class="pay-success-container">
    <div class="pay-success">
      <p><i></i></p>
      <p>支付成功啦，请确认支付完成！</p>
      <p><router-link :to="{path: '/app/index'}">知道了</router-link></p>
      <p>点击“知道了”将跳转至学习主页</p>
      <p>可以到个人中心查看购买的课程</p>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.pay-success-container {
  width: 100%;
  height: 100%;
  background: #F1F5F8;
  position: absolute;
  .pay-success {
    width: 980px;
    height: 520px;
    border-radius: 3px;
    background-color: #fff;
    margin: 30px auto;
    p {
      text-align: center;
      &:first-child {
        i {
          margin-top: 95px;
          display: inline-block;
          width: 92px;
          height: 60px;
          background-image: url('../../../../static/images/learnIndex/icon-pay-success.svg');
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
      &:nth-child(2) {
        font-size: 18px;
        font-weight: 600;
        color: #0A2B40;
        margin-top: 20px;
      }
      &:nth-child(3) {
        margin-top: 66px;
        a {
          width: 180px;
          height: 37px;
          background-color: #0581D1;
          border-radius: 20px;
          display: inline-block;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          line-height: 37px;
          &:hover {
            background-color: #2A9FE4;
          }
        }
      }
      &:nth-child(4) {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 500;
        color: #90A2AE;
      }
      &:nth-child(5) {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 500;
        color: red;
      }
    }
  }
}
</style>
