<template>
  <div class="header-box">
    <div class="content" >
      <div class="left" @mouseleave='navChangeCourseTwo'>
        <p><img src="./../../../static/images/home/logo.png" alt=""></p>
        <p :class="{ 'header-box-left-active': activeItem === 'course' }" @mouseenter='navChangeCourse' @click='jumpCourse()'>
          学习
          <i class='' :class="{ 'animate-down': navArrowDown, 'animate-up':navArrowUp }"></i>
        </p>
        <router-link tag="p" class="nav-find-btn" :class="{ 'header-box-left-active': activeItem === 'user'  }"  :to="{path: '/app/user'}">
            我的
        </router-link>
        <!-- <p class="nav-find-btn" v-if="memberInfo['is_anonymous']" v-bind:class="{ 'learn-header-left-active': activeItem === 'user'  }"  v-link="{path: '/v2/user/bind'}">我的</p> -->
        <!-- <ul>
          <li @mouseenter="navChangeCourse" @click="jumpToCourse">学习
            <i v-bind:class="{'triangle-up': navArrowUp, 'triangle-down': navArrowDown}"></i>
          </li>
          <li></li>
          <li style="display:none">发现</li>
          <li style="display:none">我的</li>
        </ul> -->
        <transition name="fade">
          <section class='mycourse-wrap mycourse-loginout animated' v-show="navCourse">
            <img class='mycourse-wrap-arrow' src="../../../static/images/course/learn-big-arrow.png">
            <div class="mycourse-container">
              <p>我订阅的课程</p>
              <section>
                <ul>
                  <li  v-for='(course, index) in learnCourse' :key="index" class='mycourse-container-gray disable' :class="{'mycourse-container-light': langCode === course['lan_code'] }">
                    <dl>
                      <dt>
                        <a class='changeColor' @click="changeCourseCode(course['code'])">
                          <img :src="course.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')">
                          <div class='fix-ie-filter-bug'></div>
                        </a>
                      </dt>
                      <dd><span><a>全球说</a></span><span class='mycourse-lang'><a href="">{{ !course.name ? '' : course.name['zh-CN'] }}</a></span></dd>
                    </dl>
                  </li>
                  <li class='learn-courseList-add-more' style="display:none">
                    <router-link :to="{path: '/v2/find'}">
                      <img src="../../../static/images/course/learn-jiahao.png">
                    </router-link>
                  </li>
                </ul>
              </section>
            </div>
          </section>
        </transition>
      </div>
      <div class="right" @mouseleave="hideExit">
        <div class="search" v-bind:class="{'active':searchFlag}">
          <input type="text">
          <i @click="showSearch"></i>
        </div>
        <div class="vip" style="display:none"></div>
        <div class="head-nation" style="display:none">
          <img class="head" src="https://course-assets1.talkmate.com/course/icons/FRE-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1" alt="头像">
          <img class="nation" src="https://course-assets1.talkmate.com/course/icons/IND-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1" alt="国籍">
        </div>
        <div class="notice" style="display:none"><i></i></div>
        <p class='learn-user' @mouseenter="showExit" >
          <a><img :src='userInfo.photo'></a>
          <transition name="fade">
            <span class='user-login-out mycourse-loginout animated' v-show="showExitState">
              <img class='arrow' src="./../../../static/images/course/learn-big-arrow.png">
              <router-link tag="span" :to="{ path: '/app/user/setting' }">设置</router-link>
              <span @click='jumpSystem()'>退出</span>
            </span>
          </transition>
        </p>
      </div>

    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Bus from '../../bus'

