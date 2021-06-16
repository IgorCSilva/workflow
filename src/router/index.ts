import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../pages/Home.vue'

Vue.use(VueRouter)

const Show = () => import('@/pages/Show.vue')
const VueDraggableNext = () => import('../pages/VueDraggableNext.vue')
const RegisterFunctions = () => import('../pages/RegisterFunctions.vue')
const SignUp = () => import('../pages/SignUp.vue')
const ThankYouPage = () => import('../pages/ThankYouPage.vue')

const routes: Array<RouteConfig> = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/manage-sequence',
    name: 'manage-sequence',
    component: VueDraggableNext
  },
  {
    path: '/register-functions',
    name: 'register-functions',
    component: RegisterFunctions
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUp
  },
  {
    path: '/thank-you-page',
    name: 'thank_you_page',
    component: ThankYouPage
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/About.vue')
  },
  {path: '/show', name: 'Show', component: Show, meta: {layout: 'minimal'}}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
