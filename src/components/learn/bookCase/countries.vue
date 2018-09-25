<template>
  <div class="country-courses">
    <div class="country-container">
      <div class="country-letter">
        <div class="letter">
          <a href="#" class="letter_list active" v-for="(item , index) in letterList" :key="index">{{item}}</a>
          <p class="countries">全世界</p>
        </div>
      </div>
      <div class="country-content">
        <div class="country-list">
          <a href="#" class="letter-gray">A</a>
          <ul>
            <li @click="nationDetail()">
              <div class="country-img">
                <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
              </div>
              <div class="country-title">
                <p>阿根廷</p>
              </div>
              <div class="country-icon"></div>
            </li>
            <li>
              <div class="country-img">
                <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
              </div>
              <div class="country-title">
                <p>阿根廷</p>
              </div>
              <div class="country-icon"></div>
            </li>
          </ul>
        </div>
        <div class="country-list">
          <a href="#" class="letter-gray">B</a>
          <ul>
            <li>
              <div class="country-img">
                <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
              </div>
              <div class="country-title">
                <p>阿根廷</p>
              </div>
              <div class="country-icon"></div>
            </li>
            <li>
              <div class="country-img">
                <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
              </div>
              <div class="country-title">
                <p>阿根廷</p>
              </div>
              <div class="country-icon"></div>
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
      letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  },
  methods: {
    nationDetail () {
      this.$router.push({path: '/app/nation-details'})
    }
  }
}
</script>
<style scoped>
  a {
    text-decoration:none;
  }
  .country-courses {
    width: 1180px;
    margin-top: 20px;
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
  .country-container {
    width: 1180px;
    background: #ffffff;
    padding: 30px;
  }
  .country-container .country-letter {
    width: 100%;
    height: 65px;
    border-bottom: 1px solid #EBEBEB;
  }
  .country-container .country-letter .letter {
    width: 820px;
    height: 65px;
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
  }
  .country-container .country-letter .letter a:nth-child(1) {
    display: inline-block;
    width: 26px;
    height: 35px;
    font-size: 16px;
    background: #0581D1;
    color: #ffffff;
    box-shadow: 0px 2px 4px #000000;
    border-radius: 3px;
    text-align: center;
    line-height: 35px;
  }
  .country-container .country-letter .letter .letter_list {
    display: inline-block;
    width: 16px;
    font-size: 18px;
    color: #2A9FE4;
    text-align: center;
    line-height: 35px;
  }
  .country-container .country-letter .letter .countries {
    width: 54px;
    height: 26px;
    font-size: 18px;
    color: #0581D1;
    position: relative;
    left: 236px;
    top: 10px;
  }
  .country-container .country-content {
    width: 100%;
    margin-top: 10px;
  }
  .country-container .country-content .country-list {
    width: 1100px;
    margin-left: 20px;
  }
  .country-container .country-content .country-list .letter-gray {
    display: inline-block;
    width: 100%;
    height: 28px;
    font-size: 16px;
    color: #333333;
  }
  .country-container .country-content .country-list ul {
    width: 100%;
  }
  .country-container .country-content .country-list ul li{
    position: relative;
    width: 100%;
    padding: 16px 0;
    border-top: 1px solid #EBEBEB;
  }
  .country-container .country-content .country-list ul li .country-img{
    display: inline-block;
    width: 56px;
    height: 56px;
  }
  .country-container .country-content .country-list ul li .country-img img{
    width: 100%;
    height: 100%;
  }
  .country-container .country-content .country-list ul li .country-title {
    display: inline-block;
    font-size: 14px;
    color: #444444;
    line-height: 56px;
  }
  .country-container .country-content .country-list ul li .country-icon {
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
