<template>
  <div class="world-map">
    <router-link class="world-balk" :to="{path: '/app/book-case'}">
      <p></p>
      <span>返回</span>
    </router-link>
    <div class="world-container">
      <div class="world-header">
        <div class="five-continents">
        </div>
        <div class="text">
          <p>世界语言地图</p>
          <p>查找，阅读和研究世界上已知的7,097种生活语言。</p>
          <p>
            <i></i>
            <span>在左侧地图选择大洲</span>
          </p>
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
.world-map {
  width: 1200px;
  margin: 0px auto 144px;
}
.world-balk {
  display: block;
  width: 80px;
  height: 30px;
  background: #ffffff;
  text-align: center;
  line-height: 30px;
  border-radius: 6px;
  margin-bottom: 28px;
  margin-top: 20px;
}
.world-balk p {
  display: inline-block;
  background: url(../../../../static/images/homework/balck.png);
  background-size: 100% 100%;
  margin-top: 6px;
  width: 12px;
  height: 18px;
}
.world-balk span {
  font-size: 16px;
  color: #999999;
}
.world-container {
  width: 1200px;
  height: 1000px;
  background: pink;
  .world-header {
    width: 100%;
    height: 460px;
    background: #ffffff;
    padding: 20px;
    .five-continents {
      width: 80%;
      height: 100%;
      background: salmon;
      border-right: 1px solid #EBEBEB;
    }
  }
}
</style>
