import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/home/HomeView.vue"

const routes = [
    { path: "/", component: HomeView },
    { path: "/post/create", component: () => import("@/views/post/PostCreate.vue")},
    { path: "/review", component: () => import("@/views/review/Review.vue") },
    { path: "/review/detail", component: () => import("@/views/review/Detail.vue") },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
