<template>
  <div id="search">
    <TopBar>{{ parentObj.name }}查询</TopBar>
    <div class="search-wrap">
      <div class="top-bar">
        <form action="/">
          <van-search
            v-model.trim="searchValue"
            placeholder="请输入搜索关键词"
            show-action
            @search="onSearch"
            @cancel="onCancel"
          />
        </form>
      </div>
      <div class="result-wrap">
        <div v-if="resultList.length">
          <van-row
            v-for="item in resultList"
            class="result-item">
          <span v-if="!isProductSearch" @click="onSelect(item)">
            <span class="blue">{{ item.id }}</span> {{ item.name }}
          </span>
            <div v-else class="result-item-container" @click="onSelect(item)">
              <div class="result-item-name">
                <span class="blue">{{ item.id }}</span> {{ item.name }}
              </div>
              <div class="result-item-row">
                <div>零售价：{{ item.r_price || 0 }}</div>
                <div>当前库存：{{ item.on_hand || 0 }}</div>
              </div>
              <div class="result-item-row">
                <div>批发价：{{ item.p_price || 0 }}</div>
                <div>可卖数量：{{ item.available || 0 }}</div>
              </div>
            </div>
          </van-row>
        </div>
        <div v-else>未搜索到结果</div>
      </div>

      <div v-if="!finished" @click="onClickMore()" class="more t-center">点击查看更多</div>
    </div>
  </div>
</template>

<script>
  import Cache from '@/utils/cache'

  export default {
    name: 'search',
    data () {
      return {
        limit: 50,
        start: 0,
        resultList: [],
        searchValue: '',
        count: 0,
        finished: false,
        isProductSearch: false
      }
    },
    props: {
      parentObj: {
        type: Object
      }
    }, // 父组件参数
    created () {
      this.getList(this.parentObj.value)
      this.isProductSearch = this.parentObj.value === 'product'
    },
    mounted () {
    },
    methods: {
      requestData (name, params) {
        this.$axios({
          url: `/api/${ name }`,
          params
        }).then(res => {
          if (res.success && res.root.length) {
            this.resultList = res.root
          } else {
            this.finished = true
            this.resultList.length = 0
          }
        })
      },
      closeSearch () {
        this.$parent._data.isSearch = false
        this.$parent._data.showBtns = true
      },
      onSelect (item) {
        this.$store.commit('SELECT_ITEM', item)
        this.$parent.setSearchedResult()
        this.closeSearch()
      },
      onSearch () {
        this.$axios({
          url: `/api/${ this.parentObj.value }s`,
          params: {
            name__icontains__or__help_code__icontains__or__id: this.searchValue,
            start: 0,
            limit: this.limit,
            in_use: true,
            context: 'form_create',
            sort: [{ 'property': 'id', 'direction': 'DESC' }]
          }
        }).then(res => {
          if (res.success && res.root.length) {
            this.resultList = res.root
          } else {
            this.resultList.length = 0
          }
          this.finished = res.root.length < this.limit
        })
      },
      onCancel () {
        this.closeSearch()
      },
      getList (value, start = 0, end = 50) {
        let specialCase = ['product', 'income_expense_type']
        let params = {}
        if (specialCase.includes(value)) {
          if (value === 'product') {
            params = {
              action: 'search',
              context: 'form_create',
              start: 0,
              limit: end,
              in_use: true
            }
          }
          if (value === 'income_expense_type') {
            params = {
              start: 0,
              limit: end,
              in_use: true
            }
          }
          this.requestData(value + 's', params)
        } else {
          this.resultList = this.resultList.concat(Cache.Get(this.parentObj.itemName).slice(start, end))
          this.start = end
          if (this.end > Cache.Get(this.parentObj.itemName).length) {
            this.finished = true // 数据全部加载完成
          }
        }
      },
      onClickMore () {
        let end = this.start + this.limit
        this.getList(this.parentObj.value, this.start, end)
      }
    }
  }
</script>

<style scoped lang="less">
  @height: 0.6rem; // top-bar高度
  @padding: 0.2rem;
  #search {
    position: fixed;
    z-index: 2000;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: whitesmoke;
    height: 100%;
    overflow-y: auto;

    .search-wrap {
      margin: 0.8rem 0;
      width: 100%;

      .top-bar {
        top: 0.8rem;
        width: 100%;
        height: @height;
        position: fixed;
        background-color: #fff;
      }

      .result-wrap {
        margin-top: @height + 1.05rem;
        padding: 0 @padding;

        .result-item {
          margin: 0.11rem 0;
          min-height: 0.7rem;
          font-size: 14px;
          border-radius: 0.08rem;
          background-color: #fff;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;

          &-container {
            width: 100%;
            padding: @padding;
          }

          &-name {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

            .blue {
              color: cornflowerblue;
            }
          }

          &-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            div:last-child {
              flex-basis: 3.3rem
            }
          }

          & > span {
            width: 100%;
            padding-left: 20px;
          }
        }

        .more {
          height: 1rem;
          line-height: 0.8rem;
        }
      }
    }
  }

</style>
