import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//路由懒加载
function resolveView(view) {
  return () => import(`@/views/${view}`)
}

const routes = [{
    path: '/',
    name: 'home',
    component: resolveView('Home')
  }, {
    path: '/Register',
    name: 'register',
    component: resolveView('Register')
  },
  {
    path: '/Skill',
    name: 'skill',
    component: resolveView('Skill')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router