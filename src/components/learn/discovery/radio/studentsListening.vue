<template>
  <div class="students">
    <div class="student-content">
      <div class="title">同学都在听</div>
      <div class="listening-lists">
        <ul class="lists">
          <li class="lists-item">
            <div class="nickname">
              <p>年年有余有鱼</p>
              <p>会员课程</p>
            </div>
            <div class="play">
              <div class="play-icon">
                <i></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.students {
  width: 100%;
  margin-top: 30px;
  .student-content {
    .title {
      font-size:16px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(126,146,159,1);
    }
    .listening-lists {
      width: 100%;
      .lists {
        width: 100%;
        .lists-item {
          margin-top: 10px;
          padding: 16px 20px;
          background:rgba(255,255,255,1);
          border-radius:8px;
          border:1px solid rgba(230,235,238,1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          .nickname {
            font-size:16px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(74,74,74,1);
            p:nth-child(2) {
              font-size:12px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(153,153,153,1);
            }
          }
          .play {
            .play-icon {
              cursor: pointer;
              width:24px;
              height:24px;
              i {
                display: inline-block;
                width:24px;
                height:24px;
                background: url('../../../../../static/images/discovery/radio-play.png') no-repeat center;
                background-size: cover;
              }
            }
          }
        }
      }
    }
  }
}
</style>
