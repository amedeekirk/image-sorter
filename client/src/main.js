import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueGtag from "vue-gtag";
import VueCookies from "vue-cookies"
import VueRouter from "vue-router"
import routes from './routes';

Vue.config.productionTip = false

Vue.use(VueCookies, { expire: Infinity})

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})

Vue.use(VueGtag, {
  appName: 'sorter-api',
  pageTrackerScreenviewEnabled: true,
  config: { id: "Data Expunged" }
});

new Vue({
  vuetify,
  render: h => h(App),
  router
}).$mount('#app')
