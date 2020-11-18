<template>
  <div id="expense">
    <TopBar>费用单</TopBar>
    <div class="order-wrap">
      <van-cell-group>
        <van-cell title="付款方式">
          <select name="payment_type" id="payment_type" v-model="thisBill.payment_type">
            <option value="0">现金</option>
            <option value="1">刷卡</option>
            <option value="2">转账</option>
          </select>
        </van-cell>
        <van-cell title="付款账户" is-link>
          {{ [thisBill.bank_id, 'bank'] | showName }}
          <van-icon slot="right-icon" name="search" class="custom-icon icon-blue"
                    @click="onOpenSearch('银行账户', 'bank')" />
        </van-cell>
        <van-cell title="经办人" required is-link>
          {{ [thisBill.created_employee_id, 'employee'] | showName }}
          <van-icon slot="right-icon" name="search" class="custom-icon icon-blue"
                    @click="onOpenSearch('员工', 'employee', 'created_employee_id')" />
        </van-cell>
        <van-cell title="经办部门" required is-link>
          {{ [thisBill.created_department_id, 'department'] | showName}}
          <van-icon slot="right-icon" name="search" class="custom-icon icon-blue"
                    @click="onOpenSearch('部门', 'department', 'created_department_id')" />
        </van-cell>
      </van-cell-group>

      <van-cell-group>
        <van-cell title="费用明细">
          合计
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
                    {{ [line.income_expense_type_id, 'income_expense_type'] | showName }}
                  </div>
                  <div>
                    <van-icon name="delete" class="btn-delete" @click="onDeleteLine(index)" />
                  </div>
                </div>

                <van-cell-group>
                  <van-field
                    label="¥"
                    v-model="line.amount"
                    clearable />
                </van-cell-group>
              </div>
            </div>
            <!--不论是否已经添加 都显示-->
            <div @click="onOpenSearch('收支类别', 'income_expense_type')"
                 class="add-products">
              <van-icon name="add-o" />
              <span>添加收支类别</span>
            </div>
          </div>
          <!--非新建-->
          <div v-if="!$route.query.isCreate" class="pros-wrap">
            <div v-if="!thisLines.length" class="center">未添加收支类别</div>
            <div v-else v-for="line in thisLines" class="pro-block">
              <div class="pro-block_up">
                <div class="pro-name">
                  {{ [line.income_expense_type_id, 'income_expense_type'] | showName }}
                </div>
                <div>
                  <van-icon name="delete" class="btn-delete" @click="onDeleteLine()" />
                </div>
              </div>

              <div class="pro-block_bottom">
                <div class="amount t-right single">{{ line.amount | roundUp }}</div>
              </div>
            </div>
          </div>
        </van-cell>
      </van-cell-group>

      <van-cell-group>
        <van-cell title="所处位置">{{ thisBill.workflow_action_name }}</van-cell>
        <van-cell title="单号">{{ thisBill.code }}</van-cell>
        <van-cell title="核算员工" required is-link>
          {{ [thisBill.employee_id, 'employee'] | showName}}
          <van-icon slot="right-icon" name="search" class="custom-icon icon-blue"
                    @click="onOpenSearch('员工', 'employee')" />
        </van-cell>
        <van-cell title="核算部门" required is-link>
          {{ [thisBill.department_id, 'department'] | showName}}
          <van-icon slot="right-icon" name="search" class="custom-icon icon-blue"
                    @click="onOpenSearch('部门', 'department')" />
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
        <van-cell-group>
          <van-field
            label="备注"
            type="textarea"
            rows="1"
            autosize
            v-model="thisBill.memo"
            clearable />
        </van-cell-group>
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
    <Search v-if="isSearch" :parentObj="parentObj"></Search>
  </div>
</template>

<script>
  import mixins_bill from '@/mixins/bill'

  export default {
    name: 'index',
    data () {
      return {
        bill_type: ''
      }
    },
    mixins: [mixins_bill],
    watch: {
      thisLines: {
        handler (n, o) {
          let amount = 0
          for ( let i = 0, len = n.length; i < len; i++ ) {
            amount += Number(n[i].amount) || 0
          }
          this.total_amount = amount
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      this.thisBill.payment_type = 0
    },
    methods: {
      async onSave() {
        try {
          let bill = JSON.parse(JSON.stringify(this.thisBill))
          bill.expense_lines = this.thisLines
          const result = await this.$axios({
            url: `/api/expenses`,
            method: 'POST',
            data: bill
          })
          await this.$axios({
            url: `/api/expenses/${result.id}?action=confirm`,
            params: {
              action_type: 1
            }
          })
          this.$toast.success('费用单保存成功')
          setTimeout( this.$toast.clear, 1500)
        }catch ( e ) {
          this.$dialog.alert({
            message: e
          });
        }

      },
      setSearchedResult () { // 选中搜索结果后
        let item = this.$store.state.selected_item
        if (this.parentObj.value === 'income_expense_type') {
          let data = {
            income_expense_type_name: item.name,
            income_expense_type_id: item.id,
            subject_id: item.subject_id
          }
          this.thisLines.push(data)
          return
        }
        this.thisBill[this.keyName] = item.id
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../../css/bill';

  #expense {
    background-color: #f1f1f1;
  }
</style>
