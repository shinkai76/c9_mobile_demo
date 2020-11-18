import { BILL_TYPE } from '@/utils/map.js'
import { GetUserInfo, FormatDate } from '@/utils/app'

const mixins_bill = { // 单据混入
  data () {
    return {
      integer: true, // 是否整数
      thisBill: {}, // 主表信息
      thisLines: [], // 明细信息
      isCreate: false, // 是否是草稿状态
      isSearch: false, // 是否在搜索页面
      showBtns: true, // 是否显示底部按钮  在搜索时应该隐藏
      isReviewEnable: false, // 审核退回操作是否可用
      total_quantity: 0, // 合计数量
      total_amount: 0, // 总金额
      parentObj: { // 传递给Search的参数
        name: '',
        itemName: '',
        value: ''
      },
      keyName:'',
    }
  },
  created () {
    this.thisBill.bill_type = 0 // 默认为发票
  },
  mounted () {
    this.init()
  },
  watch: {
    '$route' (to, from) { //监听路由是否变化
      Object.assign(this.$data, this.$options.data())
      this.isCreate = this.$route.query.isCreate
    }
  },
  methods: {
    init () {
      this.isCreate = this.$route.query.isCreate
      if (!this.$route.query.isCreate) { // 非新建时 获取单据信息
        this.getThisBill()
      }
    },
    onReviewAllow () {  // 审核通过 （交易审核和铺货审核cancel为null）
      let specialCase = ['铺货审核', '交易价格审核']
      let cancel = specialCase.includes(this.thisBill.workflow_action_name) ? '' : false
      this.onReview(cancel)
    },
    onReviewReject () { // 审核退回
      this.onReview(true)
    },
    onReview (cancel) { // 审核通过或退回
      let data = {
        form_name: this.$route.name,
        form_id: this.thisBill.id,
        workflow_action_id: this.thisBill.workflow_action_id,
        result: JSON.stringify({
          cancel: cancel,
          memo: ''
        })
      }
      this.$axios({
        url: `/api/workflow_current_actions/${ this.thisBill.workflow_current_action_id }?action=execute_workflow`,
        method: 'POST',
        data
      }).then(res => {
        if (res.status === 5) {
          this.$notify({
            message: '退回成功',
            duration: 1000,
            background: '#ccc'
          })
          return
        }
        if (res.status === 4) {
          this.$notify({
            message: '审核成功',
            duration: 1000,
            background: '#ccc'
          })
          this.getThisBill()
        }
      })
    },
    setSearchedResult () { // 选中搜索结果后
      let item = this.$store.state.selected_item
      if (this.value === 'product') {
        let data = {
          product_id: item.id,
          product_name: item.name,
          tax_price: item.p_price || 0, // 税前单价
        }
        this.thisLines.push(data)
        return
      }
      this.thisBill[this.keyName] = item.id
    },
    getThisBill () {
      let route = this.$route
      let url = `/api${ route.path }/${ route.params.id }`
      this.$axios({
        url: url
      }).then(res => {
        this.thisBill = res
        this.isReviewEnable = !+res.workflow_current_action_id
      })
      this.$axios({
        url: `${ url }/${ route.name }_lines`
      }).then(lines => {
        this.thisLines = lines
      })
    },
    onDeleteLine (index) {
      this.thisLines.splice(index, 1)
    },
    onOpenSearch (name, itemName, keyName = itemName + '_id') {
      // name是中文名字 例如银行
      // itemName 例如department bank store 在从缓存中获取数据等地方需要使用
      // keyName 是this.thisBill的属性名 没有传参时默认是+_id 特殊的例如 created_department_id 主要截取_id之前的字符串用于request url等其他地方
      this.keyName = keyName
      this.isSearch = true
      if (keyName.indexOf('_id')) {
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
    },
    onSaveAsDraft () { // 保存成草稿
      let route = this.$route
      let url = `/api${ route.path }`
      let data = JSON.parse(JSON.stringify(this.thisBill))
      let newdata = { // 发送请求前 需要更新的字段
        updated_at: FormatDate(new Date(), 2),
        updated_user: GetUserInfo('userName')
      }
      data = Object.assign({}, data, newdata)
      if (data.id) {
        url = url + `/${ route.params.id }`
      }
      this.$axios({
        url: url,
        method: data.id ? 'PUT' : 'POST',
        data
      }).then(res => {
        console.log(res)
      })
    }
  }
}
export default mixins_bill
