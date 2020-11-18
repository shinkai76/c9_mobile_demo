<template>
  <div id="product_table" class="report-table">
    <div v-if="tableDataList.length">
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
          <van-col span="9">{{ row.name }}</van-col>
          <van-col span="5" class="t-right">{{ row.quantity }}</van-col>
          <van-col span="5" class="t-right">{{ row.sale_total }}</van-col>
          <van-col span="2">
            <i class="fa fa-angle-right" aria-hidden="true" @click.stop="toNextTable(row)"></i>
          </van-col>
        </van-row>
        <div v-if="isShowDetail && index == clickedRowIndex" class="detail-wrap">
          <h5>商品名称：{{ row.name }}</h5>
          <div class="detail_info">
            <div class="detail_left">
              <span>数量：{{ row.quantity }}</span>
              <span>平均单价：{{ row.price | roundUp }}</span>
              <span>含税金额：{{ row.sale_total | roundUp }}</span>
              <span>未税金额：{{ row.amount | roundUp }}</span>
            </div>
            <div class="detail_right">
              <span>税额：{{ row.rate | roundUp }}</span>
              <span>成本：{{ row.cost | roundUp }}</span>
              <span>毛利：{{ row.gross_profit | roundUp }}</span>
              <span>毛利率：{{ row.gross_profit_rate | percentage }}</span>
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
            text: '货品名称',
            span: 9
          },
          {
            text: '数量',
            span: 5
          },
          {
            text: '含税单价',
            span: 5
          },
          {
            text: '',
            span: 2
          }
        ],
        tableDataList: [],
        product_type_id: '',
        isShowDetail: false, // 是否点击了显示更多该行信息
        rowDetail: {},
        clickedRowIndex: '', // 控制显示的是当前点击行的rowDetail
        filterItems: [
          {
            text: '开始时间',
            type: 'DatePicker',
            isStart: true,
            value: report_date[0],
            key: 'start_date'
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
          },
          {
            text: '品牌',
            type: 'InputSearch',
            value: '',
            itemType: 'brand',
            key: 'brand_id'
          },
          {
            text: '商品',
            type: 'InputSearchProduct',
            value: '',
            itemType: 'product',
            key: 'product_id'
          },
          {
            text: '仓库',
            type: 'SelectStore',
            value: '',
            key: 'store_id',
            options: [{
              id: '',
              name: '不限'
            }]
          }
        ]
      }
    },
    mounted () {
      this.init()
    },
    watch: {
      '$route' (to, from) { //监听路由是否变化
        if (to.name === 'sale_line') {
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
      toNextTable (row) { // 进入下一层 可能是单据明细可能是商品类别
        this.isShowDetail = false
        if (row.line_type == 'product_type') {
          this.product_type_id = row.line_id
        }
        this.getDeepTableData(row)
      },
      getTableData (extraParams = {}) {
        // this.product_type_id = ''
        // this.$store.commit('ACTION', 'product_types')
        let params = {
          action: 'product_types'
        }
        params = Object.assign({}, extraParams, params)
        params.end_date = AddDay(params.end_date, 1)
        this.$axios({
          url: `/api/sale_reports`,
          params
        }).then(res => {
          this.tableDataList = res
          this.$parent._data.totalRecord = res.length
        })
      },
      getDeepTableData (row) { // 可能是明细层可能是子产品层
        let action = row.line_type === 'product_type' ? 'product_types' : 'sale_line'
        if (action === 'sale_line') { // 如果已经到了单据明细的请求 就跳转到单据明细页
          let product_id = row.line_id
          this.$router.push({
            path: `/sale_products/${ product_id }/sale_lines?product_type_id=${this.product_type_id}`,
          })
        } else {
          let extraParams = {
            start_date: this.filterItems[0].value,
            end_date: this.filterItems[1].value,
            product_type_id: row.line_id
          }
          this.getTableData(extraParams)
        }
      }
    }
  }
</script>

<style scoped lang="less">
</style>

