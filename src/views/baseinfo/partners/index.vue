<template>
  <div id="patners" class="baseinfo-wrap">
    <TopBar>商业伙伴</TopBar>
    <div class="top-bar-filter">
      <button type="button" @click="$store.commit('TOGGLE_FILTER')">
        <i class="fa fa-filter" aria-hidden="true"></i>
        过滤
      </button>
      <span class="top-bar-record">共{{ totalRecord }}条记录</span>
    </div>
    <div class="baseinfo-table">
      <ul v-if="tableDataList.length">
        <li class="item-wrap tbody-wrap" v-for="(item, index) in tableDataList" @click="onOpenActions(item, index)">
          <div class="item_up"><span>Id：{{ item.id }}</span>&nbsp;&nbsp;&nbsp;<span>{{ item.name }}</span></div>
          <div class="item_down">
            <span>联系人：{{ item.contactor }}</span>
            <span>电话：{{ item.mobile_phone || item.phone }}</span>
          </div>
        </li>
      </ul>
      <div v-else>无数据</div>
      <div v-if="!finished" @click="onClickMore()" class="more t-center">点击查看更多</div>
    </div>
    <FilterTmp :filter-items="filterItems"></FilterTmp>
    <van-actionsheet
      v-model="show_actionsheet"
      :actions="actions"
      cancel-text="取消"
      @select="onActionsheetSelect"
      @cancel="onActionsheetCancel"
    />
    <van-popup v-model="showCreatePage" position="right" :overlay="false" class="full-screen">
      <CreatePage :parentObj="parentObj" @trigger="updated"></CreatePage>
    </van-popup>
  </div>
</template>

<script>
  import CreatePage from './CreatePage'
  export default {
    name: 'index',
    data () {
      return {
        totalRecord: 0,
        start: 0,
        limit: 30,
        finished: false,
        tableDataList: [],
        filterItems: [{
          text: '名称',
          type: 'InputTmp',
          value: '',
          key: 'name'
          }, {
            text: '联系人',
            type: 'InputTmp',
            value: '',
            key: 'contactor'
          }, {
            text: '手机',
            type: 'InputTmp',
            value: '',
            key: 'mobile_phone'
          }
        ],
        show_actionsheet: false,
        actions: [
          {
            name: '编辑'
          },
          {
            name: '删除',
            className: 'delete-red'
          }
        ],
        clickedItem: '',
        clickedIndex: '', // 选中的是tableDataList的第几个
        showCreatePage: false,
        parentObj: {}
      }
    },
    components: {
      CreatePage
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.getTableData()
      },
      updated(thisPartner) {
        Object.assign(this.tableDataList[this.clickedIndex], thisPartner)
        this.showCreatePage = false
      },
      onFilterConfirm () {
        let filter_params = {}
        this.filterItems.forEach(val => {
          filter_params[val.key] = val.value
        })
        this.getTableData(0, this.limit, filter_params)
        this.onOpenFilter()
      },
      getTableData (start = 0, end = this.limit, extraParams = {}) {
        let params = {
          sort: JSON.stringify([{ 'property': 'id', 'direction': 'DESC' }]),
          context: 'form_create',
          start: start,
          limit: this.limit
        }
        params = Object.assign({}, extraParams, params)
        this.$axios({
          url: `/api/partners`,
          params
        }).then(res => {
          if (res.success && res.root.length) {
            this.totalRecord = res.total
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
      },
      onClearFilterValue () {
        this.filterItems.forEach(value => {
          value.value = ''
        })
      },
      onOpenFilter () {
        this.$store.commit('TOGGLE_FILTER')
      },
      onDelete() {
        this.$axios({
          url: `/api/partners`,
          method: 'DELETE'
        }).then(() => {
          this.$toast.success('删除成功');
        }).catch(() => {
          this.$toast.fail('删除失败');
        })
      },
      onOpenActions(item, index) {
        this.clickedItem = item
        this.clickedIndex = index
        this.show_actionsheet = true;
      },
      onActionsheetSelect(action_item) {
        if (action_item.name == '编辑') {
          this.showCreatePage = true
          this.parentObj = this.clickedItem
          this.onActionsheetCancel()
        }else {
          this.$dialog.confirm({
            title: '是否删除',
            message: this.clickedItem.name
          }).then(() => {
            this.onDelete()
          }).catch(() => {
          });
          this.onActionsheetCancel()
        }
      },
      onActionsheetCancel() {
        this.show_actionsheet = false
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../../css/baseinfo";
  .full-screen {
    width: 100%;
    height: 100%;
  }
</style>
