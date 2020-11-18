<template>
  <div id="sale_order">
    <TopBar>销售单</TopBar>
    <div class="order-wrap">
      <van-cell-group>
        <van-cell title="商业伙伴" required is-link>
          {{ [thisBill.partner_id, 'partner'] | showName }}
          <van-icon slot="right-icon" name="search" class="custom-icon icon-blue"
                    @click="onOpenSearch('商业伙伴', 'partner')" />
        </van-cell>
        <van-cell title="员工" required is-link>
          {{ [thisBill.employee_id, 'employee'] | showName }}
          <van-icon slot="right-icon" name="search" class="custom-icon icon-blue"
                    @click="onOpenSearch('员工', 'employee')" />
        </van-cell>
        <van-cell title="部门" required is-link>
          {{ [thisBill.department_id, 'department'] | showName }}
          <van-icon slot="right-icon" name="search" class="custom-icon icon-blue"
                    @click="onOpenSearch('部门', 'department')" />
        </van-cell>
        <van-cell title="仓库" required is-link
                  @click="onOpenSearch('仓库', 'store')">
          {{ [thisBill.store_id, 'store'] | showName}}
          <van-icon slot="right-icon" name="search" class="custom-icon icon-blue" />
        </van-cell>
      </van-cell-group>

      <van-cell-group>
        <van-cell title="商品明细">
          合计{{ total_quantity }}
          <span v-if="$route.query.isCreate">¥{{ total_amount | roundUp }}</span>
          <span v-else>¥{{ thisBill.total_amount | roundUp }}</span>
        </van-cell>
        <van-cell>
          <!--单据新建-->
          <div v-if="$route.query.isCreate">
            <div class="pros-wrap">
              <div v-if="thisLines.length" v-for="(line, index) in thisLines" class="pro-block">
                <div class="pro-block_up">
                  <div class="pro-name">
                    {{ line.product_name }}
                  </div>
                  <div>
                    <van-icon name="delete" class="btn-delete" @click="onDeleteLine(index)" />
                  </div>
                </div>

                <div class="pro-block_bottom">
                  <div class="batch_code">{{ [line.batch_code_id, 'batch_code'] | showName }}</div>
                  <van-stepper v-model="line.quantity" :integer="integer" />
                  <div class="price t-right">{{ line.tax_price | roundUp }}</div>
                  <div class="amount t-right">{{ line.tax_price * line.quantity | roundUp }}</div>
                </div>
              </div>
            </div>
            <!--不论是否已经添加货品 都显示-->
            <div @click="onOpenSearch('商品', 'product')"
                 class="add-products">
              <van-icon name="add-o" />
              <span>添加货品</span>
            </div>
          </div>
          <!--单据非新建-->
          <div v-if="!$route.query.isCreate" class="pros-wrap">
            <div v-if="!thisLines.length" class="center">未添加商品</div>
            <div v-else v-for="line in thisLines" class="pro-block">
              <div class="pro-block_up">
                <div class="pro-name">
                  {{ line.product_name }}
                </div>
                <div>
                  <van-icon name="delete" class="btn-delete" @click="onDeleteLine()" />
                </div>
              </div>

              <div class="pro-block_bottom">
                <div class="batch_code">{{ [line.batch_code_id, 'batch_code'] | showName }}</div>
                <van-stepper v-model="line.quantity" :integer="integer" />
                <div class="price t-right">{{ line.tax_price | roundUp }}</div>
                <div class="amount t-right">{{ line.amount | roundUp }}</div>
              </div>
            </div>
          </div>
        </van-cell>
      </van-cell-group>

      <van-cell-group>
        <van-cell title="所处位置">{{ thisBill.workflow_action_name }}</van-cell>
        <van-cell title="单号">{{ thisBill.code }}</van-cell>
        <van-cell v-if="!$route.query.isCreate" title="收款日">
          {{ thisBill.account_period }}
        </van-cell>
        <van-cell v-else title="收款日" @click="isDatePickerShow = true">
          {{ thisBill.account_period }}
        </van-cell>
        <van-cell title="发票类型">
          <select name="bill_type" id="bill_type" v-model="thisBill.bill_type">
            <option value="0">收据</option>
            <option value="1">发票</option>
            <option value="2">增值税发票</option>
          </select>
        </van-cell>
      </van-cell-group>

      <van-cell-group>
        <van-field
          label="联系人"
          v-model="thisBill.contactor"
          clearable />
        <van-field
          label="联系电话"
          v-model="thisBill.phone"
          clearable />
        <van-field
          label="手机"
          v-model="thisBill.mobile_phone"
          clearable />
        <van-field
          label="地址"
          v-model="thisBill.shipping_address"
          clearable />
      </van-cell-group>

      <van-cell-group>
        <van-field
          label="备注"
          type="textarea"
          rows="1"
          autosize
          v-model="thisBill.memo"
          clearable />
      </van-cell-group>
      <div class="btns" v-show="showBtns">
        <!--根据是否新建 分别显示两组按钮-->
        <van-button
          v-if="isCreate"
          type="default"
          @click="onSaveAsDraft()">
          草稿
        </van-button>
        <van-button
          v-if="isCreate"
          type="default"
          class="btn-blue"
          @click="onSave()">
          保存
        </van-button>
        <van-button
          v-if="!isCreate"
          :disabled="isReviewEnable"
          type="default"
          @click="onReviewReject()">
          审核退回
        </van-button>
        <van-button
          v-if="!isCreate"
          type="default"
          class="btn-blue"
          @click="onReviewAllow()">
          审核通过
        </van-button>
      </div>
    </div>
    <van-popup v-model="isDatePickerShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :formatter="formatter"
        @confirm="onDateConfirm"
        @cancel="onDateCancel"
      />
    </van-popup>
    <Search v-if="isSearch" :parentObj="parentObj"></Search>
  </div>
