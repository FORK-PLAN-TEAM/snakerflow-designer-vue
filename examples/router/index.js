import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('../views/Preview.vue')
  },
  {
    path: '/xml',
    name: 'Xml',
    component: () => import('../views/Xml.vue')
  },
  {
    path: '/highLight',
    name: 'HighLight',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/HighLight.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
