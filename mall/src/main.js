// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import store from '@/store'
import router from '@/router'
import {currency} from '@/util/currency'

Vue.config.productionTip = false;
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
});
Vue.use(infiniteScroll);
Vue.filter("currency",currency);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});