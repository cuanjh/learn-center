<template>
  <li >
    <div class="li-item">
      <div class="review-item">
        <i class="icon-horn"></i>
        <p class="core-word">
          <span class="word">{{'w.word'}}</span>
        </p>
      </div>
      <p class="grade-score-color">
        <span class="score">{{'90'}}<em>分</em></span>
      </p>
    </div>
  </li>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
li {
  .li-item {
    padding: 16px 0 14px;
    border-top: 1px solid rgba(151, 151, 151, .13);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .review-item {
    .core-word {
      display: flex;
      align-items: center;
      .word {
        font-size: 18px;
        font-weight: 500;
        line-height: 28px;
        color: #3C5B6F;
        margin-right: 10px;
      }
    }
  }
}
</style>
