<template>
  <div class="book-details">
    <div>
    <router-link class="book-balk" :to="{path: '/app/book-case'}">
      <span>返回</span>
    </router-link>
    </div>
    <div class="details-header">
      <div class="details-top">
        <div class="details-title">
          <p>世界地图语言</p>
        </div>
        <div class="details-content">
          <div class="contains">
            <div class="details-img">
              <img src="../../../../static/images/bookCase/caseBig.png" alt="世界语言大图标">
            </div>
            <div class="details-resource">
              <p class="details-title">麦格</p>
              <p class="details">意大利语课程</p>
              <div class="course-content">
                <ul class="course">
                  <li>
                    <p class="title">课程</p>
                    <p class="number">144课时</p>
                  </li>
                  <li>
                    <p class="title">作业</p>
                    <p class="number">2344份</p>
                  </li>
                  <li>
                    <p class="title">价格</p>
                    <p class="number">150金币/课</p>
                  </li>
                  <li>
                    <p class="title">语言大使</p>
                    <p class="number">招募中</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <router-link class="button" :to="{path: '/app/course-list'}">
            <span>开始学习</span>
          </router-link>
        </div>
      </div>
      <div class="tab-item">
        <span v-bind:class="{'active': 'info' == tabFlag}" @click="tabChange('info')">信息</span>
        <span v-bind:class="{'active': 'resource' == tabFlag}" @click="tabChange('resource')">资源</span>
        <span v-bind:class="{'active': 'nation' == tabFlag}" @click="tabChange('nation')">国家</span>
      </div>
    </div>
    <div class="tab-content">
      <ul class="book-info" v-show="'info' == tabFlag">
        <li v-for="(item, key, index) in langInfoObj" :key="index" v-if="item.info">
          <p class="title">{{item.title}}</p>
          <p v-if="key === 'LanguageResources'" class="desc"><a :href="item.info">{{item.info}}</a></p>
          <p v-else class="desc">{{item.info}}</p>
        </li>
      </ul>
      <ul class="book-resource" v-show="'resource' == tabFlag">
        <li>
          <div class="book-img">
            <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
          </div>
          <div class="book-title">
            <p class="share-title">语言学习主题分享</p>
            <p class="share">奇迹蔷薇</p>
          </div>
          <div class="icon"></div>
        </li>
      </ul>
      <ul class="book-nation">
        <li>
          <div class="nation-img">
            <img src="../../../../static/images/bookCase/case.png" alt="资源图片">
          </div>
          <div class="nation-title">
            <p>阿根廷</p>
          </div>
          <div class="nation-icon"></div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import http from './../../../api/bookCase.js'
export default {
  data () {
    return {
      tabFlag: 'info', // true 语言信息 false 资源 电台
      langInfoObj: { // 目前只显示这几项 info为空代表后端没有这个信息
        'AlternateNames': {
          title: '别称',
          info: ''
        },
        'ISO_639_3': {
          title: 'ISO 639-3',
          info: ''
        },
        'Population': {
          title: '使用人口',
          info: ''
        },
        'Location': {
          title: '使用地区',
          info: ''
        },
        'Dialects': {
          title: '方言',
          info: ''
        },
        'LanguageUse': {
          title: '使用范围',
          info: ''
        },
        'LanguageDevelopment': {
          title: '语言发展情况',
          info: ''
        },
        'LanguageResources': {
          title: 'OLAC资源',
          info: ''
        }
      }
    }
  },
  mounted () {
    http.langInfo({course_code: this.$route.params.courseCode}).then(res => {
      for (var item in res.langInfo) {
        if (this.langInfoObj[item]) {
          this.langInfoObj[item]['info'] = res.langInfo[item]['info']
        }
      }
      console.log(this.langInfoObj)
    })
  },
  methods: {
    tabChange (tabFlag) {
      this.tabFlag = tabFlag
    }
  }

}
</script>

