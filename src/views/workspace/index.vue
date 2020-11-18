<template>
  <div id="workspace">
    <TopBar>工作台</TopBar>
    <div class="top-bar">
      <button type="button" @click="onOpenFilter()"><i class="fa fa-filter" aria-hidden="true"></i>过滤</button>
      <span class="top-bar-record">共{{ totalRecord }}条记录</span>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadMore"
        :offset="120"
        class="bills-wrap"
        :immediate-check="immediateCheck"
      >
        <van-row v-for="value in billInfo" class="bills-item">
          <van-col span="8">
            <van-tag plain type="primary" class="state">{{ value.state }}</van-tag>
          </van-col>
          <van-col span="14">
            <div class="container-second-info">
              <span>{{ [value.form_partner_id, 'partner'] | showName }}</span>
              <span>{{ value.form_code }}</span>
              <span>金额 {{ value.form_total_amount }}</span>
            </div>
          </van-col>
          <van-col span="2">
            <i class="fa fa-angle-right" aria-hidden="true" @click="onOpenBill(value)"></i>
          </van-col>
        </van-row>
      </van-list>
    </van-pull-refresh>
    <FilterTmp :filter-items="filterItems"></FilterTmp>
  </div>
</template>

<script>
  import Cache from '@/utils/cache'

  export default {
    name: 'workspace',
    data () {
      return {
        totalRecord: '',
        limit: 15,
        start: 0,
        immediateCheck: false, // 是否在初始化时立即执行滚动位置检查
        finished: false, // 懒加载是否结束
        loading: false, // 懒加载
        isLoading: false, // 是否显示下拉刷新的文字
        billInfo: [],
        isFilter: false,
        filterItems: [
          {
            text: '开始时间',
            type: 'DatePicker',

            value: '',
            key: 'start_date',
          }, {
            text: '结束时间',
            type: 'DatePicker',
            value: '',
            key: 'end_date'
          }, {
            text: '单号',
            type: 'InputTmp',
            value: '',
            key: 'form_code'
          }, {
            text: '商业伙伴',
            type: 'InputSearch',
            value: '',
            itemType: 'partner',
            key: 'partner_id'
          }, {
            text: '仓库',
            type: 'SelectStore',
            value: '',
            key: 'store_id'
          }, {
            text: '金额',
            type: 'SelectAmount',
            key: 'total_amount',
            value: ''
          }, {
            text: '银行账户',
            type: 'InputSearch',
            value: '',
            itemType: 'bank',
            key: 'bank_id'
          }]
      }
    },
    created () {
      this.getList()
    },
    methods: {
      onFilterConfirm () {
        let params = {
          show_finish: 1,
          show_finish_days: 0,
          start: 0,
          limit: this.limit,
          action: 'my_forms_ex'
        }
        let newObj = {}
        this.filterItems.map(val => {
            newObj[val.key] = val.value
        })
        params = Object.assign({}, params, newObj)
        console.log(params)
        this.billInfo.length = 0
        this.getList(0, false, params)
        this.onOpenFilter()
      },
      onRefresh () {
        this.getList(0, true)
      },
      loadMore () {
        this.start += this.limit
        this.getList(this.start)
      },
      getList (start = 0, isRefresh = false, params) {
        if (isRefresh) {
          this.start = 0
        }
        params = params || {
          action: 'my_forms_ex',
          start: isRefresh ? this.start : start,
          limit: this.limit,
          show_finish: 1,
          show_finish_days: 1
        }

        this.$axios({
          url: '/api/common',
          params: params
        }).then(res => {
          if (res.success) {
            this.finished = false
            this.totalRecord = res.total
            if (isRefresh) {
              this.$toast('刷新成功')
              this.billInfo = res.root
              this.isLoading = false
            } else {
              this.billInfo = this.billInfo.concat(res.root)
              this.loading = false // 加载状态结束
            }
            if (this.billInfo.length >= this.totalRecord) {
              this.finished = true // 数据全部加载完成
            }
            return
          }
          alert(res)
        })
      },
      onClearFilterValue () {
        this.filterItems.forEach(value => {
          value.value = ''
        })
      },
      onOpenBill (thisBill) {
        this.$router.push({
          name: thisBill.form_name,
          params: {
            id: thisBill.form_id,
          },
          query: {
            isCreate: false,  // 非新建
            t: +new Date()
          }
        })
      },
      onOpenFilter () {
        this.$store.commit('TOGGLE_FILTER')
      }
    }
  }
</script>

<style scoped lang="less">
  @height: 0.6rem; // top-bar高度
  @padding: 0.2rem;
  #workspace {
    background-color: #ccc;
    min-height: 100%;
    .top-bar {
      top: 0.8rem;
      width: 100%;
      height: @height;
      position: fixed;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      padding: 0 @padding;
      align-items: center;
      z-index: 1000;
    }

    .bills-wrap {
      margin-top: @height + 0.9rem;
      padding: 0 @padding;

      .bills-item {
        margin: 0.11rem 0;
        padding: 0.08rem 0;
        border-radius: 0.08rem;
        background-color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .state {
          margin-left: 0.18rem;
        }

        .container-second {
          width: 60%;

          &-info {
            span {
              display: block;
            }
          }
        }
      }
    }
  }
</style>
