<template>
  <div class="nation-details">
    <div class="nav">
      <div class="nav-circle"></div>
      <router-link :to="{path: '/app/book-case'}">
        <span>书架</span>
      </router-link>
      /
      <router-link :to="{path: '/app/world-map'}">
        <span>世界语言地图</span>
      </router-link>
      /
      <div class="nav-current">
        国家详情
      </div>
    </div>
    <div class="nation-header">
      <div class="background-img"></div>
      <div class="nation-top">
        <div class="nation-title">
          <p>世界语言地图</p>
        </div>
        <div class="nation-content">
          <div class="containers">
            <p class="nation">{{naInfo.name}}</p>
            <p class="continents">{{naInfo.pName2}}</p>
          </div>
          <div class="nation-img">
            <img :src="naInfo.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="世界语言大图标">
          </div>
        </div>
      </div>
      <div class="tab-item">
        <span v-bind:class="{'active': 'info' == tabFlag}" @click="tabChange('info')">国家资料</span>
        <span v-bind:class="{'active': 'language' == tabFlag}" @click="tabChange('language')">拥有语言</span>
      </div>
    </div>
    <div class="country-contents">
      <ul class="country-info" v-show="'info' == tabFlag">
        <li v-if="nationInfo.DeafPopulation">
          <p class="title">{{nationInfo.DeafPopulation.title}}</p>
          <p class="desc">{{nationInfo.DeafPopulation.info}}</p>
        </li>
        <li v-if="nationInfo.GeneralReferences">
          <p class="title">{{nationInfo.GeneralReferences.title}}</p>
          <p class="desc">{{nationInfo.GeneralReferences.info}}</p>
        </li>
        <li v-if="nationInfo.GeneralRemarks">
          <p class="title">{{nationInfo.GeneralRemarks.title}}</p>
          <p class="desc">{{nationInfo.GeneralRemarks.info}}</p>
        </li>
        <li v-if="nationInfo.ImmigrantLanguages">
          <p class="title">{{nationInfo.ImmigrantLanguages.title}}</p>
          <p class="desc">{{nationInfo.ImmigrantLanguages.info}}%</p>
        </li>
        <li v-if="nationInfo.LanguageCounts">
          <p class="title">{{nationInfo.LanguageCounts.title}}</p>
          <p class="desc">{{nationInfo.LanguageCounts.info}}%</p>
        </li>
        <li v-if="nationInfo.LiteracyRate">
          <p class="title">{{nationInfo.LiteracyRate.title}}</p>
          <p class="desc">{{nationInfo.LiteracyRate.info}}</p>
        </li>
        <li v-if="nationInfo.OfficialName">
          <p class="title">{{nationInfo.OfficialName.title}}</p>
          <p class="desc">{{nationInfo.OfficialName.info}}</p>
        </li>
        <li v-if="nationInfo.Population">
          <p class="title">{{nationInfo.Population.title}}</p>
          <p class="desc">{{nationInfo.Population.info}}</p>
        </li>
        <li v-if="nationInfo.PrincipalLanguages">
          <p class="title">{{nationInfo.PrincipalLanguages.title}}</p>
          <p class="desc">{{nationInfo.PrincipalLanguages.info}}</p>
        </li>
      </ul>
      <ul class="country-language" v-show="'language' == tabFlag">
        <li v-for="item in langInfos" :key="item.lang_code" v-if="item.flag" @click="routerGo(item)">
          <div class="country-img">
            <img :src="item.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="资源图片">
          </div>
          <div class="country-title">
            <p>{{item.name}}</p>
          </div>
          <div class="country-icon" @click="routerGo(item)"></div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../bus'
