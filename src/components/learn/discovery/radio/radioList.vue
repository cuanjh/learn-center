<template>
  <div class="radio-classification">
    <div class="classification">
      <div class="nav">
        <router-link :to="{path: '/app/index'}">
          <span>我的学习账户</span>
        </router-link>
        >
        <router-link :to="{path: '/app/discovery/radio-home'}">
          <span>电台</span>
        </router-link>
        >
        <!-- <router-link :to="{path: '/app/discovery/home'}">
          <span>以前的电台首页</span>
        </router-link> -->
        <div class="nav-current">
          分类
        </div>
      </div>
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
              <div class="tab">
                <p  v-for="(item, index) in langCodesSel" :key="item.lan_code + index"
                    :class="{'active': isSelStateCode == index }"
                    @click="changeState(item, index)">
                  <span>{{item.text}}</span>
                </p>
              </div>
            </div>
            <div class="header-content">
              <span class="column">共{{lists.length}}个电台节目</span>
              <div class="new">
                <span
                      v-for="(item, index) in isHot"
                      :key="index"
                      v-text="item.text"
                      :class="{'active': onActive == item.type}"
                      @click="changeIsHot(item)"></span>
              </div>
            </div>
          </div>
          <!-- 下面的内容区 -->
          <div class="describe-content" v-if="lists.length > 0">
            <div class="describe-lists">
              <ul>
                <li v-for="(radio, index) in lists" :key="index+radio.code">
                  <div class="item-img">
                    <img v-lazy="radio.cover" :key="radio.cover" alt="电台的图片">
                    <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                      <i class="play"></i>
                    </div>
                  </div>
                  <div class="right-describe">
                    <router-link tag="p" class="name" :to="{path: '/app/discovery/radio-detail/' + radio.code}">{{radio.title}}</router-link>
                    <p class="num">
                      <span><i></i>{{radio.buy_num}}次试听</span>
                      <span v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></span>
                    </p>
                    <p class="author">
                      <span>作者：</span>
                      <span v-text="radio.author_name ? radio.author_name : '用户' + radio.talkmate_id"></span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 点击加载更多 -->
            <div class="load-more">
              <span v-if="showPage === -1">已显示全部内容</span>
              <!-- <span @click="loadMore()" v-else>点击加载更多</span> -->
            </div>
          </div>
          <div class="no-content" v-show="lists.length === 0">
            <span>没有相关电台的课程</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../../bus'
import $ from 'jquery'

