<template>
  <date-picker
    v-model="startTime"
    :option="option"  />
</template>

<script>
import DatePicker from 'vue-datepicker2'
export default {
  props: ['value'],
  components: {
    DatePicker
  },
  data () {
    return {
      startTime: this.value,
      option: {
        type: 'day',
        // week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        // month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        week: ['一', '二', '三', '四', '五', '六', '日'],
        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        format: 'YYYY-MM-DD',
        placeholder: '',
        inputStyle: {
          'display': 'inline-block',
          'padding': '6px',
          'line-height': '22px',
          'font-size': '16px',
          'border': '2px solid #fff',
          'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
          'border-radius': '2px',
          'color': '#5F5F5F'
        },
        color: {
          header: '#ccc',
          headerText: '#f00'
        },
        buttons: {
          ok: '确定',
          cancel: '取消'
        },
        overlayOpacity: 0.5, // 0.5 as default
        dismissible: true // as true as default
      },
      timeoption: {
        type: 'min',
        // week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        // month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        week: ['一', '二', '三', '四', '五', '六', '日'],
        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        format: 'YYYY-MM-DD HH:mm'
      },
      multiOption: {
        type: 'multi-day',
        // week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        // month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        week: ['一', '二', '三', '四', '五', '六', '日'],
        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        format: 'YYYY-MM-DD HH:mm'
      },
      limit: [{
        type: 'weekday',
        available: [1, 2, 3, 4, 5]
      },
      {
        type: 'fromto',
        from: '2016-02-01',
        to: '2016-02-20'
      }],
      dateBodyClass: 'date-body'
    }
  },
  created () {
    this.$on('initDate', (val) => {
      this.startTime = val
    })
  },
  mounted () {
    console.log('--date--' + this.value)
  },
  watch: {
    startTime (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit('update', newValue)
      }
    }
  }
}
</script>
