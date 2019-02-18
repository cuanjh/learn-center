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
            <div class="teacher-list-content"></div>
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
      }
    }
  }
}
</style>
