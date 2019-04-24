<template>
  <div>
    <div class="topic">
      <div class="recommend">
        <p class="more">
          <span>话题推荐</span>
          <span>更多话题</span>
        </p>
        <div class="topic-lists">
          <div class="pre"><i @click="pre()"></i></div>
          <div class="list">
            <ul>
              <li v-for="(item, index) in bannerTopics.slice(startIndex, startIndex + 5)" :key="index">
                <img :src="item.cover_url" alt="推荐话题图片">
                <p class="title">
                  <span>{{item.topic_title}}</span>
                </p>
                <p class="number">
                  <i></i>
                  <span>{{item.pub_num}}</span>
                  <span>人参与</span>
                </p>
              </li>
            </ul>
          </div>
          <div class="next"><i @click="next()"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['bannerTopics'],
  data () {
    return {
      startIndex: 0
    }
  },
  methods: {
    pre () {
      if (this.startIndex === 0) {
        return
      }
      this.startIndex--
    },
    next () {
      if (this.startIndex + 5 === this.bannerTopics.length + 1) {
        return
      }
      this.startIndex++
    }
  }
}
</script>
<style lang="less" scoped>
// 推荐话题
.topic {
  width: 100%;
  padding: 13px 29px 33px;
  background: #ffffff;
  margin-top: 10px;
  .recommend {
    .more {
      display: flex;
      justify-content: space-between;
      font-size:14px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(144,162,174,1);
      line-height:20px;
      padding: 0 30px;
      span:nth-child(2):hover {
        cursor: pointer;
        color: #2a9fe4;
      }
    }
    .topic-lists {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .list {
        width: 100%;
        // height: 245px;
        float:left;
        overflow:hidden;
        position:relative;
      }
      .pre {
        font-size:16px;
        width:35px;
        text-align:center;
        padding: 0 10px;
        i {
          width: 14px;
          height: 42px;
          display: inline-block;
          background-image: url('../../../../static/images/bookCase/pre-icon.svg');
          background-repeat: no-repeat;
          background-size: 100%;
          cursor: pointer;
        }
      }
      .next {
        font-size:16px;
        width:35px;
        text-align:center;
        padding: 0 10px;
        i {
          width: 14px;
          height: 42px;
          display: inline-block;
          background-image: url('../../../../static/images/bookCase/next-icon.svg');
          background-repeat: no-repeat;
          background-size: 100%;
          cursor: pointer;
        }
      }
      ul {
        width: 100%;
        display: flex;
        overflow: hidden;
        li {
          position: relative;
          margin-right: 11px;
          width: 160px;
          img {
            width:158px;
            height:80px;
            border-radius: 6px;
            margin: 10px 0 6px;
          }
          .title {
            width:158px;
            height:80px;
            border-radius: 6px;
            background:rgba(0,0,0,.3);
            position: absolute;
            top: 10px;
            text-align: center;
            line-height: 80px;
            span {
              font-size:14px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(255,255,255,1);
            }
          }
          .number {
            i {
              display: inline-block;
              width: 16px;
              height: 14px;
              background: url('../../../../static/images/community/person.svg') no-repeat center;
              background-size: cover;
              margin-right: 4px;
              margin-top: 4px;
            }
            span {
              font-size:13px;
              font-weight:500;
              color:rgba(153,153,153,1);
              line-height:18px;
            }
          }
        }
        li:last-child {
          margin-right: 0px;
        }
      }
    }
  }
}
</style>
