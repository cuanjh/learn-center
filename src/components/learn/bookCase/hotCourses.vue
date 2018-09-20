<template>
  <div class="hot-courses">
    <router-link class="course-balk" :to="{path: '/app/book-case'}">
      <p></p>
      <span>返回</span>
    </router-link>
    <div class="hot-container">
      <div class="hot-letter">
        <div class="letter">
          <a href="#" class="letter_list active" v-for="(item , index) in letterList" :key="index">{{item}}</a>
        </div>
      </div>
      <div class="hot-content">
        <div class="hot-list">
          <a href="#" class="letter-gray">热门</a>
          <ul>
            <li>
              <div class="hot-img">
                <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
              </div>
              <div class="hot-title">
                <p>阿根廷</p>
              </div>
              <div class="hot-icon"></div>
            </li>
            <li>
              <div class="hot-img">
                <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
              </div>
              <div class="hot-title">
                <p>阿根廷</p>
              </div>
              <div class="hot-icon"></div>
            </li>
          </ul>
        </div>
        <div class="hot-list">
          <a href="#" class="letter-gray">A</a>
          <ul>
            <li>
              <div class="hot-img">
                <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
              </div>
              <div class="hot-title">
                <p>阿根廷</p>
              </div>
              <div class="hot-icon"></div>
            </li>
            <li>
              <div class="hot-img">
                <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
              </div>
              <div class="hot-title">
                <p>阿根廷</p>
              </div>
              <div class="hot-icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      letterList: ['热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  }

}
</script>
<style scoped>
  a {
    text-decoration:none;
  }
  .hot-courses {
    width: 1200px;
    margin: 0px auto 144px;
  }
  .course-balk {
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
   .bocourseok-balk p {
    display: inline-block;
    background: url(../../../../static/images/homework/balck.png);
    background-size: 100% 100%;
    margin-top: 6px;
    width: 12px;
    height: 18px;
  }
  .course-balk span {
    font-size: 16px;
    color: #999999;
  }
  .hot-container {
    width: 1200px;
    height: 800px;
    background: #ffffff;
    padding: 30px;
  }
  .hot-container .hot-letter {
    width: 100%;
    height: 65px;
    border-bottom: 1px solid #EBEBEB;
  }
  .hot-container .hot-letter .letter {
    width: 820px;
    height: 65px;
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
  }
  .hot-container .hot-letter .letter a:nth-child(1) {
    display: inline-block;
    width: 56px;
    height: 35px;
    font-size: 16px;
    background: #0581D1;
    color: #ffffff;
    box-shadow: 0px 2px 4px #000000;
    border-radius: 3px;
    text-align: center;
    line-height: 35px;
  }
  .hot-container .hot-letter .letter .letter_list {
    display: inline-block;
    width: 16px;
    font-size: 18px;
    color: #2A9FE4;
    text-align: center;
    line-height: 35px;
  }
  .hot-container .hot-content {
    width: 100%;
    margin-top: 10px;
  }
  .hot-container .hot-content .hot-list {
    width: 1100px;
    margin-left: 20px;
  }
  .hot-container .hot-content .hot-list .letter-gray {
    display: inline-block;
    width: 100%;
    height: 28px;
    font-size: 16px;
    color: #333333;
  }
  .hot-container .hot-content .hot-list ul {
    width: 100%;
  }
  .hot-container .hot-content .hot-list ul li{
    position: relative;
    width: 100%;
    padding: 16px 0;
    border-top: 1px solid #EBEBEB;
  }
  .hot-container .hot-content .hot-list ul li .hot-img{
    display: inline-block;
    width: 56px;
    height: 56px;
  }
  .hot-container .hot-content .hot-list ul li .hot-img img{
    width: 100%;
    height: 100%;
  }
  .hot-container .hot-content .hot-list ul li .hot-title {
    display: inline-block;
    font-size: 14px;
    color: #444444;
    line-height: 56px;
  }
  .hot-container .hot-content .hot-list ul li .hot-icon {
    position: absolute;
    top: 40px;
    right: 0;
    display: inline-block;
    width: 10px;
    height: 18px;
    background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
    background-size: 10px 18px;
  }
</style>
