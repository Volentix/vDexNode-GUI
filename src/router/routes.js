const routes = [
  {
    path: '/',
    component: () => import('pages/Index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    component: () => import('pages/Settings.vue')
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
