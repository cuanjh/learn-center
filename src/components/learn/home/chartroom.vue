<template>
  <div>
    <ul>
      <li v-for="i in 4" :key="i">
        <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5a901c662152c7c305b8d6db?v=1" alt="">
        <div class="content">
          <p class="name">一起留在日本的足迹</p>
          <p class="member-num">1284名成员</p>
        </div>
      </li>
      <li class="more">
        <span></span>
        <span></span>
        <span></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.chartroom {
  width: 100%;
  ul {
    display: inline-flex;
    li {
      width: 260px;
      height: 80px;
      background-color: #fff;
      box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
      border-radius:5px;
      margin-right: 20px;
      padding-left: 30px;
      padding-top: 18px;
      cursor: pointer;
      img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        object-fit: cover;
      }
      .content {
        display: inline-block;
        margin-left: 10px;
        padding-top: 2px;
        .name {
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          line-height: 20px;
        }
        .member-num {
          display: inline-block;
          font-size: 12px;
          font-weight: 500;
          color: #999999;
          line-height: 17px;
        }
      }
    }
    .more {
      width: 60px;
      padding: 35px 0;
      text-align: center;
      span {
        width: 4px;
        height: 4px;
        border-radius: 4px;
        background: #717f85;
        display: inline-block;
      }
    }
  }
}
</style>
