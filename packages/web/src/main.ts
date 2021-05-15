import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";
import VueAxios from "vue-axios";
import axios from "axios";
import { baseDomain } from "./Constants";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
Vue.axios.defaults.baseURL = baseDomain;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App)
}).$mount("#app");