export default {
  data () {
    return {
      tabFlag: 'info',
      nationInfo: {},
      langInfos: []
    }
  },
  computed: {
    ...mapState({
      subscribeCoursesStr: state => state.course.subscribeCoursesStr
    }),
    naInfo () {
      let nationInfos = JSON.parse(localStorage.getItem('nationInfos'))
      return nationInfos
    }
  },
  mounted () {
    this.countryInfo({code: this.$route.params.countryCode}).then(res => {
      console.log('res====>', res)
      this.nationInfo = res.country_info.info
      this.langInfos = res.country_info.langsInfo
      console.log('langInfos', this.langInfos)
    })
  },
  methods: {
    ...mapActions({
      countryInfo: 'course/countryInfo'
    }),
    tabChange (tabFlag) {
      this.tabFlag = tabFlag
    },
    routerGo (item) {
      let langCode = item['lang_code']
      if (this.subscribeCoursesStr.length === 0) {
        this.$router.push({path: '/app/book-details/' + langCode})
        return
      }
      let courseCode = item['courseCode']
      if (this.subscribeCoursesStr.indexOf(courseCode) > -1) {
        Bus.$emit('changeCourseCode', courseCode)
        return
      }
      this.$router.push({path: '/app/book-details/' + langCode})
    }
  }
}
</script>
<style lang="less">
  a {
    text-decoration:none;
  }

  .nav {
    margin: 20px 0;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
  }

  .nav-circle {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background-color: #999999;
    display: inline-block;
    margin-top: 9px;
  }

  .nav span {
    color: #999999;
  }

  .nav-current {
    display: inline-block;
    color: #2A9FE4;
  }

  .nation-details {
    width: 1180px;
    height: 1191px;
    margin: 0 auto;
  }
  .nation-header {
    position: relative;
    width: 1180px;
    height: 191px;
    background: #ffffff;
    .nation-top {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 20px 30px;
      .nation-title {
        width: 144px;
        height: 29px;
        color: #2A9FE4;
        font-size: 24px;
      }
      .nation-content {
        height: 137px;
        position: absolute;
        right: 40px;
        bottom: 15%;
        .containers {
          display: inline-block;
          margin-top: 40px;
          margin-right: 16px;
          .nation {
            font-size: 40px;
            color: #444444;
            margin-bottom: 18px;
            font-weight: bold;
          }
          .continents {
            font-size: 20px;
            color: #999999;
          }
        }
        .nation-img {
          display: inline-block;
          width: 208px;
          height: 137px;
          padding: 3px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0px 2px 4px 0px #999999;
          img {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            object-fit: cover;
          }
        }
      }
    }
    .background-img {
      width: 253px;
      height: 253px;
      background: url('../../../../static/images/bookCase/backgroundMap.png') no-repeat;
      background-size: contain;
      margin: 0 auto;
    }
    .tab-item {
      overflow: hidden;
      position: absolute;
      bottom: 0px;
      span {
        float: left;
        display: block;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        margin-left: 30px;
        padding: 0px 2px 12px;
        border-bottom: 4px solid #ffffff;
        &.active {
          color: #2A9FE4;
          border-bottom: 4px solid #2A9FE4;
        }
      }
    }
  }
  .country-contents {
    background-color: #fff;
    margin-top: 20px;
    padding: 30px 30px;
    height: 880px;
    overflow-y: scroll;
    &::-webkit-scrollbar {display:none}
    .country-info {
      width: 1082px;
      li {
        width: 1082px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: 30px;
        .title {
          font-size: 16px;
          color: #333333;
          border-bottom: 1px solid #EAEAEA;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .desc {
          font-size: 16px;
          color: #999999;
        }
      }
    }
    .country-language {
      width: 100%;
      height: 630px;
      padding: 0px 16px 0px 0px;
      li {
        position: relative;
        width: 100%;
        height: 73px;
        border-bottom: 1px solid #EBEBEB;
        margin-bottom: 20px;
        cursor: pointer;
        &:last-child {
          border-bottom: 0px;
        }
        .country-img {
          display: inline-block;
          width: 50px;
          height: 50px;
          border-radius: 4px;
          img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 4px;
          }
        }
        .country-title {
          display: inline-block;
          font-size: 14px;
          color: #444444;
          padding-left: 15px;
          line-height: 50px;
        }
        .country-icon {
          position: absolute;
          top: 15px;
          right: 0;
          display: inline-block;
          width: 10px;
          height: 18px;
          background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
          background-size: 10px 18px;
          cursor: pointer;
        }
      }
    }
  }
</style>
