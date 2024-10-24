import HomeView from "@/views/home/HomeView.vue"

import { createRouter, createWebHistory } from "vue-router";

const route = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: HomeView },
        { path: "/review", component: () => import("@/views/review/Review.vue") },
        { path: "/review/detail", component: () => import("@/views/review/Detail.vue") },
        { path: "/post/create", component: () => import("@/views/post/PostCreate.vue")},
    ]
});

export default route;
