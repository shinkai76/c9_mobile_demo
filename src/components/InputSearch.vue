<template>
    <van-cell
        :title="data.item.text"
        is-link
    >
        {{ [data.item.value, data.item.itemType] | showName }}
        <van-icon
            slot="right-icon"
            name="search"
            class="custom-icon icon-blue"
            @click="onOpenSearch"
        />
    </van-cell>
</template>

<script>

export default {
    name: 'InputSearch',
    props: {
        data: Object
    },
    methods: {
        onOpenSearch () {
            let index = this.data.index
            let text = this.data.item.text
            let itemType = this.data.item.itemType
            this.$emit('onOpenSearch', index, text, itemType)
        }
    }
}
</script>

<style scoped>

</style>
