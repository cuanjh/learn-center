<template>
  <div>
    <header class="guide-header">
      {{ $t('guide.'+title) }}
    </header>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang="less" scoped>
  .guide-header {
    color: #55a4fc;
    font-size: 26px;
  }
</style>
