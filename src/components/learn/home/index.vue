<template>
  <div class="learn-index">
    <b-map class="b-map" ref="map"></b-map>
    <div class="search-box">
      <div class="search">
        <div class="search-inner-desc" v-show="!isShowSearch">
          <ul>
            <li><span class="endangered-languages"><i></i>濒危语种</span></li>
            <li><span class="wal-courses" @click="loadCourses()"><i></i>课程</span></li>
            <li><span class="wal-partners" @click="loadPartner()"><i></i>语伴</span></li>
          </ul>
          <!-- <span @click="removeMarks()"><i></i>remove</span> -->
          <span class="search-icon" @click="isShowSearch = true"><i></i></span>
        </div>
        <transition name="slide-fade" mode="out-in">
          <div class="search-inner" v-show="isShowSearch">
            <i @click="search()"></i>
            <input type="text" @keyup.enter="search()" v-model="searchKey" placeholder="Enter the language or country to search for">
            <i @click="cancelSearch()"></i>
          </div>
        </transition>
      </div>
    </div>
    <my-course />
    <my-radio :radios="radios" />
    <my-partner/>
    <recommend-topic :bannerTopics="bannerTopics" />
    <div class="headline">
      <my-headline :headlines="headlines"></my-headline>
      <mobile-apps></mobile-apps>
    </div>
    <div class="vip">
      <vip-prompt />
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BMap from '../../common/map.vue'
import VipPrompt from '../../common/vipPrompt.vue'
import Bus from '../../../bus'
import MyCourse from './myCourse.vue'
import MyRadio from './myRadio.vue'
import MyPartner from './myPartner.vue'
import RecommendTopic from './recommendTopic.vue'
import MyHeadline from './myHeadline.vue'
import MobileApps from './mobileApps.vue'

export default {
  data () {
    return {
      searchKey: '',
      isShowSearch: false,
      radios: [],
      headlines: []
    }
  },
  components: {
    BMap,
    MyCourse,
    MyRadio,
    MyPartner,
    RecommendTopic,
    MyHeadline,
    MobileApps,
    VipPrompt
  },
  created () {
    this.initData()
  },
  mounted () {
    // this.initData()
    var _this = this
    this.postDisvHome().then((res) => {
      console.log('发现首页', res)
      _this.radios = res.data.radios
      _this.headlines = res.data.headlines.slice(0, 3)
    })

    this.getCommunity({excludeIds: []})
  },
  computed: {
    ...mapState({
      partnerList: state => state.course.partnerList,
      DynamicIndex: state => state.course.DynamicIndex,
      courseLangsList: state => state.courseLangsList
    }),
    dynamicLists () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.dynamicList.dynamics.slice(0, 3)
    },
    // 推荐的话题
    bannerTopics () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.bannerTopics
    }
  },
  methods: {
    ...mapActions({
      searchPartnerList: 'course/searchPartnerList',
      postDisvHome: 'course/postDisvHome',
      getCommunity: 'course/getCommunity', // 动态首页
      getLangsList: 'getLangsList'
    }),
    async initData () {
      // 加载官方语言数据
      await this.getLangsList()
      // 加载语伴数据
      await this.searchPartnerList()
    },
    removeMarks () {
      this.$refs.map.$emit('removeMarks')
    },
    loadPartner () {
      this.$refs.map.$emit('loadPartner', this.partnerList)
    },
    cancelSearch () {
      this.searchKey = ''
      this.isShowSearch = false
    },
    search () {
      let key = this.searchKey
      Bus.$emit('mapSearch', key)
    },
    loadCourses () {
      this.$refs.map.$emit('loadCourseLangs', this.courseLangsList)
    }
  }
}
</script>

<style scoped>
  .learn-index {
    margin: -13px 0 100px 0;
  }

  .b-map {
    height: 420px;
  }

  .search-box {
    position: relative;
  }
  .search {
    position: absolute;
    width: 800px;
    height: 50px;
    border-radius: 31px;
    background: rgba(5,129,209,.8);
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    margin:-75px auto;
  }

  .search-inner-desc {
    width: 100%;
    line-height: 50px;
    position: absolute;
  }

  .search-inner-desc ul {
    display: inline-flex;
    width: 720px;
  }

  .search-inner-desc ul li{
    display: inline-block;
    width: 240px;
    text-align: center;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
  }

  .search-inner-desc span {
    cursor: pointer;
  }

  .search-inner-desc .endangered-languages i {
    width: 20px;
    height: 20px;
    background-image: url('../../../../static/images/learnIndex/wal-endangered-languages.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 14px 8px;
  }

  .search-inner-desc .wal-courses i {
    width: 20px;
    height: 20px;
    background-image: url('../../../../static/images/learnIndex/wal-courses.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 14px 8px;
  }

  .search-inner-desc .wal-partners i {
    width: 20px;
    height: 20px;
    background-image: url('../../../../static/images/learnIndex/wal-partners.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 14px 8px;
  }

  .search-inner-desc .search-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #fff;
    margin-top: 7px;
    float: right;
    margin-right: 7px;
  }

  .search-inner-desc .search-icon i {
    width: 14px;
    height: 14px;
    background-image: url('../../../../static/images/learnIndex/wal-search.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-left: 11px;
    margin-top: 11px;
  }

  .search-inner {
    width:785px;
    height:36px;
    background:rgba(248,250,251,1);
    border-radius:22px;
    margin: 7px 8px;
    text-align: center;
    position: absolute;
  }

  .search-inner > i:first-child {
    width: 14px;
    height: 14px;
    background-image: url('../../../../static/images/learnIndex/wal-search.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-top: 12px;
    margin-right: 4px;
    cursor: pointer;
  }

  .search-inner > i:last-child {
    width: 11px;
    height: 11px;
    background-image: url('../../../../static/images/bookCase/cancel.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-top: 11px;
    cursor: pointer;
  }

  .search-inner > input {
    height: 34px;
    width: 720px;
    margin:0 auto;
  }

  .search-inner > input::placeholder {
    color: #B8B8B8;
    font-size: 14px;
    font-weight: 500px;
  }

  .headline {
    width: 1200px;
    margin: 50px auto;
  }

  .vip {
    width: 1200px;
    margin: 0 auto;
  }
</style>
