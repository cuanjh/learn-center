<template>
  <div class="headline-detail">
    <div class="nav">
      <div class="nav-circle"></div>
      <router-link :to="{path: '/app/headline'}">
        <span>发现</span>
      </router-link>
      /
      <div class="nav-current">
        热点
      </div>
    </div>
    <div class="detail-wrapper">
      <div style="background:pink;">轮播图</div>
      <div class="detail-content">
        <div class="detail-box">
          <ul>
            <li>
              <div class="item-inner">
                <div class="thumb_little">
                  <img src="../../../../../static/images/headline/lang-img.png" alt="列表图片"/>
                </div>
                <div class="news_item_right">
                  <div class="news_item_right_row1">
                    <span class="news_item_title">哈或或或或或或或或或或或或哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或</span>
                  </div>
                  <div class="news_item_right_row2">
                    <span class="news_item_type">美国</span>
                    <span class="reading">阅读&nbsp;9999</span>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="item-inner noPic">
                <div class="news_item_right">
                  <div class="news_item_right_row1 auto">
                    <span class="news_item_title">哈或或或或或或或或或或或或哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或</span>
                  </div>
                  <div class="news_item_right_row2">
                    <span class="news_item_type">美国</span>
                    <span class="reading">阅读&nbsp;9999</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="dspecial-recommendation">
          <div class="title">
            <span>特别推荐</span>
          </div>
          <div class="content">
            <ul>
              <li>
                <div class="dspecial-img">
                  <img src="../../../../../static/images/headline/lang-img.png" alt="特别推荐图片">
                </div>
                <div class="describe">哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或</div>
                <div class="news-type">
                  <span>美国</span>
                  <span>阅读&nbsp;9999</span>
                </div>
              </li>
              <li>
                <div class="dspecial-img">
                  <img src="../../../../../static/images/headline/lang-img.png" alt="特别推荐图片">
                </div>
                <div class="describe">哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或</div>
                <div class="news-type">
                  <span>美国</span>
                  <span>阅读&nbsp;9999</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
export default {
  data () {
    return {
      catid: 0,
      pageNo: 1
    }
  },
  created () {
    // 获取传入的参数
    this.catid = this.$route.query.catid
    console.log('catid', this.catid)
    // this.headlineList({ page: this.pageNo, catid: this.catid }).then((data) => {
    //   console.log('data', data)
    // })
  },
  computed: {
    // ...mapActions({
    //   headlineList: 'course/headlineList'
    // })
  }
}
</script>

<style lang="less" scoped>
.headline-detail {
  width: 1200px;
  margin: 0px auto 144px;
}
a {
  text-decoration:none;
}
ul,li {
  list-style:none;
  text-decoration: none;
}
.nav {
  margin: 20px 0;
  font-weight: bold;
  display: inline-block;
  font-size: 16px;
  .nav-circle {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background-color: #999999;
    display: inline-block;
    margin-top: 9px;
  }
  span {
    color: #999999;
  }
  .nav-current {
    display: inline-block;
    color: #2A9FE4;
  }
}
.detail-content {
  width: 1200px;
  height: auto;
}
.detail-box {
  display: inline-block;
  width: 880px;
  height: auto;
  ul {
    li {
      background: #ffffff;
      margin-top: 20px;
      border-radius: 3px;
      img {
        border-radius: 3px 0 0 3px;
        object-fit: cover;
      }
    }
  }
}

.item-inner {
  display: flex;
  text-decoration: none;
  font-size: 0;
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
    justify-content: space-around;
  }
  .news_item_right_row1 {
    width: 448px;
    height: 52px;
    background: darkkhaki;
    display: inline-block;
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
.noPic {
  height: 110px;
  .auto {
    width: auto;
    height: auto;
  }
}
.dspecial-recommendation {
  display: inline-block;
  width: 280px;
  margin-top: 20px;
  border-radius: 3px;
  background: #ffffff;
  .title {
    font-size: 16px;
    color: #333333;
    text-align: center;
    margin: 36px 0 17px;
  }
  .content {
    width: 100%;
    ul {
      li {
        width: 240px;
        margin: auto;
        margin-bottom: 20px;
        .dspecial-img {
          height: 128px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 3px;
          }
        }
        .describe {
          font-size: 16px;
          color: #444444;
        }
        .news-type {
          font-size: 14px;
          color: #999999;
          display: flex;
          justify-content: space-between;
          padding: 16px 0 17px;
          border-bottom: 2px dotted #8E8E8E;
        }
      }
    }
  }
}
</style>
