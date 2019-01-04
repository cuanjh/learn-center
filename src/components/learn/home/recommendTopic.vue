<template>
  <div class="recomment-topic">
    <div class="title">推荐话题</div>
    <ul>
      <li v-for="(topic, index) in bannerTopics.slice(0, 3)" :key="index">
        <img :src="topic.banner_img_url" alt="">
        <div class="line-gradient"></div>
        <div class="topic">
          <p class="name" v-text="topic.topic_title"></p>
          <p class="num">{{topic.pub_num}}人参与</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['bannerTopics']
}
</script>

<style lang="less" scoped>
  .recomment-topic {
    width: 1200px;
    margin: 40px auto 0;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #849ea5;
      margin: 5px auto;
    }
    ul {
      li {
        display: inline-block;
        width: 380px;
        height: 90px;
        background-color: #fff;
        box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
        border-radius:5px;
        margin-right: 20px;
        img {
          width: 116px;
          height: 90px;
          border-radius:5px 0 0 5px;
        }
        .line-gradient {
          position: absolute;
          background: linear-gradient(to right, rgba(0, 0, 0, 0) , #fff);
          width: 86px;
          height: 90px;
          margin-top: -90px;
          margin-left: 30px;
        }
        .topic {
          display: inline-block;
          margin-left: 14px;
          .name {
            font-size: 16px;
            font-weight: bold;
            color: #333333;
            margin-top: 23px;
          }
          .num {
            font-size: 13px;
            font-weight: 500;
            color: #999999;
          }
        }
      }
    }
  }
</style>
