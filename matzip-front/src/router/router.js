import { createRouter, createWebHistory } from "vue-router";
import Main from '@/views/home/HomeView.vue';
import Lists from '@/views/Lists/OtherList.vue';

const routes = [
        {
            path: '/',
            name: 'Home',
            component: Main,
        },
        {
            path: '/list',
            name: 'MatzipList',
            component: Lists,
        },

        { path: "/review", component: () => import("@/views/review/Review.vue") },
        { path: "/review/detail", component: () => import("@/views/review/Detail.vue") }
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
