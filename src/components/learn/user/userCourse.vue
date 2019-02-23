<template>
  <section class='user-course-wrap' >
    <div class="user-course-nav">
      <p :class="['user-course-wrap-title', {'active': selTab}]" @click="selTab = !selTab">官方课程</p>
      <p :class="['user-course-wrap-title', {'active': !selTab}]" @click="selTab = !selTab">电台课程</p>
    </div>
    <div class='user-course-item-wrap' v-show="selTab" :class="{ 'userifloading': judgeLoading  }">
      <div class='user-course-item' v-for='(item, index) in courseRander' :key="index">
        <div class="user-course-item-box" @mouseleave="mouseleaveControl($event)">
          <img :src="item.flag | urlFix('imageView2/0/w/400/h/400/format/jpg')">
          <ol>
            <router-link tag="li" :to="{path: '/app/book-details/' + item.code}"><span>{{item.name[languagueHander]}}</span></router-link>
            <li><span v-text="levelDes[item.currentLevel]"></span>-<span v-text="item.currentChapter.replace('Chapter', '课程')"></span></li>
            <li><span :style="{ width: item['complateRate'] }"></span></li>
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
                <li @click="deleteCourse(item.code)">取消订阅</li>
              </ul>
              <div class="triangle_border_down">
                <span></span>
              </div>
            </div>
          </div>
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
      <div class='user-radio-course-item' v-for='(item, index) in radioCourses' :key="index">
        <div class="user-radio-course-item-box" @mouseleave="mouseleaveControl($event)">
          <img :src="item.flag | urlFix('imageView2/0/w/400/h/400/format/jpg')">
          <div class="play">
            <i></i>
          </div>
          <ol>
            <router-link tag="li" :to="{path: '/app/discovery/radio-detail/' + item.code}"><span>{{item.module_name}}</span></router-link>
            <li>
              <span>作者：{{item.author_info.nickname}}</span>
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
                <!-- <li>置顶</li> -->
                <li @click="deleteCourse(item.code)">取消订阅</li>
              </ul>
              <div class="triangle_border_down">
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='user-course-nocourse' v-show="isShowRadioCourse">
        <dl>
          <dt></dt>
          <dd>
            <p>您还没有订阅的电台课程哦！</p>
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
      selTab: true,
      delBtn: false,
      arrowDown: false,
      showIdx: '',
      judgeLoading: false,
      isShowCourse: false,
      isShowRadioCourse: false,
      langCourses: [],
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
    this.getMoreLearnCourses().then(res => {
      console.log('getMoreLearnCourses', res)
      res.learn_courses.forEach(item => {
        if (item.course_type === 0) {
          this.langCourses.push(item)
        } else if (item.course_type === 1) {
          this.radioCourseList.push(item)
        }
      })
      if (this.langCourses.length === 0) {
        this.isShowCourse = true
      }
      if (this.radioCourseList.length === 0) {
        this.isShowRadioCourse = true
      }
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
      var _object = []
      var obj = this.learnCourses
      console.log('订阅课程我的页面===', obj)
      if (Object.keys(obj).length > 0) {
        for (var i in obj) {
          _object.unshift(obj[i])
        }
      }
      return _object
    }
  },
  methods: {
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode'
    }),
    ...mapActions({
      getDeletePurchase: 'course/getDeletePurchase',
      getLearnCourses: 'course/getLearnCourses',
      getMoreLearnCourses: 'getMoreLearnCourses'
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
    }
  }
}
</script>

<style scoped>
.user-course-nav {
  width: 100%;
  height: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #6d6d6d;
  border-bottom: 1px solid #ededed;
  border-radius: 4px;
  position: relative;
}
.user-course-wrap-title {
  width: 50%;
  float: left;
  height: 50px;
  margin-bottom: 20px;
  line-height: 50px;
  background-color: #ffffff;
  text-align: center;
  border-right: 1px solid #EEF2F3;
  cursor: pointer;
}

.user-course-wrap-title:last-child {
  border-right: 0;
}
.user-course-nav .active {
  color: #0581D1;
  border-bottom: 2px solid #0581D1;
}
.user-course-item-wrap .user-course-item {
  margin-top: 16px;
  margin-right: 0;
  margin-left: 0;
  height: 100px;
  border-radius: 5px;
  background-color: #ffffff;
  padding-top: 15px;
  padding-left: 21px;
}

.user-course-item-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  background-color: #ffffff;
}

.user-course-item-box img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  background-color: #E8E8E8;
}

.user-course-item-box ol {
  margin-left: 18px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.user-course-item-box ol li:nth-of-type(1) {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.user-course-item-box ol li:nth-of-type(2) {
  font-size: 13px;
  color: #7E929F;
  font-weight: 500;
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
  margin-top: 16px;
  border-radius: 5px;
  padding: 15px 21px;
}
.user-radio-course-item-wrap .user-radio-course-item {
  height: 100px;
  margin: 20px 0;
  border-bottom: 1px solid #EEF2F3;
}

.user-radio-course-item-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  background-color: #ffffff;
}

.user-radio-course-item-box img {
  width: 157px;
  height: 80px;
  border-radius: 4px;
  background-color: #E8E8E8;
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
  padding: 6px 20px;
  color: #7E929F;
  font-size: 14px;
  font-weight: 500;
}

.user-control-sel ul li:hover {
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
  height: 176px;
  border-radius: 4px;
  background-color: #ffffff;
}
.user-course-nocourse dl {
  width: 100%;
  height: 100%;
}
.user-course-nocourse dl dt {
  width: 30%;
  height: 100%;
  float: left;
  background-image: url(../../../../static/images/learn/learn-vip-warn.svg);
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 90px;
}
.user-course-nocourse dl dd {
  float: right;
  width: 70%;
  height: 100%;
  text-align: center;
  padding: 60px 30px;
  font-size: 18px;
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
