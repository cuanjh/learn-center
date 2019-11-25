<template>
<transition name="fade">
  <div class="word-modal-box" v-show="showWordBox">
    <div class="word-box-content">
      <div class="close-img-box" @click="closeModal()"></div>
      <div v-if="isVip !== 1">
        <noVip-guide-box />
      </div>
      <div class="words-content" v-else>
        <word-item :newWords="newWords"/>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import WordItem from './wordItem.vue'
import { mapState } from 'vuex'
import NoVipGuideBox from './noVipGuideBox.vue'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'

export default {
  data () {
    return {
      showWordBox: false,
      newWords: []
    }
  },
  components: {
    WordItem,
    NoVipGuideBox
  },
  mounted () {
    this.initGuideSwiper()
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo, // 用户信息
      xfSyllPhone: state => state.xfSyllPhone // 因素的对应表
    }),
    // 是否vip
    isVip () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    }
  },
  methods: {
    showWordListBox (words) {
      this.newWords = words
      this.showWordBox = true
    },
    closeModal () {
      this.showWordBox = false
    },
    initGuideSwiper () {
      this.$nextTick(() => {
        var guideSwiper2 = new Swiper('.word-box-content #swiper-lists', {
          loop: false,
          autoplay: false, // 自动轮播
          paginationClickable: true,
          observer: true, // 修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, // 修改swiper的父元素时，自动初始化swiper
          initialSlide: 0,
          centeredSlides: true,
          slidesPerView: 'auto',
          slideToClickedSlide: true,
          mousewheel: true,
          allowTouchMove: true,
          pagination: {
            el: '.swiper-pagination'
          },
          on: {
            init: () => {
            }
          }
        })
        console.log(guideSwiper2)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.word-modal-box {
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
  .words-content {
    width: 470px;
  }
  .word-box-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // min-height: 260px;
    // max-height: 600px;
    background: #fff;
    box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
    border-radius:8px;
    .close-img-box {
      position: absolute;
      top: -30px;
      right: -30px;
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
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
