<template>
<div class="noVipGuidecont" v-show="isShowNoVipModal">
  <div class="guide-box">
    <div class="close-img" @click="closeModal()"></div>
    <p class="title">VIP专属语音评测</p>
    <router-link :to="{path: '/app/vip-home'}" target="_blank" class="vip">
      <p><i></i><span>开通Vip会员 , 开启智能评分</span></p>
      <i class="go-vip"></i>
    </router-link>
    <div class="lists">
      <div class="swiper-container" id="novip-swiper-lists1">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="item">
              <p>1. 智能评分颜色说明</p>
              <i class="pic-novip-1" v-if="xfSpeechType === 'ise'"></i>
              <i class="pic-novip-iat-1" v-else></i>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="item">
              <p>2. 专属智能评分</p>
              <i class="pic-novip-2" ></i>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="item" v-if="xfSpeechType === 'ise'">
              <p>3.智能小e单词评分分析</p>
              <i class="pic-novip-3"></i>
            </div>
            <div class="item" v-else>
              <p>3.智能小e句子跟读识别</p>
              <i class="pic-novip-iat-3"></i>
            </div>
          </div>
        </div>
        <div class="swiper-pagination" id="novip-pagination"></div>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import Bus from '../../../../bus'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      isShowNoVipModal: false,
      guideSwiper: null
    }
  },
  created () {
    Bus.$on('showNoVipModal', () => {
      this.initGuideSwiper()
      this.isShowNoVipModal = true
      this.guideSwiper.autoplay.start()
      this.guideSwiper.mousewheel.enable()
    })
  },
  mounted () {
  },
  computed: {
    ...mapState({
      xfSpeechType: state => state.xfSpeechType,
      isDredge: state => state.isDredge
    })
  },
  methods: {
    ...mapMutations([
    ]),
    ...mapActions({
      getUserInfo: 'getUserInfo'
    }),
    initGuideSwiper () {
      this.guideSwiper = new Swiper('#novip-swiper-lists1', {
        speed: 500,
        loop: true,
        initialSlide: 0,
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        mousewheel: true,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        observeSlideChildren: true,
        allowTouchMove: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
      console.log(this.guideSwiper)
    },
    closeModal () {
      this.getUserInfo().then(res => {
        console.log(res)
        if (res.info.member_info.member_type === 1) {
          // Bus.$emit('upUserVip')
          let msg = '刚刚开通会员权益，快去再录一次吧！'
          Bus.$emit('show-prompt', msg)
        }
      })
      let circle = localStorage.getItem('showCircle')
      Bus.$emit('localShowCircle', circle)
      this.isShowNoVipModal = false
      this.guideSwiper.autoplay.stop()
      this.guideSwiper.mousewheel.disable()
    }
  }
}
</script>

<style lang="less" scoped>
.noVipGuidecont {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index:99999999;
  overflow: hidden;
}
.guide-box {
  width: 669px;
  min-height: 460px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius:8px;
  background: #fff;
  .close-img {
    position: absolute;
    top: -44px;
    right: 0px;
    width: 30px;
    height: 30px;
    background: url('../../../../../static/images/kid/icon-close.png') no-repeat center;
    background-size: cover;
    cursor: pointer;
    &:hover {
      opacity: .8;
    }
  }
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
      width: 377px;
      height: 262px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      &.pic-novip-1 {
        width: 430px;
        background-image: url('../../../../../static/images/kid/pic-novip-1.png');
      }
      &.pic-novip-iat-1 {
        width: 430px;
        background-image: url('../../../../../static/images/kid/pic-novip-iat-1.png');
      }
      &.pic-novip-2 {
        background-image: url('../../../../../static/images/kid/pic-novip-2.png');
      }
      &.pic-novip-3 {
        width: 408px;
        height: 298px;
        background-image: url('../../../../../static/images/kid/pic-novip-3.png');
      }
      &.pic-novip-iat-3 {
        width: 408px;
        height: 290px;
        background-image: url('../../../../../static/images/kid/pic-novip-iat-3.png');
      }
    }
  }
  .swiper-container {
    padding-bottom: 30px;
  }
}
@media (max-height: 610px){
  .lists {
    padding: 12px 32px 12px;
    .swiper-container {
      padding-bottom: 10px;
    }
  }
  .lists .item p {
    padding-bottom: 0;
  }
  .lists .item i {
    transform: scale(.9);
  }
  .title {
    padding: 16px 0;
  }
  .guide-box {
    max-height: 420px;
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
@media (max-height: 610px){
  .swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction {
    bottom: 26px;
  }
}
</style>
