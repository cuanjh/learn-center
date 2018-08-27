<template>
  <div class="module-guide-bottom clearfix">
    <a href="javascript:;" class="skip-guide" @click="skip">{{ $t('guide.skip') }}</a>
    <a href="javascript:;" class="next btn" @click="next" :class="{disabled:disabled}">{{ $t('guide.next') }}</a>
  </div>
</template>

<script>
export default {
  props: ['page', 'disabled'],
  methods: {
    skip () {
      this.$router.back()
    },
    next () {
      this.$parent.$emit('changePage', this.page)
    }
  }
}
</script>

<style lang="less" scoped>
.module-guide-bottom {
  .skip-guide {
    color: #9196b4;
    font-size: 14px;
    float: left;
    height: 35px;
    line-height: 34px;
    &:hover {
      color: #55a4fc;
    }
  }
  .next {
    width: 123px;
    height: 35px;
  }
  .disabled {
    background-color: #dfe2ed;
    &:hover {
      background-color: #dfe2ed;
    }
    &:active {
      background: none;
      background-color: #dfe2ed;
    }
  }
  .btn {
    width: 123px;
    height: 35px;
    line-height: 34px;
    color: #fff;
    font-size: 16px;
    border-radius: 3px;
    background-color: #55a4fc;
    float: right;
    text-align: center;
    text-decoration: none;
    &:hover {
      background-color: #59b3ff;
    }
    &:active {
      background: -webkit-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: -moz-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: -o-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: -ms-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: linear-gradient(0deg, #59b3ff 0%, #4e9ff6 100%);
    }
  }
}
</style>
