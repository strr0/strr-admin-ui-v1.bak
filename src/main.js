import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import App from './App.vue'

Vue.use(ElementUI);

import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from './utils/api'
import { initMenu } from './utils/menu'
Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if(to.path == '/') {
    next()
  }
  else {
    if(store.state.token) {
      initMenu(router, store)
    }
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
