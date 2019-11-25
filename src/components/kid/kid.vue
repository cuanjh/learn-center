<template>
  <transition name="fade" mode="out-in">
    <router-view v-if="isRouterAlive"></router-view>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      isRouterAlive: true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}

.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
