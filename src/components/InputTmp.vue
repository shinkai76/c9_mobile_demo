<template>
    <van-field
        :label="data.text"
        v-model="data.value"
        clearable />
</template>

<script>
export default {
    name: 'InputTmp',
    props: {
      data: Object
    },
    data(){
        return {}
    }
}
</script>

<style scoped>

</style>
