<template>
  <section class='user-course-wrap' >
    <div class="user-course-nav">
      <a :class="['user-course-wrap-title', {'active': selTab}]" @click="selTab = !selTab">官方课程</a>
      <a :class="['user-course-wrap-title', {'active': !selTab}]" @click="selTab = !selTab">电台课程</a>
    </div>
    <div class='user-course-item-wrap' v-show="selTab" :class="{ 'userifloading': judgeLoading  }">
      <div class='user-course-item' v-for='(item, index) in langCourses' :key="item.course_code">
        <div class="user-course-item-box" @mouseleave="mouseleaveControl($event)">
          <img :src="item.flag | urlFix('imageView2/0/w/400/h/400/format/jpg')">
          <ol>
            <router-link tag="li" :to="{path: '/app/book-details/' + item.course_code}">
              <span>{{item.name}}</span>
            </router-link>
            <li>
              <!-- <span v-text="levelDes[item.currentLevel]"></span>-<span v-text="'课程' + (parseInt(item.currentUnit.replace('Unit', '')) * parseInt(item.currentChapter.replace('Chapter', '')))"></span> -->
            </li>
            <li>
              <span :style="{ width: (item['complete_rate'] * 100) + '%' }"></span>
              <div class="progress-bg">
                <!-- <div class="progress" :style="{width: (curArchiveCourse['complete_rate'] ? curArchiveCourse['complete_rate']*100 : 0) +'%'}"></div> -->
              </div>
            </li>
            <span class='user-course-del-btn-tag' v-show='showIdx === index ? delBtn : false' @click='deleteCourse(item.course_code)'><i></i>删除课程</span>
          </ol>
          <div class="user-control">
            <div class="user-control-btn" @mouseenter="mouseoverControl($event)">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="user-control-sel" style="display:none">
              <ul>
                <!-- <li>置顶</li> -->
                <li @click="deleteCourse(item.course_code)">
                  <a>取消订阅</a>
                </li>
              </ul>
              <div class="triangle_border_down">
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="up-all" v-if="!isShowCourse">
        <div class="up-all-content" v-if="langCourses.length>5">
          <a @click="loadMoreCourse()" v-text="showMoreCourse?'全部展开':'收起'"></a>
          <i v-show="showMoreCourse"></i>
          <i class="active" v-show="showMoreCourse === false"></i>
        </div>
        <div v-else>
          <span>已经是全部内容了</span>
        </div>
      </div>
      <div class='user-course-nocourse' v-show="isShowCourse">
        <dl>
          <dt></dt>
          <dd>
            <p>您还没有订阅的课程哦！</p>
            <!-- <p>请到<span v-link="{path: '/v2/find'}">“发现”</span>里订阅您喜欢的课程！</p> -->
          </dd>
        </dl>
      </div>
    </div>
    <div class='user-radio-course-item-wrap' v-show="!selTab">
      <ul>
        <li class='user-radio-course-item' v-for='item in radioCourseList' :key="item.course_code">
          <div class="user-radio-course-item-box" @mouseleave="mouseleaveControl($event)">
            <img :src="item.flag | urlFix('imageView2/0/w/400/h/400/format/jpg')">
            <div class="play">
              <i></i>
            </div>
            <ol>
              <router-link tag="li" :to="{path: '/app/discovery/radio-detail/' + item.course_code}"><span>{{item.name}}</span></router-link>
              <li>
                <span>作者：{{item.author.nickname}}</span>
                <span>
                  <i></i>
                  {{item.buy_num}}
                </span>
                <span v-text="(item.money === 0) ? $t('free') : (item.money_type === 'CNY') ? '￥' + item.money : $t('coins') + ' ' + item.money"></span>
              </li>
            </ol>
            <div class="user-control">
              <div class="user-control-btn" @mouseenter="mouseoverControl($event)">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="user-control-sel" style="display:none">
                <ul>
                  <li>
                    <router-link :to="{path: '/app/discovery/radio-detail/' + item.course_code}">电台分享</router-link>
                  </li>
                  <!-- <li>置顶</li> -->
                  <li @click="deleteCourse(item.course_code)"><a>取消订阅</a></li>
                </ul>
                <div class="triangle_border_down">
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="up-all" v-if="!isShowRadioCourse">
        <div class="up-all-content" v-if="radioCourses.length>5">
          <a @click="loadMoreRadios()" v-text="showMoreRados?'全部展开':'收起'"></a>
          <i v-show="showMoreRados"></i>
          <i class="active" v-show="showMoreRados === false"></i>
        </div>
        <div v-else>
          <span>已经是全部内容了</span>
        </div>
      </div>
      <div class='user-course-nocourse' v-show="isShowRadioCourse">
        <dl>
          <dt></dt>
          <dd>
            <p>你暂没有订阅电台课程</p>
          </dd>
        </dl>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      showMoreCourse: true,
      showMoreRados: true,
      selTab: true,
      delBtn: false,
      arrowDown: false,
      showIdx: '',
      judgeLoading: false,
      isShowCourse: false,
      isShowRadioCourse: false,
      langCourses: [],
      showLangCourses: [],
      radioCourseList: []
    }
  },
  created () {
    this.$on('userItemDisappear', (e) => {
      this.delBtn = e
      this.arrowDown = e
    })
  },
  mounted () {
    this.$parent.$emit('activeNavUserItem', 'course')
    this.$parent.$emit('navItem', 'user')
    this.getLearnCourses()
    this.initData()
    this.getMoreLearnCourses().then(res => {
      console.log('getMoreLearnCourses', res)
      // res.learn_courses.forEach(item => {
      //   if (item.course_type === 0) {
      //     this.langCourses.push(item)
      //   } else if (item.course_type === 1) {
      //     this.radioCourseList.push(item)
      //   }
      // })
      // console.log('=========>', this.radioCourseList)
      // if (this.langCourses.length === 0) {
      //   this.isShowCourse = true
      // }
      // if (this.radioCourseList.length === 0) {
      //   this.isShowRadioCourse = true
      // }
    })
  },
  computed: {
    ...mapState({
      showLoading: state => state.user.showLoading,
      courseShow: state => state.user.courseShow,
      courseRader: state => state.user.courseRader,
      languagueHander: state => state.course.languagueHander,
      learnCourses: state => state.course.learnCourses,
      radioCourses: state => state.course.radioCourses,
      levelDes: state => state.course.levelDes
    }),
    // 订阅的时间越靠后显示靠前
    courseRander () {
      // var _object = []
      var obj = this.learnCourses
      console.log('订阅课程我的页面===', obj)
      if (Object.keys(obj).length > 0) {
        // for (var i in obj) {
        //   _object.unshift(obj[i])
        // }
        if (this.showMoreCourse) {
          return this.learnCourses.slice(0, 5)
        } else {
          return this.learnCourses
        }
      }
      return []
    },
    // 订阅的电台
    radioRander () {
      var obj = this.radioCourses
      console.log('订阅课程我的页面===', obj)
      if (Object.keys(obj).length > 0) {
        if (this.showMoreRados) {
          return this.radioCourses.slice(0, 5)
        } else {
          return this.radioCourses
        }
      }
      return []
    }
  },
  methods: {
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode'
    }),
    ...mapActions({
      getDeletePurchase: 'course/getDeletePurchase',
      getLearnCourses: 'course/getLearnCourses',
      getMoreLearnCourses: 'getMoreLearnCourses',
      getUserCourseList: 'getUserCourseList'
    }),
    deleteCourse (code) {
      this.getDeletePurchase(code)
    },
    mouseoverControl (e) {
      let target = e.target
      /* eslint-disable */
      $(target).siblings().show()
      /* eslint-enable */
    },
    mouseleaveControl (e) {
      /* eslint-disable */
      $('.user-control-sel').hide()
      /* eslint-enable */
    },
    initData () {
      this.getUserCourseList().then(res => {
        console.log('订阅课程', res)
        this.langCourses = res.officialCourses
        this.radioCourseList = res.radioCourses
        if (this.langCourses.length === 0) {
          this.isShowCourse = true
        }
        if (this.radioCourseList.length === 0) {
          this.isShowRadioCourse = true
        }
      })
    },
    // 课程加载更多
    loadMoreCourse () {
      this.showMoreCourse = !this.showMoreCourse
    },
    // 电台加载更多
    loadMoreRadios () {
      this.showMoreRados = !this.showMoreRados
    }
  }
}
</script>

