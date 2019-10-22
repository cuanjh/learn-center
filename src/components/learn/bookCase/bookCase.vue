<template>
  <div class="book-case">
    <nav-comp />
    <vip-prompt class="vip"/>
    <div class="hot-course-box">
      <p class="title">儿童课程
      </p>
      <ul class="course-item">
        <li v-for="(item, index) in kidCourse"
          :key="'kid' + index" @click="routerGoKid(item)">
          <div class="imgBox">
            <img :src="qnUrl(item.flag)" alt="">
          </div>
          <p class="name"><span>{{ item.name + 'Mini'}}</span></p>
        </li>
      </ul>
    </div>
    <div class="hot-course-box">
      <p class="title">热门课程
      </p>
      <ul class="course-item">
        <li v-for="(item, index) in hotCourse"
          :key="'hot' + index" @click="routerGo(item)">
          <div class="imgBox">
            <img :src="qnUrl(item.flag)" alt="">
          </div>
          <p class="name"><span>{{ item.name }}</span></p>
        </li>
      </ul>
      <!-- <div class="hot-courses" v-show="false">
        <div class="pre"><i @click="pre()"></i></div>
        <div class="list">
          <ul>
            <li v-for="(item, index) in hotCourse.slice(startIndex, startIndex + 6)"
              :key="index"
              @mouseenter="showDetails('hot', index)"
              @mouseleave="hideDetails">
              <img :src="qnUrl(item.flag)" alt="">
              <p class="name">{{ item.name }}</p>
              <p class="number">{{ item.buy_num>999999?'999,999+':toThousands(item.buy_num) }}</p>
              <transition name="fade">
                <div class="details" v-show="showDetailsHot === index">
                  <p class="desc">{{item.des}}</p>
                  <p class="time">课时：{{item.level_num}}课时</p>
                  <p class="home-work">作业：{{item.homework_num}}</p>
                  <p class="btn" @click="goDetails(item.code)">课程详情</p>
                </div>
              </transition>
            </li>
          </ul>
        </div>
        <div class="next"><i @click="next()"></i></div>
      </div> -->
    </div>
    <div class="course-box">
      <div class="search">
        <i class="search-icon"></i>
        <input type="text" v-model="searchVal" @keyup.enter="search()" placeholder="搜索官方课程" />
        <i @click="searchVal = ''" class="cancel-icon"></i>
      </div>
      <div class="letter-list">
        <a
          @click="changeLetter(item)"
          :class="['letter-item', { 'all': item == '全部' && curLetter == '全部', 'cur': item == curLetter && item != '全部' }]"
          v-for="(item , index) in letterList"
          :key="index">
          {{item}}
        </a>
      </div>
      <ul class="course-item">
        <li v-for="(item, index) in courseLangs"
          :key="index" @click="routerGo(item)">
          <div class="imgBox">
            <img :src="qnUrl(item.flag)" alt="">
          </div>
          <p class="name"><span>{{ item.name }}</span></p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import simplePinyin from 'simple-pinyin'
