<template>
  <div class="map_statistics_box">
    <div class="map_statistics_wrap">
      <div class="map_statistics">
        <i @click="stretchToggle()"></i>
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
      isStretch: false
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
      } else {
        elem.stop().animate({
          bottom: '-155px'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.map_statistics_box {
  position: relative;
  z-index: 99;
  .map_statistics_wrap {
    position: absolute;
    height: 210px;
    width: 170px;
    bottom: 0;
    right: 100px;
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
    bottom: -155px;
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
  }
  ul {
    margin-left: 23px;
    margin-top: 110px;
    li {
      margin-top: 8px;
      font-size: 12px;
      font-weight: 500;
      color: #0A2B40;
      line-height: 17px;
    }
  }
}
</style>
