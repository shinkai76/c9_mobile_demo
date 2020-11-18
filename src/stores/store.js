import Vue from 'vue'
import Vuex from 'vuex'
// import app from './modules/app'
// import user from './modules/user'
// import getters from './getters'
import { removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // app,
    // user
  },
  // getters,
  state: {
    token: '',
    isFilter: false,
    selected_item:{},
    action: '',
    report_top_id: ''
  },
  mutations: {
    TOGGLE_FILTER: state => {
      state.isFilter = !state.isFilter
    },
    CLOSE_FILTER: state => {
      state.isFilter = false
    },
    CLEAR_LOGIN: state => {
      removeToken()
      window.sessionStorage.setItem('isLogin', false)
      window.sessionStorage.removeItem('loginInfo')
      window.localStorage.removeItem('Cache')
    },
    SELECT_ITEM: (state, item, itemName) => {
      state.selected_item = item
    },
    ACTION: (state, action) => {
      state.action  = action
    },
    REPORT_TOP_ID:  (state, report_top_id) => {
      state.report_top_id  = report_top_id
    },
  },
  actions: {
    ClearLogInfo ({ commit }) {
      commit('CLEAR_LOGIN')
    }
  }
})

export default store