import VipPrompt from '../../common/vipPrompt.vue'
import NavComp from '../../common/nav.vue'
// import cookie from '../../../tool/cookie'
import Bus from '../../../bus'
export default {
  data () {
    return {
      showDetailsHot: null,
      showDetailsChina: null,
      hotCourse: [], // 热门课程
      startIndex: 0,
      letterList: ['全部', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      curLetter: '全部',
      defaultCourseLangs: [],
      courseLangs: [],
      searchVal: '',
      kidCourse: [] // 儿童课程
    }
  },
  components: {
    VipPrompt,
    NavComp
  },
  mounted () {
    let navList = [
      {id: 1, path: '/app/index', text: '我的学习账户'},
      {id: 2, path: '', text: '官方课程'}
    ]
    Bus.$emit('loadNavData', navList)
    this.$parent.$emit('navItem', 'bookcase')
    let _this = this
    // 书架首页接口 热门课程、中国方言地图
    // this.bookCaseIndex().then(res => {
    //   console.log('课程列表', res)
    //   this.hotCourse = res.data.worldMapCourse.courses
    // })

    this.getLangsList().then(res => {
      console.log('官方课程', res)
      _this.hotCourse = res.courseInfo.hotCourses
      _this.kidCourse = res.courseInfo.kidCourses
      _this.courseLangs = res.courseInfo.listCourses
      this.defaultCourseLangs = _this.courseLangs
    })
  },
  computed: {
    ...mapState({
      subscribeCoursesStr: state => state.course.subscribeCoursesStr
    })
  },
  methods: {
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateIsAnonymous: 'updateIsAnonymous'
    }),
    ...mapActions({
      bookCaseIndex: 'course/bookCaseIndex',
      getLearnInfo: 'course/getLearnInfo',
      getLearnCourses: 'course/getLearnCourses',
      getLangsList: 'getLangsList',
      getUserInfo: 'getUserInfo'
    }),
    qnUrl (url) {
      return url.split('?')[0] + '?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1'
    },
    showDetails (type, index) {
      if (type === 'hot') {
        this.showDetailsHot = index
      } else {
        this.showDetailsChina = index
      }
    },
    hideDetails () {
      this.showDetailsHot = this.showDetailsChina = null
    },
    // goDetails (courseCode) {
    //   this.$router.push({path: '/app/book-details/' + courseCode + '-Basic'})
    // },
    // 数字每三位添加逗号
    toThousands (num) {
      return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },
    pre () {
      if (this.startIndex === 0) {
        return
      }
      this.startIndex--
    },
    next () {
      if (this.startIndex + 6 === this.hotCourse.length + 1) {
        return
      }
      this.startIndex++
    },
    changeLetter (letter) {
      this.curLetter = letter
      if (letter === '全部') {
        this.courseLangs = this.defaultCourseLangs
      } else {
        this.courseLangs = this.defaultCourseLangs.filter((item) => {
          return item.letter === letter
        })
      }
    },
    compareUp (propertyName) {
      // 升序排序
      return (object1, object2) => {
        var value1 = object1[propertyName]
        var value2 = object2[propertyName]
        return value1.localeCompare(value2)
      }
    },
    getUpperLetters () {
      var arr = []
      for (let i = 65; i < 91; i++) {
        arr.push(String.fromCharCode(i))
      }
      return arr
    },
    routerGo (item) {
      console.log('item', item)
      let langCode = item['code']
      // this.$router.push({path: '/app/book-details/' + langCode + '-Basic'})
      this.$router.push({path: '/app/book-details/' + langCode})
    },
    routerGoKid (item) {
      let langCode = item['code']
      this.$router.push({path: '/app/book-mini-details/' + langCode})
    },
    search () {
      this.courseLangs = this.defaultCourseLangs.filter((item) => {
        return item.letter.toUpperCase() === this.searchVal.toUpperCase() || item.pinyin.indexOf(this.searchVal) > -1 || item.name.indexOf(this.searchVal) > -1 || item.lan_code.toUpperCase() === this.searchVal.toUpperCase()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .book-case {
    width: 1200px;
    margin: 0px auto;
    padding-bottom: 144px;
    .vip {
      margin: 40px auto 0;
      width: 900px;
    }
    .hot-course-box {
      margin-top: 40px;
      position: relative;
      .title {
        font-size: 20px;
        color: #333333;
        font-weight: bold;
        width: 944px;
        margin: 0 auto;
        padding: 0 28px 5px;
      }
      // .hot-courses {
      //   overflow: hidden;
      //   .list {
      //     width: 1074px;
      //     height: 245px;
      //     float:left;
      //     overflow:hidden;
      //     position:relative;
      //     padding: 25px 0 20px;
      //   }
      //   .pre {
      //     float:left;
      //     font-size:16px;
      //     width:35px;
      //     text-align:center;
      //     margin: 100px 10px;
      //     i {
      //       width: 18px;
      //       height: 34px;
      //       display: inline-block;
      //       background-image: url('../../../../static/images/bookCase/pre-icon.svg');
      //       background-repeat: no-repeat;
      //       background-size: cover;
      //       cursor: pointer;
      //       &:hover {
      //         background-image: url('../../../../static/images/bookCase/pre-icon-hover.svg');
      //       }
      //     }
      //   }
      //   .next {
      //     float:left;
      //     font-size:16px;
      //     width:50px;
      //     text-align:center;
      //     margin: 100px 10px;
      //     i {
      //       width: 18px;
      //       height: 34px;
      //       display: inline-block;
      //       background-image: url('../../../../static/images/bookCase/next-icon.svg');
      //       background-repeat: no-repeat;
      //       background-size: cover;
      //       cursor: pointer;
      //       &:hover{
      //         background-image: url('../../../../static/images/bookCase/next-icon-hover.svg');
      //       }
      //     }
      //   }
      // }
      // ul {
      //   overflow: hidden;
      //   width: 1200px;
      //   li {
      //     float: left;
      //     width: 180px;
      //     height: 200px;
      //     overflow: hidden;
      //     border-radius: 3px;
      //     cursor: pointer;
      //     background: #FFFFFF;
      //     margin-right: 20px;
      //     margin-bottom: 30px;
      //     position: relative;
      //     vertical-align:top;
      //     line-height:30px;
      //     padding:0 5px;
      //     img {
      //       position: absolute;
      //       top: 20px;
      //       right: 20px;
      //       width:80px;
      //       height:80px;
      //       box-shadow:0px 4px 10px 0px rgba(81,120,135,0.18);
      //       border-radius:6px;
      //     }
      //     .name {
      //       margin-top: 126px;
      //       margin-left: 16px;
      //       font-size: 16px;
      //       color: #333333;
      //       font-weight: 600;
      //     }
      //     .number {
      //       font-size: 12px;
      //       color: #999999;
      //       overflow: hidden;
      //       margin-left: 16px;
      //       background: url('./../../../../static/images/learn/person.png') no-repeat left center;
      //       background-size: 13px 11px;
      //       padding-left: 18px;
      //       text-align: left;
      //       font-weight: 400;
      //     }
      //     .details {
      //       width: 100%;
      //       height: 100%;
      //       background-color: rgba(255,255,255,.97);
      //       padding: 22px 18px 0px;
      //       cursor: pointer;
      //       position: absolute;
      //       top: 0px;
      //       bottom: 0px;
      //       left: 0px;
      //       .desc {
      //         height: 86px;
      //         font-size: 12px;
      //         line-height: 18px;
      //         color: #333333;
      //         font-weight: 400;
      //         overflow: hidden;
      //         margin-bottom: 28px;
      //         position: relative;
      //         word-break: break-all;
      //         display: -webkit-box;
      //         -webkit-box-orient: vertical;
      //         -webkit-line-clamp: 5;
      //         overflow: hidden;
      //       }
      //       .time {
      //         font-size:13px;
      //         font-weight:500;
      //         color:#999999;
      //         line-height:17px;
      //       }
      //       .home-work {
      //         font-size:13px;
      //         font-weight:500;
      //         color:#999999;
      //         line-height:18px;
      //       }
      //       .btn {
      //         height: 28px;
      //         font-size: 13px;
      //         font-weight: 600;
      //         line-height: 28px;
      //         text-align: center;
      //         border-radius: 16px;
      //         color:rgba(42,159,228,1);
      //         position: absolute;
      //         right: 20px;
      //         bottom: 5px;
      //         text-decoration: underline;
      //       }
      //     }
      //   }
      // }
      .course-item {
        width: 944px;
        margin: 0 auto;
        overflow: hidden;
        li {
          float: left;
          cursor: pointer;
          width: 100px;
          height: 122px;
          margin: 0 9px;
          color: #666;
          .imgBox {
            width: 100%;
            height: 80px;
            line-height: 80px;
            text-align: center;
            position: relative;
            img {
              width: 68px;
              height: 68px;
              vertical-align: middle;
              border: 3px solid #e1e1e1;
              border-radius: 8px;
              position: absolute;
              right: 0;
              bottom: 0;
              left: 0;
              margin: auto;
              transition: all .3s;
              -ms-transition: all .3s;
              -o-transition: all .3s;
              -moz-transition: all .3s;
              -webkit-transition: all .3s;
              transform-origin: 30px 60px;
              -ms-transform-origin: 30px 60px;
              -o-transform-origin: 30px 60px;
              -moz-transform-origin: 30px 60px;
              -webkit-transform-origin: 30px 60px;
              cursor: pointer;
              &:hover {
                border: 3px solid #2A9FE4;
              }
            }
          }
          .name {
            height: 36px;
            text-align: center;
            position: relative;
            span {
              display: block;
              width: 100%;
              height: 16px;
              font-size: 14px;
              font-weight: 500;
              position: absolute;
              top: 10px;
              left: 0;
              line-height: 16px;
            }
          }
          &:hover {
            color: #2A9FE4;
          }
        }
      }
    }
    .course-box {
      position: relative;
      margin-top: 85px;
      .search {
        width:844px;
        height:36px;
        background:#F8FAFB;
        border-radius:22px;
        border:1px solid #2A9FE4;
        margin: 0 auto;
        .search-icon {
          width: 15px;
          height: 15px;
          margin-left: 8px;
          margin-top: 9px;
          display: inline-block;
          background-image: url('../../../../static/images/learnIndex/wal-search.svg');
          background-repeat: no-repeat;
          background-size: cover;
        }
        input {
          font-size: 14px;
          font-weight: 500;
          color: #b8b8b8;
          height: 36px;
          width: 784px;
        }
        .cancel-icon {
          width: 11px;
          height: 11px;
          background-image: url('../../../../static/images/bookCase/cancel.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          margin-top: 11px;
          cursor: pointer;
        }
      }
    }
    .letter-list {
      width: 850px;
      margin: 25px auto;
      a {
        font-size:16px;
        font-weight:bold;
        color:#2A9FE4;
        margin-right: 19px;
        display: inline-block;
        text-align: center;
        line-height: 26px;
      }
      .all {
        font-size: 14px;
        width:52px;
        height:26px;
        background:#0581D1;
        color: #fff;
        border-radius:18px;
      }
      .cur {
        width:26px;
        height:26px;
        background:#0581D1;
        color: #fff;
        border-radius:50%;
      }
    }
    .course-item {
      width: 944px;
      margin: 0 auto;
      overflow: hidden;
      li {
        float: left;
        cursor: pointer;
        width: 100px;
        height: 122px;
        margin: 0 9px;
        color: #666;
        .imgBox {
          width: 100%;
          height: 80px;
          line-height: 80px;
          text-align: center;
          position: relative;
          img {
            width: 68px;
            height: 68px;
            vertical-align: middle;
            border: 3px solid #e1e1e1;
            border-radius: 8px;
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            transition: all .3s;
            -ms-transition: all .3s;
            -o-transition: all .3s;
            -moz-transition: all .3s;
            -webkit-transition: all .3s;
            transform-origin: 30px 60px;
            -ms-transform-origin: 30px 60px;
            -o-transform-origin: 30px 60px;
            -moz-transform-origin: 30px 60px;
            -webkit-transform-origin: 30px 60px;
            cursor: pointer;
            &:hover {
              border: 3px solid #2A9FE4;
            }
          }
        }
        .name {
          height: 36px;
          text-align: center;
          position: relative;
          span {
            display: block;
            width: 100%;
            height: 16px;
            font-size: 14px;
            font-weight: 500;
            position: absolute;
            top: 10px;
            left: 0;
            line-height: 16px;
          }
        }
        &:hover {
          color: #2A9FE4;
        }
      }
    }
  }
</style>
