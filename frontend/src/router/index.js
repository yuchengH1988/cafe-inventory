import Vue from 'vue'
import Router from 'vue-router'
import store from './../store'
import NotFound from '../views/NotFound.vue'
import SignIn from '../views/Signin.vue'
import Records from '../views/Records.vue'


Vue.use(Router)

const authorizeIsAdmin = (to, from, next) => {
  const currentUser = store.state.currentUser
  if (currentUser && !currentUser.isAdmin) {
    next('/404')
    return
  }
  next()
}


const router = new Router({
  linkExactActiveClass: 'active',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/signin'

    },
    {
      path: '/signin',
      name: 'sign-in',
      component: SignIn
    },
    {
      path: '/records',
      name: 'records',
      component: Records,
    },
    {
      path: '/charts',
      name: 'charts',
      component: () => import('../views/Charts.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/User.vue'),
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound,
    },
    {
      path: '/admin/users/list',
      name: 'admin-users',
      component: () => import('../views/AdminUsers.vue'),
      beforeEnter: authorizeIsAdmin
    },
    {
      path: '/admin/users/new',
      name: 'admin-users-new',
      component: () => import('../views/AdminNewUser.vue'),
      beforeEnter: authorizeIsAdmin
    },
    {
      path: '/admin/data',
      name: 'admin-data',
      component: () => import('../views/AdminData.vue'),
      beforeEnter: authorizeIsAdmin
    },
    {
      path: '/admin/data/ingredients',
      name: 'admin-ingredients',
      component: () => import('../views/AdminIngredients.vue'),
      beforeEnter: authorizeIsAdmin
    },
    {
      path: '/admin/data/products',
      name: 'admin-products',
      component: () => import('../views/AdminProducts.vue'),
      beforeEnter: authorizeIsAdmin
    },
    {
      path: '/admin/data/composition',
      name: 'admin-composition',
      component: () => import('../views/AdminComposition.vue'),
      beforeEnter: authorizeIsAdmin
    }
  ]
})
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const tokenInStore = store.state.token
  let isAuthenticated = store.state.isAuthenticated

  if (token && token !== tokenInStore) {
    isAuthenticated = await store.dispatch('fetchCurrentUser')
  }

  if (!isAuthenticated && to.name !== 'sign-in') {
    next('/signin')
    return
  }
  if (isAuthenticated && to.name === 'sign-in') {
    next('/records')
    return
  }

  next()
})

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || "HireHim - Cafe";
  });
});

export default router