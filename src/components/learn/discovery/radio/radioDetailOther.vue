<template>
  <div class="radio-content">
    <div class="other-radio">该老师的其他电台</div>
    <router-link tag="div"  class="other-radio-item"
          v-for="(radio, index) in otherRadios.slice(0, 3)" :key="'other-radio' + index"
          :to="{path: '/app/discovery/radio-detail/' + radio.code}"
          >
      <img v-lazy="radio.cover" :key="radio.cover" alt="">
      <div class="subscribe">
        <i></i>
        <span v-text="radio.buy_num"></span>
      </div>
      <div class="title" v-text="radio.module_name"></div>
      <div class="author" v-text="radio.author_info.nickname"></div>
      <div class="money" v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></div>
    </router-link>
    <div class="other-radio-no" v-if="otherRadios.length == 0">
      <span>没有相关的其他电台</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['otherRadios'],
  data () {
    return {
    }
  }
}
</script>
<style scoped>
.radio-content {
  width: 280px;
}

.radio-content .other-radio {
  font-size:16px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(126,146,159,1);
  text-align: left;
}

.radio-content .other-radio-item {
  cursor: pointer;
  width: 100%;
  height: 241px;
  margin-top: 10px;
  background: #ffffff;
  padding: 23px 20px;
  border-radius: 3px;
  /* border-bottom: 1px dotted #8E8E8E; */
}
.radio-content .other-radio-no {
  height: 80px;
  margin-top: 10px;
  background: #ffffff;
  padding: 23px 20px;
}
.radio-content .other-radio-item img {
  width: 100%;
  height: 128px;
  object-fit: cover;
  border-radius: 3px;
}

.other-radio-item .subscribe {
  position: relative;
  display: -webkit-box;
  margin-top: -25px;
}

.other-radio-item .subscribe i {
  display: inline-block;
  margin: 0 8px;
  width: 14px;
  height: 14px;
  background-image: url('../../../../../static/images/discovery/home-radio.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.other-radio-item .subscribe span {
  color: #ffffff;
  font-size: 12px;
  display: inline-block;
  margin-top: -5px;
  margin-left: -3px;
}

.other-radio-item .title {
  font-size:14px;
  font-family:PingFang-SC-Medium;
  font-weight:500;
  color:rgba(68,68,68,1);
  margin-top: 15px;
  line-height: 20px;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.other-radio-item .author {
  font-size:12px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
  display: inline-block;
  position: relative;
  margin-top: 10px;
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.other-radio-item .money {
  font-size:12px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
  float: right;
  /* display: inline-block; */
  position: relative;
  margin-top: 10px;
}
</style>