<style scoped>
  .book-details {
    width: 1200px;
    margin: 0px auto 144px;
  }
  a {
    text-decoration:none;
  }
  .book-balk {
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
  .book-balk p {
    display: inline-block;
    background: url(../../../../static/images/homework/balck.png);
    background-size: 100% 100%;
    margin-top: 6px;
    width: 12px;
    height: 18px;
  }
  .book-balk span {
    font-size: 16px;
    color: #999999;
  }
  .details-header {
    width: 100%;
    height: 302px;
    border-radius: 3px;
    box-shadow: 0px 2px 4px #DAE6F3;
    background-color: #fff;
    padding: 18px 36px 0px;
    position: relative;
  }
  .details-top {
    width: 100%;
    height: 30px;
  }
  .details-top .details-title {
    width: 144px;
    height: 30px;
    font-size: 24px;
    color: #2A9FE4;
  }
  .details-top .details-title p {
    line-height: 30px;
  }
  .details-top .details-content {
    height: 180px;
    /* border-bottom: 1px solid #EAEAEA; */
    margin: 10px 10px;
  }
  .details-top .details-content .contains {
    width: 80%;
    height: 100%;
    border-bottom: 1px solid #EAEAEA;
  }
  .details-top .details-content .details-img {
    display: inline-block;
    width: 295px;
    height: 147px;
  }
  .details-top .details-content .details-img img {
    width: 100%;
    height: 100%;
  }
  .details-top .details-content .details-resource {
    display: inline-block;
  }
  .details-top .details-content p {
    padding-left: 20px;
    font-size: 24px;
    color: #444444;
  }
  .details-top .details-content .details-title {
    margin-bottom: 5px;
  }
  .details-top .details-content .details-resource .course-content {
    width: 500px;
    height: 50px;
    margin-top: 34px;
  }
  .details-top .details-content .details-resource .course-content .course {
    display: flex;
    justify-content: space-between;
  }
  .details-top .details-content .details-resource .course-content .course li {
    height: 100%;
  }
  .details-top .details-content .details-resource .course-content .course li .title{
    font-size: 14px;
    color: #999999;
  }
  .details-top .details-content .details-resource .course-content .course li .number{
    font-size: 16px;
    color: #2A9FE4;
  }
   .details-top .details-content .button {
      width: 170px;
      height: 50px;
      background: #2A9FE4;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 50px;
      position: absolute;
      right: 6%;
      top: 35%;
      border-radius: 30px;
      box-shadow: 0px 5px 10px 0px #304A69;
   }
   .details-top .details-content .button:hover {
     background: rgba(11, 108, 224, .6)
   }
  .tab-item {
    overflow: hidden;
    position: absolute;
    bottom: 0px;
  }
  .tab-item span {
    float: left;
    display: block;
    font-size: 16px;
    color: #999;
    cursor: pointer;
    margin-right: 68px;
    padding: 0px 2px 12px;
  }
  .tab-item .active {
    color: #0581D1;
    border-bottom: 4px solid #0581D1;
    /* transition: all .5s linear; */
  }
  .tab-content {
    border-radius: 3px;
    background-color: #fff;
    /* box-shadow: 0px 2px 4px #DAE6F3; */
    padding: 46px 36px 22px;
    margin-top: 20px;
  }
  .book-info  li {
    margin-bottom: 34px;
  }
  .book-info .title {
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #EBEBEB;
    padding-bottom: 12px;
  }
  .book-info .desc {
    width: 852px;
    font-size: 16px;
    color: #999999;
    margin-top: 12px;
  }
  .book-info .desc a {
    color: #0581D1;
  }
  .book-resource {
    width: 100%;
    height: 630px;
    padding: 0px 60px 10px;
  }
  .book-resource li {
    position: relative;
    width: 100%;
    height: 73px;
    border-bottom: 1px solid #EBEBEB;
  }
  .book-resource li .book-img {
    display: inline-block;
    width: 100px;
    height: 50px;
  }
  .book-resource li .book-img img{
    width: 100px;
    height: 50px;
  }
  .book-resource li .book-title {
    display: inline-block;
    font-size: 14px;
    padding-left: 15px;
  }
  .book-resource li .book-title .share-title {
    color: #444444;
  }
  .book-resource li .book-title .share {
    color: #999999;
  }
  .book-resource li .icon {
    position: absolute;
    top: 15px;
    right: 0;
    display: inline-block;
    width: 10px;
    height: 18px;
    background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
    background-size: 10px 18px;
  }
  .book-nation {
    width: 100%;
    height: 630px;
    padding: 0px 60px 10px;
  }
  .book-nation li {
    position: relative;
    width: 100%;
    height: 73px;
    border-bottom: 1px solid #EBEBEB;
  }
  .book-nation li .nation-img {
    display: inline-block;
    width: 100px;
    height: 50px;
  }
  .book-nation li .nation-img img{
    width: 100px;
    height: 50px;
  }
  .book-nation li .nation-title {
    display: inline-block;
    font-size: 14px;
    color: #444444;
    padding-left: 15px;
    line-height: 50px;
  }
  .book-nation li .nation-icon {
    position: absolute;
    top: 15px;
    right: 0;
    display: inline-block;
    width: 10px;
    height: 18px;
    background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
    background-size: 10px 18px;
  }
</style>
