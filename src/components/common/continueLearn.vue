<template>
  <div class="continue-learn" v-show="isShow">
    <p class="animated flipInX">
      <span v-html="tips"></span>
      <i></i>
      <span class="goBackCore" @click="setContinueLearn(false)">继续学习</span>
    </p>
  </div>
</template>

<script>
import bus from '../../bus'
export default {
  data () {
    return {
      tips: '',
      isShow: false
    }
  },
  created () {
    bus.$on('setContinueLearn', (tips) => {
      this.tips = tips
      this.setContinueLearn(true)
    })
  },
  methods: {
    setContinueLearn (flag) {
      this.isShow = flag
    }
  }
}
</script>

<style lang="less" scoped>
  .continue-learn{
    position:fixed;
    width:100%;
    height:100%;
    top:0px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .4);
    z-index:99999999;
    overflow: hidden;
    p{
      width:354px;
      height:250px;
      padding:80px 30px 0px;
      text-align:center;
      font-size:14px;
      color:#4a4a4a;
      word-wrap:break-word;
      word-break:normal;
      background-color:#fff;
      border-radius:4px;
      position:absolute;
      top:0px;
      left:0px;
      right:0px;
      bottom:0px;
      margin:auto;
      i{
        position:absolute;
        width:110px;
        height:110px;
        padding:26px;
        border-radius:55px;
        top:0px;
        left:50%;
        margin-left:-55px;
        margin-top:-55px;
        background:url(../../../static/images/learn/learn-vip-warn.png) #fff center center no-repeat;
        background-size:86%;
      }
    }
    .goBackCore {
      position: absolute;
      left: 50%;
      margin-left: -84px;
      bottom: 30px;
      width: 168px;
      height: 40px;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      border-radius: 20px;
      line-height: 40px;
      text-align: center;
      background-color: #2A9FE4;
    }
  }
</style>
