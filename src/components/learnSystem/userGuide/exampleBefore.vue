<template>
  <div class="module-example guide-body" :class="{examani:ani}">
    <guide-header :title="'beforeTitle'" />
    <section class="guide-container">
      <p class="desc">{{ $t('guide.beforeDesc') }}</p>
      <div class="illustration"></div>
    </section>
    <guide-bottom :page="'example'"></guide-bottom>
  </div>
</template>

<script>
import GuideHeader from './guideHeader.vue'
import GuideBottom from './guideBottom.vue'
export default {
  data () {
    return {
      ani: ''
    }
  },
  components: {
    GuideHeader,
    GuideBottom
  },
  created () {
    this.$on('changePage', (page) => {
      if (page === 'example') {
        this.$data.ani = 'ani'
      }
      this.$parent.$emit('changePage', page)
    })
  }
}
</script>

<style lang="less" scoped>
.module-example {
  z-index: 97;
  .desc {
    color: #333333;
    font-size: 16px;
    line-height: 24px;
    margin-top: 40px;
  }
  .illustration {
    background: url("../../../../static/images/user-guide/example-before.png") 0 0
      no-repeat;
    width: 414px;
    height: 189px;
    margin: 65px auto;
    margin-bottom: 68px;
  }
}
</style>
