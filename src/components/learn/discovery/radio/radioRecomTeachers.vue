<template>
  <div class="teachers">
    <div class="nav">
      <router-link :to="{path: '/app/user/course'}">
        <span>我的学习账户</span>
      </router-link>
      >
      <router-link :to="{path: '/app/discovery/radio-home'}">
        <span>电台课程</span>
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
                    <p>{{teacher.author_name}}</p>
                    <p>{{teacher.followed_count}}粉丝</p>
                  </div>
                </div>
                <div class="teacher-right">
                  <p class="button" @click="relation(teacher)">
                    <i></i>
                    <span v-if="teacher.has_followed === 0">关注</span>
                    <span v-else>取消关注</span>
                  </p>
                  <p class="hidden-button" @click="hidden(index)">
                    <span>隐藏</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="change-batch">
              <div class="p" @click="changeBatch()">
                <p v-show="inBatch">
                  <i ></i>
                  <span>换一批</span>
                </p>
                <p v-show="!inBatch">
                  <span>没有跟多了</span>
                </p>
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
                    <p>{{teacher.author_name}}</p>
                    <p>{{teacher.followed_count}}粉丝</p>
                  </div>
                </div>
                <div class="teacher-right">
                  <p class="button" @click="relation(teacher)">
                    <i></i>
                    <span v-if="teacher.has_followed === 0">关注</span>
                    <span v-else>取消关注</span>
                  </p>
                  <p class="hidden-button" @click="hidden(index)">
                    <span>隐藏</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="change-batch">
              <div class="p" @click="changeBatchOther()">
                <p v-show="inBatchOther">
                  <i ></i>
                  <span>换一批</span>
                </p>
                <p v-show="!inBatchOther">
                  <span>没有跟多了</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      inBatch: true,
      inBatchOther: true,
      teachers: [], // 老师
      teacherLists: [] // 其他老师
    }
  },
  mounted () {
    this.postDisvRadio().then((res) => {
      console.log('电台首页', res)
      this.teachers = res.data.authors
      console.log('老师', this.teachers)
      this.teacherLists = this.randArray(res.data.authors)
      console.log('随机老师', this.teacherLists)
    })
  },
  computed: {
  },
  methods: {
    ...mapActions({
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel', // 取消关注
      postDisvRadio: 'course/postDisvRadio' // 电台首页
    }),
    // 排序函数
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
    // 换一批
    changeBatch () {
      this.inBatch = false
    },
    changeBatchOther () {
      this.inBatchOther = false
    }
  }
}
</script>
<style lang="less" scoped>
.teachers {
  width: 1200px;
  margin: 0 auto;
  .nav {
    margin: 24px 0 12px 0;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
    a {
      span {
        color: #999999;
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
            .teacher-right{
              display: flex;
              justify-content: space-between;
              p {
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
                // width: 86px;
                padding: 4px 18px;
                background-color: #fff;
                border-radius: 18px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #E6EBEEFF;
                margin-right: 10px;
                i {
                  background: url("../../../../../static/images/follow.svg");
                }
                span {
                  font-size: 14px;
                  font-weight: 500;
                  color: #7E929FFF;
                }
                &:hover {
                  cursor: pointer;
                  background-color: #2A9FE4FF;
                  i {
                    background: url("../../../../../static/images/followhover.svg");
                  }
                  span {
                    font-size: 14px;
                    font-weight: 500;
                    color: #ffffff;
                  }
                }
              }
              p:nth-child(2) {
                width: 86px;
                padding: 4px 0;
                background-color: #fff;
                border-radius: 18px;
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
            cursor: pointer;
            &:hover {
              color: #0581D1;
              i {
                background-image: url('../../../../../static/images/learnIndex/icon-change-hover.svg');
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
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
