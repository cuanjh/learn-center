<template>
  <div class="gold-box">
    <i></i>
    <span>{{ totalCoins }}</span>
  </div>
</template>

<script>
export default {
  props: ['totalCoins']
}
</script>

<style lang="less" scoped>
.gold-box{
  display: flex;
  align-items: center;
  i {
    width: 25px;
    height: 30px;
    background-image: url('../../../../static/images/study/icon-gold-bag.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  span {
    margin-left: 8px;
    font-size: 13px;
    font-weight: bold;
    color: #7E929F;
  }
}
</style>
