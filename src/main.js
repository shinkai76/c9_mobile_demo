import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import axios from 'axios'
import './components/register.js'
import * as filters from './filters'
import router from './router/index.js'
import store from './stores/store'
import 'font-awesome/css/font-awesome.min.css'
import { getToken } from './utils/auth'
import '@/css/resetVant.less' // 重置vant样式

Vue.use(Vant)
// 绑定到全局
Vue.prototype.$axios = axios

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
const Vm = new Vue({
  router,
  store,
  mounted () {
    this.interceptors()
  },
  methods: {
    interceptors () {
      this.$axios.interceptors.request.use(
        config => {
          this.$toast.loading({
            mask: true,
            message: '正在加载...'
          })
          if (getToken()) {
            config.headers['Token'] = getToken()
          }
          return config
        },
        error => {
          return Promise.reject(error)
        }
      )
      this.$axios.interceptors.response.use(
        response => {
          this.$toast.clear()
          return response.data
        },
        error => {
          this.$toast.clear()
          this.$dialog.alert({
            message: error.response.data
          });
          return Promise.reject(error.response.data)
        }
      )
    }
  },
  render: h => h(App)
}).$mount('#app')
