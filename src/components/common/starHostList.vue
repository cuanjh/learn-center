<template>
  <div class="star-host">
    <div class="name">
      <span>学习主播推荐</span>
      <span class="more">更多
        <i></i>
      </span>
    </div>
    <div class="host-list">
      <ul>
        <li>
          <div class="list-cont">
            <div class="list-left">
              <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI"
                alt="头像">
              <div class="list-text">
                <span>信じよ</span>
                <span>198粉丝</span>
              </div>
            </div>
            <div class="list-right">
              <!-- <span>-</span> -->
              <i></i>
              <span>关注</span>
            </div>
          </div>
        </li>
        <li>
          <div class="list-cont">
            <div class="list-left">
              <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI"
                alt="头像">
              <div class="list-text">
                <span>信じよ</span>
                <span>198粉丝</span>
              </div>
            </div>
            <div class="list-right">
              <!-- <span>-</span> -->
              <i></i>
              <span>关注</span>
            </div>
          </div>
        </li>
        <li>
          <div class="list-cont">
            <div class="list-left">
              <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI"
                alt="头像">
              <div class="list-text">
                <span>信じよ</span>
                <span>198粉丝</span>
              </div>
            </div>
            <div class="list-right">
              <!-- <span>-</span> -->
              <i></i>
              <span>关注</span>
            </div>
          </div>
        </li>
        <li>
          <div class="list-cont">
            <div class="list-left">
              <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI"
                alt="头像">
              <div class="list-text">
                <span>信じよ</span>
                <span>198粉丝</span>
              </div>
            </div>
            <div class="list-right">
              <!-- <span>-</span> -->
              <i></i>
              <span>关注</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {}
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
                font-size: 16px;
                color: #0a2b40ff;
                line-height: 22px;
                font-weight: bold;
                padding-bottom: 4px;
              }
              span:nth-child(2) {
                font-size: 14px;
                color: #7e929fff;
                line-height: 22px;
              }
            }
          }
          // .list-right {
          //   width: 26px;
          //   height: 26px;
          //   background: #c7eaffff;
          //   text-align: center;
          //   border-radius: 6px;
          //   cursor: pointer;
          //   span {
          //     display: inline-block;
          //     width: 10px;
          //     height: 2px;
          //     color: #103044ff;
          //   }
          // }
          .list-right {
            width: 84px;
            padding: 4px 0;
            background-color: #fff;
            border-radius: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #E6EBEEFF;
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
              background: url("../../../static/images/followhover.svg") no-repeat center;
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
