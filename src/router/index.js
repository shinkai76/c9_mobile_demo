import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Login = (resolve) => {
  import('views/login/index.vue').then((module) => {
    resolve(module)
  })
}

const Dashboard = (resolve) => {
  import('views/dashboard/index.vue').then((module) => {
    resolve(module)
  })
}

const SaleOrders = (resolve) => {
  import('views/bills/sale_order/index.vue').then((module) => {
    resolve(module)
  })
}

const Expense = (resolve) => {
  import('views/bills/expense/index.vue').then((module) => {
    resolve(module)
  })
}

const Workspace = (resolve) => {
  import('views/workspace/index.vue').then((module) => {
    resolve(module)
  })
}
const Adminworkspace = (resolve) => {
  import('views/adminworkspace/index.vue').then((module) => {
    resolve(module)
  })
}

const SaleProduct = (resolve) => {
  import('views/reports/sale_product/index.vue').then((module) => {
    resolve(module)
  })
}
const ReceivablePayable = (resolve) => {
  import('views/reports/receivable_payable/index.vue').then((module) => {
    resolve(module)
  })
}
const BaseinfoPartners = (resolve) => {
  import('views/baseinfo/partners/index.vue').then((module) => {
    resolve(module)
  })
}
const BaseinfoProducts = (resolve) => {
  import('views/baseinfo/products/index.vue').then((module) => {
    resolve(module)
  })
}

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/sale_orders', // 销售单 这里的path作为请求参数 与api保持单复数一致更方便
      name: 'sale_order', // form_name是单数
      component: SaleOrders
    },
    {
      path: '/expenses', // 费用单
      name: 'expense',
      component: Expense
    },
    {
      path: '/sale_products',
      name: 'sale_product',
      component:  SaleProduct,
      children: [
        {
          path: ':product_id/sale_lines',
          name: 'sale_line',
          component: () => import('views/reports/sale_product/BillTable.vue')
        }
      ]
    },
    {
      path: '/receivable_payables',
      name: 'receivable_payable',
      component:  ReceivablePayable,
      children: [
        {
          path: ':partner_id/receivable_payable_lines',
          name: 'receivable_payable_line',
          component: () => import('views/reports/receivable_payable/BillTable.vue')
        }
      ]
    },
    {
      path: '/msg',
      name: 'msg',
      component: () => import('views/msg/Msg.vue')
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: Workspace
    },
    {
      path: '/adminworkspace',
      name: 'adminworkspace',
      component: Adminworkspace
    },
    {
      path: '/baseinfo/partner',
      name: 'partner',
      component: BaseinfoPartners
    },
    {
      path: '/baseinfo/product',
      name: 'product',
      component: BaseinfoProducts
    },
  ]
})
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  console.log('navigation-guards')
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  let isLogin = sessionStorage.getItem('isLogin')  // 是否登录
  if (isLogin == 'false' || isLogin == null) { // 未登录状态
    if (!whiteList.includes(to.path)) { // 不在白名单
      next({ path: '/login' })
    }
    return next()
  }
  next()
})
export default router
