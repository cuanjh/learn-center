<template>
  <section>
    <div class="userDoc-top">
      <div class="user-doc-content">
        <p class="user-doc">学习档案</p>
        <div class="user-doc-list">
          <ul>
            <li>
              <i class="grading"></i>
              <p>
                <span>测试定级</span>
                <span>{{ (userArchive.learnInfo && userArchive.learnInfo.grade_info.has_set_grade_status) ?  levelArr[userArchive.learnInfo.grade_info.grade_level] : '无'}}</span>
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
                <span>{{ (userArchive.learnInfo && userArchive.learnInfo.learn_days > 0) ? userArchive.learnInfo.learn_days + '天' : '暂无数据' }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="userDoc-bottom" >
      <div class='userdoc-item-wrap'>
        <doc-item :archive="userArchive"></doc-item>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DocItem from './userDocItem.vue'

export default {
  data () {
    return {
      userArchive: {},
      levelArr: ['初级 A1', '初级 A2', '中级 B1', '中级 B2', '高级 C1', '高级 C2']
    }
  },
  components: {
    DocItem
  },
  mounted () {
    this.$parent.$emit('activeNavUserItem', 'doc')
    this.$parent.$emit('navItem', 'user')

    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    let courseCode = userInfo.current_course_code
    this.getUserArchive({course_code: courseCode}).then(res => {
      console.log('用户课程档案', res)
      this.userArchive = res
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      courseArchives: state => state.user.courseArchives
    })
  },
  methods: {
    ...mapActions({
      getCourseArchives: 'user/getCourseArchives',
      getUserArchive: 'getUserArchive'
    })
  }
}
</script>

<style lang="less" scoped>
.userDoc-top {
  width: 100%;
  border-radius: 5px 5px 0 0;
  background-color: #ffffff;
  // margin-top: 90px;
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
            font-weight:500;
            color:rgba(144,162,174,1);
            span:nth-child(2) {
              display: block;
              font-size:22px;
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
