<template>
  <div class="module-webcome guide-body" :class="{welani:ani}">
    <guide-header :title="'guide-header'" />
    <section class="guide-container">
      <p class="desc">
        {{ $t('guide.desc') }}
      </p>
      <div class="welcome-img"></div>
    </section>
   <guide-bottom :page="'welcome'"></guide-bottom>
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
      if (page === 'welcome') {
        this.ani = 'ani'
        this.$parent.$emit('playVideo')
      } else {
        this.ani = ''
      }
      return false
    })
  }
}
</script>

<style lang="less" scoped>
.module-webcome {
  z-index: 100;
  transition: transfrom 0.5s;
  .desc {
    color: #333333;
    font-size: 16px;
    line-height: 40px;
    margin-top: 40px;
  }
  .welcome-img {
    background: url("../../../../static/images/user-guide/guide-1.png") 0 0
      no-repeat;
    width: 480px;
    height: 144px;
    margin: 0 auto;
    margin-top: 65px;
    margin-bottom: 82px;
  }
}

.guide-body {
  border: #dde2ee 1px solid;
  background-color: #fff;
  padding: 36px 42px 0 42px;
  position: absolute;
  backface-visibility: hidden;
}
</style>
