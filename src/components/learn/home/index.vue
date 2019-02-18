<template>
  <div class="learn-index">
    <b-map class="b-map" ref="map"></b-map>
    <search-box />
    <map-statistics />
    <my-course />
    <my-radio />
    <!-- 语伴 -->
    <my-partner v-show="false"/>
    <!-- 话题 -->
    <recommend-topic :bannerTopics="bannerTopics" v-show="false"/>
    <!-- 头条 -->
    <div class="headline" v-show="true">
      <my-headline :headlines="headlines" v-show="false"></my-headline>
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
import SearchBox from './searchBox.vue'
import MapStatistics from './mapStatistics.vue'
import VipPrompt from '../../common/vipPrompt.vue'
import MyCourse from './myCourse.vue'
import MyRadio from './myRadio.vue'
import MyPartner from './myPartner.vue'
import RecommendTopic from './recommendTopic.vue'
import MyHeadline from './myHeadline.vue'
import MobileApps from './mobileApps.vue'

export default {
  data () {
    return {
      headlines: []
    }
  },
  components: {
    BMap,
    SearchBox,
    MapStatistics,
    MyCourse,
    MyRadio,
    MyPartner,
    RecommendTopic,
    MyHeadline,
    MobileApps,
    VipPrompt
  },
  mounted () {
    var _this = this
    this.postDisvHome().then((res) => {
      console.log('发现首页', res)
      // _this.radios = res.data.radios
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
      postDisvHome: 'course/postDisvHome',
      getCommunity: 'course/getCommunity' // 动态首页
    }),
    removeMarks () {
      this.$refs.map.$emit('removeMarks')
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

  .headline {
    width: 1180px;
    margin: 30px auto;
  }

  .vip {
    width: 1180px;
    margin: 0 auto;
  }
</style>
