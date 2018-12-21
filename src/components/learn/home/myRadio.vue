<template>
  <div class="my-radio">
    <div class="title">
      电台课程
    </div>
    <div class="content">
      <div class="radio-player">
        <div class="title">为你推荐的电台课程</div>
        <div class="player"></div>
        <div class="radio">
          <p class="radio-title">日本配套课程A1课程</p>
          <p class="radio-src">全球说</p>
        </div>

      </div>
      <div class="right">
        <div class="radio-control">
          <router-link tag="span" :to="{path: '/app/discovery/radio-home'}" class="more">发现更多</router-link>
        </div>
        <ul class="radio-list">
          <li class="radio-item" v-for="i in 4" :key="i">
            <img src="https://uploadfile1.talkmate.com/uploadfiles/course/covers_v2/CHI-5ad9a8f2b4458.png?hash=FvS7Q2z1DXPILBRpqloOEyvnm8r3" alt="">
            <p class="radio-item-name">日语配套课程A1课程</p>
            <p class="radio-item-src">全球说</p>
          </li>
        </ul>
        <div class="change-batch">
          换一批
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
  .my-radio {
    width: 1200px;
    margin: 0 auto;
    padding-right: 20px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #849ea5;
      line-height: 35px
    }
    .content {
      height: 360px;
      background-color: #fff;
      box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
      border-radius:5px;
      .radio-player {
        display: inline-block;
        .title {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
          height: 22px;
          line-height: 22px;
          margin-left: 123px;
          margin-top: 62px;
        }
        .player {
          width: 325px;
          height: 182px;
          background-color: #f1f5f6;
          border-radius: 0 25px 25px 0;
          margin-top: 10px;
        }
        .radio {
          margin-left: 123px;
          margin-top: 12px;
          .radio-title {
            font-size: 14px;
            font-weight: bold;
            color: #333333;
          }
          .radio-src {
            margin-left: 42px;
            font-size: 13px;
            font-weight: 500;
            color: #b8b8b8;
            line-height: 18px;
          }
        }
      }
      .right {
        display: inline-block;
        .radio-control {
          margin-top: 63px;
          text-align: right;
          .more {
            font-size: 14px;
            font-weight: 500;
            color: #999999;
            margin-right: 53px;
            cursor: pointer;
          }
        }
        .radio-list {
          margin-top: 51px;
          margin-left: 80px;
          .radio-item {
            display: inline-block;
            margin-right: 61px;
            img {
              width: 131px;
              height: 72px;
              border-radius: 5px;
              object-fit: cover;
              background-color: #f4f4f4;
            }
            .radio-item-name {
              font-size: 14px;
              font-weight: 500;
              color: #333333;
              margin-top: 10px;
            }
            .radio-item-src {
              font-size: 12px;
              font-weight: 500;
              color: #b8b8b8;
              margin-top: 3px;
            }
          }
        }
        .change-batch {
          font-size: 14px;
          font-weight: 500;
          color: #999999;
          float: right;
          margin-top: 31px;
          margin-right: 40px;
          cursor: pointer;
        }
      }
    }
  }
</style>
