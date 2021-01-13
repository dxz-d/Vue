import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

// 设置反向代理，前端请求默认发送到http://localhost:8443/api
var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8095/api'
// 通过axios主动开启withCredentials功能
axios.defaults.withCredentials = true
// 全局注册，之后可在其他组件中通过this.$axios 发送数据
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user) {
      axios.get('/authentication').then(resp => {
        if (resp) next()
      })
    }else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  }else {
    next()
  }
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
})
