<template>
  <div class="community">
    <div class="community-container">
      <!-- 左边内容区 -->
      <div class="community-content">
        <div class="left-content">
          <div class="user-info">
            <user-info-item :userInfoMessage="userInfoMessage"/>
          </div>
          <!-- 话题推荐 -->
          <banner-topic :bannerTopics="bannerTopics"></banner-topic>
          <!-- 动态列表 -->
          <div class="dynamic-content">
            <div class="dynamic-lists">
              <div class="dynamic-item" v-for="(dynamic, index) in dynamicsLists" :key="index">
                <dynamic-item :dynamic="dynamic"></dynamic-item>
              </div>
            </div>
          </div>
          <div class="more" @click="loadMore()">
            <span>点击加载更多数据</span>
          </div>
        </div>
      </div>
      <!-- 右边内容区 -->
      <div class="recommend-right">
        <!-- 为你推荐的语伴 -->
        <recommend-parnters :partnerLists="partnerLists"/>
        <!-- 主题聊天室 -->
        <chart-room></chart-room>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import dynamicItem from './dynamicItem.vue'
// import Cookie from '../../../tool/cookie'
import RecommendParnters from '../home/recommendParnters.vue'
import ChartRoom from '../home/chartRoom.vue'
import UserInfoItem from './userInfoItem.vue'
import BannerTopic from './bannerTopic.vue'

export default {
  data () {
    return {
      // userInfoMessage: {}, // 用户信息
      ID: [], // 移动端缓存的动态ID的数组
      topics: [], // 推荐的话题
      page: 1
    }
  },
  components: {
    UserInfoItem,
    BannerTopic,
    dynamicItem,
    RecommendParnters,
    ChartRoom
  },
  mounted () {
    console.log('dynamicsLists', this.dynamicsLists)
    this.getCommunity({excludeIds: this.ID})
    this.getDynamicLists({page: this.page, excludeIds: this.ID})
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      dynamicsLists: state => state.course.dynamicsLists, // 动态首页列表和打赏列表数据
      DynamicIndex: state => state.course.DynamicIndex // 动态首页数据
    }),
    dynamicsLists () {
      if (!Object.keys(this.$store.state.course.dynamicsLists).length) {
        return []
      }
      return this.$store.state.course.dynamicsLists
    },
    // 推荐的话题
    bannerTopics () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.bannerTopics
    },
    // 动态推荐的语伴parnter
    partnerLists () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.partners
    },
    userInfoMessage () {
      let userInfoMessage = this.userInfo
      if (Object.keys(userInfoMessage).length === 0) {
        userInfoMessage = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      return userInfoMessage
    }
  },
  methods: {
    ...mapActions({
      getDynamicLists: 'course/getDynamicLists', // 动态列表
      getAuthorDetail: 'course/getAuthorDetail', // 用户的详情
      getUserInfo: 'getUserInfo',
      getCommunity: 'course/getCommunity' // 动态首页
    }),
    loadMore () {
      this.dynamicsLists.forEach(item => {
        console.log('item', item.info.id)
        this.ID.push(item.info.id)
        console.log('ID', this.ID)
      })
      this.page++
      this.getDynamicLists({page: this.page, excludeIds: this.ID})
    }
  }
}
</script>
<style lang="less" scoped>
.community {
  width: 100%;
  margin: 20px 0 160px;
}
.community-container {
  width: 1200px;
  margin: 0 auto;
}
.community-content {
  display: inline-block;
  width: 820px;
  margin-right: 15px;
  .left-content {
    width: 100%;
    height: 100%;
    .user-info {
      width: 100%;
      background: #ffffff;
      padding: 21px 30px;
    }
    // 动态列表
    .dynamic-content {
      width: 100%;
      .dynamic-lists {
        width: 100%;
        height: 100%;
        .dynamic-item {
          width: 100%;
          height: 100%;
          padding: 29px 50px 44px;
          background: #ffffff;
          box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
          margin-top: 16px;
        }
      }
    }
  }
}
.recommend-right {
  width: 359px;
  display: inline-block;
}
</style>
