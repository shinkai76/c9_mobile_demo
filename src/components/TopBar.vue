<template>
  <div>
    <div id="Header" class="header-wrap">
      <i class="fa fa-home header-ico header-ico_left" aria-hidden="true" @click="back" ></i>
      <slot>C8ERP</slot>
      <i class="fa fa-sign-out header-ico header-ico_right" aria-hidden="true" @click="logout"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Header',
    methods: {
        logout () {
            this.$dialog.confirm({
                title: '登出',
                message: '确认退出C8ERP'
            }).then(() => {
                this.$store.dispatch('ClearLogInfo')
                this.$router.replace('/login')
            })
        },
        back(){
            this.$router.replace('/dashboard')
            this.$store.commit('CLOSE_FILTER')
        }
    },
  }
</script>

<style scoped lang="less">
  @height: 0.8rem;
  @padding: 0.3rem;
  .header-wrap {
    position: fixed;
    height: @height;
    width: 100%;
    top: 0;
    line-height: @height;
    background-color: #fff;
    font-size: 0.4rem;
    text-align: center;
    border-bottom: 1px solid #ccc;
    z-index: 50000;
    .header-text {
      text-align: center;
    }

    .header-ico {
      line-height: @height;
      position: absolute;

      &_left {
        left: @padding;
      }

      &_right {
        right: @padding;
      }
    }
  }
</style>
