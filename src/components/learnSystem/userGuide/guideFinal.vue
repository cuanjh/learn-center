<template>
  <div class="module-final guide-body" :class="{finani:ani}">
    <section class="guide-container">
      <p class="con">{{ $t('guide.con') }}</p>
      <p class="go-desc">{{ $t('guide.go-desc') }}</p>
      <a href="javascript:;" class="start" @click="start">{{ $t('guide.start') }}</a>
    </section>
    <div class="final-bg"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ani: ''
    }
  },
  methods: {
    start () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.module-final {
  z-index: 92;
  padding: 0;
  background: url("../../../../static/images/user-guide/end_picture.png") 0 0 no-repeat;
  height: 555px;
  width: 794px;
  background-size: 100% 100%;
  .con {
    margin-top: 80px;
    color: #55a4fc;
    font-size: 20px;
    text-align: center;
  }
  .go-desc {
    color: #55a4fc;
    font-size: 26px;
    text-align: center;
    margin-top: 24px;
  }
  .start {
    width: 123px;
    height: 35px;
    line-height: 35px;
    margin: 0 auto;
    margin-top: 52px;
    background-color: #f4b401;
    border-radius: 3px;
    display: block;
    color: #fff;
    font-size: 16px;
    text-align: center;
    &:hover {
      background-color: #ffc33e;
    }
    &:active {
      background: -webkit-linear-gradient(90deg, #ffc33e 0%, #ebaa08 100%);
      background: -moz-linear-gradient(90deg, #ffc33e 0%, #ebaa08 100%);
      background: -o-linear-gradient(90deg, #ffc33e 0%, #ebaa08 100%);
      background: -ms-linear-gradient(90deg, #ffc33e 0%, #ebaa08 100%);
      background: linear-gradient(0deg, #ffc33e 0%, #ebaa08 100%);
    }
  }
}
</style>
