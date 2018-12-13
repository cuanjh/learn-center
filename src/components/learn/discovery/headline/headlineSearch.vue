<template>
  <div class="search">
    <div class="search-content">
      <div class="search-header">
        <input id="keyword-search" v-model.lazy="key"
                class="searchbar_core" type="search"
                 @keyup.13="search()"
                :placeholder="holder"
                @focus.prevent="focusFn"
                @blur.prevent="blurFn"
                >
        <a href="javascript:void(0)" @click="search()" class="searchbar_cancel"><span>搜索</span></a>
        <!-- v-show="showHistory" -->
        <div class="search-list">
          <ul>
            <li v-for="(item,index) in history" :key="index"
                @mouseenter="mouseEnter(index)"
                @mouseleave="mouseLeave"
                :class="{active:index==isActive}"
                >
              <span @click="search(item)">{{item}}</span>
              <em @click="del(item)">X</em>
            </li>
          </ul>
          <div class="history" @click="clearAll">
            <a class="history-cancel">
              <span>清除搜索历史</span>
            </a>
          </div>
        </div>
      </div>
      <!-- 搜索列表 -->
      <div class="search-box">
        <!-- 列表  v-show="showList"-->
        <div class="list_content">
          <!-- 列表不同的显示样式 -->
          <div class="list-box">
            <div class="list_ul" v-for="(item, index) in searchLists" :key="index">
              <!-- 正常 single_pic  @click="gotoDetail(item)"-->
              <div @click="get(item.id)" class="list_li" v-if="item.show_type === 'single_pic'">
                <div class="item-inner">
                  <div class="thumb_little">
                    <img v-lazy="item.thumbs[0]" alt="列表图片"/>
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
              <!-- 没图片 no_pic  @click="gotoDetail(item)"-->
              <div @click="get(item.id)" class="list_li" v-if="item.show_type === 'no_pic'">
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
              <!-- 一张大图 big_pic  @click="gotoDetail(item)" -->
              <div @click="get(item.id)" class="list_li" v-if="item.show_type === 'big_pic'">
                <div class="item-inner big">
                  <div class="news_item_right_row1 big_title">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                  <div class="thumb_little big_img">
                    <img v-lazy="item.thumbs[0]" alt="列表图片"/>
                  </div>
                  <div class="news_item_right_row2 big_reading">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
              </div>
              <!-- 更多图片 more_pic  v-if="item.thumbs.length === 1" @click="gotoDetail(item)"-->
              <div @click="get(item.id)" class="list_li" v-if="item.show_type === 'more_pic'">
                <!-- 一张图片 -->
                <div class="item-inner big" v-if="item.thumbs.length === 1">
                  <div class="news_item_right_row1 big_title">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                  <div class="thumb_little big_img">
                    <img v-lazy="item.thumbs[0]" alt="列表图片"/>
                  </div>
                  <div class="news_item_right_row2 big_reading">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
                <!-- 两张图片   @click="gotoDetail(item)"-->
                <div @click="get(item.id)" class="item-inner  two" v-if="item.thumbs.length === 2">
                  <div class="news_item_right_row1 two_title">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                  <div class="thumb_little two_img">
                    <img v-lazy="item.thumbs[0]" alt="列表图片"/>
                    <img v-lazy="item.thumbs[1]" alt="列表图片">
                  </div>
                  <div class="news_item_right_row2">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
                <!-- 更多图片只显示三张  @click="gotoDetail(item)"-->
                <div @click="get(item.id)" class="item-inner  more" v-if="item.thumbs.length === 3" >
                  <div class="news_item_right_row1 more_title">
                      <span class="news_item_title">{{item.title}}</span>
                    </div>
                  <div class="thumb_little more_img">
                    <img v-lazy="item.thumbs[0]" alt="列表图片"/>
                    <img v-lazy="item.thumbs[1]" alt="列表图片">
                    <img v-lazy="item.thumbs[2]" alt="列表图片">
                  </div>
                  <div class="news_item_right_row2">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 点击加载更多   -->
          <div class="loadMore" @click="loadingMore">
            <span v-text="btnText" v-show="flag == true"></span>
            <span v-text="btnText" v-show="flag == false"></span>
          </div>
        </div>
        <!-- 没有搜索到内容  v-show="showNo"-->
        <div class="no-news">
          <span>没有相关内容</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import $ from 'jquery'
