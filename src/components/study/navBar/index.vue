<template>
  <div class="nav-bar">
    <div class="flex-container">
      <div class="item">
        <a href="javascript:;" class="back">
          <i></i>
        </a>
        <span class="name">课程24 核心1</span>
      </div>
      <div class="item">
        <progress-comp />
      </div>
      <div class="item" style="height: 40px">
        <gold-box></gold-box>
        <setting />
      </div>
    </div>
  </div>
</template>

<script>
import GoldBox from './goldBox'
import Setting from './setting'
import ProgressComp from './progress'
export default {
  components: {
    GoldBox,
    Setting,
    ProgressComp
  }
}
</script>

<style lang="less" scoped>
.nav-bar {
  height: 62px;
  background-color: #fff;
  border-bottom: 1px solid #E6EBEE;
}

.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1540px;
  padding: 0 140px;
  margin: 0 auto;
  .item {
    // width: 100px;
    display: flex;
    align-items: center;
  }
}

.back {
  &:hover {
    i {
      background-image: url('../../../../static/images/study/icon-back-hover.svg');
    }
  }
  i {
    display: inline-block;
    width: 30px;
    height: 30px;
    background-image: url('../../../../static/images/study/icon-back.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.name {
  min-width: 104px;
  margin-left: 26px;
  font-size: 17px;
  font-weight: 600;
  color: #3C5B6F;
}
</style>
