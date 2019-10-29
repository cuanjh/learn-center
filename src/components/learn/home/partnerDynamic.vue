<template>
  <!-- 上面的推荐 -->
  <div class="recommend-top">
    <div class="recommend-lists">
      <div class="header">
        <div class="left">
          <i></i>
          <span>语伴动态</span>
        </div>
      </div>
      <div class="recommend-partners">
        <ul>
          <li v-for="(item, index) in dynamics.slice(0, 4)" :key="index">
            <div class="partner-img">
              <div class="header-img">
                <img :src="item.info.author_info.photo" alt="推荐语伴头像">
              </div>
              <div class="name">
                <span class="title">{{item.info.nickname}}</span>
              </div>
            </div>
            <div class="focus">
              <span>上传了视频</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="go-in">
      <router-link tag="p" :to="{path: 'community-index'}">
        <i></i>
        <span>进入社区</span>
      </router-link>
    </div>
  </div>
</template>
<script>

export default {
  props: ['dynamics'],
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {},
  methods: {
  }
}
</script>
<style lang="less" scoped>
.recommend-top {
  width: 100%;
  padding: 37px 30px 36px;
  background: #ffffff;
  .header {
    display: flex;
    justify-content: space-between;
    font-size:16px;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:36px;
    i {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: url('../../../../static/images/learnIndex/dynamic-icon.svg') no-repeat center;
      background-size: 100%;
      margin-right: 10px;
    }
  }
  .recommend-lists {
    width: 100%;
    .recommend-partners {
      width: 100%;
      margin-top: 30px;
      ul {
        width: 100%;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background:rgba(250,252,253,1);
          border-radius:38px;
          border:1px solid rgba(230,235,238,1);
          padding: 6px 20px 6px 7px;
          margin-bottom: 14px;
          .partner-img {
            display: flex;
            align-items: center;
            .header-img {
              position: relative;
              width: 35px;
              height: 35px;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .name {
              .title {
                font-size:14px;
                font-weight:800;
                color:rgba(102,102,102,1);
              }
            }
          }
          .focus {
            display: inline-block;
            cursor: pointer;
            span {
              font-size:14px;
              font-weight:500;
              color:rgba(102,102,102,1);
            }
          }
        }
      }
    }
  }
  .go-in {
    margin: 20px auto;
    width:190px;
    height:38px;
    background:rgba(42,159,228,1);
    border-radius:19px;
    text-align: center;
    p {
      display: inline-block;
      cursor: pointer;
      i {
        display: inline-block;
        width: 36px;
        height: 38px;
        background: url('../../../../static/images/community/goparnter.svg') no-repeat center;
        background-size: 100%;
      }
      span {
        font-size:14px;
        font-weight:bold;
        color:rgba(255,255,255,1);
        line-height:38px;
      }
    }
  }
}

</style>