export default {
  data () {
    return {
      navArrowUp: false,
      navArrowDown: true,
      searchFlag: false,
      navCourse: false,
      activeItem: '',
      showExitState: false,
      learnCourse: []
    }
  },
  created () {
    this.$on('activeNavItem', (item) => {
      this.activeItem = item
    })
    Bus.$on('changeCourseCode', (courseCode) => {
      this.changeCourseCode(courseCode)
    })
  },
  mounted () {
    console.log(this.userInfo)
    this.getLearnCourses().then(() => {
      console.log(1111)
    })
  },
  computed: {
    ...mapState({
      learnCourses: state => state.course.learnCourses,
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters({
      langCode: 'user/langCode'
    }),
    languagueHander () {
      return this.userInfo.sys_lang
    }
  },
  watch: {
    // 后订阅的在前显示
    learnCourses (newData, oldData) {
      if (newData !== oldData) {
        var _object = []
        for (var i in newData) {
          if (newData[i].code) {
            _object.unshift(newData[i])
          }
        }
        this.learnCourse = _object
      } else {
        this.learnCourse = newData
      }
    }
  },
  methods: {
    ...mapActions({
      getLearnCourses: 'course/getLearnCourses',
      getCurrentCourse: 'course/getCurrentCourse',
      logout: 'user/logout'
    }),
    ...mapMutations({
      updateIsLogin: 'user/updateIsLogin',
      updateCurCourseCode: 'course/updateCurCourseCode'
    }),
    showSearch (e) {
      this.searchFlag = !this.searchFlag
    },
    navChangeCourse () {
      this.navArrowDown = false
      this.navArrowUp = true
      this.navCourse = true
    },
    navChangeCourseTwo () {
      this.navArrowDown = true
      this.navArrowUp = false
      this.navCourse = false
    },
    jumpToCourse () {
      this.$router.push({ path: '/app/course-list' })
    },
    showExit () {
      this.showExitState = true
    },
    hideExit () {
      this.showExitState = false
    },
    jumpSystem () {
      this.logout().then((res) => {
        localStorage.removeItem('device_id')
        localStorage.removeItem('user_id')
        localStorage.removeItem('verify')
        this.$router.push({ path: '/' })
        this.updateIsLogin('0')
      })
    },
    changeCourseCode (courseCode) {
      localStorage.setItem('lastCourseCode', courseCode)
      this.updateCurCourseCode(courseCode)
      this.$parent.$emit('changeCourseCode', courseCode)
    },
    jumpCourse () {
      this.$router.push({ path: '/app/course-list' })
    }
  }
}
</script>

<style scoped>
.header-box {
  width: 100%;
  height: 80px;
  background: #0581d1;
  position: fixed;
  top: 0px;
  z-index: 10;
}
.header-box .content {
  width: 1200px;
  margin: 0px auto;
  position: relative;
}

/* .header-box .left{
  width:60%;
}
.header-box .right{
  width:40%;
} */
.header-box .left>p{
  float: left;
  cursor: pointer;
}
.header-box .left>p:nth-of-type(1){
  width:135px!important;
  min-width:135px!important;
  margin-top: 23px;
}
.header-box .left>p:nth-of-type(1)>img{
  max-width: 200% !important;
}
.header-box .left>p:nth-of-type(2) {
  width:63px!important;
  min-width:63px!important;
}
.left>p:nth-of-type(3),.header-box .left>p:nth-of-type(4) {
  width:80px!important;
  min-width:80px!important;
}
.header-box .left>p:nth-of-type(2),
.header-box .left>p:nth-of-type(3),
.header-box .left>p:nth-of-type(4),
.header-box .left>p:nth-of-type(5){
  margin: 18px 0 15px 24px;
  text-align: center;
  line-height: 30px;
  padding:4px 31px 0 0px;
  color:#87D0FF;
  font-size: 16px;
  position: relative;
  top:3px;
  font-weight: bold;
}
.header-box .left>p:hover{
  color:#fff!important;
}
.header-box-left-active{ /*菜单激活class样式*/
  /*border-radius: 100px;
  background-color: #3c9bbe;*/
  color:#fff !important;
}
.header-box .left>p:nth-of-type(2){
  margin-left: 175px!important;
}
.header-box .left>p:nth-of-type(2) i,.header-box .left>p:nth-of-type(5) i{
  display: inline-block;
  width: 9px;
  height: 6px;
  background: url("./../../../static/images/learn/triangle.png") no-repeat;
  background-size: 9px 6px;
  margin-top: -16px;
  margin-left: 37px;
}

.triangle-up {
  transform: rotate(180deg);
  transition: all 0.3s ease-in-out;
}
.triangle-down {
  transform: rotate(0deg);
  transition: all 0.3s ease-in-out;
}
.right {
  float: right;
}
.right div {
  float: left;
}
.search {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  margin-left: -100px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.4);
  margin-top: 20px;
  padding-right: 44px;
  position: relative;
}
.active {
  animation: widthAdd 0.5s ease 0s;
  animation-fill-mode: forwards;
}
@keyframes widthAdd {
  from {
    width: 44px;
  }
  to {
    width: 240px;
  }
}
.search input {
  width: 100%;
  border: none;
  height: 44px;
  text-indent: 20px;
  font-size: 16px;
  background-color: transparent;
}
.search i {
  width: 44px;
  height: 44px;
  cursor: pointer;
  background: url("./../../../static/images/learn/search.png") no-repeat center
    center;
  background-size: 100%;
  position: absolute;
  top: 0px;
  right: 0px;
}
.vip {
  width: 33px;
  height: 30px;
  background: url("./../../../static/images/learn/vip.png") no-repeat center
    center;
  background-size: 100%;
  margin-top: 25px;
}
.head-nation {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: red;
  margin-top: 15px;
  position: relative;
}
.head-nation .head {
  width: 50px;
  height: 50px;
  border: 1px solid #fff;
  border-radius: 25px;
  position: absolute;
  top: 0px;
  left: 0px;
}
.head-nation .nation {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid #fff;
  position: absolute;
  top: 30px;
  right: -2px;
  z-index: 2;
}
.right .notice {
  width: 20px;
  height: 24px;
  background: url("./../../../static/images/learn/notice.png");
  background-size: 100%;
  margin-top: 28px;
}
.right .notice i {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #d02d02;
  margin-left: 12px;
  margin-top: 2px;
}

.mycourse-wrap {
  position: absolute;
  width: 612px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 9px 0 rgba(112, 112, 112, 0.5);
  top: 65px;
  left: 298px;
  z-index: 9999999;
}

.mycourse-loginout {
  animation-duration: 0.4s;
}

.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  opacity: 1;
}

