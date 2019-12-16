<template>
<transition name="fade">
  <div class="sentence-modal-box" v-show="showWordBox">
    <div class="sentence-box-content">
      <div class="close-img-box" @click="closeModal()"></div>
      <div class="sentence-content" >
        <p class="title">
          <i></i>
          <span>智能小e可以准确识别你的跟读发音哦</span>
        </p>
        <div class="sentence">
          <h2>原句: </h2>
          <p class="original-sentence" v-html="originSentence"></p>
        </div>
        <div class="sentence">
          <h2>你的跟读: </h2>
          <p class="to-read" :class="{'red' : !resultSentence}" v-text="resultSentence ? resultSentence : 'No record!'"></p>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import bus from '../../../bus'

export default {
  data () {
    return {
      showWordBox: false,
      originSentence: '',
      resultSentence: ''
    }
  },
  created () {
    bus.$on('showIatSentenceBox', (params) => {
      this.originSentence = params.originSentence
      this.resultSentence = params.resultSentence
      this.showWordBox = true
    })
  },
  methods: {
    closeModal () {
      this.showWordBox = false
    }
  }
}
</script>

<style lang="less" scoped>
.sentence-modal-box {
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
  .sentence-content {
    width: 470px;
    min-height: 300px;
    max-height: 600px;
    padding: 20px 32px;
    overflow-y: auto;
    i {
      display: block;
      width: 48px;
      height: 49px;
      background-image: url('../../../../static/images/common/icon-aie.png');
      background-repeat: no-repeat;
      background-size: cover;
      margin: 0 auto 10px;
    }
    .title {
      font-size:16px;
      font-weight:400;
      color:rgba(145,145,145,1);
      line-height:17px;
      text-align: center;
    }
  }
  .sentence-box-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
    border-radius:8px;
    .original-sentence {
      font-size: 20px;
      font-weight: 500;
      color: #000000;
    }
  }
  .close-img-box {
    position: absolute;
    top: -44px;
    right: 0px;
    width: 30px;
    height: 30px;
    background: url('../../../../static/images/kid/icon-close.png') no-repeat center;
    background-size: cover;
    cursor: pointer;
    &:hover {
      opacity: .8;
    }
  }
  .sentence {
    margin-bottom: 30px;
    h2 {
      margin-top: 20px;
      font-size:16px;
      font-weight:400;
      color:rgba(117,115,115,1);
      line-height:21px;
      margin-bottom: 20px;
    }
    .to-read{
      font-size: 20px;
      font-weight: 500;
      color: #000000;
      &.red {
        color: #FF3B30;
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
