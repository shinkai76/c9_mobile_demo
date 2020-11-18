<template>
  <div class="ico-slot-wrap">
    <div class="ico">
      <slot name="bill_ico">

      </slot>
    </div>
    <div class="text">
      <slot name="bill_name">
        此处表单名
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'IcoSlot'
  }
</script>

<style scoped lang="less">
.ico-slot-wrap{
  margin-left: 0.2rem;
  width: 1.5rem;
  background: #999;
  text-align: center;
  .ico {
    background:#ccc;;
    width: 100%;
    height: 1.5rem;
    display: block;
  }

}
</style>
