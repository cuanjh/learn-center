<template>
  <div>
    <router-link class="banner" :to="{path: '/app/world-map'}">
    <div class="describe">
      <div class="banner-title"></div>
      <p>
        <span>共收录</span>{{langMapNum}}<span>种语言</span>
      </p>
      <p class="button">查看全部</p>
    </div>
    </router-link>
    <div class="book-case">
      <div class="course-box">
        <p class="title">热门课程
          <router-link :to="{path: '/app/hot-courses'}">所有课程</router-link>
        </p>
        <ul class="course-item">
          <li v-for="(item, index) in hotCourse"
            :key="index"
            :class="{'no-margin':(index+1)%5 === 0}"
            @mouseenter="showDetails('hot', index)"
            @mouseleave="hideDetails">
            <img :src="qnUrl(item.flag)" alt="">
            <p class="name-number"><span class="name">{{ item.name }}</span><span class="number">{{ item.buy_num>999999?'999,999+':toThousands(item.buy_num) }}</span></p>
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
      <div class="course-box">
        <p class="title">中国方言地图
          <router-link :to="{path: '/app/china-lang-map'}">所有课程</router-link>
        </p>
        <ul class="course-item">
          <li v-for="(item, index) in chinaLangMap"
            :key="index"
            :class="{'no-margin':(index+1)%5 === 0}"
            @mouseenter="showDetails('china', index)"
            @mouseleave="hideDetails">
            <img :src="qnUrl(item.flag)" alt="">
            <p class="name-number"><span class="name">{{ item.name }}</span><span class="number">{{ item.buy_num>999999?'999999+':item.buy_num }}</span></p>
            <transition name="fade">
              <div class="details" v-show="showDetailsChina === index">
                <p class="desc">{{item.des}}</p>
                <p class="time">课时：{{item.level_num}}课时</p>
                <p class="home-work">作业：{{item.homework_num}}</p>
                <p class="btn" @click="goDetails(item.code)">课程详情</p>
              </div>
            </transition>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
