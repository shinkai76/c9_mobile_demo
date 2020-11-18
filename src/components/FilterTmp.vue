<template>
    <!--过滤窗口-->
    <div id="Filter" v-show="_isFilter" v-bind="$props">
        <div class="filter-wrap">
            <ul>
                <li v-for="(item,index) in filterItems">
                    <van-cell-group>
                        <!--输入框-->
                        <InputTmp
                            v-if="item.type === 'InputTmp'"
                            :data="item"
                        />
                        <!--输入框 需要搜索功能-->
                        <InputSearch
                            v-if="item.type === 'InputSearch'"
                            :data="{item, index}"
                            @onOpenSearch="onOpenSearch"
                        />
                        <!--输入框 打开商品搜索-->
                        <InputSearchProduct
                            v-if="item.type === 'InputSearchProduct'"
                            :data="{item, index}"
                            @onOpenSearch="onOpenSearch"
                        />
                        <!--下拉框 选择仓库-->
                        <SelectStore v-if="item.type === 'SelectStore'" v-bind="$props" :data="{item, index}" />
                        <!--下拉框 选择金额区间-->
                        <SelectAmount v-if="item.type === 'SelectAmount'" v-bind="$props" :data="{item, index}" />
                        <!--3.日期选择-->
                        <DatePicker
                            v-bind="$props"
                            v-if="item.type === 'DatePicker'"
                            :data="{item, index}"
                        />
                        <!--             以后应该会增加 时间选择器-->
                    </van-cell-group>
                </li>
            </ul>

            <div class="btns" v-if="showBtns">
                <van-button type="default" @click="onCloseFilter">取消</van-button>
                <van-button type="default" @click="onConfirm">确认</van-button>
            </div>
        </div>
        <Search v-if="isSearch" :parentObj="parentObj"></Search>
    </div>
</template>

<script>
import { FormatDate } from '@/utils/app'
import Cache from '@/utils/cache'

export default {
    name: 'Filters',
    data () {
        return {
            isSearch: false,
            showBtns: true,
            parentObj: { // 传递给Search的参数
                name: '',
                itemName: '',
                value: ''
            },
            keyName: '',
            value: '',
            index: ''
        }
    },
    props: {
        filterItems: {
            type: Array
        }
    },
    created () {
        this.minDate = new Date(Cache.Get('userinfo').set_of_book_settings.enabled_at)
    },
    computed: {
        _isFilter () {
            return this.$store.state.isFilter
        }
    },
    methods: {
        onOpenSearch (index, name, itemName, keyName = itemName + '_id') {
            // name是中文名字 例如银行
            // itemName 例如department bank store 在从缓存中获取数据等地方需要使用
            // keyName 是this.thisBill的属性名 没有传参时默认是+_id 特殊的例如 created_department_id 主要截取_id之前的字符串用于request url等其他地方
            this.keyName = keyName
            this.isSearch = true
            if ( keyName.indexOf('_id') ) {
                this.value = (keyName.split('_id'))[0]
            } else {
                this.value = keyName
            }
            this.itemName = itemName
            this.showBtns = false
            this.parentObj = {
                name,
                itemName,
                value: this.value
            }
            this.index = index
        },
        setSearchedResult () {
            let item = this.$store.state.selected_item
            if ( this.value === 'product' ) {
                this.filterItems[this.index].name = item.name
            }
            this.filterItems[this.index].value = item.id
        },
        onConfirm () {
            this.$parent.onFilterConfirm()
        },
        onCloseFilter () {
            Object.assign(this.$data, this.$options.data())
            this.$parent.onClearFilterValue()
            this.$store.commit('TOGGLE_FILTER')
        }
    }
}
</script>

<style scoped lang="less">
#Filter {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1000;

    .filter-wrap {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: #f1f1f1;
        border-radius: 0.08rem;

        & > ul {
            margin-top: 0.8rem;
        }

    }
}

.small {
    width: 30%;
}
</style>
