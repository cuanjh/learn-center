<template>
  <transition name="fade">
    <div class="greenCombo" v-show="isShow" :style="{left: left + 'px', top: top + 'px'}">
      <h1>{{ text }}!</h1>
      <p>Combo X {{ hits }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      text: 'Good',
      hits: 0,
      isShow: false,
      left: 0,
      top: 0
    }
  },
  created () {
    this.$emit('show', (params) => {
      this.show(params)
    })
  },
  methods: {
    show (params) {
      let offset = params.offset
      this.left = offset.left
      this.top = offset.top
      this.hits = params.hits
      switch (true) {
        case this.hits > 5:
          this.text = 'Perfect'
          break
        case this.hits > 10:
          this.text = 'Wonderful'
          break
        default:
          this.text = 'Good'
          break
      }
      this.isShow = true
      setTimeout(() => {
        this.isShow = false
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
.greenCombo {
  position: absolute;
  width: 200px;
  border-radius: 48px;
  background: rgb(20, 235, 13);
  text-align: center;
  padding: 10px 0;
  z-index: 1;
  h1 {
    font-size: 26px;
    font-weight: bold;
    color: #fff;
  }
  p {
    font-size: 20px;
    color: #fff;
    font-weight: 600;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
