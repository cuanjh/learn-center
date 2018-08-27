<template>
  <div class="left-side">
    <div class="lang-overview">
      <dl>
        <dt><img v-bind:src="courseBaseInfo.cover "></dt>
        <dd>
          <p v-text='langDesc'></p>
          <p @click="switchCourse" style="display:none">{{$t('course.switchCourse')}}</p>
        </dd>
      </dl>
      <div class="finished-course">
        <p>{{$t('course.finished')}}</p>
        <p><span v-text="finishedChapter + '/' + chapterNum"></span>{{$t('course.classHour')}}</p>
      </div>
    </div>

    <ul class="level-test-guide">
      <li class="learn-test-guide learn-level" @click="jumpToPage('/course/grade-level-show')">
        <i></i>
        <span>测评定级</span>
      </li>
      <li class="learn-test-guide learn-test" @click="jumpToPage('/learn/testing')">
        <i></i>
        <span>学习环境测试</span>
      </li>
      <li class="learn-test-guide learn-guide" @click="jumpToPage('/learn/user-guide')">
        <i></i>
        <span>学习指南</span>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['userInfo'],
  name: 'leftSide',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      courseBaseInfo: state => state.course.courseBaseInfo,
      chapterNum: state => state.course.chapterNum + '',
      finishedChapter: state => state.course.finishedChapter + '',
      curLevel: state => state.course.curLevel
    }),
    langDesc () {
      let des = '全球说 《' + this.courseBaseInfo.name + '》'
      return des
    }
  },
  methods: {
    switchCourse () {
      this.$router.push({ path: '/course/book-case' })
    },
    jumpToPage (path) {
      this.$router.push({ path: path })
    }
  }
}
</script>

<style scoped>
  .left-side{
    min-width: 280px;
    width: 280px;
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgba(218,230,243,0.30);
    display: inline-block;
  }

  .lang-overview{
    border-radius: 4px 4px 0 0;
  }

  .lang-overview dl{
    padding: 40px 0 0 20px;
    height: 169px;
    background-image: url('../../../../static/images/learn/learn-lang-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .lang-overview dt {
    float: left;
    margin-right: 15px;
  }

  .lang-overview dt img {
    display: inline-block;
    width: 80px;
    height: 80px;
    border: #ffffff solid 2px;
    border-radius: 4px;
    box-shadow: #3179A3 0 2px 7px;
    object-fit: cover;
  }

  .lang-overview dd p {
    font-size: 16px;
    font-weight: bold;
    padding-right: 20px;
  }

  .lang-overview dd p:nth-of-type(1) {
    padding-top: 10px;
    color: #ffffff;
  }

  .lang-overview dd p:nth-of-type(2) {
    background-image: url('../../../../static/images/learn/switch-course.svg');
    background-repeat: no-repeat;
    background-position: 90% 50%;
    cursor:pointer;
    position: relative;
    margin-top: 55px;
    margin-right: 20px;
    float: right;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
  }

  .finished-course {
    background-color: #fff;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #444444;
    border-bottom: 1px solid #f5f5f5;
    box-shadow: #DAE6F3 0 1px 2px;
    border-radius: 0 0 3px 3px;
  }

  .finished-course > p {
    display: inline-block;
  }

  .finished-course > p:nth-of-type(1){
    float: left;
  }

  .finished-course > p:nth-of-type(2){
    float: right;
  }

  .finished-course > p:nth-of-type(2) span {
    margin-right: 10px;
    color: #CBCBCB;
    font-size: 17px;
    vertical-align: bottom;
  }

  .level-test-guide{
    background:#fff;
    border-radius: 3px 3px 4px 4px;
    margin-top:12px;
    box-shadow: #DAE6F3 0 1px 2px;
  }

  .level-test-guide li:hover::before {
    content: '';
    width: 4px;
    height: 44px;
    background-color: #3c9bbe;
    position: absolute;
    top: 4px;
    left: -20px;
  }

  .learn-test-guide{
    height:50px;
    font-size:14px;
    line-height:50px;
    margin-right:20px;
    margin-left:20px;
    background-image: url(../../../../static/images/learn/learn-user-arrow.svg);
    background-position: center right;
    background-repeat: no-repeat;
    cursor: pointer;
    color: #4a4a4a;
    position: relative;
    border-bottom: 1px solid #f5f5f5;
    padding-left: 25px;
  }

  .learn-guide{
    border-bottom: 0px solid #f5f5f5;
  }
  .learn-test-guide i{
    position: absolute;
    top: 15px;
    left: 0px;
    width: 18px;
    height: 20px;
    background-position: center center;
    background-size: contain;
  }
  .learn-test i{
    background: url(../../../../static/images/learn/study-test.svg) no-repeat;
  }
  .learn-guide i{
    background: url(../../../../static/images/learn/study-guide.svg) no-repeat;
  }
  .learn-level i{
    background: url(../../../../static/images/learn/cpdj.svg) no-repeat;
  }
</style>
