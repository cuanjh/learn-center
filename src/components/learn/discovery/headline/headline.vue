<template>
  <div class="headline-container">
    <div class="headline-content">
      <!-- 热门部分 -->
      <div class="headline-hot">热门部分
        <!-- 轮播图 -->
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
            </div>
          </div>
        </div>
      </div>
      <!-- 新闻列表 -->
      <div class="lists-content">
        <!-- 分类列表 -->
        <div class="lists-category" v-for="(item, index) in categories" :key="index">
          <div class="category-name">
            <span class="name">{{item.catname}}</span>
            <div class="more">
              <a href="javascript:;">
                <span>查看更多</span>
                <i></i>
              </a>
            </div>
          </div>
          <div class="wrapper">
            <ul>
              <!-- 左右布局 -->
              <li class="news_link big">
                <div class="thumb_little fl">
                  <img src="" alt="长方形图片">
                </div>
                <div class="news_item_right">
                  <div class="news_item_right_row1 weight">
                    <span class="news_item_title">日本怎么怎么了</span>
                  </div>
                  <div class="news_item_right_row2">
                    <span class="news_item_type">日本 &nbsp;&nbsp;&nbsp;&nbsp; 阅读&nbsp;3345</span>
                  </div>
                </div>
              </li>
              <!-- 上下布局 -->
              <li class="news_link">
                <div class="thumb_little">
                  <img src="../../../../../static/images/headline/lang-img.png" alt="长方形图片">
                </div>
                <div class="news_item_right">
                  <div class="news_item_right_row1">
                    <span class="news_item_title">日本怎么怎么了</span>
                  </div>
                  <div class="news_item_right_row2">
                    <span class="news_item_type">日本 &nbsp;&nbsp;&nbsp;&nbsp; 阅读&nbsp;3345</span>
                  </div>
                </div>
              </li>
              <!-- 没有图片 -->
              <li class="news_link noImg">
                <div class="news_item_right small">
                  <div class="news_item_right_row1">
                    <span class="news_item_title">日本怎么怎么了,日本怎么怎么了,日本怎么怎么了?</span>
                  </div>
                  <div class="news_item_right_row2">
                    <span class="news_item_type">日本 &nbsp;&nbsp;&nbsp;&nbsp; 阅读&nbsp;3345</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 最新新闻
        <div class="wrapper">
          <ul>
            左右布局
            <li class="news_link big">
              <div class="thumb_little fl">
                <img src="../../../../../static/images/headline/lang-img.png" alt="长方形图片">
              </div>
              <div class="news_item_right">
                <div class="news_item_right_row1 weight">
                  <span class="news_item_title">日本怎么怎么了</span>
                </div>
                <div class="news_item_right_row2">
                  <span class="news_item_type">日本 &nbsp;&nbsp;&nbsp;&nbsp; 阅读&nbsp;3345</span>
                </div>
              </div>
            </li>
            上下布局
            <li class="news_link">
              <div class="thumb_little">
                <img src="../../../../../static/images/headline/lang-img.png" alt="长方形图片">
              </div>
              <div class="news_item_right">
                <div class="news_item_right_row1">
                  <span class="news_item_title">日本怎么怎么了</span>
                </div>
                <div class="news_item_right_row2">
                  <span class="news_item_type">日本 &nbsp;&nbsp;&nbsp;&nbsp; 阅读&nbsp;3345</span>
                </div>
              </div>
            </li>
            没有图片
            <li class="news_link noImg">
              <div class="news_item_right small">
                <div class="news_item_right_row1">
                  <span class="news_item_title">日本怎么怎么了,日本怎么怎么了,日本怎么怎么了?</span>
                </div>
                <div class="news_item_right_row2">
                  <span class="news_item_type">日本 &nbsp;&nbsp;&nbsp;&nbsp; 阅读&nbsp;3345</span>
                </div>
              </div>
            </li>
          </ul>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      banners: [], // 轮播图列表
      categories: [], // 导航列表
      page: 1, // 加载页数
      list: [] // 新闻列表
      // oneList: [] // 第一张图片
      // listImg: [], // 有图片列表
      // noImg: [] // 没有图片列表
    }
  },
  mounted () {
    let _this = this
    _this.headlineHome().then((data) => {
      _this.banners = data.banners
      _this.categories = data.categories
      console.log('headlineHome', data)
      _this.categories.forEach(item => {
        console.log('item.catid', item.catid)
        _this.headlineList({page: _this.page, catid: item.catid}).then((data) => {
          if (data.headlines.page === _this.page) {
            return false
          } else {
            _this.page = data.headlines.page
          }
          _this.list = data.headlines.list
          _this.oneList = data.headlines.list[0]
          console.log('_this.list', _this.oneList)
        })
      })
    })
  },
  methods: {
    ...mapActions({
      headlineHome: 'course/headlineHome',
      headlineList: 'course/headlineList'
    })
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
.fl {
  float:left;
}

.fr {
  float: right;
}
.headline-container {
  width: 1200px;
  margin: 0 auto;
}
.headline-content {
  margin: 0 auto;
}
.headline-hot {
  width: 1200px;
  height: auto;
  background: rgb(120, 201, 201);
}
.lists-content {
  margin-top: 35px;
}
.lists-content:last-child {
  margin-bottom: 140px;
}
.lists-category {
    margin-top: 33px;
  .category-name {
    display: flex;
    justify-content: space-between;
    .name {
      color: #2A9FE4;
      float: left;
      font-size: 24px;
      margin-bottom: 15px;
    }
    .more {
      width: 70px;
      height: 21px;
      a {
        font-size: 15px;
        color: #444444;
        i {
          display: inline-block;
          width: 5px;
          height: 100%;
          background: url('../../../../../static/images/headline/triangle-right.png') no-repeat center;
          background-size: 100%;
          background-position-y: 5px;
        }
      }
    }
  }
}
.wrapper {
  ul {
    li {
      display: inline-block;
      background: #fff;
      margin-right: 20px;
    }
  }
}
// 正常图片
.news_link {
  height: 200px;
  display: block;
  text-decoration: none;
  font-size: 0;
  border-radius: 3px;
}

.thumb_little {
  width: 162px;
  height: 90px;
  /* overflow: hidden; */
}

.thumb_little img {
  width:100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 3px 3px 0 0;
}

.news_item_right {
  width: 162px;
  height: 110px;
  padding: 17px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news_item_right_row1 {
  width: 100%;
  display: inline-block;
}

.news_item_right_row2 {
  width: 100%;
}

.news_item_type {
  font-size: 12px;
  color: #B8B8B8;
}

.news_item_title {
  font-size: 14px;
  color: #444444;
  text-decoration: none;
  font-weight: bold;
}

.news_item_title:hover {
  text-decoration: none;
  color: black;
}

// 第一个大图
.big {
  width: 483px;
  height: 200px;
  .thumb_little {
    width: 292px;
    height: 200px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 3px 0 0 3px;
    }
  }
  .news_item_right {
    background: #2A9FE4;
    width: 191px;
    height: 200px;
    .weight>span {
      font-size: 20px;
      color: #fff;
    }
    .news_item_right_row2>span {
      color: #fff;
    }
  }
}
// 没有图片
.noImg {
  height: auto;
  .small {
    width: auto;
    height: 113px;
  }
}

</style>
