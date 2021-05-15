import { LOAD_MAIN_LIST } from "@/Constants";
import Vue from "vue";
import VueRouter, { NavigationGuardNext, RouteConfig, Route } from "vue-router";
import Home from "../views/Home.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: function (to: Route, from: Route, next: NavigationGuardNext) {
      store.dispatch(LOAD_MAIN_LIST).then(() => next());
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
