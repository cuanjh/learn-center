<template>
  <div class="single-pk">
      <div class="head">
        <div class="icons"></div>
        <span>{{$t("singleResult.you")}}<span class="yellow">{{percent}}%</span>{{$t("singleResult.user")}}</span>
      </div>
      <div class="content">
        <div v-if="loaded" class="loaded"><span>{{$t("singleResult.load")}}</span></div>
        <div class="per f-cb" v-for="(user, index) in users" :key="index">
          <div class="order" :class="{self:currentUser.nickname === user.nickname}"><span>{{user.rank_num}}</span></div>
          <a @click="clickSelf(currentUser.nickname === user.nickname,$event)" target="ucenter">
            <img :src="user.photo">
          </a>
          <div class="name f-toe">
            <a  @click="clickSelf(currentUser.nickname === user.nickname,$event)" target="ucenter">{{user.nickname ? user.nickname : '&nbsp;'}}</a>
          </div>
          <div class="score"><b></b>{{user.correct_rate | toFix}}%</div>
          <div class="time"><b></b>00:{{user.learn_time | pad }}</div>
        </div>
      </div>
      <div class="footer">
        <div class="btn retry" @click="retry">{{$t("singleResult.retry")}}</div>
        <div class="btn continue" @click="continueBack">{{$t("singleResult.continue")}}</div>
      </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import _ from 'lodash'
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'

Vue.filter('pad', function (value) {
  return _.padStart(value, 2, '0')
})

Vue.filter('toFix', function (value) {
  return Math.floor(Number(value).toFixed(2) * 100000) / 1000
})

export default {
  props: ['data', 'path'],
  data () {
    return {
      percent: 0,
      currentUser: {},
      users: [],
      loaded: true
    }
  },
  computed: {
    ...mapState({
      currentChapterCode: state => state.course.currentChapterCode
    })
  },
  created () {
    this.$on('init-result', (result) => {
      console.log(result)
      var _this = this
      this['learn/getCourseTestRanking'](this.currentChapterCode).then((res) => {
        console.log(res)
        _this.loaded = false
        this.currentUser = res.result.current_user
        _this.percent = Math.floor((this.currentUser.correct_rate).toFixed(3) * 100000) / 1000
        _this.$set(_this, 'users', res.result.ranking)
      })
      //            Model.setPKScore(this.path, result.score)
      // var _this = this
      // var code = _.values(Config.LANG)
      //   .concat(this.path)
      //   .join('-')
      // $.ajax({
      //   method: 'post',
      //   url: Config.URL.single_res,
      //   data: {
      //     code: code,
      //     percent: result.score,
      //     time: result.time,
      //     question_num: result.question_num
      //   },
      //   dataType: 'json'
      // }).done(function(data) {
      //   _this.loaded = false
      //   _this.percent = Math.floor((+data.percent).toFixed(3) * 100000) / 1000
      //   _this.$set('users', data.users)
      // })

      // var user_progress = {
      //   slide_id: code,
      //   user_id: Config.userData.userID,
      //   progress: result.progress,
      //   score: result.score,
      //   time: result.time
      // }
      // $.ajax({
      //   method: 'post',
      //   url: Config.URL.pkRebot + '/battle/record',
      //   data: user_progress,
      //   dataType: 'json'
      // })

      // // 打统计点

      // statistics.finish_pk({
      //   user_id: Config.userData.userID,
      //   spend_time: result.time,
      //   pk_type: 'single',
      //   code: code
      // })
    })
  },
  methods: {
    ...mapActions(['learn/getCourseTestRanking']),
    retry () {
      this.$parent.$emit('back')
    },
    continueBack () {
      this.$parent.$emit('back', true)
    },
    clickSelf (self, event) {
      if (self) {
        event.preventDefault()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.single-pk,
.pk {
  .footer {
    padding-top: 15px;
    .btn {
      cursor: pointer;
      border-radius: 3px;
      background-color: #3be08d;
      display: inline-block;
      width: 123px;
      height: 35px;
      line-height: 35px;
      font-size: 1.3em;
      &:hover {
        background: linear-gradient(0deg, #46e892 0%, #38ce7f 100%);
      }
      &.dis {
        background: #b7bed4;
        cursor: default;
      }
    }
  }
}

.single-pk {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -300px;
  margin-top: -210px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #e9ecf6;
  background-color: #ffffff;
  width: 600px;
  height: 420px;
  color: #fff;
  .head {
    background-color: #55a4fc;
    font-weight: bolder;
    height: 75px;
    border-radius: 3px 3px 0 0;
  }
  .icons {
    display: inline-block;
    background: url(../../../../static/images/learnSystem/pk/pk-pencil.png) no-repeat;
    background-size: 48px 45px;
    width: 48px;
    height: 45px;
    position: relative;
    top: 17px;
    margin-right: 10px;
  }
  span {
    font-size: 22px;
  }
  .yellow {
    color: rgb(253, 227, 53);
  }
  .content {
    color: #5a6caf;
    width: 450px;
    height: 280px;
    margin: 0 auto;
    overflow: auto;
  }
  .per {
    line-height: 55px;
    border-bottom: 1px solid #e9ecf6;
    font-size: 1.3em;
    .name {
      float: left;
      width: 120px;
      text-align: left;
      color: #333;
    }
    img {
      float: left;
      border-radius: 50%;
      background-color: #f1f3fb;
      width: 32px;
      height: 32px;
      margin-right: 30px;
      margin-top: 10px;
    }
    .order {
      float: left;
      width: 50px;
      margin-right: 10px;
      span {
        font-size: 14px;
        line-height: 30px;
        color: #55a4fc;
      }
    }
    b {
      display: inline-block;
      position: relative;
      margin-right: 10px;
      top: 2px;
    }
    .score {
      float: left;
      width: 120px;
      b {
        background: url(../../../../static/images/learnSystem/pk/target.png) no-repeat;
        width: 16px;
        height: 16px;
      }
    }
    .self {
      span {
        display: inline-block;
        border-radius: 50%;
        background: #55a4fc;
        color: #fff;
        width: 30px;
        height: 30px;
      }
    }
    .time {
      float: left;
      b {
        background: url(../../../../static/images/learnSystem/pk/time.png) no-repeat;
        width: 14px;
        height: 14px;
      }
    }
  }
  .loaded {
    height: 280px;
    span {
      font-size: 1.3em;
      text-align: center;
      line-height: 280px;
    }
  }
  .footer {
    border-top: 1px solid #e9ecf6;
    margin-top: -1px;
    .btn {
      margin: 0 10px;
      font-weight: bolder;
    }
    .continue {
      background-color: #55a4fc;
      &:hover {
        background: linear-gradient(0deg, #59b3ff 0%, #4e9ff6 100%);
      }
    }
  }
}
</style>
