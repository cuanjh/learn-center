<template>
  <div class="radio-search">
    <nav-comp />
    <div class="radio-search-content">
      <div class="left-content">
        <div class="top">
          <p class="text">搜索“<span>{{keywords}}</span>”相关结果</p>
        </div>
        <div class="radio-search-list">
          <div class="list-content">
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
        <star-host-list ></star-host-list>
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
      pageCards: []
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
    console.log(this.keywords)
    this.initRadioSearchList()
    console.log(this.show)
  },
  computed: {
    keywords () {
      let keyWord = sessionStorage.getItem('keyword')
      return keyWord
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
      getRadioSearchList: 'course/getRadioSearchList'
    }),
    // 初始化数据
    async initRadioSearchList () {
      let params = {
        page: this.page,
        page_size: this.AllpageSize,
        key_word: this.keywords
      }
      console.log('params', params)
      await this.getRadioSearchList(params).then(res => {
        console.log('电台列表===》', res)
        if (res.data.radios.length > 0) {
          this.total = res.data.radios.length
          this.cards = res.data.radios
          this.pageCards = this.cards.slice(0, this.pagesize)
          console.log('cards=====>', this.cards)
          console.log('pageCards=====>', this.pageCards)
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
    }
  }
}
</script>
<style lang="less" scoped>
.radio-search {
  width: 1200px;
  margin: 0 auto;
  min-height: 1000px;
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
