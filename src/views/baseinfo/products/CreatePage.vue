<template>
<!--    新建、编辑页面-->
  <div id="create-page">
    <van-cell-group>
      <van-field label="货品名称" v-model.trim="thisPro.name"></van-field>
      <van-field label="货品类别" v-model.trim="thisPro.contactor"></van-field>
      <van-cell title="货品品牌">
        <select name="brand_id" id="brand_id" v-model="thisPro.brand_id" @click="getBrands()">
          <option v-if="opts" :value="opt.id" v-for="opt in opts"> {{ opt.name }}</option>
        </select>
      </van-cell>
    </van-cell-group>

    <van-cell-group>
      <van-cell title="积分类型">
        <select name="points_type" id="points_type" v-model="thisPro.points_type">
          <option value="1">按金额</option>
          <option value="2">按数量</option>
        </select>
      </van-cell>
      <van-field label="积分设定" v-model="thisPro.points"></van-field>
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
        thisPro: {},
        opts: []
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
        this.thisPro = this.parentObj
      },
      getBrands() {
        this.$axios({
          url: `/api/brands?action=tree`,
          params: {
            in_use : true,
            name__icontains__or__help_code__icontains: this.thisPro.contactor
          }
        }).then(res => {
          this.opts = res
        })
      },
      onConfirm() {
        this.$axios({
          url: `/api/products/${this.thisPro.id}`,
          method: 'PUT',
          data: JSON.stringify(this.thisPro)
        }).then(res => {
          this.$toast.success('保存成功');
          this.$emit('trigger', this.thisPro)
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