</template>

<script>
  import mixins_bill from '@/mixins/bill'
  import { FormatDate } from '@/utils/app'

  export default {
    name: 'sale_order',
    data () {
      return {
        bill_type: '',
        currentDate: new Date(),
        isDatePickerShow: false
      }
    },
    mixins: [mixins_bill],
    methods: {
      async onSave () {
        let data1 = {
          store_id: this.thisBill.store_id,
          form_name: 'sale_order',
          lines: this.thisLines
        }
        this.$toast.loading({
          mask: true,
          message: '保存中...'
        });
        try {
          await this.$axios({
            url: `/api/oversolds?action=prompt`,
            method: 'POST',
            data: data1
          })
          let bill = JSON.parse(JSON.stringify(this.thisBill))
          bill.sale_order_lines = this.thisLines
          const result = await this.$axios({
            url: `/api/sale_orders`,
            method: 'POST',
            data: bill
          })
          await this.$axios({
            url: `/api/sale_orders/${result.id}?action=confirm`,
            params: {
              action_type: 1
            }
          })
          this.$toast.success('销售单保存成功')
          setTimeout( this.$toast.clear, 1500)
        } catch ( e ) {
          this.$dialog.alert({
            message: e
          });
        }
      },
      onDateConfirm (value) {
        this.thisBill.account_period = FormatDate(value)
        this.onDateCancel()
      },
      formatter (type, value) {
        if (type === 'year') {
          return `${ value }年`
        } else if (type === 'month') {
          return `${ value }月`
        } else if (type === 'day') {
          return `${ value }日`
        }
        return value
      },
      onDateCancel () {
        this.currentDate = new Date() // 重置再次打开的默认时间为今天
        this.isDatePickerShow = false
      }
    },
    watch: {
      thisLines: {
        handler (n, o) {
          let count = 0
          let amount = 0
          for ( let i = 0, len = n.length; i < len; i++ ) {
            count += n[i].quantity
            amount += n[i].quantity * n[i].tax_price
          }
          this.total_quantity = count
          this.total_amount = amount
        },
        immediate: true,
        deep: true
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../../css/bill';

  #sale_order {
    background-color: #f1f1f1;
  }
</style>
