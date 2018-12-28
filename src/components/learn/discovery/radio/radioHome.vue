<template>
  <div class="radio-wrap">
    <div class="radio-swiper">轮播图</div>
    <div class="radio-container">
      <div class="radio-title">电台课程</div>
      <div class="radio-menu">
        <div class="radio-menu-item" v-for="(item, index) in menus" :key="item.menu_id">
          <span v-text="item.menu_title" @click="goRadioList(item)"></span>
          <span v-show="!((index === menus.length - 1) || (index === 10))"></span>
        </div>
      </div>
      <div class="radio-type" v-for="(item, index) in menuRadios" :key="index">
        <div class="radio-type-top">
          <span></span>
          <span v-text="item.menu_title"></span>
          <span @click="goRadioList(item)">更多<i></i></span>
        </div>
        <div class="radio-list">
          <div class="radio-item" v-for="radio in item.radios.slice(0, 5)" :key="radio.code">
            <a @mouseenter="radioMouseEnter($event)" @mouseleave="radioMouseLeave($event)">
              <img v-lazy="radio.cover" :key="radio.cover" alt="">
              <div class="gradient-layer-play" @click="loadRadioList($event, radio)" style="display: none">
                <i class="play"></i>
              </div>
              <div class="subscribe">
                <i></i>
                <span v-text="radio.buy_num"></span>
              </div>
            </a>
            <router-link tag="div" class="title" :to="{path: '/app/discovery/radio-detail/' + radio.code}" v-text="radio.title"></router-link>
            <div class="author" v-text="radio.author_name ? radio.author_name : '用户' + radio.talkmate_id"></div>
            <div class="money" v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Bus from '../../../../bus'
import $ from 'jquery'

export default {
  data () {
    return {
      menus: [],
      menuRadios: []
    }
  },
  mounted () {
    this.postDisvRadio().then((res) => {
      console.log('电台首页', res)
      this.menus = res.data.menuInfos
      this.menuRadios = res.data.menuRadios
    })
  },
  methods: {
    ...mapActions({
      postDisvRadio: 'course/postDisvRadio'
    }),
    loadRadioList (e, radio) {
      if (this.isPlay && radio.code === this.lastCode) {
        $('.gradient-layer-play i').removeClass('pause')
        $(e.target).addClass('play')
        Bus.$emit('radioPause')
      } else {
        $('.gradient-layer-play i').removeClass('pause')
        $('.gradient-layer-play i').addClass('play')
        $(e.target).removeClass('play')
        $(e.target).addClass('pause')
        $('.gradient-layer-play').not($(e.target).parent()).hide()
        if (radio.code !== this.lastCode) {
          Bus.$emit('getRadioCardList', radio)
          this.lastCode = radio.code
        } else {
          Bus.$emit('radioPlay')
        }
      }
      this.isPlay = !this.isPlay
    },
    radioMouseEnter (e) {
      $('.gradient-layer-play', $(e.target)).show()
    },
    radioMouseLeave (e) {
      if ($('.gradient-layer-play i', $(e.target)).hasClass('play')) {
        $('.gradient-layer-play', $(e.target)).hide()
      }
    },
    // 查看更多
    goRadioList (item) {
      console.log('跳转之前item', item)
      let obj = {
        'item': item
      }
      let jsonStr = JSON.stringify(obj)
      sessionStorage.setItem('itemInfo', jsonStr)
      this.$router.push({path: '/app/discovery/radio-list'})
    }
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
  cursor: pointer;
  margin-right: 15px;
}
.radio-container .radio-menu .radio-menu-item span:hover {
  color: #2A9FE4;
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
  cursor: pointer;
  float:right;
  color: #b8b8b8;
  font-size: 15px;
}
.radio-type .radio-type-top span:last-child:hover {
  color: #2A9FE4;
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
  /* float: left; */
  width: 100%
}

.radio-type .radio-list .radio-item {
  /* float: left; */
  display: inline-block;
  margin-top: 20px;
  margin-right: 15px;
  width: 152px;
  height: 159px;
  background-color: #ffffff;
  cursor: pointer;
}
.radio-item .gradient-layer-play {
  width: 152px;
  height: 80px;
  position: absolute;
  background-image: url('../../../../../static/images/discovery/radio-gradient-layer.png');
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: -80px;
  text-align:  center;
  z-index: 2;
}

.radio-item .gradient-layer-play .play {
  width: 52px;
  height: 52px;
  background-image: url('../../../../../static/images/discovery/radio-list-play.svg');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 16px;
}

.radio-item .gradient-layer-play .pause {
  width: 52px;
  height: 52px;
  background-image: url('../../../../../static/images/discovery/radio-list-pause.svg');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 16px;
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
  width: 70px;
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