// import Bus from '../../../bus'
export default {
  data () {
    return {
      showDetailsHot: null,
      showDetailsChina: null,
      hotCourse: [], // 热门课程
      chinaLangMap: [], // 中国方言
      langMapBanner: [], // 语言地图banner
      langMapNum: 0 // 收录的语言种类数量
    }
  },
  mounted () {
    this.$parent.$emit('navItem', 'bookcase')
    // 书架首页接口 热门课程、中国方言地图
    this.bookCaseIndex().then(res => {
      console.log(res)
      this.hotCourse = res.data.worldMapCourse.courses
      this.chinaLangMap = res.data.chinaMapCourse.courses
      this.langMapBanner = res.data.langMapBanner
      this.langMapNum = res.data.langMapNum
      localStorage.setItem('langMapNum', this.langMapNum)
    })
  },
  computed: {
    ...mapState({
      subscribeCoursesStr: state => state.course.subscribeCoursesStr
    })
  },
  methods: {
    ...mapActions({
      bookCaseIndex: 'course/bookCaseIndex'
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
    goDetails (courseCode) {
      // let langCode = courseCode.split('-')[0]
      // if (this.subscribeCoursesStr.length === 0) {
      //   this.$router.push({path: '/app/book-details/' + langCode})
      //   return
      // }
      // if (this.subscribeCoursesStr.indexOf(courseCode) > -1) {
      //   Bus.$emit('changeCourseCode', courseCode)
      //   return
      // }
      this.$router.push({path: '/app/book-details/' + courseCode})
    },
    // 数字每三位添加逗号
    toThousands (num) {
      return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    }
  }
}
</script>

<style scoped>
  .banner {
    display: inline-block;
    height: 320px;
    width: 100%;
    background-image: url('../../../../static/images/course/book-case-banner.png');
    background-repeat: no-repeat;
    background-size: cover;
    object-fit: cover;
    margin-top: -12px;
  }

  .banner .describe {
    width: 500px;
    height: 100%;
    margin-left: 30%;
  }

  .banner .describe .banner-title {
    width: 244px;
    height: 72px;
    background-image: url('../../../../static/images/course/book-case-banner-title.png');
    background-repeat: no-repeat;
    background-size: cover;
    object-fit: cover;
    margin-top: 70px;
  }

  .banner .describe > p {
    position: relative;
    top: 60px;
    font-size: 28px;
    color: #b9ec10;
  }

  .banner .describe > p:nth-child(2) {
    top: 20px;
  }

  .banner .describe > p > span {
    color: #6e7a95;
  }

  .banner .describe .button {
    border: 1px solid #6E7A95;
    border-radius: 100px;
    font-size: 15px;
    color: #FFFFFF;
    letter-spacing: 1.05px;
    text-align: center;
    width: 180px;
    height: 38px;
    line-height: 38px;
    background: none;
  }

  .book-case {
    width: 1200px;
    margin: 0px auto;
    padding-bottom: 144px;
  }

  /* .course-box {
    margin-top: 45px;

  } */

  .course-box .title {
    font-size: 20px;
    color: #333333;
    margin: 50px 20px 24px 0;
    font-weight: bold;
  }
  .course-box .title a {
    text-decoration:none;
    font-size: 15px;
    color: #2A9FE4;
    background: url('./../../../../static/images/learn/triangle-blue.png') no-repeat right center;
    background-size: 5px 9px;
    padding-left: 20px;
    padding-right: 10px;
    vertical-align: initial;
    font-weight: bold;
  }
  .course-item {
    overflow: hidden;
  }
  .course-item li {
    display: inline-block;
    width: 200px;
    height: 240px;
    overflow: hidden;
    border-radius: 3px;
    cursor: pointer;
    background: #FFFFFF;
    /* padding: 0px 20px; */
    margin-right: 24px;
    margin-bottom: 30px;
    position: relative;
  }
  .course-item .no-margin {
    margin-right: 0px;
  }
  .course-item li img {
    position: absolute;
    top: 22px;
    right: 18px;
    width:90px;
    height:90px;
    box-shadow:0px 3px 6px 0px rgba(81,120,135,0.18);
    border-radius:8px;
  }
  .course-item li .name-number {
    width: 164px;
    height: 28px;
    line-height: 28px;
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 36px;
    display: flex;
    justify-content: space-between;
  }
  .course-item li .name {
    width: 80px;
    font-size: 18px;
    color: #333333;
    /* position: absolute;
    bottom: 0px; */
    font-weight: bold;
  }
  .course-item li .number {
    font-size: 14px;
    color: #999999;
    overflow: hidden;
    background: url('./../../../../static/images/learn/person.png') no-repeat left center;
    background-size: 18px 15px;
    padding-left: 22px;
    /* position: absolute;
    right: 0px;
    padding-top: 3px; */
    text-align: left;
    font-weight: bold;
  }
  .course-item li .details {
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,.97);
    padding: 22px 18px 0px;
    cursor: pointer;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
  }
  .course-item li .details .desc {
    height: 86px;
    font-size: 12px;
    line-height: 18px;
    color: #333333;
    overflow: hidden;
    margin-bottom: 28px;
    position: relative;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
  }

  /* .course-item li .details .desc::after {
    content:"...";
    font-weight:bold;
    position:absolute;
    bottom:0;
    right:0;
    padding:0 0px 1px 30px;
  } */
  .course-item li .details .time,
  .course-item li .details .home-work {
    /* font-size: 14px;
    color: #999999;
    font-weight: bold; */
    width:88px;
    height:18px;
    font-size:12px;
    font-family:'PingFang-SC-Medium';
    font-weight:500;
    color:rgba(153,153,153,1);
    line-height:18px;
  }
  .course-item li .details .btn {
    width: 96px;
    height: 28px;
    font-size: 12px;
    line-height: 28px;
    text-align: center;
    color: #FFFFFF;
    border-radius: 16px;
    background:rgba(42,159,228,1);
    position: absolute;
    right: 20px;
    bottom: 22px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease
  }
  .fade-enter, .fade-leave-to {
    transform: translateY(100px);
    opacity: 0;
  }
</style>
