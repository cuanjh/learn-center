<style scoped>
  .home-head {
    width: 100%;
    height: 80px;
    background-color: #299fe4;
  }

  .home-head .content {
    width: 1180px;
    margin: 0px auto;
    overflow: hidden;
  }

  .home-head .content h1 {
    float: left;
    width: 244px;
    height: 44px;
    margin-top: 18px;
  }
  .home-head .content h1 a  {
    display: block;
    width: 100%;
    height: 100%;
    text-indent: -9999px;
    background: url('./../../../static/images/home/logo.png') no-repeat;
    background-size: 100%;
  }
  ul {
    float: right;
    overflow: hidden;
    padding-right: 20px;
  }
  ul li {
    float: left;
    /* width: 80px; */
    /* height: 80px; */
    font-size: 15px;
    line-height: 80px;
    font-weight: 600;
    color: #fff;
    margin: 0 20px;
  }

  @media screen and (max-width: 1024px) {
    .home-head .content {
      /* width: 960px; */
      width: 100%;
    }
  }
</style>
<template>
  <div class="home-head">
    <div class="content">
      <h1><a href="https://www.talkmate.com/">Talkmate|全球说</a></h1>
      <ul>
        <li><a href="https://www.talkmate.com/">首页</a></li>
        <li><a href="https://www.talkmate.com/aboutus/index.html">关于我们</a></li>
        <li><a href="https://www.talkmate.com/product.html">产品与服务</a></li>
        <!-- <li><a href="https://www.talkmate.com/solution.html">解决方案</a></li> -->
        <!-- <li><a href="https://www.talkmate.com/unesco.html">教科文</a></li> -->
        <li><a href="https://www.talkmate.com/commonweal.html">学术与公益</a></li>
        <li><a href="https://www.talkmate.com/aboutus/news/index.html">新闻</a></li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
