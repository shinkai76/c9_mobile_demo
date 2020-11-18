<template>
    <div id="navPage">
        <TopBar>导航</TopBar>
        {{ userName }} {{ setOfBook }}
        <div class="block" v-for="(value,key) in items" :key="key">
            <div v-if="!value.typeList">
                <van-cell :title="value.text" size="large" is-link @click="toViews(value)" />
            </div>
            <div v-else>
                <van-collapse v-model="activeNames" :accordion="true">
                    <van-collapse-item :title="value.text" :name="value.collapseName">
                        <van-tree-select
                            :items="value.typeList"
                            :active-id.sync="activeId"
                            :main-active-index.sync="activeIndex"
                            @click-item="clickItem"
                        />
                    </van-collapse-item>
                </van-collapse>
            </div>
        </div>
    </div>

</template>

<script>
import { GetUserInfo } from 'utils/app'

export default {
    name: 'index',
    data () {
        return {
            activeNames: [], // 折叠
            userName: '',
            setOfBook: '',
            activeId: -1,
            activeIndex: 0,
            items: [
                {
                    text: '工作台',
                    name: 'workspace'
                }, {
                    text: '管理工作台',
                    name: 'adminworkspace'
                }, {
                    text: '单据',
                    collapseName: 'bills',
                    typeList: [
                        {
                            text: '销售类',
                            children: [
                                {
                                    id: 1, // id，作为匹配选中状态的标识符
                                    text: '销售单',
                                    name: 'sale_order',
                                    isCreate: true
                                }
                            ]
                        },
                        {
                            text: '财务类',
                            children: [
                                {
                                    id: 1,
                                    text: '费用单',
                                    name: 'expense',
                                    isCreate: true
                                }
                            ]
                        }
                    ]
                }, {
                    text: '报表中心',
                    collapseName: 'reports',
                    typeList: [
                        {
                            text: '销售类',
                            children: [
                                {
                                    id: 1,
                                    text: '货品销售报表',
                                    name: 'sale_product'
                                }
                            ]
                        }, {
                            text: '财务类',
                            children: [
                                {
                                    id: 1,
                                    text: '应收应付报表',
                                    name: 'receivable_payable'
                                }
                            ]
                        }
                    ]
                }, {
                    text: '基础资料',
                    collapseName: 'baseInfos',
                    typeList: [
                        {
                            text: '基础信息',
                            children: [
                                {
                                    id: 1,
                                    text: '商业伙伴',
                                    name: 'partner'
                                }, {
                                    id: 2,
                                    text: '商品资料',
                                    name: 'product'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    mounted () {
        this.userName = GetUserInfo('userName')
        this.setOfBook = GetUserInfo('setOfBook')
    },
    methods: {
        clickItem (data) {
            this.toViews(data)
        },
        toViews (item) {
            if ( !item.name ) return
            this.$router.push({
                name: item.name,
                query: {
                    isCreate: item.isCreate || false,
                    t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
                }
            })
        },
    }
}
</script>

<style scoped lang="less">

#navPage {
    margin: 0.8rem 0;
    min-height: 100%;
}
</style>