export default {
  data () {
    return {
      flag: true,
      btnText: '点击加载更多',
      holder: '请输入关键字',
      searchLists: [], // 搜索到的结果
      isActive: false,
      history: [],
      key: '',
      page: 1
    }
  },
  mounted () {
    this.key = this.$route.params.val
  },
  methods: {
    ...mapActions({
      searchList: 'course/searchList'
    }),
    search (item) {
      this.flag = true
      this.btnText = '点击加载更多'
      if (!this.key && !item) {
        alert('请输入关键字')
        return
      }
      $('.search-list').fadeOut()
      let _this = this
      if (!item) {
        let hisObj = localStorage.getItem('history')
        if (!hisObj) {
          // localStorage 没有 history,需要把当前的搜索存进去
          _this.history.push(_this.key)
          localStorage.setItem('history', JSON.stringify(_this.history))
        } else {
          _this.history = JSON.parse(hisObj)
          if (_this.history.indexOf(_this.key) < 0) {
            // key 不存在
            _this.history.push(_this.key)
            localStorage.setItem('history', JSON.stringify(_this.history))
          }
        }
      } else {
        _this.key = item
      }
      _this.searchList({key_word: _this.key, page: _this.page}).then((data) => {
        _this.searchLists = data.headlines.list
        if (_this.searchLists === '' || _this.searchLists.length === 0) {
          $('.loadMore').fadeOut()
          $('.no-news').fadeIn()
        } else {
          $('.no-news').fadeOut()
          $('.list_content').fadeIn()
          $('.loadMore').fadeIn()
        }
        console.log('searchdata', data)
        console.log('searchLists', _this.searchLists)
      })
    },
    // 获取焦点
    focusFn () {
      // this.showHistory = true
      if (this.holder === '请输入关键字') {
        this.holder = ''
      }
      $('.search-list').fadeIn()
    },
    // 失去焦点
    blurFn () {
      // this.showHistory = false
      // this.search()
      if (this.holder === '') {
        this.holder = '请输入关键字'
      }
      $('.search-list').fadeOut()
    },
    // 鼠标移入
    mouseEnter (index) {
      this.isActive = index
    },
    // 鼠标移除
    mouseLeave () {
      this.isActive = null
    },
    // 删除列表某一项
    del (item) {
      if (!item) {
        return false
      }
      let hisObj = localStorage.getItem('history')
      this.history = JSON.parse(hisObj)
      this.history.splice(this.history.indexOf(item), 1)
      localStorage.setItem('history', JSON.stringify(this.history))
    },
    clearAll () {
      this.history = []
      localStorage.removeItem('history')
      // this.showHistory = false
    },
    get (id) {
      this.$router.push({
        path: `/app/headline-details/${id}`
      })
    },
    loadingMore () {
      this.page++
      this.searchList({key_word: this.key, page: this.page}).then((data) => {
        if (data.headlines.page === -1) {
          this.page--
          this.flag = true
          this.btnText = '已显示全部内容~'
          return false
        }
        this.searchLists = this.searchLists.concat(data.headlines.list)
        if (this.searchLists === '' || this.searchLists.length === 0) {
          $('.loadMore').fadeOut()
          $('.no-news').fadeIn()
        } else {
          $('.no-news').fadeOut()
          $('.list_content').fadeIn()
          $('.loadMore').fadeIn()
        }
        console.log('searchdata====>', data)
        console.log('searchLists====>', this.searchLists)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.search {
  width: 850px;
  min-height: 800px;
  // background: pink;
  margin: 20px auto 0;
  .search-content {
    width: 850px;
    .search-header {
      width: 850px;
      .searchbar_core {
        width: 704px;
        height: 60px;
        background: rgba(192, 187, 187, .45);
        padding-left: 20px;
        font-size: 20px;
        color: #333333;
      }
      .searchbar_cancel {
        display: inline-block;
        width: 146px;
        height: 60px;
        font-size: 20px;
        color: #333333;
        text-align: center;
        line-height: 60px;
        background-color: rgb(53, 156, 216);
        margin-left: -6px;
      }
      .search-list {
        display: none;
        position: absolute;
        width: 704px;
        background: rgba(255, 255, 255);
        ul {
          li {
            position: relative;
            cursor: pointer;
            padding-left: 20px;
            height: 53px;
            font-size: 20px;
            color: #9B9B9B;
            line-height: 53px;
            border-bottom: 1px solid #EAEAEA;
            span {
              display: inline-block;
              width: 90%;
            }
            &.active {
              background: rgba(239, 239, 244, .45)
            }
            em {
              display: none;
              font-style: normal;
             float: right;
             padding-right: 20px;
            }
            &.active em {
              display: block;
            }
          }
        }
        .history {
          height: 53px;
          text-align: center;
          line-height: 53px;
          .history-cancel {
            font-size: 20px;
            color: #90B1D8;
          }
        }
      }
    }
  }
}
.search-box {
  width: 850px;
  background: #fff;
  display: inline-block;
  margin-top: 28px;
  margin-bottom: 20px;
  .list_content {
    display: none;
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
}
.list-box {
  display: inline-block;
  width: 100%;
  height: auto;
  padding: 35px 35px 20px;
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
        cursor: pointer;
        display: flex;
        text-decoration: none;
        font-size: 0;
        background: #ffffff;
        // -webkit-transition: all .3s ease-in-out;
        // -moz-transition: all .3s ease-in-out;
        // -ms-transition: all .3s ease-in-out;
        // -o-transition: all .3s ease-in-out;
        // transition: all .3s ease-in-out;
        // border-radius: 5px 5px 0 0;
        // &:hover {
        //   box-shadow: 0 0 26px 0 rgba(000, 000, 000, 0.3);
        //   -webkit-transition: all .3s ease-in-out;
        //   -moz-transition: all .3s ease-in-out;
        //   -ms-transition: all .3s ease-in-out;
        //   -o-transition: all .3s ease-in-out;
        //   transition: all .3s ease-in-out;
        // }
        .thumb_little {
          display: inline-block;
          width: 264px;
          height: 140px;
          img {
            width:100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
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
        .news_item_right_row1 {
          margin-top: 0px;
        }
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
.loadMore {
  display: none;
  cursor: pointer;
  font-size: 20px;
  color: black;
  padding-bottom: 20px;
  text-align: center;
  &:hover {
    color: rgb(53, 171, 240);
  }
}
.no-news {
  display: none;
  width: 100%;
  height: 600px;
  font-size: 16px;
  color: #333333;
  padding: 35px;
}
</style>
