<template>
<transition name="fade">
  <div class="word-modal-box" v-show="showWordBox">
    <div class="word-box-content">
      <div class="close-img" @click="closeModal()"></div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  data () {
    return {
      showWordBox: false
    }
  },
  methods: {
    showWordListBox () {
      this.showWordBox = true
    },
    closeModal () {
      this.showWordBox = false
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
  .word-box-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 470px;
    min-height: 260px;
    max-height: 600px;
    background: #fff;
    box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
    border-radius:8px;
    .close-img {
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
