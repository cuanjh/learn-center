<template>
  <section class='user-course-wrap' >
    <div class="user-course-nav">
      <a :class="['user-course-wrap-title', {'active': selTab == 'pro'}]" @click="changeTab('pro')">官方课程</a>
      <a :class="['user-course-wrap-title', {'active': selTab == 'kid'}]" @click="changeTab('kid')">儿童课程</a>
      <a :class="['user-course-wrap-title', {'active': selTab == 'rudio'}]" @click="changeTab('rudio')">电台课程</a>
    </div>
    <div class='user-course-item-wrap' v-show="selTab == 'pro'" :class="{ 'userifloading': judgeLoading  }">
      <div class="user-course-list">
        <div class='user-course-item' v-for='(item, index) in showLangCourses' :key="item.course_code + index">
          <div class="user-course-item-box" @mouseleave="mouseleaveControl($event)">
            <img @click="goToDetails(item.course_code)" :src="item.flag | urlFix('imageView2/0/w/400/h/400/format/jpg')">
            <ol>
              <router-link tag="li" :to="{path: '/app/book-details/' + item.course_code}">
                <span>{{item.name}}</span>
              </router-link>
              <li>
                <span v-text="levelDes[item['current_chapter_code'].split('-')[2]]"></span> - <span v-text="'课程' + (parseInt(item['current_chapter_code'].split('-')[3].replace('Unit', '')) * parseInt(item['current_chapter_code'].split('-')[4].replace('Chapter', '')))"></span>
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
      </div>
      <div class="up-all" v-if="!isShowCourse">
        <div class="up-all-content" v-if="langCourses.length>5">
          <a @click="loadMoreCourse()" v-text="showMoreCourse ? '收起' : '全部展开'"></a>
          <i v-show="!showMoreCourse"></i>
          <i class="active" v-show="showMoreCourse"></i>
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
          </dd>
        </dl>
      </div>
    </div>
    <div class='user-course-item-wrap' v-show="selTab == 'kid'">
      <div class="user-course-list" v-if="langKidCourse.length>0">
        <div class='user-course-item' v-for='(item, index) in langKidCourse' :key="item.code + index">
          <div class="user-course-item-box" @mouseleave="mouseleaveControl($event)">
            <img @click="goToKidDetails(item.code)" :src="item.flag | urlFix('imageView2/0/w/400/h/400/format/jpg')">
            <ol>
              <router-link tag="li" :to="{path: '/app/book-mini-details/' + item.code}">
                <span>{{ !item.name ? '' : item.name['zh-cn'] }}</span>
              </router-link>
              <li>
                <!-- <span v-text="levelDes[item['current_chapter_code'].split('-')[2]]"></span> - <span v-text="'课程' + (parseInt(item['current_chapter_code'].split('-')[3].replace('Unit', '')) * parseInt(item['current_chapter_code'].split('-')[4].replace('Chapter', '')))"></span> -->
              </li>
              <li>
                <span :style="{ width: (item['complete_rate'] * 100) + '%' }"></span>
                <div class="progress-bg">
                  <!-- <div class="progress" :style="{width: (curArchiveCourse['complete_rate'] ? curArchiveCourse['complete_rate']*100 : 0) +'%'}"></div> -->
                </div>
              </li>
              <span class='user-course-del-btn-tag' v-show='showIdx === index ? delBtn : false' @click='deleteCourse(item.code)'><i></i>删除课程</span>
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
                  <li @click="deleteKidCourse(item.code)">
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
      </div>
      <div class="up-all" v-if="langKidCourse.length>0">
        <div>
          <span>已经是全部内容了</span>
        </div>
      </div>
      <div class='user-course-nocourse' v-else>
        <dl>
          <dt></dt>
          <dd>
            <p>您还没有订阅儿童课程哦！</p>
          </dd>
        </dl>
      </div>
    </div>
    <div class='user-radio-course-item-wrap' v-show="selTab == 'rudio'">
      <ul>
        <li class='user-radio-course-item' v-for='item in showRadioCourses' :key="item.course_code">
          <div class="user-radio-course-item-box" @mouseleave="mouseleaveControl($event)">
            <img @click="goToRadioDetail(item.course_code)" :src="item.flag | urlFix('imageView2/0/w/400/h/400/format/jpg')">
            <div class="play">
              <i></i>
            </div>
            <ol>
              <router-link tag="li" :to="{path: '/app/discovery/radio-detail/' + item.course_code}">
                <a>{{item.name}}</a>
              </router-link>
              <li>
                <span v-if="item.author">作者：{{item.author.nickname}}</span>
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
          <a @click="loadMoreRadios()" v-text="showMoreRados?'收起':'全部展开'"></a>
          <i v-show="!showMoreRados"></i>
          <i class="active" v-show="showMoreRados"></i>
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
      showMoreCourse: false,
      showMoreRados: false,
      selTab: 'pro', // pro:官方课程 kid:儿童课程 rudio:电台
      delBtn: false,
      arrowDown: false,
      showIdx: '',
      judgeLoading: false,
      isShowCourse: false,
      isShowRadioCourse: false,
      langCourses: [], // Pro课程
      showLangCourses: [],
      langKidCourse: [], // kid课程
      radioCourseList: [], // 电台课程
      showRadioCourses: []
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
    this.initKidData()
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
      getUserCourseList: 'getUserCourseList',
      getSubCourses: 'getSubCourses' // 新的课程列表接口
    }),
    // 点击切换tab
    changeTab (flag) {
      this.selTab = flag
    },
    deleteCourse (code) {
      console.log(code)
      this.getDeletePurchase(code).then(() => {
        this.initData()
      })
    },
    deleteKidCourse (code) {
      console.log(code)
      this.getDeletePurchase(code).then(() => {
        this.langKidCourse = []
        this.initKidData()
      })
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
      let _this = this
      this.getUserCourseList().then(res => {
        console.log('订阅课程', res)
        _this.langCourses = res.officialCourses
        _this.showLangCourses = _this.showMoreCourse ? _this.langCourses : _this.langCourses.slice(0, 5)
        _this.radioCourseList = res.radioCourses
        _this.showRadioCourses = _this.showMoreRados ? _this.radioCourseList : _this.radioCourseList.slice(0, 5)
        if (this.langCourses.length === 0) {
          this.isShowCourse = true
        }
        if (this.radioCourseList.length === 0) {
          this.isShowRadioCourse = true
        }
      })
    },
    initKidData () {
      this.getSubCourses().then(res => {
        console.log('新的课程列表返回===>', res)
        if (res.success) {
          let learnCourses = res.courses
          learnCourses.forEach(item => {
            if (item.course_type === 3) { // 0:pro 1:电台 2:视频 3: mini
              this.langKidCourse.push(item)
            }
          })
        }
      })
    },
    // 课程加载更多
    loadMoreCourse () {
      this.showMoreCourse = !this.showMoreCourse
      if (this.showMoreCourse) {
        this.showLangCourses = this.langCourses
      } else {
        this.showLangCourses = this.langCourses.slice(0, 5)
      }
    },
    // 电台加载更多
    loadMoreRadios () {
      this.showMoreRados = !this.showMoreRados
      if (this.showMoreRados) {
        this.showRadioCourses = this.radioCourseList
      } else {
        this.showRadioCourses = this.radioCourseList.slice(0, 5)
      }
    },
    // 去课程详情
    goToDetails (courseCode) {
      this.$router.push({path: '/app/book-details/' + courseCode})
    },
    //  儿童课程
    goToKidDetails (item) {
      this.$router.push({path: '/app/book-mini-details/' + item['code']})
    },
    // 去电台详情
    goToRadioDetail (radioCode) {
      this.$router.push({path: '/app/discovery/radio-detail/' + radioCode})
    }
  }
}
</script>

