<template>
  <div class="gold-animate">
    <audio id="goldAudio" src="../../../../static/sounds/gold.mp3"></audio>
    <div class="gold" :id="'gold' + index" v-for="index in 5" :key="index">
      <i></i>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {}
  },
  methods: {
    show (offset) {
      // 金币音效
      let goldAudio = $('#goldAudio')[0]
      // 金币袋子的位置
      let targetOffest = $('.gold-box').offset()
      // 创建5个金币动画
      for (let i = 1; i <= 5; i++) {
        // 设置金币的起始位置
        let left = offset.left + this.getRndInteger(-10, 10)
        let top = offset.top + this.getRndInteger(-10, 10)
        let goldObj = $('#gold' + i)
        goldObj.css({left: left, top: top})

        goldObj.show()
        // 金币动画按照不同起始位置、不同轨迹、持续时长创建
        goldObj.stop().animate({
          left: targetOffest.left,
          top: targetOffest.top
        }, {
          duration: (500 + (i - 1) * 100),
          specialEasing: {
            left: (i % 2) ? 'linear' : 'swing',
            top: (i % 2) ? 'swing' : 'linear'
          },
          complete: () => {
            // 金币飞入袋子后播放金币音效，并隐藏金币
            goldAudio.play()
            goldObj.hide()
          }
        })
      }
    },
    // 获取一段数字区间的随机数，比如[-10, 10]
    getRndInteger (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  }
}
</script>

<style lang="less" scoped>
.gold {
  position: absolute;
  display: none;
  z-index: 10;
  i {
    width: 20px;
    height: 20px;
    background-image: url('../../../../static/images/study/icon-gold.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
  }
}
</style>
