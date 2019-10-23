<template>
  <div class="my-course">
    <div class="title">
      <i></i>
      <span>课程学习</span>
    </div>
    <div class="content">
      <div class="chapter">
        <img :src="kidChapterInfo.image_bg2 | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="">
        <div class="name">
          {{ kidLevelName + '.课程' + kidChapterInfo.chapterNum + '：' + kidChapterInfo.chapterDesc}}
        </div>
      </div>
      <div class="course">
        <dl @mouseleave="isShowSubscribeCourses = false">
          <dt><img :src="kidCourseBaseInfo['flag'] | urlFix('imageView2/0/w/200/h/200/format/jpg')"></dt>
          <dd>
            <a :class="{'active': isShowSubscribeCourses}" @mouseenter="isShowSubscribeCourses = true">
              <span class="kidCourse_name">{{ kidCourseBaseInfo.name + 'Mini'}}</span>
              <div class="icon">
                <i></i>
                <transition name="fade">
                  <learn-course-list :type="'index'" :subscribeLangCourses="subscribeLangCourses" class="mycourse-wrap" v-show="isShowSubscribeCourses" />
                </transition>
              </div>
            </a>
            <p>世界语言地图官方课程</p>
          </dd>
        </dl>
        <a class="all-courses" @click="goCourseList()">开始学习</a>
      </div>
    </div>
  </div>
</template>

<script>
import LearnCourseList from '../../common/learnCourseList.vue'
export default {
  props: ['kidCourseBaseInfo', 'kidLevelName', 'kidChapterInfo', 'subscribeLangCourses'],
  data () {
    return {
      isShowSubscribeCourses: false
    }
  },
  components: {
    LearnCourseList
  },
  methods: {
    goCourseList () {
      this.$router.push({path: '/app/kid-course-list/' + this.kidCourseBaseInfo.code})
    }
  }
}
</script>

<style lang="less" scoped>
.my-course {
  width: 1180px;
  height: 360px;
  margin: 62px auto 0;
  background: #fff;
  border-radius: 5px;
  box-shadow:0px 3px 8px 0px rgba(5,43,52,0.03);
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 30px;
    padding-top: 28px;
    i {
      display: inline-block;
      width: 36px;
      height: 36px;
      background-image: url('../../../../static/images/kid/icon-my-kid.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
    span {
      font-size: 16px;
      font-weight: 500;
      color: #0A2B40;
      line-height: 22px;
      margin-left: 15px;
    }
  }
  .content {
    display: flex;
    flex-direction: row;
    padding-left: 38px;
    padding-top: 35px;
    .chapter {
      position: relative;
      img {
        width: 619px;
        height: 226px;
        border-radius: 8px;
        object-fit: cover;
      }
      .name {
        position: absolute;
        top: 28px;
        left: 22px;
        color: #fff;
        font-weight: 600;
        font-size: 18px;
      }
    }
    .course {
      position: relative;
      margin-left: 72px;
      margin-top: 24px;
      display: flex;
      flex-direction: column;
    }
    .course dl {
      width: 100%;
      height: 65px;
    }
    .course dt {
      float: left;
      margin-right: 15px;
    }

    .course dt img {
      display: inline-block;
      background: #ffffff;
      width: 75px;
      height: 75px;
      box-shadow:0px 3px 9px 0px rgba(7,37,68,0.2);
      border-radius:8px;
      object-fit: cover;
    }

    .course dd {
      height: 100px;
      padding-top:5px;
      position: relative;
    }

    .course dd a {
      font-size: 24px;
      line-height:48px;
      color: #333333;
      font-weight: bold;
      /* word-break: break-all; */
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .course dd a span {
      display: inline-block;
      max-width: 120px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .course dd a .kidCourse_name {
      overflow: visible;
      max-width: none;
    }

    .course .icon {
      display: inline-block;
      position: relative;
    }
    .course .icon i {
      margin-top: 20px;
      width: 12px;
      height: 9px;
      display: inline-block;
      background-image: url('../../../../static/images/learnIndex/icon-triangle.svg');
      background-repeat: no-repeat;
      background-size: cover;
    }

    .course dd .active {
      color: #2A9FE4 !important;
    }

    .course dd .active .icon i {
        background-image: url('../../../../static/images/learnIndex/icon-triangle-hover.svg') !important;
    }

    .course dd p:nth-of-type(1) {
      height:18px;
      font-size:13px;
      font-weight:400;
      color:#888888;
      line-height:18px;
      display: inline-block;
    }

    .all-courses {
      position:absolute;
      bottom: 0px;
      margin-top: 73px;
      width: 140px;
      height: 38px;
      line-height: 36px;
      border-radius: 21px;
      border: 1px solid #B2C0C9;
      background: #0581D1;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      box-shadow:0px 6px 13px -1px rgba(5,129,209,0.48);
      cursor: pointer;
    }

    .all-courses:hover {
      background: #2A9FE4;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.mycourse-wrap {
  left: -131px !important;
  top: 40px !important;
  width: 370px !important;
}
</style>
