<template>
  <div class="radio-wrap">
    <div class="radio-swiper">轮播图</div>
    <div class="radio-container">
      <div class="radio-title">电台课程</div>
      <div class="radio-menu">
        <div class="radio-menu-item" v-for="(item, index) in menus" :key="item.menu_id">
          <span v-text="item.menu_title"></span>
          <span v-show="!((index === menus.length - 1) || (index === 10))"></span>
        </div>
      </div>
      <div class="radio-type" v-for="(item, index) in menuRadios" :key="index">
        <div class="radio-type-top">
          <span></span>
          <span v-text="item.menu_title"></span>
          <span>更多<i></i></span>
        </div>
        <div class="radio-list">
          <router-link tag="div" :to="{path: '/app/radio-detail/' + radio.code}" class="radio-item" v-for="radio in item.radios.slice(0, 5)" :key="radio.code">
            <img :src="radio.cover" alt="">
            <div class="subscribe">
              <i></i>
              <span v-text="radio.buy_num"></span>
            </div>
            <div class="title" v-text="radio.title"></div>
            <div class="author" v-text="radio.author_name ? radio.author_name : '用户' + radio.talkmate_id"></div>
            <div class="money" v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      menus: [],
      menuRadios: []
    }
  },
  mounted () {
    this.postDisvRadio().then((res) => {
      console.log(res)
      this.menus = res.data.menuInfos
      this.menuRadios = res.data.menuRadios
    })
  },
  methods: {
    ...mapActions({
      postDisvRadio: 'course/postDisvRadio'
    })
  }
}
</script>

<style scoped>
.radio-wrap {
  background: #ecf4f7;
  width: 100%;
  min-height: 1000px;
}

.radio-swiper {
  background-color: azure;
  height: 340px;
}

.radio-container {
  width: 1200px;
  margin: 0 auto 100px;
}

.radio-container .radio-title {
  color: #444444;
  font-size: 24px;
  font-weight: bold;
  margin-top: 40px;
  margin-left: 20px;
}

.radio-container .radio-menu {
  width: 100%;
  height: 141px;
  background-color: #ffffff;
  margin-top: 30px;
  padding: 30px;
  float: left;
}

.radio-container .radio-menu .radio-menu-item {
  float: left;
  color: #4A4A4A;
  font-size: 16px;
  line-height: 40px;
}

.radio-container .radio-menu .radio-menu-item span {
  margin-right: 15px;
}
.radio-container .radio-menu .radio-menu-item span:last-child {
  display: inline-block;
  margin-top: 15px;
  background-color: #eaeaea;
  height: 11px;
  width: 1px
}

.radio-container .radio-type {
  width: 880px;
  height: 260px;
  background-color: #ffffff;
  border-radius: 3px;
  display: inline-block;
  margin-top: 20px;
  padding: 15px 20px;
}
.radio-type .radio-type-top {
  width: 100%;
  border-bottom: 1px solid #EAEAEA;
  height: 40px;
}
.radio-type .radio-type-top span:first-child{
  background-color: #2A9FE4;
  width: 6px;
  height: 20px;
  display: inline-block;
  border-radius: 4px;
  margin-top: 2px;
}

.radio-type .radio-type-top span:nth-child(2){
  color: #444444;
  font-size: 24px;
  margin-left: 10px;
}

.radio-type .radio-type-top span:last-child{
  float:right;
  color: #b8b8b8;
  font-size: 15px;
}

.radio-type .radio-type-top span:last-child i{
  width: 7px;
  height: 11px;
  background-image: url('../../../../../static/images/discovery/radio-more.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 7px;
  margin-left: 5px;
}

.radio-type .radio-list {
  float: left;
  width: 100%
}

.radio-type .radio-list .radio-item {
  float: left;
  margin-top: 20px;
  margin-right: 15px;
  width: 152px;
  height: 159px;
  background-color: #ffffff;
  cursor: pointer;
}

.radio-type .radio-list .radio-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.radio-item .subscribe {
  position: relative;
  display: -webkit-box;
  margin-top: -25px;
}

.radio-item .subscribe i {
  display: inline-block;
  margin: 0 8px;
  width: 14px;
  height: 14px;
  background-image: url('../../../../../static/images/discovery/home-radio.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.radio-item .subscribe span {
  color: #ffffff;
  font-size: 12px;
  display: inline-block;
  margin-top: -5px;
  margin-left: -3px;
}

.radio-item .title {
  color: #444444;
  font-size: 14px;
  margin-top: 15px;
  height: 41px;
  line-height: 20px;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.radio-item .author {
  color: #B8B8B8;
  font-size: 12px;
  display: inline-block;
  position: relative;
  margin-top: 10px;
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.radio-item .money {
  color: #B8B8B8;
  font-size: 12px;
  float: right;
  /* display: inline-block; */
  position: relative;
  margin-top: 10px;
}

</style>
