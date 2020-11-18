<template>
    <div>
        <van-cell title="仓库" @click="show = true">
            {{ data.item.name }}
        </van-cell>
        <van-action-sheet v-model="show" :actions="stores" @select="onSelect" />
    </div>
</template>

<script>
import Cache from 'utils/cache'

export default {
    name: 'SelectStore',
    props: {
        data: Object,
        filterItems: Array
    },
    data(){
        return {
            show: false,
            stores: []
        }
    },
    created () {
        this.stores = Cache.Get('store')
    },
    methods: {
        onSelect(item) {
            this.show = false;
            this.filterItems[this.data.index].value = item.id
            this.filterItems[this.data.index].name = item.name
        },
    }
}
</script>

<style scoped>

</style>
