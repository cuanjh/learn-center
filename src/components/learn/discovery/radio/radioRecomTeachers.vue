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
              <div class="teacher-left">
                <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b9770784ab41/5b9770784ab41.jpg?hash=Fvl0qWXpSfVwsxGYv4FXt3Do_CZR" alt="头像">
                <div class="text">
                  <p>Japan 青田四五六</p>
                  <p>6780粉丝</p>
                </div>
              </div>
              <div class="teacher-right">
                <p class="button">
                  <i></i>
                  <span>关注</span>
                </p>
                <p class="hidden-button">
                  <i></i>
                  <span>隐藏</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="head-top"><span>其他</span></div>
          <div class="teacher-list">
            <div class="teacher-list-content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  methods: {}
}
</script>
<style lang="less" scoped>
.teachers {
  width: 1200px;
  margin: 0 auto;
  min-height: 1000px;
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
        }
      }
      .teacher-list {
        margin-top: 4px;
        width: 100%;
        height: 200px;
        background: #ffffff;
        .teacher-list-content {
          width: 100%;
          padding: 20px 40px;
          .teacher-left {
            display: flex;
            align-items: center;
            img {
              width: 60px;
              height: 60px;
              border-radius: 50%;
            }
            .text {
              padding-left: 10px;
              p:nth-child(1) {
                font-size: 16px;
                font-weight: bold;
                color: #0A2B40FF;
              }
              p:nth-child(2) {
                font-size: 14px;
                font-weight: bold;
                color: #7E929FFF;
              }
            }
          }
        }
      }
    }
  }
}
</style>
