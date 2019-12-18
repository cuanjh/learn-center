<template>
  <div class="guide-overlay" v-show="isShow" @click="close">
    <div class="cursor" :style="{left: left - 2 + 'px', top: top + 50 + 'px'}"></div>
    <div class="cursor-desc" :style="{left: left - 270 + 'px', top: top + 92 + 'px'}">点击这里查看会员评分详情</div>
  </div>
</template>

<script>
import bus from '../../../../bus'
export default {
  data () {
    return {
      isShow: false,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      eleObj: null
    }
  },
  created () {
    bus.$on('kidGuideShow3', (ele) => {
      this.eleObj = ele
      this.left = ele.offset().left - 10
      this.top = ele.offset().top - 5
      this.width = ele.width() + 20
      this.height = ele.height() + 10
      this.isShow = true
      console.log(ele)
      console.log(ele.html())
    })
  },
  methods: {
    close () {
      this.isShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.guide-overlay {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  // opacity: 0.8;
  box-sizing: content-box;
  z-index: 999999;
  background-color: rgba(0, 0, 0, .5);
  background: -moz-radial-gradient(center,ellipse cover,rgba(0,0,0,0.4) 0,rgba(0,0,0,0.9) 100%);
  background: -webkit-gradient(radial,center center,0px,center center,100%,color-stop(0%,rgba(0,0,0,0.4)),color-stop(100%,rgba(0,0,0,0.9)));
  background: -webkit-radial-gradient(center,ellipse cover,rgba(0,0,0,0.4) 0,rgba(0,0,0,0.9) 100%);
  background: -o-radial-gradient(center,ellipse cover,rgba(0,0,0,0.4) 0,rgba(0,0,0,0.9) 100%);
  background: -ms-radial-gradient(center,ellipse cover,rgba(0,0,0,0.4) 0,rgba(0,0,0,0.9) 100%);
  background: radial-gradient(center,ellipse cover,rgba(0,0,0,0.4) 0,rgba(0,0,0,0.9) 100%);
  filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr='#66000000',endColorstr='#e6000000',GradientType=1)";
  -ms-filter: "alpha(opacity=50)";
  filter: alpha(opacity=50);
  -webkit-transition: all .3s ease-out;
  -moz-transition: all .3s ease-out;
  -ms-transition: all .3s ease-out;
  -o-transition: all .3s ease-out;
  transition: all .3s ease-out;
}

.cursor {
  position: absolute;
  width: 45px;
  height: 60px;
  background-image: url('../../../../../static/images/kid/hand-right-up.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.cursor-desc {
  position: absolute;
  font-size: 22px;
  font-weight: 500;
  color: #fff;
}
</style>
