<template>
  <div class="header-box">
    <div class="content" >
      <div class="left" @mouseleave='navChangeCourseTwo'>
        <router-link tag="p" :to="{path: '/app/index'}"><img src="./../../../static/images/home/logo.png" alt=""></router-link>
        <p v-show="false" :class="{ 'header-box-left-active': activeItem === 'course' }" @mouseenter='navChangeCourse' @click='jumpCourse()'>
          学习
          <i class='' :class="{ 'animate-down': navArrowDown, 'animate-up':navArrowUp }"></i>
        </p>
        <router-link v-show="false" tag="p" class="nav-find-btn" :class="{ 'header-box-left-active': activeItem === 'discovery'  }"  :to="{path: '/app/discovery'}">
          发现
        </router-link>
        <router-link v-show="false" :class="{ 'header-box-left-active': activeItem === 'bookcase' }" tag="p" class="nav-find-btn" :to="{path: '/app/book-case'}">
          书架
        </router-link>
        <router-link v-show="false" tag="p" class="nav-find-btn" :class="{ 'header-box-left-active': activeItem === 'user'  }"  :to="{path: '/app/user'}">
          我的
        </router-link>
        <router-link tag="span"  :to="{ path: '/app/user/bind' }" class='learn-login-right-tips-probation learn-login-right-tips-probation-modify' v-show="isAnonymous">您是试用账号<span>去绑定</span></router-link>
        <!-- 课程列表 -->
        <transition name="fade">
          <section class='mycourse-wrap mycourse-loginout animated' v-show="navCourse">
            <img class='mycourse-wrap-arrow' src="../../../static/images/course/learn-big-arrow.png">
            <div class="mycourse-container">
              <p>我订阅的课程</p>
              <section>
                <ul>
                  <li  v-for='(course, index) in learnCourse' :key="index"
                    class='mycourse-container-gray disable'
                    :class="{'mycourse-container-light': true }">
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
                  <li class='learn-courseList-add-more'>
                    <router-link :to="{path: '/app/book-case'}">
                      <img src="../../../static/images/course/learn-jiahao.png">
                    </router-link>
                  </li>
                </ul>
              </section>
            </div>
          </section>
        </transition>
      </div>
      <div class="right" @mouseleave="hideExit" v-if="userInfo.member_info">
        <div class="container" v-show="false">
          <input type="text" placeholder="在此搜索需要的语言" v-model.trim="searchUserCourse" @keyup.enter="enterSearch">
          <div class="search" @click="enterSearch"></div>
        </div>
        <router-link :to="{path: '/app/user/vip'}"  :class="{'vip-img': isVip === 1, 'unvip-img': isVip !== 1}"></router-link>
        <search-course ref="search" :searchUserCourse="searchUserCourse" v-show="courseDetailShow" @hideLangList="hideLangList"></search-course>
        <!-- <div class="head-nation" style="display:none">
          <img class="head" src="https://course-assets1.talkmate.com/course/icons/FRE-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1" alt="头像">
          <img class="nation" src="https://course-assets1.talkmate.com/course/icons/IND-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1" alt="国籍">
        </div> -->
        <div class='learn-user' @mouseenter="showExit" >
          <a>
            <img :src='userInfoImg' />
            <span v-show="isActive" class="active"></span>
          </a>
          <transition name="fade">
            <span class='user-login-out mycourse-loginout animated' v-show="showExitState">
              <img class='arrow' src="./../../../static/images/course/learn-big-arrow.png">
              <router-link tag="span" :to="{ path: '/app/user/setting' }">设置</router-link>
              <span @click='jumpSystem()'>退出</span>
            </span>
          </transition>
        </div>
        <!-- <div class="notice"><i></i></div> -->
      </div>

    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Bus from '../../bus'
import cookie from '../../tool/cookie'
import SearchCourse from '../common/find/searchCourse'

