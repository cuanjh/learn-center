<template>
  <div class="confirm-wrap">
    <div class="confirm-content">
      <div :class="'confirm-level confirm-level-icon' + levelActivity">
      </div>
      <p class="prompt-info">{{ $t("grade.Level"+levelActivity+".desc") }}</p>
      <div class="test-level-list">
        <div class="test-level-list-icon1">
          <i v-show="levelActivity == 1"></i>
        </div>
        <div class="test-level-list-icon2">
          <i v-show="levelActivity == 2"></i>
        </div>
        <div class="test-level-list-icon3">
          <i v-show="levelActivity == 3"></i>
        </div>
        <div class="test-level-list-icon4">
          <i v-show="levelActivity == 4"></i>
        </div>
        <div class="test-level-list-icon5">
          <i v-show="levelActivity == 5"></i>
        </div>
        <div class="test-level-list-icon6">
          <i v-show="levelActivity >= 6"></i>
        </div>
      </div>
      <div class="confirm-info">
        <i></i>
        <p>{{ $t("grade.Level"+levelActivity+".from.p1") }}</p>
        <p>{{ $t("grade.Level"+levelActivity+".from.p2") }}</p>
      </div>
      <div class="confim-button-content confim-button" v-on:click="confirmResult">确认结果</div>
      <div class="confim-button-content confim-button-hover" v-on:click="abandonResult">放弃结果</div>
      <div class="confim-button-content confim-button-hover" v-on:click="reTest">重新评测</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['level'],
  data () {
    return {
    }
  },
  mounted () {
    this.$parent.$emit('initLayout')
  },
  computed: {
    ...mapState({
      levelActivity: state => state.course.levelActivity,
      courseCode: state => state.course.currentCourseCode
    })
  },
  methods: {
    ...mapActions({
      levelGrade: 'course/levelGrade'
    }),
    confirmResult () {
      var _this = this
      this.levelGrade(this.courseCode).then((res) => {
        console.log(res)
        _this._gotoCourseListView()
      })
    },
    abandonResult () {
      this._gotoCourseListView()
    },
    reTest () {
      // 永远从level1开始测试
      this.$router.push({path: '/learn/gradeLevel/level1'})
    },
    _gotoCourseListView () {
      this.$router.push({path: '/course/course-list'})
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
p {
  margin: 0px;
}
.confirm-wrap {
  background-color: #e9ecf6;
  height: 100%;
  overflow: hidden;
}
.confirm-content {
  width: 708px;
  height: 670px;
  margin: 20px auto 0px;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
}
.confirm-level {
  width: 127px;
  height: 127px;
  border-radius: 63px;
  margin: 58px auto 17px;
  color: #fff;
  text-align: center;
  overflow: hidden;
  position: relative;
}
.confirm-level-zh {
  width: 127px;
  font-size: 16px;
  position: absolute;
  top: 74px;
}
.prompt-info {
  text-align: center;
  font-size: 16px;
  font-weight: 300;
  color: #3f3f3f;
  margin: 0px;
}
.confirm-info {
  width: 364px;
  height: 77px;
  margin: 0px auto;
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  color: #424242;
  border-radius: 8px;
  padding-top: 11px;
  border: solid 1px #4990e2;
  position: relative;
}
.confirm-info i {
  width: 14px;
  height: 10px;
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -7px;
  background: url(../../../../static/images/test-level/blue-border-jt.png) no-repeat;
}
.confim-button-content {
  width: 270px;
  height: 46px;
  cursor: pointer;
  border-radius: 23px;
  font-size: 16px;
  text-align: center;
  line-height: 46px;
  color: #7bc16b;
  border: 1px #7bc16b solid;
  margin: 20px auto 0px;
}
.confim-button {
  color: #fff;
  background-color: #7bc16b;
}
.confim-button:hover {
  background-color: #6ab259;
}
.confim-button-hover:hover {
  color: #fff;
  background-color: #6ab259;
}
.test-level-list {
  width: 306px;
  height: 57px;
  margin: 13px auto 68px;
  position: relative;
}
.test-level-list div {
  float: left;
  width: 42px;
  height: 57px;
  margin-left: 9px;
}
.test-level-list i {
  display: block;
  width: 12px;
  height: 8px;
  background: url(../../../../static/images/test-level/blue-jt.png) no-repeat;
  margin: 0px auto;
}
.test-level-list-icon1 {
  background: url(../../../../static/images/test-level/A1.png) no-repeat left bottom;
}
.test-level-list-icon2 {
  background: url(../../../../static/images/test-level/A2.png) no-repeat left bottom;
}
.test-level-list-icon3 {
  background: url(../../../../static/images/test-level/B1.png) no-repeat left bottom;
}
.test-level-list-icon4 {
  background: url(../../../../static/images/test-level/B2.png) no-repeat left bottom;
}
.test-level-list-icon5 {
  background: url(../../../../static/images/test-level/C1.png) no-repeat left bottom;
}
.test-level-list-icon6 {
  background: url(../../../../static/images/test-level/C2.png) no-repeat left bottom;
}
.confirm-level-icon1 {
  background: url(../../../../static/images/test-level/level-blue-a1.png) no-repeat
    left bottom;
}
.confirm-level-icon2 {
  background: url(../../../../static/images/test-level/level-blue-a2.png) no-repeat
    left bottom;
}
.confirm-level-icon3 {
  background: url(../../../../static/images/test-level/level-blue-b1.png) no-repeat
    left bottom;
}
.confirm-level-icon4 {
  background: url(../../../../static/images/test-level/level-blue-b2.png) no-repeat
    left bottom;
}
.confirm-level-icon5 {
  background: url(../../../../static/images/test-level/level-blue-c1.png) no-repeat
    left bottom;
}
.confirm-level-icon6 {
  background: url(../../../../static/images/test-level/level-blue-c2.png) no-repeat
    left bottom;
}
.confirm-level-icon7 {
  background: url(../../../../static/images/test-level/level-blue-c2.png) no-repeat
    left bottom;
}
</style>