<style lang="less" scoped>
.user-course-wrap {
  // margin-top: 90px;
}
.user-course-nav {
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #6d6d6d;
  border-bottom: 1px solid #ededed;
  border-radius: 4px;
  position: relative;
  padding-left: 25px;
}
.up-all {
  width: 100%;
  background: rgba(221, 221, 221, .1);
  text-align: center;
  line-height: 42px;
  font-size:14px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(42,159,228,1);
  a {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  i {
    display: inline-block;
    width: 10px;
    height: 6px;
    background: url('../../../../static/images/upAll.svg') no-repeat center;
    background-size: cover;
    margin-left: 10px;
  }
  .active {
    display: inline-block;
    width: 10px;
    height: 6px;
    background: url('../../../../static/images/upAllActive.svg') no-repeat center;
    background-size: cover;
    margin-left: 10px;
  }
  .up-all-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .course-related {
    width: 100%;
    min-height: 445px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    i {
      display: inline-block;
      width: 145px;
      height: 82px;
      background-image: url('../../../../static/images/discovery/language-related.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
    span {
      padding-top: 18px;
      font-size:16px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color:rgba(200,212,219,1);
      line-height:22px;
    }
  }
}
.user-course-wrap-title {
  display: inline-block;
  float: left;
  height: 60px;
  font-size:16px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:#3C5B6FFF;
  text-align: center;
  margin-right: 42px;
  // border-right: 1px solid #EEF2F3;
  line-height: 60px;
  border-bottom: 3px solid transparent;
  transition: none;
}

.user-course-wrap-title:last-child {
  border-right: 0;
}
.user-course-wrap-title:hover {
  color: #2A9FE4;
}
.user-course-nav .active {
  color: #0581D1;
  border-bottom: 3px solid #2A9FE4FF;
}
.user-course-item-wrap {
  padding: 0 25px;
  background: #fff;
}
.user-course-item-wrap .user-course-item {
  margin-right: 0;
  margin-left: 0;
  // height: 100px;
  // border-radius: 5px;
  // background-color: #ffffff;
}

.user-course-item-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  padding-bottom: 24px;
  padding-top: 21px;
  border-bottom: 1px solid #EEF2F3FF;
}
.user-course-item-wrap .user-course-item:last-child .user-course-item-box {
  border-bottom: 0px solid #ffffff!important;
}
.user-course-item-box img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  background-color: #E8E8E8;
  object-fit: cover;
}

.user-course-item-box ol {
  margin-left: 18px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.user-course-item-box ol li:nth-of-type(1) {
  display: inline-block;
  font-size:14px;
  font-family:PingFang-SC-Bold;
  font-weight:bold;
  color:#333333;
}
.user-course-item-box ol li:nth-of-type(1):hover {
  cursor: pointer;
  color: #2A9FE4;
}

.user-course-item-box ol li:nth-of-type(2) {
  font-size:13px;
  font-family:PingFang-SC-Medium;
  font-weight:500;
  color:#7e929f;
}
.user-course-item-box ol li:nth-of-type(3) {
  width: 200px;
  height: 6px;
  border-radius: 5px;
  background-color: #EEF2F3;
  position: relative;
  margin: 15px 0;
}
.user-course-item-box ol li:nth-of-type(3) span {
  position: absolute;
  top: 0;
  left: 0;
  /*width:50%;*/
  height: 100%;
  background-color: #91D249;
  border-radius: 5px;
}

.user-radio-course-item-wrap {
  background-color: #ffffff;
  border-radius: 5px;
  padding: 15px 21px 0px;
}

.user-radio-course-item-wrap .user-radio-course-item {
  height: 100px;
  margin: 20px 0;
  border-bottom: 1px solid #EEF2F3;
}

.user-radio-course-item-wrap .user-radio-course-item:last-child{
  border-bottom: 0px solid #EEF2F3 !important;
}

.user-radio-course-item-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
}

.user-radio-course-item-box img {
  width: 157px;
  height: 80px;
  border-radius: 4px;
  background-color: #E8E8E8;
  object-fit: cover;
}
.play {
  position: absolute;
  margin-top: 48px;
  margin-left: 123px;
}

.play i{
  width: 24px;
  height: 24px;
  background-image: url("../../../../static/images/radionoPlay.svg");
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
}
.user-radio-course-item-box ol {
  margin-left: 18px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.user-radio-course-item-box ol li:nth-of-type(1) {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
  cursor: pointer;
  max-width: 500px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.user-radio-course-item-box ol li:nth-of-type(2) {
  font-size: 12px;
  color: #B8B8B8;
  font-weight: 500;
  margin-top: 25px;
}

.user-radio-course-item-box ol li:nth-of-type(2) span {
  margin-right: 15px;
}
.user-radio-course-item-box ol li:nth-of-type(2) span:nth-child(1) {
  display: inline-block;
  width: 96px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.user-radio-course-item-box ol li:nth-of-type(2) span:nth-child(2) i {
  width: 14px;
  height: 12px;
  display: inline-block;
  background-image: url('../../../../static/images/icon-headset.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: 3px;
}

.user-control {
  position: relative;
  float: right;
  margin-right: 50px;
  margin-top: 32px;
}

.user-control-btn {
  cursor: pointer;
}

.user-control-btn span{
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #b9cde2;
}
.user-control-btn:hover {
  span{
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #3C5B6FFF;
  }
}
.user-control-sel {
  bottom: 30px;
  margin-left: -90px;
  position: absolute;
  width:126px;
  background:#FFFFFF;
  box-shadow:0px 2px 6px 0px rgba(60,91,111,0.16);
  border-radius:3px;
  border-bottom: 3px solid #2A9FE4;
}

.user-control-sel ul {
  padding-top: 8px;
  padding-bottom: 8px;
}

.user-control-sel ul li {
  /* text-align: center; */
  color: #7E929F;
  font-size: 14px;
  font-weight: 500;
}
.user-control-sel ul li a {
  display: block;
  padding: 6px 20px;
}
.user-control-sel ul li a:hover {
  background-color: #F5F7F8;
  color: #0A2B40;
}

.user-course-item .user-course-del-btn {
  width: 15.8px;
  height: 9.2px;
  background: url(../../../../static/images/learn/learn-course-arrow.png) no-repeat;
  position: absolute;
  background-position: center center;
  top: 30px;
  right: 30px;
  cursor: pointer;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.user-course-item .arrowDown {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.user-course-item .user-course-del-btn-tag {
  position: absolute;
  width: 84px;
  height: 26px;
  line-height: 26px;
  border-radius: 5px;
  font-size: 12px;
  background-color: #e46773;
  top: 45px;
  right: -36px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  background-image: url(../../../../static/images/learn/learn-course-close.png);
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 14%;
  padding-left: 10px;
}
.userifloading {
  opacity: 0;
}
.user-course-view {
  position: absolute !important;
  left: 55% !important;
  top: 300px !important;
}
.user-course-nocourse {
  margin-top: 16px;
  width: 100%;
  /* height: 176px; */
  min-height: 600px;
  border-radius: 4px;
  background-color: #ffffff;
}
.user-course-nocourse dl {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.user-course-nocourse dl dt {
  width: 144px;
  height: 81px;
  background-image: url('../../../../static/images/discovery/userradiono.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.user-course-nocourse dl dd {
  /* width: 70%;
  height: 100%; */
  text-align: center;
  padding: 20px 0 0;
  font-size: 18px;
}
.user-course-nocourse dl dd p {
  font-size:16px;
  font-family:PingFang-SC-Medium;
  font-weight:500;
  color:rgba(200,212,219,1);
  line-height:22px;
}
.user-course-nocourse dl dd p span {
  color: #e46773;
  cursor: pointer;
}

/*向下*/
.triangle_border_down{
  /* position:relative; */
}
.triangle_border_down span{
  display:block;
  width:0;
  height:0;
  border-width:6px 6px 0;
  border-style:solid;
  border-color:#2A9FE4 transparent transparent;/*黄 透明 透明 */
  position:absolute;
  left: 95px;
}
</style>