export default {
  data () {
    return {
      navArrowUp: false,
      navArrowDown: true,
      navCourse: false,
      activeItem: '',
      showExitState: false,
      learnCourse: [],
      searchUserCourse: '',
      courseDetailShow: false,
      isActive: false,
      isAnonymous: false,
      domainName: 'https://uploadfile1.talkmate.com'
    }
  },
  components: {
    SearchCourse
  },
  created () {
    this.$on('activeNavItem', (item) => {
      this.activeItem = item
    })
    // Bus.$on('changeCourseCode', (courseCode) => {
    //   this.changeCourseCode(courseCode)
    // })
  },
  mounted () {
    console.log('用户图片是否正常显示', this.userInfoImg)
    // this.getLearnCourses()
    this.isAnonymous = cookie.getCookie('is_anonymous') === 'true'
    console.log(this.isAnonymous)
    this.getUserInfo()
    // console.log('订阅课程======', this.learnCourses)
  },
  computed: {
    ...mapState({
      learnCourses: state => state.course.learnCourses,
      userInfo: state => state.userInfo
    }),
    ...mapGetters({
      langCode: 'user/langCode'
    }),
    isVip () {
      if (!this.userInfo.member_info) {
        return 0
      }
      console.log('header', this.userInfo.member_info.member_type)
      return this.userInfo.member_info.member_type
    },
    ui () {
      let ui = this.userInfo
      if (Object.keys(ui).length === 0) {
        ui = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      return ui
    },
    userInfoImg () {
      let photoURL = this.ui.photo
      if (photoURL.indexOf(this.domainName) === -1) { // 没有出现
        return this.domainName + '/' + photoURL
      }
      return photoURL
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
        console.log('learnCourse', this.learnCourse)
        this.learnCourse = newData
      }
    },
    searchUserCourse () {
      if (this.searchUserCourse.length <= 0) {
        this.courseDetailShow = false
      } else {
        this.courseDetailShow = true
      }
    },
    // 监听路由变化
    $route (to, from) {
      console.log('监听路由变化：', this.$route.path)
      if (this.$route.path.indexOf('/user/') > -1) {
        this.isActive = true
      } else {
        this.isActive = false
      }
    }
  },
  methods: {
    ...mapActions({
      getLearnCourses: 'course/getLearnCourses',
      getCurrentCourse: 'course/getCurrentCourse',
      logout: 'user/logout',
      getUserInfo: 'getUserInfo'
    }),
    ...mapMutations({
      updateIsLogin: 'user/updateIsLogin',
      updateCurCourseCode: 'course/updateCurCourseCode'
    }),
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
      Bus.$emit('changeCourseCode', courseCode)
    },
    jumpCourse () {
      this.$router.push({ path: '/app/course-list' })
    },
    enterSearch () {
      this.$refs['search'].$emit('enterSearch')
    },
    hideLangList () {
      this.searchUserCourse = ''
      this.courseDetailShow = false
    }
  }
}
</script>

<style scoped>
.header-box {
  width: 100%;
  height: 62px;
  background: #2A9FE4;
  position: fixed;
  top: 0px;
  z-index: 99999;
}
.header-box .content {
  width: 1200px;
  height: 62px;
  margin: 0px auto;
  position: relative;
}

.header-box .left{
  display: inline-block;
  height: 62px;
}
.header-box .right{
  display: inline-block;
  width: 133px;
  height: 62px;
  margin-right: 18px;
}
.header-box .left>p{
  float: left;
  cursor: pointer;
}
.header-box .left>p:nth-of-type(1){
  width:172px!important;
  min-width:172px!important;
  height: 24px;
  margin-top: 22px;
}
.header-box .left>p:nth-of-type(1)>img{
  max-width: 100%!important;
  max-height: 100%!important;
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
  text-align: center;
  padding:22px 28px 0 0;
  color:#87D0FF;
  /* color: #fff; */
  font-size: 16px;
  position: relative;
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
  margin-left: 66px!important;
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
  position: absolute;
  top: 0;
  right: 0;
}
.right div {
  float: left;
}
.right .vip-img {
  display: inline-block;
  position: absolute;
  top: 20px;
  right: 42px;
  background: url('../../../static/images/course/course-vip-big.svg') no-repeat;
  background-size: cover;
  width: 26px;
  height: 26px;
  margin-right: 20px;
}

