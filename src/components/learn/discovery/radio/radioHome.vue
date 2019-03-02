<template>
  <div class="radio-wrap">
    <div class="nav">
      <router-link :to="{path: '/app/index'}">
        <span>我的学习账户</span>
      </router-link>
      >
      <div class="nav-current">
        电台
      </div>
    </div>
    <div class="radio-swiper">
      <div class="left">
        <div class="swiper-container">
          <div id="swiper-wrapper" class="swiper-wrapper">
            <div id="swiper-slide" class="swiper-slide" v-for="(item, index) in banners" :key="index" @click="get(item.code)">
              <img class="wheeling_img" :src="item.cover" alt="">
              <div class="news_item_right_swipper" v-show="false">
                <div class="news_item_right1">
                  <span class="news_item_title">{{item.title}}</span>
                </div>
                <div class="news_item_right2">
                  <span class="news_item_type">{{item.author_name}}</span>
                  <span class="reading">阅读&nbsp;{{item.play_count}}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 分页器 -->
          <div id="swiper-pagination" class="swiper-pagination"></div>
          <!-- 导航按钮 -->
          <!-- <div id="swiper-button-prev" class="swiper-button-prev"></div>
          <div id="swiper-button-next" class="swiper-button-next"></div> -->
        </div>
      </div>
      <div class="right">
        <div class="name">
          <span>分类 / </span>
          <span @click="lookMoreRadioList(menus[0])" class="more">更多</span>
        </div>
        <ul>
          <li v-for="item in menus" :key="item.menu_id">
            <a v-text="item.menu_title" @click="goRadioList(item)"></a>
          </li>
        </ul>
      </div>
    </div>
    <div class="radio-recommend">
      <div class="left">
        <div class="recommend-list">
          <a @click="goRecommendRadio('hostRadio')" class="recommend-item"><i></i><span>热播电台</span></a>
          <a @click="goRecommendRadio('learnRecom')" class="recommend-item"><i></i><span>学习推荐</span></a>
          <a @click="goRecommendRadio('latestRelease')" class="recommend-item"><i></i><span>最新发布</span></a>
          <router-link :to="{path: 'radio-recom-teachers'}" class="recommend-item"><i></i><span>明星主播</span></router-link>
        </div>
        <!-- 根据学习课程推荐的电台 -->
        <get-random-radio :randomRadio="randomRadio" v-if="flag"></get-random-radio>
        <!-- 推荐的老师 -->
        <recommend-teachers :authors="authors"></recommend-teachers>
      </div>
      <div class="right">
        <!-- 用户信息 -->
        <user-box v-show="userInfo"></user-box>
        <introduce-app-box></introduce-app-box>
      </div>
    </div>
    <div class="radio-container">
      <div class="radio-title" v-show="false">电台课程</div>
      <div class="radio-menu" v-show="false">
        <div class="radio-menu-item" v-for="(item, index) in menus" :key="item.menu_id">
          <span v-text="item.menu_title" @click="goRadioList(item)"></span>
          <span v-show="!((index === menus.length - 1) || (index === 10))"></span>
        </div>
      </div>
      <div v-if="menuRadios">
        <div class="radio-type">
          <div class="radio-type-top">
            <span></span>
            <span v-text="recomendRadios.menu_title"></span>
            <span @click="goRadioList(item)" v-show="false">更多<i></i></span>
          </div>
          <div class="radio-list">
            <div class="radio-item" v-for="radio in recomendRadiosList" :key="radio.code">
              <div class="play-radio">
                <img v-lazy="radio.cover" :key="radio.cover" alt="">
                <!-- <div class="free-vip" v-if="radio.free_for_member === true || radio.free_for_member === 1">
                  <span>会员免费</span>
                </div> -->
                <router-link tag="div" :to="{path: '/app/discovery/radio-detail/' + radio.code}" class="mask"></router-link>
                <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                  <i class="play"></i>
                </div>
                <div class="subscribe">
                  <i></i>
                  <span v-text="radio.buy_num"></span>
                </div>
              </div>
              <router-link class="title" :to="{path: '/app/discovery/radio-detail/' + radio.code}" v-text="radio.title"></router-link>
              <div class="author" v-text="radio.author_name ? radio.author_name : '用户' + radio.talkmate_id"></div>
              <div class="money" v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></div>
            </div>
          </div>
          <div class="radio-type-bottom">
            <a @click="changeBatch()">
              <i></i>换一批
            </a>
          </div>
        </div>
        <div class="radio-type" v-for="(item, index) in menuRadios.slice(1, 4)" :key="index">
          <div class="radio-type-top">
            <span></span>
            <span v-text="item.menu_title"></span>
            <a @click="goRadioList(item)">更多<i></i></a>
          </div>
          <div class="radio-list" v-if="item.radios">
            <div class="radio-item" v-for="radio in item.radios.slice(0, 5)" :key="radio.code">
              <div class="play-radio">
                <img v-lazy="radio.cover" :key="radio.cover" alt="">
                <router-link tag="div" :to="{path: '/app/discovery/radio-detail/' + radio.code}" class="mask"></router-link>
                <!-- <div class="free-vip" v-if="radio.free_for_member === true || radio.free_for_member === 1">
                  <span>会员免费</span>
                </div> -->
                <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                  <i class="play"></i>
                </div>
                <div class="subscribe">
                  <i></i>
                  <span v-text="radio.buy_num"></span>
                </div>
              </div>
              <router-link class="title" :to="{path: '/app/discovery/radio-detail/' + radio.code}" v-text="radio.title"></router-link>
              <div class="author" v-text="radio.author_name ? radio.author_name : '用户' + radio.talkmate_id"></div>
              <div class="money" v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 人气电台推荐 -->
      <div class="moods-radios">
        <div class="recommend-radios"><span>人气电台推荐</span></div>
        <div class="moods-lists">
          <ul>
            <li v-for="(item, index) in hotRadiosList.slice(0, 9)" :key="index">
              <div class="moods-item">
                <router-link :to="{path: '/app/discovery/radio-detail/' + item.code}">{{item.title}}</router-link>
                <p>订阅量 {{item.buy_num}}次</p>
              </div>
              <div class="gradient-layer-play" @click="loadRadioList($event, item)">
                <i class="play"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Bus from '../../../../bus'
