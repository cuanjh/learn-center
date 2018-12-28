<template>
  <div class="radio-classification">
    <div class="nav">
      <router-link :to="{path: '/app/user/course'}">
        <span>我的学习账户</span>
      </router-link>
      >
      <router-link :to="{path: '/app/hot-courses'}">
        <span>电台</span>
      </router-link>
      >
      <div class="nav-current">
        分类
      </div>
    </div>
    <div class="classification">
      <!-- 左边导航 -->
      <div class="radio-nav">
        <div class="nav-list">
          <ul>
            <li v-for="(item, index) in menuRadioNavs"
                :key="index"
                :class="{active: item.list_order === isActive}"
                @click="tabChange(item)">
              <a href="javascript:;">{{item.menu_title}}<i></i></a>
            </li>
          </ul>
        </div>
      </div>
      <!-- 右边内容区 -->
      <div class="radio-content">
        <div class="radio-in-content">
          <!-- 头部描述 -->
          <div class="header-describe">
            <div class="header-content">
              <span class="column">共975档节目</span>
              <div class="new">
                <p class="left">
                  <span>日语优先</span>
                  <i></i>
                </p>
                <span>最新</span>
              </div>
            </div>
          </div>
          <!-- 下面的内容区 -->
          <div class="describe-content">
            <div class="describe-lists">
              <ul>
                <li v-for="(item, index) in lists" :key="index">
                  <div class="item-img">
                    <img :src="item.cover" alt="电台的图片">
                    <div class="gradient-layer-play">
                      <i class="play"></i>
                    </div>
                  </div>
                  <div class="right-describe">
                    <p class="name">{{item.author_name}}</p>
                    <p class="num">
                      <span>{{item.buy_num}}次试听</span>
                      <span>4个月前更新</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- 点击加载更多 -->
          <div class="load-more" @click="loadMore()">
            <span v-show="flag == true">点击加载更多</span>
            <span v-show="flag == false">已显示全部内容~</span>
          </div>
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
      flag: true,
      isActive: 505,
      menuRadioNavs: [], // 电台导航
      lists: [], // 更多电台列表
      page: 1, // 页码
      menu_type: '',
      menu_id: ''
    }
  },
  mounted () {
    this.isActive = this.courseOrder.item.list_order
    console.log('跳转之后的item', this.courseOrder)
    console.log('isActive', this.isActive)
    this.postDisvRadio().then((res) => {
      console.log('电台首页', res)
      this.menuRadioNavs = res.data.menuRadios
      for (var i = 0; i < this.menuRadioNavs.length; i++) {
        let item = this.menuRadioNavs[i]
        console.log('item', item)
        // 遍历时根据返回的数据给nav传对应的值
        if (item.list_order === this.isActive) {
          console.log('12121212121221')
          this.tabChange(item)
          break
        }
      }
    })
  },
  computed: {
    courseOrder () {
      let itemInfo = JSON.parse(sessionStorage.getItem('itemInfo'))
      return itemInfo
    }
  },
  methods: {
    ...mapActions({
      postDisvRadio: 'course/postDisvRadio',
      getRadioList: 'course/getRadioList'
    }),
    tabChange (item) {
      console.log('item', item)
      let _this = this
      _this.flag = true
      _this.isActive = item.list_order
      _this.menu_type = item.menu_type
      _this.menu_id = item.menu_id
      let params = {
        menu_type: _this.menu_type,
        menu_id: _this.menu_id,
        page: _this.page
      }
      console.log('params', params)
      _this.getRadioList(params).then((res) => {
        console.log('电台列表返回', res)
        _this.lists = res.data.radios
      })
    },
    // 加载更多
    loadMore () {
      if (!this.flag) {
        return false
      }
      this.page++
      let params = {
        menu_type: this.menu_type,
        menu_id: this.menu_id,
        page: this.page
      }
      console.log('点击加载更多params', params)
      this.getRadioList(params).then((res) => {
        console.log('点击加载更多', res)
        // if (res.data.page === -1) {
        //   this.flag = false
        // }
        this.lists = this.lists.concat(res.data.radios)
        if (res.data.page === -1) {
          this.flag = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
a {
  text-decoration: none;
}
.radio-classification {
  width: 1200px;
  margin: 0px auto 144px;
  background: rgb(245, 201, 208);
  .nav {
    background: rgb(173, 190, 201);
    margin: 20px 0;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
    a {
      text-decoration:none;
      span {
        color: #999999;
      }
    }
    .nav-current {
      display: inline-block;
      color: #2A9FE4;
    }
  }
  .classification {
    margin-top: 20px;
    width: 100%;
    // 左边导航
    .radio-nav {
      display: inline-block;
      width: 180px;
      background: #ffffff;
      .nav-list {
        width: 100%;
        height: 100%;
        ul {
          width: 100%;
          height: 100%;
          li {
            width: 100%;
            height: 44px;
            padding: 6px 8px;
            font-size: 7px;
            color: #4A4A4A;
            border-bottom: 1px solid #E6EBEE;
            background: rgb(235, 188, 188);
            &.active {
              background: #2A9FE4;
              color: #ffffff;
            }
            a {
              position: relative;
              display: block;
              width: 100%;
              height: 100%;
              line-height: 31px;
              i {
                position: absolute;
                right: 0;
                top: 8px;
                display: inline-block;
                width: 14px;
                height: 14px;
                background: url('../../../../../static/images/discovery/testjiantou.svg') no-repeat center;
                background-size: cover;
              }
            }
          }
        }
      }
    }
    // 右边内容区
    .radio-content {
      display: inline-block;
      width: 1000px;
      margin-left: 14px;
      background: #ffffff;
      .radio-in-content {
        width: 100%;
        height: 100%;
        padding: 25px 10px;
        background: rgb(231, 187, 132);
        .header-describe {
          background: #ffffff;
          // 上面的描述
          .header-content {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid red;
            .column {
              font-size: 16px;
              color: #726c6c;
            }
            .new {
              width: 20%;
              background: rgb(197, 179, 179);
              display: flex;
              justify-content: space-between;
              .left {
                display: inline-block;
                span {
                  font-size: 16px;
                  color: rgb(144, 146, 148);
                }
                i {
                  display: inline-block;
                  width: 14px;
                  height: 14px;
                  background: url('../../../../../static/images/discovery/testsanjiao.svg') no-repeat center;
                  background-size: cover;
                  margin-top: 4px;
                }
              }
              span {
                font-size: 16px;
                color: rgb(61, 70, 80);
              }
            }
          }
        }
        // 下面的内容区
        .describe-content{
          width: 100%;
          background: pink;
          .describe-lists {
            width: 100%;
            ul {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
              width: 100%;
              li {
                display: flex;
                justify-content: space-between;
                width: 50%;
                background: rgb(154, 191, 212);
                margin: 10px 0;
                .item-img {
                  position: relative;
                  width: 180px;
                  height: 180px;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                  .gradient-layer-play {
                    display: inline-block;
                    position: absolute;
                    right: 6px;
                    bottom: 6px;
                    .play {
                      width: 52px;
                      height: 52px;
                      background-image: url('../../../../../static/images/discovery/radio-list-play.svg');
                      background-repeat: no-repeat;
                      background-size: cover;
                      display: inline-block;
                    }
                    .pause {
                      width: 52px;
                      height: 52px;
                      background-image: url('../../../../../static/images/discovery/radio-list-pause.svg');
                      background-repeat: no-repeat;
                      background-size: cover;
                      display: inline-block;
                    }
                  }
                }
                .right-describe {
                  padding: 10px 0;
                  width: 260px;
                  background: #c9a3a3;
                  .name {
                    width: 120px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                    font-size: 20px;
                    color: #333;
                    font-weight: bold;
                  }
                  .num {
                    font-size: 16px;
                    color: red;
                    padding: 5px 0;
                  }
                }
              }
            }
          }
        }
        // 点击加载更多
        .load-more {
          background-color: #ffffff;
          width: 100%;
          font-size: 16px;
          color: rgb(250, 140, 5);
          padding: 20px 0;
          text-align: center;
          span {
            cursor: pointer;
          }
        }
      }
    }
  }
}

</style>
