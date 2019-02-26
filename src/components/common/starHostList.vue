<template>
  <div class="star-host">
    <div class="name">
      <span>主播推荐</span>
      <router-link class="more" tag="span" :to="{path: 'radio-recom-teachers'}">更多
        <i></i>
      </router-link>
    </div>
    <div class="host-list">
      <ul v-if="teacherLists">
        <li v-for="(teacher, index) in teacherLists.slice(0, 4)" :key="index">
          <div class="list-cont">
            <div class="list-left">
              <img :src="teacher.photo" alt="头像">
              <div class="list-text">
                <router-link tag="span" :to="{path: '/app/discovery/author-detail/' + teacher.user_id}">{{teacher.author_name}}</router-link>
                <span>{{teacher.followed_count}}粉丝</span>
              </div>
            </div>
            <div class="list-right">
              <p class="button" @click="relation(teacher)">
                <i></i>
                <span v-if="teacher.has_followed === 0">关注</span>
                <span v-else>取消关注</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  props: ['teacherLists'],
  data () {
    return {}
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    ...mapActions({
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel' // 取消关注
    }),
    // 关注取消关注
    relation (teacher) {
      let followId = teacher.user_id
      if (teacher.has_followed === 1) { // 关注了
        console.log('关注了')
        this.remRadioRelationCancel({following_id: followId}).then((data) => {
          console.log('取消关注', data)
          if (data.success === true) {
            teacher.has_followed = 0
          }
        })
      } else if (teacher.has_followed === 0) { // 没关注
        console.log('没关注')
        this.getRadioRelationFollow({following_id: followId}).then((data) => {
          console.log('关注', data)
          if (data.success === true) {
            teacher.has_followed = 1
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.star-host {
  .name {
    font-size: 16px;
    font-weight: 600;
    color: #7e929fff;
    line-height: 22px;
    font-weight: Semibold;
    display: flex;
    justify-content: space-between;
    padding: 30px 0 10px;
    .more {
      font-size: 14px;
      color: #7e929fff;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        display: inline-block;
        width: 8px;
        height: 10px;
        background-image: url("../../../static/images/more.svg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        margin-left: 4px;
      }
      &:hover {
        cursor: pointer;
        color: #2a9fe4ff;
        i {
          background-image: url("../../../static/images/morehover.svg");
        }
      }
    }
  }
  .host-list {
    width: 100%;
    padding: 28px 20px;
    background: #ffffff;
    ul {
      list-style: none;
      li {
        list-style: none;
        margin-top: 36px;
        .list-cont {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .list-left {
            display: flex;
            img {
              width: 46px;
              height: 46px;
              border-radius: 50%;
            }
            .list-text {
              padding-left: 14px;
              span {
                display: block;
              }
              span:nth-child(1) {
                cursor: pointer;
                font-size: 16px;
                color: #0a2b40ff;
                line-height: 22px;
                font-weight: bold;
                padding-bottom: 4px;
                display: inline-block;
                width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              span:nth-child(2) {
                font-size: 14px;
                color: #7e929fff;
                line-height: 22px;
              }
            }
          }
          .list-right {
            padding: 4px 12px;
            background-color: #fff;
            border-radius: 18px;
            border: 1px solid #E6EBEEFF;
            p {
              display: flex;
              justify-content: center;
              align-items: center;
            }
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
          .list-right:hover {
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
      }
      li:nth-child(1) {
        margin-top: 0;
      }
    }
  }
}
</style>
