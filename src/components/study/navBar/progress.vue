<template>
  <ul class="progress">
    <li :class="[{'current': part.curSlideIndex == index, 'perfect': val == 1, 'great': val == 0}]"
      v-for="(val, index) in part.slidesVal"
      :key="index"
      @click="changeSlide(index)">
      <span>{{ index + 1 }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['part'],
  mounted () {
  },
  computed: {
  },
  methods: {
    changeSlide (index) {
      if (this.part.curSlideIndex === index || this.part.slidesVal[index] === -1) return
      this.$emit('changeSlide', index)
    }
  }
}
</script>

<style lang="less" scoped>
.progress {
  display: flex;
  align-items: center;
  li {
    display: flex;
    align-items: center;
    width: 34px;
    height: 34px;
    margin-right: 8px;
    cursor: pointer;
    &:hover {
      span {
        width: 34px;
        height: 34px;
        line-height: 34px;
      }
    }
    span {
      display: inline-block;
      line-height: 26px;
      text-align: center;
      margin: 0 auto;
      width: 26px;
      height: 26px;
      background-color: #C8D4DB;
      border-radius: 50%;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .current {
    span {
      width: 34px;
      height: 34px;
      line-height: 34px;
    }
  }
  .great {
    span {
      background-color: red;
    }
  }
  .perfect {
    span {
      background-color: #7E929F;
    }
  }
}
</style>
