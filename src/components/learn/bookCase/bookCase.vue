<template>
  <div>
    <div class="banner">
      <input type="button" value="发现更多语言">
    </div>
    <div class="book-case">
      <div class="course-box">
        <p class="title">热门课程<span>所有课程</span></p>
        <ul class="course-item">
          <li v-for="(item, index) in hotCourse"
            :key="index"
            :class="{'no-margin':(index+1)%5 === 0}"
            @mouseenter="showDetails('hot', index)"
            @mouseleave="hideDetails">
            <img :src="qnUrl(item.flag)" alt="">
            <p class="name-number"><span class="name">{{ item.name }}</span><span class="number">{{ item.buy_num>999999?'999999+':item.buy_num }}</span></p>
            <div class="details animated fadeIn" v-show="showDetailsHot === index">
              <p class="desc">{{item.des}}</p>
              <p class="time">课时：{{item.level_num}}课时</p>
              <p class="home-work">作业：{{item.homework_num}}</p>
              <p class="btn" @click="goDetails(item.code)">课程详情</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="course-box">
        <p class="title">中国方言地图<span>所有课程</span></p>
        <ul class="course-item">
          <li v-for="(item, index) in chinaLangMap"
            :key="index"
            :class="{'no-margin':(index+1)%5 === 0}"
            @mouseenter="showDetails('china', index)"
            @mouseleave="hideDetails">
            <img :src="qnUrl(item.flag)" alt="">
            <p class="name-number"><span class="name">{{ item.name }}</span><span class="number">{{ item.buy_num>999999?'999999+':item.buy_num }}</span></p>
            <div class="details animated fadeIn" v-show="showDetailsChina === index">
              <p class="desc">{{item.des}}</p>
              <p class="time">课时：{{item.level_num}}课时</p>
              <p class="home-work">作业：{{item.homework_num}}</p>
              <p class="btn" @click="goDetails(item.code)">课程详情</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import http from './../../../api/bookCase.js'
export default {
  data () {
    return {
      showDetailsHot: null,
      showDetailsChina: null,
      hotCourse: [], // 热门课程
      chinaLangMap: [], // 中国方言
      langMapBanner: [] // 语言地图banner
    }
  },
  mounted () {
    http.bookCaseIndex().then(res => {
      this.hotCourse = res.data.worldMapCourse.courses
      this.chinaLangMap = res.data.chinaMapCourse.courses
      this.langMapBanner = res.data.langMapBanner
    })
  },
  methods: {
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
    goDetails (code) {
      this.$router.push({ path: `/course/book-details/${code}` })
    }
  }
}
</script>

<style scoped>
  .banner {
    height: 320px;
    width: 100%;
    background-image: url('../../../../static/images/course/book-case-banner.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .banner > input {
    position: relative;
    border: 1px solid #6E7A95;
    border-radius: 100px;
    left: 550px;
    top: 220px;
    font-size: 15px;
    color: #FFFFFF;
    letter-spacing: 1.05px;
    text-align: center;
    width: 180px;
    height: 38px;
    background: none;
  }

  .book-case {
    width: 1200px;
    margin: 0px auto;
    padding-top: 4px;
    padding-bottom: 144px;
  }

  .course-box .title {
    font-size: 30px;
    color: #333333;
    margin-bottom: 16px;
  }
  .course-box .title span {
    font-size: 15px;
    color: #2A9FE4;
    background: url('./../../../../static/images/learn/triangle-blue.png') no-repeat right center;
    background-size: 5px 9px;
    padding-left: 20px;
    padding-right: 10px;
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
    width: 124px;
    height: 124px;
    box-shadow: 0 5px 12px rgba(81,120,135,0.18);
    border-radius: 8px;
    margin-top: 18px;
  }
  .course-item li .name-number {
    width: 180px;
    height: 28px;
    line-height: 28px;
    position: absolute;
    top: 200px;
  }
  .course-item li .name {
    width: 80px;
    font-size: 20px;
    color: #333333;
    position: absolute;
    bottom: 0px;
  }
  .course-item li .number {
    width: 84px;
    font-size: 15px;
    color: #999999;
    overflow: hidden;
    background: url('./../../../../static/images/learn/person.png') no-repeat left center;
    background-size: 18px 15px;
    padding-left: 22px;
    position: absolute;
    right: 0px;
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
</style>
