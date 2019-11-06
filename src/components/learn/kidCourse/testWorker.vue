<template>
  <div></div>
</template>

<script>
import myWorker from '../../../plugins/myWorker.js'
console.log(myWorker)
export default {
  mounted () {
    myWorker.worker.postMessage({a: 1})
  }
}
</script>

<style lang="less" scoped>
</style>
