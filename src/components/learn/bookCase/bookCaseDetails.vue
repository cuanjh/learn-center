<template>
  <div class="book-details">
    <div class="nav">
      <div class="nav-circle"></div>
      <router-link :to="{path: '/app/book-case'}">
        <span>书架</span>
      </router-link>
      /
      <router-link :to="{path: '/app/hot-courses'}">
        <span>热门课程</span>
      </router-link>
      /
      <div class="nav-current">
        语言详情
      </div>
    </div>
    <div class="details-header">
      <div class="details-top">
        <div class="details-title">
          <p>世界地图语言</p>
        </div>
        <div class="details-content">
          <div class="container">
            <div class="details-img">
              <img :src="(courseInfo.flag ? courseInfo.flag : '/static/images/bookCase/img_default_maige.png') | urlFix('imageView2/0/w/200/h/200/format/jpg')" :alt="courseInfo.name + '图片'">
            </div>
            <div class="details-resource">
              <p class="details-title">麦格</p>
              <p class="details">{{ courseInfo.name }}课程</p>
              <div class="course-content">
                <ul class="course">
                  <li>
                    <p class="title">课程</p>
                    <p class="number">{{ courseInfo.lesson_num }}课时</p>
                  </li>
                  <li>
                    <p class="title">作业</p>
                    <p class="number">{{ courseInfo.homework_num}}份</p>
                  </li>
                  <li>
                    <p class="title">价格</p>
                    <p class="number">{{ courseInfo.price }}金币/课</p>
                  </li>
                  <li>
                    <p class="title">语言大使</p>
                    <p class="number" v-text="(courseInfo.lang_ambassadors && courseInfo.lang_ambassadors.length > 0) ? courseInfo.lang_ambassadors.join('、') : '招募中'"></p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <a v-if="subscribeCourses.indexOf(courseCode) > -1 && courseInfo.has_course" href="javascript:void(0)" class="button" @click="startLearn()">
            <span>开始学习</span>
          </a>
          <a v-else-if="subscribeCourses.indexOf(courseCode) === -1 && courseInfo.has_course" href="javascript:void(0)" class="button" @click="subscribeCourse()">
            <span>订阅课程</span>
          </a>
          <a v-else href="javascript:void(0)" class="button locked">
            <span>课程建设中</span>
          </a>
        </div>
      </div>
      <div class="tab-item">
        <span v-bind:class="{'active': 'info' == tabFlag}" @click="tabChange('info')">信息</span>
        <span v-bind:class="{'active': 'resource' == tabFlag}" @click="tabChange('resource')" style="display: none">资源</span>
        <span v-bind:class="{'active': 'nation' == tabFlag}" @click="tabChange('nation')">国家</span>
      </div>
    </div>
    <div class="tab-content">
      <ul class="book-info" v-show="'info' == tabFlag">
        <li v-for="(item, key, index) in langInfoObj" :key="index" v-if="item.info">
          <p class="title">{{item.title}}</p>
          <p v-if="key === 'LanguageResources'" class="desc"><a :href="item.info">{{item.info}}</a></p>
          <p v-else class="desc">{{item.info}}</p>
        </li>
      </ul>
      <ul class="book-resource" v-show="'resource' == tabFlag">
        <li v-for="(item, index) in resourceInfoRadios" :key="index">
          <div class="book-img">
            <img :src="item.cover" alt="资源图片">
          </div>
          <div class="book-title">
            <p class="share-title">{{ item.title }}</p>
            <p class="share">{{ item.author_name }}</p>
          </div>
          <div class="icon"></div>
        </li>
        <li v-if="resPage > 1" @click="loadMore()">
          <p class="more">加载更多...</p>
        </li>
      </ul>
      <ul class="book-nation" v-show="'nation' == tabFlag">
        <li v-for="(item, index) in countryInfo" :key="index"  @click="nationDetail(item.code, item.flag, item.name)">
          <div class="nation-img">
            <img :src="item.flag" alt="资源图片">
          </div>
          <div class="nation-title">
            <p>{{ item.name }}</p>
          </div>
          <!-- <router-link :to="{ path: '/app/nation-details/' + item.code }" class="nation-icon"></router-link> -->
          <a class="nation-icon" @click="nationDetail(item.code, item.flag, item.name)"></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../bus'

