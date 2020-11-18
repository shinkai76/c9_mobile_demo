<template>
<!--    新建、编辑页面-->
  <div id="create-page">
    <van-cell-group>
      <van-field label="名称" v-model.trim="thisPartner.name"></van-field>
      <van-field label="联系人" v-model.trim="thisPartner.contactor"></van-field>
      <van-field label="手机号" v-model.trim="thisPartner.mobile_phone"></van-field>
    </van-cell-group>

    <van-cell-group>
      <van-field label="信用额度" v-model.trim.number="thisPartner.credit_line"></van-field>
      <van-field label="信用期限" v-model="thisPartner.credit_period"></van-field>
    </van-cell-group>

    <div class="btns">
      <van-button type="default" @click="onClose">取消</van-button>
      <van-button type="default" @click="onConfirm">确认</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CreatePage',
    data() {
      return {
        thisPartner: {}
      }
    },
    props: {
      parentObj: {
        type: Object
      }
    }, // 父组件参数
    created() {
      this.init()
    },
    watch: {
      parentObj (n, o) { //监听路由是否变化
        this.init()
      }
    },
    methods: {
      init() {
        this.thisPartner = this.parentObj
      },
      onConfirm() {
        this.$axios({
          url: `/api/partners/${this.thisPartner.id}`,
          method: 'PUT',
          data: JSON.stringify(this.thisPartner)
        }).then(res => {
          this.$toast.success('保存成功');
          this.$emit('trigger', this.thisPartner)
        }).catch(err => {
          this.$toast.fail('保存失败');
        })
      },
      onClose() {
        this.$emit('trigger')
      }
    }
  }
</script>

<style scoped lang="less">
#create-page {
    margin: 0.8rem 0;
    width: 100%;
}
</style>
