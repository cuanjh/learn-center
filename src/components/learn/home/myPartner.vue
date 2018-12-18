<template>
  <div class="my-partner">
    <div class="title">学习语伴</div>
    <div class="left">
      <div class="name">为你匹配到了语伴</div>
      <ul>
        <li v-for="n in 2" :key="n">
          <div class="partner-photo">
            <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5a901c662152c7c305b8d6db?v=1" alt="">
          </div>
          <div class="partner-info">
            <p class="name">宫本はるか</p>
            <p class="grasp-langs">日语、西班牙语</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="right">
      <div class="name">其他语伴</div>
      <ul>
        <li v-for="i in 5" :key="i">
          <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5a901c662152c7c305b8d6db?v=1" alt="">
        </li>
      </ul>
      <div class="change-batch">换一批</div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  .my-partner {
    width: 1200px;
    margin: 30px auto;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #849ea5;
      line-height: 35px;
    }
    .left {
      display: inline-block;
      width: 580px;
      height: 280px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
      margin-right: 15px;
      padding-left: 69px;
      padding-top: 80px;
      .name {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        height: 22px;
        line-height: 22px;
      }
      ul {
        li {
          display: inline-block;
          margin-top: 28px;
          margin-right: 35px;
          .partner-photo {
            display: inline-block;
            img {
              width: 64px;
              height: 64px;
              border-radius: 50%;
            }
          }
          .partner-info {
            display: inline-block;
            margin-left: 12px;
            .name {
              font-size: 17px;
              font-weight: bold;
              color: #333333;
              margin-top: 14px;
            }
            .grasp-langs {
              margin-top: 5px;
              font-size: 13px;
              font-weight: 500;
              color: #b8b8b8;
            }
          }
        }
      }
    }
    .right {
      display: inline-block;
      width: 580px;
      height: 280px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
      padding-left: 69px;
      padding-top: 80px;
      .name {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        height: 22px;
        line-height: 22px;
      }
      ul{
        li {
          margin-top: 40px;
          margin-right: 51px;
          display: inline-block;
          img {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }
      .change-batch {
        font-size: 14px;
        font-weight: 500;
        color: #999999;
        float: right;
        margin-top: 55px;
        margin-right: 32px;
        cursor: pointer;
      }
    }
  }
</style>
