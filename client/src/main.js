// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
import VueSwal from 'vue-swal'
Vue.use(VueSwal)
import '@/assets/css/main.css'
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
window.toastr = require('toastr')
Vue.use(VueToastr2)
import vueHeadful from 'vue-headful';
Vue.component('vue-headful', vueHeadful);

import moment from 'moment';
import VueMoment from 'vue-moment';

// Load Locales ('en' comes loaded by default)
require('moment/locale/vi');

// Choose Locale
moment.locale('vi');
Vue.use(VueMoment, { moment });

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
})