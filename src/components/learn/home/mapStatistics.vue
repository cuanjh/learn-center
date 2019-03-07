<template>
  <div class="map_statistics_box">
    <div class="map_statistics_wrap">
      <div class="map_statistics">
        <i :class="{'active': isActive}" @click="stretchToggle()"></i>
        <ul>
          <li>语言 {{statisticsInfo.langNum }} 种</li>
          <li>语言电台 {{statisticsInfo.radioNum }} 个</li>
          <li>语伴 {{statisticsInfo.partnerNum }} 人</li>
          <li>语料 {{statisticsInfo.corpusNum }} 条</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      statisticsInfo: {},
      isStretch: true,
      isActive: false
    }
  },
  mounted () {
    // 加载世界语言地图统计数据
    this.getMapLangInfo().then(res => {
      this.statisticsInfo = res.data
    })
  },
  methods: {
    ...mapActions([
      'getMapLangInfo'
    ]),
    stretchToggle () {
      this.isStretch = !this.isStretch
      /* eslint-disable */
      let elem = $('.map_statistics')
      /* eslint-enable */
      if (this.isStretch) {
        elem.stop().animate({
          bottom: 0
        })
        this.isActive = false
      } else {
        elem.stop().animate({
          bottom: '-155px'
        })
        this.isActive = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.map_statistics_box {
  position: relative;
  width: 1180px;
  margin: 0 auto;
  z-index: 99;
  .map_statistics_wrap {
    position: absolute;
    height: 210px;
    width: 170px;
    bottom: 0;
    right: 0;
    overflow: hidden;
  }
  .map_statistics {
    position: absolute;
    width: 170px;
    height: 210px;
    background-image: url('../../../../static/images/learnIndex/wal-statistics-bg.svg');
    background-repeat: no-repeat;
    background-size: cover;
    // border-radius: 5px;
    bottom: 0px;
  }
  i {
    float: right;
    width: 10px;
    height: 6px;
    background-image: url('../../../../static/images/learnIndex/wal-stretch.svg');
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 7px;
    margin-top: 7px;
    cursor: pointer;
    &.active {
      background-image: url('../../../../static/images/learnIndex/upOn.svg');
    }
  }
  ul {
    margin-left: 23px;
    margin-top: 118px;
    li {
      margin-top: 4px;
      font-size: 12px;
      font-weight: 500;
      color: #0A2B40;
      line-height: 17px;
    }
  }
}
</style>
