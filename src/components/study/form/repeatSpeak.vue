<template>
  <div class="form">
    <div class="img-wrap">
      <next-comp @next="next"/>
      <img :src="form.image" alt="">
      <transition name="fade" mode="out-in">
        <record-comp ref="recordItem" v-show="isShow" :sentence="form.sentence" :code="form.code"/>
      </transition>
    </div>
    <div class="content">
      <span class="text">{{ form.sentence }}</span>
      <trumpet-comp ref="trumpet" :sound="form.sound" />
    </div>
  </div>
</template>

<script>
import TrumpetComp from '../common/trumpet'
import RecordComp from '../common/record'
import nextComp from '../common/next'
import bus from '../../../bus'

export default {
  props: ['form'],
  data () {
    return {
      isShow: false
    }
  },
  components: {
    TrumpetComp,
    RecordComp,
    nextComp
  },
  created () {
    this.$on('break', () => {
      this.reset()
      this.$refs['trumpet'].$emit('break')
    })

    this.$on('init', () => {
      console.log('repeatSpeak init')
      this.$refs['trumpet'].$emit('init', false, () => {
        this.isShow = true
      })
      this.$refs.recordItem.closeRecord()
    })
  },
  methods: {
    reset () {
      this.isShow = false
    },
    next () {
      this.$parent.$emit('nextForm')
      bus.$emit('setStudyFormScore', {formCode: this.form.code, score: 1})
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active {
  animation: fade-in .5s;
}
.fade-leave-active {
  animation: fade-in .1s reverse;
}
@keyframes fade-in {
  0% {
    transform: translateY(0);
    -webkit-transform: translateY(0);
    -o-transform: translateY(0);
    -moz-transform: translateY(0);
  }
  100% {
    transform: translateY(-150px);
    -webkit-transform: translateY(-150px);
    -o-transform: translateY(-150px);
    -moz-transform: translateY(-150px);
  }
}
</style>
