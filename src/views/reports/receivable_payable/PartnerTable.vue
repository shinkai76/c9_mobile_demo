<template>
  <div id="partner_table" class="report-table">
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
             class="tbody-wrap"
             @click="onShowMore(row, index)">
          <van-row type="flex" justify="space-between">
            <van-col span="3">{{ index + 1 }}</van-col>
            <van-col span="8">{{ row.name }}</van-col>
            <van-col span="5" class="t-right">{{ row.rest |roundUp }}</van-col>
            <van-col span="4" class="t-right">{{ row.receivable |roundUp }}</van-col>
            <van-col span="4" class="t-right">{{ row.payable |roundUp }}</van-col>
            <van-col span="2">
              <i class="fa fa-angle-right" aria-hidden="true" @click.stop="toNextTable(row)"></i>
            </van-col>
          </van-row>
          <div v-if="isShowDetail && index == clickedRowIndex" class="detail-wrap">
            <h5>商业伙伴名称：{{ row.name }}</h5>
            <div class="detail_info">
              <div class="detail_left">
                <span>累计余额：{{ row.rest }}</span>
                <span>实际应收款：{{ row.actual_receivable }}</span>
                <span>实际应付款：{{ row.actual_payable }}</span>
                <span>应收款：{{ row.receivable }}</span>
                <span>应付款：{{ row.payable }}</span>
              </div>
              <div class="detail_right">
                <span>应收超期：{{ row.over_due }}</span>
                <span>应收超额：{{ row.over }}</span>
                <span>超1-20：{{ row.over_due_1 }}</span>
                <span>超21-60：{{ row.over_due_2 }}</span>
                <span>超61-120：{{ row.over_due_3 }}</span>
                <span>超120以上：{{ row.over_due_4 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>无数据</div>
    <FilterTmp :filter-items="filterItems"></FilterTmp>
  </div>
</template>

<script>
  import { AddDay } from '@/utils/app'
  export default {
    name: 'FirstTable',
    data () {
      let _time = new Date()
      let year = _time.getFullYear()
      let month = _time.getMonth()
      let day = _time.getDate()
      let start = `${year}/${month + 1}/01`
      let end = `${year}/${month + 1}/${day}`
      let report_date = [start, end]
      return {
        titleList: [
          {
            text: '序号',
            span: 3
          },
          {
            text: '商业伙伴（地区）',
            span: 8
          },
          {
            text: '累计金额',
            span: 5
          },
          {
            text: '应收款',
            span: 4
          },
          {
            text: '应付款',
            span: 4
          },
          {
            text: '更多',
            span: 2
          }
        ],
        limit: 150,
        tableDataList: [],
        area_id: '',
        isShowDetail: false, // 是否点击了显示更多该行信息
        rowDetail: {},
        clickedRowIndex: '', // 控制显示的是当前点击行的rowDetail
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
    watch: {
      '$route' (to, from) { //监听路由是否变化
        if (to.name === 'receivable_payable_line') {
          return
        }
        this.init()
      }
    },
    methods: {
      init () {
        let filter_params = {
          start_date: this.filterItems[0].value,
          end_date: this.filterItems[1].value
        }
        this.getTableData(filter_params)
      },
      onFilterConfirm () {
        let filter_params = {}
        this.filterItems.forEach(val => {
          filter_params[val.key] = val.value
        })
        this.getTableData(filter_params)
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
      onShowMore (row, index) {
        if (this.clickedRowIndex === index) { // 再次点击当行关闭
          this.isShowDetail = !this.isShowDetail
        } else {
          this.clickedRowIndex = index
          this.isShowDetail = true
          row.rate = row.sale_total - row.amount // 计算税额
        }
      },
      toNextTable (row) { // 进入下一层 可能是单据明细可能是商品类别但area_id都要传
        this.isShowDetail = false
        this.getDeepTableData(row)
      },
      getTableData (extraParams = {}) {

        let params = {
          action: 'receivable_payable'
        }
        params = Object.assign({}, extraParams, params)
        params.end_date = AddDay(params.end_date, 1)
        this.$axios({
          url: `/api/receivable_payable_reports`,
          params
        }).then(res => {
          this.tableDataList = res
          this.$parent._data.totalRecord = res.length
        })
      },
      getDeepTableData (row) {
        let action = row.line_type === 'area' ? 'receivable_payable' : 'receivable_payable_line'
        if (action === 'receivable_payable_line') { // 如果已经到了单据明细的请求 就跳转到单据明细页
          let partner_id = row.line_id
          this.$router.push({
            path: `/receivable_payables/${ partner_id }/receivable_payable_lines?area_id=${this.area_id}`
          })
        } else {
          let extraParams = {
            start_date: this.filterItems[0].value,
            end_date: this.filterItems[1].value,
            area_id: row.line_id
          }
          this.area_id = row.line_id
          this.getTableData(extraParams)
        }
      }
    }
  }
</script>

<style scoped lang="less">
</style>