<style lang="less" scoped>
.user-course-wrap {
  position: relative;
}
.user-course-nav {
  width: 100%;
  height: 52px;
  background-color: #ffffff;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #6d6d6d;
  border-bottom: 1px solid #ededed;
  border-radius: 5px 5px 0 0;
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
      font-weight:500;
      color:rgba(200,212,219,1);
      line-height:22px;
    }
  }
}
.user-course-wrap-title {
  float: left;
  height: 52px;
  font-size:16px;
  font-weight:500;
  color:#3C5B6F;
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
  font-size: 18px;
  font-weight: bold;
  color: #2A9FE4;
  border-bottom: 3px solid #2A9FE4;
}
.user-course-item-wrap {
  padding: 8px 0 0;
  background: #fff;
  border-radius: 0 0 5px 5px;
}
.user-course-list .user-course-item {
  margin-right: 0;
  margin-left: 0;
  padding: 0 25px;
}

.user-course-list .user-course-item:last-child .user-course-item-box {
  border-bottom: 0px solid #EEF2F3;
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
  border-bottom: 1px solid #EEF2F3;
}
.user-course-list .user-course-item:last-child .user-course-item-box {
  border-bottom: 0px solid #ffffff!important;
}
.user-course-item-box img {
  cursor: pointer;
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
  margin-top: 6px;
  display: inline-block;
  font-size:14px;
  font-weight:bold;
  color:#333333;
}
.user-course-item-box ol li:nth-of-type(1):hover {
  cursor: pointer;
  color: #2A9FE4;
}

.user-course-item-box ol li:nth-of-type(2) {
  font-size:13px;
  font-weight:500;
  color:#7e929f;
}
.user-course-item-box ol li:nth-of-type(3) {
  width: 200px;
  height: 6px;
  border-radius: 5px;
  background-color: #EEF2F3;
  position: relative;
  margin: 18px 0 0;
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
  border-radius: 0 0 5px 5px;
  padding: 28px 0px 0px;
  ul {
    padding: 0 25px;
  }
}

.user-radio-course-item-wrap .user-radio-course-item {
  height: 100px;
  margin: 21px 0;
  border-bottom: 1px solid #EEF2F3;
}
.user-radio-course-item-wrap .user-radio-course-item:first-child {
  margin-top: 0;
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
  cursor: pointer;
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
  a:hover {
    color: #2A9FE4;
  }
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
    background-color: #3C5B6F;
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
  padding: 8px 0;
}

.user-control-sel ul li {
  text-align: center;
  color: #7E929F;
  font-size: 14px;
  font-weight: 500;
}
.user-control-sel ul li a {
  display: block;
  padding: 6px 0px;
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
  text-align: center;
  padding: 20px 0 0;
  font-size: 18px;
}
.user-course-nocourse dl dd p {
  font-size:16px;
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
