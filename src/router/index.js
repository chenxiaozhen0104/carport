import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login'
import Equipment from '../components/equipment'
import Inout from '../components/inout'
import System from '../components/system'
import Recode from '../components/recode'
import User from '../components/user'
import Area from '../components/area'
import Video from '../components/video'
Vue.use(Router)
export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/equipment', component: Equipment },
    { path: '/inout', component: Inout },
    { path: '/system', component: System },
    { path: '/recode', component: Recode },
    { path: '/area', component: Area },
    { path: '/video', component: Video },
    { path: '/user', component: User }
  ]
})