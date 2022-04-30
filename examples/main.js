import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入组件库
import SnakerFlowDesigner from '../packages/index'
Vue.config.productionTip = false
Vue.use(ElementUI)
// 注册组件库
Vue.use(SnakerFlowDesigner)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
