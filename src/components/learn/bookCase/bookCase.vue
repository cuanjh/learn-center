<template>
  <div>
    <router-link class="banner" :to="{path: '/app/world-map'}">
    <div class="describe">
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
      let langCode = courseCode.split('-')[0]
      // if (this.subscribeCoursesStr.length === 0) {
      //   this.$router.push({path: '/app/book-details/' + langCode})
      //   return
      // }
      // if (this.subscribeCoursesStr.indexOf(courseCode) > -1) {
      //   Bus.$emit('changeCourseCode', courseCode)
      //   return
      // }
      this.$router.push({path: '/app/book-details/' + langCode})
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
  }
  .banner .describe {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .banner .describe > p {
    position: relative;
    left: 555px;
    top: 160px;
    font-size: 28px;
    color: #b9ec10;
  }
  @media only screen and (min-width: 1900px) {
    .describe {
      width: 1200px !important;
    }
    .describe > p {
      left: 118px;
      top: 177px
    }
  }
  .banner .describe > p:nth-child(2) {
    top: 206px;
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
    padding-top: 4px;
    padding-bottom: 144px;
  }

  .course-box {
    margin-top: 45px;
  }

  .course-box .title {
    font-size: 30px;
    color: #333333;
    margin: 30px 0;
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
  }
  .course-item {
    overflow: hidden;
  }
  .course-item li {
    float: left;
    width: 220px;
    height: 265px;
    overflow: hidden;
    border-radius: 3px;
    cursor: pointer;
    background: #FFFFFF;
    padding: 0px 20px;
    margin-right: 24px;
    margin-bottom: 30px;
    position: relative;
  }
  .course-item .no-margin {
    margin-right: 0px;
  }
  .course-item li img {
    float: right;
    width: 100px;
    height: 100px;
    box-shadow: 0 5px 12px rgba(81,120,135,0.18);
    border-radius: 8px;
    margin-top: 18px;
  }
  .course-item li .name-number {
    width: 180px;
    height: 28px;
    line-height: 28px;
    position: absolute;
    top: 170px;
  }
  .course-item li .name {
    width: 80px;
    font-size: 20px;
    color: #333333;
    position: absolute;
    bottom: 0px;
  }
  .course-item li .number {
    font-size: 15px;
    color: #999999;
    overflow: hidden;
    background: url('./../../../../static/images/learn/person.png') no-repeat left center;
    background-size: 18px 15px;
    padding-left: 22px;
    position: absolute;
    right: 0px;
    padding-top: 3px;
    text-align: left;
  }
  .course-item li .details {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 25px 20px 0px;
    cursor: pointer;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
  }
  .course-item li .details .desc {
    height: 100px;
    font-size: 14px;
    color: #333333;
    overflow: hidden;
    margin-bottom: 15px;
    position: relative;
  }

  .course-item li .details .desc::after {
    content:"...";
    font-weight:bold;
    position:absolute;
    bottom:0;
    right:0;
    /* padding:0 0px 1px 30px; */
  }
  .course-item li .details .time,
  .course-item li .details .home-work {
    font-size: 14px;
    color: #999999;
  }
  .course-item li .details .btn {
    width: 106px;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    color: #FFFFFF;
    border-radius: 15px;
    background: #2A9FE4;
    position: absolute;
    right: 22px;
    bottom: 24px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease
  }
  .fade-enter, .fade-leave-to {
    transform: translateY(100px);
    opacity: 0;
  }
</style>
