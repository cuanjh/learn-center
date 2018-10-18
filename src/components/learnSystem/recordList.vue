<template>
  <div class="learn-wrap" v-show="isShow">
    <div class="learn-record-container">
      <div class="learn-record-header">
        <p @click="hide()" class="back">
          <img src="../../../static/images/learnSystem/record-back.png" alt="">
          返回
        </p>
        <img :src="photo" alt="">
        <p v-text="nickname"></p>
        <p v-text="chapterDes"></p>
      </div>
      <div class="learn-myrecord" v-if="isShowMyRecord">
        <div class="title">
          <span></span>
          {{ nickname + '的录音'}}

        </div>
        <div class="learn-myrecord-list">
          <div class="big-pre">
            <img src="../../../static/images/learnSystem/record-big-left.png" @click="pre()" alt="">
          </div>
          <div class="learn-myrecord-item">
            <img :src="curMyRecord.image | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="">
            <div class="sentence">{{ curMyRecord.sentence }}</div>
            <div class="my-record-play" @click="play()">
              <audio id="record-sound" :src="curMyRecord.record_sound" />
              <i>
                <span :class="{loading:loading}"></span>
                <span :class="{loading:loading}"></span>
                <span :class="{loading:loading}"></span>
                <span :class="{loading:loading}"></span>
                <span :class="{loading:loading}"></span>
                <span :class="{loading:loading}"></span>
              </i>
            </div>
          </div>
          <div class="big-next">
            <img src="../../../static/images/learnSystem/record-big-right.png" @click="next()" alt="">
          </div>
        </div>
        <div class="learn-myrecord-bottom">
          <span @click="pre()" v-text="'< '"></span>
          <span v-text="(curNum + 1) + ' '"></span>/<span v-text="' ' + myRecordList.length"></span>
          <span @click="next()" v-text="' >'"></span>
        </div>
      </div>
      <div class="learn-no-myrecord" v-else></div>
      <div class="learn-partner">
        <div class="title">
          <span></span>
          更多语伴录音
        </div>
        <div class="learn-partner-list">
          <div class="learn-partner-item" v-for="(item, index) in otherRecordList" :key="index">
            <img :src="item.cover | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="">
            <div class="learn-partner-info">
              <img :src="item.photo" alt="">
              <div class="partner-record-play" @click="playPartnerRecord(item.course_id)">
                <i>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </i>
              </div>
              <span v-text="item.nickname"></span>
              <p>
                <span class="record-count">{{ item.record_count + '条录音' }}</span>
                <span class="praise-count">{{ item.praise_count }}</span>
                <span class="partner-chapter">{{ chapterDes }} </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Cookie from '../../tool/cookie'

