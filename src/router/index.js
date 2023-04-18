import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/index'
import Home from '../views/home/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/other/404')
  }
]

const router = new VueRouter({
  routes
})

export default router
