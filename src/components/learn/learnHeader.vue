<style scoped>
  .header-box {
    width: 100%;
    height: 80px;
    background: #2A9FE4;
    position: fixed;
    top: 0px;
    z-index: 10;
  }
  .header-box .content {
    width: 1200px;
    margin: 0px auto;
  }
  .left {
    float: left;
    overflow: hidden;
  }
  .left img {
    float: left;
    width: 244px;
    height: auto;
    margin-top: 27px;
  }
  .left ul {
    float: left;
    padding-left: 14px;
  }
  .left ul li {
    float: left;
    height: 80px;
    line-height: 80px;
    font-size: 15px;
    color: #FFFFFF;
    margin-left: 46px;
    cursor: pointer;
    position: relative;
  }
  .left ul li i {
    width: 9px;
    height: 6px;
    background: url('./../../../static/img/learn/triangle.png') no-repeat;
    background-size: 9px 6px;
    position: absolute;
    top: 37px;
    right: -20px;
  }
  .triangle-up {
    transform: rotate(180deg);
    transition: all .3s ease-in-out;
  }
  .triangle-down {
    transform: rotate(0deg);
    transition: all .3s ease-in-out;
  }
  .right {
    float: right;
  }
  .right div {
    float: left;
    margin-left: 18px;
  }
  .search {
    width: 44px;
    height: 44px;
    border-radius: 22px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.4);
    margin-top: 18px;
    padding-right: 44px;
    position: relative;
  }
  .active {
    animation: widthAdd .5s ease 0s;
    animation-fill-mode: forwards;
  }
  @keyframes widthAdd {
    from {
      width: 44px
    }
    to {
      width: 240px;
    }
  }
  .search input {
    width: 100%;
    border: none;
    height: 44px;
    text-indent: 20px;
    font-size: 16px;
    background-color: transparent;
  }
  .search i {
    width: 44px;
    height: 44px;
    cursor: pointer;
    background: url('./../../../static/img/learn/search.png') no-repeat center center;
    background-size: 100%;
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .vip {
    width: 33px;
    height: 30px;
    background: url('./../../../static/img/learn/vip.png') no-repeat center center;
    background-size: 100%;
    margin-top: 25px;
  }
  .head-nation {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: red;
    margin-top: 15px;
    position: relative;
  }
  .head-nation .head {
    width: 50px;
    height: 50px;
    border: 1px solid #fff;
    border-radius: 25px;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .head-nation .nation {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: 1px solid #fff;
    position: absolute;
    top: 30px;
    right: -2px;
    z-index: 2;
  }
  .right .notice {
    width: 20px;
    height: 24px;
    background: url('./../../../static/img/learn/notice.png');
    background-size: 100%;
    margin-top: 28px;
  }
  .right .notice i {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #D02D02;
    margin-left: 12px;
    margin-top: 2px;
  }
</style>
<template>
  <div class="header-box">
    <div class="content">
      <div class="left">
        <a href=""><img src="./../../../static/img/home/logo.png" alt=""></a>
        <ul>
          <li @mouseenter="showAnimation" @mouseleave="showAnimation">学习
            <i v-bind:class="{'triangle-up': animationFlag, 'triangle-down': !animationFlag}"></i>
          </li>
          <li>发现</li>
          <li>我的</li>
        </ul>
      </div>
      <div class="right">
        <div class="search" v-bind:class="{'active':searchFlag}">
          <input type="text">
          <i @click="showSearch"></i>
        </div>
        <div class="vip"></div>
        <div class="head-nation">
          <img class="head" src="https://course-assets1.talkmate.com/course/icons/FRE-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1" alt="头像">
          <img class="nation" src="https://course-assets1.talkmate.com/course/icons/IND-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1" alt="国籍">
        </div>
        <div class="notice"><i></i></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      animationFlag: false,
      searchFlag: false
    }
  },
  methods: {
    showSearch (e) {
      this.searchFlag = !this.searchFlag
    },
    showAnimation () {
      this.animationFlag = !this.animationFlag
    }
  }
}
</script>
