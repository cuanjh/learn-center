<template>
  <div class="card-str">
    <div class="card-str-content">
      <p class="title">本课主播</p>
      <div class="author-info" v-if="courseInfo.author_info">
        <div class="author-pic">
          <img @click="goToUser(courseInfo.author_info.user_id)" :src="courseInfo.author_info.photo" alt="">
          <div class="passed">
            <a @click="goToUser(courseInfo.author_info.user_id)" class="name">{{courseInfo.author_info.nickname}}</a>
            <div class="passed-user">
              <span><i></i>认证用户</span>
              <p class="foreign-teacher" v-show="false">
                <span>英语外教</span>
              </p>
            </div>
          </div>
        </div>
        <div class="number">
          <ul>
            <li>
              <i class="collection"></i>
              <span>143</span>
            </li>
            <li>
              <i class="radio"></i>
              <span>33</span>
            </li>
            <li>
              <i class="fans"></i>
              <span>365</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="author-bottom">
        <p class="text">{{courseInfo.module_name}}</p>
        <div class="lists">
          <ul>
            <li v-for="(card, index) in courseInfo.cards" :key="index">
              <img :src="card.cover_url" alt="">
              <span>{{card.title}}</span>
            </li>
          </ul>
        </div>
        <p class="more-arrow">
          <router-link :to="{path: '/app/discovery/radio-detail/' + courseInfo.code}">更多<i></i></router-link>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: ['courseInfo'],
  data () {
    return {
    }
  },
  mounted () {
    // let userId = this.courseInfo.author_info.user_id
  },
  methods: {
    ...mapActions({
      getAuthorDetail: 'course/getAuthorDetail', // 作者的详情
      getRadioAuthorList: 'course/getRadioAuthorList' // 作者电台列表
    }),
    // 作者详情页面
    goToUser (userId) {
      this.$router.push({
        path: `/app/discovery/author-detail/${userId}`
      })
    }
  }
}
</script>
<style lang="less" scoped>
.card-str {
  width: 100%;
  margin-bottom: 20px;
  .card-str-content {
    width: 100%;
    padding: 14px 20px 18px;
    background: #ffffff;
    .title {
      font-size:16px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(126,146,159,1);
      line-height:22px;
      padding-bottom: 20px;
    }
    .author-info {
      width: 100%;
      .author-pic {
        width: 100%;
        display: flex;
        align-items: center;
        img {
          cursor: pointer;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover;
        }
        .passed {
          .name {
            display: inline-block;
            font-size:16px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(51,51,51,1);
            padding-bottom: 10px;
            max-width: 120px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            &:hover {
              color: #2A9FE4;
            }
          }
          .passed-user {
            display: flex;
            align-items: center;
            font-size:13px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(153,153,153,1);
            span {
              display: flex;
              align-items: center;
            }
            i {
              width: 13px;
              height: 13px;
              background-image: url('../../../../../static/images/discovery/radio-passed.png');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              margin-right: 6px;
            }
            .foreign-teacher {
              padding: 3px 8px;
              font-size:10px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(158,218,98,1);
              border-radius:11px;
              border:1px solid rgba(158,218,98,1);
              margin-left: 10px;
            }
          }
        }
      }
      .number {
        width: 100%;
        padding-top: 15px;
        padding-bottom: 20px;
        border-bottom: 1px solid #EAEAEAFF;
        ul {
          display: flex;
          justify-content: center;
          li {
            display: flex;
            align-items: center;
            i {
              display: inline-block;
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
            }
            .collection {
              width: 14px;
              height: 14px;
              background-image: url('../../../../../static/images/radioicon.svg');
            }
            .radio {
              width: 14px;
              height: 14px;
              background-image: url('../../../../../static/images/radioicon.svg');
            }
            .fans {
              width: 18px;
              height: 14px;
              background-image: url('../../../../../static/images/radioicon.svg');
            }
          }
          li:nth-child(2) {
            padding: 0 40px;
          }
        }
      }
    }
    .author-bottom {
      width: 100%;
      .text {
        font-size:16px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(51,51,51,1);
        line-height:22px;
        max-width: 180px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        padding-top: 20px;
        padding-bottom: 20px;
      }
      .lists {
        width: 100%;
        ul {
          width: 100%;
          li {
            padding-bottom: 15px;
            img {
              width:36px;
              height:36px;
              border-radius:6px;
              margin-right: 6px;
            }
            span {
              display: inline-block;
              max-width: 182px;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              line-height: 36px;
            }
          }
          li:last-child {
            padding-bottom: 0px;
          }
        }
      }
      .more-arrow {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-top: 12px;
        a {
          display: inline-block;
          font-size: 14px;
          font-weight: 500;
          color: #3C5B6F;
          &:hover {
            color: #2A9FE4;
            i {
              background-image: url('../../../../../static/images/learnIndex/icon-more-hover.svg');
            }
          }
          i {
            width: 9px;
            height: 10px;
            display: inline-block;
            background-image: url('../../../../../static/images/learnIndex/icon-more.svg');
            background-repeat: no-repeat;
            background-size: cover;
            margin-top: 4px;
            margin-left: 6px;
          }
        }
      }
    }
  }
}
</style>
