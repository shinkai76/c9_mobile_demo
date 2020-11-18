<template>
  <div id="receivable_payable" class="report-wrap">
    <TopBar>应收应付报表</TopBar>
    <div class="top-bar-filter">
      <button type="button" @click="$store.commit('TOGGLE_FILTER')">
        <i class="fa fa-filter" aria-hidden="true"></i>
        过滤
      </button>
      <span class="top-bar-record">共{{ totalRecord }}条记录</span>
    </div>
    <PartnerTable></PartnerTable>
    <router-view ></router-view>
  </div>
</template>

<script>
  import PartnerTable from './PartnerTable'
  export default {
    name: 'index',
    data () {
      return {
        totalRecord: 0,
      }
    },
    components: {
      PartnerTable
    },
  }
</script>

<style lang="less">
  @import "../../../css/reports";
</style>