export default {
  data () {
    return {
      tabFlag: 'info', // true 语言信息 false 资源 电台
      langInfoObj: { // 目前只显示这几项 info为空代表后端没有这个信息
        'AlternateNames': {
          title: '别称',
          info: ''
        },
        'ISO_639_3': {
          title: 'ISO 639-3',
          info: ''
        },
        'Population': {
          title: '使用人口',
          info: ''
        },
        'Location': {
          title: '使用地区',
          info: ''
        },
        'Dialects': {
          title: '方言',
          info: ''
        },
        'LanguageUse': {
          title: '使用范围',
          info: ''
        },
        'LanguageDevelopment': {
          title: '语言发展情况',
          info: ''
        },
        'LanguageResources': {
          title: 'OLAC资源',
          info: ''
        }
      },
      courseInfo: {},
      countryInfo: {},
      resourceInfoRadios: [],
      resPage: 1
    }
  },
  mounted () {
    console.log(this.$route)
    this.langInfo({lang_code: this.courseCode}).then(res => {
      console.log('res', res)
      for (var item in res.langInfo) {
        if (this.langInfoObj[item]) {
          this.langInfoObj[item]['info'] = res.langInfo[item]['info']
        }
      }
      this.courseInfo = res.courseInfo
      console.log('courseInfo', this.courseInfo)
      this.countryInfo = res.countryInfo
      this.resourceInfoRadios = res.resourceInfo.radios
      this.resPage = res.resourceInfo.page
      console.log(res)
    })
  },
  computed: {
    ...mapState({
      subscribeCoursesStr: state => state.course.subscribeCoursesStr
    }),
    courseCode () {
      return this.$route.params.courseCode
    },
    subscribeCourses () {
      let sc = this.subscribeCoursesStr
      if (!sc) {
        sc = localStorage.getItem('subscribeCoursesStr')
      }
      return sc
    }
  },
  methods: {
    ...mapActions({
      langInfo: 'course/langInfo',
      getShelfResList: 'course/getShelfResList',
      postPurchaseCourse: 'course/postPurchaseCourse',
      getLearnCourses: 'course/getLearnCourses'
    }),
    tabChange (tabFlag) {
      this.tabFlag = tabFlag
    },
    nationDetail (code, flag, name) {
      let OBJ = {
        'flag': flag,
        'name': name
      }
      let jsonStr = JSON.stringify(OBJ)
      localStorage.setItem('nationInfos', jsonStr)
      this.$router.push({ path: `/app/nation-details/${code}` })
    },
    loadMore () {
      let _this = this
      _this.getShelfResList({ page: _this.resPage }).then((res) => {
        res.resourceInfo.radios.forEach((item) => {
          _this.resourceInfoRadios.push(item)
        })
        _this.resPage = res.page
      })
    },
    startLearn () {
      let courseCode = this.courseCode + '-Basic'
      Bus.$emit('changeCourseCode', courseCode)
      setTimeout(() => {
        this.$router.push({path: '/app/course-list'})
      }, 1000)
    },
    subscribeCourse () {
      this.postPurchaseCourse({ code: this.courseCode.toUpperCase() + '-Basic' }).then((res) => {
        this.getLearnCourses()
      })
    }
  }

}
</script>

