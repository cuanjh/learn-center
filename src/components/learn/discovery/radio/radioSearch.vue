<template>
  <div class="radio-search">
    <nav-comp />
    <div class="radio-search-input">
      <input class="search-input" type="text" placeholder="输入电台名称" v-model="searchKey"  @keyup.enter="goSearch">
      <div class="icon-search" @click="goSearch()">
        <i ></i>
      </div>
    </div>
    <div class="history-list">
      <ul>
        <li v-for="(item, index) in historyList" :key="index" @click="goSearchHistory(item)" :class="{'active': item == searchKey}">
          <a href="javascript:;">{{item}}</a>
        </li>
      </ul>
    </div>
    <div class="radio-search-content">
      <div class="left-content">
        <div class="top">
          <p class="text">搜索“<span>{{currentKey}}</span>”相关结果</p>
        </div>
        <div class="radio-search-list">
          <div class="list-content" v-if="pageCards.length>0">
            <div class="item" v-for="(radio, index) in pageCards" :key="index">
              <div class="item-left">
                <div class="play-radio">
                  <img @click="goDetail(radio.code)" v-lazy="radio.cover" :key="radio.cover" alt="">
                  <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                    <i class="play"></i>
                  </div>
                </div>
                <div class="text-author">
                  <router-link tag="p" class="title" :to="{path: '/app/discovery/radio-detail/' + radio.code}"><span>{{radio.title}}</span></router-link>
                  <p class="author-text">
                    <span>作者：{{radio.author_name}}</span>
                    <span><i></i>{{radio.buy_num}}</span>
                    <span v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' + radio.money : $t('coins') + ' ' + radio.money"></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="no-content" v-else>
            <div class="no-list">
              <i></i>
              <span>没有相关的电台</span>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="page" v-show="show">
          <div class="pagelist">
            <a class="jump" :class="{disabled:pstart}" @click="jumpOnPage()">上一页</a>
            <a v-show="currentPage>5" class="jump" @click="jumpPage(1)">1</a>
            <span class="ellipsis" v-show="efont">...</span>
            <a class="jump"
                  :class="{bgprimary:currentPage==num}"
                  v-for="(num, index) in indexs"
                  :key="index"
                  @click="jumpPage(num)"
                  >{{num}}</a>
            <span class="ellipsis" v-show="ebehind">...</span>
            <a class="jump" :class="{disabled:pend}" @click="jumpDowPage()">下一页</a>
          </div>
        </div>
      </div>
      <div class="right-content">
        <star-host-list :teacherLists="teacherLists"></star-host-list>
        <introduce-app-box></introduce-app-box>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import NavComp from '../../../common/nav.vue'
import Bus from '../../../../bus'
import StarHostList from '../../../common/starHostList.vue'
import IntroduceAppBox from '../../../common/introduceAppBox.vue'

