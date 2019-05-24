<template>
  <ul class="progress">
    <li class=" perfect">
      <span>1</span>
    </li>
    <li class="perfect">
      <span>2</span>
    </li>
    <li class="great">
      <span>3</span>
    </li>
    <li class="current">
      <span>4</span>
    </li>
    <li>
      <span>5</span>
    </li>
  </ul>
</template>

<style lang="less" scoped>
.progress {
  display: flex;
  align-items: center;
  margin: 0 20px;
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
