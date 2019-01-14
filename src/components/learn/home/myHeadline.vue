<template>
  <div class="my-headline">
    <div class="title">
      <span class="name">全球头条</span>
      <router-link class="more" tag="span" :to="{path: '/app/headline'}">更多新闻</router-link>
    </div>
    <ul>
      <li v-for="headline in headlines" :key="headline.id">
        <router-link tag="span" :to="{path: '/app/headline-details/' + headline.id}" v-text="headline.title"></router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['headlines']
}
</script>

<style lang="less" scoped>
.my-headline {
  width: 580px;
  height: 230px;
  background-color: #fff;
  box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
  border-radius:5px;
  display: inline-block;
  margin-right: 16px;
  padding-top: 44px;
  padding-left: 41px;
  .title {
    width: 100%;
    .name {
      color: #333;
      font-weight: bold;
      font-size: 18px;
    }
    .more {
      float: right;
      height:20px;
      font-size:14px;
      font-weight:bold;
      color:#3C5B6F;
      line-height:26px;
      margin-right: 40px;
      cursor: pointer;
    }
  }
  ul {
    margin-top: 34px;
    li {
      line-height: 25px;
      margin-top: 6px;
      span {
        height:20px;
        font-size:14px;
        font-weight:400;
        color:#333333;
        line-height:20px;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
</style>
