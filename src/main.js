// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAplayer from "vue-aplayer";
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.config.productionTip = false

Vue.use(VueAplayer)
Vue.use(Vant)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
