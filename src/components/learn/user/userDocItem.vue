<template>
  <div class="userdoc-item">
    <div class='userdoc-item-top'>
      <div class='user-doc-item-img'>
        <img :src="'https://course-assets1.talkmate.com/course/covers/'+archive.course_code+'-2x.webp?imageView2/0/w/400/h/400/format/jpg'">
        <div class='user-doc-item-tips'>
          <p>
            <span>全球说《 {{archive.course_name[languagueHander]}} 》</span>
            <span><em>{{ levelDes[archive.current_chapter_code.split('-')[2]] }}</em></span>
          </p>
          <p v-text="archive['complete_rate']>=0?archive['complete_rate']*100+'%':'暂无数据' "></p>
        </div>
      </div>
      <echart4-user-doc :echartdata="archive" class='userdoc-item-echart'></echart4-user-doc>
    </div>
    <div class="userdoc-item-bottom">
      <p><span>正确率</span><span v-text="archive['correct_rate']>0?archive['correct_rate']*100+'%':'暂无数据'"></span></p>
      <p><span>累计学习时长</span><span>{{ archive['learn_time']>0?parseInt(archive['learn_time']/60)+'分钟':'暂无数据' }}</span></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Echart4UserDoc from './echart4UserDoc.vue'
export default {
  props: ['archive'],
  components: {
    Echart4UserDoc
  },
  mounted () {

  },
  computed: {
    ...mapState({
      levelDes: state => state.course.levelDes,
      languagueHander: state => state.course.languagueHander
    })
  }
}
</script>

<style scoped>

.userdoc-item {
  margin-top: 20px;
  background: #fff;
}
.userdoc-item:nth-of-type(1) {
  margin-top: 0;
}
.userdoc-item-top {
  height: 199.7px;
  border-bottom: 1px solid #ededed;
}
.userdoc-item-top .user-doc-item-img {
  margin: 20px;
  position: relative;
  width: 334px;
  float: left;
}

.userdoc-item-top .user-doc-item-img img {
  max-width: 100%;
  height: auto;
}

.userdoc-item-top .user-doc-item-tips {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  width: 100%;
  font-size: 16px;
  height: 50px;
  background: rgba(0, 61, 90, 0.8);
  padding: 0 14px;
}
.userdoc-item-top .user-doc-item-tips p {
  width: 30%;
  float: left;
}
.userdoc-item-top .user-doc-item-tips p:nth-of-type(1) {
  width: 70%;
  line-height: 20px;
  position: relative;
  top: 5px;
}
.userdoc-item-top .user-doc-item-tips p:nth-of-type(2) {
  font-size: 22px;
  color: #f3993a;
  height: 100%;
  text-align: right;
  line-height: 50px;
}
.userdoc-item-top .user-doc-item-tips p span {
  display: block;
}
.userdoc-item-top .userdoc-item-echart {
  float: left;
  /*background: red;*/
  width: 264px;
  height: 166px;
  margin: 20px 0 0px 0;
}
.userdoc-item-bottom {
  width: 100%;
}
.userdoc-item-bottom p {
  height: 59px;
  line-height: 59px;
  border-bottom: 1px solid #ededed;
  margin: 0 31px;
}
.userdoc-item-bottom p:nth-last-of-type(1) {
  border: none;
}
.userdoc-item-bottom p span {
  display: inline-block;
  width: 50%;
  text-align: left;
  font-size: 16px;
  color: #949794;
}
.userdoc-item-bottom p span:nth-of-type(2) {
  text-align: right;
  color: #f3993a;
}
.user-course-nocourse dl dd p span:hover {
  color: #fa6f50;
}
</style>
