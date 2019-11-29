<template>
  <div class="prompt-box" v-show="isPromptBox">
    <div>
      <span class="content">{{message}}</span>
    </div>
  </div>
</template>

<script>
import bus from '../../../../bus'
export default {
  data () {
    return {
      isPromptBox: false,
      message: ''
    }
  },
  created () {
    bus.$on('show-prompt', (msg) => {
      this.message = msg
      this.isPromptBox = true
      setTimeout(() => {
        this.isPromptBox = false
      }, 3000)
    })
  }
}
</script>

<style lang="less" scoped>
.prompt-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999999;
  div {
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .content {
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
    background: rgba(0, 0, 0, 74);
    line-height:22px;
    padding: 10px 16px;
    border-radius: 4px;
  }
}
</style>
