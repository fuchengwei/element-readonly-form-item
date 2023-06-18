import Vue from 'vue'
import ElementUI from 'element-ui'
import ReadonlyFormItem from '../src/index'
import App from './App.vue'

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI, { size: 'small' })
Vue.use(ReadonlyFormItem, { emptyText: '-' })

new Vue(App).$mount('#app')
