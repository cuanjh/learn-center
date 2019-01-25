<template>
  <section class='user-course-wrap' >
    <p class='user-course-wrap-title'>订阅的课程</p>
    <div class='user-course-item-wrap' :class="{ 'userifloading': judgeLoading  }">
      <div class='user-course-item' v-for='(item, index) in courseRander' :key="index">
        <div>
          <img :src="item.cover | urlFix('imageView2/0/w/400/h/400/format/jpg')">
        </div>
        <ol>
          <li><span>全球说</span><span>《{{item.name[languagueHander]}}》</span></li>
          <li><span v-text="levelDes[item.currentLevel]"></span>-<span v-text="item.currentChapter.replace('Chapter', '课程')"></span></li>
          <li><span :style="{ width: item['complateRate'] }"></span></li>
          <li @click="continueLearn(item.code)">继续学习</li>
          <span class='user-course-del-btn' @click.stop="showDel(index)" :class="{ 'arrowDown' : showIdx === index ? arrowDown : false }"></span>
          <span class='user-course-del-btn-tag' v-show='showIdx === index ? delBtn : false' @click='deleteCourse(item.code)'><i></i>删除课程</span>
        </ol>
      </div>
      <div class='user-course-nocourse' v-show='courseShow'>
        <dl>
          <dt></dt>
          <dd>
            <p>您还没有订阅的课程哦！</p>
            <!-- <p>请到<span v-link="{path: '/v2/find'}">“发现”</span>里订阅您喜欢的课程！</p> -->
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
      delBtn: false,
      arrowDown: false,
      showIdx: '',
      judgeLoading: false
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
  },
  computed: {
    ...mapState({
      showLoading: state => state.user.showLoading,
      courseShow: state => state.user.courseShow,
      courseRader: state => state.user.courseRader,
      languagueHander: state => state.course.languagueHander,
      learnCourses: state => state.course.learnCourses,
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
      getLearnCourses: 'course/getLearnCourses'
    }),
    showDel (e) {
      this.showIdx = e
      this.delBtn = !this.delBtn
      this.arrowDown = !this.arrowDown
    },
    deleteCourse (code) {
      this.getDeletePurchase(code)
    },
    continueLearn (courseCode) {
      localStorage.setItem('lastCourseCode', courseCode)
      this.updateCurCourseCode(courseCode)
      this.$router.push({ path: '/app/course-list' })
    }
  }
}
</script>

<style scoped>
.user-course-wrap-title {
  width: 100%;
  height: 50px;
  padding-left: 30px;
  margin-bottom: 20px;
  color: #0e8abe;
  font-size: 18px;
  line-height: 50px;
  border-radius: 4px;
  background-color: #ffffff;
  text-align: center;
  background-image: url(../../../../static/images/learn/learn-course-book.svg);
  background-repeat: no-repeat;
  background-position: 256px center;
  border-bottom: 2px solid #0e8abe;
}
.user-course-item-wrap .user-course-item {
  width: 100%;
  height: 176px;
  border-radius: 10px;
  background-color: #ffffff;
  margin-top: 20px;
}
.user-course-item-wrap .user-course-item:nth-of-type(1) {
  margin-top: 0;
}
.user-course-item-wrap .user-course-item div {
  width: 313px;
  height: 155.6px;
  margin: 10px 14px;
  float: left;
}

.user-course-item-wrap .user-course-item div img {
  max-width: 100%;
  height: auto;
}
.user-course-item-wrap .user-course-item ol {
  width: 318px;
  padding: 25px 25px;
  float: left;
  padding-left: 5px;
  position: relative;
}
.user-course-item-wrap .user-course-item ol li:nth-of-type(1),
.user-course-item-wrap .user-course-item ol li:nth-of-type(2) {
  font-size: 16px;
  color: #4a4a4a;
  font-weight: bold;
}
.user-course-item-wrap .user-course-item ol li:nth-of-type(3) {
  width: 100%;
  height: 14px;
  border-radius: 100px;
  border: solid 1px #7bc16b;
  position: relative;
  margin: 15px 0;
}
.user-course-item-wrap .user-course-item ol li:nth-of-type(3) span {
  position: absolute;
  top: 0;
  left: 0;
  /*width:50%;*/
  height: 100%;
  background-color: #7bc16b;
  border-radius: 50px;
}
.user-course-item-wrap .user-course-item ol li:nth-of-type(4) {
  width: 100%;
  height: 31px;
  color: #fff;
  font-size: 16px;
  line-height: 31px;
  border-radius: 100px;
  border: solid 1px #0e8abe;
  text-align: center;
  background-color: #0e8abe;
  cursor: pointer;
}
.user-course-item-wrap .user-course-item ol li:nth-of-type(4):hover {
  background-color: #05618d;
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
</style>