export default {
  props: ['isShow'],
  data () {
    return {
      activityCode: '',
      nickname: '',
      photo: '',
      praiseCount: 0,
      myRecord: {},
      myRecordList: [],
      curMyRecord: {},
      curNum: 0,
      otherRecordList: [],
      isShowMyRecord: true,
      loading: false
    }
  },
  created () {
    var _this = this
    this.$on('init', (recordCourseList, recordCourse) => {
      this.resetData()
      // let own = recordCourse.own
      let courseId = recordCourse.course_id
      let userId = Cookie.getCookie('user_id')
      // if (own) {
      //   userId = Cookie.getCookie('user_id')
      //   _this.myRecord = recordCourseList.filter((item) => {
      //     return item.user_id === userId
      //   })
      //   courseId = this.myRecord[0].course_id
      // }

      _this.nickname = recordCourse.nickname
      _this.photo = recordCourse.photo
      _this.getRecordCourse(courseId).then((res) => {
        _this.activityCode = res.course.activity_code
        _this.updateChapterDes(_this.activityCode)
        _this.praiseCount = res.course.praise_count
        _this.myRecordList = res.course.records
        if (_this.myRecordList.length === 0) {
          _this.isShowMyRecord = false
        }
        _this.curMyRecord = _this.myRecordList[0]
        setTimeout(() => {
          _this.play()
        }, 100)
      })

      recordCourseList.forEach((item) => {
        if (_this.otherRecordList.length < 4) {
          if (item.user_id !== userId) {
            _this.otherRecordList.push(item)
          }
        }
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
    },
    // 上一个
    pre () {
      this.loading = false
      if (this.curNum > 0) {
        this.curNum--
        this.curMyRecord = this.myRecordList[this.curNum]
        this.play()
      }
    },
    // 下一个
    next () {
      this.loading = false
      if (this.curNum < this.myRecordList.length - 1) {
        this.curNum++
        this.curMyRecord = this.myRecordList[this.curNum]
        this.play()
      }
    },
    // 播放音频
    play () {
      let audio = document.getElementById('record-sound')
      audio.loop = false
      this.loading = true
      audio.onloadedmetadata = () => {
        audio.play()
      }

      audio.addEventListener('ended', () => {
        this.loading = false
      }, false)
    },
    playPartnerRecord (courseId) {
      var _this = this
      this.loading = false
      _this.getRecordCourse(courseId).then((res) => {
        _this.activityCode = res.course.activity_code
        _this.updateChapterDes(_this.activityCode)

        _this.nickname = res.course.nickname
        _this.photo = res.course.photo
        _this.praiseCount = res.course.praise_count
        _this.myRecordList = res.course.records
        _this.curMyRecord = _this.myRecordList[0]
        _this.curNum = 0
        _this.play()
      })
    },
    // 初始化重置数据
    resetData () {
      this.activityCode = ''
      this.nickname = ''
      this.photo = ''
      this.praiseCount = 0
      this.myRecord = {}
      this.myRecordList = []
      this.curMyRecord = {}
      this.curNum = 0
      this.otherRecordList = []
      this.isShowMyRecord = true
      this.loading = false
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
    overflow:auto;
    z-index: 9999;
  }

  .learn-record-container {
    width: 740px;
    height: auto;
    margin: 120px auto;
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
    cursor: pointer;
  }

  .back > img {
    width: 8px;
    height: 8px;
    margin-top: 10px;
  }

  .learn-record-header>img {
    height: 120px;
    width: 120px;
    position: absolute;
    margin-left: 300px;
    margin-top: -45px;
    border-radius: 60px;
    border: 4px solid #fff;
    box-shadow: 0 3px 9px #C5C9CB;
  }

  .learn-record-header p:nth-of-type(2) {
    text-align: center;
    position: absolute;
    margin-top: 80px;
    width: 720px;
    color: #000;
    font-size: 20px;
  }

  .learn-record-header p:nth-of-type(3) {
    text-align: center;
    position: absolute;
    margin-top: 110px;
    margin-left: 295px;
    font-size: 18px;
    color: #AFAFAF;
  }

  .learn-no-myrecord {
    padding: 150px 25px 20px;
  }

  .learn-myrecord {
    padding: 150px 25px 20px;
  }

  .title {
    font-weight: bold;
    font-size: 18px;
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
    line-height: 320px;
    cursor: pointer;
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
    line-height: 320px;
    cursor: pointer;
  }

  .learn-myrecord-list .big-next img {
    width: 22px;
    height: 48px;
    vertical-align: middle;
  }

  .learn-myrecord-bottom {
    text-align: center;
  }

  .learn-myrecord-bottom span:nth-of-type(1) {
    cursor: pointer;
  }

  .learn-myrecord-bottom span:nth-of-type(4) {
    cursor: pointer;
  }

  .learn-partner {
    padding: 10px 25px 20px;
  }

  .learn-partner-list {
    margin-top: 10px;
  }
  .learn-partner-item {
    padding: 10px 0;
    border-top: 1px solid #EAEAEA;
  }
  .learn-partner-item > img {
    width: 143px;
    height: 80px;
    border-radius: 2px;
  }

  .learn-partner-info {
    margin-left: 15px;
    display: inline-block;
  }

  .learn-partner-info > img {
    height: 30px;
    width: 30px;
    border-radius: 50%;
  }

  .learn-partner-info > span {
    color: #333333;
    font-size: 16px;
  }

  .learn-partner-info > p {
    font-size: 14px;
    margin-top: 25px;
    width: 100%;
  }

  .record-count {
    color: #999999;
  }

  .record-count::before {
    content: "";
    width: 10px;
    height: 14px;
    display: inline-block;
    margin-top: 5px;
    margin-right: 6px;
    background-image: url('../../../static/images/learnSystem/record-sound.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .praise-count {
    color: #999999;
    margin-left: 20px;
  }

  .praise-count::before {
    content: "";
    width: 14px;
    height: 13px;
    display: inline-block;
    margin-top: 5px;
    margin-right: 6px;
    background-image: url('../../../static/images/learnSystem/record-like.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .partner-chapter {
    float: right;
    color: #444444;
    margin-left: 200px;
  }

  .learn-myrecord-item {
    padding: 15px;
    position: relative;
  }

  .learn-myrecord-item img {
    width: 434px;
    height: 243px;
    border-radius: 2px;
  }

  .learn-myrecord-item .sentence {
    margin-top: 17px;
    color: #444444;
    text-align: center;
  }

  .my-record-play {
    width: 74px;
    height: 74px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -35px;
    margin-left: -35px;
  }

  .my-record-play i {
    display: flex;
    width: 74px;
    height: 74px;
    padding: 0 16px;
    box-shadow: 0 6px 18px rgba(172,191,203,.6);
    background: rgba(255,255,255,.8);
    margin: 0 auto;
    justify-content: space-around;
    align-items: center;
    border-radius: 100%;
    font-style: normal;
    cursor: pointer;
  }

  .my-record-play i span {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 2px;
    border-radius: 4px;
    background-color: #2a9fe4;
  }

.my-record-play i span.loading {
  animation: load 1s ease infinite;
  -webkit-animation: load 1s ease infinite;
  -ms-animation: load 1s ease infinite;
  -moz-animation: load 1s ease infinite;
  -o-animation: load 1s ease infinite;
}
@keyframes load{
  0%,100%{
    height: 8px;
  }
  50%{
    height: 16px;
  }
}
.my-record-play i span:nth-child(1){
  animation-delay:0.2s;
  -webkit-animation-delay:0.2s;
  -ms-animation-delay:0.2s;
  -o-animation-delay:0.2s;
  -moz-animation-delay:0.2s;
}
.my-record-play i span:nth-child(2){
  animation-delay:0.3s;
  -webkit-animation-delay:0.3s;
  -ms-animation-delay:0.3s;
  -o-animation-delay:0.3s;
  -moz-animation-delay:0.3s;
}
.my-record-play i span:nth-child(3){
  height: 16px;
}
.my-record-play i span:nth-child(4){
  height: 16px;
  animation-delay:0.1s;
  -webkit-animation-delay:0.1s;
  -ms-animation-delay:0.1s;
  -o-animation-delay:0.1s;
  -moz-animation-delay:0.1s;
}
.my-record-play i span:nth-child(5){
  animation-delay:0.4s;
  -webkit-animation-delay:0.4s;
  -ms-animation-delay:0.4s;
  -o-animation-delay:0.4s;
  -moz-animation-delay:0.4s;
}
.my-record-play i span:nth-child(6){
  animation-delay:0.5s;
  -webkit-animation-delay:0.5s;
  -ms-animation-delay:0.5s;
  -o-animation-delay:0.5s;
  -moz-animation-delay:0.5s;
}

.partner-record-play {
  width: 40px;
  height: 40px;
  position: absolute;
  margin-left: -112px;
  margin-top: -10px;
}

.partner-record-play i {
  display: flex;
  width: 40px;
  height: 40px;
  padding: 0 8px;
  box-shadow: 0 6px 18px rgba(172,191,203,.6);
  background: rgba(255,255,255,.8);
  margin: 0 auto;
  align-items: center;
  border-radius: 100%;
  font-style: normal;
  cursor: pointer;
}

.partner-record-play i span {
  display: inline-block;
  width: 2px;
  height: 8px;
  margin: 0 1px;
  border-radius: 4px;
  background-color: #2a9fe4;
}

.partner-record-play i span:nth-of-type(3) {
  height: 12px;
}

.partner-record-play i span:nth-of-type(4) {
  height: 12px;
}
</style>
