<template>
  <div class="setting">
    <a href="javascript:;">
      <i></i>
    </a>
  </div>
</template>

<style lang="less" scoped>
.setting {
  margin-left: 36px;
  a {
    display: flex;
    align-items: center;
    &:hover {
      i {
        background-image: url('../../../../static/images/study/icon-setting-hover.svg');
      }
    }
    i {
      width: 30px;
      height: 30px;
      background-image: url('../../../../static/images/study/icon-setting.svg');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
</style>
