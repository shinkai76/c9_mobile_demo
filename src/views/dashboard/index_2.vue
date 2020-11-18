<template>
  <div id="dashboard">
    <TopBar></TopBar>
    <div id="infos" class="infos-wrap">
      <i class="fa fa-bell-o infos-ico infos-ico_left" aria-hidden="true"></i>
      <span class="infos-title">消息通知</span>
      <i class="fa fa-angle-right infos-ico infos-ico_right" aria-hidden="true" @click="onOpenMsg"></i>
    </div>
    <div class="sections-wrap">
      <section id="bills">
        <label>
          <i class="fa fa-file-text-o label-ico" aria-hidden="true"></i>
          <span>常用表单</span>
        </label>
        <div class="block-wrap block-wrap-bills">
          <div v-for="item in billList">
            <router-link :to="{name: item.name, query: {isCreate: true, t: +new Date()}}">
              <IcoSlot>
                <div slot="bill_name">
                  {{ item.text }}
                </div>
              </IcoSlot>
            </router-link>
          </div>
        </div>
      </section>
      <section id="approval">
        <label>
          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
          <span>审批助手</span>
        </label>
        <div class="block-wrap block-wrap-approval">
          <div v-if="bills.length !== 0" class="bills-info-wrap" @click="onOpenBill(thisBill)">
            <van-row>
              <van-col span="14">{{ thisBill.workflow_action_name }}</van-col>
              <van-col span="10">{{ thisBill.form_created_at }}</van-col>
            </van-row>
            <van-row class="bold">
              {{ thisBill._form_name }}&nbsp;{{ thisBill.form_code }}
            </van-row>
            <van-row>
              业务信息：{{ thisBill.form_description }}
            </van-row>
            <van-row>
              开单人：{{ thisBill.form_created_user }}
            </van-row>
            <van-row>
              金额：{{ thisBill.form_total_amount }}
            </van-row>
          </div>
          <div v-else>
            no more
          </div>
          <div class="btn-wrap">
            <button v-if="bills.length !== 0" type="button" class="pass" @click="onPass()">跳过</button>
            <button v-else type="button" class="refresh" @click="getBills()">刷新</button>
            <button type="button" class="confirm" @click="onConfirm()">确认</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import { BILL_NAME } from '@/utils/map.js'

  export default {
    name: 'Dashboard',
    data () {
      return {
        thisBill: {}, // 在审批助手显示的单据
        bills: [],
        limit: 5,
        start: 0,
        totalRecord: 0,
        count: 0, // 表示审批助手现在显示的是bills中的第几单 跳过和确认时都要自增1
        billList: [{
          text: '销售单',
          name: 'sale_order'
        }, {
          text: '费用单',
          name: 'expense'
        }]
      }
    },
    created () {
      this.getBills()
    },
    methods: {
      onOpenBill (thisBill) {
        this.$router.push({
          name: thisBill.form_name,
          params: {
            id: thisBill.form_id
          },
          query: {
            isCreate: false,  // 非新建
            t: +new Date()
          }
        })
      },
      onPass () {
        this.count += 1
        if (this.count + 1 > this.bills.length) {
          this.start += this.limit
          this.getBills(this.start)
          return
        }
        this.thisBill = this.bills[this.count]
        this.thisBill._form_name = BILL_NAME.get(this.thisBill.form_code.split('-')[0])
      },
      onConfirm () {
        if (this.bills.length === 0) return
        this.$axios({
          url: `/api/workflow_current_actions/${ this.thisBill.workflow_current_action_id }?action=execute_workflow`,
          method: 'POST',
          data: {
            form_name: this.thisBill.form_name,
            form_id: this.thisBill.form_id,
            workflow_action_id: this.thisBill.workflow_action_id,
            result: JSON.stringify({ 'memo': '', 'cancel': false })
          }
        }).then(() => {
          this.$toast('确认成功')
          this.onPass() // 显示下一张
        })
      },
      getBills (start = 0) {
        let params = {
          action: 'my_forms_ex',
          start: start,
          limit: this.limit
        }
        this.$axios({
          url: '/api/common',
          params: params
        }).then(res => {
          if (res.success) {
            this.totalRecord = res.total
            this.count = 0
            this.bills = res.root
            if (res.root.length) {
              this.thisBill = res.root[0]
              this.thisBill._form_name = BILL_NAME.get(res.root[0].form_code.split('-')[0])
            }
            return
          }
          alert(res)
        })
      },
      onOpenMsg () {
        this.$router.push('msg')
      }
    }
  }
</script>

<style scoped lang="less">
  @height: 0.6rem; // top-bar高度
  @padding: 0.2rem;
  #dashboard {
    height: 100%;
    background: #ccc;

    & > section {
      background: transparent;
      margin: 0.2rem;
    }

    .infos {
      &-wrap {
        background: #fff;
        height: @height;
        line-height: @height;
        width: 100%;
        position: fixed;
        top: 0.8rem;
        z-index: 1000;
      }

      &-ico {
        position: absolute;
        line-height: @height;

        &_left {
          left: 0.3rem;
        }

        &_right {
          right: 0.3rem;
        }
      }

      &-title {
        display: inline-block;
        margin-left: @height;
      }

    }

    .sections-wrap {
      margin-top: @height + 0.8rem;
      padding: 0 @padding;
    }

    .block-wrap {
      padding: 0.2rem 0;
      border-radius: 10px;
      background: #fff;
      display: flex;
      flex-direction: row; // 横向排列子元素
      flex-wrap: nowrap; // 子元素不换行
      justify-content: flex-start;
      position: relative;
      width: 100%;

      &-approval {
        height: 3.6rem;
        display: block;
        padding: @padding;

        .btn-wrap {
          position: absolute;
          bottom: 0;
          left: 0;
          display: flex;
          justify-content: space-between;
          width: 100%;

          button {
            border-top: 1px solid #ccc;
            width: 100%;
            height: 0.8rem;

            &.pass, &.refresh {
              border-right: 1px solid #ccc;
              border-radius: 0 0 0 10px;

              &:hover {
                background: #f1f1f1;
              }
            }

            &.confirm {
              border-radius: 0 0 10px 0;
            }
          }
        }
      }

    }
  }
</style>
