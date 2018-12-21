<template>
  <div class="learn-index">
    <b-map class="b-map" ref="map"></b-map>
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
    <my-course />
    <my-radio />
    <my-partner />
    <recommend-topic />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BMap from '../../common/map.vue'
import Bus from '../../../bus'
import MyCourse from './myCourse.vue'
import MyRadio from './myRadio.vue'
import MyPartner from './myPartner.vue'
import RecommendTopic from './recommendTopic.vue'

export default {
  data () {
    return {
      searchKey: '',
      isShowSearch: false
    }
  },
  components: {
    BMap,
    MyCourse,
    MyRadio,
    MyPartner,
    RecommendTopic
  },
  created () {
    this.initData()
  },
  mounted () {
    // this.initData()
    this.getUserInfo()
  },
  computed: {
    ...mapState({
      courseLangs: state => state.course.courseLangs,
      partnerList: state => state.course.partnerList
    })
  },
  methods: {
    ...mapActions({
      getCourseListV2: 'course/getCourseListV2',
      searchPartnerList: 'course/searchPartnerList',
      getUserInfo: 'getUserInfo'
    }),
    async initData () {
      // 加载官方语言数据
      await this.getCourseListV2()
      this.loadCourses()

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
      this.$refs.map.$emit('loadCourseLangs', this.courseLangs)
    }
  }
}
</script>

<style scoped>
  .learn-index {
    margin: -13px 0 100px 0;
    background-color: #F6F8F9;
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
</style>
