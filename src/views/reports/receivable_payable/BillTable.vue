<template>
  <!--表单明细层-->
  <div id="bill_table" class="report-table">
    <div v-if="tableDataList.length" class="move-wrap">
      <div class="move-content">
        <div class="thead-wrap">
          <van-row type="flex" justify="space-between">
            <van-col
              :span="title.span"
              v-for="title in titleList">
              {{ title.text }}
            </van-col>
          </van-row>
        </div>
        <div v-for="(row, index) in tableDataList"
             class="tbody-wrap" @click="onOpenBill(row)">
          <van-row type="flex" justify="space-between">
            <van-col span="2">{{ index + 1 }}</van-col>
            <van-col span="7">{{ row.form_code }}</van-col>
            <van-col span="6">{{ [row.partner_id, 'partner'] | showName }}</van-col>
            <van-col span="3">{{ row.amount | roundUp }}</van-col>
            <van-col span="3">{{ row.actual_payable | roundUp }}</van-col>
            <van-col span="3">{{ [row.department_id, 'department'] | showName }}</van-col>
          </van-row>
        </div>
      </div>
    </div>
    <div v-else>无数据</div>
    <div v-if="!finished" @click="onClickMore()" class="more t-center">点击查看更多</div>
    <FilterTmp :filter-items="filterItems"></FilterTmp>
  </div>
</template>

<script>
  export default {
    name: 'billTable',
    data () {
      let _time = new Date()
      let year = _time.getFullYear()
      let month = _time.getMonth()
      let day = _time.getDate()
      let start = `${year}/${month + 1}/01`
      let end = `${year}/${month + 1}/${day}`
      let report_date = [start, end]
      return {
        start: 0,
        limit: 10,
        finished: false,
        titleList: [
          {
            text: '序号',
            span: 2
          },
          {
            text: '单号',
            span: 7
          },
          {
            text: '商业伙伴',
            span: 6
          },
          {
            text: '金额',
            span: 3
          },
          {
            text: '应付款',
            span: 3
          },
          {
            text: '部门',
            span: 3
          }
        ],
        tableDataList: [],
        params: {},
        filterItems: [
          {
            text: '开始时间',
            type: 'DatePicker',

            value: report_date[0],
            key: 'start_date',
          }, {
            text: '结束时间',
            type: 'DatePicker',
            value: report_date[1],
            key: 'end_date'
          },
          {
            text: '商业伙伴',
            type: 'InputSearch',
            value: '',
            itemType: 'partner',
            key: 'partner_id'
          },
          {
            text: '部门',
            type: 'InputSearch',
            value: '',
            itemType: 'department',
            key: 'department_id'
          }
        ]
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.params = this.$route.params
        this.getTableData()
      },
      onFilterConfirm () {
        let filter_params = {}
        this.filterItems.forEach(val => {
          filter_params[val.key] = val.value
        })
        this.getTableData(0, this.limit, filter_params)
        this.onOpenFilter()
      },
      onOpenFilter () {
        this.$store.commit('TOGGLE_FILTER')
      },
      onClearFilterValue () {
        this.filterItems.forEach(value => {
          value.value = ''
        })
      },
      onOpenBill (row) {
        this.$router.push({
          name: row.line_type,
          params: {
            id: row.line_id,
          },
          query: {
            isCreate: false,  // 非新建
            t: +new Date()
          }
        })
      },
      getTableData (start = 0, end = this.limit, extraParams) {
        let params = this.$route.params
        params.start = start
        params.limit = this.limit
        params.area_id = Number(this.$route.query.area_id)
        params = Object.assign({}, extraParams, params)
        this.$axios({
          url: `/api/receivable_payable_reports?action=receivable_payable_line`,
          params
        }).then(res => {
          if (res.success && res.root.length) {
            this.$parent._data.totalRecord = res.total
            this.start = end
            this.tableDataList = this.tableDataList.concat(res.root)
          } else {
            this.finished = true
            this.tableDataList.length = 0
          }
          this.finished = res.root.length < this.limit
        })
      },
      onClickMore () {
        let end = this.start + this.limit
        this.getTableData(this.start, end)
      }
    }
  }
</script>

<style scoped lang="less">
  /*#bill_table {*/
  /*  .move-wrap {*/
  /*    width: 100%;*/
  /*    overflow-x: auto;*/
  /*    z-index: 100;*/

  /*    .move-content {*/
  /*      width: 600px;*/
  /*    }*/
  /*  }*/
  /*}*/
</style>
