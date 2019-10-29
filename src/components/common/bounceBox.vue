<template>
  <div class="bounceBox">
    <div class="bounce-content">
      <div class="title">
        <span>请选择要分享的平台</span>
        <i @click="Hidden()"></i>
      </div>
      <div class="bounce-list">
        <ul>
          <li>
            <div class="back-img1"></div>
            <span>全球说语伴</span>
          </li>
          <li>
            <div class="back-img2"></div>
            <span>全球说语伴</span>
          </li>
          <li>
            <div class="back-img3"></div>
            <span>全球说语伴</span>
          </li>
          <li>
            <div class="back-img4"></div>
            <span>全球说语伴</span>
          </li>
          <li>
            <div class="back-img5"></div>
            <span>全球说语伴</span>
          </li>
          <li>
            <div class="back-img6"></div>
            <span>全球说语伴</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    Hidden () {
      this.$emit('hidden')
    }
  }
}
</script>
<style lang="less" scoped>
.bounceBox {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .6);
  z-index: 99;
  .bounce-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 700px;
    height: 240px;
    background: #ffffff;
    .title {
      font-size:26px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(10,43,64,1);
      line-height:37px;
      text-align: center;
      margin-top: 35px;
      i {
        cursor: pointer;
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('../../../static/images/bounceBox/close.png') no-repeat center;
        background-size: cover;
        position: absolute;
        right: 30px;
        top: 35px;
      }
    }
    .bounce-list {
      width: 100%;
      margin-top: 30px;
      ul {
        display: flex;
        justify-content: space-around;
        li {
          cursor: pointer;
          font-size: 16px;
          color: #B8B8B8;
          span {
            display: inline-block;
            margin-top: 15px;
          }
          .back-img1 {
            width: 72px;
            height: 72px;
            background: url('../../../static/images/bounceBox/talkmate.png') no-repeat center;
            background-size: 100%;
          }
          .back-img2 {
            width: 72px;
            height: 72px;
            background: url('../../../static/images/bounceBox/weixin.png') no-repeat center;
            background-size: 100%;
          }
          .back-img3 {
            width: 72px;
            height: 72px;
            background: url('../../../static/images/bounceBox/friend.png') no-repeat center;
            background-size: 100%;
          }
          .back-img4 {
            width: 72px;
            height: 72px;
            background: url('../../../static/images/bounceBox/weibo.png') no-repeat center;
            background-size: 100%;
          }
          .back-img5 {
            width: 72px;
            height: 72px;
            background: url('../../../static/images/bounceBox/qq.png') no-repeat center;
            background-size: 100%;
          }
          .back-img6 {
            width: 72px;
            height: 72px;
            background: url('../../../static/images/bounceBox/space.png') no-repeat center;
            background-size: 100%;
          }
        }
      }
    }
  }
}
</style>
