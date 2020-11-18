<template>
    <div>
        <van-cell
            :title="data.item.text"
            @click="onOpenDataPick(data.item.key)"
        >
            {{ data.item.value }}
        </van-cell>
        <van-popup v-model="isDatePickerShow" position="bottom" :overlay="true">
            <van-datetime-picker
                v-model="currentDate"
                type="date"
                :min-date="minDate"
                :formatter="formatter"
                @confirm="onDateConfirm"
                @cancel="onDateCancel"
            />
        </van-popup>
    </div>
</template>

<script>
import { FormatDate } from 'utils/app'

export default {
    name: 'DatePicker',
    data () {
        return {
            minDate: new Date(),
            currentDate: new Date(),
            isDatePickerShow: false,
        }
    },
    props: {
        data: Object,
        filterItems: Array
    },
    methods: {
        formatter (type, value) {
            if ( type === 'year' ) {
                return `${value}年`
            } else if ( type === 'month' ) {
                return `${value}月`
            } else if ( type === 'day' ) {
                return `${value}日`
            }
            return value
        },
        onOpenDataPick (val) {
            this.isDatePickerShow = true
        },
        onDateCancel () {
            this.currentDate = new Date() // 重置再次打开的默认时间为今天
            this.isDatePickerShow = false
        },
        onDateConfirm (value) {
            let time = FormatDate(value)
            this.filterItems[this.data.index].value = time
            this.onDateCancel()
        }

    }
}
</script>

<style scoped>

</style>
