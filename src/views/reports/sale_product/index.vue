<template>
  <div id="sale_product" class="report-wrap">
    <TopBar>货品销售报表</TopBar>
    <div class="top-bar-filter">
      <button type="button" @click="$store.commit('TOGGLE_FILTER')">
        <i class="fa fa-filter" aria-hidden="true"></i>
        过滤
      </button>
      <span class="top-bar-record">共{{ totalRecord }}条记录</span>
    </div>
    <ProductTable ref="ProductTable"></ProductTable>
    <router-view></router-view>
<!--    <FilterTmp :filter-items="filterItems"></FilterTmp>-->
  </div>
</template>

<script>
  import ProductTable from './ProductTable'
  import Cache from '@/utils/cache'
  import { AddDay } from '@/utils/app'

  export default {
    name: 'index',
    data () {
      return {
        totalRecord: 0,
      }
    },
    components: {
      ProductTable
    },
    created () {
      // this.filterItems.forEach(val => {
      //   if (val.key === 'store_id') {
      //     val.options = [...val.options, ...Cache.Get('store')]
      //   }
      //   if (val.type === 'DatePicker') {
      //     let time = new Date()
      //     this.start_date = `${ time.getFullYear() }/${ time.getMonth() + 1 }/1`
      //     this.end_date = `${ time.getFullYear() }/${ time.getMonth() + 1 }/${ time.getDate() }`
      //     this.end_date_added = AddDay(this.end_date, 1)
      //   }
      // })
    },
    methods: {}
  }
</script>

<style lang="less">
  @import "../../../css/reports";
</style>
