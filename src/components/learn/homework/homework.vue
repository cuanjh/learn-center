<template>
  <div class="homework-wrap">
    <div class="homework-container">
      <router-link class="homework-balk" :to="{path: '/app/course-list'}">
        <p></p>
        <span>返回</span>
      </router-link>
      <div class="homework-content">
        <div class="homework-title">
          <p>{{chapterDes.join('·')}}</p>
        </div>
        <div class="my-work">
          <p class="line"></p>
          <span>我的作业</span>
        </div>
        <!-- 作业列表，分为语音和写作 -->
        <div class="homework-list">
          <speakwork class="homework-item" v-for="(homework, index) in homeworkList" :key="index" :homework="homework"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import speakwork from './speakwork.vue'
import Recorder from '../../../plugins/recorder'

export default {
  data () {
    return {}
  },
  created () {
    Recorder.init()
  },
  components: {
    speakwork
  },
  mounted () {
    this.$parent.$emit('initLayout')
    let curChapterCode
    // 判断如果currentChapterCode不存在去localStorgae中取
    if (!this.currentChapterCode) {
      curChapterCode = localStorage.getItem('currentChapterCode')
    } else {
      curChapterCode = this.currentChapterCode
    }
    let activityCode = curChapterCode + '-A8'
    this.homeworkContent(activityCode)
    this.updateChapterDes(curChapterCode)
  },
  computed: {
    ...mapState({
      currentChapterCode: state => state.course.currentChapterCode,
      tips: state => state.learn.tips,
      chapterDes: state => state.course.chapterDes,
      homeworkList: state => state.course.homeworkContent
    })
  },
  methods: {
    ...mapMutations({
      updateChapterDes: 'course/updateChapterDes'
    }),
    ...mapActions({
      homeworkContent: 'course/homeworkContent'
    })
  }
}
</script>

<style lang="less" scoped>
a {
  text-decoration:none;
}
.homework-container {
  width: 890px;
  margin: 80px auto 0;
  .homework-balk {
    display: block;
    width: 80px;
    height: 30px;
    background: #ffffff;
    text-align: center;
    line-height: 30px;
    border-radius: 6px;
    margin-bottom: 28px;
    &:hover{
      background: #2a9fe4;
    }
    p {
      display: inline-block;
      background: url(../../../../static/images/homework/balck.png);
      background-size: 100% 100%;
      margin-top: 6px;
      width: 12px;
      height: 18px;
    }
    span {
      font-size: 16px;
      color: #333333;
      &:hover {
        color: #ffffff;
      }
    }
  }
  .homework-content {
    width: 100%;
    .homework-title {
      width: 100%;
      height: 70px;
      background: #2a9fe4;
      p {
        display: inline-block;
        vertical-align: middle;
        line-height: 70px;
        font-size: 26px;
        color: #ffffff;
        margin-left: 20px;
      }
    }
    .my-work {
      width: 100%;
      height: 60px;
      background: #ffffff;
      line-height: 60px;
      .line {
        display: inline-block;
        vertical-align: middle;
        line-height: 60px;
        width: 8px;
        height: 20px;
        background: #2a9fe4;
        margin: 20px 10px 20px 20px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      span {
        font-size: 24px;
      }
    }
    // 语音css
    .homework-list {
      width: 106%;
      margin-top: 20px;
      overflow: hidden;

    }
    .homework-item {
      display: inline-block;
      width: 32.3333%;
    }

  }
}
</style>
