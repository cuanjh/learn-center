<template>
  <div class="world-lang-map">
    <b-map class="b-map" ref="map" :data="data"></b-map>
    <div class="search-box">
      <div class="search">
        <div class="search-inner-desc" v-show="!isShowSearch">
          <span @click="loadCourses()"><i></i>课程</span>
          <span @click="loadPartner()"><i></i>语伴</span>
          <span @click="removeMarks()"><i></i>remove</span>
          <span @click="isShowSearch = true"><i></i></span>
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
    <div class="area-map">
      <div class="area-tab">
        <ul>
          <li v-for="(map, index) in maps" :key="map.code" @click="changeTab(index)">
            <span v-text="map.name"></span>
            <div class="hover-line" v-show="index === curAreaIndex"><i></i></div>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="area-country-info">
        <ul>
          <li v-for="country in curAreaCountries" :key="country.path">
            <img :src="country.flag" :onerror="defaultImg" alt="">
            <span v-text="country.name"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import BMap from '../../common/map.vue'
import Bus from '../../../bus'
export default {
  data () {
    return {
      maps: {},
      data: {},
      searchKey: '',
      isShowSearch: false,
      curAreaIndex: 0,
      allCountries: [],
      defaultImg: 'this.src="/static/images/bookCase/default_course.png"'
    }
  },
  components: {
    BMap
  },
  mounted () {
    this.worldLanguageMap().then((res) => {
      console.log(res)
      this.maps = res.maps
      this.data = this.maps
    })
    this.initData()
  },
  computed: {
    ...mapState({
      courseLangs: state => state.course.courseLangs,
      partnerList: state => state.course.partnerList
    }),
    curAreaCountries () {
      let countries = []
      let map = this.maps[this.curAreaIndex]
      if (!map) {
        return []
      }
      map.areasInfo.forEach(areaInfo => {
        let countriesInfo = areaInfo.countriesInfo
        countriesInfo.forEach(country => {
          let obj = country
          obj['path'] = map.code + '-' + areaInfo.code + '-' + country.code
          countries.push(obj)
        })
      })
      console.log(countries)
      return countries
    }
  },
  methods: {
    ...mapActions({
      worldLanguageMap: 'course/worldLanguageMap',
      getCourseListV2: 'course/getCourseListV2',
      getPartnerList: 'course/getPartnerList'
    }),
    changeTab (index) {
      this.curAreaIndex = index
    },
    cancelSearch () {
      this.searchKey = ''
      this.isShowSearch = false
    },
    search () {
      let key = this.searchKey
      Bus.$emit('mapSearch', key)
    },
    async initData () {
      await this.getCourseListV2()
      await this.getPartnerList()
      console.log('parterlist', this.partnerList)
      // 加载官方语言数据
      this.$refs.map.$emit('loadCourseLangs', this.courseLangs)
    },
    removeMarks () {
      this.$refs.map.$emit('removeMarks')
    },
    loadPartner () {
      this.$refs.map.$emit('loadPartner', this.partnerList)
    }
  }
}
</script>

<style scoped>
  .world-lang-map {
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
    width: 860px;
    height: 50px;
    border-radius: 31px;
    background: rgba(0, 0, 0, .7);
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    margin:-75px auto;
  }

  .search-inner-desc {
    line-height: 48px;
    position: absolute;
  }

  .search-inner-desc span {
    color: #fff;
    font-weight: 500;
    font-size: 14px;
    margin-left: 12px;
    cursor: pointer;
  }

  .search-inner-desc span:nth-child(1) {
    margin-left: 64px;
  }

  .search-inner-desc span:nth-child(1) i {
    width: 12px;
    height: 20px;
    background-image: url('../../../../static/images/bookCase/endangered-small.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 14px 8px;
  }

  .search-inner-desc span:nth-child(2) i {
    width: 12px;
    height: 20px;
    background-image: url('../../../../static/images/bookCase/security-small.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 14px 8px;
  }

  .search-inner-desc span:nth-child(3) i {
    width: 14px;
    height: 16px;
    background-image: url('../../../../static/images/bookCase/belt-road-line.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 16px 8px;
  }

  .search-inner-desc span:nth-child(4) {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #fff;
    margin-top: 7px;
    display: inline-block;
    margin-left: 36px;
  }

  .search-inner-desc span:nth-child(4) i {
    width: 14px;
    height: 14px;
    background-image: url('../../../../static/images/bookCase/search-key.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-left: 10px;
    margin-top: 10px;
  }

  .search-inner {
    width:844px;
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
    background-image: url('../../../../static/images/bookCase/search-key.svg');
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
    margin-top: 12px;
    cursor: pointer;
  }

  .search-inner > input {
    height: 36px;
    width: 774px;
    margin:0 auto;
  }

  .search-inner > input::placeholder {
    color: #B8B8B8;
    font-size: 14px;
    font-weight: 500px;
  }

  .area-map {
    width: 100%;
    background-color: #ffffff;
  }

  .area-tab {
    width: 960px;
    margin: 0 auto;
  }

  .area-tab > ul {
    height: 60px;
  }

  .area-tab > ul > li {
    display: inline-block;
    width: 190px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    line-height: 75px;
    color: #000;
    cursor: pointer;
  }

  .area-tab > ul > li > span {
    margin: 0 auto;
  }

  .area-map .hover-line {
    height: 4px;
    width: 120px;
    margin: -15px auto;
    background-color: #0581D1;
  }

  .area-map .hover-line i {
    height: 4px;
    width: 8px;
    background-image: url('../../../../static/images/bookCase/triangle.svg');
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: -4px;
    display: inline-block;
  }

  .area-map .line {
    width: 100%;
    height: 4px;
    background-color: #DFE9EF;
  }

  .area-country-info {
    width: 960px;
    height: 330px;
    margin: 0 auto;
  }

  .area-country-info ul{
    height: 260px;
    margin-top: 15px;
    margin-left: 35px;
    padding-bottom: 80px;
    overflow: auto;
  }

  .area-country-info ul::-webkit-scrollbar {
    display: none;
  }

  .area-country-info ul li {
    width: 25%;
    display: inline-flex;
    margin-top: 20px;
  }

  .area-country-info ul li img {
    width: 30px;
    height: 20px;
    object-fit: cover;
    display: inline-block;
    border-radius: 1px;
    margin-right: 18px;
  }

  .area-country-info ul li span {
    font-size: 14px;
    font-weight: 500px;
    color: #444444;
    line-height: 20px;
    height: 20px;
  }

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(100px);
    opacity: 0;
  }

</style>
