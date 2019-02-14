<template>
  <div class="radio-wrap">
    <div class="nav">
      <router-link :to="{path: '/app/user/course'}">
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
              <div class="news_item_right_swipper">
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
          <div id="swiper-button-prev" class="swiper-button-prev"></div>
          <div id="swiper-button-next" class="swiper-button-next"></div>
        </div>
      </div>
      <div class="right">
        <div class="name">
          <span>分类 / </span>
          <span class="more">更多</span>
        </div>
        <ul>
          <li v-for="item in menus" :key="item.menu_id">
            <span v-text="item.menu_title" @click="goRadioList(item)"></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="radio-recommend">
      <div class="left">
        <div class="recommend-list">
          <div class="recommend-item"><i></i><span>Special recommendation</span></div>
          <div class="recommend-item"><i></i><span>Language related</span></div>
          <div class="recommend-item"><i></i><span>Newest</span></div>
          <div class="recommend-item"><i></i><span>Star teacher</span></div>
        </div>
        <div class="recommend-radio"></div>
        <div class="recommend-teachers">
          <ul>
            <li v-for="author in this.authors.slice(this.startAuthorsIndex, this.startAuthorsIndex + 5)" :key="author.user_id">
              <img :src="author.photo" alt="">
              <p class="author_name" v-text="author.author_name"></p>
              <p class="title" v-text="'《' + author.title + '》'"></p>
              <p class="button"><span>follow</span></p>
            </li>
          </ul>
          <div class="pre" @click="radioAuthorPre()"><i></i></div>
          <div class="next" @click="radioAuthorNext()"><i></i></div>
        </div>
      </div>
      <div class="right">
        <div class="user-info">
          <div class="content">
            <div class="bg-img"></div>
            <div class="info">
              <div class="user-img">
                <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI" alt="用户头像">
                <p class="name"><span>Type something</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="radio-container">
      <div class="radio-title" v-show="false">电台课程</div>
      <!-- <div class="radio-menu">
        <div class="radio-menu-item" v-for="(item, index) in menus" :key="item.menu_id">
          <span v-text="item.menu_title" @click="goRadioList(item)"></span>
          <span v-show="!((index === menus.length - 1) || (index === 10))"></span>
        </div>
      </div> -->
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
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'