import $ from 'jquery'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import UserBox from '../../../common/userBox.vue'
import IntroduceAppBox from '../../../common/introduceAppBox.vue'
import RecommendTeachers from '../../../common/recommendTeachers.vue'
import GetRandomRadio from '../../../common/getRandomRadio.vue'

export default {
  data () {
    return {
      flag: false,
      banners: [],
      menus: [],
      authors: [],
      // startAuthorsIndex: 0,
      menuRadios: [],
      recomendRadios: {}, // 推荐电台
      recomendRadiosList: [],
      randomRadio: {}, // 随机推荐电台
      hotRadiosList: [] // 热门电台
    }
  },
  components: {
    UserBox,
    GetRandomRadio,
    IntroduceAppBox,
    RecommendTeachers
  },
  mounted () {
    let _this = this
    _this.postDisvRadio().then((res) => {
      console.log('电台首页', res)
      _this.banners = res.data.banners
      _this.menus = res.data.menuRadios
      _this.authors = res.data.authors
      _this.menuRadios = res.data.menuRadios
      _this.recomendRadios = res.data.menuRadios[0]
      _this.recomendRadiosList = res.data.menuRadios[0].radios.slice(0, 5)
      console.log('this.recomendRadiosList', _this.recomendRadiosList)
      console.log('老师', this.authors)
      _this.swiperInit()
    })
    // 随机推荐单个电台
    _this.getRandomRadio().then(res => {
      console.log('随机推荐单个电台', res)
      _this.randomRadio = res.data
      this.flag = true
    })
    // 热门电台
    _this.getHotRadios({limit: 10}).then(res => {
      console.log('热门电台', res)
      _this.hotRadiosList = res.radios
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    authorList () {
      console.log(this.startAuthorsIndex)
      console.log(this.authors.slice(this.startAuthorsIndex, 5))
      return this.authors.slice(this.startAuthorsIndex, 5)
    }
  },
  methods: {
    ...mapActions({
      postDisvRadio: 'course/postDisvRadio',
      getRandomRadio: 'getRandomRadio', // 随机推荐单个电台
      getHotRadios: 'getHotRadios' // 热门电台
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
        if (radio.code !== this.lastCode) {
          Bus.$emit('getRadioCardList', radio)
          this.lastCode = radio.code
        } else {
          Bus.$emit('radioPlay')
        }
      }
      this.isPlay = !this.isPlay
    },
    // 查看更多
    goRadioList (item) {
      console.log('跳转之前item', item)
      this.$router.push({name: 'radioList', params: { itemId: item.list_order }})
    },
    // 点击更多
    lookMoreRadioList () {
      this.$router.push({name: 'radioList', params: { itemId: 410 }})
    },
    swiperInit () {
      this.$nextTick(() => {
        /* eslint-disable no-new */
        new Swiper('.swiper-container', {
          loop: true,
          initialSlide: 0,
          observer: true, // 修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, // 修改swiper的父元素时，自动初始化swiper
          notNextTick: true,
          // speed: 1000,
          autoplayStopOnLast: true,
          autoplay: {
            delay: 3000, // 3秒切换一次
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          paginationClickable: true,
          mousewheelControl: true,
          // navigation: {
          //   nextEl: '.swiper-button-next',
          //   prevEl: '.swiper-button-prev'
          // },
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        })
      })
    },
    // 跳转详情页面
    get (code) {
      this.$router.push({
        path: `/app/discovery/radio-detail/${code}`
      })
    },
    // 最新推荐等四个页面
    goRecommendRadio (navNum) {
      console.log(navNum)
      this.$router.push({name: 'radioClassify', params: { isActive: navNum }})
      // this.$router.push({path: 'radio-classify'})
    },
    // 点击换一批
    changeBatch () {
      this.recomendRadiosList = this.randArray(this.recomendRadiosList)
    },
    // 数组随机排序函数
    randArray (data) {
      /* eslint-disable */
      // 获取数组长度
      var arrLen = data.length
      // 创建数组 存放下标数
      var try1 = new Array()
      for (var i = 0; i < arrLen; i++) {
        try1[i] = i
      }
      // 创建数组 生成随机下标数
      var try2 = new Array()
      for (var j = 0 ; j < arrLen ; j++) {
        try2[j] = try1.splice(Math.floor(Math.random() * try1.length), 1)
      }
      // 创建数组，生成对应随机下标数的数组
      var try3 = new Array()
      for (var x = 0; x < arrLen; x++) {
        try3[x] = data[ try2[x] ]
      }
      return try3
       /* eslint-disable */
    }
  }
}
</script>

<style lang="less" scoped>
.radio-wrap {
  width: 1200px;
  margin: 0 auto;
  min-height: 1000px;
  .nav {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
    a {
      span {
        color: #999999;
        &:hover{
          color: #2A9FE4;
        }
      }
    }
    .nav-current {
      display: inline-block;
      color: #2A9FE4;
    }
  }
  .radio-swiper {
    margin: 0px auto 16px;
    height: 300px;
    .left {
      float: left;
      margin-right: 23px;
      .swiper-container {
        width: 880px;
        height: 300px;
        background-color: #B2C0C9;
        border-radius: 5px;
        #swiper-button-prev {
          background-image: url('../../../../../static/images/headline/left.png');
          left: 0;
          width: 40px;
          height: 63px;
          background-color: rgba(0, 0, 0, .3);
        }
        #swiper-button-next {
          background-image: url('../../../../../static/images/headline/right.png');
          right: 0;
          width: 40px;
          height: 63px;
          background-color: rgba(0, 0, 0, .3);
        }
        #swiper-pagination {
          #swiper-pagination-bullet {
            width: 10px !important;
            height: 10px !important;
            transition: width 0.3s ease-in-out !important;
          }
          #swiper-pagination-bullet-active {
            width: 18px !important;
            border-radius: 8px !important;
          }
        }
        .swiper-pagination {
          position: absolute;
          bottom: 0;
          text-align: right;
          padding-right: 46px;
        }
        #swiper-pagination {
          .swiper-pagination-bullet {
            width: 20px !important;
            height: 20px !important;
          }
        }
      }
    }
    .right {
      display: inline-block;
      width: 280px;
      height: 276px;
      overflow: hidden;
      .name {
        font-size: 20px;
        font-weight: 600;
        color: #4a4a4a;
        line-height: 28px;
        .more {
          cursor: pointer;
          font-size: 16px;
          color: #2a9fe4;
        }
      }
      ul {
        width: 100%;
        height: 100%;
        margin-top: 10px;
        li {
          display: inline-flex;
          background-color: #fff;
          border-radius: 4px;
          padding: 7px 21px;
          margin-top: 12px;
          margin-right: 11px;
          a {
            cursor: pointer;
            font-size: 14px;
            color: #4a4a4a;
            font-weight: 400;
            &:hover {
              color: #2A9FE4;
            }
          }
        }
      }
    }
  }
  .radio-recommend {
    display: inline-block;
    .left{
      float: left;
      background-color: #fff;
      .recommend-list {
        font-size: 0;
        display: flex;
        .recommend-item {
          display: flex;
          justify-content: center;
          width: 219px;
          background-color: #0a2b40;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          padding: 17px 0;
          margin-right: 1px;
          line-height: 33px;
          border-top: 3px solid #2A9FE4FF;
          i {
            display: inline-block;
            background-repeat: no-repeat;
            background-position:center;
            background-size: cover;
            width: 28px;
            height: 30px;
            margin-right: 13px;
          }
        }
        .recommend-item:nth-child(1) {
          i {
            background-image: url('../../../../../static/images/hotradio.svg');
          }
          &:hover {
            cursor: pointer;
            color: #2A9FE4FF;
            i {
              background-image: url('../../../../../static/images/hotradiohover.svg');
            }
          }
        }
        .recommend-item:nth-child(2) {
          i {
            background-image: url('../../../../../static/images/learntuijian.svg');
          }
          &:hover {
            cursor: pointer;
            color: #2A9FE4FF;
            i {
              background-image: url('../../../../../static/images/learntuijianhover.svg');
            }
          }
        }
        .recommend-item:nth-child(3) {
          i {
            background-image: url('../../../../../static/images/latest.svg');
          }
          &:hover {
            cursor: pointer;
            color: #2A9FE4FF;
            i {
              background-image: url('../../../../../static/images/latesthover.svg');
            }
          }
        }
        .recommend-item:nth-child(4) {
          i {
            background-image: url('../../../../../static/images/star.svg');
          }
          &:hover {
            cursor: pointer;
            color: #2A9FE4FF;
            i {
              background-image: url('../../../../../static/images/starhover.svg');
            }
          }
        }
      }
    }
    // 右边
    .right {
      display: inline-block;
      width: 280px;
      margin-left: 23px;
    }
  }
  .radio-container {
    margin: 0 auto 100px;
    .radio-title {
      color: #444444;
      font-size: 24px;
      font-weight: bold;
      margin-top: 40px;
      margin-left: 20px;
    }
    .radio-menu {
      width: 100%;
      height: 141px;
      background-color: #ffffff;
      margin-top: 30px;
      padding: 30px;
      float: left;
      .radio-menu-item {
        float: left;
        color: #4A4A4A;
        font-size: 16px;
        line-height: 40px;
        span {
          cursor: pointer;
          margin-right: 15px;
          &:last-child {
            display: inline-block;
            margin-top: 15px;
            background-color: #eaeaea;
            height: 11px;
            width: 1px
          }
        }
        &:hover {
          color: #2A9FE4;
        }
      }
    }
    .radio-type {
      position: relative;
      width: 880px;
      // height: 260px;
      background-color: #ffffff;
      border-radius: 3px;
      display: inline-block;
      margin-top: 20px;
      padding: 27px 21px 34px;
      .radio-type-top {
        width: 100%;
        // border-bottom: 1px solid #EAEAEA;
        // height: 40px;
        span {
          &:first-child {
            display: inline-block;
            display: none;
            background-color: #2A9FE4;
            width: 6px;
            height: 20px;
            border-radius: 4px;
          }
          &:nth-child(2) {
            color: #0A2B40FF;
            font-size: 16px;
            font-weight: bold;
            // margin-left: 10px;
            line-height: 20px;
          }
        }
        a {
          float:right;
          color: #b8b8b8;
          font-size: 15px;
          i{
            width: 8px;
            height: 10px;
            background-image: url('../../../../../static/images/more.svg');
            background-repeat: no-repeat;
            background-size: cover;
            display: inline-block;
            margin-top: 5px;
            margin-left: 5px;
          }
          &:hover {
            color: #2A9FE4;
            i {
              background-image: url('../../../../../static/images/morehover.svg');
            }
          }
        }
      }
      .radio-type-bottom {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        a {
          -webkit-user-select:none;
          -moz-user-select:none;
          -ms-user-select:none;
          user-select:none;
          display: flex;
          align-items: center;
          font-size:14px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(126,146,159,1);
          i {
            display: inline-block;
            width: 15px;
            height: 15px;
            background-image: url('../../../../../static/images/learnIndex/icon-change.svg');
            background-repeat: no-repeat;
            background-size: cover;
            display: inline-block;
            margin-right: 10px;
          }
          &:hover {
            color: #2A9FE4FF;
            i {
              background-image: url('../../../../../static/images/learnIndex/icon-change-hover.svg');
            }
          }
        }
      }
      .radio-list {
        width: 100%;
        .radio-item {
          display: inline-block;
          margin-top: 20px;
          margin-right: 15px;
          width: 152px;
          // height: 159px;
          background-color: #ffffff;
          .play-radio {
            position: relative;
            display: block;
            width: 152px;
            height: 80px;
            .mask {
              cursor: pointer;
              width: 100%;
              height: 100%;
              position: absolute;
              bottom: 0;
              background: url('../../../../../static/images/discovery/mask.svg') no-repeat center;
              background-size: cover;
              border-radius: 3px;
            }
          }
          .free-vip {
            display: none;
            position: absolute;
            top: 0;
            display: inline-block;
            font-size: 13px;
            background: rgb(240, 142, 14);
            padding: 2px 8px;
            border-radius: 4px 0 4px 0;
          }
          .gradient-layer-play {
            cursor: pointer;
            width: 24px;
            height: 24px;
            position: absolute;
            // background-image: url('../../../../../static/images/discovery/radio-gradient-layer.png');
            // background-repeat: no-repeat;
            // background-size: cover;
            bottom: 5px;
            right: 8px;
            text-align:  center;
            z-index: 9;
            .play {
              width: 24px;
              height:24px;
              background-image: url('../../../../../static/images/radionoPlay.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
            }
            .pause {
              width: 24px;
              height: 24px;
              background-image: url('../../../../../static/images/radioPlay.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
            }
          }
          img {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
          }
          .subscribe {
            height: 23px;
            position: absolute;
            display: -webkit-box;
            bottom: 0;
            display: flex;
            align-items: center;
            z-index: 9;
            i {
              display: inline-block;
              margin: 0 8px;
              width: 14px;
              height: 9px;
              background-image: url('../../../../../static/images/discovery/home-radio.svg');
              background-repeat: no-repeat;
              background-size: cover;
            }
            span {
              color: #ffffff;
              font-size: 12px;
              display: inline-block;
            }
          }
          .title {
            color: #333333FF;
            font-size: 14px;
            margin-top: 10px;
            // height: 41px;
            line-height: 20px;
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            &:hover {
              color: #2A9FE4;
            }
          }
          .author {
            color: #B8B8B8;
            font-size: 12px;
            position: relative;
            margin-top: 6px;
            width: 90%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 400;
          }
          .money {
            color: #B8B8B8;
            font-size: 12px;
            position: relative;
            margin-top: 4px;
            font-weight: 400;
          }
        }
      }
    }
    // 人气电台推荐
    .moods-radios {
      width: 880px;
      border-radius: 3px;
      display: inline-block;
      margin-top: 20px;
      margin-bottom: 112px;
      .recommend-radios {
        width: 100%;
        padding-bottom: 20px;
        padding: 0 21px 20px;
        span {
          font-size:16px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(10,43,64,1);
          line-height:18px;
        }
      }
      .moods-lists {
        width: 100%;
        ul {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          li {
            width: 32%;
            background: #fff;
            padding: 11px 20px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            .moods-item {
              a {
                font-size:16px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(74,74,74,1);
                line-height:22px;
                &:hover {
                  color: #2A9FE4;
                }
              }
              p {
                font-size:12px;
                color:rgba(153,153,153,1);
                padding-top: 4px;
              }
            }
            .gradient-layer-play {
              cursor: pointer;
              .play {
                width: 24px;
                height:24px;
                background-image: url('../../../../../static/images/hotnoplay.svg');
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
              }
              .pause {
                width: 24px;
                height: 24px;
                background-image: url('../../../../../static/images/hotplay.svg');
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
}

#swiper-slide {
  cursor: pointer;
  .wheeling_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .news_item_right_swipper {
    position: absolute;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    justify-content: space-around;
    .news_item_right1 {
      height: 52px;
      line-height: 52px;
      display: inline-block;
      .news_item_title {
        font-size: 26px;
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
      }
    }
    .news_item_right2 {
      .news_item_type {
        font-size: 20px;
        color: #dddddd;
        margin-right: 38px;
      }
      .reading {
        font-size: 20px;
        color: #dddddd;
      }
    }
  }
}
</style>
