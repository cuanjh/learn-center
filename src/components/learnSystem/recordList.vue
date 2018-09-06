<template>
  <div class="learn-wrap" @click="hide()" v-show="isShow">
    <div class="learn-record-container">
      <div class="learn-record-header">
        <a href="javascript:void(0)" @click="hide()" class="back">
          <i></i>
          返回
        </a>
        <img :src="photo" alt="">
        <p v-text="nickname"></p>
        <p v-text="chapterDes"></p>
      </div>
      <div class="learn-myrecord">
        <div class="title">
          <span></span>
          我的录音
        </div>
        <div class="learn-myrecord-list">
          <div class="big-pre">
            <img src="../../../static/images/learnSystem/record-big-left.png" alt="">
          </div>
          <div class="learn-myrecord-item"></div>
          <div class="big-next">
            <img src="../../../static/images/learnSystem/record-big-right.png" alt="">
          </div>
        </div>
        <div class="learn-myrecord-bottom">
          <span v-text="'< '"></span>
          <span v-text="'1 '"></span>/<span v-text="' 3'"></span>
          <span v-text="' >'"></span>
        </div>
      </div>
      <div class="learn-partner">
        <div class="title">
          <span></span>
          更多语伴录音
        </div>
        <div class="learn-partner-list">
          <div class="learn-partner-item"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Cookies from 'js-cookie'

export default {
  props: ['isShow'],
  data () {
    return {
      activityCode: '',
      nickname: '',
      photo: '',
      praiseCount: 0,
      myRecord: {},
      myRecordList: {}
    }
  },
  created () {
    var _this = this
    this.$on('init', (recordCourseList) => {
      let userId = Cookies.get('user_id')
      _this.myRecord = recordCourseList.filter((item) => {
        return item.user_id === userId
      })
      let courseId = this.myRecord[0].course_id
      _this.getRecordCourse(courseId).then((res) => {
        _this.activityCode = res.course.activity_code
        _this.updateChapterDes(_this.activityCode)

        _this.nickname = res.course.nickname
        _this.photo = res.course.photo
        _this.praiseCount = res.course.praise_count
        _this.myRecordList = res.course.records
      })
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      levelDes: state => state.course.levelDes,
      chapterDes: state => state.course.chapterDes
    })
  },
  methods: {
    ...mapMutations({
      updateChapterDes: 'course/updateChapterDes'
    }),
    ...mapActions({
      getRecordCourse: 'learn/getRecordCourse',
      currentCourse: 'course/currentCourse'
    }),
    hide () {
      this.$emit('updateIsShow', false)
    }
  }
}
</script>

<style scoped>
  .learn-wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #e9ecf6;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  .learn-record-container {
    width: 740px;
    height: 700px;
    margin: 120px auto 0;
    border-radius: 5px;
    background-color: #fff;
  }

  .back {
    background-color: #F1F5F8;
    width: 67px;
    height: 28px;
    line-height: 28px;
    border-radius: 6px;
    position: absolute;
    margin-left: 25px;
    margin-top: 20px;
    text-align: center;
  }

  .learn-record-header img {
    height: 120px;
    width: 120px;
    position: absolute;
    margin-left: 300px;
    margin-top: -45px;
    border-radius: 60px;
    border: 4px solid #fff;
    box-shadow: 0 3px 9px #C5C9CB;
  }

  .learn-record-header p:first-of-type {
    text-align: center;
    position: absolute;
    margin-top: 80px;
    margin-left: 310px;
    color: #000;
    font-size: 20px;
  }

  .learn-record-header p:nth-of-type(2) {
    text-align: center;
    position: absolute;
    margin-top: 110px;
    margin-left: 295px;
    font-size: 18px;
    color: #AFAFAF;
  }

  .learn-myrecord {
    padding: 150px 25px 20px;
  }

  .itle {
    font-weight: bold;
    font-size: 20px;
    color: #444444;
  }

  .title span {
    width: 4px;
    height: 15px;
    background-color: #2A9FE4;
    margin-top: 4px;
    border-radius: 4px;
    display: inline-block;
  }

  .learn-myrecord-list {
    border-top: 1px solid #EAEAEA;
    margin: 10px auto;
    padding: 5px 30px;
  }

  .learn-myrecord-list .big-pre {
    display: inline-block;
    height: 320px;
    line-height: 320px
  }

  .learn-myrecord-list .big-pre img {
    width: 22px;
    height: 48px;
    vertical-align: middle;
  }

  .learn-myrecord-item {
    width: 464px;
    height: 320px;
    border-radius: 3px;
    background-color: #F1F5F8;
    display: inline-block;
    box-shadow: 0 4px 8px rgba(27, 41, 50, 0.2);
    margin: 10px 55px;
  }

  .learn-myrecord-list .big-next {
    display: inline-block;
    height: 320px;
    line-height: 320px
  }

  .learn-myrecord-list .big-next img {
    width: 22px;
    height: 48px;
    vertical-align: middle;
  }

  .learn-myrecord-bottom {
    text-align: center;
  }

</style>