export default {
  data () {
    return {
      isHot: [{type: 'hot', text: '热播', id: 0}, {type: 'new', text: '最新', id: 1}],
      onActive: 'hot',
      isSelStateCode: 0,
      selState: {},
      flag: true,
      buyCoins: false,
      isActive: 410,
      menuRadioNavs: [], // 电台导航
      lists: [], // 更多电台列表
      page: 1, // 页码
      menu_type: '',
      menu_id: '',
      showPage: 0,
      buyRadio: {}
    }
  },
  mounted () {
    this.isActive = this.courseOrder ? this.courseOrder : 410
    this.postDisvRadio().then((res) => {
      console.log('电台首页', res)
      this.menuRadioNavs = res.data.menuRadios
      for (var i = 0; i < this.menuRadioNavs.length; i++) {
        let item = this.menuRadioNavs[i]
        // 遍历时根据返回的数据给nav传对应的值
        if (item.list_order === this.isActive) {
          this.tabChange(item)
          break
        }
      }
    })
    this.getLangCodes()
    console.log('selState', this.selState)
    window.addEventListener('scroll', this.handleScroll())
  },
  computed: {
    ...mapState({
      langCodesSel: state => state.langCodesSel,
      userInfo: state => state.userInfo // 用户信息
    }),
    isVip () {
      if (!this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    },
    courseOrder () {
      return this.$route.params.itemId
    }
  },
  methods: {
    ...mapActions({
      getLangCodes: 'getLangCodes', // 语言相关
      postDisvRadio: 'course/postDisvRadio',
      getRadioList: 'course/getRadioList'
    }),
    // 导航切换
    tabChange (item) {
      console.log('item', item)
      console.log('langCodesSel====', this.langCodesSel)
      let _this = this
      _this.selState = _this.langCodesSel[0]
      _this.isSelStateCode = 0
      _this.page = 1
      _this.onActive = 'hot'
      _this.flag = true
      _this.isActive = item.list_order
      _this.menu_type = item.menu_type
      _this.menu_id = item.menu_id
      let params = {
        menu_type: _this.menu_type,
        menu_id: _this.menu_id,
        page: _this.page,
        preferred_lan_code: _this.selState.lan_code,
        sort: _this.onActive
      }
      console.log('params', params)
      _this.getRadioList(params).then((res) => {
        console.log('切换导航电台列表返回', res)
        _this.lists = res.data.radios
        _this.showPage = res.data.page
        console.log('==>>>>>>>', _this.showPage)
      })
    },
    // 加载更多
    loadMore () {
      if (this.showPage === -1) {
        return false
      }
      if (Object.keys(this.selState).length === 0) {
        this.selState = this.langCodesSel[0]
      }
      let lanCode = this.selState['lan_code']
      this.page++
      let params = {
        menu_type: this.menu_type,
        menu_id: this.menu_id,
        page: this.page,
        preferred_lan_code: lanCode,
        sort: this.onActive
      }
      console.log('点击加载更多params', params)
      this.getRadioList(params).then((res) => {
        console.log('点击加载更多', res)
        this.lists = this.lists.concat(res.data.radios)
        if (res.data.page === -1) {
          this.showPage = res.data.page
        }
      })
    },
    handleScroll () {
      let before = $(window).scrollTop() // 判断滚动条向下滚动
      $(window).scroll(() => {
        let after = $(window).scrollTop()
        if (before < after) {
          before = after
          if (this.showPage === -1) {
            return false
          }
          if (Object.keys(this.selState).length === 0) {
            this.selState = this.langCodesSel[0]
          }
          let lanCode = this.selState['lan_code']
          this.page++
          let params = {
            menu_type: this.menu_type,
            menu_id: this.menu_id,
            page: this.page,
            preferred_lan_code: lanCode,
            sort: this.onActive
          }
          console.log('点击加载更多params', params)
          this.getRadioList(params).then((res) => {
            console.log('点击加载更多', res)
            this.lists = this.lists.concat(res.data.radios)
            if (res.data.page === -1) {
              this.showPage = -1
            }
          })
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
    },
    // 切换课程
    changeState (item, index) {
      console.log(this.menu_type, this.menu_id, item.lan_code)
      this.selState = item
      this.isSelStateCode = index
      this.page = 1
      this.onActive = 'hot'
      let params = {
        menu_type: this.menu_type,
        menu_id: this.menu_id,
        page: this.page,
        preferred_lan_code: item.lan_code,
        sort: this.onActive
      }
      console.log('切换母语params', params)
      this.getRadioList(params).then((res) => {
        console.log('切换母语', res)
        this.lists = res.data.radios
      })
    },
    // 切换热度
    changeIsHot (item) {
      console.log('热度', item)
      console.log('selState', this.selState)

      this.onActive = item.type
      this.page = 1
      let params = {
        menu_type: this.menu_type,
        menu_id: this.menu_id,
        page: this.page,
        preferred_lan_code: this.selState.lan_code,
        sort: this.onActive
      }
      console.log('切换热度', params)
      this.getRadioList(params).then((res) => {
        console.log('切换热度', res)
        this.lists = res.data.radios
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
  .nav {
    position: fixed;
    background-color: #f6f8f9;
    width: 100%;
    height: 60px;
    font-size:14px;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:rgba(60,91,111,1);
    line-height:60px;
    z-index: 99;
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
    // margin-top: 20px;
    width: 100%;
    // 左边导航
    .radio-nav {
      position: fixed;
      display: inline-block;
      width: 220px;
      margin-top: 60px;
      .nav-list {
        background: #ffffff;
        width: 100%;
        height: 100%;
        ul {
          width: 100%;
          height: 100%;
          li {
            font-size:14px;
            font-family:PingFang-SC-Medium;
            color:rgba(60,91,111,1);
            line-height:20px;
            padding: 11px 26px;
            border-bottom: 1px solid rgba(230,235,238,1);
            &.active {
              background: #2A9FE4;
              color: #ffffff;
              i {
                background: url('../../../../../static/images/radioListjiantouhover.svg') no-repeat center;
                background-size: cover;
              }
            }
            &:hover {
              background: #2A9FE4;
              color: #ffffff;
              i {
                background: url('../../../../../static/images/radioListjiantouhover.svg') no-repeat center;
                background-size: cover;
              }
            }
            a {
              position: relative;
              display: block;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              i {
                display: inline-block;
                width: 8px;
                height: 11px;
                background: url('../../../../../static/images/radioListjiantou.svg') no-repeat center;
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
      margin-left: 234px;
      width: 960px;
      padding-bottom: 50px;
      background: #ffffff;
      margin-top: 60px;
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
              font-size:13px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(60,91,111,1);
              line-height:18px;
              margin: 20px 0 46px;
              display: flex;
              p {
                margin-right: 10px;
                padding: 8px 20px;
                border:1px solid rgba(217,223,226,1);
                border-radius: 5px;
                &:hover {
                  border:1px solid #2A9FE4;
                  span {
                    color: #2A9FE4;
                  }
                }
                &.active {
                  border:1px solid #2A9FE4;
                  span {
                    color: #2A9FE4;
                  }
                }
              }
              span {
                cursor: pointer;
                font-size:13px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(60,91,111,1);
                line-height:18px;
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
              span {
                font-size:14px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:#3C5B6FFF;
                padding-right: 20px;
                &:hover {
                  cursor: pointer;
                  color: #2A9FE4FF;
                }
                &.active {
                  color: #2A9FE4FF;
                }
              }
            }
          }
        }
        // 下面的内容区
        .describe-content {
          padding: 0px 43px 19px;
          width: 100%;
          min-height: 260px;
          overflow-y: auto;
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
                    object-fit: cover;
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
                }
                .right-describe {
                  padding: 10px 0 10px 10px;
                  width: 280px;
                  .name {
                    cursor: pointer;
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
                    display: flex;
                    font-size:12px;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    // color:rgba(245,166,35,1);
                    color: #999999FF;
                    line-height:18px;
                    padding: 4px 0 25px;
                    span:nth-child(1) {
                      display: flex;
                      align-items: center;
                      margin-right: 20px;
                      i {
                        display: inline-block;
                        width: 13px;
                        height: 10px;
                        background: url('../../../../../static/images/listening.png') no-repeat center;
                        background-size: cover;
                        margin-right: 8px;
                      }
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
        // 没有相关电台
        .no-content {
          padding: 0 43px;
        }
      }
    }
  }
}
</style>