<style scoped>
  .book-details {
    width: 1200px;
    margin: 0px auto 144px;
  }
  a {
    text-decoration:none;
  }

  .nav {
    margin: 20px 0;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
  }

  .nav-circle {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background-color: #999999;
    display: inline-block;
    margin-top: 9px;
  }

  .nav span {
    color: #999999;
  }

  .nav-current {
    display: inline-block;
    color: #2A9FE4;
  }

  .details-header {
    width: 100%;
    height: 302px;
    border-radius: 3px;
    box-shadow: 0px 2px 4px #DAE6F3;
    background-color: #fff;
    padding: 18px 36px 0px;
    position: relative;
    background-image: url('../../../../static/images/bookCase/bg-earth.png');
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: 210px 210px;
  }
  .details-top {
    width: 100%;
    height: 30px;
  }
  .details-top .details-title {
    /* width: 144px; */
    height: 30px;
    font-size: 24px;
    color: #2A9FE4;
  }
  .details-top .details-title p {
    line-height: 30px;
  }
  .details-top .details-content {
    height: 180px;
    /* border-bottom: 1px solid #EAEAEA; */
    margin: 10px 10px;
  }
  .details-top .details-content .container {
    /* width: 80%; */
    height: 100%;
    border-bottom: 1px solid #EAEAEA;
    padding-left: 0px;
  }
  .details-top .details-content .details-img {
    display: inline-block;
    width: 295px;
    height: 147px;
  }
  .details-top .details-content .details-img img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
  .details-top .details-content .details-resource {
    display: inline-block;
  }
  .details-top .details-content p {
    padding-left: 20px;
    font-size: 24px;
    color: #444444;
  }
  .details-top .details-content .details-title {
    margin-bottom: 5px;
  }
  .details-top .details-content .details-resource .course-content {
    /* width: 500px; */
    height: 50px;
    margin-top: 34px;
  }
  .details-top .details-content .details-resource .course-content .course {
    /* display: flex;
    justify-content: space-between; */
  }
  .details-top .details-content .details-resource .course-content .course li {
    display: inline-block;
    margin-right: 40px;
    height: 100%;
  }
  .details-top .details-content .details-resource .course-content .course li .title{
    font-size: 14px;
    color: #999999;
  }
  .details-top .details-content .details-resource .course-content .course li .number{
    font-size: 16px;
    color: #2A9FE4;
  }
   .details-top .details-content .button {
      width: 170px;
      height: 50px;
      background: #2A9FE4;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 50px;
      position: absolute;
      right: 6%;
      top: 35%;
      border-radius: 30px;
      box-shadow: 0px 5px 10px 0px #999999;
   }
   .details-top .details-content .button:hover {
     background: rgba(11, 108, 224, .6)
   }

  .locked {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    -webkit-filter: gray;
    filter: gray;
  }
  .tab-item {
    overflow: hidden;
    position: absolute;
    bottom: 0px;
    margin-left: 10px;
  }
  .tab-item span {
    float: left;
    display: block;
    font-size: 16px;
    color: #333333;
    cursor: pointer;
    margin-right: 68px;
    padding: 0px 2px 12px;
  }
  .tab-item .active {
    color: #0581D1;
    border-bottom: 4px solid #0581D1;
    /* transition: all .5s linear; */
  }
  .tab-content {
    border-radius: 3px;
    background-color: #fff;
    /* box-shadow: 0px 2px 4px #DAE6F3; */
    padding: 25px 36px 22px 46px;
    margin-top: 20px;
  }

  .book-info {
    min-height: 630px;
  }
  .book-info  li {
    margin-bottom: 34px;
  }
  .book-info .title {
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #EBEBEB;
    padding-bottom: 12px;
  }
  .book-info .desc {
    width: 852px;
    font-size: 16px;
    color: #999999;
    margin-top: 12px;
  }
  .book-info .desc a {
    color: #0581D1;
  }
  .book-resource {
    width: 100%;
    min-height: 630px;
    padding: 0px 40px 10px;
  }
  .book-resource li {
    position: relative;
    width: 100%;
    padding: 25px 0;
    border-bottom: 1px solid #EBEBEB;
  }
  .book-resource li .book-img {
    display: inline-block;
    width: 100px;
    height: 50px;
  }
  .book-resource li .book-img img{
    width: 100px;
    height: 50px;
    border-radius: 2px;
    object-fit: cover;
  }
  .book-resource li .book-title {
    display: inline-block;
    font-size: 14px;
    padding-left: 15px;
  }
  .book-resource li .book-title .share-title {
    color: #444444;
    font-weight: bold;
  }
  .book-resource li .book-title .share {
    color: #999999;
  }
  .book-resource li .icon {
    position: absolute;
    margin-top: 16px;
    right: 0;
    display: inline-block;
    width: 10px;
    height: 18px;
    background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
    background-size: 10px 18px;
  }

  .book-resource li:last-child {
    border: 0;
  }
  .book-nation {
    width: 100%;
    min-height: 630px;
    padding: 0px 40px 10px;
  }
  .book-nation li {
    position: relative;
    width: 100%;
    padding: 25px 0;
    border-bottom: 1px solid #EBEBEB;
    cursor: pointer;
  }
  .book-nation li .nation-img {
    display: inline-block;
    width: 100px;
    height: 50px;
  }
  .book-nation li .nation-img img{
    width: 100px;
    height: 50px;
    border-radius: 2px;
    box-shadow: 0px 4px 6px rgba(36, 87, 120, 0.21)
  }
  .book-nation li .nation-title {
    display: inline-block;
    font-size: 14px;
    color: #444444;
    padding-left: 15px;
    line-height: 50px;
  }
  .book-nation li .nation-icon {
    position: absolute;
    margin-top: 16px;
    right: 0;
    display: inline-block;
    width: 10px;
    height: 18px;
    background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
    background-size: 10px 18px;
  }

  .book-nation li:last-child {
    border: 0px;
  }

  .more {
    text-align: center;
    cursor: pointer;
  }
</style>
