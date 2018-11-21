<template>
  <div class="world-lang-map">
    <b-map class="b-map"></b-map>
  </div>
</template>

<script>
import BMap from '../../common/map.vue'
export default {
  components: {
    BMap
  }
}
</script>

<style scoped>
  .world-lang-map {
    height: 1100px;
  }
  .b-map {
    height: 450px;
  }
</style>