.right .unvip-img {
  display: inline-block;
  position: absolute;
  top: 20px;
  right: 42px;
  background: url('../../../static/images/course/course-unvip-big.svg') no-repeat;
  background-size: cover;
  width: 26px;
  height: 26px;
  margin-right: 20px;
}
.active {
  animation: widthAdd 1s ease-in-out;
  animation-fill-mode: forwards;
  transform: translateX(-200px);
}
.container {
  position: absolute;
  margin: auto;
  top: 2px;
  right: 113px;
  bottom: 0;
  width: 238px;
  height: 36px;
}
.container .search {
  position: absolute;
  margin-left: 200px;
  top: 7px;
  right: 6px;
  bottom: 0;
  width: 24px;
  height: 22px;
  /* background: rgba(255,255,255,.4); */
  border-radius: 50%;
  transition: all 1s;
  z-index: 4;
}
.container .search:hover {
  cursor: pointer;
}
.container .search::before {
  content: "";
  position: absolute;
  margin: auto;
  top: 8px;
  right: 0;
  bottom: 0;
  left: 12px;
  width: 8px;
  height: 2px;
  background: white;
  transform: rotate(45deg);
  transition: all .5s;
}
.container .search::after {
  content: "";
  position: absolute;
  margin: auto;
  top: -4px;
  right: 0px;
  bottom: 0;
  left: -1px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
  transition: all .5s;
}
.container input {
  font-size: 14px;
  color: #fff;
  background-color: transparent;
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 63px;
  width: 238px;
  height: 36px;
  outline: none;
  text-decoration: none;
  border: none;
  background: rgba(255,255,255,.4);
  color: white;
  padding: 0 80px 0 20px;
  border-radius: 20px;
  /* box-shadow: 0 2px 4px 0 rgba(255,255,255,.4); */
  transition: all 1s;
  opacity: 0;
  z-index: 5;
  font-weight: bolder;
}
.container input:focus{ outline:none; border:0;}
.container input[type="text"]{-moz-appearance: textfield;}
.container input:hover {
  cursor: pointer;
}
.container input:focus {
  cursor: text;
  width: 238px;
  opacity: 1;
}
.container input:focus ~ .search {
  /* right: -200px; */
  z-index: 6;
  background: rgba(255,255,255,0);
}
.container input:focus ~ .search::before {
  content: "";
  position: absolute;
  margin: auto;
  top: 8px;
  right: 0;
  bottom: 0;
  left: 12px;
  width: 8px;
  height: 2px;
  background: white;
  transform: rotate(45deg);
  transition: all .5s;
}
.container input:focus ~ .search::after {
  content: "";
  position: absolute;
  margin: auto;
  top: -4px;
  right: 0px;
  bottom: 0;
  left: -1px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
  transition: all .5s;
}
.container input::placeholder {
  color: #B4DFFC;
  font-size: 14px;
  font-weight: bolder;
}

.vip {
  width: 33px;
  height: 30px;
  background: url("./../../../static/images/learn/vip.png") no-repeat center
    center;
  background-size: 100%;
  margin-top: 25px;
}
/* .head-nation {
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
  width: 24px;
  height: 22px;
  border-radius: 10px;
  border: 1px solid #fff;
  position: absolute;
  top: 30px;
  right: -2px;
  z-index: 2;
} */
.right .notice {
  width: 24px;
  height: 22px;
  margin-left: 20px;
}
.right .notice i {
  display: inline-block;
  width: 24px;
  height: 22px;
  background: url("./../../../static/images/learn/notice.png")  no-repeat center;
  background-size: cover;
}
/* .right .notice i {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #d02d02;
  margin-left: 12px;
  margin-top: 2px;
} */

.mycourse-wrap {
  position: absolute;
  width: 612px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 9px 0 rgba(112, 112, 112, 0.5);
  top: 56px;
  left: 226px;
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
  left: 6%;
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
.mycourse-container > section ul > li dl dd span:nth-child(1) {
  margin-bottom: 6px;
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
  transform:scale(1.2);
  -webkit-transform:scale(1.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.right .learn-user{
  width: 34px;
  height: 34px;
  position: absolute;
  right: 0;
  top: 16px;
}

.right .learn-user a img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.learn-user .active {
  height: 4px;
  width: 4px;
  background-color: #fff;
  position: absolute;
  margin-left: 215px;
  margin-top: 4px;
  border-radius: 50%;
}

.right .user-login-out {
  position: absolute;
  top: 100%;
  left: -44px;
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
  top: -12px;
  left: 51px;
  opacity: 1;
  width: 20px;
  height: 20px;
}
.right .user-login-out span{
  display: inline-block;
  width:100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color:#4a4a4a;
  text-align: center;
  background-image: url(./../../../static/images/learn/learn-header-exit-blue.svg);
  background-repeat: no-repeat;
  background-size: 12px;
  background-position: 21px center;
  padding-left: 27px;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
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

.learn-login-right-tips-probation{
  position: absolute;
  top:15px;
  right:95px;
  width: 220px;
  height: 30px;
  color:#fff;
  line-height: 30px;
  text-align: center;
  border-radius: 100px;
  padding-left: 20px;
  background-color: #7bc16b;
  font-size: 16px;
  cursor:pointer;
  background-image: url(../../../static/images/learn/learn-probation.svg);
  background-repeat:no-repeat;
  background-position: 20px center;
}
.learn-login-right-tips-probation span {
  margin-left: 4px;
  text-decoration: underline;
}
.learn-login-right-tips-probation:hover{
  background-color: #6ab359;
}

.learn-login-right-tips-probation-modify{
  float: right;
  margin-top: 3px;
  margin-right: 50px;
}

@media screen and (max-width: 1024px) {
  .header-box .content {
    width: 960px;
  }
}
</style>
