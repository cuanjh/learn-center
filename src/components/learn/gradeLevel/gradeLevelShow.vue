<template>
    <div class="test-level-wrap">
    <div class="test-level-content">
      <div class="test-level-title">
        <div class="test-level-logo" v-if="currLevel==0">
          <img src="../../../../static/images/test-level/level-flag.png" alt="">
        </div>
        <div class="test-level-logo" :class="['test-level-logo', 'test-level-logo-'+currLevel]" v-if="currLevel>0">
          <span class="test-now-level">当前等级</span>
        </div>
        <div class="test-level-info">
          <p>通过测评可以重新定位你当前学习语言的起点</p>
          <p class="test-level-time">3-5分钟</p>
        </div>
        <div class="reset-test" v-if="currLevel>0" v-on:click="reTest">重新测评</div>
        <div class="reset-test" v-if="currLevel==0" v-on:click="reTest">开始测评</div>
      </div>
      <div class="test-level-info-content">
        <p class="test-level-info-title">等级说明</p>
        <ul class="test-level-list">
          <li>
            <i class="test-level-list-icon test-level-list-icon-1"></i>
            <span>{{ $t("grade.Level1.desc") }}</span>
          </li>
          <li>
            <i class="test-level-list-icon test-level-list-icon-2"></i>
            <span>{{ $t("grade.Level2.desc") }}</span>
          </li>
          <li>
            <i class="test-level-list-icon test-level-list-icon-3"></i>
            <span>{{ $t("grade.Level3.desc") }}</span>
          </li>
          <li>
            <i class="test-level-list-icon test-level-list-icon-4"></i>
            <span>{{ $t("grade.Level4.desc") }}</span>
          </li>
          <li>
            <i class="test-level-list-icon test-level-list-icon-5"></i>
            <span>{{ $t("grade.Level5.desc") }}</span>
          </li>
          <li class="test-level-list-6">
            <i class="test-level-list-icon test-level-list-icon-6"></i>
            <span>{{ $t("grade.Level6.desc") }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      lanCode: '', // 课程语言标识
      currLevel: 0 // 当前的定级
    }
  },
  mounted () {
    this.$parent.$emit('initLayout')
    console.log(this.currentCourseCode)
    let courseCode = this.currentCourseCode
    if (!courseCode) {
      courseCode = localStorage.getItem('currentCourseCode')
    }
    this.getGradeInfo(courseCode).then((res) => {
      console.log(res)
      this.currLevel = res.grade_info.grade_level_num
    })
  },
  // route: {
  //   data: function(transition) {
  //     this.lanCode = transition.to.params.lanCode
  //     var courseCode = this.lanCode + '-Basic'
  //     var _params = {
  //       course_code: courseCode
  //     }
  //     var _this = this
  //     MobileApi.jsonp(Config.getLevelGradeContent, _params, function(msg) {
  //       _this.currLevel = msg.grade_info.grade_level_num
  //     })
  //   }
  // },
  computed: {
    ...mapState({
      currentCourseCode: state => state.course.currentCourseCode
    })
  },
  methods: {
    ...mapActions({
      getGradeInfo: 'course/getGradeInfo'
    }),
    reTest () {
      if (this.currLevel === 6) {
        this.currLevel = 0
      }
      this.$router.push({ path: '/learn/gradeLevel/Level' + (this.currLevel + 1) })
    }
  }
}
</script>

<style scoped>
* {
  font-family: HeiTi SC;
  -webkit-font-smoothing: antialiased;
  -ms-font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  -o-font-smoothing: antialiased;
  font-smoothing: antialiased;
}
.test-level-content {
  width: 660px;
  margin: 37px auto 0px;
  position: relative;
}
.test-level-title {
  width: 660px;
  height: 190px;
  padding: 29px 30px 29px 20px;
  border-radius: 4px;
  background-color: #fff;
}
.test-level-logo {
  float: left;
  width: 132px;
  height: 132px;
  border-radius: 66px;
  position: relative;
  text-align: center;
}
.test-level-logo-1 {
  background: url(../../../../static/images/test-level/level-a1.png) no-repeat left
    bottom;
}
.test-level-logo-2 {
  background: url(../../../../static/images/test-level/level-a2.png) no-repeat left
    bottom;
}
.test-level-logo-3 {
  background: url(../../../../static/images/test-level/level-b1.png) no-repeat left
    bottom;
}
.test-level-logo-4 {
  background: url(../../../../static/images/test-level/level-b2.png) no-repeat left
    bottom;
}
.test-level-logo-5 {
  background: url(../../../../static/images/test-level/level-c1.png) no-repeat left
    bottom;
}
.test-level-logo-6 {
  background: url(../../../../static/images/test-level/level-c2.png) no-repeat left
    bottom;
}
.test-now-level {
  display: block;
  width: 100%;
  font-size: 16px;
  color: #fff;
  position: absolute;
  top: 76px;
  left: 0px;
}
.test-level-info {
  float: left;
  width: 260px;
  height: 99px;
  font-size: 20px;
  color: #4a4a4a;
  padding: 22px 33px 11px 25px;
}
.test-level-info p {
  margin: 0px 0px 15px 0px;
}
.test-level-time {
  color: #f3993a;
}
.reset-test {
  float: right;
  width: 160px;
  height: 46px;
  text-align: center;
  line-height: 46px;
  color: #fff;
  font-size: 18px;
  border-radius: 23px;
  background-color: #7bc16b;
  margin-top: 44px;
}
.reset-test:hover {
  background-color: #6ab259;
  cursor: pointer;
}
.test-level-info-content {
  margin-top: 15px;
  border-radius: 4px;
  background-color: #fff;
  padding-bottom: 8px;
}
.test-level-info-title {
  height: 60px;
  margin: 0px;
  width: 660px;
  text-align: center;
  line-height: 60px;
  font-size: 18px;
  color: #999;
  border-bottom: 2px solid #eeeeee;
}
.test-level-list {
  list-style: none;
  padding: 0px 52px;
}
.test-level-list li {
  height: 58px;
  padding-top: 12px;
  line-height: 38px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ededed;
}
.test-level-list li span {
  margin-left: 20px;
  font-size: 16px;
  font-weight: 300;
  color: #4a4a4a;
}
.test-level-list-icon {
  float: left;
  width: 38px;
  height: 38px;
  background-image: url(../../../../static/images/test-level/level-list-black.png);
  background-position: 0px 0px;
}
.test-level-list-icon-2 {
  background-position: 0px -38px;
}
.test-level-list-icon-3 {
  background-position: 0px -76px;
}
.test-level-list-icon-4 {
  background-position: 0px -114px;
}
.test-level-list-icon-5 {
  background-position: 0px -152px;
}
.test-level-list-icon-6 {
  background-position: 0px -190px;
}
.test-level-wrap {
  height: 100%;
  background-color: #e9ecf6;
  overflow: hidden;
}
.test-level-list-6 {
  border: 0 !important;
}
</style>
