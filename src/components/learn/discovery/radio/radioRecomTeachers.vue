<template>
  <div class="teachers">
    <div class="nav">
      <router-link :to="{path: '/app/index'}">
        我的学习账户
      </router-link>
      >
      <router-link :to="{path: '/app/discovery/radio-home'}">
        电台课程
      </router-link>
      >
      <div class="nav-current">
        分类
      </div>
    </div>
    <div class="teacher-container">
      <div class="teacher-content">
        <div class="left">
          <div class="head-top"><span>主播推荐</span></div>
          <div class="teacher-list">
            <div class="teacher-list-content">
              <div class="teacher-item" v-for="(teacher, index) in teachers" :key="index">
                <div class="teacher-left">
                  <img :src="teacher.photo" alt="头像">
                  <div class="text">
                    <router-link tag="p" :to="{path: '/app/discovery/radio-detail/' + teacher.code}">{{teacher.author_name}}</router-link>
                    <p>{{teacher.followed_count}}粉丝</p>
                  </div>
                </div>
                <div class="teacher-right">
                  <p class="button" @click="relation(teacher)">
                    <a v-if="teacher.has_followed === 0"><i></i>关注</a>
                    <a v-else>已关注</a>
                  </p>
                  <p class="hidden-button" @click="hidden(index)" v-show="false">
                    <span>隐藏</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="change-batch">
              <div class="p" @click="changeBatch()">
                <a>
                  <i ></i>换一批
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="head-top"><span>其他</span></div>
          <div class="teacher-list">
            <div class="teacher-list-content">
              <div class="teacher-item" v-for="(teacher, index) in teacherLists" :key="index">
                <div class="teacher-left">
                  <img :src="teacher.photo" alt="头像">
                  <div class="text">
                    <router-link tag="p" :to="{path: '/app/discovery/radio-detail/' + teacher.code}">{{teacher.author_name}}</router-link>
                    <p>{{teacher.followed_count}}粉丝</p>
                  </div>
                </div>
                <div class="teacher-right">
                  <p class="button" @click="relation(teacher)">
                    <a v-if="teacher.has_followed === 0"><i></i>关注</a>
                    <a v-else>已关注</a>
                  </p>
                  <p class="hidden-button" @click="hidden(index)" v-show="false">
                    <span>隐藏</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="change-batch">
              <div class="p" @click="changeBatchOther()">
                <a >
                  <i ></i>换一批
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../../bus.js'
export default {
  data () {
    return {
      teachers: [], // 主播老师
      teacherLists: [] // 其他老师
    }
  },
  mounted () {
    this.postDisvRadio().then((res) => {
      console.log('电台首页', res)
      this.teacherLists = this.randArray(res.data.authors)
      console.log('随机老师', this.teacherLists)
    })
    // 1是语言相关, 0和语言无关
    this.getLearnRecommendTeachers({'study_related': 1}).then(res => {
      console.log('res=====>', res)
      this.teachers = res.data
      console.log('老师', this.teachers)
    })
  },
  computed: {
    ...mapState({
      ...mapState({
        userInfo: state => state.userInfo // 用户信息
      })
    })
  },
  methods: {
    ...mapActions({
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel', // 取消关注
      postDisvRadio: 'course/postDisvRadio', // 电台首页
      getLearnRecommendTeachers: 'getLearnRecommendTeachers' // 课程相关的电台主播
    }),
    // 数组随机排序函数
    randArray (data) {
      /* eslint-disable */
      // 获取数组长度
      var arrLen = data.length
      // 创建数组 存放下标数
      var try1 = new Array()
      for (var i = 0; i < arrLen; i++) {
        try1[i] = i
      }
      // 创建数组 生成随机下标数
      var try2 = new Array()
      for (var j = 0 ; j < arrLen ; j++) {
        try2[j] = try1.splice(Math.floor(Math.random() * try1.length), 1)
      }
      // 创建数组，生成对应随机下标数的数组
      var try3 = new Array()
      for (var x = 0; x < arrLen; x++) {
        try3[x] = data[ try2[x] ]
      }
      return try3
       /* eslint-disable */
    },
    // 关注取消关注
    relation (teacher) {
      if (!this.userInfo) {
        Bus.$emit('showGoLoginBox')
        return
      }
      let followId = teacher.user_id
      if (teacher.has_followed === 1) { // 关注了
        console.log('关注了')
        this.remRadioRelationCancel({following_id: followId}).then((data) => {
          console.log('取消关注', data)
          if (data.success === true) {
            // _this.text = '关注'
            teacher.has_followed = 0
          }
        })
      } else if (teacher.has_followed === 0) { // 没关注
        console.log('没关注')
        this.getRadioRelationFollow({following_id: followId}).then((data) => {
          console.log('关注', data)
          if (data.success === true) {
            // _this.text = '取消关注'
            teacher.has_followed = 1
          }
        })
      }
    },
    // 点击隐藏
    hidden (index) {
      this.teachers.splice(index, 1)
    },
    // 换一批主播
    changeBatch () {
      this.teachers = this.randArray(this.teachers)
    },
    // 换一批其他老师
    changeBatchOther () {
      this.teacherLists = this.randArray(this.teacherLists)
    }
  }
}
</script>
<style lang="less" scoped>
.teachers {
  width: 1200px;
  margin: 0 auto;
  .nav {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    display: inline-block;
    font-size: 14px;
    a {
      color: #999999;
      &:hover {
        color: #2A9FE4;
      }
    }
    .nav-current {
      display: inline-block;
      color: #2A9FE4;
    }
  }
  .teacher-container {
    width: 100%;
    .teacher-content {
      display: flex;
      justify-content: space-between;
      .left {
        width: 49%;
      }
      .right {
        width: 49%;
      }
      .head-top {
        width: 100%;
        padding: 20px 40px;
        background: #ffffff;
        span {
          font-size: 16px;
          color: #333333FF;
          line-height: 22px;
          font-weight: bold;
        }
      }
      .teacher-list {
        margin-top: 4px;
        width: 100%;
        background: #ffffff;
        .teacher-list-content {
          width: 100%;
          padding: 6px 40px 0px;
          .teacher-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 14px 0;
            border-bottom: 1px solid #EEF2F3FF;
            .teacher-left {
              display: flex;
              align-items: center;
              img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
              }
              .text {
                padding-left: 10px;
                p:nth-child(1) {
                  cursor: pointer;
                  width: 120px;
                  font-size: 16px;
                  font-weight: bold;
                  color: #0A2B40FF;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
                p:nth-child(2) {
                  font-size: 14px;
                  font-weight: bold;
                  color: #7E929FFF;
                }
              }
            }
            .teacher-right {
              display: flex;
              justify-content: space-between;
              p {
                -webkit-user-select:none;
                -moz-user-select:none;
                -ms-user-select:none;
                user-select:none;
                i {
                  display: inline-block;
                  width: 12px;
                  height: 12px;
                  background-repeat: no-repeat;
                  background-position: center;
                  background-size: cover;
                  margin-right: 5px;
                }
              }
              p:nth-child(1) {
                i {
                  background: url("../../../../../static/images/follow.svg");
                }
                a {
                  padding: 3px 17px;
                  background-color: #fff;
                  border-radius: 15px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border: 1px solid #E6EBEEFF;
                  margin-right: 10px;
                  display: flex;
                  align-items: center;
                  font-size: 14px;
                  font-weight: 500;
                  color: #7E929FFF;
                  &:hover {
                    background-color: #2A9FE4FF;
                    font-size: 14px;
                    font-weight: 500;
                    color: #ffffff;
                    i {
                      background: url("../../../../../static/images/followhover.svg");
                    }
                  }
                }
              }
              p:nth-child(2) {
                padding: 3px 17px;
                background-color: #fff;
                border-radius: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #E6EBEEFF;
                span {
                  font-size: 14px;
                  font-weight: 500;
                  color: #7E929FFF;
                }
                &:hover {
                  cursor: pointer;
                  span {
                    color: #3C5B6FFF;
                  }
                }
              }
            }
          }
          .teacher-item:last-child {
            border-bottom: 0px;
          }
        }
        .change-batch {
          background: #fff;
          font-size: 14px;
          font-weight: 500;
          color: #999999;
          overflow: hidden;
          padding: 30px 40px;
          .p {
            float: right;
            display: inline-block;
            -webkit-user-select:none;
            -moz-user-select:none;
            -ms-user-select:none;
            user-select:none;
            a {
              display: flex;
              align-items: center;
              &:hover {
                color: #0581D1;
                i {
                  background-image: url('../../../../../static/images/learnIndex/icon-change-hover.svg');
                }
              }
            }
          }
          i {
            width: 15px;
            height: 15px;
            display: inline-block;
            background-image: url('../../../../../static/images/learnIndex/icon-change.svg');
            background-repeat: no-repeat;
            background-size: cover;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>
