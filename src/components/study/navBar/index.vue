<template>
  <div class="nav-bar">
    <div class="flex-container">
      <div class="item">
        <a href="javascript:;" @click="goBack()" class="back">
          <i></i>
        </a>
        <span class="name">{{ title }}</span>
      </div>
      <div class="item">
      </div>
      <div class="item" style="height: 40px">
        <gold-box :totalCoins="part.totalCoins"></gold-box>
        <setting />
      </div>
    </div>
    <div class="flex-progress">
      <progress-comp @changeSlide="changeSlide" :part="part"/>
    </div>
  </div>
</template>

<script>
import GoldBox from './goldBox'
import Setting from './setting'
import ProgressComp from './progress'
export default {
  props: ['part'],
  data () {
    return {
    }
  },
  components: {
    GoldBox,
    Setting,
    ProgressComp
  },
  mounted () {
  },
  computed: {
    title () {
      let arr = this.part.chapterCode.split('-')
      let unitNum = arr[3].toLowerCase().replace('unit', '')
      let chapterNum = (parseInt(unitNum) - 1) * 6 + parseInt(arr[4].toLowerCase().replace('chapter', ''))
      let des = ''
      if (this.part.id.indexOf('A0') > -1) {
        des = '核心' + this.part.id.replace('A0', '')
      }
      return '课程' + chapterNum + ' ' + des
    }
  },
  methods: {
    goBack () {
      this.$router.go()
    },
    changeSlide (index) {
      this.$parent.$emit('changeSlide', index)
    }
  }
}
</script>

<style lang="less" scoped>
.nav-bar {
  position: relative;
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

.flex-progress {
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  height: 62px;
  top: 0;
  justify-content: center;
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