export default {
  data () {
    return {
      banners: [],
      menus: [],
      authors: [],
      startAuthorsIndex: 0,
      menuRadios: []
    }
  },
  mounted () {
    let _this = this
    _this.postDisvRadio().then((res) => {
      console.log('电台首页', res)
      _this.banners = res.data.banners
      _this.menus = res.data.menuInfos.slice(0, 10)
      _this.authors = res.data.authors
      _this.menuRadios = res.data.menuRadios
      _this.swiperInit()
    })
  },
  computed: {
    authorList () {
      console.log(this.startAuthorsIndex)
      console.log(this.authors.slice(this.startAuthorsIndex, 5))
      return this.authors.slice(this.startAuthorsIndex, 5)
    }
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
    },
    radioAuthorPre () {
      if (this.startAuthorsIndex === 0) {
        return
      }
      this.startAuthorsIndex--
    },
    radioAuthorNext () {
      if (this.startAuthorsIndex === this.authors.length - 5) {
        return
      }
      this.startAuthorsIndex++
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
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
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
    margin: 24px 0 12px 0;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
    a {
      span {
        color: #999999;
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
            transition: width 0.3s ease-in-out !important;
          }
          #swiper-pagination-bullet-active {
            width: 18px !important;
            border-radius: 8px !important;
          }
        }
      }
    }
    .right {
      display: inline-block;
      width: 296px;
      height: 300px;
      .name {
        font-size: 20px;
        font-weight: 600;
        color: #4a4a4a;
        line-height: 28px;
        .more {
          font-size: 16px;
          color: #2a9fe4;
        }
      }
      ul {
        margin-top: 10px;
        li {
          display: inline-flex;
          background-color: #fff;
          border-radius: 4px;
          padding: 7px 13px;
          margin-top: 12px;
          margin-right: 11px;
          span {
            cursor: pointer;
            font-size: 14px;
            color: #4a4a4a;
            font-weight: 400;
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
        .recommend-item {
          display: inline-block;
          width: 219px;
          background-color: #0a2b40;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          padding: 10px 25px;
          margin-right: 1px;
          line-height: 50px;
          border-top: 3px solid #2A9FE4FF;
          span {
            display: inline-block;
            width: 120px;
          }
          i {
            display: inline-block;
            width: 26px;
            height: 26px;
            background: pink;
            margin-top: 10px;
            margin-right: 13px;
          }
        }
        .recommend-item:nth-child(1), .recommend-item:nth-child(2) {
          display: inline-block;
          width: 219px;
          background-color: #0a2b40;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          padding: 10px 25px;
          margin-right: 1px;
          line-height: 25px;
        }
      }
      .recommend-radio {
        width: 880px;
        height: 184px;
        margin-top: 8px;
        background-color: #EEF2F3;
      }
      .recommend-teachers {
        margin: 16px 0 43px;
        position: relative;
        ul {
          margin-left: 17px;
          li {
            display: inline-block;
            width: 158px;
            height: 220px;
            background-color: #eef2f3;
            border-radius: 5px;
            margin-right: 14px;
            text-align: center;
            img {
              width: 70px;
              height: 70px;
              background-color: #B2C0C9;
              border-radius: 50%;
              margin-top: 27px;
            }
            .author_name {
              font-size: 14px;
              font-weight: bold;
              color: #103044;
              margin-top: 14px;
              // width: 100px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .title {
              font-size: 14px;
              font-weight: 500;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .button {
              width: 84px;
              height: 27px;
              background-color: #fff;
              border-radius: 17px;
              padding: 4px 22px;
              margin: 22px auto 0;
              span {
                font-size: 14px;
                font-weight: 500;
                color: #2A9FE4;
              }
            }
          }
        }
        .pre {
          position: absolute;
          background-color: #fff;
          margin-top: -125px;
          width:28px;
          height:36px;
          box-shadow:3px 1px 4px 0px rgba(60,91,111,0.05);
          border-radius:0px 5px 5px 0px;
          cursor: pointer;
          i {
            width:28px;
            height:36px;
            background-image: url('../../../../../static/images/discovery/radio-author-left.svg');
            background-repeat: no-repeat;
            background-size: cover;
            display: inline-block;
            &:hover {
              background-image: url('../../../../../static/images/discovery/radio-author-left-hover.svg');
            }
          }
        }
        .next {
          position: absolute;
          right: 0;
          background-color: #fff;
          margin-top: -125px;
          width:28px;
          height:36px;
          box-shadow:-3px 1px 4px 0px rgba(60,91,111,0.05);
          border-radius:5px 0px 0px 5px;
          cursor: pointer;
          i {
            width:28px;
            height:36px;
            background-image: url('../../../../../static/images/discovery/radio-author-right.svg');
            background-repeat: no-repeat;
            background-size: cover;
            display: inline-block;
            &:hover {
              background-image: url('../../../../../static/images/discovery/radio-author-right-hover.svg');
            }
          }
        }
      }
    }
    // 右边
    .right {
      display: inline-block;
      width: 296px;
      margin-left: 23px;
      .user-info {
        width: 296px;
        display: inline-block;
        .content {
          width: 100%;
          .bg-img {
            width: 100%;
            height: 70px;
            background: pink;
          }
          .info {
            width: 100%;
            .user-img {
              width: 100%;
              display: flex;
              img {
                width: 58px;
                height: 58px;
                border-radius: 50%;
                border: 2px solid #fff;
              }
            }
          }
        }
      }
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
      width: 880px;
      height: 260px;
      background-color: #ffffff;
      border-radius: 3px;
      display: inline-block;
      margin-top: 20px;
      padding: 15px 20px;
      .radio-type-top {
        width: 100%;
        // border-bottom: 1px solid #EAEAEA;
        height: 40px;
        span {
          &:first-child {
            background-color: #2A9FE4;
            width: 6px;
            height: 20px;
            display: inline-block;
            border-radius: 4px;
          }
          &:nth-child(2) {
            color: #444444;
            font-size: 24px;
            margin-left: 10px;
            line-height: 22px;
          }
          &:last-child{
            cursor: pointer;
            float:right;
            color: #b8b8b8;
            font-size: 15px;
            i{
              width: 7px;
              height: 11px;
              background-image: url('../../../../../static/images/discovery/radio-more.png');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              margin-top: 5px;
              margin-left: 5px;
            }
            &:hover {
              color: #2A9FE4;
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
          height: 159px;
          background-color: #ffffff;
          cursor: pointer;
          .gradient-layer-play {
            width: 152px;
            height: 80px;
            position: absolute;
            background-image: url('../../../../../static/images/discovery/radio-gradient-layer.png');
            background-repeat: no-repeat;
            background-size: cover;
            margin-top: -80px;
            text-align:  center;
            z-index: 2;
            .play {
              width: 52px;
              height: 52px;
              background-image: url('../../../../../static/images/discovery/radio-list-play.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              margin-top: 16px;
            }
            .pause {
              width: 52px;
              height: 52px;
              background-image: url('../../../../../static/images/discovery/radio-list-pause.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              margin-top: 16px;
            }
          }
          img {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
          }
          .subscribe {
            position: relative;
            display: -webkit-box;
            margin-top: -25px;
            i {
              display: inline-block;
              margin: 0 8px;
              width: 14px;
              height: 14px;
              background-image: url('../../../../../static/images/discovery/home-radio.png');
              background-repeat: no-repeat;
              background-size: cover;
            }
            span {
              color: #ffffff;
              font-size: 12px;
              display: inline-block;
              margin-top: -1px;
              margin-left: -3px;
            }
          }
          .title {
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
          .author {
            color: #B8B8B8;
            font-size: 12px;
            display: inline-block;
            position: relative;
            margin-top: 10px;
            width: 70px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 400;
          }
          .money {
            color: #B8B8B8;
            font-size: 12px;
            float: right;
            /* display: inline-block; */
            position: relative;
            margin-top: 10px;
            font-weight: 400;
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
