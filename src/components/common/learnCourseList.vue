<template>
  <transition name="fade">
    <section class='mycourse-wrap mycourse-loginout animated'>
      <img class="mycourse-wrap-arrow" src="../../../static/images/course/learn-big-arrow.png" alt="">
      <div class="mycourse-container">
        <!-- <p class="my-course">我订阅的课程</p> -->
        <section>
          <ul>
            <li  v-for='(course, index) in subscribeLangCourses' :key="index"
              class='mycourse-container-gray disable'
              :class="{'mycourse-container-light': true }">
              <dl>
                <dt>
                  <a class='changeColor' @click="changeCourseCodes(course['code'])">
                    <img :src="course.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')">
                    <div class='fix-ie-filter-bug'></div>
                  </a>
                </dt>
                <dd>
                  <span class='mycourse-lang'>
                    <a href="">{{ !course.name ? '' : course.name['zh-cn'] }}</a>
                  </span>
                </dd>
              </dl>
            </li>
            <li class='learn-courseList-add-more'>
              <router-link :to="{path: '/app/book-case'}">
                <i />
              </router-link>
            </li>
          </ul>
        </section>
      </div>
    </section>
  </transition>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import Bus from '../../bus'
export default {
  props: ['type', 'subscribeLangCourses'],
  data () {
    return {
      learnCourse: []
    }
  },
  mounted () {
    // this.getLearnCourses()
  },
  methods: {
    ...mapActions({
      getLearnCourses: 'course/getLearnCourses'
    }),
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode'
    }),
    // 点击订阅的课程跳转到点击的课程开始学习
    changeCourseCodes (courseCode) {
      localStorage.setItem('lastCourseCode', courseCode)
      this.updateCurCourseCode(courseCode)
      if (this.type === 'index') {
        Bus.$emit('loadIndexCourse', courseCode)
      } else {
        Bus.$emit('changeCourseCode', courseCode)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.mycourse-wrap {
  position: absolute;
  width: 460px;
  height: 246px;
  // overflow-y: auto;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 9px 0 rgba(112, 112, 112, 0.5);
  top: 65px;
  left: 19px;
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
  width: 22px;
  height: 22px;
  position: absolute;
  top: -9px;
  left: 127px;
}
.mycourse-container {
  padding: 30px 0px 0 30px;
  // overflow: hidden;
  height: 246px;
  overflow-y: auto;
}
// .mycourse-container > p {
//   width: 100%;
//   height: 32px;
//   line-height: 32px;
//   font-size: 14px;
//   color: #003d5a;
//   border-bottom: 1px solid #ededed;
//   font-weight: bold;
// }
.mycourse-container > section ul {
  // display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
}
.mycourse-container > section ul > li {
  display: inline-block;
  flex: 0 0 20%;
  cursor: pointer;
  margin-bottom: 30px;
  margin-right: 30px;
}

.mycourse-container > section ul > li.disable dl {
  // width: 80px;
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
  color: #666;
  display: inline-block;
  max-width: 54px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mycourse-container > section ul > li.learn-courseList-add-more {
  text-align: center;
  cursor: pointer;
  border: none;
  height: 50px;
}
.mycourse-container > section ul > li.learn-courseList-add-more a {
  display: inline-block;
  width: 50px;
  height: 50px;
}
.mycourse-container > section ul > li.learn-courseList-add-more a i {
  width: 50px;
  height: 50px;
  display: inline-block;
  background-image: url('../../../static/images/course/add-learn-course.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.mycourse-container > section ul > li.learn-courseList-add-more a i:hover {
  background-image: url('../../../static/images/course/add-learn-course-hover.svg');
}

.mycourse-container > section ul > li.learn-courseList-add-more a i:active {
  background-image: url('../../../static/images/course/add-learn-course-active.svg');
}

.mycourse-container > section ul > li dl dt {
  text-align: center;
}
.mycourse-container > section ul > li dl dt a {
  margin: 0 auto;
  width: 50px;
  height: 50px;
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
/* .mycourse-container > section ul > li dl a dd span a {
  cursor: pointer;
  color: #003d5a;
} */
.mycourse-container > section ul > li dl dt a img {
  margin: 0 auto;
  width: 50px;
  height: 50px;
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
  color: #666;
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
  color:#666 !important;
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

.fade-enter-active .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
