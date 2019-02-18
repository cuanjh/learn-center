<template>
  <div class="map_statistics_box">
    <div class="map_statistics">
      <ul>
        <li>语言 {{statisticsInfo.langNum }} 种</li>
        <li>语言电台 {{statisticsInfo.radioNum }} 个</li>
        <li>语伴 {{statisticsInfo.partnerNum }} 人</li>
        <li>语料 {{statisticsInfo.corpusNum }} 条</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      statisticsInfo: {}
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
    ])
  }
}
</script>

<style lang="less" scoped>
.map_statistics_box {
  position: relative;
  z-index: 99;
  .map_statistics {
    position: absolute;
    width: 140px;
    height: 112px;
    background: #fff;
    border-radius: 5px;
    right: 100px;
    bottom: 70px;
    padding-top: 22px;
    padding-left: 27px;
  }
  ul {
    li {
      font-size: 12px;
      font-weight: 500;
      color: #4b4b4b;
      line-height: 17px;
    }
  }
}

</style>
