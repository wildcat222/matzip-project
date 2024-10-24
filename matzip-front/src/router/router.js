import HomeView from "@/views/home/HomeView.vue"

import { createRouter, createWebHistory } from "vue-router";

const route = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: HomeView },
        { path: "/revuew", component: () => import("@/views/review/Review.vue") },
        { path: "/review/detail", component: () => import("@/views/review/Detail.vue") },
        { path: "/user/:userSeq", component: () => import("@/views/user/UserProfileView.vue")
            , meta: { requiresAuth: true } },
    ]
});

export default route;
