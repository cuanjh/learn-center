<template>
  <multiselect
    label="name"
    :selected="value"
    v-model="selected"
    :options="options"
    :searchable='false'
    @input="updateSelected"
    :show-labels="false"
    placeholder='性别'
    select-label='选择'
    deselect-label='取消'
    selected-label='已选择' >
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Constant from '../../../api/constant'
import $ from 'jquery'

export default {
  // male or femail
  props: ['value'],
  components: {
    Multiselect
  },
  created () {
    this.$on('init', (val) => {
      this.selected = val
    })
  },
  mounted () {
    console.log('------' + this.value)
    // this.$nextTick(() => {
    //   this.removeCss()
    //   this.generResetCss()
    // })
  },
  data () {
    return {
      selected: this.value,
      options: [
        Constant.getGenderSelectorDataByCode('male'),
        Constant.getGenderSelectorDataByCode('female')
      ]
    }
  },
  updated () {
    this.generResetCss()
  },
  methods: {
    updateSelected (newValue) {
      this.$emit('update', newValue)
    },
    removeCss () {
      $('#selsex-content .multiselect__content-wrapper').find('.multiselect__option--highlight,.multiselect__option--selected').removeAttr('style')
    },
    generResetCss () {
      $('.multiselect__tags .multiselect__single').css({
        'font-size': '14px'
      })
      $('#selsex-content .multiselect--active .multiselect__select').css({
        'z-index': '99'
      })
      $('#selsex-content .multiselect__tags input').css({
        'width': '100px'
      })
      $('#selsex-content .multiselect__content .multiselect__element .multiselect__option').css({
        'font-size': '14px',
        'font-weight': '500',
        'text-align': 'center',
        'color': '#103044FF',
        'background': '#fff'
      }) // 'background', '#EEF2F3FF' .multiselect__option--selected
      $('#selsex-content .multiselect__content .multiselect__element').find('.multiselect__option--selected').css({
        'font-size': '14px',
        'font-weight': '500',
        'color': '#103044FF',
        'background': '#EEF2F3FF'
      })
      $('#selsex-content .multiselect__content .multiselect__element').find('.multiselect__option--highlight').css({
        'font-size': '14px',
        'font-weight': '500',
        'color': '#103044FF',
        'background': '#EEF2F3FF'
      })
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
