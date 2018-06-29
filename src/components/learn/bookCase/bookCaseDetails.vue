<style scoped>
  .book-details {
    width: 1200px;
    margin: 0px auto 144px;
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
  }
  .book-info  li {
    margin-bottom: 34px;
  }
  .book-info .title {
    font-size: 16px;
    color: #0581D1;
    border-bottom: 1px solid #EBEBEB;
    padding-bottom: 12px;
  }
  .book-info .desc {
    width: 506px;
    font-size: 16px;
    color: #494949;
    margin-top: 12px;
  }
  .book-info .desc a {
    color: #0581D1;
  }
</style>
<template>
  <div class="book-details">
    <div class="details-header">
      <div class="tab-item">
        <span v-bind:class="{'active': tabFlag}" @click="tabChange">信息</span>
        <span v-bind:class="{'active': !tabFlag}" @click="tabChange">资源</span>
      </div>
    </div>
    <div class="tab-content">
      <ul class="book-info">
        <li v-for="(item, key, index) in langInfoObj" :key="index" v-if="item.info">
          <p class="title">{{item.title}}</p>
          <p v-if="key === 'LanguageResources'" class="desc"><a :href="item.info">{{item.info}}</a></p>
          <p v-else class="desc">{{item.info}}</p>
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
      tabFlag: true, // true 语言信息 false 资源 电台
      langInfoObj: { // 目前只显示这几项 info为空代表后端没有这个信息
        'AlternateNames': {
          title: '别称',
          info: ''
        },
        'ISO_639_3': {
          title: '语言编码',
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
    tabChange () {
      this.tabFlag = !this.tabFlag
    }
  }

}
</script>
