<template>
    <van-cell title="金额区间" @click="show = true">
        <input
            placeholder="最低金额"
            type="text"
            v-model="low"
        />
        <input
            placeholder="最高金额"
            type="text"
            v-model="high"
        />
    </van-cell>
</template>

<script>
export default {
    name: "SelectAmount",
    props: {
        data: Object,
        filterItems: Array
    },
    data() {
        return {
            selectVal: '>',
            low: undefined,
            high: undefined,
            options: [{
                val: '>',
                name: '>'
            }, {
                val: '>=',
                name: '>='
            }, {
                val: '=',
                name: '='
            }, {
                val: '<=',
                name: '<='
            }, {
                val: '<',
                name: '<'
            }, {
                val: 'between',
                name: '之间'
            }]
        }
    },
    methods: {
        onSelect(item) {
            this.show = false;
            console.log(item)
        },
    }
}
</script>

<style scoped>

</style>
