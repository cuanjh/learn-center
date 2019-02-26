<template>
  <div>
    <div class="recommend-teachers">
      <ul>
        <li
          v-for="author in this.authors.slice(this.startAuthorsIndex, this.startAuthorsIndex + 4)"
          :key="author.user_id"
        >
          <img @click="goToUser(author.user_id)" :src="author.photo" alt="老师头像">
          <p class="author_name" v-text="author.author_name"></p>
          <p class="title" v-text="'《' + author.title + '》'"></p>
          <!-- <p class="button">
            <i></i>
            <span>关注</span>
          </p> -->
          <div class="teacher-follow">
            <p class="button" @click="relation(author)">
              <i></i>
              <span v-if="author.has_followed === 0">关注</span>
              <span v-else>取消关注</span>
            </p>
          </div>
        </li>
        <li>
          <div class="view-more">
            <router-link tag="p" :to="{path: 'radio-recom-teachers'}">
              <span>查看更多</span>
              <i></i>
            </router-link>
          </div>
        </li>
      </ul>
      <div class="pre" @click="radioAuthorPre()">
        <i></i>
      </div>
      <div class="next" @click="radioAuthorNext()">
        <i></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  props: ['authors'],
  data () {
    return {
      startAuthorsIndex: 0
    }
  },
  methods: {
    ...mapActions({
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel' // 取消关注
    }),
    // 作者详情页面
    goToUser (userId) {
      this.$router.push({
        path: `/app/discovery/author-detail/${userId}`
      })
    },
    // 上一个
    radioAuthorPre () {
      if (this.startAuthorsIndex === 0) {
        return
      }
      this.startAuthorsIndex--
    },
    // 下一个
    radioAuthorNext () {
      if (this.startAuthorsIndex === this.authors.length - 4) {
        return
      }
      this.startAuthorsIndex++
    },
    // 关注取消关注
    relation (teacher) {
      let followId = teacher.user_id
      if (teacher.has_followed === 1) { // 关注了
        console.log('关注了')
        this.remRadioRelationCancel({following_id: followId}).then((data) => {
          console.log('取消关注', data)
          if (data.success === true) {
            // _this.text = '关注'
            teacher.has_followed = 0
          }
        })
      } else if (teacher.has_followed === 0) { // 没关注
        console.log('没关注')
        this.getRadioRelationFollow({following_id: followId}).then((data) => {
          console.log('关注', data)
          if (data.success === true) {
            // _this.text = '取消关注'
            teacher.has_followed = 1
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.recommend-teachers {
  margin: 16px 0 43px;
  position: relative;
  ul {
    margin-left: 17px;
    li {
      display: inline-block;
      width: 158px;
      background-color: #eef2f3;
      border-radius: 5px;
      margin-right: 14px;
      text-align: center;
      padding: 28px 22px 20px;
      img {
        width: 70px;
        height: 70px;
        background-color: #b2c0c9;
        border-radius: 50%;
        cursor: pointer;
      }
      .author_name {
        font-size: 14px;
        font-weight: bold;
        color: #103044;
        margin-top: 14px;
        // width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .title {
        color: #7E929FFF;
        padding-top: 4px;
        font-size: 14px;
        font-weight: 500;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .teacher-follow {
        display: inline-block;
      }
      .button {
        padding: 4px 18px;
        background-color: #fff;
        border-radius: 17px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 22px auto 0;
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url("../../../static/images/follow.svg") no-repeat
            center;
          background-size: cover;
          margin-right: 5px;
        }
        span {
          font-size: 14px;
          font-weight: 500;
          color: #0a2b40ff;
        }
      }
      .button:hover {
        cursor: pointer;
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url("../../../static/images/authorFllow.svg") no-repeat center;
          background-size: cover;
          margin-right: 5px;
        }
        span {
          color: #2a9fe4ff;
        }
      }
    }
    li:last-child {
      width: 158px;
      height: 234px;
      background-color: #ffffff;
      margin-right: 0px;
      text-align: center;
      .view-more {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        p {
          width: 158px;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 14px;
            color: #b2c0c9;
            line-height: 20px;
            padding-right: 8px;
          }
          i {
            display: inline-block;
            width: 8px;
            height: 10px;
            background-image: url("../../../static/images/more.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }
          &:hover {
            cursor: pointer;
            i {
              background-image: url("../../../static/images/morehover.svg");
            }
            span {
              color: #2A9FE4FF;
            }
          }
        }
      }
    }
  }
  .pre {
    position: absolute;
    // background-color: #fff;
    left: 0;
    top: 44%;
    width: 28px;
    height: 36px;
    // box-shadow:3px 1px 4px 0px rgba(60,91,111,0.05);
    border-radius: 0px 5px 5px 0px;
    cursor: pointer;
    i {
      width: 28px;
      height: 36px;
      background-image: url("../../../static/images/left.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      display: inline-block;
      &:hover {
        background-image: url("../../../static/images/lefthover.svg");
      }
    }
  }
  .next {
    position: absolute;
    right: 0;
    // background-color: #fff;
    right: 0;
    top: 44%;
    width: 28px;
    height: 36px;
    // box-shadow:-3px 1px 4px 0px rgba(60,91,111,0.05);
    border-radius: 5px 0px 0px 5px;
    cursor: pointer;
    i {
      width: 28px;
      height: 36px;
      background-image: url("../../../static/images/right.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      display: inline-block;
      &:hover {
        background-image: url("../../../static/images/righthover.svg");
      }
    }
  }
}
</style>
