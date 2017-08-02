import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import config from 'config'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import mixin from './mixin/index'
import Vuex from 'vuex'
import store from './vuex/store'
Vue.config.productionTip = false
axios.defaults.baseURL = config.baseURL
axios.defaults.withCredentials = true
Vue.use(iView)
Vue.use(Vuex)
Vue.mixin(mixin)
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  if (to.path !== '/Login' && !localStorage.userId) {
    next('/Login')
  } else {
    if (localStorage.userId) {
      store.dispatch('listenMessageEnd')
      store.dispatch('listenWarningMessage')
      store.dispatch('initDevice')
    }
    next()
  }
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  store,
  components: { App }
})

