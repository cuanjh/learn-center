<template>
  <div class="toast-box" style="display:none;">
    <div class="toast-body toast-${state}">${str}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      CLEAR_TIME: 2000
    }
  }
}
</script>
