<template>
  <div class="nav-bar">
    <div class="nav-container">
      <div class="left">
        <span @click="goBack" class="back">
          <i></i>
        </span>
        <span class="name">{{ title }}</span>
      </div>
      <div class="flex-progress">
        <progress-comp @changeSlide="changeSlide" :part="part"/>
      </div>
      <div class="right">
        <gold-box :totalCoins="part.totalCoins"></gold-box>
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
      let arr = this.part.id.split('-')
      let unitNum = arr[3].toLowerCase().replace('unit', '')
      let chapterNum = (parseInt(unitNum) - 1) * 6 + parseInt(arr[4].toLowerCase().replace('chapter', ''))
      let core = arr[5]
      let des = ''
      if (core.indexOf('A0') > -1) {
        des = '核心' + core.replace('A0', '')
      }
      return '课程' + chapterNum + ' ' + des
    }
  },
  methods: {
    goBack () {
      this.$parent.$emit('goBack')
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

.nav-container {
  position: relative;
  height: 100%;
  max-width: 1540px;
  margin: 0 140px;
}

.flex-progress {
  width: 100%;
  // position: absolute;
  display: flex;
  flex-direction: row;
  height: 62px;
  top: 0;
  justify-content: center;
}

.name {
  min-width: 104px;
  margin-left: 26px;
  font-size: 17px;
  font-weight: 600;
  color: #3C5B6F;
}

.left {
  position: absolute;
  left: 0;
  top: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}

.right {
  position: absolute;
  right: 0;
  top: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}

.back {
  cursor: pointer;
  i {
    display: inline-block;
    width: 30px;
    height: 30px;
    background-image: url('../../../../static/images/study/icon-back.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  &:hover {
    i {
      background-image: url('../../../../static/images/study/icon-back-hover.svg');
    }
  }
}
</style>
