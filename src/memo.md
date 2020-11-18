#### 2020年9月15日 17:35:16
当正在对原来的过滤组件FilterTmp.vue组件进行细化。原本设想在FilterTmp中列出所有可能的过滤项，通过文本标记来和v-for循环来确定当前调用哪一种过滤项（select\input\两个input\带搜索功能的Input等等），但是现在看来代码很臃肿后续维护成本很高。因此改变构想，将每一种类型的过滤项都单独抽取取来以子组件的形式引入到FilterTmp中，文本标记就使用对应的组件名称。以开始时间为例，
```
// 需要过滤的父组件
filterItems: [
          {
            text: '开始时间',
            type: 'DatePicker', // 此即过滤项的类型 同时也是所需要的组件的组件名 /components/DatePicker.vue
            value: '',
            key: 'start_date',
          }]

// FilterTmp.vue
    <DatePicker
        v-bind="$props"
        v-if="item.type === 'DatePicker'"
        :data="{item, index}"
    />
```

正在修改的是selectTmp.vue 针对的是不需要请求数据的select，比如发票类型和单据类型。但是有一个问题，是对这类select只使用一个组件还是为发票类型单独创建一个组件SelectInvoiceType，为单据类型再单独创建另一个SelectBillType需要再考虑。

#### 2020年9月17日 17:27:32
决定对每一个过滤项都抽象成一个特定的组件，需要请求返回的仓库和缓存的仓库也设计成两个组件。
金额区间，放弃pc端的设计(select+一或两个的Input)，谢佳敏的想法很好改成类似淘宝价格区间的形式，这样就不需要再选<>=，界面上也只需要固定显示两个输入框。
