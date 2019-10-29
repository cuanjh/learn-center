<template>
  <div class="module-canvas" :id="id"></div>
</template>

<script>
import $ from 'jquery'
import common from '../../plugins/common'

export default {
  data () {
    return {
      id: common.createId(),
      container: null
    }
  },
  mounted () {
    this.container = $('#' + this.id)
    this.show()
  },
  methods: {
    // 蒙版定位
    setPos () {
      if (this.container) {
        this.container.width(window.innerWidth + document.body.scrollLeft)
        this.container.height(window.innerHeight + document.body.scrollTop)
      }
    },
    // 摧毁蒙板
    destroy () {
      $(this.container).remove()
    },
    // 显示蒙版
    show () {
      this.setPos()
      this.container.show()
    },
    // 隐藏蒙版
    hide () {
      this.container.hide()
    }
  }
}
</script>

<style lang="less" scoped>
.module-canvas {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 901;
}
</style>
