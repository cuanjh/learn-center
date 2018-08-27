<template>
  <div>
    <transition name="fade">
      <b class="slow-arrow" @click="showSlow" v-show="selected&&repeat"></b>
    </transition>
    <transition name="fadeinT">
      <div class="slow-play" @click="play" v-if="show"  v-show="selected"></div>
    </transition>
  </div>
</template>

<script>

import $ from 'jquery'
import SoundCtrl from '../../../plugins/soundCtrl'
export default {
  props: ['source', 'selected', 'repeat'],
  name: 'speak-slow',
  data () {
    return {
      sound: {
        src: ''
      },
      show: false
    }
  },
  created () {
    this.$on('other-click', (target) => {
      if ($(target).hasClass('slow-arrow')) return
      this.show = false
    })
  },
  mounted () {
    console.log(this.selected)
    console.log(this.repeat)
    this.transform()
  },
  watch: {
    source () {
      this.transform()
    }
  },
  methods: {
    transform () {
      this.sound.src = this.source.replace('.mp3', '') + '_0_75.mp3'
    },
    play () {
      this.$dispatch('stop-sound')
      SoundCtrl.stop()
      SoundCtrl.setSnd(this.sound)
      SoundCtrl.play()
      this.$dispatch('stop-record-play')
    },
    showSlow () {
      this.show = !this.show
    }
  }
}
</script>

<style lang="less" scoped>
.slow-arrow {
  position: absolute;
  background: url(../../../../static/images/learnSystem/button.png);
  display: block;
  width: 24px;
  height: 8px;
  right: 9px;
  top: 47px;
  cursor: pointer;
  &:hover {
    background: url(../../../../static/images/learnSystem/button_hover.png);
  }
}

.slow-play {
  background: #fff url(../../../../static/images/learnSystem/mansu.png) center
    center no-repeat;
  width: 27px;
  height: 20px;
  padding: 7px 8px;
  box-shadow: 0 0 6px rgba(19, 19, 19, 0.39);
  border-radius: 5px;
  top: 60px;
  position: absolute;
  cursor: pointer;
  right: 0;
  animation: 0.3s ease-out backwards;
  z-index: 11;
  &:hover {
    background: #fff url(../../../../static/images/learnSystem/mansu_hover.png)
      center center no-repeat;
  }
}

.fadeinT-enter {
  animation-name: fadeinT;
}

.fadeinT-leave {
  animation-name: fadeoutT;
}

@keyframes fadeinT {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.1);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeoutT {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px) scale(0.1);
  }
}
</style>
