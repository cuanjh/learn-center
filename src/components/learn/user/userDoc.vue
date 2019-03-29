<template>
  <section>
    <div class="userDoc-top">
      <!-- <ol>
        <li><i></i>学习档案</li>
        <li><span>金币</span><span v-text="userInfo ? userInfo.coins : ''"></span></li>
        <li><span>排行榜</span><span>暂无数据</span></li>
        <li><span>累计学习时长</span><span>{{ learnDays>0?learnDays+'天':'暂无数据' }}</span></li>
      </ol> -->
      <div class="user-doc-content">
        <p class="user-doc">学习档案</p>
        <div class="user-doc-list">
          <ul>
            <li>
              <i class="grading"></i>
              <p v-if="archives.current_chapter_code">
                <span>测试定级</span>
                <span>{{ levelDes[archives.current_chapter_code.split('-')[2]] }}</span>
              </p>
            </li>
            <li>
              <i class="products-notice"></i>
              <p>
                <span>排行榜</span>
                <span>暂无数据</span>
              </p>
            </li>
            <li>
              <i class="total-learn"></i>
              <p>
                <span>累计学习天数</span>
                <span>{{ learnDays>0?learnDays+'天':'暂无数据' }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="userDoc-bottom" >
      <div class='userdoc-item-wrap'>
        <!-- <doc-item :archive="archive" v-for="(archive, index) in archives" :key="index"/> -->
        <doc-item :archive="archives"></doc-item>
      </div>
    </div>
    <!-- <div class='user-course-nocourse' v-show="findGuide">
      <dl>
        <dt></dt>
        <dd>
          <p>您还没有学习档案哦！</p>
          <p>请到<router-link tag="span" :to="{path: '/app/find'}">“发现”</router-link>页面里订阅您喜欢的课程吧!</p>
        </dd>
      </dl>
    </div> -->
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import $ from 'jquery'
import DocItem from './userDocItem.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    DocItem
  },
  created () {
  },
  mounted () {
    this.$parent.$emit('activeNavUserItem', 'doc')
    this.$parent.$emit('navItem', 'user')
    this.initArchives()
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      levelDes: state => state.course.levelDes,
      // languagueHander: state => state.course.languagueHander,
      courseArchives: state => state.user.courseArchives
    }),
    learnDays () {
      return this.courseArchives.learn_days
    },
    archives () {
      console.log('archives======', this.courseArchives.archives)
      // let obj = this.courseArchives.archives
      // if (obj.length > 0) {
      //   return obj[0]
      //   // obj = JSON.parse(sessionStorage.getItem('courseArchives'))[0]
      // }
      // // return this.courseArchives.archives.filter((item) => {
      // //   return item.has_new_learn === 0
      // // })
      // return []
      if (!this.courseArchives.archives) {
        return false
      }
      return this.courseArchives.archives[0]
    },
    findGuide () {
      if (this.courseArchives.length > 0) {
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
    }),
    initArchives () {
      this.getCourseArchives().then((res) => {
        this.updateCourseArchives(res)
        setTimeout(() => {
          let height = $('.user-container').height() + 100
          $('.user-wrap').css('height', height + 'px')
        }, 100)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.userDoc-top {
  width: 100%;
  border-radius: 4px;
  background-color: #ffffff;
  margin-top: 90px;
  .user-doc-content {
    width: 100%;
    padding: 20px 0 25px;
    .user-doc {
      font-size:20px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(68,68,68,1);
      padding: 0 74px 0 25px;
    }
    .user-doc-list {
      padding-top: 37px;
      ul {
        display: flex;
        li {
          display: flex;
          align-items: center;
          width: 33.33%;
          justify-content: center;
          border-right: 1px solid #F5F5F5FF;
          i {
            display: inline-block;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            margin-right: 20px;
          }
          .grading {
            width: 35px;
            height: 40px;
            background-image: url('../../../../static/images/userInfo/grading.svg');
          }
          .products-notice {
            width: 37px;
            height: 45px;
            background-image: url('../../../../static/images/userInfo/products-notice.svg');
          }
          .total-learn {
            width: 39px;
            height: 43px;
            background-image: url('../../../../static/images/userInfo/total-learn.svg');
          }
          p {
            text-align: center;
            font-size:14px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(144,162,174,1);
            span:nth-child(2) {
              display: block;
              font-size:30px;
              font-family:PTSans-Caption;
              font-weight:normal;
              color:rgba(10,43,64,1);
            }
          }
        }
        li:last-child {
          border: none;
        }
      }
    }
  }
}

.userdoc-item-wrap {
  width: 100%;
  border-radius: 5px;
  margin-top: 10px;
}
</style>
