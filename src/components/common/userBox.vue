<template>
  <div class="user-info">
    <div class="content">
      <div class="bg-img"></div>
      <div class="info">
        <div class="user-img">
          <img :src="ui?ui.photo:''" alt="用户头像">
          <p class="name">
            <span>{{ui?ui.nickname:''}}</span>
          </p>
        </div>
      </div>
      <div class="lists">
        <ul>
          <li>
            <div class="num">
              <p>{{ui?ui.following_count:''}}</p>
              <p>关注</p>
            </div>
          </li>
          <li>
            <div class="num">
              <p>{{ui?ui.followed_count:''}}</p>
              <p>粉丝</p>
            </div>
          </li>
          <li>
            <div class="num">
              <p>{{ui?(ui.dynamic_num ? ui.dynamic_num : '0'):''}}</p>
              <p>动态</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {}
  },
  mounted () {
    console.log('ui', this.ui)
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo // 用户信息
    }),
    ui () {
      let ui = this.userInfo
      if (!ui) {
        ui = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      return ui
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.user-info {
  width: 280px;
  display: inline-block;
  background: #fff;
  margin-bottom: 20px;
  .content {
    position: relative;
    width: 100%;
    .bg-img {
      width: 100%;
      height: 70px;
      background: url('../../../static/images/user-bg-img.svg') no-repeat center;
      background-size: cover;
    }
    .info {
      position: absolute;
      top: 44px;
      width: 100%;
      padding: 0 20px;
      .user-img {
        width: 100%;
        display: flex;
        align-items: flex-end;
        padding-bottom: 30px;
        border-bottom: 1px solid #eef2f3ff;
        img {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 2px solid #fff;
        }
        .name {
          padding-left: 8px;
          font-size: 16px;
          color: #0a2b40ff;
          font-weight: bold;
          span {
            display: inline-block;
            width: 110px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .lists {
      width: 100%;
      height: 100px;
      margin-top: 70px;
      ul {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        li {
          .num {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          p {
            font-size: 14px;
            color: #b2c0c9ff;
          }
          p:nth-child(1) {
            font-size: 26px;
            color: #0a2b40ff;
            font-family: Impact;
            padding: 12px 0 6px;
          }
        }
      }
    }
  }
}
</style>
