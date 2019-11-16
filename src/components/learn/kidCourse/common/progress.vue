<template>
  <div class="progress-bar">
    <div class="progress" :style="{width: progress + '%'}"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      progress: 0
    }
  },
  methods: {
    setProgress (progress) {
      this.progress = progress
    }
  }
}
</script>

<style lang="less" scoped>
.progress-bar {
  width: 100%;
  height: 7px;
  background: #EFEFEF;
  .progress {
    height: 100%;
    background: #62CEF6;
    border-radius: 3px;
    transition: width ease-in .3s;
  }
}
</style>
