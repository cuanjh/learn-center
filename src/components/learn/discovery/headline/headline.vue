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
              <router-link :to="{ path: '/app/headlineDetails', query: { catid: item.catid}}">
                <span>查看更多</span>
                <i></i>
              </router-link>
            </div>
          </div>
          <!--
            v-if="headlineList[index]"
            v-for="(item, index) in headlineList[index].list.slice(0, 1)" :key="item.id + index"
           -->
          <div class="wrapper-list" v-if="headlineList[index]">
            <div class="wrapper" v-for="(item, index) in headlineList[index].list.slice(0, 1)" :key="item.id + index">
              <!-- 左右布局 -->
              <div class="news_link big">
                <div class="thumb_little fl">
                  <img :src="item.thumbs" alt="长方形图片">
                </div>
                <div class="news-read fl">
                  <div class="news_item_right_row1 weight">
                    <span class="news_item_title">{{item.title}}</span>
                  </div>
                  <div class="news_item_right_row2 weight-text">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
              </div>
              <!-- v-for="(item, index) in headlineList[index].list.slice(1)" :key="index"
               v-if="item.show_type === 'single_pic'"-->
              <div class="news_else" v-for="(item, index) in headlineList[index].list.slice(1)" :key="index">
                <!-- 上下布局 -->
                <div class="news_link" v-if="item.show_type === 'single_pic'">
                  <div class="thumb_little">
                    <img :src="item.thumbs" alt="长方形图片">
                  </div>
                  <div class="news-read">
                    <div class="news_item_right_row1">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                    <div class="news_item_right_row2">
                      <span class="news_item_type">{{item.tag_title}}</span>
                      <span class="reading">阅读&nbsp;{{item.hits}}</span>
                    </div>
                  </div>
                </div>
                <!-- 没有图片v-if="item.show_type === 'no_pic'" -->
                <div class="news_link noImg" v-if="item.show_type === 'no_pic'">
                  <div class="news-read small">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      banners: [], // 轮播图列表
      // categories: [], // 导航列表
      page: 1 // 加载页数
      // list: {} // 新闻列表
      // oneList: [] // 第一张图片
      // listImg: [], // 有图片列表
      // noImg: [] // 没有图片列表
    }
  },
  mounted () {
    // this.initData()
    this.headlineHome()
    // console.log('headlineList', this.headlineList)
  },
  computed: {
    ...mapState({
      headlineList: state => state.course.headlineList,
      categories: state => state.course.categories
    })
  },
  methods: {
    ...mapActions({
      headlineHome: 'course/headlineHome'
    })
    // async initData () {
    // let _this = this
    // await _this.headlineHome().then((data) => {
    // _this.banners = data.banners
    // _this.categories = data.categories
    // console.log('headlineHome', data)
    // })
    // for (let i = 0; i < _this.categories.length; i++) {
    // await _this.headlineList({page: _this.page, catid: _this.categories[i].catid}).then((data) => {
    // if (data.headlines.list.length > 0) {
    // _this.list[_this.categories[i].catid] = data.headlines.list
    // }
    // console.log('_this.list', _this.list)
    // })
    // }
    // _this.categories.forEach(item => {
    // console.log('item.catid', item.catid)
    // await _this.headlineList({page: _this.page, catid: item.catid}).then((data) => {
    // if (data.headlines.list.length > 0) {
    // _this.list[item.catid] = data.headlines.list
    // }
    // console.log('_this.list', _this.list)
    // })
    // })
    // }
  }

}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}
ul,li {
  display: inline-block;
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
// 正常照片
.wrapper-list {
  background: pink;
  .wrapper {
    margin-right: 10px;
    display: inline-block;
    margin-bottom: 10px;
  }
}
.news_link {
  display: inline-block;
  font-size: 0;
  border-radius: 3px;
  background: #ffffff;
  margin: 0 10px 10px 0;
}
.thumb_little {
  width: 162px;
  height: 90px;
  img {
    width:100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 3px 3px 0 0;
  }
}
.news-read {
  width: 162px;
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .news_item_right_row1 {
    width: 134px;
    margin: auto;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    margin: 16px 0 0 14px;
    overflow:hidden;
  }
  .news_item_right_row2 {
    width: 100%;
    padding: 0 0 0 14px;
    margin-bottom: 17px;
    .news_item_type {
      font-size: 12px;
      color: #B8B8B8;
      margin-right: 22px;
    }
    .reading {
      font-size: 14px;
      color: #999999;
    }
  }
  .news_item_title {
    font-size: 14px;
    color: #444444;
    text-decoration: none;
    font-weight: bold;
  }
}
.news_else {
  display: inline-block;
  font-size: 0;
  border-radius: 3px;
}
// 第一个大图
.big {
  position: relative;
  width: 482px;
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
  .news-read {
    background: #2A9FE4;
    width: 190px;
    height: 200px;
    margin: 0;
    .weight {
      width: 158px;
      span {
        font-size: 20px;
        color: #fff;
      }
    }
    .weight-text {
      height: auto;
      color: #fff;
      span {
        color: #fff;
      }
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
