<template>
  <div></div>
  <!-- <multiselect
    label="name"
    :selected="value"
    v-model="selected"
    :options="options"
    :searchable='true'
    @input="updateSelected"
    placeholder='性别'
    select-label='选择'
    deselect-label='取消'
    selected-label='已选择' >
  </multiselect> -->
</template>

<script>
// import Multiselect from 'vue-multiselect'
// import Constant from '../../../api/constant'
export default {
  // male or female
  // props: ['value'],
  // components: {
  //   Multiselect
  // },
  // created () {
  //   this.$on('init', (val) => {
  //     this.selected = val
  //   })
  // },
  // mounted () {
  //   console.log('------' + this.value)
  // },
  // data () {
  //   return {
  //     selected: this.value,
  //     options: [
  //       // Constant.getGenderSelectorDataByCode('male'),
  //       // Constant.getGenderSelectorDataByCode('female')
  //     ]
  //   }
  // },
  // methods: {
  //   updateSelected (newValue) {
  //     this.$emit('update', newValue)
  //   }
  // }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
