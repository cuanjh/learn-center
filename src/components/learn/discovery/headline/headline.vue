<template>
  <div class="headline-container">
    <div class="headline-content">
      <!-- 导航 -->
      <div class="navigation">
        <ul class="navigation_list">
          <li class="navbar" v-for="(item , index) in categories"
          :key="index"
          :class="{active: item.catid == isactive}"
          @click="tabNav(item.catid)"
          >
            <a class="nav">
              <span>{{item.catname}}</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="right-content">
        <!-- 轮播图 -->
        <div id="banner" class="swiper-container" v-if="this.isactive === 0">
          <div id="swiper-wrapper" class="swiper-wrapper">
            <div id="swiper-slide" class="swiper-slide" v-for="(item, index) in banners" :key="index" @click="get(item.id)">
              <img class="wheeling_img" :src="item.banner_img" alt="">
              <div class="news_item_right_swipper">
                <div class="news_item_right1">
                  <span class="news_item_title">{{item.title}}</span>
                </div>
                <div class="news_item_right2">
                  <span class="news_item_type">{{item.tag_title}}</span>
                  <span class="reading">阅读&nbsp;{{item.hits}}</span>
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
        <!-- 列表 -->
        <div class="list_content">
          <!-- 列表不同的显示样式 -->
          <div class="list-box">
            <div class="list_ul" v-for="(item, index) in lists" :key="index" >
              <!-- 正常 single_pic -->
              <div @click="get(item.id)" class="list_li" v-if="item.show_type === 'single_pic'" >
                <div class="item-inner">
                  <div class="thumb_little">
                    <img v-lazy="item.thumbs[0]" :key="item.thumbs[0]" alt="列表图片"/>
                  </div>
                  <div class="news_item_right">
                    <div class="news_item_right_row1">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                    <div class="news_item_right_row2">
                      <span class="news_item_type">{{item.tag_title}}</span>
                      <span class="reading">阅读&nbsp;{{item.hits}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 没图片 no_pic -->
              <div @click="get(item.id)" class="list_li" v-if="item.show_type === 'no_pic'" >
                <div class="item-inner noPic">
                  <div class="news_item_right">
                    <div class="news_item_right_row1 auto">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                    <div class="news_item_right_row2">
                      <span class="news_item_type">{{item.tag_title}}</span>
                      <span class="reading">阅读&nbsp;{{item.hits}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 一张大图 big_pic -->
              <div @click="get(item.id)" class="list_li" v-if="item.show_type === 'big_pic'" >
                <div class="item-inner big">
                  <div class="news_item_right_row1 big_title">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                  <div class="thumb_little big_img">
                    <img v-lazy="item.thumbs[0]" :key="item.thumbs[0]" alt="列表图片"/>
                  </div>
                  <div class="news_item_right_row2 big_reading">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
              </div>
              <!-- 更多图片 more_pic -->
              <div class="list_li" v-if="item.show_type === 'more_pic'">
                <!-- 一张图片 -->
                <div @click="get(item.id)" class="item-inner big" v-if="item.thumbs.length === 1" >
                  <div class="news_item_right_row1 big_title">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                  <div class="thumb_little big_img">
                    <img v-lazy="item.thumbs[0]" :key="item.thumbs[0]" alt="列表图片"/>
                  </div>
                  <div class="news_item_right_row2 big_reading">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
                <!-- 两张图片 -->
                <div @click="get(item.id)" class="item-inner  two" v-if="item.thumbs.length === 2" >
                  <div class="news_item_right_row1 two_title">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                  <div class="thumb_little two_img">
                    <img v-lazy="item.thumbs[0]" :class="item.thumbs[0]" alt="列表图片"/>
                    <img v-lazy="item.thumbs[1]" :class="item.thumbs[1]" alt="列表图片">
                  </div>
                  <div class="news_item_right_row2">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
                <!-- 更多图片只显示三张 -->
                <div @click="get(item.id)" class="item-inner  more" v-if="item.thumbs.length === 3" >
                  <div class="news_item_right_row1 more_title">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                  <div class="thumb_little more_img">
                    <img v-lazy="item.thumbs[0]" :key="item.thumbs[0]" alt="列表图片"/>
                    <img v-lazy="item.thumbs[1]" :key="item.thumbs[1]" alt="列表图片">
                    <img v-lazy="item.thumbs[2]" :key="item.thumbs[2]" alt="列表图片">
                  </div>
                  <div class="news_item_right_row2">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 点击加载更多 -->
        <div class="loadMore" @click="loadMore">
          <span v-text="btnText" v-show="flag == true"></span>
          <span v-text="btnText" v-show="flag == false"></span>
        </div>
      </div>
    </div>
    <!--  <rou :to="{ path: '/app/headline-search'}">搜索搜索搜索</rou> -->
    <!-- <router-link :to="{ name: 'headlineSearch'}">搜索搜索搜索</router-link> -->
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'

export default {
  data () {
    return {
      flag: true,
      btnText: '点击加载更多',
      isactive: 0,
      banners: [], // 轮播图列表
      categories: [], // 导航列表
      headlinesLists: [], // 热点列表
      lists: [], // 列表
      page: 1 // 页码
    }
  },
  // components: { headlineReport },
  mounted () {
    console.log('mounted===>')
    this.initData()
  },
  updated () {
    console.log('updated===>')
    if (this.isactive === 0) {
      this.swiperInit()
    }
  },
  methods: {
    ...mapActions({
      headlineHome: 'course/headlineHome',
      headlineList: 'course/headlineList'
    }),
    async initData () {
      let _this = this
      await _this.headlineHome().then((data) => {
        console.log('头条首页', data)
        _this.banners = data.banners
        _this.categories = data.categories
        _this.headlinesLists = data.headlines.list
        _this.tabNav(_this.categories[0].catid)
        /* this.$nextTick(() => {
          // eslint-disable no-new
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
        }) */
        _this.swiperInit()
      })
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
    tabNav (catid) {
      let _this = this
      _this.flag = true
      _this.btnText = '点击加载更多'
      _this.isactive = catid
      _this.headlineList({page: _this.page, catid: catid}).then((data) => {
        console.log('头条列表', data)
        if (data.headlines.page === -1) {
          return false
        }
        console.log('page', _this.page)
        _this.lists = data.headlines.list
      })
    },
    get (id) {
      this.$router.push({
        path: `/app/headline-details/${id}`
      })
    },
    loadMore () { // 头条首页列表加载更多
      this.page++
      this.headlineList({page: this.page, catid: this.isactive}).then((data) => {
        console.log('headlineList', data)
        if (data.headlines.page === -1) {
          this.page--
          this.flag = false
          this.btnText = '已显示全部内容~'
          return false
        }
        this.lists = this.lists.concat(data.headlines.list)
      })
    }
  }
}
</script>
<style lang="less" scoped>
a {
  text-decoration: none;
}
ul,li {
  list-style:none;
  text-decoration: none;
}
.headline-container {
  width: 1200px;
  height: auto;
  margin: auto;
  margin-bottom: 20px;
  padding-bottom: 20px;
}
.headline-content {
  position: relative;
  margin-top: 20px;
  width: 1200px;
  height: auto;
}
.navigation {
  // position: fixed;
  display: inline-block;
  margin-right: 20px;
  width: 155px;
  height: auto;
  background: #fff;
  padding: 42px 24px 44px;
  .navigation_list {
    display: block;
    width: 100%;
    height: auto;
    .navbar {
      width: 98px;
      height: 41px;
      margin: 0 auto;
      border-radius: 21px;
      font-size: 24px;
      color: #333333;
      margin-bottom: 44px;
      &:hover {
        background: #D8D8D8;
      }
      &.active {
        background: #D8D8D8;
        color: #ffffff;
      }
      .nav {
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 41px;
        border-radius: 21px;
      }
    }
  }
}

#banner {
  width: 968px;
  height: 360px;
  margin-top: 25px;
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
#swiper-slide {
  cursor: pointer;
  width: 968px ;
  height: 360px;
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

.right-content {
  width: 1018px;
  background: #fff;
  display: inline-block;
  .list_content {
    .news_item_right_swipper {
      position: absolute;
      top: 180px;
      display: flex;
      flex-direction: column;
      margin-left: 20px;
      justify-content: space-around;
    }
    .news_item_right1 {
      height: 52px;
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
  .loadMore {
    cursor: pointer;
    font-size: 20px;
    color: black;
    margin: 20px;
    text-align: center;
    &:hover {
      color: rgb(53, 171, 240);
    }
  }
}
.list-box {
  display: inline-block;
  width: 100%;
  height: auto;
  padding: 0 25px 0 25px;
  .list_ul {
    .list_li {
      padding: 20px 0;
      border-bottom: 1px solid #EAEAEA;
      border-radius: 3px;
      img {
        border-radius: 3px 0 0 3px;
        object-fit: cover;
      }
      // 正常图片
      .item-inner {
        display: flex;
        text-decoration: none;
        font-size: 0;
        background: #ffffff;
        .thumb_little {
          display: inline-block;
          width: 264px;
          height: 140px;
          overflow: hidden;
          transform-style: preserve-3d;
          img {
            width:100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
            &:hover {
              cursor: pointer;
              transform: scale(1.1);
              transition: all .5s ease-in-out .1s;
            }
          }
        }
        .news_item_right {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          margin-right: 20px;
          justify-content: space-around;
        }
        .news_item_right_row1 {
          // width: 448px;
          // height: 52px;
          // background: darkkhaki;
          display: inline-block;
          margin-top: 10px;
          .news_item_title {
            font-size: 16px;
            color: #444444;
            text-decoration: none;
            font-weight: bold;
            &:hover {
              cursor: pointer;
              color: #064ce2;
            }
          }
        }
        .news_item_right_row2 {
          .news_item_type {
            font-size: 14px;
            color: #999999;
            margin-right: 38px;
          }
          .reading {
            font-size: 14px;
            color: #999999;
          }
        }
      }
      // 没有图片
      .noPic {
        height: 110px;
        .auto {
          width: auto;
          height: auto;
        }
      }
      // 一张大图
      .big {
        display: block;
        .big_img {
          display: block;
          width: 100%;
          height: 160px;
          margin: 20px 0;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      // 多张图片两张图片
      .two {
        display: block;
        margin-top: 20px;
        .two_img {
          display: block;
          width: 100%;
          height: 160px;
          margin: 20px 0;
          display: flex;
          justify-content: space-between;
          img {
            width: 40%;
            height: 100%;
          }
        }
      }
      // 更多图片
      .more {
        display: block;
        margin-top: 20px;
        .more_img {
          display: block;
          width: 100%;
          height: 160px;
          margin: 20px 0;
          display: flex;
          justify-content: space-between;
          img {
            width: 30%;
            height: 100%;
          }
        }
      }
    }
  }
}

</style>