.mycourse-wrap .mycourse-wrap-arrow {
  position: absolute;
  top: -10px;
  left: 2.1%;
}

.mycourse-wrap > img{
  width: 32px;
  height: 32px;
}
.mycourse-container {
  padding: 12px 30px;
  overflow: hidden;
}
.mycourse-container > p {
  width: 100%;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: #003d5a;
  border-bottom: 1px solid #ededed;
  font-weight: bold;
}

.mycourse-container > section ul > li {
  float: left;
  width: 110px;
  border-bottom: 1px solid #ededed;
  padding: 16px 0;
  cursor: pointer;
}
.mycourse-container > section ul > li.disable dl dt img {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
}
.mycourse-container > section ul > li.disable dl dd span a {
  cursor: default;
  color: #4a4a4a;
}
.mycourse-container > section ul > li.learn-courseList-add-more {
  text-align: center;
  cursor: pointer;
  border: none;
  height: 100px;
}
.mycourse-container > section ul > li.learn-courseList-add-more a img {
  width: 24px;
  height: 36px;
  padding-top: 12px;
}
.mycourse-container > section ul > li dl dt {
  text-align: center;
}
.mycourse-container > section ul > li dl dt a {
  margin: 0 auto;
  width: 40px;
  height: 40px;
  display: inline-block;
  object-fit: contain;
  cursor: pointer;
}
.mycourse-container > section ul > li dl dd {
  font-size: 12px;
  padding-top: 8px;
}
.mycourse-container > section ul > li dl dd span {
  text-align: center;
  display: block;
  font-size: 12px;
  color: #003d5a;
  height: 14px;
  line-height: 14px;
}
.mycourse-container > section ul > li dl a dd span a {
  cursor: pointer;
  color: #003d5a;
}
.mycourse-container > section ul > li dl dt a img {
  margin: 0 auto;
  width: 40px;
  height: 40px;
  display: inline-block;
  object-fit: contain;
  cursor: pointer;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  border-radius: 5px;
}
.mycourse-container > section ul > li dl dt a img:hover {
  box-shadow: 0 0 13px 0 rgba(112, 112, 112, 0.5);
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.mycourse-container-gray img {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
}

.mycourse-container-gray .fix-ie-filter-bug{
  width: 100%;
}

.mycourse-container .disable dd span a {
  color: #4a4a4a;
}

.mycourse-container-light img {
  -webkit-filter: grayscale(0%) !important;
  -moz-filter: grayscale(0%) !important;
  -ms-filter: grayscale(0%) !important;
  -o-filter: grayscale(0%) !important;
  filter: grayscale(0%) !important;
  filter: white !important;
}
.mycourse-container-light dl dd span a{
  color:#003d5a !important;
}

.changeColor > img:hover{
  -webkit-filter: grayscale(0%) !important;
  -moz-filter: grayscale(0%) !important;
  -ms-filter: grayscale(0%) !important;
  -o-filter: grayscale(0%) !important;
  filter: grayscale(0%) !important;
  filter: white !important;
  -webkit-transform:scale(1.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.right .learn-user{
  margin-right: 30px;
  margin-top: 14px;
  width:45px;
  height: 45px;
  padding: 5px;
}

.right .learn-user img {
  width: 45px;
  height: 45px;
  border-radius: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
}
.right p.learn-user{
  position: relative;
}
.right p.learn-user a {
  width: 45px;
  height: 45px;
  display: inline-block;
  border-radius: 100px;
  overflow: hidden;
}

.right .user-login-out {
  position: absolute;
  top: 100%;
  left: -35px;
  width: 110px;
  border-radius: 4px;
  margin-top: 15px;
  background-color: #ffffff;
  box-shadow: 0 2px 9px 0 rgba(112, 112, 112, 0.5);
  padding: 0 6px;
  z-index: 99999;
}
.right .user-login-out .arrow {
  opacity: 1;
  position: absolute;
  top: -9px;
  left: 53px;
  opacity: 1;
  width: 20px;
  height: 20px;
}
.right .user-login-out span{
  display: inline-block;
  width:100%;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  color:#4a4a4a;
  text-align: center;
  background-image: url(./../../../static/images/learn/learn-header-exit-blue.svg);
  background-repeat: no-repeat;
  background-size: 12px;
  background-position: 21px center;
  padding-left: 27px;
  border-bottom: 1px solid #f2f2f2;
}
.right .user-login-out span:nth-of-type(1){
  background-image: url(./../../../static/images/learn/learn-header-setting.svg);
}
.right .user-login-out span:nth-last-of-type(1){
  border:none;
}
.right .user-login-out span:nth-of-type(2):hover{
  color:#3c9bbe;
  background-image: url(./../../../static/images/learn/learn-header-exit.svg);
}
.right .user-login-out span:nth-of-type(1):hover{
  color:#3c9bbe;
  background-image: url(./../../../static/images/learn/learn-header-setting-blue.svg);
}
</style>
