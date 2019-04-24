<template>
  <div class="my-partner">
    <div class="title">学习语伴</div>
    <div class="my-content">
      <div class="left">
        <!-- <div class="name"><i></i>语伴动态</div>
        <ul>
          <li v-for="(dynamic, index) in dynamicLists" :key="index">
            <home-dynamic-item :dynamic="dynamic"/>
          </li>
        </ul> -->
        <!-- 进入语伴聊天室 -->
        <!-- <div class="go-in">
          <router-link tag="p" :to="{path: 'community-index'}">
            <i></i>
            <span>进入语伴聊天室</span>
          </router-link>
        </div> -->
        <!-- 为你推荐的语伴 -->
        <reference-partner :partnerLists="partnerLists"></reference-partner>
      </div>
      <div class="right">
        <!-- 语伴动态 -->
        <partner-dynamic :dynamics="dynamics"></partner-dynamic>
        <!-- <recommend-parnters :parnterLists="parnterLists"/>
        <chart-room/> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import RecommendParnters from '../home/recommendParnters.vue'
import ChartRoom from '../home/chartRoom.vue'
import HomeDynamicItem from './homeDynamicItem.vue'
import ReferencePartner from './referencePartner.vue'
import PartnerDynamic from './partnerDynamic.vue'

export default {
  data () {
    return {
      reviewShow: false, // 评论输入框
      showEmoji: false, // 笑脸表情
      emojiDataUTF: [],
      emojiData: [],
      content: '' // input输入的内容
    }
  },
  components: {
    RecommendParnters,
    ChartRoom,
    HomeDynamicItem,
    ReferencePartner,
    PartnerDynamic
  },
  mounted () {
    // for (let key in this.$emoji.EMOJI_MAP) {
    //   this.emojiDataUTF.push(key) // 和后端交互时使用UTF码
    //   this.emojiData.push(this.$emoji.unifiedToHTML(key))
    // }
    // this.getCommunity({excludeIds: []})
  },
  computed: {
    ...mapState({
      DynamicIndex: state => state.course.DynamicIndex // 动态首页数据
    }),
    dynamics () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.dynamicList.dynamics
    },
    // 动态推荐的语伴parnter
    partnerLists () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.partners
    }
  },
  methods: {
    ...mapActions({
      getCommunity: 'course/getCommunity' // 动态首页
    })
    // 评论输入框
    // clickShoeReview () {
    //   this.reviewShow = !this.reviewShow
    //   this.hitShow = !this.hitShow
    // },
    // // 评论
    // send (id, typeInfo) {
    //   this.radioAuthorCommentPub({id: id, type_info: typeInfo, comment: this.content}).then((data) => {
    //     console.log('点击评论返回', data)
    //     this.content = '' // 在返回结束时清空内容
    //     // 处理评论列表的内容
    //     this.dynamic.info.comment_num += 1
    //   })
    // },
    // // 关注
    // relation () {
    //   let _this = this
    //   let followId = _this.dynamic.info.user_id
    //   if (_this.dynamic.info.has_followed === true) {
    //     _this.remRadioRelationCancel({following_id: followId}).then(data => {
    //       if (data.success) {
    //         _this.dynamic.info.has_followed = false
    //       }
    //     })
    //   } else {
    //     _this.getRadioRelationFollow({following_id: followId}).then(data => {
    //       if (data.success) {
    //         _this.dynamic.info.has_followed = true
    //       }
    //     })
    //   }
    // },
    // // 点击表情添加到input框
    // chooseEmoji (index, e) {
    //   console.log('e', e)
    //   let text = e.target.innerHTML
    //   this.content = this.content + text
    //   this.showEmoji = !this.showEmoji
    // }
  }
}
</script>

<style lang="less" scoped>
  .my-partner {
    width: 1200px;
    margin: 30px auto;
    .title {
      font-size: 15px;
      font-weight: bold;
      color: #849ea5;
      line-height: 35px;
    }
    .my-content {
      display: flex;
      justify-content: space-between;
      .left {
        display: inline-block;
        width: 820px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
      }
      .right {
        display: inline-block;
        width: 340px;
        // height: 480px;
        border-radius: 5px;
        background: #fff;
        box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
      }
    }
  }
</style>
