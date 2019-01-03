<template>
  <div class="radio-classification">
    <div class="nav">
      <router-link :to="{path: '/app/user/course'}">
        <span>我的学习账户</span>
      </router-link>
      >
      <router-link :to="{path: '/app/discovery/home'}">
        <span>电台</span>
      </router-link>
      >
      <router-link :to="{path: '/app/discovery/radio-home'}">
        <span>分类</span>
      </router-link>
      >
      <div class="nav-current">
        课程详情
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
            <div class="top">
              <p class="title">电台节目</p>
              <p class="tab">
                <span>日语相关</span>
                <span>母语相关</span>
              </p>
            </div>
            <div class="header-content">
              <span class="column">共975档节目</span>
              <div class="new">
                <!-- <p class="left">
                  <span>日语优先</span>
                  <i></i>
                </p> -->
                <span>最新</span>
              </div>
            </div>
          </div>
          <!-- 下面的内容区 -->
          <div class="describe-content" v-if="lists.length > 0">
            <div class="describe-lists">
              <ul>
                <li v-for="(radio, index) in lists" :key="index">
                  <div class="item-img">
                    <img v-lazy="radio.cover" :key="radio.cover" alt="电台的图片">
                    <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                      <i class="play"></i>
                    </div>
                  </div>
                  <div class="right-describe">
                    <p class="name">{{radio.title}}</p>
                    <p class="num">
                      <span>{{radio.buy_num}}次试听</span>
                      <span v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></span>
                    </p>
                    <p class="author">
                      <span>主播：</span>
                      <span v-text="radio.author_name ? radio.author_name : '用户' + radio.talkmate_id"></span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 点击加载更多 -->
            <div class="load-more" @click="loadMore()" v-show="lists.length > 0">
              <span v-show="flag == true">点击加载更多</span>
              <span v-show="flag == false">已显示全部内容~</span>
            </div>
          </div>
          <!-- 点击加载更多 -->
          <!-- <div class="load-more" @click="loadMore()" v-show="lists.length > 0">
            <span v-show="flag == true">点击加载更多</span>
            <span v-show="flag == false">已显示全部内容~</span>
          </div> -->
          <!-- 没有内容 -->
          <div class="no-content" v-show="lists.length === 0">
            <span>没有相关电台的课程···</span>
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
      flag: true,
      isActive: 410,
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
    // 导航切换
    tabChange (item) {
      console.log('item', item)
      let _this = this
      _this.page = 1
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
    },
    // 点击播放电台
    loadRadioList (e, radio) {
      console.log('e', e)
      console.log('radio', radio)
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
  .nav {
    margin: 20px 0;
    display: inline-block;
    font-size:14px;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:rgba(60,91,111,1);
    line-height:20px;
    a {
      text-decoration:none;
      span {
        color: #3C5B6F;
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
      width: 220px;
      background: #ffffff;
      .nav-list {
        width: 100%;
        height: 100%;
        ul {
          width: 100%;
          height: 100%;
          li {
            font-size:14px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(60,91,111,1);
            line-height:20px;
            padding: 16px 26px;
            border-bottom: 1px solid rgba(230,235,238,1);
            &.active {
              background: #2A9FE4;
              color: #ffffff;
            }
            &:hover {
              background: #2A9FE4;
              color: #ffffff;
            }
            a {
              position: relative;
              display: block;
              width: 100%;
              height: 100%;
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
      margin-left: 14px;
      width: 960px;
      padding-bottom: 50px;
      background: #ffffff;
      .radio-in-content {
        width: 100%;
        height: 100%;
        .header-describe {
          padding: 19px 43px 23px;
          .top {
            width: 100%;
            .title {
              font-size:20px;
              font-family:PingFang-SC-Bold;
              font-weight:bold;
              color:rgba(10,43,64,1);
              line-height:28px;
            }
            .tab {
              display: inline-block;
              font-size:13px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(60,91,111,1);
              line-height:18px;
              margin: 10px 0 28px;
              span {
                font-size:13px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(60,91,111,1);
                line-height:18px;
                padding: 4px 19px;
                border:1px solid rgba(217,223,226,1);
              }
              span:nth-child(1) {
                margin-right: 10px;
              }
            }
          }
          // 上面的描述
          .header-content {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 3px solid #EEF2F3;
            .column {
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(144,162,174,1);
            }
            .new {
              // .left {
              //   display: inline-block;
              //   span {
              //     font-size:14px;
              //     font-family:PingFang-SC-Medium;
              //     font-weight:500;
              //     color:rgba(60,91,111,1);
              //   }
              //   i {
              //     display: inline-block;
              //     width: 14px;
              //     height: 14px;
              //     background: url('../../../../../static/images/discovery/testsanjiao.svg') no-repeat center;
              //     background-size: cover;
              //     margin-top: 4px;
              //   }
              // }
              span {
                font-size:14px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(60,91,111,1);
              }
            }
          }
        }
        // 下面的内容区
        .describe-content{
          padding: 0px 43px 19px;
          width: 100%;
          max-height: 860px;
          overflow-y: auto;
          .describe-lists {
            width: 100%;
            border-bottom: 3px solid #EEF2F3;
            ul {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
              width: 100%;
              li {
                display: flex;
                justify-content: space-between;
                width: 50%;
                margin-bottom: 30px;
                .item-img {
                  position: relative;
                  width:170px;
                  height:90px;
                  border-radius:5px;
                  margin-top: 5px;
                  img {
                    width: 100%;
                    height: 100%;
                    border-radius:5px;
                  }
                  .gradient-layer-play {
                    cursor: pointer;
                    display: inline-block;
                    position: absolute;
                    right: 6px;
                    bottom: 6px;
                    background: rgba(18, 18, 18, .415);
                    border-radius: 50%;
                    .play {
                      width: 24px;
                      height: 24px;
                      background-image: url('../../../../../static/images/discovery/radio-list-play.svg');
                      background-repeat: no-repeat;
                      background-size: cover;
                      display: inline-block;
                    }
                    .pause {
                      width: 24px;
                      height: 24px;
                      background-image: url('../../../../../static/images/discovery/radio-list-pause.svg');
                      background-repeat: no-repeat;
                      background-size: cover;
                      display: inline-block;
                    }
                  }
                }
                .right-describe {
                  padding: 10px 0 10px 10px;
                  width: 280px;
                  .name {
                    width: 120px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                    font-size:14px;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(51,51,51,1);
                    line-height:20px;
                  }
                  .num {
                    font-size:13px;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(245,166,35,1);
                    line-height:18px;
                    padding: 4px 0 25px;
                    span:nth-child(1) {
                      margin-right: 20px;
                    }
                  }
                  .author {
                    font-size:12px;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(153,153,153,1);
                    line-height:17px;
                    span:nth-child(2) {
                      display: inline-block;
                      width: 160px;
                      overflow: hidden;
                      text-overflow:ellipsis;
                      white-space:nowrap;
                    }
                  }
                }
              }
            }
          }
          // 点击加载更多
          .load-more {
            // background-color: rgba(245,166,35,1);
            width: 100%;
            font-size: 16px;
            color: #3C5B6F;
            padding: 20px 0;
            text-align: center;
            span {
              cursor: pointer;
            }
          }
          // 没有内容
          .no-content {
            width: 100%;
            min-height: 700px;
            font-size: 20px;
            color: rgba(7, 7, 7, .5);
            text-align: center;
            line-height: 700px;
          }
        }
      }
    }
  }
}

</style>
