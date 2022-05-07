import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/HelloWorld.vue";

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: Home
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})