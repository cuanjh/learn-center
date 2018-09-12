<template>
  <section>
    <div class="userDoc-top">
      <ol>
        <li><i></i>学习档案</li>
        <li><span>金币</span><span v-text="userInfo.coins"></span></li>
        <li><span>排行榜</span><span>暂无数据</span></li>
        <li><span>累计学习时长</span><span>{{ learnDays>0?learnDays+'天':'暂无数据' }}</span></li>
      </ol>
    </div>
    <div class="userDoc-bottom">
      <div class='userdoc-item-wrap'>
        <doc-item :archive="archive" v-for="(archive, index) in archives" :key="index"/>
      </div>
    </div>
    <div class='user-course-nocourse' v-show='findGuide'>
      <dl>
        <dt></dt>
        <dd>
          <p>您还没有学习档案哦！</p>
          <p>请到<router-link tag="span" :to="{path: '/app/find'}">“发现”</router-link>页面里订阅您喜欢的课程吧!</p>
        </dd>
      </dl>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import $ from 'jquery'
import DocItem from './userDocItem.vue'
export default {
  components: {
    DocItem
  },
  mounted () {
    this.$parent.$emit('activeNavUserItem', 'doc')
    this.$parent.$emit('navItem', 'user')
    this.getCourseArchives().then((res) => {
      this.updateCourseArchives(res)
      setTimeout(() => {
        let height = $('.user-container').height() + 100
        $('.user-wrap').css('height', height + 'px')
      }, 100)
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      courseArchives: state => state.user.courseArchives
    }),
    learnDays () {
      return this.courseArchives.learn_days
    },
    archives () {
      if (!this.courseArchives.archives) {
        return false
      }
      return this.courseArchives.archives.filter((item) => {
        return item.has_new_learn === 0
      })
    },
    findGuide () {
      if (this.archives.length > 0) {
        return false
      }
      return true
    }
  },
  methods: {
    ...mapMutations({
      updateCourseArchives: 'user/updateCourseArchives'
    }),
    ...mapActions({
      getCourseArchives: 'user/getCourseArchives'
    })
  }
}
</script>

<style scoped>
.userDoc-top {
  width: 100%;
  height: 224px;
  border-radius: 4px;
  background-color: #ffffff;
}
.userDoc-top ol li {
  padding: 0 31px;
  border-bottom: 1px solid #ededed;
  height: 60px;
  line-height: 60px;
  padding: 0 31px;
}
.userDoc-top ol li span {
  width: 50%;
  display: inline-block;
  text-align: left;
  color: #4a4a4a;
  font-size: 18px;
}
.userDoc-top ol li span:nth-of-type(2) {
  text-align: right;
  color: #f3993a;
  font-size: 20px;
}
.userDoc-top ol li:nth-last-of-type(1) {
  border: none;
}
.userDoc-top ol li:nth-of-type(1) {
  height: 40px;
  line-height: 40px;
  padding: 0;
  background-color: #66b8e0;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  position: relative;
  border-radius: 5px 5px 0 0;
  border-bottom: none;
}
.userDoc-top ol li:nth-of-type(1) i {
  width: 18px;
  height: 15.7px;
  position: absolute;
  background: url(../../../../static/images/learn/learn-doc-icon.svg);
  background-repeat: no-repeat;
  background-size: contain;
  top: 50%;
  margin-top: -7.85px;
  left: 270px;
}

.userdoc-item-wrap {
  width: 100%;
  border-radius: 5px;
  margin-top: 20px;
  overflow: hidden;
}
</style>