export default {
  data () {
    return {
      total: 0, // 获取后端的数据总条数
      pagesize: 5, // 一页显示5条
      currentPage: 1, // 当前页
      listOrder: 1, // 排序方向， 默认值是1＝从小到大;-1=从大到小
      page: 1, // 页码， 默认值是1
      AllpageSize: 50000, // 每一页的数量，默认值是16
      cards: [],
      pageCards: [],
      teacherLists: [],
      searchKey: '', // 搜索关键字
      currentKey: '',
      historyList: []
    }
  },
  components: {
    StarHostList,
    IntroduceAppBox,
    NavComp
  },
  mounted () {
    let navList = [
      {id: 1, path: '/app/index', text: '我的学习账户'},
      {id: 2, path: '/app/discovery/radio-home', text: '电台'},
      {id: 3, path: '', text: '搜索'}
    ]
    Bus.$emit('loadNavData', navList)
    console.log(this.searchKey)
    if (this.keywords) {
      this.searchKey = this.keywords
      this.currentKey = this.keywords
    }
    this.historyList = JSON.parse(localStorage.getItem('HistoryList'))
    this.initRadioSearchList(this.keywords)
    console.log(this.show)
    this.postDisvRadio().then((res) => {
      this.teacherLists = res.data.authors
    })
  },
  computed: {
    keywords () {
      let HistoryList = JSON.parse(localStorage.getItem('HistoryList'))
      console.log('HistoryList', HistoryList)
      if (HistoryList.length > 0) {
        return HistoryList[0]
      }
      return ''
    },
    pages () { // 总页数
      return Math.ceil(this.total * 1 / this.pagesize)
    },
    // 显示页码条
    show () {
      return this.pages && this.pages !== 1
    },
    // 限制上一页不能点击
    pstart () {
      return this.currentPage === 1
    },
    // 限制下一页不能点击
    pend () {
      return this.currentPage === this.pages
    },
    // ...的显示
    efont () {
      if (this.pages <= 7) return false
      return this.currentPage > 5
    },
    // ...的隐藏
    ebehind () {
      if (this.pages <= 7) return false
      var nowAy = this.indexs
      return nowAy[nowAy.length - 1] !== this.pages
    },
    /* eslint-disable */
    // 一共有多少页
    indexs () {
      var left = 1
      var right = this.pages
      var ar = []
      if (this.pages >= 7) {
        if (this.currentPage > 5 && this.currentPage < this.pages - 4) {
          left = Number(this.currentPage) - 3
          right = Number(this.currentPage) + 3
        } else {
          if (this.currentPage <= 5) {
            left = 1
            right = 7
          } else {
            right = this.pages
            left = this.pages - 6
          }
        }
      }
      while (left <= right) {
        ar.push(left)
        left++
      }
      return ar
    }
    /* eslint-disable */
  },
  methods: {
    ...mapActions({
      getRadioSearchList: 'course/getRadioSearchList',
      postDisvRadio: 'course/postDisvRadio' // 电台首页
    }),
    // 初始化数据
    async initRadioSearchList (a) {
      let params = {
        page: this.page,
        page_size: this.AllpageSize,
        key_word: a
      }
      console.log('params', params)
      this.currentKey= a
      await this.getRadioSearchList(params).then(res => {
        console.log('电台列表===》', res)
        if (res.data.radios.length > 0) {
          this.total = res.data.radios.length
          this.cards = res.data.radios
          this.pageCards = this.cards.slice(0, this.pagesize)
          console.log('cards=====>', this.cards)
          console.log('pageCards=====>', this.pageCards)
        } else {
          this.pageCards = []
        }
      })
    },
    // 前端加分页调用的方法
    jumpPage (num) {
      console.log('this.currentPage', this.currentPage)
      this.currentPage = num
      console.log('currentPage', this.currentPage)
      this.pageCards = this.cards.slice((this.currentPage - 1) * this.pagesize, this.currentPage*this.pagesize)
      console.log('this.pageCards', this.pageCards)
    },
    // 点击上一页
    jumpOnPage () {
      this.currentPage--
      this.pageCards = this.cards.slice((this.currentPage - 1) * this.pagesize, this.currentPage*this.pagesize)
    },
    // 点击下一页
    jumpDowPage () {
      this.currentPage++
      this.pageCards = this.cards.slice((this.currentPage - 1) * this.pagesize, this.currentPage*this.pagesize)
    },
    // 点击搜索
    goSearch () {
      if (this.searchKey === '') {
        let obj = {
          className: 'warnIcon',
          description: '输入内容不能为空',
          btnDesc: '确定',
          isLink: false
        }
        Bus.$emit('showCommonModal', obj)
        return false
      }
      this.SearchVal(this.searchKey)
      this.historyList = JSON.parse(localStorage.getItem('HistoryList'))
    },
    SearchVal (val) {
      val = val.trim() // 清除空格
      let HistoryList = JSON.parse(localStorage.getItem('HistoryList'))
      if (HistoryList.length > 0) { // 有数据的话 判断
        if (HistoryList.indexOf(val) !== -1) { // 有相同的，先删除 再添加
          HistoryList.splice(HistoryList.indexOf(val), 1)
          HistoryList.unshift(val)
        } else { // 没有相同的 添加
          HistoryList.unshift(val)
        }
      } else { // 没有数据 添加
        HistoryList.unshift(val)
      }
      if (HistoryList.length > 6) { // 保留六个值
        HistoryList.pop()
      }
      localStorage.setItem('HistoryList', JSON.stringify(HistoryList))
      this.initRadioSearchList(this.searchKey)
    },
    // 搜索历史标签
    goSearchHistory (key) {
      this.searchKey= key
      this.initRadioSearchList(key)
      this.historyList = JSON.parse(localStorage.getItem('HistoryList'))
    },
    // 详情页面
    goDetail (code) {
      this.$router.push({
        path: `/app/discovery/radio-detail/${code}`
      })
    }
  }
}
</script>
<style lang="less" scoped>
.radio-search {
  width: 1200px;
  margin: 0 auto;
  min-height: 1000px;
  .radio-search-input {
    position: relative;
    .search-input {
      width: 880px;
      height: 40px;
      border: 1px solid #2A9FE4;
      border-radius: 30px;
      margin: 20px 0;
      padding: 0 60px;
    }
    .icon-search {
      width: 40px;
      height: 40px;
      position: absolute;
      left: 20px;
      top: 20px;
      display: flex;
      align-items: center;
      &:hover {
        cursor: pointer;
      }
    }
    .icon-search i {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('../../../../../static/images/headline/icon-search-radio.png') no-repeat center;
      background-size: cover;
    }
  }
  .history-list {
    width: 880px;
    margin-bottom: 20px;
    ul {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      li {
        width: auto;
        a {
          display: inline-block;
          padding: 6px 18px;
          line-height: 12px;
          margin-right: 8px;
          word-break: break-all;
          text-decoration: none;
          border: 1px solid #ccc;
          border-radius: 12px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #4d4d4d;
          &:hover {
            color: #2A9FE4;
            border: 1px solid #2A9FE4;
          }
        }
        &.active {
          a {
            color: #2A9FE4;
            border: 1px solid #2A9FE4;
          }
        }
      }
    }
  }
  .radio-search-content {
    width: 100%;
    display: flex;
    .left-content {
      position: relative;
      width: 880px;
      background: #ffffff;
      margin-right: 20px;
      padding: 30px 42px;
      .top {
        .text {
          font-size: 20px;
          color: #333;
          font-weight: bold;
          span {
            color: #2A9FE4;
          }
        }
      }
      .radio-search-list {
        padding-top: 40px;
        .list-content {
          .item {
            padding: 20px 0;
            border-top: 1px solid #EEF2F3FF;
            .item-left {
              display: flex;
              align-items: center;
              .play-radio {
                display: inline-block;
                position: relative;
                display: block;
                width: 152px;
                height: 80px;
                margin-right: 16px;
                img {
                  cursor: pointer;
                  width: 100%;
                  height: 100%;
                  border-radius: 4px;
                  object-fit: cover;
                }
                .gradient-layer-play {
                  cursor: pointer;
                  width: 24px;
                  height: 24px;
                  position: absolute;
                  bottom: 5px;
                  right: 5px;
                  text-align:  center;
                  z-index: 2;
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
              }
              .text-author {
                display: inline-block;
                padding: 10px 0;
                p {
                  display: block;
                }
                .title {
                  width: 160px;
                  cursor: pointer;
                  font-size: 14px;
                  color: #333333FF;
                  font-weight: bold;
                  padding-bottom: 26px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
                .author-text {
                  font-size: 12px;
                  color: #B8B8B8FF;
                  span:nth-child(1) {
                    display:inline-block;
                    width: 132px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                  }
                  span:nth-child(2) {
                    display: inline-block;
                    padding-left: 10px;
                    min-width: 100px;
                    i {
                      display: inline-block;
                      width: 18px;
                      height: 12px;
                      background-image: url('../../../../../static/images/listening.png');
                      background-repeat: no-repeat;
                      background-size: cover;
                      margin: 2px 10px 0 0;
                    }
                  }
                }
              }
            }
            .more-icon {
              i {
                display: inline-block;
                width: 16px;
                height: 10px;
                background-image: url('../../../../../static/images/radioPlay.svg');
                background-repeat: no-repeat;
                background-size: cover;
                cursor: pointer;
              }
            }
          }
          .item:first-child {
            padding-top: 0px;
            border-top: 0px;
          }
          .item:last-child {
            border-bottom: 0px solid #ffffff;
          }
        }
        .no-content {
          width: 100%;
          height: 400px;
          margin-top: 10%;
          .no-list {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            i {
              display: inline-block;
              width: 144px;
              height: 80px;
              background-image: url('../../../../../static/images/discovery/userradiono.svg');
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
            }
            span {
              padding-top: 20px;
              font-size: 16px;
              font-weight: 500;
              color: #c8d4db;
              line-height: 22px;
            }
          }
        }
      }
    }
    .right-content {
      width: 280px;
    }
  }
}
.page {
  width: 100%;
  .pagelist {
    width: 100%;
    text-align: center;
    padding-top: 47px;
    span, .jump {
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      text-align: center;
      line-height: 16px;
      margin: 0 19px 0 0;
      &:hover {
        color: #0581D1FF;
      }
    }
    .bgprimary {
      cursor: default;
      display: inline-block;
      width: 16px;
      height: 16px;
      color: #fff;
      background: #2A9FE4FF;
      border-radius: 2px;
    }
    .jump.disabled {
      pointer-events: none;
    }
  }
}
</style>
