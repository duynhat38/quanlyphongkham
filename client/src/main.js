// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/main.css'
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
window.toastr = require('toastr')
Vue.use(VueToastr2)
import vueHeadful from 'vue-headful';
Vue.component('vue-headful', vueHeadful);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
})