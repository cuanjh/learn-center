<style scoped>
  .bg-box {
    padding: 50px 0px;
    background-color: #fff;
  }
  .lang-box {
    width: 1000px;
    margin: 0px auto;
  }
  .lang-box .title-1 {
    color: #333;
    font-size: 30px;
    line-height: 42px;
    text-align: center;
    font-weight: 400;
    padding: 30px 0px;
  }
  .lang-box .title-2 {
    font-size: 18px;
    line-height: 25px;
    text-align: center;
    color: #333;
  }
  .course-lists {
    font-size: 0px;
    text-align: center;
    overflow: hidden;
    padding: 45px 0;
  }
  .course-lists li {
   float: left;
    width: 10%;
    padding: 20px 0px;
  }
  .hot-course li {
    float: none;
    display: inline-block;
  }
  .course-lists li img {
    width: 60px;
    height: 60px;
    border: 3px solid #e1e1e1;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    -ms-transition: all 0.3s;
    -o-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    transform-origin:30px 60px;
    -ms-transform-origin: 30px 60px;
    -o-transform-origin:30px 60px;
    -moz-transform-origin:30px 60px;
    -webkit-transform-origin:30px 60px;
  }
  .course-lists li:hover img {
    border: 3px solid #2A9FE4;
    transform: scale(1.1);
    -ms-transform: scale(1.1);
    -o-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -webkit-transform: scale(1.1);
  }
  .course-lists li p {
    font-size: 14px;
    color: #999;
    line-height: 20px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 30px;
  }
  .type-box {
    overflow: hidden;
    padding-left: 10px;
  }
  .type-box .item {
    float: left;
    width: 122px;
    height: 32px;
    font-size: 15px;
    line-height: 32px;
    color: #299fe4;
    text-align: center;
    cursor: pointer;
    border: 1px solid #299fe4;
    border-radius: 16px;
    background-color: #fff;
    margin: 0 10px;
  }
  .type-box .active {
    background-color: #299fe4;
    color: #fff;
    transition: .3s all ease;
  }
  .type-box .search {
    float: left;
    width: 530px;
    margin: 0 10px;
    position: relative;
  }
  .type-box input {
    width: 530px;
    height: 32px;
    font-size: 15px;
    line-height: 32px;
    color: #299fe4;
    border: 1px solid #299fe4;
    border-radius: 16px;
    background-color: #fff;
    padding: 0px 32px;
  }
  .type-box i {
    display: block;
    width: 32px;
    height: 32px;
    position: absolute;
    right: 8px;
    top: 0;
    background-color: red;
    background: url('./../../../static/images/home/search.svg') no-repeat center center;
    background-size: 20px;
  }
  .search-tip {
    line-height: 20px;
    font-size: 15px;
    text-align: center;
    padding: 30px 0px;
  }
</style>
<template>
  <div class="bg-box">
    <div class="lang-box">
      <p class="title-1">请选择你的语言课程并免费注册！</p>
      <p class="title-2">热门课程</p>
      <ul class="course-lists hot-course">
        <li v-for="(item, index) in hotcourse" :key="index" @click="goRegister(item.lan_code)">
          <img :src="qnUrl(item.flag)" alt="">
          <p>{{ item.name['zh-CN']}}</p>
        </li>
      </ul>
      <div class="type-box">
        <p class="item"
          v-bind:class="{'active':currentArea==='asia'}"
          @click="changeArea('asia')"
        >亚洲语言</p>
        <p class="item"
          v-bind:class="{'active':currentArea==='europe'}"
          @click="changeArea('europe')"
        >欧洲语言</p>
        <p class="item"
          v-bind:class="{'active':currentArea==='africa'}"
          @click="changeArea('africa')"
        >非洲语言</p>
        <p class="search">
          <input type="text" v-model="searchCourse">
          <i></i>
        </p>
      </div>
      <ul class="course-lists" v-show="currentList.length">
        <li v-for="(item, index) in currentList" :key="index" @click="goRegister(item.lan_code)">
          <img :src="qnUrl(item.flag)" alt="">
          <p>{{ item.name['zh-CN']}}</p>
        </li>
      </ul>
      <p class="search-tip" v-show="searchCourse&&!currentList.length">未搜到相关语言</p>
    </div>
  </div>
</template>
<script>
import http from './../../api/userAuth.js'
export default {
  data () {
    return {
      hotcourse: [], // 当前语言
      allCourse: {
        europe: [],
        africa: [],
        asia: []
      }, // 全部课程
      currentArea: 'asia',
      searchCourse: '' // 搜索课程
    }
  },
  computed: {
    currentList () {
      if (!this.searchCourse) {
        return this.allCourse[this.currentArea]
      } else {
        var list = []
        for (let areaKey in this.allCourse) {
          this.allCourse[areaKey].forEach((element, index) => {
            for (let key in element.name) {
              if (element.name[key].indexOf(this.searchCourse) !== -1) {
                list.push(element)
                break
              }
            }
          })
        }
        return list
      }
    }
  },
  mounted () {
    http.courseLists().then(res => {
      this.hotcourse = res.hot_langs
      res.course_langs.forEach(element => {
        if (element.area_key === 'europe' || element.area_key === 'artificial') {
          this.allCourse.europe = this.allCourse.europe.concat(element.lang_infos)
        } else if (element.area_key === 'africa') {
          this.allCourse.africa = this.allCourse.africa.concat(element.lang_infos)
        } else {
          this.allCourse.asia = this.allCourse.asia.concat(element.lang_infos)
        }
      })
    })
  },
  methods: {
    changeArea (area) {
      this.currentArea = area
    },
    qnUrl (url) {
      return url.split('?')[0] + '?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1'
    },
    goRegister (code) {
      this.$router.push({ path: `/auth/register/${code}` })
    }
  }
}
</script>
