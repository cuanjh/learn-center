<template>
  <div class="guide-box">
    <p class="title">VIP专属语音评测</p>
    <router-link :to="{path: '/app/vip-home'}" target="_blank" class="vip">
      <p><i></i><span>开通Vip会员 , 开启智能评分</span></p>
      <i class="go-vip"></i>
    </router-link>
    <div class="lists">
      <div class="swiper-container" id="swiper-lists">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="item">
              <p>1. 智能评分颜色说明</p>
              <i class="pic-novip-1"></i>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="item">
              <p>2. 专属智能评分</p>
              <i class="pic-novip-2"></i>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="item">
              <p>3.专属评分详情</p>
              <i class="pic-novip-3"></i>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
// import Swiper from 'swiper'
// import 'swiper/dist/css/swiper.min.css'

export default {
  data () {
    return {
    }
  },
  updated () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.guide-box {
  width: 600px;
  min-height: 260px;
}
.title {
  text-align: center;
  padding: 24px 0;
  background: #2CA0E5;
  border-radius:8px 8px 0px 0px;
  font-size:24px;
  font-weight:500;
  color:rgba(255,255,255,1);
}
.vip {
  display: inline-block;
  cursor: pointer;
  width: 100%;
  height: 46px;
  background: #FFB94E;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  p {
    display: flex;
    align-items: center;
    font-size:18px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:25px;
    i {
      display: inline-block;
      width: 22px;
      height: 18px;
      background: url('../../../../../static/images/kid/icon-vip.png') no-repeat center;
      background-size: cover;
      margin-right: 10px;
    }
  }
  .go-vip {
    display: inline-block;
    width: 8px;
    height: 14px;
    background: url('../../../../../static/images/kid/icon-go.png') no-repeat center;
    background-size: cover;
    cursor: pointer;
  }
}
.lists {
  padding: 32px 32px 20px;
  .item {
    text-align: center;
    p {
      font-size:20px;
      font-weight:500;
      color:rgba(60,91,111,1);
      line-height:28px;
      padding-bottom: 24px;
      text-align: left;
    }
    i {
      display: inline-block;
      width: 340px;
      height: 228px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      &.pic-novip-1 {
        background-image: url('../../../../../static/images/kid/pic-novip-1.png');
      }
      &.pic-novip-2 {
        background-image: url('../../../../../static/images/kid/pic-novip-2.png');
      }
      &.pic-novip-3 {
        background-image: url('../../../../../static/images/kid/pic-novip-3.png');
      }
    }
  }
  .item {
    margin-bottom: 32px;
  }
}
</style>
<style lang="css">
.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction {
  bottom: -10px;
}
.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet {
  padding: 0 16px!important;
  border-radius: 5px!important;
  background: #D5DCDF!important;
}
.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: #0581D1!important;
}
</style>
